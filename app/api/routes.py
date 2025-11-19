from fastapi import APIRouter, HTTPException

from app.models.schemas import ExecutionRequest, ExecutionResult
from app.services.sandbox import execute_code

router = APIRouter()


@router.post("/execute", response_model=ExecutionResult)
def execute(request: ExecutionRequest) -> ExecutionResult:
    """
    Execute code in an ephemeral sandbox.

    Creates a new sandbox session, executes the code, and immediately cleans up.
    No state is maintained between requests.
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
