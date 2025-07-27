@echo off
call npm run build
if %errorlevel% equ 0 (
    python -m http.server
) else (
    echo Compilation failed with error code %errorlevel%
    pause
)