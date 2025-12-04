@echo off
echo ========================================
echo Book RAG - Quick Setup Script
echo ========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ERROR: .env.local file not found!
    echo.
    echo Please create .env.local with:
    echo   - DATABASE_URL
    echo   - BETTER_AUTH_SECRET
    echo   - GEMINI_API_KEY
    echo.
    echo See .env.example for template
    pause
    exit /b 1
)

echo [1/6] Checking dependencies...
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

if not exist backend\node_modules (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

echo.
echo [2/6] Generating Better Auth secret (if needed)...
echo Run this command to generate: openssl rand -base64 32
echo.

echo [3/6] Starting Qdrant (Docker)...
echo Starting Qdrant in background...
start /B docker run -p 6333:6333 qdrant/qdrant
timeout /t 5 /nobreak >nul

echo.
echo [4/6] Running database migrations...
cd backend
call npx @better-auth/cli migrate
cd ..

echo.
echo [5/6] Starting services...
echo.
echo Opening 3 terminals:
echo   - Terminal 1: Backend (port 4000)
echo   - Terminal 2: Frontend (port 3000)
echo   - Terminal 3: Ready for ingestion
echo.

start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start cmd /k "npm start"
start cmd /k "echo Run 'cd backend && npm run ingest' to ingest content && cmd"

echo.
echo [6/6] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Wait for services to start
echo 2. In Terminal 3, run: cd backend && npm run ingest
echo 3. Visit: http://localhost:3000
echo ========================================
echo.
pause
