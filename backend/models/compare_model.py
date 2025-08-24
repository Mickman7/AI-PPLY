from pydantic import BaseModel

class CompareResponse(BaseModel):
    match_score: int
    overview: dict
