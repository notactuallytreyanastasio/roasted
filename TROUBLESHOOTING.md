# 🚨 Troubleshooting Guide

Having issues getting roasted? This guide covers every common problem and solution.

## 🔍 Quick Diagnosis

Run this command first to get a quick health check:

```bash
./setup.sh
```

If that doesn't work, continue with the specific issues below.

---

## 🚫 Permission Issues

### "Permission denied" or "Cannot access database"

**Symptoms:**
- `Error: EACCES: permission denied`
- `SQLITE_CANTOPEN: unable to open database file`
- No browser history found despite active browsing

**Root Cause:** Operating system is blocking access to browser databases.

**Solutions by Platform:**

#### 🪟 Windows
1. **Run as Administrator:**
   - Right-click Command Prompt/PowerShell → "Run as administrator"
   - Navigate to project folder and try again

2. **Check File Permissions:**
   - Browser data location: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\History`
   - Right-click folder → Properties → Security
   - Ensure your user has "Read" permissions

3. **Antivirus/Security Software:**
   - Temporarily disable real-time protection
   - Add project folder to antivirus exclusions

#### 🍎 macOS
1. **Grant Full Disk Access to Claude Desktop:**
   - Open **System Preferences** → **Security & Privacy** → **Privacy**
   - Select **Full Disk Access** from the left sidebar
   - Click the lock 🔒 to make changes (enter your password)
   - Click the **+** button and add **Claude Desktop**
   - If testing manually, also add **Terminal**

2. **Restart the applications:**
   ```bash
   # Quit Claude Desktop completely
   # Restart it from Applications folder
   ```

#### 🐧 Linux
1. **Check File Permissions:**
   ```bash
   ls -la ~/.config/google-chrome/Default/History
   # Should show read permissions for your user
   ```

2. **Fix permissions if needed:**
   ```bash
   chmod 644 ~/.config/google-chrome/Default/History
   ```

3. **Verify permissions worked:**
   ```bash
   node test-local.js
   # Should now show browser history entries
   ```

### "Operation not permitted" on macOS Sonoma+

**New in macOS 14+:** Additional privacy protections.

**Solution:**
1. Go to **System Settings** → **Privacy & Security** → **Full Disk Access**
2. Enable for both **Terminal** and **Claude Desktop**
3. **Restart your Mac** (sometimes required for Sonoma)

---

## 📊 No History Found

### "Found 0 history entries" but you definitely browse the web

**Possible Causes & Solutions:**

#### 1. Browser Profile Issues
Different browser profiles have separate history databases.

**Check by Platform:**

**Windows:**
```cmd
# List all Chrome profiles
dir "%LOCALAPPDATA%\Google\Chrome\User Data"
# Look for: Default, Profile 1, Profile 2, etc.

# Check Edge profiles
dir "%LOCALAPPDATA%\Microsoft\Edge\User Data"
```

**macOS:**
```bash
# List all Chrome profiles
ls -la ~/Library/Application\ Support/Google/Chrome/
# Look for: Default, Profile 1, Profile 2, etc.

# List all Safari databases  
ls -la ~/Library/Safari/
```

**Linux:**
```bash
# List all Chrome profiles
ls -la ~/.config/google-chrome/
# Look for: Default, Profile 1, Profile 2, etc.
```

**Fix:** The tool currently only checks the default profile. Switch to your default profile or modify the code to check multiple profiles.

#### 2. Private/Incognito Browsing
History from private browsing modes isn't saved.

**Check:** Have you been browsing normally (not in incognito/private mode)?

#### 3. Browser History Disabled
Some users disable history saving.

**Check browser settings:**
- **Chrome:** Settings → Privacy and Security → Clear Browsing Data → Ensure "Browsing history" isn't being auto-cleared
- **Safari:** Develop menu → Private Browsing (should be off)

#### 4. Recent Fresh Install
Brand new browsers have no history.

**Solution:** Browse normally for a few days, then try again.

#### 5. Different Time Range
Maybe you haven't browsed much in the default 7-day window.

**Try:**
```bash
# Test with 30 days
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "roast_browser_history", "arguments": {"days": 30}}}' | node dist/index.js
```

---

## 🔧 Technical Issues

### "Cannot find module" errors

**Symptoms:**
```
Error: Cannot find module './dist/browser-history.js'
Module not found: @modelcontextprotocol/sdk
```

**Solutions:**

1. **Dependencies not installed:**
   ```bash
   npm install
   ```

2. **Project not built:**
   ```bash
   npm run build
   ```

3. **Node modules corrupted:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

4. **Wrong Node version:**
   ```bash
   node -v  # Should be 18+
   nvm use 18  # If using nvm
   ```

### "SQLITE_ERROR: no such column" (Safari)

**Symptoms:**
```
Failed to extract Safari history: [Error: SQLITE_ERROR: no such column: hv.url]
```

**Explanation:** Safari database schema varies between macOS versions. This is a known issue that doesn't break the tool.

**Impact:** Chrome history will still work perfectly. Only Safari extraction fails.

**Workarounds:**
1. **Use Chrome-only mode:**
   ```bash
   # In Claude, specify: include_safari: false
   ```

2. **Ignore the error:** The tool continues working with Chrome data.

3. **Help us fix it:** If you're a developer, we'd love a PR to support your Safari version!

### TypeScript compilation errors

**Symptoms:**
```
error TS2554: Expected 1 arguments, but got 2
error TS2339: Property 'weird_hours' does not exist
```

**Solution:**
```bash
# Clean rebuild
rm -rf dist/
npm run build
```

If errors persist, check your TypeScript version:
```bash
npx tsc --version  # Should be 5.0+
```

---

## 🤖 Claude Desktop Integration Issues

### Claude Desktop doesn't see the MCP server

**Symptoms:**
- "I don't have access to that tool"
- No roasting tools appear in Claude's tool list

**Diagnosis:**
```bash
# Test if MCP server responds directly
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | node dist/index.js
```

**Expected Response:**
```json
{"result":{"tools":[{"name":"roast_browser_history",...}]},...}
```

**If no response:** Your MCP server isn't working. Go back to the technical issues section.

**If it responds but Claude doesn't see it:**

#### 1. Config file location wrong
**Check:** Is your config at the right location?
```bash
ls -la ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### 2. Config file syntax error
**Check:** Is your JSON valid?
```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python -m json.tool
```

