from typing import Dict, Optional
from llm_sandbox import SandboxSession
from app.models.schemas import ExecutionResult

class SandboxManager:
    def __init__(self):
        # In-memory storage for active sessions.
        # Key: session_id, Value: SandboxSession instance
        self.sessions: Dict[str, SandboxSession] = {}

    def create_session(self, lang: str = "python", keep_template: bool = False) -> str:
        """
        Creates a new sandbox session and returns its ID.
        """
        session = SandboxSession(lang=lang, keep_template=keep_template)
        session.open()
        # We use the container ID or a generated UUID as the session ID.
        # SandboxSession doesn't seem to expose a unique ID easily other than the container object.
        # Let's generate a UUID for our tracking.
        import uuid
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = session
        return session_id

    def get_session(self, session_id: str) -> Optional[SandboxSession]:
        return self.sessions.get(session_id)

    def execute_code(self, session_id: str, code: str, libraries: Optional[list] = None) -> ExecutionResult:
        session = self.get_session(session_id)
        if not session:
            raise ValueError("Session not found")
        
        result = session.run(code, libraries=libraries)
        # The result object from llm-sandbox usually has stdout, stderr, exit_code
        # We map it to our schema.
        return ExecutionResult(
            stdout=result.stdout,
            stderr=result.stderr,
            exit_code=result.exit_code
        )

    def stop_session(self, session_id: str):
        session = self.sessions.pop(session_id, None)
        if session:
            session.close()

# Global instance
sandbox_manager = SandboxManager()
