"""
Service layer for interacting with the Google Gemini API.
"""
import asyncio
import google.generativeai as genai
from google.api_core.exceptions import GoogleAPIError

from backend.core.config import settings
from backend.utils.logger import app_logger
from backend.utils.prompts import get_system_prompt, format_user_prompt

# Initialize the Gemini client safely
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    app_logger.warning("GEMINI_API_KEY is not set in the environment.")

async def get_ai_response(prompt: str) -> str:
    """
    Generate an AI response using the Gemini API with timeout and error handling.
    """
    if not settings.GEMINI_API_KEY:
        app_logger.error("Attempted to call Gemini API without an API key.")
        return "System Warning: The AI assistant is currently unavailable due to missing API configuration. Please contact the administrator."

    try:
        # Use gemini-1.5-flash for fast text interactions
        # System instructions set the AI's persona
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=get_system_prompt(),
        )
        
        formatted_prompt = format_user_prompt(prompt)
        app_logger.info("Sending formatted prompt to Gemini API.")
        
        # We enforce a timeout so the frontend doesn't hang indefinitely
        response = await asyncio.wait_for(
            model.generate_content_async(formatted_prompt),
            timeout=15.0  # 15 seconds max execution time
        )
        
        if response.text:
            app_logger.info("Successfully received response from Gemini API.")
            return response.text
        else:
            app_logger.warning("Gemini API returned an empty response.")
            return "I'm sorry, I couldn't generate a proper response to that. Please try rephrasing your question."

    except asyncio.TimeoutError:
        app_logger.error("Gemini API request timed out after 15 seconds.")
        return "I'm sorry, the request took too long to process. Please try again later."
    except GoogleAPIError as e:
        app_logger.error(f"Google API Error encountered: {str(e)}")
        return "I'm experiencing some technical difficulties connecting to my knowledge base. Please try again shortly."
    except Exception as e:
        app_logger.exception(f"Unexpected error in Gemini service: {str(e)}")
        return "An unexpected error occurred while processing your request. Our support team has been notified."
