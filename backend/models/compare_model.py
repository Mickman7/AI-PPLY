from pydantic import BaseModel

# Request model: defines what data the frontend must send
class CompareRequest(BaseModel):
    resume_text: str
    job_text: str

# Response model: defines what data the backend will return
class CompareResponse(BaseModel):
    match_score: float
    overview: str
