@echo off
REM Restaurant Reservation API - Newman Test Runner for Windows
REM This script runs the complete test suite using Newman

setlocal enabledelayedexpansion

echo ========================================
echo Restaurant Reservation API Test Suite
echo ========================================
echo.

REM Check if Newman is installed
where newman >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Newman is not installed!
    echo [INFO] Installing Newman globally...
    call npm install -g newman
    call npm install -g newman-reporter-htmlextra
)

REM Check if server is running
echo [INFO] Checking if server is running on http://localhost:3000...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Server is not running on http://localhost:3000
    echo [INFO] Please start the development server first:
    echo   pnpm dev
    exit /b 1
)
echo [SUCCESS] Server is running
echo.

REM Create reports directory
set REPORTS_DIR=tests\reports
if not exist "%REPORTS_DIR%" mkdir "%REPORTS_DIR%"

REM Get timestamp for report naming
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set TIMESTAMP=%mydate%_%mytime%
set REPORT_NAME=test-report-%TIMESTAMP%

echo [INFO] Running Newman tests...
echo.

REM Run Newman with collection and environment
call newman run tests\restaurant-api.postman_collection.json ^
  -e tests\environment.json ^
  --reporters cli,htmlextra,json ^
  --reporter-htmlextra-export "%REPORTS_DIR%\%REPORT_NAME%.html" ^
  --reporter-json-export "%REPORTS_DIR%\%REPORT_NAME%.json" ^
  --color on ^
  --timeout-request 10000 ^
  --bail ^
  --verbose

set EXIT_CODE=%errorlevel%

echo.
echo ========================================

if %EXIT_CODE% equ 0 (
    echo [SUCCESS] All tests passed successfully!
    echo [INFO] HTML Report: %REPORTS_DIR%\%REPORT_NAME%.html
    echo [INFO] JSON Report: %REPORTS_DIR%\%REPORT_NAME%.json
) else (
    echo [ERROR] Tests failed with exit code: %EXIT_CODE%
    echo [INFO] Check the reports for details:
    echo   - %REPORTS_DIR%\%REPORT_NAME%.html
    echo   - %REPORTS_DIR%\%REPORT_NAME%.json
)

echo ========================================

exit /b %EXIT_CODE%
