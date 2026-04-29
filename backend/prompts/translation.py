def get_translation_prompt(language: str) -> str:
    if language.lower() == "english":
        return "LANGUAGE REQUIREMENT:\nYou must reply entirely in English."
    
    return f"""LANGUAGE REQUIREMENT:
You must translate and provide your entire response in {language}. 
Ensure the tone is simple, natural, and preserves the beginner-friendly civic education focus. 
Do not include English text unless it is a specific proper noun or term that cannot be translated."""
