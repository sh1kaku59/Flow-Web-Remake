@echo off
title Cloudflare Public Tunnel Launcher
echo ========================================================
echo   CLOUDFLARE PUBLIC TUNNEL LAUNCHER FOR FLOW PLATFORM
echo   Creating secure HTTPS public URL for http://localhost:5173 ...
echo ========================================================
echo.

if not exist "%~dp0cloudflared.exe" (
    echo [ERROR] File cloudflared.exe not found in %~dp0
    echo Please download cloudflared.exe and place it in the project root folder.
    pause
    exit /b
)

:loop
echo Starting Cloudflare Tunnel...
echo Copy the https://....trycloudflare.com link below to share with anyone!
echo.
"%~dp0cloudflared.exe" tunnel --url http://localhost:5173
echo.
echo Tunnel connection dropped. Reconnecting in 3 seconds...
timeout /t 3 /nobreak >nul
goto loop
