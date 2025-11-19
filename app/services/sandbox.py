from typing import Optional
from llm_sandbox import SandboxSession
from app.models.schemas import ExecutionResult


def execute_code(
    code: str,
    lang: str = "python",
    keep_template: bool = False,
    libraries: Optional[list] = None
) -> ExecutionResult:
    """
    Executes code in an ephemeral sandbox session.
    
    Creates a new sandbox, runs the code, and immediately cleans up.
    No state is maintained between calls.
    
    Args:
        code: The code to execute
        lang: Programming language (default: "python")
        keep_template: Whether to keep the template (default: False)
        libraries: Optional list of libraries to install
        
    Returns:
        ExecutionResult with stdout, stderr, and exit_code
        
    Raises:
        Exception: If sandbox creation or execution fails
    """
    session = None
    try:
        # Create and open a new sandbox session
        session = SandboxSession(lang=lang, keep_template=keep_template)
        session.open()
        
        # Execute the code
        result = session.run(code, libraries=libraries)
        
        # Map the result to our schema
        return ExecutionResult(
            stdout=result.stdout,
            stderr=result.stderr,
            exit_code=result.exit_code
        )
    finally:
        # Always clean up the session, even if execution fails
        if session:
            try:
                session.close()
            except Exception:
                # Log but don't raise - we want to return the execution result
                pass

