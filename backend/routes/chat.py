from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from backend.services.ai import ai_service
from backend.utils.logger import app_logger

router = APIRouter()

class ChatMessage(BaseModel):
    role: str = Field(..., description="The role of the message sender (user or model)")
    content: str = Field(..., description="The text content of the message")

class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., description="The full conversation history")
    locale: str = Field(default="en", description="The locale for language matching")

class ChatResponse(BaseModel):
    reply: str
    status: str = "success"

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handle multi-turn chat messages with robust error handling and fallback support.
    """
    try:
        system_instruction = (
            f"You are VoteWise AI, a civic education assistant. "
            f"Always respond in the language matching this locale: {request.locale}. "
            f"Be neutral, factual, and cite official sources."
        )

        # Use the hardened AI service
        # It handles its own internal fallbacks for Gemini failures
        reply = await ai_service.get_chat_response(
            messages=[m.dict() for m in request.messages],
            system_instruction=system_instruction,
            locale=request.locale
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
