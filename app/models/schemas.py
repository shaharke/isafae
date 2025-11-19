from typing import List, Optional
from pydantic import BaseModel

class ExecutionRequest(BaseModel):
    code: str
    lang: str = "python"
    keep_template: bool = False
    libraries: Optional[List[str]] = []

class ExecutionResult(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
