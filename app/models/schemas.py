from typing import List, Optional
from pydantic import BaseModel

class SessionCreate(BaseModel):
    lang: str = "python"
    keep_template: bool = False

class SessionResponse(BaseModel):
    session_id: str
    status: str

class ExecutionRequest(BaseModel):
    code: str
    libraries: Optional[List[str]] = []

class ExecutionResult(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
