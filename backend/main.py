from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import sys
import os
import uvicorn

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

# Ensure the root directory is in the Python path so absolute imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.core.config import settings
from backend.routes import health, chat
from backend.core.exceptions import custom_exception_handler, CustomException

def create_app() -> FastAPI:
    """
    Initialize and configure the FastAPI application.
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="Backend API for the VoteWise AI civic education assistant",
        version=settings.VERSION,
    )

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://votewise-frontend-934331733354.us-central1.run.app"],
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"]
    )

    # Global timing middleware
    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response

    # Global Exception Handlers
    app.add_exception_handler(CustomException, custom_exception_handler)
    
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                "error": "InternalServerError", 
                "message": "An unexpected error occurred. Please try again later."
            },
        )

    @app.get("/health", tags=["Health"])
    async def health_check():
        """Liveness probe for Cloud Run."""
        return {"status": "ok", "model": "gemini-2.0-flash"}

    @app.get("/ready", tags=["Health"])
    async def readiness_check():
        """Readiness probe for Cloud Run."""
        # Add logic here to check external services if needed
        return {"status": "ready"}

    @app.get("/", tags=["Root"])
    def home():
        return {"message": "Backend is running successfully"}

    from backend.routes import health, chat, debug, compare, lookup
    
    # Include Routers
    app.include_router(health.router, prefix="/api/v1", tags=["Health"])
    app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
    app.include_router(debug.router, prefix="/api/v1", tags=["Debug"])
    app.include_router(compare.router, prefix="/api/v1/compare", tags=["Compare"])
    app.include_router(lookup.router, prefix="/api/v1/lookup", tags=["Lookup"])

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port)
