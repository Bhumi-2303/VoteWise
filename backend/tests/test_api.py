import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_chat_valid_message():
    payload = {
        "message": "What is voting?",
        "messages": [{"role": "user", "content": "What is voting?"}],
        "locale": "en"
    }
    response = client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert data["reply"] != ""

def test_chat_empty_message():
    # Sending invalid schema (missing 'messages' or incorrect structure) to trigger 422
    payload = {
        "message": "",
        "locale": "en"
    }
    response = client.post("/api/v1/chat/", json=payload)
    assert response.status_code in [400, 422]

def test_chat_missing_field():
    response = client.post("/api/v1/chat/", json={})
    assert response.status_code == 422

def test_compare_candidates():
    payload = {
        "candidate1": "Candidate A",
        "candidate2": "Candidate B",
        "language": "English"
    }
    response = client.post("/api/v1/compare/", json=payload)
    assert response.status_code == 200
    assert response.json() != {}

def test_cors_headers():
    response = client.get("/health", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers
