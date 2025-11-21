# LLM Sandbox Web Server

A dual-server architecture built with NestJS (Node.js) and FastAPI (Python) that provides REST APIs for managing sandboxed code execution sessions using [llm-sandbox](https://vndee.github.io/llm-sandbox/).

## Architecture

This project uses a dual-server architecture:

- **Application Server** (NestJS/Fastify): Main entry point, handles client requests and business logic
- **Proxy Server** (Python/FastAPI): Manages LLM sandbox operations and Docker containers

```
┌─────────────┐         ┌─────────────────┐         ┌──────────────┐         ┌───────────────┐
│   Client    │────────▶│  App Server     │────────▶│ Proxy Server │────────▶│ LLM Sandbox   │
│             │         │ (NestJS/Fastify)│         │ (FastAPI)    │         │ (Docker)      │
│             │◀────────│  Port: 3000     │◀────────│ Port: 8000   │◀────────│               │
└─────────────┘         └─────────────────┘         └──────────────┘         └───────────────┘
```

## Features

- **Session Management**: Create, execute, and terminate isolated sandbox sessions
- **Multi-language Support**: Execute code in Python and other supported languages
- **Library Installation**: Dynamically install packages within sandbox sessions
- **Secure Isolation**: Uses Docker containers for secure code execution
- **REST API**: Clean, well-documented API endpoints
- **Dual-Server Architecture**: Separation of concerns between proxy and application logic

## Prerequisites

- Python 3.10+
- Node.js 20+
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

2. **Install Proxy Server Dependencies (Python)**:
```bash
cd proxy
python3 -m venv ../.venv
source ../.venv/bin/activate  # On Windows: ..\.venv\Scripts\activate
uv sync
cd ..
```

3. **Install App Server Dependencies (Node.js)**:
```bash
cd app-server
npm install
cd ..
```

## Running the Servers

### Option 1: Start Both Servers (Recommended)
```bash
./start_all.sh
```

This will start both the proxy server (port 8000) and the application server (port 3000).

### Option 2: Start Servers Individually

**Proxy Server:**
```bash
cd proxy
./start_proxy.sh
```

**Application Server:**
```bash
cd app-server
./start_app_server.sh
```

The API will be available at:
- **App Server** (Main Entry Point): `http://localhost:3000`
- **Proxy Server** (Internal): `http://localhost:8000`
- **API Documentation**: `http://localhost:3000/docs` (when implemented)

## API Endpoints

> [!NOTE]
> The current implementation has endpoints on both servers. In production, clients should connect to the App Server (port 3000), which will communicate with the Proxy Server (port 8000) internally.

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

> [!NOTE]
> The examples below use the App Server API (port 3000). The App Server is the main entry point for clients.

### Using the App Server (Recommended)

```bash

# Execute code (placeholder implementation)
curl -X POST http://localhost:3000/sandbox/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello from App Server!\")",
    "lang": "python",
    "libraries": ["numpy"]
  }'
```

### Using the Proxy Server Directly (For Testing)

For direct access to the proxy server's sandbox functionality:

```bash
# 1. Create a session
SESSION_ID=$(curl -s -X POST http://localhost:8000/sessions \
  -H "Content-Type: application/json" \
  -d '{"lang": "python"}' | jq -r '.session_id')

# 2. Execute code
curl -X POST http://localhost:8000/sessions/$SESSION_ID/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import numpy as np\\nprint(np.array([1,2,3]).mean())",
    "libraries": ["numpy"]
  }'

# 3. Clean up
curl -X DELETE http://localhost:8000/sessions/$SESSION_ID
```

## Testing

### Proxy Server Tests
```bash
cd proxy
pytest tests/ -v
```

### App Server Tests
```bash
cd app-server
npm test
```

## Project Structure

```
.
├── proxy/                    # Python FastAPI proxy server
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── api/
│   │   │   └── routes.py    # API route handlers
│   │   ├── core/
│   │   ├── models/
│   │   │   └── schemas.py   # Pydantic models
│   │   └── services/
│   │       └── sandbox.py   # Sandbox management logic
│   ├── tests/
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── start_proxy.sh
├── app-server/              # NestJS/Fastify application server
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── sandbox/
│   │   │   ├── sandbox.module.ts
│   │   │   ├── sandbox.controller.ts
│   │   │   ├── sandbox.service.ts
│   │   │   └── dto/
│   │   └── common/
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   └── start_app_server.sh
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── start_all.sh            # Start both servers
```

## Development

### Proxy Server (Python)

- **Linting**: `cd proxy && ruff check .`
- **Formatting**: `cd proxy && ruff format .`
- **Type Checking**: `cd proxy && mypy app/`
- **Tests**: `cd proxy && pytest tests/`

### App Server (Node.js)

- **Linting**: `cd app-server && npm run lint`
- **Development Mode**: `cd app-server && npm run start:dev`
- **Tests**: `cd app-server && npm test`
- **Build**: `cd app-server && npm run build`

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
