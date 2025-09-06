from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import PyPDF2
import docx
from io import BytesIO
import os
import json
from dotenv import load_dotenv
from openai import OpenAI
import logging
import re
import asyncio
from typing import Dict, Any, List
from pydantic import BaseModel, ValidationError
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Constants
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_TEXT_LENGTH = 4000
SUPPORTED_FILE_TYPES = {".pdf", ".docx", ".txt"}

# Initialize OpenAI client
openai_client = None

# Pydantic models for structured data
class FeedbackItem(BaseModel):
    text: str
    type: str  # "positive", "warning", "critical"

class CategoryFeedback(BaseModel):
    score: int
    feedback: List[FeedbackItem]

class AnalysisResult(BaseModel):
    match_score: int
    tone_style: CategoryFeedback
    content: CategoryFeedback
    structure: CategoryFeedback
    skills: CategoryFeedback

def initialize_openai_client() -> OpenAI:
    """Initialize and return OpenAI client."""
    global openai_client
    if openai_client is None:
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
            )
        openai_client = OpenAI(api_key=api_key)
    return openai_client

def validate_file_type(filename: str) -> None:
    """Validate if the file type is supported."""
    file_ext = os.path.splitext(filename)[1].lower()
    if file_ext not in SUPPORTED_FILE_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type: {file_ext}. Supported types: {', '.join(SUPPORTED_FILE_TYPES)}"
        )

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file."""
    try:
        pdf_file = BytesIO(file_content)
        reader = PyPDF2.PdfReader(pdf_file)
        text = "".join(page.extract_text() or "" for page in reader.pages)
        return text.strip()
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error reading PDF file: {str(e)}"
        )

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file."""
    try:
        docx_file = BytesIO(file_content)
        doc = docx.Document(docx_file)
        text = "\n".join(para.text for para in doc.paragraphs if para.text.strip())
        return text.strip()
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error reading DOCX file: {str(e)}"
        )

def extract_text_from_txt(file_content: bytes) -> str:
    """Extract text from TXT file."""
    try:
        text = file_content.decode("utf-8")
        return text.strip()
    except UnicodeDecodeError:
        try:
            text = file_content.decode("latin-1")
            return text.strip()
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error reading text file: {str(e)}"
            )

def extract_text_from_file(file: UploadFile, file_content: bytes) -> str:
    """Extract text from uploaded file based on its type."""
    validate_file_type(file.filename)
    
    filename = file.filename.lower()
    try:
        if filename.endswith(".pdf"):
            return extract_text_from_pdf(file_content)
        elif filename.endswith(".docx"):
            return extract_text_from_docx(file_content)
        elif filename.endswith(".txt"):
            return extract_text_from_txt(file_content)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error extracting text from file: {str(e)}"
        )

def truncate_text(text: str, max_length: int = MAX_TEXT_LENGTH) -> str:
    """Truncate text to specified length if needed."""
    if len(text) > max_length:
        return text[:max_length] + "... [truncated]"
    return text

def build_openai_prompt(resume_text: str, job_text: str) -> str:
    """Construct the prompt for OpenAI with explicit JSON formatting instructions."""
    resume_text = truncate_text(resume_text)
    job_text = truncate_text(job_text)
    
    return f"""
ANALYSIS TASK:
You are an expert ATS (Applicant Tracking System) analyst. Analyze the following resume against the job description and provide a comprehensive evaluation with accurate scores.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_text}

EVALUATION CRITERIA:
1. Calculate an overall match score (0-100%) based on how well the resume matches the job requirements
2. Evaluate these specific categories with individual scores (1-100):
   - Tone and style: Does the resume's tone match the company/industry style?
   - Content: How relevant is the experience and education to the job requirements?
   - Structure: Is the resume well-organized, clear, and easy to read?
   - Skills: How well do the skills match the job requirements?

3. For each category, provide:
   - A numerical score based on actual analysis (not examples)
   - A list of feedback items with specific, actionable feedback
   - Each feedback item should be classified as:
     * "positive" - Things done well (✅)
     * "warning" - Areas that need improvement (⚠️)
     * "critical" - Major gaps or issues that need immediate attention (❌)

IMPORTANT INSTRUCTIONS:
- Be brutally honest in your assessment
- Scores should reflect the actual match quality, not just high numbers
- Provide specific examples from the resume and job description
- If there are significant mismatches, score accordingly
- Return ONLY valid JSON in this exact format (do not use example values):

{{
    "match_score": [calculated_score],
    "tone_style": {{
        "score": [calculated_score],
        "feedback": [
            {{"text": "Specific feedback point 1", "type": "positive"}},
            {{"text": "Specific feedback point 2", "type": "warning"}},
            {{"text": "Specific feedback point 3", "type": "critical"}}
        ]
    }},
    "content": {{
        "score": [calculated_score],
        "feedback": [
            {{"text": "Specific feedback point 1", "type": "positive"}},
            {{"text": "Specific feedback point 2", "type": "warning"}}
        ]
    }},
    "structure": {{
        "score": [calculated_score],
        "feedback": [
            {{"text": "Specific feedback point 1", "type": "positive"}},
            {{"text": "Specific feedback point 2", "type": "critical"}}
        ]
    }},
    "skills": {{
        "score": [calculated_score],
        "feedback": [
            {{"text": "Specific feedback point 1", "type": "positive"}},
            {{"text": "Specific feedback point 2", "type": "warning"}}
        ]
    }}
}}

GUIDELINES FOR FEEDBACK:
- Positive feedback (✅): Specific strengths and good matches
- Warning feedback (⚠️): Areas that could be improved but aren't critical
- Critical feedback (❌): Major gaps, missing requirements, or serious issues

ABSOLUTELY DO NOT:
- Use the example values from the format template
- Return identical scores for different analyses
- Make up matches that don't exist
- Be overly generous with scores

BE HONEST AND SPECIFIC. If the resume doesn't match well, give low scores and explain why with specific feedback.
"""

