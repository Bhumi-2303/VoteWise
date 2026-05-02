from fastapi import APIRouter, Query
import httpx
from backend.core.config import settings
from backend.core.exceptions import CustomException
from typing import Optional
import asyncio

router = APIRouter()

GOOGLE_CIVIC_BASE_URL = "https://www.googleapis.com/civicinfo/v2"

@router.get("/")
async def lookup_election_info(address: str = Query(..., min_length=5)):
    """
    Fetch election and representative data for a given address/ZIP code.
    """
    if not settings.GOOGLE_CIVIC_API_KEY:
        # Fallback for demo purposes if API key is missing
        return {
            "is_demo": True,
            "message": "Demo Mode: API Key missing. Showing sample data for " + address,
            "elections": [
                {"name": "2026 Primary Election", "date": "2026-06-02", "id": "1"},
                {"name": "2026 General Election", "date": "2026-11-03", "id": "2"}
            ],
            "representatives": [
                {"name": "Sample Representative", "title": "City Council", "party": "Non-partisan"}
            ]
        }

    async with httpx.AsyncClient() as client:
        try:
            # 1. Fetch Voter Info (Elections, Polling Places)
            voter_url = f"{GOOGLE_CIVIC_BASE_URL}/voterinfo"
            voter_params = {
                "address": address,
                "key": settings.GOOGLE_CIVIC_API_KEY
            }
            
            # 2. Fetch Representatives
            rep_url = f"{GOOGLE_CIVIC_BASE_URL}/representatives"
            rep_params = {
                "address": address,
                "key": settings.GOOGLE_CIVIC_API_KEY
            }

            # Run concurrently
            voter_task = client.get(voter_url, params=voter_params)
            rep_task = client.get(rep_url, params=rep_params)
            
            voter_res, rep_res = await asyncio.gather(voter_task, rep_task)

            result = {
                "address": address,
                "elections": [],
                "representatives": [],
                "polling_locations": []
            }

            if voter_res.status_code == 200:
                v_data = voter_res.json()
                if "election" in v_data:
                    result["elections"].append({
                        "name": v_data["election"].get("name"),
                        "date": v_data["election"].get("electionDay"),
                        "id": v_data["election"].get("id")
                    })
                if "pollingLocations" in v_data:
                    result["polling_locations"] = v_data["pollingLocations"]

            if rep_res.status_code == 200:
                r_data = rep_res.json()
                offices = r_data.get("offices", [])
                officials = r_data.get("officials", [])
                
                for office in offices:
                    for idx in office.get("officialIndices", []):
                        if idx < len(officials):
                            result["representatives"].append({
                                "name": officials[idx].get("name"),
                                "title": office.get("name"),
                                "party": officials[idx].get("party")
                            })

            if not result["elections"] and not result["representatives"]:
                raise CustomException(
                    name="NoDataFound",
                    message="No election data found for this address. Try a different ZIP code.",
                    status_code=404
                )

            return result

        except httpx.HTTPError as e:
            print(f"Civic API Error: {str(e)}")
            raise CustomException(
                name="CivicAPIError",
                message="External service error. Please try again later.",
                status_code=502
            )
        except Exception as e:
            print(f"Lookup Exception: {str(e)}")
            raise CustomException(
                name="LookupError",
                message="Failed to retrieve information for this address.",
                status_code=500
            )
