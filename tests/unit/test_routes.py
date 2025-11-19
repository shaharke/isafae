"""
Unit tests for API routes.
These tests use mocks and do not require Docker.
"""

from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.schemas import ExecutionResult

client = TestClient(app)


@pytest.mark.unit
@patch("app.api.routes.execute_code")
def test_execute_endpoint_success(mock_execute):
    """Test /execute endpoint with successful execution."""
    # Mock the execute_code function
    mock_execute.return_value = ExecutionResult(stdout="10\n", stderr="", exit_code=0)

    response = client.post(
        "/execute", json={"code": "x = 5\nprint(x * 2)", "lang": "python", "libraries": []}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["stdout"] == "10\n"
    assert data["stderr"] == ""
    assert data["exit_code"] == 0

    # Verify the function was called with correct arguments
    mock_execute.assert_called_once_with(
        code="x = 5\nprint(x * 2)", lang="python", keep_template=False, libraries=[]
    )


@pytest.mark.unit
@patch("app.api.routes.execute_code")
def test_execute_endpoint_with_error(mock_execute):
    """Test /execute endpoint when code execution fails."""
    # Mock execution error
    mock_execute.return_value = ExecutionResult(
        stdout="", stderr="NameError: name 'x' is not defined\n", exit_code=1
    )

    response = client.post("/execute", json={"code": "print(x)", "lang": "python"})

    assert response.status_code == 200
    data = response.json()
    assert data["exit_code"] == 1
    assert "NameError" in data["stderr"]


@pytest.mark.unit
@patch("app.api.routes.execute_code")
def test_execute_endpoint_exception(mock_execute):
    """Test /execute endpoint when service raises exception."""
    # Mock service exception
    mock_execute.side_effect = Exception("Docker connection failed")

    response = client.post("/execute", json={"code": "print('hello')", "lang": "python"})

    assert response.status_code == 500
    assert "Docker connection failed" in response.json()["detail"]


@pytest.mark.unit
def test_execute_endpoint_validation():
    """Test /execute endpoint request validation."""
    # Missing required field 'code'
    response = client.post("/execute", json={"lang": "python"})

    assert response.status_code == 422  # Validation error


@pytest.mark.unit
def test_health_check():
    """Test health check endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
