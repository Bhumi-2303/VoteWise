"""
VoteWise AI — Gemini connection test script.
Run this from the project root with the virtual environment active:

    python test_gemini.py

This will tell you exactly whether your API key and model are working.
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

from google import genai
from google.genai import errors as genai_errors

API_KEY = os.getenv("GEMINI_API_KEY", "")
MODEL   = "gemini-2.0-flash"

print("=" * 55)
print("  VoteWise AI — Gemini Connection Diagnostic")
print("=" * 55)

# 1. Key check
if not API_KEY:
    print("❌  GEMINI_API_KEY is missing from .env")
    exit(1)

print(f"✅  Key found  ({len(API_KEY)} chars, prefix: {API_KEY[:8]}...)")

if not API_KEY.startswith("AIza"):
    print("⚠️  WARNING: Key does not start with 'AIza'.")
    print("    Gemini API keys from AI Studio always start with 'AIza'.")
    print("    Your current key may be invalid or from a different service.")
    print("    Get a valid key at: https://aistudio.google.com/app/apikey")
    print()

# 2. Client init
try:
    client = genai.Client(api_key=API_KEY)
    print("✅  Gemini client initialised")
except Exception as e:
    print(f"❌  Failed to create client: {e}")
    exit(1)

# 3. Live API call
async def test_call():
    print(f"🔄  Sending test prompt to [{MODEL}] ...")
    try:
        response = await client.aio.models.generate_content(
            model=MODEL,
            contents="What is voting? Answer in exactly one sentence.",
        )
        print(f"✅  Response received:\n    {response.text.strip()}")
    except genai_errors.ClientError as e:
        code = getattr(e, "status_code", "?")
        print(f"❌  ClientError [{code}]: {e}")
        if code == 429:
            print("    → Quota exhausted. Wait or upgrade your API plan.")
        elif code in (401, 403):
            print("    → Authentication failed. Check your API key.")
        elif code == 404:
            print(f"    → Model '{MODEL}' not found. Check available models.")
    except Exception as e:
        print(f"❌  Unexpected error: {type(e).__name__}: {e}")

asyncio.run(test_call())
print("=" * 55)
