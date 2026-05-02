# 🗳️ VoteWise AI
### *Democratizing Civic Intelligence on Google Cloud*

[![GCP Native](https://img.shields.io/badge/Google%20Cloud-Native-blue?logo=google-cloud)](https://cloud.google.com/)
[![Gemini Powered](https://img.shields.io/badge/Powered%20By-Gemini%202.0-orange?logo=google-gemini)](https://ai.google.dev/)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1-green)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 📖 Project Overview
**VoteWise AI** is a production-grade civic-tech platform designed to empower citizens with unbiased, accurate, and highly accessible information about the democratic process. Built for the Google Cloud Hackathon, it leverages the cutting-edge **Gemini 2.0 Flash** model to bridge the gap between complex election systems and the everyday voter.

## ⚠️ Problem Statement
Navigating the election process is often overwhelming due to legal jargon, partisan bias, and fragmented government websites. For first-time voters and non-native speakers, these barriers can lead to disenfranchisement. **Democracy thrives only when information is accessible to all.**

## ✨ Features
- **AI Civic Assistant**: Real-time conversational AI for complex election queries.
- **Candidate Comparison AI**: Objective,pillar-based analysis of political candidates.
- **District-Aware Lookup**: Integration with Google Civic API for localized election data.
- **Multilingual Native**: Full reactive support for English, Hindi, and Gujarati.
- **Accessibility First**: WCAG-aligned dark mode, screen-reader support, and skip-links.

## 🧠 AI Features & Safety
- **Strict Neutrality Layer**: Custom-engineered prompt architecture ensuring non-partisan clarity.
- **Graceful Degradation**: A local rule-based fallback engine that ensures the platform remains functional even if AI services are rate-limited.
- **Explainable AI**: Direct attribution to official civic sources.

## 🛠️ Google Cloud Stack
- **Compute**: Cloud Run (Serverless scalability)
- **CI/CD**: Cloud Build
- **Registry**: Artifact Registry
- **Secrets**: GCP Secret Manager
- **Intelligence**: Gemini 2.0 Flash API
- **Data**: Google Civic Information API

## 🏗️ Architecture
Refer to the [Architecture Documentation](docs/architecture.md) for a detailed breakdown.

## 🚀 Deployment & Installation
The project is optimized for automated deployment via Cloud Build.

### Local Setup
```bash
# Clone and enter
git clone https://github.com/Bhumi-2303/VoteWise.git
cd VoteWise

# Run via Docker Compose
docker-compose up --build
```

### Cloud Deployment
```bash
gcloud builds submit --config cloudbuild.yaml .
```

## ⚖️ Scalability & Responsible AI
VoteWise is designed for **Election Day Scale**. By utilizing Cloud Run, we achieve zero-to-infinity scaling while maintaining high-reliability through our local fallback intelligence.

## 🔮 Future Scope
- **Live Voter Registration**: Integration with state-level registration APIs.
- **Ballot Tracker**: Real-time tracking of mail-in ballots.
- **Advanced Telemetry**: Monitoring civic engagement trends via Cloud Monitoring.

---
**Built with ❤️ for the Google Cloud Hackathon.**
*Empowering every voice, one vote at a time.*
