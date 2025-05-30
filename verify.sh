#!/bin/bash

# 🔥 Roasted MCP Verification Script
# Quick health check to ensure everything is working

set -e

echo "🔥 Roasted MCP Verification"
echo "========================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_check() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || ! grep -q "roasted-mcp" package.json; then
    print_error "Not in the roasted-mcp directory. Run this from the project root."
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_check "Node.js $NODE_VERSION installed"
else
    print_error "Node.js not found"
    exit 1
fi

# Check if built
if [ -d "dist" ] && [ -f "dist/index.js" ]; then
    print_check "Project built successfully"
else
    print_error "Project not built. Run: npm run build"
    exit 1
fi

# Test MCP server responds
echo ""
echo "Testing MCP server..."
if echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | node dist/index.js > /dev/null 2>&1; then
    print_check "MCP server responds to tool list requests"
else
    print_error "MCP server not responding correctly"
    exit 1
fi

# Test roasting functionality
echo ""
echo "Testing roasting functionality..."
ROAST_OUTPUT=$(echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "roast_browser_history", "arguments": {"days": 3, "severity": "gentle"}}}' | node dist/index.js 2>/dev/null)

if echo "$ROAST_OUTPUT" | grep -q "result"; then
    print_check "Roasting functionality works"
    
    # Check if actual roast was generated (not just privacy message)
    if echo "$ROAST_OUTPUT" | grep -q "Privacy level.*analyzed.*visits"; then
        print_check "Browser history was analyzed and roasted"
    elif echo "$ROAST_OUTPUT" | grep -q "nothing left to roast"; then
        print_warning "No history found after privacy filtering (this is normal if you have little browsing history)"
    else
        print_warning "Roast generated but format unexpected"
    fi
else
    print_error "Roasting functionality failed"
    echo "Output: $ROAST_OUTPUT"
    exit 1
fi

# Test demo script
echo ""
echo "Testing demo script..."
if [ -f "demo.js" ]; then
    print_check "Demo script exists"
    # Don't run the full demo as it's slow, just check it starts
    if timeout 5s node demo.js > /dev/null 2>&1 || [ $? -eq 124 ]; then
        print_check "Demo script runs (timed out after 5s, which is expected)"
    else
        print_warning "Demo script may have issues"
    fi
else
    print_error "Demo script missing"
fi

# Check documentation files
echo ""
echo "Checking documentation..."
DOCS=("README.md" "DEVELOPER_SETUP.md" "TROUBLESHOOTING.md" "EXAMPLES.md" "SHARING.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        print_check "$doc exists"
    else
        print_error "$doc missing"
    fi
done

# Check setup script
echo ""
echo "Checking setup script..."
if [ -f "setup.sh" ] && [ -x "setup.sh" ]; then
    print_check "Setup script exists and is executable"
else
    print_error "Setup script missing or not executable"
fi

# Check Claude Desktop config location
echo ""
echo "Checking Claude Desktop config..."
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -f "$CLAUDE_CONFIG" ]; then
    print_check "Claude Desktop config file exists"
    if grep -q "roasted" "$CLAUDE_CONFIG"; then
        print_check "Roasted server found in Claude config"
    else
        print_warning "Roasted server not configured in Claude Desktop"
        echo "  Add this server to your Claude config and restart Claude Desktop"
    fi
else
    print_warning "Claude Desktop config file not found"
    echo "  Run ./setup.sh to create it"
fi

# Browser database access check
echo ""
echo "Checking browser database access..."

# Safari
if [ -f "$HOME/Library/Safari/History.db" ]; then
    if [ -r "$HOME/Library/Safari/History.db" ]; then
        print_check "Safari history database accessible"
    else
        print_warning "Safari history database exists but not readable (permission issue)"
    fi
else
    print_warning "Safari history database not found"
fi

# Chrome
CHROME_DB="$HOME/Library/Application Support/Google/Chrome/Default/History"
if [ -f "$CHROME_DB" ]; then
    if [ -r "$CHROME_DB" ]; then
        print_check "Chrome history database accessible"
    else
        print_warning "Chrome history database exists but not readable (permission issue)"
    fi
else
    print_warning "Chrome history database not found"
fi

echo ""
echo "🎉 Verification Complete!"
echo "======================="

# Summary recommendations
echo ""
echo "Next steps:"
echo "1. If any errors above, fix them before sharing"
echo "2. Run: node demo.js (to see it in action)"
echo "3. Test in Claude: 'Can you roast my browser history?'"
echo "4. Share with other developers!"
echo ""
echo "For troubleshooting, see: TROUBLESHOOTING.md"
echo "For setup help, see: DEVELOPER_SETUP.md"