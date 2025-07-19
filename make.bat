emcc -lembind -o index.html main.cpp -O3 --shell-file html_template\shell_minimal.html
if %errorlevel% equ 0 (
    python -m http.server
) else (
    echo Compilation failed with error code %errorlevel%
    pause
)