"""
End-to-end tests for code execution.
These tests use real Docker sandboxes and do NOT use mocks.
Requires Docker to be running.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


@pytest.mark.e2e
def test_execute_simple_python_code() -> None:
    """E2E test: Execute simple Python code in real sandbox."""
    response = client.post("/execute", json={"code": "print('Hello, World!')", "lang": "python"})

    assert response.status_code == 200
    data = response.json()
    assert data["stdout"] == "Hello, World!\n"
    assert data["stderr"] == ""
    assert data["exit_code"] == 0


@pytest.mark.e2e
def test_execute_python_with_math() -> None:
    """E2E test: Execute Python code with calculations."""
    response = client.post(
        "/execute", json={"code": "x = 5\ny = 10\nprint(x + y)\nprint(x * y)", "lang": "python"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "15\n" in data["stdout"]
    assert "50\n" in data["stdout"]
    assert data["exit_code"] == 0


@pytest.mark.e2e
def test_execute_python_with_error() -> None:
    """E2E test: Execute Python code that raises an error."""
    response = client.post("/execute", json={"code": "print(undefined_variable)", "lang": "python"})

    assert response.status_code == 200
    data = response.json()
    assert data["exit_code"] == 1
    assert "NameError" in data["stderr"] or "undefined_variable" in data["stderr"]


@pytest.mark.e2e
def test_execute_python_multiline() -> None:
    """E2E test: Execute multi-line Python code with function."""
    code = """
def greet(name):
    return f"Hello, {name}!"

result = greet("Docker")
print(result)
"""

    response = client.post("/execute", json={"code": code, "lang": "python"})

    assert response.status_code == 200
    data = response.json()
    assert "Hello, Docker!" in data["stdout"]
    assert data["exit_code"] == 0


@pytest.mark.e2e
def test_execute_python_with_builtin_library() -> None:
    """E2E test: Execute Python code using built-in libraries."""
    code = """
import json
data = {"name": "test", "value": 42}
print(json.dumps(data))
"""

    response = client.post("/execute", json={"code": code, "lang": "python"})

    assert response.status_code == 200
    data = response.json()
    assert '"name": "test"' in data["stdout"]
    assert '"value": 42' in data["stdout"]
    assert data["exit_code"] == 0


@pytest.mark.e2e
def test_stateless_execution() -> None:
    """E2E test: Verify executions are stateless (no shared state)."""
    # First execution sets a variable
    response1 = client.post("/execute", json={"code": "x = 100\nprint(x)", "lang": "python"})

    assert response1.status_code == 200
    assert "100\n" in response1.json()["stdout"]

    # Second execution should NOT have access to x
    response2 = client.post(
        "/execute",
        json={
            "code": "print(x)",  # x should not be defined
            "lang": "python",
        },
    )

    assert response2.status_code == 200
    data2 = response2.json()
    assert data2["exit_code"] == 1  # Should fail
    assert "NameError" in data2["stderr"] or "not defined" in data2["stderr"]
