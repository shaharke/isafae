from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app

client = TestClient(app)

@patch("app.services.sandbox.SandboxSession")
def test_create_session(mock_sandbox_session):
    # Mock the session instance and its open method
    mock_instance = MagicMock()
    mock_sandbox_session.return_value = mock_instance
    
    response = client.post("/sessions", json={"lang": "python"})
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert data["status"] == "active"
    mock_instance.open.assert_called_once()

@patch("app.services.sandbox.sandbox_manager.sessions")
def test_execute_code(mock_sessions):
    # Mock the session in the manager
    session_id = "test-session-id"
    mock_session_instance = MagicMock()
    mock_sessions.get.return_value = mock_session_instance
    
    # Mock the run result
    mock_result = MagicMock()
    mock_result.stdout = "Hello\n"
    mock_result.stderr = ""
    mock_result.exit_code = 0
    mock_session_instance.run.return_value = mock_result

    response = client.post(f"/sessions/{session_id}/execute", json={"code": "print('Hello')"})
    assert response.status_code == 200
    data = response.json()
    assert data["stdout"] == "Hello\n"
    assert data["exit_code"] == 0
    mock_session_instance.run.assert_called_once()

@patch("app.services.sandbox.sandbox_manager.sessions")
def test_stop_session(mock_sessions):
    session_id = "test-session-id"
    mock_session_instance = MagicMock()
    mock_sessions.pop.return_value = mock_session_instance
    
    response = client.delete(f"/sessions/{session_id}")
    assert response.status_code == 200
    mock_session_instance.close.assert_called_once()
