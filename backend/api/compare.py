from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import PyPDF2
import docx
from openai import OpenAI
import os
import json
from io import BytesIO
from dotenv import load_dotenv

router = APIRouter()

# We'll initialize the client lazily when needed
client = None

def get_openai_client():
    """Initialize and return OpenAI client, loading env vars if needed"""
    global client
    
    if client is None:
        # Load environment variables
        load_dotenv()
        
        # Check if API key is set
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY environment variable is not set")
        
        # Initialize OpenAI client
        client = OpenAI(api_key=api_key)
    
    return client

# @router.post("/upload-text")
# async def compare_resume_with_job(
#     resume: UploadFile = File(...),
#     job_text: str = Form(...)
# ):
#     """
#     Accept a resume file and a pasted job description text.
#     Extract text from the resume, send both to OpenAI, and return match score + overview.
#     """

#     try:
#         # Initialize OpenAI client (this will load .env if not already done)
#         openai_client = get_openai_client()
        
#         # Read the file content once and store it
#         file_content = await resume.read()
        
#         # Step 1: Extract resume text
#         resume_text = ""
        
#         if resume.filename.endswith(".pdf"):
#             # Use BytesIO to create a file-like object from the bytes
#             pdf_file = BytesIO(file_content)
#             reader = PyPDF2.PdfReader(pdf_file)
#             for page in reader.pages:
#                 resume_text += page.extract_text() or ""
                
#         elif resume.filename.endswith(".docx"):
#             # Use BytesIO for docx as well
#             docx_file = BytesIO(file_content)
#             doc = docx.Document(docx_file)
#             for para in doc.paragraphs:
#                 resume_text += para.text + "\n"
                
#         elif resume.filename.endswith(".txt"):
#             resume_text = file_content.decode("utf-8")
            
#         else:
#             raise HTTPException(status_code=400, detail="Unsupported file type")

#         # Step 2: Build OpenAI prompt
#         prompt = f"""
#         Compare the following resume and job description.

#         Resume:
#         {resume_text}

#         Job Description:
#         {job_text}

#         Instructions:
#         - Give a percentage match score (0–100) for how well the resume fits the job.
#         - Provide a short overview highlighting what matches well.
#         - Provide a short overview of what's missing or weak.

#         Respond in JSON with this structure:
#         {{
#             "match_score": <number>,
#             "overview": {{
#                 "matches": "<text>",
#                 "gaps": "<text>"
#             }}
#         }}
#         """

#         # Step 3: Call OpenAI API
#         response = openai_client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0
#         )

#         result_text = response.choices[0].message.content.strip()

#         # Step 4: Parse JSON from OpenAI
#         try:
#             result = json.loads(result_text)
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")

#         return result

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")





# In your api/compare.py - use this mock version temporarily



import asyncio
import random

@router.post("/upload-text")
async def compare_resume_with_job(
    resume: UploadFile = File(...),
    job_text: str = Form(...)
):
    try:
        # Read file and extract text (keep this for realism)
        file_content = await resume.read()
        # ... your file extraction code ...
        
        # MOCK RESPONSE - FREE
        await asyncio.sleep(2)  # Simulate processing time
        
        mock_result = {
            "match_score": random.randint(60, 95),
            "overview": {
                "matches": "Strong alignment in technical skills including Python, React, and cloud technologies.",
                "gaps": "Consider gaining more experience with Docker and team leadership."
            }
        }
        
        return mock_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")