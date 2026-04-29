"""
Configuration management.
Loads environment variables and application settings.
"""
import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "VoteWise AI"
    # Read the Gemini API Key from environment variables
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Example additional settings
    # DEBUG_MODE: bool = os.getenv("DEBUG_MODE", "False").lower() == "true"

settings = Settings()