**Common syntax errors:**
- Trailing commas ❌
- Missing quotes around keys ❌  
- Wrong path separators on Windows ❌

#### 3. Wrong path in config
**Check:** Does the path actually exist?
```bash
# Use the EXACT path from your config
ls -la /path/from/your/config/dist/index.js
```

**Get the correct path:**
```bash
cd roasted
pwd  # This is your full path
```

#### 4. Claude Desktop not restarted
**Solution:** 
- Quit Claude Desktop completely (⌘+Q on Mac)
- Wait 10 seconds
- Restart from Applications folder
- **Don't just close the window - actually quit the app**

### "Tool execution failed" in Claude

**Symptoms:** Claude sees the tool but it fails when used.

**Debug:**
```bash
# Check the exact error
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "roast_browser_history", "arguments": {"days": 7}}}' | node dist/index.js
```

**Common causes:**
- Permission issues (see above)
- No history found (see above)  
- Privacy filters too restrictive

**Try relaxed privacy:**
```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "roast_browser_history", "arguments": {"privacy_level": "custom", "exclude_sensitive": false}}}' | node dist/index.js
```

---

## 🔒 Privacy & Filtering Issues

### "Nothing left to roast after privacy filtering"

**Symptoms:** The tool finds history but privacy filters remove everything.

**Causes:**
1. **Paranoid privacy mode:** Very restrictive filtering
2. **Only sensitive sites visited:** All your sites are on the sensitive list
3. **Work-only browsing:** All sites filtered as work-related

**Solutions:**

1. **Try custom privacy settings:**
   ```json
   {
     "privacy_level": "custom",
     "exclude_sensitive": false,
     "exclude_work": false
   }
   ```

2. **Check what's being filtered:**
   ```bash
   # Test with no privacy filtering
   echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "analyze_browsing_patterns", "arguments": {"days": 7}}}' | node dist/index.js
   ```

3. **Review the sensitive domains list** in `src/privacy-filter.ts` - maybe your sites shouldn't be classified as sensitive.

### Privacy settings too restrictive

**Modify the privacy settings:**

1. **Default mode:** Excludes health, finance, dating sites
2. **Paranoid mode:** Excludes almost everything 
3. **Custom mode:** You control what's filtered

**Example custom settings:**
```json
{
  "privacy_level": "custom",
  "exclude_sensitive": false,    // Include everything
  "exclude_work": true,         // But hide work sites
  "days": 3                     // Shorter time window
}
```

---

## 🐛 Development Issues

### Building fails with missing types

**Solution:**
```bash
npm install --save-dev @types/node @types/sqlite3
npm run build
```

### Watch mode not working

**Solution:**
```bash
npm run dev
# If that fails:
npx tsc --watch
```

### Want to modify roast templates?

**File:** `src/roast-generator.ts`
**Look for:** `roastTemplates` object

After making changes:
```bash
npm run build
```

---

## 🆘 Still Stuck?

### Get more debugging info:

```bash
# Comprehensive debug test
node -e "
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());

const fs = require('fs');
console.log('Files in dist:', fs.readdirSync('./dist/').join(', '));

try {
  const { BrowserHistoryExtractor } = require('./dist/browser-history.js');
  console.log('✓ Browser history module loaded');
} catch (e) {
  console.log('✗ Browser history module failed:', e.message);
}
"
```

### Check your environment:

```bash
# System info
uname -a
node -v
npm -v

# File permissions
ls -la dist/index.js
ls -la ~/Library/Safari/History.db
ls -la ~/Library/Application\ Support/Google/Chrome/Default/History

# Claude config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Clean start:

```bash
# Nuclear option - start completely fresh
rm -rf node_modules dist package-lock.json
npm install
npm run build
node test-local.js
```

---

## 📝 Reporting Issues

If none of this helps, please create an issue with:

1. **Your system info:**
   ```bash
   uname -a && node -v && npm -v
   ```

2. **Error messages:** Full error output

3. **What you tried:** Steps from this troubleshooting guide

4. **Browser setup:** Which browsers, versions, profiles

5. **Privacy settings:** Any custom privacy configurations

---

**Remember:** The goal is to get roasted, not frustrated! 🔥 

Most issues are permission-related on macOS. Grant Full Disk Access and restart everything - that fixes 90% of problems.