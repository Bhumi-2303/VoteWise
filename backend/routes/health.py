from fastapi import APIRouter
from backend.core.config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Basic health check endpoint to verify the API is running.
    """
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }
