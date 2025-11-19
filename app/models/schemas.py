from pydantic import BaseModel


class ExecutionRequest(BaseModel):
    code: str
    lang: str = "python"
    keep_template: bool = False
    libraries: list[str] | None = []


class ExecutionResult(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
