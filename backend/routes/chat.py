from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.services.gemini_service import get_ai_response
from backend.core.exceptions import CustomException

router = APIRouter()

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="The user's prompt")

class ChatResponse(BaseModel):
    reply: str
    status: str = "success"

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handle chat messages from the frontend, validate, and query the AI service.
    """
    try:
        reply = await get_ai_response(request.message)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise CustomException(
            name="ChatServiceError",
            message="Failed to process the chat message.",
            status_code=503
        )
