"""
API Endpoints module. Defines the routes for the backend.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handle chat messages from the frontend and interact with the AI service.
    """
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    # TODO: Integrate with backend.services.gemini to process the message
    
    # Placeholder reply until Gemini is connected
    return {"reply": f"Received your message: '{request.message}'. AI integration pending."}
