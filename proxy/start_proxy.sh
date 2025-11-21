#!/bin/bash
# Start the LLM Sandbox Proxy Server with Colima Docker support

export DOCKER_HOST=unix://$HOME/.colima/default/docker.sock

echo "Starting LLM Sandbox Proxy Server..."
echo "Docker Host: $DOCKER_HOST"
echo "Proxy Server will be available at: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""

# Use the virtual environment from the parent directory if it exists, otherwise use local one
if [ -d "../.venv/bin/uvicorn" ]; then
    ../.venv/bin/uvicorn app.main:app --reload
elif [ -d "../venv/bin/uvicorn" ]; then
    ../venv/bin/uvicorn app.main:app --reload
elif [ -d ".venv/bin/uvicorn" ]; then
    .venv/bin/uvicorn app.main:app --reload
else
    uvicorn app.main:app --reload
fi
