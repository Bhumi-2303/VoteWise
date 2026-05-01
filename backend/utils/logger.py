"""
Utility module for standardizing application logging.
"""
import logging
import json
from datetime import datetime
from backend.core.config import settings

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "severity": record.levelname,
            "message": record.getMessage(),
            "name": record.name,
        }
        if record.exc_info:
            log_record["exc_info"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

def setup_logger(name: str) -> logging.Logger:
    """
    Configure and return a standardized logger instance.
    """
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
        
        handler = logging.StreamHandler()
        
        # Use structured JSON logging in production
        if settings.ENVIRONMENT == "production":
            handler.setFormatter(JSONFormatter())
        else:
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            
        logger.addHandler(handler)
        logger.propagate = False
        
    return logger

# Create a default logger for the app
app_logger = setup_logger("votewise")
