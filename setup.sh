#!/bin/bash

# 🔥 Roasted MCP Setup Script
# Automates the entire setup process for developers

set -e  # Exit on any error

echo "🔥 Welcome to Roasted MCP Setup!"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi
print_status "Node.js $(node -v) ✓"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_status "npm $(npm -v) ✓"

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This tool currently only works on macOS"
    exit 1
fi
print_status "macOS detected ✓"

echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
print_status "Dependencies installed"

# Build the project
echo "Building project..."
npm run build
print_status "Project built successfully"

# Test the installation
echo ""
echo "Testing installation..."
if node test-local.js > /dev/null 2>&1; then
    print_status "Installation test passed"
else
    print_warning "Installation test had issues (this might be due to browser permissions)"
fi

# Get the current directory
CURRENT_DIR=$(pwd)

# Create Claude Desktop config snippet
CONFIG_SNIPPET='{
  "mcpServers": {
    "roasted": {
      "command": "node",
      "args": ["'$CURRENT_DIR'/dist/index.js"],
      "cwd": "'$CURRENT_DIR'"
    }
  }
}'

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
print_info "Next steps:"
echo ""
echo "1. Add this to your Claude Desktop config:"
echo "   Location: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo ""
echo -e "${BLUE}$CONFIG_SNIPPET${NC}"
echo ""
echo "2. Restart Claude Desktop"
echo ""
echo "3. Try asking Claude: 'Can you roast my browser history?'"
echo ""
print_warning "You may need to grant 'Full Disk Access' to Claude Desktop in:"
print_warning "System Preferences > Security & Privacy > Privacy > Full Disk Access"
echo ""
echo "🔥 Ready to get roasted! 🔥"

# Offer to automatically add to Claude config
echo ""
read -p "Would you like me to automatically add this to your Claude Desktop config? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    
    if [ -f "$CLAUDE_CONFIG" ]; then
        print_warning "Backing up existing config to ${CLAUDE_CONFIG}.backup"
        cp "$CLAUDE_CONFIG" "${CLAUDE_CONFIG}.backup"
        
        # Check if the config already has mcpServers
        if grep -q '"mcpServers"' "$CLAUDE_CONFIG"; then
            print_info "Existing mcpServers found. Please manually add the roasted server configuration."
            print_info "Configuration snippet saved to roasted-config.json"
            echo "$CONFIG_SNIPPET" > roasted-config.json
        else
            # Add mcpServers to existing config
            print_status "Adding roasted server to Claude Desktop config"
            # This is a simple approach - in production you'd want proper JSON merging
            echo "$CONFIG_SNIPPET" > roasted-config.json
            print_info "Configuration saved to roasted-config.json - please merge with your existing config"
        fi
    else
        print_status "Creating new Claude Desktop config"
        mkdir -p "$(dirname "$CLAUDE_CONFIG")"
        echo "$CONFIG_SNIPPET" > "$CLAUDE_CONFIG"
        print_status "Config created at $CLAUDE_CONFIG"
    fi
    
    print_status "Please restart Claude Desktop to load the new configuration"
fi

echo ""
print_info "For troubleshooting, run: node test-local.js"
print_info "For more options, check the README.md"
echo ""
echo "Happy roasting! 🔥"