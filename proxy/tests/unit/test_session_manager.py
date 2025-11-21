"""
Unit tests for SessionManager.
"""
from unittest.mock import Mock, patch

import pytest

from app.services.session_manager import SessionManager


@pytest.fixture
def session_manager() -> SessionManager:
    return SessionManager()


@pytest.mark.unit
@patch("app.services.session_manager.SandboxSession")
def test_create_session(mock_sandbox_cls: Mock, session_manager: SessionManager) -> None:
    """Test creating a session."""
    # Setup mock
    mock_session = Mock()
    mock_sandbox_cls.return_value = mock_session

    # Execute
    session_id = session_manager.create_session(lang="python", keep_template=True)

    # Verify
    assert isinstance(session_id, str)
    assert len(session_id) > 0
    assert session_manager.get_session(session_id) == mock_session

    mock_sandbox_cls.assert_called_once_with(lang="python", keep_template=True)
    mock_session.open.assert_called_once()


@pytest.mark.unit
def test_get_session_not_found(session_manager: SessionManager) -> None:
    """Test getting a non-existent session."""
    assert session_manager.get_session("non-existent") is None


@pytest.mark.unit
@patch("app.services.session_manager.SandboxSession")
def test_close_session(mock_sandbox_cls: Mock, session_manager: SessionManager) -> None:
    """Test closing a session."""
    # Setup mock
    mock_session = Mock()
    mock_sandbox_cls.return_value = mock_session

    # Create session first
    session_id = session_manager.create_session()

    # Close session
    result = session_manager.close_session(session_id)

    # Verify
    assert result is True
    assert session_manager.get_session(session_id) is None
    mock_session.close.assert_called_once()


@pytest.mark.unit
def test_close_session_not_found(session_manager: SessionManager) -> None:
    """Test closing a non-existent session."""
    assert session_manager.close_session("non-existent") is False


@pytest.mark.unit
@patch("app.services.session_manager.SandboxSession")
def test_list_sessions(mock_sandbox_cls: Mock, session_manager: SessionManager) -> None:
    """Test listing sessions."""
    # Create two sessions
    id1 = session_manager.create_session()
    id2 = session_manager.create_session()

    sessions = session_manager.list_sessions()

    assert len(sessions) == 2
    assert id1 in sessions
    assert id2 in sessions
