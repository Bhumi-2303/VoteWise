from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.services.gemini_service import get_ai_response
from backend.core.exceptions import CustomException
import json
import re

router = APIRouter()

class CompareRequest(BaseModel):
    candidate1: str = Field(..., min_length=1, max_length=100)
    candidate2: str = Field(..., min_length=1, max_length=100)
    language: str = Field(default="English")

@router.post("/")
async def compare_candidates(request: CompareRequest):
    """
    Generate a neutral side-by-side comparison of two candidates using AI.
    """
    prompt = f"""
    Compare the following two political candidates neutrally and objectively:
    Candidate 1: {request.candidate1}
    Candidate 2: {request.candidate2}

    Provide a structured side-by-side comparison for these categories:
    1. Party Affiliation
    2. Key Policies (Education, Healthcare, Economy)
    3. Major Campaign Promises
    4. Public Stance on Social Issues
    5. Recent Public Statements

    RULES:
    - Maintain a strictly neutral, non-partisan, and objective tone.
    - Do not use biased adjectives or show preference.
    - If specific data is unavailable for a category, state "Information not available" rather than speculating or hallucinating.
    - Use data only up to your current knowledge cutoff.
    - Respond in {request.language}.

    Format your entire response as a valid JSON object with this exact structure:
    {{
      "candidates": ["{request.candidate1}", "{request.candidate2}"],
      "comparison": [
        {{ "category": "Category Name", "c1": "Point for Candidate 1", "c2": "Point for Candidate 2" }},
        ...
      ],
      "summary": "A brief 2-sentence neutral summary of their primary differences."
    }}
    """

    try:
        raw_response = await get_ai_response(prompt, request.language)
        
        # Clean up the response in case the model adds markdown code blocks
        json_match = re.search(r'\{.*\}', raw_response, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            return data
        else:
            # Fallback if parsing fails
            raise ValueError("Invalid AI response format")

    except Exception as e:
        print(f"Comparison Error: {str(e)}")
        raise CustomException(
            name="ComparisonError",
            message="Failed to generate candidate comparison. Please try again with different names.",
            status_code=500
        )
