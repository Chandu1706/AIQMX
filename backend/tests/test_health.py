from fastapi.testclient import TestClient


def test_health_ok(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_logout_ok(client: TestClient) -> None:
    response = client.post("/auth/logout")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_me_requires_bearer_token(client: TestClient) -> None:
    response = client.get("/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Missing bearer token"