def clean_json_response(text: str) -> str:
    """Clean and extract JSON from potentially malformed response."""
    # Remove markdown code blocks
    text = re.sub(r'```json\s*|\s*```', '', text, flags=re.IGNORECASE)
    
    # Extract JSON content between first { and last }
    start = text.find('{')
    end = text.rfind('}') + 1
    
    if start != -1 and end != 0:
        return text[start:end].strip()
    
    return text.strip()

def validate_analysis_result(result: Dict[str, Any]) -> AnalysisResult:
    """Validate the analysis result structure and score sanity."""
    try:
        # First validate the structure
        analysis_result = AnalysisResult(**result)
        
        # Then validate score ranges
        if not (0 <= analysis_result.match_score <= 100):
            raise ValueError(f"Invalid match_score: {analysis_result.match_score}. Must be between 0-100.")
            
        categories = ["tone_style", "content", "structure", "skills"]
        for category in categories:
            score = getattr(analysis_result, category).score
            if not (0 <= score <= 100):
                raise ValueError(f"Invalid {category} score: {score}. Must be between 0-100.")
            
            # Validate feedback items
            feedback = getattr(analysis_result, category).feedback
            for item in feedback:
                if item.type not in ["positive", "warning", "critical"]:
                    raise ValueError(f"Invalid feedback type: {item.type}. Must be 'positive', 'warning', or 'critical'.")
        
        return analysis_result
        
    except ValidationError as e:
        logger.error(f"Invalid analysis result structure: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Invalid analysis result format from AI: {str(e)}"
        )
    except ValueError as e:
        logger.error(f"Invalid score values: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"AI returned invalid values: {str(e)}"
        )

async def call_openai_api(prompt: str) -> Dict[str, Any]:
    """Call OpenAI API with the given prompt and return the response."""
    client = initialize_openai_client()
    
    try:
        logger.info("Sending request to OpenAI API")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert ATS (Applicant Tracking System) analyst. Your job is to provide accurate, honest assessments of how well resumes match job descriptions. Be specific and detailed in your analysis. Never use example values - always calculate scores based on the actual content provided. Provide actionable feedback with clear classifications (positive/warning/critical)."
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=2000,  # Increased for more detailed feedback
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content.strip()
        logger.info(f"Received response from OpenAI API: {result_text}")

        if not result_text:
            raise HTTPException(status_code=500, detail="AI service returned an empty response")

        # Clean and parse the response
        cleaned_text = clean_json_response(result_text)
        result = json.loads(cleaned_text)
        
        # Validate the response structure
        validated_result = validate_analysis_result(result)
        return validated_result.dict()
            
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response as JSON: {e}")
        logger.error(f"Response content: {cleaned_text}")
        raise HTTPException(
            status_code=500, 
            detail="AI service returned invalid JSON format"
        )
    except Exception as e:
        logger.error(f"AI service error: {e}")
        error_msg = str(e).lower()
        
        if "rate limit" in error_msg:
            raise HTTPException(status_code=429, detail="AI service rate limit exceeded. Please try again later.")
        elif "authentication" in error_msg:
            raise HTTPException(status_code=401, detail="AI service authentication failed. Please check API configuration.")
        elif "quota" in error_msg:
            raise HTTPException(status_code=429, detail="AI service quota exceeded. Please try again later.")
        else:
            raise HTTPException(
                status_code=500, 
                detail=f"AI service error: {str(e)}"
            )

async def save_analysis_result(resume_text: str, job_text: str, result: Dict[str, Any]):
    """Save analysis result (placeholder for future database integration)."""
    try:
        # This is a placeholder for when we add database support
        # For now, just log the analysis
        logger.info(f"Analysis completed: {result['match_score']}% match")
        logger.info(f"Resume length: {len(resume_text)} chars")
        logger.info(f"Job description length: {len(job_text)} chars")
        
    except Exception as e:
        logger.error(f"Error in analysis logging: {e}")

@router.post("/upload-text")
async def compare_resume_with_job(
    resume: UploadFile = File(..., description="Resume file (PDF, DOCX, or TXT)"),
    job_text: str = Form(..., description="Job description text")
):
    """
    Compare a resume file with a job description and return AI-powered analysis.
    
    Returns:
    - Overall match score (0-100%)
    - Detailed scores for tone, content, structure, and skills
    - Specific feedback with visual indicators (✅, ⚠️, ❌)
    """
    try:
        # Validate file size
        file_content = await resume.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB."
            )

        # Reset file pointer for potential re-reading
        await resume.seek(0)

        # Extract text from the file
        resume_text = extract_text_from_file(resume, file_content)
        if not resume_text.strip():
            raise HTTPException(
                status_code=400, 
                detail="Could not extract meaningful text from the uploaded file. Please check if the file is valid and contains text."
            )

        if not job_text.strip():
            raise HTTPException(
                status_code=400, 
                detail="Job description cannot be empty. Please provide the job description text."
            )

        # Build OpenAI prompt and get analysis
        prompt = build_openai_prompt(resume_text, job_text)
        result = await call_openai_api(prompt)
        
        logger.info(f"Analysis completed with {result['match_score']}% overall match")

        # Save results (non-blocking)
        asyncio.create_task(save_analysis_result(resume_text, job_text, result))

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in resume analysis: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Unexpected error during analysis: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "resume-analysis-api"
    }