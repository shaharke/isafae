#!/bin/bash
# Start Proxy Server, Application Server, and Admin UI

echo "========================================="
echo "Starting All Services"
echo "========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Shutting down all services..."
    kill $PROXY_PID $APP_PID $ADMIN_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start the application server in the background
echo "Starting Application Server..."
(cd "$SCRIPT_DIR/app-server" && ./start_app_server.sh) &
APP_PID=$!

# Give the app server a moment to start
sleep 2

# Start the proxy server in the background
echo ""
echo "Starting Proxy Server..."
(cd "$SCRIPT_DIR/proxy" && ./start_proxy.sh) &
PROXY_PID=$!

# Give the proxy server a moment to start
sleep 1

# Start the admin UI in the background
echo ""
echo "Starting Admin UI..."
(cd "$SCRIPT_DIR/admin-ui" && npm run dev) &
ADMIN_PID=$!

echo ""
echo "========================================="
echo "All services are running!"
echo "App Server (Main API): http://localhost:3000"
echo "Proxy Server (Internal): http://localhost:8000"
echo "Admin UI (Dashboard): http://localhost:5173"
echo "========================================="
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all processes
wait $PROXY_PID $APP_PID $ADMIN_PID
