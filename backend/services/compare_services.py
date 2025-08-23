import os
from openai import OpenAI

# Initialize OpenAI client with your API key from environment variables
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Function that takes resume text + job text and asks OpenAI to compare them
async def analyze_resume_with_openai(resume_text: str, job_text: str):
    # Build a prompt that instructs OpenAI what to do
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

    # Send the prompt to OpenAI’s Chat API
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Use a small, fast GPT-4 model
        messages=[{"role": "user", "content": prompt}],
        temperature=0  # Make responses deterministic (less random)
    )

    # Extract the text part of the response
    result_text = response.choices[0].message.content.strip()

    # Convert the JSON string from OpenAI into a Python dictionary
    import json
    result = json.loads(result_text)

    # Return the structured result
    return result
