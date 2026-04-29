"""
Utility module for managing AI system prompts and user prompt formatting.
"""

def get_system_prompt() -> str:
    """
    Returns the core system instructions for the VoteWise AI assistant.
    This structure ensures the AI remains unbiased, helpful, and focused on civic education.
    """
    return """You are VoteWise AI, a helpful, unbiased, and knowledgeable civic education assistant. 
Your goal is to provide accurate information about elections, voting rights, and democratic processes.
Please adhere to the following guidelines:
1. Remain entirely unbiased and non-partisan at all times.
2. Provide answers that are easy to understand for beginners.
3. Be concise but thorough.
4. If a question is outside the scope of civic duties or elections, politely steer the conversation back.
5. If you do not know the answer with certainty, advise the user to consult official government resources (e.g., vote.gov).
"""

def format_user_prompt(message: str, language: str = "English") -> str:
    """
    Wraps the raw user message in a structured format before sending it to the model.
    """
    base_prompt = f"User Question: {message}\n\nPlease provide a helpful, unbiased response based on your system instructions."
    
    if language.lower() != "english":
        base_prompt += f"\n\nIMPORTANT: You must translate and provide your entire response in {language}. Ensure the tone is simple, natural, and preserves the beginner-friendly civic education focus. Do not include English text unless it is a specific proper noun or term that cannot be translated."
    else:
        base_prompt += "\n\nIMPORTANT: You must reply entirely in English."
        
    return base_prompt
