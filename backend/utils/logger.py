"""
Utility module for standardizing application logging.
"""
import logging
from backend.core.config import settings

def setup_logger(name: str) -> logging.Logger:
    """
    Configure and return a standardized logger instance.
    """
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
        
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

# Create a default logger for the app
app_logger = setup_logger("votewise")
