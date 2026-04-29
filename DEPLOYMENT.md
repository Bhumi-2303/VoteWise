# VoteWise AI Deployment Guide

## Architecture
VoteWise AI is designed with a decoupled architecture:
- **Frontend**: Pure HTML/CSS/JS (Optimized for Vercel)
- **Backend**: FastAPI Python Server (Optimized for Render)

## 1. Deploying the Backend (Render)

The backend handles the AI API requests to Google Gemini securely without exposing your API keys to the browser.

1. Create an account on [Render.com](https://render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository containing this code.
4. Render will automatically detect the `render.yaml` configuration file and set up the `votewise-backend` service.
5. In the Render Dashboard, go to your new service's **Environment** tab.
6. Add your secrets:
   - `GEMINI_API_KEY`: Your actual Google Gemini API Key.
   - `CORS_ORIGINS`: Your Vercel frontend URL (e.g., `https://votewise-ai.vercel.app`).
7. Copy the backend URL (e.g., `https://votewise-backend.onrender.com`).

## 2. Deploying the Frontend (Vercel)

1. Create an account on [Vercel.com](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Vercel will automatically read the `vercel.json` file and set the Output Directory to `frontend`.
5. Before deploying, ensure you update the `API_BASE_URL` in `frontend/js/main.js` to point to your new Render backend URL.
6. Click **Deploy**.

## Local Development
To run locally:
1. `cp .env.example .env` and fill in your keys.
2. `pip install -r requirements.txt`
3. Start backend: `uvicorn backend.main:app --reload`
4. Serve frontend: Open `frontend/index.html` in your browser or use a live server.
