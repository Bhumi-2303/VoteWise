"""
Service layer for interacting with the Google Gemini API.
Uses the modern google-genai SDK (replaces deprecated google-generativeai).
"""
import asyncio
from google import genai
from google.genai import errors as genai_errors

from backend.core.config import settings
from backend.utils.logger import app_logger
from backend.prompts import build_system_instruction, build_user_prompt
from backend.services.fallback_service import get_fallback_response

# The supported model to use for chat responses
# Based on diagnostics, gemini-2.0-flash is the primary available model for this account
GEMINI_MODEL = "gemini-2.0-flash"

# Lazily initialised client — created once when the first request arrives
_client: genai.Client | None = None


def _get_client() -> genai.Client:
    """Return a shared Gemini client, creating it on first use."""
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not set in the environment.")
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
        app_logger.info("Gemini client initialised successfully.")
    return _client


async def get_ai_response(prompt: str, language: str = "English") -> str:
    """
    Generate an AI response using the Gemini API with timeout and error handling.
    Returns a safe fallback string if any error occurs.
    """
    if not settings.GEMINI_API_KEY:
        app_logger.error("Attempted to call Gemini API without an API key.")
        return (
            "⚠️ The AI assistant is currently unavailable due to missing API "
            "configuration. Please contact the administrator."
        )

    try:
        client = _get_client()

        # Compose the full system instruction and user prompt
        system_instruction = build_system_instruction()
        formatted_prompt = build_user_prompt(prompt, language)

        app_logger.info(
            f"Sending request to Gemini [{GEMINI_MODEL}] | "
            f"Language: {language} | Prompt length: {len(prompt)} chars"
        )

        # Wrap the async call in a timeout guard
        response = await asyncio.wait_for(
            client.aio.models.generate_content(
                model=GEMINI_MODEL,
                contents=formatted_prompt,
                config={
                    "system_instruction": system_instruction,
                    "temperature": 0.7,
                    "max_output_tokens": 1024,
                }
            ),
            timeout=20.0,
        )

        if response.text:
            app_logger.info("Successfully received response from Gemini API.")
            return response.text

        app_logger.warning("Gemini API returned an empty response.")
        return "I'm sorry, I couldn't generate a response. Please try rephrasing your question."

    except asyncio.TimeoutError:
        app_logger.error("Gemini API request timed out. Triggering fallback.")
        return get_fallback_response(prompt, language)

    except genai_errors.ClientError as e:
        status = getattr(e, "status_code", getattr(e, "code", None))
        app_logger.error(f"Gemini ClientError [{status}]: {str(e)}")
        
        # Trigger fallback for rate limits or server errors
        if status in (429, 500, 503):
            return get_fallback_response(prompt, language)
            
        if status == 404:
            return (
                f"⚠️ Model '{GEMINI_MODEL}' not found. Please verify that this model is "
                "available in your region and supported by your API key."
            )
        if status in (401, 403):
            return (
                "⚠️ API authentication failed. Please verify your Gemini API key "
                "in the .env file or Secret Manager."
            )
        return get_fallback_response(prompt, language)

    except Exception as e:
        app_logger.exception(f"Unexpected error in Gemini service: {type(e).__name__}: {str(e)}")
        return get_fallback_response(prompt, language)
