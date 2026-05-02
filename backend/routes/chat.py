from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from backend.services.gemini_service import get_ai_response
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
    Handle multi-turn chat messages, prepends a system instruction, and queries the AI service.
    """
    try:
        # Prepend the system prompt as requested
        system_instruction = (
            f"You are VoteWise AI, a civic education assistant. "
            f"Always respond in the language matching this locale: {request.locale}. "
            f"Be neutral, factual, and cite official sources."
        )

        # Map frontend messages to Gemini SDK format (role and parts)
        # Gemini SDK expects 'parts' to be a list of strings or other parts
        gemini_messages = []
        for msg in request.messages:
            # Map 'assistant' role to 'model' for Gemini
            role = "model" if msg.role == "assistant" else msg.role
            gemini_messages.append({
                "role": role,
                "parts": [msg.content]
            })

        reply = await get_ai_response(contents=gemini_messages, system_instruction=system_instruction)
        return ChatResponse(reply=reply)
    
    except Exception as e:
        app_logger.error(f"Chat endpoint error: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": True,
                "message": f"Failed to process the chat message: {str(e)}"
            }
        )
