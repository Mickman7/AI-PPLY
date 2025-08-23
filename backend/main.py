from fastapi import FastAPI
from app.api import compare

# Initialize FastAPI application
app = FastAPI(title="AI-PPLY API", version="1.0")

# Register the "compare" router so /compare endpoints are active
app.include_router(compare.router, prefix="/compare", tags=["Comparison"])

# Root endpoint: simple check if API is running
@app.get("/")
async def root():
    return {"message": "Welcome to AI-PPLY backend!"}

