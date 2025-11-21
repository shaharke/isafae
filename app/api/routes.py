from fastapi import APIRouter, HTTPException, Path

from app.models.schemas import (
    CreateSessionRequest,
    CreateSessionResponse,
    EphemeralExecutionRequest,
    ExecuteSessionRequest,
    ExecutionResult,
)
from app.services.sandbox import execute_code
from app.services.session_manager import session_manager

router = APIRouter()


@router.post("/sessions", response_model=CreateSessionResponse)
def create_session(request: CreateSessionRequest) -> CreateSessionResponse:
    """
    Create a new sandbox session.
    """
    try:
        session_id = session_manager.create_session(
            lang=request.lang, keep_template=request.keep_template
        )
        return CreateSessionResponse(session_id=session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/sessions/{session_id}/execute", response_model=ExecutionResult)
def execute_in_session(
    request: ExecuteSessionRequest, session_id: str = Path(...)
) -> ExecutionResult:
    """
    Execute code in an existing sandbox session.
    """
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        result = session.run(request.code, libraries=request.libraries)
        return ExecutionResult(
            stdout=result.stdout, stderr=result.stderr, exit_code=result.exit_code
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.delete("/sessions/{session_id}")
def close_session(session_id: str = Path(...)) -> dict[str, str]:
    """
    Close a sandbox session.
    """
    if session_manager.close_session(session_id):
        return {"status": "closed"}
    raise HTTPException(status_code=404, detail="Session not found")


@router.post("/execute", response_model=ExecutionResult)
def execute_ephemeral(request: EphemeralExecutionRequest) -> ExecutionResult:
    """
    Execute code in an ephemeral sandbox.
    """
    try:
        return execute_code(
            code=request.code,
            lang=request.lang,
            keep_template=request.keep_template,
            libraries=request.libraries,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
