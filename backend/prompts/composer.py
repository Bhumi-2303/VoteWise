from .system import get_base_system_prompt
from .neutrality import get_neutrality_prompt
from .simplification import get_simplification_prompt
from .translation import get_translation_prompt
from .accessibility import get_accessibility_prompt
from .safety import get_safety_prompt

def build_system_instruction() -> str:
    """
    Composes the full system instruction by combining modular prompts.
    """
    components = [
        get_base_system_prompt(),
        get_neutrality_prompt(),
        get_simplification_prompt(),
        get_accessibility_prompt(),
        get_safety_prompt()
    ]
    return "\n\n".join(components)

def build_user_prompt(message: str, language: str = "English") -> str:
    """
    Formats the user's message alongside dynamic instructions like translation.
    """
    translation_instruction = get_translation_prompt(language)
    
    return f"""User Question: {message}

{translation_instruction}"""
