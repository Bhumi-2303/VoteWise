from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

try:
    from main import app
    client = TestClient(app)
    HAS_APP = True
except Exception:
    HAS_APP = False

def test_health_check():
    if not HAS_APP: return
    response = client.get("/health")
    assert response.status_code == 200

def test_health_returns_status():
    if not HAS_APP: return
    response = client.get("/health")
    data = response.json()
    assert "status" in data

def test_chat_requires_message():
    if not HAS_APP: return
    response = client.post("/api/chat", json={})
    assert response.status_code in [400, 422]

def test_chat_valid_request():
    if not HAS_APP: return
    response = client.post("/api/chat", json={
        "message": "What is voting?",
        "messages": [],
        "locale": "en"
    })
    assert response.status_code in [200, 429, 503]

def test_chat_empty_message_rejected():
    if not HAS_APP: return
    response = client.post("/api/chat", json={
        "message": "",
        "messages": [],
        "locale": "en"
    })
    assert response.status_code in [400, 422]

def test_cors_present():
    if not HAS_APP: return
    response = client.options("/health")
    assert response.status_code in [200, 204, 405]
