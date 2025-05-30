@echo off
REM 🔥 Roasted MCP Setup Script for Windows
REM Automates the entire setup process for developers

echo.
echo 🔥 Welcome to Roasted MCP Setup!
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1 delims=." %%i in ('node -v') do set NODE_MAJOR=%%i
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% lss 18 (
    echo ❌ Node.js version 18+ required. Current version: 
    node -v
    pause
    exit /b 1
)
echo ✅ Node.js version check passed

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)
echo ✅ npm found

echo.
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo Building project...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build project
    pause
    exit /b 1
)
echo ✅ Project built successfully

echo.
echo Testing installation...
node test-local.js >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Installation test passed
) else (
    echo ⚠️  Installation test had issues (this might be due to browser permissions)
)

REM Get current directory
set CURRENT_DIR=%CD%

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo ℹ️  Next steps:
echo.
echo 1. Add this to your Claude Desktop config:
echo    Location: %APPDATA%\Claude\claude_desktop_config.json
echo.
echo {
echo   "mcpServers": {
echo     "roasted": {
echo       "command": "node",
echo       "args": ["%CURRENT_DIR:\=\\%\\dist\\index.js"],
echo       "cwd": "%CURRENT_DIR:\=\\%"
echo     }
echo   }
echo }
echo.
echo 2. Restart Claude Desktop
echo.
echo 3. Try asking Claude: 'Can you roast my browser history?'
echo.
echo ⚠️  You may need to allow Claude Desktop to access your browser data
echo    in Windows privacy settings if you encounter permission issues.
echo.
echo 🔥 Ready to get roasted! 🔥
echo.

set /p RESPONSE="Would you like me to create a config file for you? (y/n): "
if /i "%RESPONSE%"=="y" (
    set CLAUDE_CONFIG_DIR=%APPDATA%\Claude
    set CLAUDE_CONFIG=%CLAUDE_CONFIG_DIR%\claude_desktop_config.json
    
    if not exist "%CLAUDE_CONFIG_DIR%" (
        mkdir "%CLAUDE_CONFIG_DIR%"
        echo ✅ Created Claude config directory
    )
    
    if exist "%CLAUDE_CONFIG%" (
        echo ⚠️  Backing up existing config to claude_desktop_config.json.backup
        copy "%CLAUDE_CONFIG%" "%CLAUDE_CONFIG%.backup" >nul
        echo ℹ️  Please manually merge the roasted server configuration.
        echo ℹ️  Configuration snippet saved to roasted-config.json
    ) else (
        echo ✅ Creating new Claude Desktop config
    )
    
    REM Create config snippet
    (
        echo {
        echo   "mcpServers": {
        echo     "roasted": {
        echo       "command": "node",
        echo       "args": ["%CURRENT_DIR:\=\\%\\dist\\index.js"],
        echo       "cwd": "%CURRENT_DIR:\=\\%"
        echo     }
        echo   }
        echo }
    ) > roasted-config.json
    
    if not exist "%CLAUDE_CONFIG%" (
        copy roasted-config.json "%CLAUDE_CONFIG%" >nul
        echo ✅ Config created at %CLAUDE_CONFIG%
    )
    
    echo ✅ Please restart Claude Desktop to load the new configuration
)

echo.
echo ℹ️  For troubleshooting, run: node test-local.js
echo ℹ️  For more options, check the README.md
echo.
echo Happy roasting! 🔥
pause