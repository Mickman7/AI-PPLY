from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import PyPDF2
import docx
import openai
import os

router = APIRouter()

# Set your OpenAI API key via environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

@router.post("/upload-text")
async def compare_resume_with_job(
    resume: UploadFile = File(...),
    job_text: str = Form(...)
):
    """
    Accept a resume file and a pasted job description text.
    Extract text from the resume, send both to OpenAI, and return match score + overview.
    """

    # Step 1: Extract resume text
    resume_text = ""
    if resume.filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(resume.file)
        for page in reader.pages:
            resume_text += page.extract_text() or ""
    elif resume.filename.endswith(".docx"):
        doc = docx.Document(resume.file)
        for para in doc.paragraphs:
            resume_text += para.text + "\n"
    elif resume.filename.endswith(".txt"):
        resume_text = (await resume.read()).decode("utf-8")
    else:
        return JSONResponse({"error": "Unsupported file type"}, status_code=400)

    # Step 2: Build OpenAI prompt
    prompt = f"""
    Compare the following resume and job description.

    Resume:
    {resume_text}

    Job Description:
    {job_text}

    Instructions:
    - Give a percentage match score (0–100) for how well the resume fits the job.
    - Provide a short overview highlighting what matches well.
    - Provide a short overview of what’s missing or weak.

    Respond in JSON with this structure:
    {{
        "match_score": <number>,
        "overview": {{
            "matches": "<text>",
            "gaps": "<text>"
        }}
    }}
    """

    # Step 3: Call OpenAI API
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    result_text = response.choices[0].message.content.strip()

    # Step 4: Parse JSON from OpenAI
    import json
    try:
        result = json.loads(result_text)
    except Exception as e:
        return JSONResponse({"error": "Failed to parse AI response", "raw": result_text}, status_code=500)

    return result
