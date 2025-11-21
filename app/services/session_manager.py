import uuid

from llm_sandbox import SandboxSession


class SessionManager:
    def __init__(self) -> None:
        self._sessions: dict[str, SandboxSession] = {}

    def create_session(self, lang: str = "python", keep_template: bool = False) -> str:
        """
        Creates a new sandbox session and returns its ID.
        """
        session_id = str(uuid.uuid4())
        session = SandboxSession(lang=lang, keep_template=keep_template)
        session.open()
        self._sessions[session_id] = session
        return session_id

    def get_session(self, session_id: str) -> SandboxSession | None:
        """
        Retrieves a session by ID.
        """
        return self._sessions.get(session_id)

    def close_session(self, session_id: str) -> bool:
        """
        Closes a session and removes it from the manager.
        Returns True if session existed and was closed, False otherwise.
        """
        session = self._sessions.pop(session_id, None)
        if session:
            session.close()
            return True
        return False

    def list_sessions(self) -> dict[str, SandboxSession]:
        """
        Returns all active sessions.
        """
        return self._sessions


# Global instance
session_manager = SessionManager()
