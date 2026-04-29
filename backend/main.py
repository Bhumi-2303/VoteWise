"""
Main entry point for the FastAPI backend.
Run using: uvicorn backend.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import endpoints

app = FastAPI(
    title="VoteWise AI API",
    description="Backend API for the VoteWise AI civic education assistant",
    version="0.1.0"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production to restrict origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(endpoints.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the VoteWise AI API"}
