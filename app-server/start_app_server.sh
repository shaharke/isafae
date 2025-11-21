#!/bin/bash
# Start the NestJS Application Server

export NODE_ENV=development
export PORT=3000

echo "Starting NestJS Application Server..."
echo "Environment: $NODE_ENV"
echo "Application Server will be available at: http://localhost:$PORT"
echo ""

npm run start:dev
