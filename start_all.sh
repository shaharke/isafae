#!/bin/bash
# Start both the Proxy Server and Application Server

echo "========================================="
echo "Starting Dual-Server Architecture"
echo "========================================="
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $PROXY_PID $APP_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start the application server in the background
echo "Starting Application Server..."
cd app-server && ./start_app_server.sh &
APP_PID=$!
cd ..

# Give the app server a moment to start
sleep 2

# Start the proxy server in the background
echo ""
echo "Starting Proxy Server..."
cd proxy && ./start_proxy.sh &
PROXY_PID=$!
cd ..

echo ""
echo "========================================="
echo "Both servers are running!"
echo "App Server (Main Entry): http://localhost:3000"
echo "Proxy Server (Internal): http://localhost:8000"
echo "========================================="
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $PROXY_PID $APP_PID
