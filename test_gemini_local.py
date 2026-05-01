import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
from backend.services.gemini_service import get_ai_response

async def main():
    print(await get_ai_response("hello"))

asyncio.run(main())
