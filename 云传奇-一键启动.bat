@echo off
setlocal
chcp 65001 >nul

set "ROOT=%~dp0"
set "SERVER=%ROOT%server.js"
set "PORT=3000"
set "URL=http://localhost:%PORT%"

if not exist "%SERVER%" (
  echo [ERROR] server.js not found.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Please install Node.js first.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>nul
if errorlevel 1 (
  echo [INFO] Starting YunChuanQi server...
  start "YunChuanQi Server" cmd /k "cd /d ""%ROOT%"" && node server.js"

  powershell -NoProfile -ExecutionPolicy Bypass -Command "$deadline=(Get-Date).AddSeconds(15); do { Start-Sleep -Milliseconds 500; $ok=[bool](Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue) } until ($ok -or (Get-Date) -gt $deadline); if ($ok) { exit 0 } else { exit 1 }" >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] Server did not start on port %PORT%.
    echo [HINT] Check the server window for details.
    pause
    exit /b 1
  )
) else (
  echo [INFO] Server is already running on port %PORT%.
)

start "" "%URL%"
exit /b 0
