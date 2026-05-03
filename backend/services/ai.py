"""
Production-grade AI Service Wrapper for VoteWise.
Handles Gemini 2.0 API interactions with resilience, logging, and graceful fallbacks.
"""
import asyncio
from typing import List, Optional
from google import genai
from google.genai import types
from google.genai import errors as genai_errors

from backend.core.config import settings
from backend.utils.logger import app_logger
from backend.services.fallback_service import get_fallback_response

class AIService:
    """
    Centralized service for AI operations. 
    Implements singleton pattern for the Gemini client and robust error handling.
    """
    _instance = None
    _client: Optional[genai.Client] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIService, cls).__new__(cls)
        return cls._instance

    def _get_client(self) -> genai.Client:
        """Lazily initialize the Gemini client."""
        if self._client is None:
            if not settings.GEMINI_API_KEY:
                app_logger.critical("GEMINI_API_KEY is missing from environment variables.")
                raise RuntimeError("GEMINI_API_KEY not configured.")
            
            # Using the new google-genai SDK
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
            app_logger.info("AIService: Gemini client initialized successfully.")
        return self._client

    async def get_chat_response(
        self, 
        messages: List[dict], 
        system_instruction: str,
        locale: str = "en"
    ) -> str:
        """
        Generate a response for a chat conversation.
        Messages should be a list of dicts with 'role' and 'content'.
        """
        client = self._get_client()
        
        # Convert internal message format to Gemini SDK 'Content' objects
        # Format: {"role": "user", "parts": [{"text": "..."}]}
        gemini_contents = []
        for msg in messages:
            role = "model" if msg.get("role") in ["assistant", "model", "bot"] else "user"
            gemini_contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part(text=msg.get("content", ""))]
                )
            )

        try:
            app_logger.info(f"AIService: Requesting Gemini [gemini-2.0-flash] | Locale: {locale}")
            
            # Use a timeout to prevent hanging the Cloud Run instance
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=gemini_contents,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.7,
                        max_output_tokens=1024,
                        top_p=0.95,
                        top_k=40,
                    )
                ),
                timeout=15.0 # 15 second timeout for production responsiveness
            )

            if response.text:
                return response.text
            
            app_logger.warning("AIService: Gemini returned empty response. Triggering fallback.")
            return get_fallback_response(messages[-1]["content"], locale)

        except asyncio.TimeoutError:
            app_logger.error("AIService: Request timed out. Triggering fallback.")
            return get_fallback_response(messages[-1]["content"], locale)

        except (genai_errors.ClientError, genai_errors.ServerError) as e:
            app_logger.error(f"AIService: Gemini API Error: {str(e)}")
            return get_fallback_response(messages[-1]["content"], locale)

    async def generate_text(
        self, 
        prompt: str, 
        system_instruction: Optional[str] = None,
        locale: str = "en"
    ) -> str:
        """
        Simple text generation for single-prompt tasks (e.g., comparisons).
        """
        client = self._get_client()
        
        try:
            app_logger.info(f"AIService: Single prompt request | Locale: {locale}")
            
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.3, # Lower temperature for factual/structured tasks
                        max_output_tokens=2048,
                    )
                ),
                timeout=25.0
            )

            if response.text:
                return response.text
            
            return get_fallback_response(prompt, locale)

        except Exception as e:
            app_logger.error(f"AIService generate_text error: {str(e)}")
            return get_fallback_response(prompt, locale)

# Global instance for use across the application
ai_service = AIService()
