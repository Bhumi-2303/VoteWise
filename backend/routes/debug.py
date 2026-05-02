from fastapi import APIRouter
import os
from backend.core.config import settings
from google import genai

router = APIRouter()

@router.get("/version")
async def get_version():
    return {
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
        "commit_status": "Latest Frontend UI + Structured Logging + Gemini Debug",
    }

@router.get("/debug/gemini")
async def debug_gemini():
    has_key = bool(settings.GEMINI_API_KEY)
    key_preview = f"{settings.GEMINI_API_KEY[:5]}...{settings.GEMINI_API_KEY[-4:]}" if has_key else "None"
    
    return {
        "api_key_loaded": has_key,
        "api_key_preview": key_preview,
        "sdk": "google-genai",
        "current_configured_model": "gemini-2.0-flash"
    }

@router.get("/debug/models")
async def debug_models():
    if not settings.GEMINI_API_KEY:
        return {"error": "API key missing"}
        
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        models = client.models.list()
        # Filter for models that support generateContent
        available_models = []
        for m in models:
            if "generateContent" in m.supported_actions:
                available_models.append(m.name)
        
        return {
            "status": "success",
            "available_models": available_models
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
