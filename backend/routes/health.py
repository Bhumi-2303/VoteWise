from fastapi import APIRouter
from backend.core.config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Basic health check endpoint to verify the API is running.
    """
    return {
        "status": "ok",
        "model": "gemini-2.0-flash"
    }
