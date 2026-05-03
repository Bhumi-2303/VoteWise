from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from backend.services.ai import ai_service
from backend.utils.logger import app_logger
from backend.main import limiter

router = APIRouter()

class ChatRequest(BaseModel):
    message: str = Field(default="Hello", max_length=2000)
    messages: list = Field(default_factory=list)
    locale: str = Field(default="en")

class ChatResponse(BaseModel):
    reply: str
    status: str = "success"

@router.post("/", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat_endpoint(request: Request, body: ChatRequest):
    """
    Handle multi-turn chat messages with robust error handling and fallback support.
    """
    try:
        system_instruction = (
            f"You are VoteWise AI, a civic education assistant. "
            f"Always respond in the language matching this locale: {body.locale}. "
            f"Be neutral, factual, and cite official sources."
        )

        # Use the hardened AI service
        # It handles its own internal fallbacks for Gemini failures
        # body.messages is now a generic list, so pass it directly
        reply = await ai_service.get_chat_response(
            messages=body.messages,
            system_instruction=system_instruction,
            locale=body.locale
        )
        
        return ChatResponse(reply=reply)
    
    except Exception as e:
        app_logger.exception(f"Chat Route Error: {str(e)}")
        # Even in a total failure, we return a successful schema with a safe message
        # This prevents frontend crashes
        return ChatResponse(
            reply="I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
            status="error"
        )
