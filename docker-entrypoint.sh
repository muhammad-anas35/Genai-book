#!/bin/sh
set -e

echo "Starting Book RAG application..."

# Start backend in background
cd /app/backend
echo "Starting backend on port 4000..."
node dist/server.js &

# Start frontend
cd /app/frontend
echo "Starting frontend on port 3000..."
serve -s build -l 3000

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
