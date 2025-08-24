from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.compare import router as compare_router
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# CORS: allow frontend (React at localhost:3000) to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(compare_router, prefix="/api", tags=["compare"])

@app.get("/")
def root():
    return {"message": "API is running"}