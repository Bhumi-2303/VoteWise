# Deployment Validation Checklist

Follow these steps to ensure the platform is ready for hackathon judging.

## 1. Environment Verification
- [ ] `GEMINI_API_KEY` is set in Secret Manager.
- [ ] `GOOGLE_CIVIC_API_KEY` is set in Secret Manager.
- [ ] Service Account has `Secret Manager Secret Accessor` role.

## 2. API Health
- [ ] `GET /health` returns `200 OK`.
- [ ] `GET /ready` returns `200 OK`.
- [ ] Gemini Chat responds in < 5 seconds.
- [ ] Fallback triggers when API key is removed (Simulation).

## 3. Frontend Audit
- [ ] No mixed content warnings (all HTTPS).
- [ ] Language switching works in Chat and UI.
- [ ] Dark mode contrast ratio > 4.5:1.

## 4. Cloud Infrastructure
- [ ] Artifact Registry repo `votewise` exists.
- [ ] Cloud Build trigger is linked to GitHub `main` branch.
- [ ] Cloud Run services are configured with min-instances (if budget allows) or 0-scaling.

## 5. Security
- [ ] Containers are running as `votewise` user (non-root).
- [ ] CORS is restricted to frontend domain (for production).
