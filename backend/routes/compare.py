from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.services.ai import ai_service
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
        raw_response = await ai_service.generate_text(
            prompt=prompt,
            system_instruction="You are a neutral political analyst. Always return strictly valid JSON.",
            locale=request.language
        )
        
        # Clean up the response (remove markdown code blocks)
        cleaned_response = re.sub(r'```json\s*|\s*```', '', raw_response).strip()
        
        json_match = re.search(r'\{.*\}', cleaned_response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            app_logger.error(f"Comparison: Failed to parse JSON from response: {raw_response[:200]}...")
            raise ValueError("Invalid AI response format")

    except Exception as e:
        app_logger.exception(f"Comparison Error: {str(e)}")
        # Provide a high-quality static fallback for the comparison UI
        return {
            "candidates": [request.candidate1, request.candidate2],
            "comparison": [
                { "category": "Policy Stance", "c1": "Refer to official campaign site", "c2": "Refer to official campaign site" }
            ],
            "summary": "Our comparison engine is temporarily under maintenance. Please check back shortly for a full analysis."
        }
