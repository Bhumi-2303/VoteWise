# 🗳️ VoteWise AI

<div align="center">
  <p><strong>Empowering Voters with AI-Driven Clarity</strong></p>
  <p>A smart, unbiased, and highly accessible civic education assistant designed to demystify the democratic process.</p>

  ![VoteWise Hero Banner](docs/screenshots/hero_placeholder.png)
</div>

---

## 📖 1. Project Overview
**VoteWise AI** is an intelligent civic education application designed to provide accurate, unbiased, and easily digestible information about elections, voting rights, and democratic processes. Built with modern web technologies and powered by Google Gemini, VoteWise aims to bridge the gap between complex governmental systems and the everyday citizen.

## ⚠️ 2. Problem Statement
Many citizens, especially first-time voters or non-native English speakers, find the election process overwhelming. Complex legal jargon, partisan bias, and hard-to-navigate government websites often discourage democratic participation. There is a critical need for a centralized, neutral, and highly accessible platform that simplifies civic duties.

## ✨ 3. Features
- **AI-Powered Civic Assistant:** Real-time conversational AI capable of explaining complex election laws simply.
- **Multilingual Support:** Dynamic language switching (English, Hindi, Gujarati) with context-aware prompt translations.
- **Guided Election Flow:** A step-by-step visual tracker explaining the 6 core stages of the election cycle.
- **Accessibility First:** Integrated Text-to-Speech (TTS), High-Contrast Dark Mode, and a specialized "Beginner Mode" for simplified explanations.
- **Strict Neutrality:** Custom AI prompt intelligence layer enforcing strictly non-partisan and unbiased answers.

## 🛠️ 4. Tech Stack
- **Frontend:** HTML5, CSS3 (Modern Glassmorphism & Animations), Vanilla JavaScript
- **Backend:** Python 3.10, FastAPI, Uvicorn
- **AI Engine:** Google Gemini (gemini-2.0-flash) via `google-genai`
- **Validation:** Pydantic
- **Deployment:** Vercel (Frontend), Render (Backend)

## 🏗️ 5. Architecture
VoteWise AI is built on a decoupled architecture for maximum scalability:
- **Client Tier:** A lightweight, highly responsive static frontend ensuring fast load times and universal browser compatibility.
- **API Tier:** A robust FastAPI application handling cross-origin requests, input validation, and asynchronous logic.
- **Intelligence Layer:** A modular prompt composition system (`backend/prompts/`) that constructs contextual instructions based on user language preferences, accessibility requirements, and safety guardrails.
- **AI Tier:** The Google Gemini API, which generates fast and dynamic educational content based on the engineered prompts.

## 📁 6. Folder Structure
```text
VoteWise/
├── backend/
│   ├── core/         # Settings, config, and exception handling
│   ├── prompts/      # Modular AI instruction generation
│   ├── routes/       # FastAPI route controllers (chat, health)
│   ├── services/     # External integrations (Gemini API)
│   ├── utils/        # Logging and utility functions
│   └── main.py       # FastAPI application entry point
├── frontend/
│   ├── css/          # Responsive UI and design tokens
│   ├── js/           # Chat logic, API interaction, and UI state
│   └── index.html    # Main landing page
├── .env.example      # Environment variable template
├── DEPLOYMENT.md     # Deployment guide
├── render.yaml       # Render backend configuration
├── requirements.txt  # Python dependencies
└── vercel.json       # Vercel frontend configuration
```

## 🚀 7. Installation Steps
Ensure you have **Python 3.10+** installed on your machine.

```bash
# Clone the repository
git clone https://github.com/Bhumi-2303/VoteWise.git
cd VoteWise

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
```

## ⚙️ 8. Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and configure your keys:
   - Request a Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
   - Set `CORS_ORIGINS` to `*` for local development, or specific domains for production.

## 💻 9. Running Frontend
Because the frontend is pure HTML/JS/CSS, it does not require a complex build process.
1. Open `frontend/index.html` directly in your browser.
2. *Alternatively*, use a simple HTTP server:
   ```bash
   cd frontend
   python -m http.server 3000
   ```
   Navigate to `http://localhost:3000`.

## 🖥️ 10. Running Backend
Start the FastAPI application in development mode:
```bash
uvicorn backend.main:app --reload
```
The API will be available at `http://localhost:8000`.
You can view the interactive Swagger documentation at `http://localhost:8000/docs`.

## 🌐 11. Deployment Instructions
Please refer to the comprehensive [DEPLOYMENT.md](DEPLOYMENT.md) file included in the repository for detailed instructions on deploying the frontend to **Vercel** and the backend to **Render**.

## ♿ 12. Accessibility Features
- **WCAG 2.1 AA Compliant Design:** Built with high-contrast UI elements.
- **Text-to-Speech (TTS):** Integrated browser-native speech synthesis to read AI responses aloud.
- **Large Text Mode:** Dynamic font scaling for visually impaired users.
- **Beginner Mode Context:** Toggling this feature appends specialized context to the AI, forcing it to explain complex concepts as if speaking to a novice.

## 🧠 13. AI Features
- **Prompt Composer System:** Dynamically stitches together `Neutrality`, `Simplification`, `Safety`, and `Translation` instructions.
- **Safety Settings Enforced:** Hardcoded guardrails blocking Harassment, Hate Speech, and Dangerous Content.
- **Multilingual Support:** AI translates and responds natively in English, Hindi, and Gujarati, removing language barriers for crucial civic information.

## 🔮 14. Future Scope
- **Voter Registration API Integration:** Connect directly to state databases to check registration status natively.
- **Location-Based Ballots:** Use geolocation to pull up local representatives and upcoming municipal elections.
- **More Languages:** Expand NLP support to Spanish, Mandarin, and Tagalog.
- **Progressive Web App (PWA):** Enable offline support so users can check election dates without an active internet connection.

## 📸 15. Screenshots
<details>
<summary>Click to view screenshots</summary>

| Chat Interface | Language Selection | Guided Election Flow |
| :---: | :---: | :---: |
| ![Chat](docs/screenshots/chat_placeholder.png) | ![Lang](docs/screenshots/lang_placeholder.png) | ![Flow](docs/screenshots/flow_placeholder.png) |

</details>

## 📄 16. License
This project is licensed under the [MIT License](LICENSE).

## 👨‍💻 17. Author
Built with ❤️ for Civic Tech.

**Bhumi**
- GitHub: [@Bhumi-2303](https://github.com/Bhumi-2303)

---
*Democracy thrives when information is accessible to all.*
