"""
Unit tests for sandbox service.
These tests use mocks and do not require Docker.
"""

from unittest.mock import MagicMock, patch

import pytest

from app.models.schemas import ExecutionResult
from app.services.sandbox import execute_code


@pytest.mark.unit
@patch("app.services.sandbox.SandboxSession")
def test_execute_code_success(mock_sandbox_class: MagicMock) -> None:
    """Test execute_code function with successful execution."""
    # Mock the SandboxSession instance
    mock_session = MagicMock()
    mock_sandbox_class.return_value = mock_session

    # Mock the run result
    mock_result = MagicMock()
    mock_result.stdout = "Hello, World!\n"
    mock_result.stderr = ""
    mock_result.exit_code = 0
    mock_session.run.return_value = mock_result

    # Execute code
    result = execute_code(
        code="print('Hello, World!')", lang="python", keep_template=False, libraries=None
    )

    # Verify result
    assert isinstance(result, ExecutionResult)
    assert result.stdout == "Hello, World!\n"
    assert result.stderr == ""
    assert result.exit_code == 0

    # Verify sandbox lifecycle
    mock_sandbox_class.assert_called_once_with(lang="python", keep_template=False)
    mock_session.open.assert_called_once()
    mock_session.run.assert_called_once_with("print('Hello, World!')", libraries=None)
    mock_session.close.assert_called_once()


@pytest.mark.unit
@patch("app.services.sandbox.SandboxSession")
def test_execute_code_with_libraries(mock_sandbox_class: MagicMock) -> None:
    """Test execute_code with library installation."""
    mock_session = MagicMock()
    mock_sandbox_class.return_value = mock_session

    mock_result = MagicMock()
    mock_result.stdout = "3.14159\n"
    mock_result.stderr = ""
    mock_result.exit_code = 0
    mock_session.run.return_value = mock_result

    result = execute_code(
        code="import math\nprint(math.pi)", lang="python", libraries=["numpy", "pandas"]
    )

    assert result.exit_code == 0
    mock_session.run.assert_called_once_with(
        "import math\nprint(math.pi)", libraries=["numpy", "pandas"]
    )


@pytest.mark.unit
@patch("app.services.sandbox.SandboxSession")
def test_execute_code_cleanup_on_error(mock_sandbox_class: MagicMock) -> None:
    """Test that sandbox is cleaned up even when execution fails."""
    mock_session = MagicMock()
    mock_sandbox_class.return_value = mock_session

    # Simulate execution error
    mock_session.run.side_effect = Exception("Execution failed")

    # Should raise the exception
    with pytest.raises(Exception, match="Execution failed"):
        execute_code(code="bad code", lang="python")

    # But cleanup should still happen
    mock_session.open.assert_called_once()
    mock_session.close.assert_called_once()


@pytest.mark.unit
@patch("app.services.sandbox.SandboxSession")
def test_execute_code_cleanup_on_close_error(mock_sandbox_class: MagicMock) -> None:
    """Test that close errors don't prevent result from being returned."""
    mock_session = MagicMock()
    mock_sandbox_class.return_value = mock_session

    # Successful execution
    mock_result = MagicMock()
    mock_result.stdout = "Success\n"
    mock_result.stderr = ""
    mock_result.exit_code = 0
    mock_session.run.return_value = mock_result

    # But close fails
    mock_session.close.side_effect = Exception("Close failed")

    # Should still return the result (close error is swallowed)
    result = execute_code(code="print('Success')", lang="python")

    assert result.stdout == "Success\n"
    assert result.exit_code == 0
