@echo off
title Flow Platform Local Launcher
echo ========================================================
echo   FLOW MEETING INTELLIGENCE & MANAGEMENT PLATFORM
echo   Launching Local Backend (FastAPI) and Frontend (Vite)...
echo ========================================================

echo.
echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "Flow Backend Server" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate && uvicorn app.api.main:app --reload --port 8000"

echo.
echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "Flow Frontend Web App" cmd /k "cd /d %~dp0frontend && npm run dev -- --host"

echo.
echo ========================================================
echo   Flow Platform is starting up!
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:8000/docs
echo ========================================================
echo.
