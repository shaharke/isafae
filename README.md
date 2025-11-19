# LLM Sandbox Web Server

A Python web server built with FastAPI that provides REST APIs for managing sandboxed code execution sessions using [llm-sandbox](https://vndee.github.io/llm-sandbox/).

## Features

- **Session Management**: Create, execute, and terminate isolated sandbox sessions
- **Multi-language Support**: Execute code in Python and other supported languages
- **Library Installation**: Dynamically install packages within sandbox sessions
- **Secure Isolation**: Uses Docker containers for secure code execution
- **REST API**: Clean, well-documented API endpoints

## Prerequisites

- Python 3.10+
- Docker (or Colima as a Docker alternative)

### Setting up Colima (macOS)

If you're using Colima instead of Docker Desktop:

```bash
# Install Colima
brew install colima

# Start Colima
colima start

# Verify Docker is working
docker ps
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd isafae
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

### Option 1: Using the startup script (recommended for Colima)
```bash
./start_server.sh
```

### Option 2: Manual start
```bash
# If using Colima, set the Docker host
export DOCKER_HOST=unix://$HOME/.colima/default/docker.sock

# Start the server
uvicorn app.main:app --reload
```

The API will be available at:
- **Base URL**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`
- **Alternative Docs**: `http://localhost:8000/redoc`

## API Endpoints

### Health Check
```bash
GET /
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

### Execute Code
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

### Stop Session
```bash
DELETE /sessions/{session_id}
```

**Response:**
```json
{
  "status": "terminated"
}
```

## Example Usage

```bash
# 1. Create a session
SESSION_ID=$(curl -s -X POST http://localhost:8000/sessions \
  -H "Content-Type: application/json" \
  -d '{"lang": "python"}' | jq -r '.session_id')

# 2. Execute code
curl -X POST http://localhost:8000/sessions/$SESSION_ID/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import numpy as np\nprint(np.array([1,2,3]).mean())",
    "libraries": ["numpy"]
  }'

# 3. Clean up
curl -X DELETE http://localhost:8000/sessions/$SESSION_ID
```

## Testing

Run the test suite:
```bash
PYTHONPATH=. pytest tests/
```

## Project Structure

```
.
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py        # API route handlers
│   ├── core/
│   │   └── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic models
│   └── services/
│       ├── __init__.py
│       └── sandbox.py       # Sandbox management logic
├── tests/
│   └── test_api.py          # API tests
├── requirements.txt
└── README.md
```

## Architecture

The server uses a simple architecture:

1. **FastAPI** handles HTTP requests and routing
2. **SandboxManager** manages the lifecycle of sandbox sessions
3. **llm-sandbox** provides the underlying container-based isolation
4. Sessions are stored in-memory (for MVP)

## Security Considerations

- Code execution is isolated in Docker containers
- Each session runs in its own container
- Resource limits can be configured via llm-sandbox
- For production use, consider:
  - Adding authentication/authorization
  - Implementing session timeouts
  - Setting resource quotas
  - Using persistent session storage

## License

See LICENSE file for details.
