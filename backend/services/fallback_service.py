"""
Resilient fallback engine for VoteWise AI.
Provides high-quality, pre-defined civic education responses when the primary AI fails.
"""
import random
from typing import Dict, List

FALLBACK_RESPONSES: Dict[str, List[str]] = {
    "registration": [
        "To register to vote, most states allow you to register online, by mail, or in person at your local election office or DMV. You can check your status at Vote.gov.",
        "Voter registration requirements vary by state, but generally you must be a U.S. citizen, at least 18 years old by Election Day, and a resident of your state."
    ],
    "id_requirements": [
        "Voter ID requirements vary significantly by state. Some states require a photo ID (like a driver's license), while others accept non-photo ID (like a utility bill). Check your specific state's requirements at Vote411.org.",
        "Most states require some form of identification if it's your first time voting in that district. Always bring a government-issued photo ID just in case."
    ],
    "next_election": [
        "The next federal election (General Election) is typically held on the first Tuesday after the first Monday in November. However, local and primary elections happen throughout the year.",
        "You can find your specific next election date and local ballot details by visiting your Secretary of State's website or using the official Google Civic Information lookup."
    ],
    "candidates": [
        "To see a list of candidates in your area, you can use a non-partisan guide like Ballotpedia or Vote411. These sites show everyone from local school board candidates to federal representatives.",
        "Candidate information is updated as filing deadlines pass. Your official sample ballot, usually available 30 days before an election, is the best source of truth."
    ],
    "general": [
        "I'm currently experiencing high traffic, but I can tell you that participating in elections is a vital part of democracy. You can find official information at USA.gov.",
        "While my primary AI engine is briefly resting, I can still assist with general civic questions. Remember to always verify election dates with your local registrar."
    ]
}

def get_fallback_response(query: str, locale: str = "en") -> str:
    """
    Heuristic-based fallback response selection.
    Maps user query keywords to the most relevant civic education template.
    """
    query = query.lower()
    
    # Simple keyword mapping
    if any(k in query for k in ["register", "registration", "how to vote", "sign up"]):
        category = "registration"
    elif any(k in query for k in ["id", "identification", "driver", "license", "passport"]):
        category = "id_requirements"
    elif any(k in query for k in ["when", "date", "next", "schedule"]):
        category = "next_election"
    elif any(k in query for k in ["who", "candidate", "running", "person"]):
        category = "candidates"
    else:
        category = "general"
        
    response = random.choice(FALLBACK_RESPONSES[category])
    
    # In a real app, we might have translated versions of these templates
    if locale != "en":
        response += f" (Note: Full {locale.upper()} support is temporarily limited in fallback mode.)"
        
    return response
