from pydantic import BaseModel


class CreateSessionRequest(BaseModel):
    lang: str = "python"
    keep_template: bool = False


class CreateSessionResponse(BaseModel):
    session_id: str


class ExecuteSessionRequest(BaseModel):
    code: str
    libraries: list[str] | None = []


class ExecutionResult(BaseModel):
    stdout: str
    stderr: str
    exit_code: int


class EphemeralExecutionRequest(BaseModel):
    code: str
    lang: str = "python"
    keep_template: bool = False
    libraries: list[str] | None = []
