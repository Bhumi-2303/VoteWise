from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

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

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
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
            content={"detail": "An unexpected error occurred. Please try again later."},
        )

    # Include Routers
    app.include_router(health.router, prefix="/api/v1", tags=["Health"])
    app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])

    return app

app = create_app()
