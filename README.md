# 🔥 Roasted MCP
<img width="643" alt="Screenshot 2025-05-30 at 10 47 30 AM" src="https://github.com/user-attachments/assets/2e369015-c703-47f2-ba77-217cbc65d160" />

An MCP (Model Context Protocol) server that hilariously roasts you based on your browser history patterns. Because someone needs to call out your 3 AM Wikipedia rabbit holes and your questionable shopping habits.

> **⚠️ Common Issues:**
> - **`SQLITE_CANTOPEN` errors:** Permissions issue. **macOS:** Grant Full Disk Access to Claude Desktop. **Windows:** Run as Administrator.
> - **"Could not attach to MCP server":** Claude can't connect despite server running. Check config file path and restart Claude Desktop completely (⌘+Q, not just close window).
> 
> See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed fixes.

## 🎯 Features

- **Multi-Browser Support**: Extracts history from Chrome, Edge, Brave, Opera, Vivaldi (and Safari on macOS)
- **Intelligent Pattern Analysis**: Identifies procrastination habits, social media addiction, shopping sprees, and weird browsing hours
- **Customizable Roast Intensity**: Choose from gentle ribbing to savage burns
- **Privacy-First Design**: Built-in filtering for sensitive content (health, finance, dating sites)
- **Organic Browsing Detection**: Distinguishes between natural browsing and intentional searches

## 🚀 Quick Start for Developers

### ⚡ Super Quick Setup (5 minutes)

**Requirements:** Node.js 18+, Windows/macOS/Linux, Claude Desktop

```bash
git clone https://github.com/notactuallytreyanastasio/roasted.git
cd roasted

# Auto-detect your platform and run setup
node setup-cross-platform.js

# OR run platform-specific setup:
# Windows: setup.bat
# macOS/Linux: ./setup.sh
```

**That's it!** The setup script handles everything automatically.

### 🧪 See It In Action First

Want to see what you're in for? Run the demo:

```bash
node demo.js
```

This shows example outputs and demonstrates all roast severity levels with your actual browser data.

### 📚 Detailed Documentation

- **[Developer Setup Guide](DEVELOPER_SETUP.md)** - Step-by-step setup with troubleshooting
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Fix any issues you encounter  
- **[Example Outputs](EXAMPLES.md)** - See what the roasts look like
- **[Main Documentation](#)** - Continue reading below for full details

### ✅ Verify Everything Works

After setup, run a quick health check:

```bash
./verify.sh
```

This verifies all components are working correctly.

### 🎯 One-Liner Test

Test the MCP server directly:

```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "roast_browser_history", "arguments": {"severity": "gentle"}}}' | node dist/index.js
```

### First Roast in Claude

Once configured, ask Claude:

```
Can you roast my browser history from the last 7 days with medium severity?
```

## 🛠️ Available Tools

### `roast_browser_history`

Generates a humorous roast based on your browsing patterns.

**Parameters:**
- `days` (number, default: 7): Number of days to analyze
- `severity` (string, default: "medium"): Roast intensity ("gentle", "medium", "savage")
- `include_chrome` (boolean, default: true): Include Chrome-based browsers
- `include_safari` (boolean, default: true): Include Safari
- `privacy_level` (string, default: "default"): Privacy filtering ("default", "paranoid", "custom")
- `exclude_sensitive` (boolean, default: true): Filter out health, finance, dating sites
- `exclude_work` (boolean, default: false): Filter out work-related sites

### `analyze_browsing_patterns`

Analyzes browsing patterns without generating roasts - for the data nerds.

**Parameters:**
- `days` (number, default: 7): Number of days to analyze

## 🔒 Privacy & Security

Your privacy is important (even when we're roasting you):

- **Local Processing**: All analysis happens locally on your machine
- **No Data Transmission**: Browser history never leaves your computer
- **Sensitive Site Filtering**: Automatically excludes health, finance, and dating sites by default
- **URL Sanitization**: Removes query parameters and personal information from URLs
- **Title Cleaning**: Strips potential personal data (emails, phone numbers, SSNs) from page titles

### Privacy Levels

- **Default**: Excludes clearly sensitive sites but allows most content
- **Paranoid**: Excludes sensitive sites, work sites, personal sites, and night browsing
- **Custom**: Configure exactly what to include/exclude

## 🎭 Roast Severity Levels

### Gentle 😊
Light-hearted observations about your browsing habits. Perfect for sharing with friends.

### Medium 😏 (Default)
Sarcastic commentary with a good balance of humor and mild embarrassment.

### Savage 🔥
No mercy. Brutal honesty about your digital lifestyle choices. Use at your own risk.

## 📊 What Gets Analyzed

The roasting algorithm looks for:

- **Social Media Addiction**: Excessive Facebook, Instagram, Twitter, TikTok usage
- **Procrastination Patterns**: YouTube binges, Reddit spirals, endless scrolling
- **Shopping Habits**: Amazon addiction, impulse buying patterns
- **Time Patterns**: Late night browsing, work hour distractions
- **Domain Dominance**: Sites you visit way too often
- **Productivity Score**: How much of your browsing is actually useful

## 🚫 What We DON'T Roast

To keep things fun (not harmful), we automatically exclude:

- **Health-related sites**: Medical conditions, symptoms, treatments
- **Financial sites**: Banking, investment, tax preparation
- **Dating sites**: Because love is complicated enough
- **Legal sites**: Your legal troubles are your own
- **Mental health resources**: We support your wellness journey
- **Adult content**: Keeping it PG(-13)

## 🔧 Development

### Project Structure

```
src/
├── index.ts              # Main MCP server
├── browser-history.ts    # Browser history extraction
├── roast-generator.ts    # Roasting logic and templates
└── privacy-filter.ts     # Privacy controls and content filtering
```

### Build Commands

```bash
npm run build      # Compile TypeScript
npm run dev        # Watch mode for development
npm test          # Run tests (coming soon™)
```

### Testing Locally

```bash
node test-local.js  # Quick test of browser history extraction
```

## 🤝 Contributing

Got better roast material? Found a bug? Want to add support for more browsers?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/better-burns`
3. Make your changes
4. Run tests: `npm test` (when they exist)
5. Submit a pull request

## ⚠️ Disclaimers

- **For Entertainment Only**: This tool is meant for fun, not psychological analysis
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Browser Permissions**: May require additional system permissions to access browser databases
- **Your Feelings**: We are not responsible for any emotional damage caused by accurate roasts  
- **Productivity**: This tool may cause you to reflect on your digital habits (sorry)

## 🙋‍♀️ FAQ

**Q: Will this work on Windows/Linux?**
A: Yes! Now supports Windows, macOS, and Linux with automatic platform detection.

**Q: Can I roast my friend's browser history?**
A: Only if they run it on their machine. We don't support remote history access (that would be creepy).

**Q: The roast wasn't funny enough. Can I get a refund?**
A: Try the "savage" setting. Also, humor is subjective, but your browsing habits probably aren't.

**Q: It says I need Full Disk Access. Is this safe?**
A: The tool only reads browser history databases. Check the source code - it's all open source!

**Q: Why is my productivity score so low?**
A: That's between you and your browser history. We just report the facts.

## 📜 License

MIT License - Feel free to roast responsibly.

---

*Remember: The best roasts come from a place of love. We're all just trying to survive the internet together.* 🌐❤️

