# 🔥 Developer Setup Guide - Get Roasted in 5 Minutes

> **TLDR**: Run `./setup.sh` and follow the prompts. You'll be getting roasted in under 5 minutes.

## ⚡ Quick Start (Automated)

```bash
git clone <this-repo>
cd roasted
./setup.sh
```

The setup script will:
- ✅ Check all prerequisites
- ✅ Install dependencies 
- ✅ Build the project
- ✅ Test the installation
- ✅ Generate Claude Desktop config
- ✅ Optionally configure Claude Desktop automatically

**That's it!** Restart Claude Desktop and ask: *"Can you roast my browser history?"*

---

## 🛠️ Manual Setup (If You Prefer Control)

### Step 1: Prerequisites Check

**Required:**
- **macOS** (sorry Windows/Linux friends, PRs welcome!)
- **Node.js 18+** ([download here](https://nodejs.org))
- **Claude Desktop** ([download here](https://claude.ai/download))

**Quick check:**
```bash
node -v  # Should show v18+ 
npm -v   # Should show npm version
```

### Step 2: Install & Build

```bash
git clone <this-repo>
cd roasted
npm install
npm run build
```

### Step 3: Test Installation

```bash
node test-local.js
```

**Expected output:**
```
Testing browser history extraction...
Found X history entries
Sample entries:
1. github.com - Chrome - 2025-05-30T...
...
Generating roast...
--- ROAST ---
Your browsing history tells quite a story!
...
```

**If you see errors:** Check the troubleshooting section below.

### Step 4: Configure Claude Desktop

Add this to your Claude Desktop config file:

**Config file location:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Add this configuration:**
```json
{
  "mcpServers": {
    "roasted": {
      "command": "node",
      "args": ["/FULL/PATH/TO/roasted/dist/index.js"],
      "cwd": "/FULL/PATH/TO/roasted"
    }
  }
}
```

**⚠️ Important:** Replace `/FULL/PATH/TO/roasted` with your actual path!

**Find your path:**
```bash
pwd  # Run this in the roasted directory
```

### Step 5: Restart Claude Desktop

Quit and restart Claude Desktop completely.

### Step 6: Test with Claude

Ask Claude:
```
Can you roast my browser history from the last 7 days?
```

---

## 🚨 Troubleshooting

### "Permission Denied" or "Database Locked"

**Problem:** Can't access browser history databases.

**Solution:** Grant Full Disk Access:
1. Open **System Preferences** > **Security & Privacy** > **Privacy** tab
2. Click **Full Disk Access** in the left sidebar
3. Click the lock 🔒 to make changes
4. Add **Claude Desktop** (and/or **Terminal** if testing manually)
5. Restart Claude Desktop

### "No History Found" or Very Few Entries

**Possible causes:**
1. **Browsers not running:** Chrome/Safari need to have been used recently
2. **Browser profiles:** You might be using a different profile
3. **Private browsing:** History from incognito/private mode isn't saved

**Debug steps:**
```bash
# Check if browser databases exist
ls -la ~/Library/Safari/History.db
ls -la ~/Library/Application\ Support/Google/Chrome/Default/History

# Test with more days
node -e "
const { BrowserHistoryExtractor } = require('./dist/browser-history.js');
const extractor = new BrowserHistoryExtractor();
extractor.extractHistory({days: 30, includeChrome: true, includeSafari: true})
  .then(h => console.log('Found', h.length, 'entries'))
  .catch(console.error);
"
```

### "Cannot find module" Errors

**Problem:** Dependencies not installed properly.

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "SQLITE_ERROR" for Safari

**Problem:** Safari database schema varies between macOS versions.

**Impact:** Chrome history will still work fine. Safari extraction will fail gracefully.

**Workaround:** Use `include_safari: false` in your roast requests.

### Claude Desktop Not Finding the MCP Server

**Check these common issues:**

1. **Wrong path in config:**
   ```bash
   # Verify the path exists
   ls -la /path/to/roasted/dist/index.js
   ```

2. **Config file syntax:**
   - Must be valid JSON
   - Use forward slashes `/` even on Windows paths
   - No trailing commas

3. **Claude Desktop restart:**
   - Quit completely (Cmd+Q)
   - Wait 5 seconds
   - Restart

4. **Test MCP server directly:**
   ```bash
   echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | node dist/index.js
   ```
   Should return a JSON response with available tools.

### "Tool Not Available" in Claude

**Check:**
1. Claude Desktop restarted after config change?
2. Config file has correct JSON syntax?
3. MCP server path is correct and absolute?

**Debug:**
```bash
# Check if Claude can see the tools
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | node dist/index.js
```

---

## 🧪 Testing & Validation

### Test the MCP Server Directly

```bash
# List available tools
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | node dist/index.js

# Test roasting (gentle mode)
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "roast_browser_history", "arguments": {"days": 7, "severity": "gentle"}}}' | node dist/index.js
```

### Test Different Browsers

```bash
# Chrome only
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "roast_browser_history", "arguments": {"include_safari": false}}}' | node dist/index.js

# Safari only  
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "roast_browser_history", "arguments": {"include_chrome": false}}}' | node dist/index.js
```

### Test Privacy Levels

```bash
# Paranoid mode (very restricted)
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "roast_browser_history", "arguments": {"privacy_level": "paranoid"}}}' | node dist/index.js
```

---

## 🔧 Development Tips

### Project Structure
```
roasted/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── browser-history.ts    # Browser history extraction  
│   ├── roast-generator.ts    # Roasting logic & templates
│   └── privacy-filter.ts     # Privacy controls
├── dist/                     # Compiled JavaScript
├── setup.sh                  # Automated setup script
├── test-local.js            # Local testing
└── README.md                # Full documentation
```

### Useful Commands
```bash
npm run build         # Compile TypeScript
npm run dev          # Watch mode for development  
node test-local.js   # Quick local test
npm run lint         # (when added) Lint code
npm test            # (when added) Run tests
```

### Adding New Roast Templates

Edit `src/roast-generator.ts` and add to the `roastTemplates` object:

```typescript
savage: {
  patterns: {
    your_new_pattern: [
      "Your custom roast template here...",
      "Another variation...",
    ],
  },
},
```

### Adding New Browser Support

Edit `src/browser-history.ts` and add the browser's history database path to `chromePaths` array.

---

## 🎯 Quick Verification Checklist

After setup, verify everything works:

- [ ] `node test-local.js` shows browser history entries
- [ ] `echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | node dist/index.js` returns tools
- [ ] Claude Desktop config includes the roasted server
- [ ] Claude Desktop has been restarted  
- [ ] In Claude: "Can you roast my browser history?" triggers the tool
- [ ] You get roasted (and laugh/cry appropriately)

---

## 💡 Pro Tips for Developers

1. **Start with gentle mode** - savage mode is... savage
2. **Check privacy settings** - exclude work sites if you value your career
3. **Use paranoid mode** if you have trust issues (with good reason)
4. **The tool works offline** - no data leaves your machine
5. **Add it to your onboarding process** - nothing says "welcome to the team" like getting roasted

---

## 🆘 Still Having Issues?

1. **Run the setup script again:** `./setup.sh`
2. **Check the main README.md** for more detailed info
3. **Create an issue** with your error messages
4. **Check you have the right permissions** (Full Disk Access)

Remember: The goal is to get roasted, not frustrated! 🔥

---

**Happy roasting, fellow developers!** 🚀