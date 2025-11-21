# Proxy Server

Python FastAPI server that manages LLM sandbox operations and Docker containers for code execution.

## Overview

The Proxy Server is the internal component of the dual-server architecture that handles:
- LLM sandbox session management
- Docker container lifecycle
- Code execution in isolated environments
- Library installation within sandboxes

This server is designed to be called by the App Server, not directly by clients in production.

## Architecture

```
┌─────────────────┐         ┌──────────────┐         ┌───────────────┐
│  App Server     │────────▶│ Proxy Server │────────▶│ LLM Sandbox   │
│ (NestJS/Fastify)│         │ (FastAPI)    │         │ (Docker)      │
│  Port: 3000     │◀────────│ Port: 8000   │◀────────│               │
└─────────────────┘         └──────────────┘         └───────────────┘
```

## Prerequisites

- Python 3.10+
- Docker (or Colima as a Docker alternative)
- uv (for dependency management)

## Installation

```bash
# From the proxy directory
uv sync
```

## Running the Server

```bash
./start_proxy.sh
```

The proxy server will be available at `http://localhost:8000`.

## API Endpoints

### Health Check
```bash
GET /
```

**Response:**
```json
{
  "status": "ok"
}
```

### Create Session
```bash
POST /sessions
Content-Type: application/json

{
  "lang": "python",
  "keep_template": false
}
```

**Response:**
```json
{
  "session_id": "uuid-here",
  "status": "active"
}
```

### Execute Code in Session
```bash
POST /sessions/{session_id}/execute
Content-Type: application/json

{
  "code": "print('Hello, World!')",
  "libraries": ["numpy"]
}
```

**Response:**
```json
{
  "stdout": "Hello, World!\n",
  "stderr": "",
  "exit_code": 0
}
```

### Execute Code (Ephemeral)
```bash
POST /execute
Content-Type: application/json

{
  "code": "print('Hello, World!')",
  "lang": "python",
  "keep_template": false,
  "libraries": []
}
```

**Response:**
```json
{
  "stdout": "Hello, World!\n",
  "stderr": "",
  "exit_code": 0
}
```

### List Sessions
```bash
GET /sessions
```

**Response:**
```json
{
  "sessions": ["session-id-1", "session-id-2"]
}
```

### Close Session
```bash
DELETE /sessions/{session_id}
```

**Response:**
```json
{
  "status": "closed"
}
```

## Example Usage

### Session-based Execution

```bash
# 1. Create a session
SESSION_ID=$(curl -s -X POST http://localhost:8000/sessions \
  -H "Content-Type: application/json" \
  -d '{"lang": "python"}' | jq -r '.session_id')

echo "Created session: $SESSION_ID"

# 2. Execute code in the session
curl -X POST http://localhost:8000/sessions/$SESSION_ID/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import numpy as np\nprint(np.array([1,2,3]).mean())",
    "libraries": ["numpy"]
  }'

# 3. Execute more code in the same session (state is preserved)
curl -X POST http://localhost:8000/sessions/$SESSION_ID/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Previous imports are still available\")\nprint(np.__version__)"
  }'

# 4. Clean up
curl -X DELETE http://localhost:8000/sessions/$SESSION_ID
```

### Ephemeral Execution

For one-off code execution without session management:

```bash
curl -X POST http://localhost:8000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import sys\nprint(f\"Python {sys.version}\")",
    "lang": "python"
  }'
```

### With Error Handling

```bash
# Execute code that will fail
curl -X POST http://localhost:8000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(undefined_variable)",
    "lang": "python"
  }'

# Response will include stderr:
# {
#   "stdout": "",
#   "stderr": "NameError: name 'undefined_variable' is not defined",
#   "exit_code": 1
# }
```

## Testing

### Run Unit Tests
```bash
pytest tests/unit/ -v
```

### Run E2E Tests (requires Docker)
```bash
pytest tests/e2e/ -v
```

### Run All Tests with Coverage
```bash
pytest tests/ -v --cov=app --cov-report=term --cov-report=html
```

## Development

### Linting
```bash
ruff check .
```

### Formatting
```bash
ruff format .
```

### Type Checking
```bash
mypy app/
```

## Project Structure

```
proxy/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   └── routes.py        # API route handlers
│   ├── core/
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   └── services/
│       ├── sandbox.py       # Ephemeral sandbox execution
│       └── session_manager.py  # Session management
├── tests/
│   ├── unit/                # Unit tests (mocked)
│   └── e2e/                 # E2E tests (real Docker)
├── pyproject.toml           # Project configuration
├── pytest.ini               # Pytest configuration
└── start_proxy.sh           # Startup script
```

## Configuration

### Environment Variables

- `DOCKER_HOST`: Docker socket location (default: `unix://$HOME/.colima/default/docker.sock`)
- `PORT`: Server port (default: 8000)

### Docker Setup (Colima)

```bash
# Start Colima
colima start

# Verify Docker is working
docker ps
```

## Security Considerations

- Code execution is isolated in Docker containers
- Each session runs in its own container
- Resource limits can be configured via llm-sandbox
- Sessions should have timeouts in production
- Consider adding authentication for production use

## Troubleshooting

### Docker Connection Issues

If you see "Cannot connect to Docker daemon":

```bash
# Check if Docker/Colima is running
docker ps

# If using Colima, ensure it's started
colima start

# Verify DOCKER_HOST is set correctly
echo $DOCKER_HOST
```

### Session Not Found

Sessions are stored in-memory and will be lost if the server restarts. For production, consider implementing persistent session storage.

## See Also

- Main project documentation: [../README.md](../README.md)
- App Server documentation: [../app-server/README.md](../app-server/README.md)
- LLM Sandbox documentation: https://vndee.github.io/llm-sandbox/
