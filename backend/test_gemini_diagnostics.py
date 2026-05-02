import os
from google import genai
from dotenv import load_dotenv

def diagnose():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ ERROR: GEMINI_API_KEY not found in .env")
        return

    print(f"🔍 Diagnostic started with API Key: {api_key[:5]}...{api_key[-5:]}")
    
    try:
        client = genai.Client(api_key=api_key)
        print("✅ Client initialized.")
        
        print("\nListing available models for your key:")
        models = client.models.list()
        found_any = False
        for m in models:
            found_any = True
            # Print whatever attributes we can find
            methods = getattr(m, 'supported_methods', getattr(m, 'supported_generation_methods', 'Unknown'))
            print(f" - Name: {m.name} | Methods: {methods}")
        
        if not found_any:
            print("⚠️ No models found! Your API key might not have permissions.")
            
        # Try a few different model name variants
        test_models = ['gemini-1.5-flash', 'gemini-1.0-pro', 'gemini-1.5-pro']
        for model_name in test_models:
            print(f"\nTesting '{model_name}'...")
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents='Hello'
                )
                print(f"✅ Success with {model_name}! Response: {response.text[:20]}...")
                print(f"👉 RECOMMENDATION: Use '{model_name}'")
                break
            except Exception as e:
                print(f"❌ Failed '{model_name}': {str(e)}")

    except Exception as e:
        print(f"❌ Critical Failure: {str(e)}")

if __name__ == "__main__":
    diagnose()
