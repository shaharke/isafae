#!/bin/bash
# Start the LLM Sandbox Server with Colima Docker support

export DOCKER_HOST=unix://$HOME/.colima/default/docker.sock

echo "Starting LLM Sandbox Server..."
echo "Docker Host: $DOCKER_HOST"
echo "Server will be available at: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""

./venv/bin/uvicorn app.main:app --reload
