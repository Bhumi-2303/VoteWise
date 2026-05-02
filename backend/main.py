from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import sys
import os
import uvicorn

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

    # Configure CORS safely
    origins = settings.CORS_ORIGINS
    allow_all = "*" in origins

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if allow_all else origins,
        allow_credentials=not allow_all, # Browser blocks allow_credentials=True with allow_origins=["*"]
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Process-Time"],
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

    # Root Endpoint
    @app.get("/", tags=["Root"])
    def home():
        return {"message": "Backend is running successfully"}

    from backend.routes import health, chat, debug
    
    # Include Routers
    app.include_router(health.router, prefix="/api/v1", tags=["Health"])
    app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
    app.include_router(debug.router, prefix="/api/v1", tags=["Debug"])

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port)
