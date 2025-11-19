from fastapi import APIRouter, HTTPException
from app.models.schemas import SessionCreate, SessionResponse, ExecutionRequest, ExecutionResult
from app.services.sandbox import sandbox_manager

router = APIRouter()

@router.post("/sessions", response_model=SessionResponse)
def create_session(session_in: SessionCreate):
    try:
        session_id = sandbox_manager.create_session(lang=session_in.lang, keep_template=session_in.keep_template)
        return SessionResponse(session_id=session_id, status="active")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sessions/{session_id}/execute", response_model=ExecutionResult)
def execute_code(session_id: str, request: ExecutionRequest):
    try:
        result = sandbox_manager.execute_code(session_id, request.code, request.libraries)
        return result
    except ValueError:
        raise HTTPException(status_code=404, detail="Session not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/sessions/{session_id}")
def stop_session(session_id: str):
    sandbox_manager.stop_session(session_id)
    return {"status": "terminated"}

@router.get("/sessions")
def list_sessions():
    return {"sessions": list(sandbox_manager.sessions.keys())}
