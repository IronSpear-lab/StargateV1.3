#!/bin/bash

echo "Starting Djungel Backend..."
cd /app/djungel-backend # Use absolute path for cd
npm run dev > /app/djungel-backend/djungel-backend-dev.log 2>&1 &
BACKEND_PID=$!
echo "Djungel Backend started with PID $BACKEND_PID (logs in /app/djungel-backend/djungel-backend-dev.log)"
cd /app # Go back to root using absolute path

echo ""
echo "Starting Starterkit Frontend..."
cd /app/packages/javascript/starterkit # Use absolute path for cd
npm run dev > /app/packages/javascript/starterkit/starterkit-frontend-dev.log 2>&1 &
FRONTEND_PID=$!
echo "Starterkit Frontend started with PID $FRONTEND_PID (logs in /app/packages/javascript/starterkit/starterkit-frontend-dev.log)"
cd /app # Go back to root using absolute path

echo ""
echo "Both services launched in background."
echo "To stop them, you might need to use 'kill $BACKEND_PID $FRONTEND_PID' or find processes by port."
# The script will end here, and the background processes will continue.
