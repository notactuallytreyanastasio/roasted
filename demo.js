#!/usr/bin/env node

/**
 * 🔥 Roasted MCP Demo Script
 * 
 * Shows example outputs and demonstrates different roasting modes
 * Perfect for sharing with other developers to show what they're in for!
 */

import { BrowserHistoryExtractor } from "./dist/browser-history.js";
import { RoastGenerator } from "./dist/roast-generator.js";
import { PrivacyFilter } from "./dist/privacy-filter.js";

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader(text) {
  console.log('\n' + '='.repeat(60));
  console.log(colorize(text, 'cyan'));
  console.log('='.repeat(60));
}

function printSubHeader(text) {
  console.log('\n' + colorize(text, 'yellow'));
  console.log('-'.repeat(text.length));
}

async function runDemo() {
  try {
    console.log(colorize('🔥 ROASTED MCP DEMO 🔥', 'red'));
    console.log(colorize('Get ready to see what your browser history says about you!', 'bright'));
    
    printHeader('EXTRACTING YOUR BROWSER HISTORY');
    
    const extractor = new BrowserHistoryExtractor();
    const roastGenerator = new RoastGenerator();
    const privacyFilter = new PrivacyFilter();
    
    console.log('🔍 Scanning your browsers...');
    
    const history = await extractor.extractHistory({
      days: 7,
      includeChrome: true,
      includeSafari: true,
    });
    
    console.log(`📊 Found ${colorize(history.length, 'green')} browser history entries from the last 7 days`);
    
    if (history.length === 0) {
      console.log(colorize('\n⚠️  No history found!', 'yellow'));
      console.log('This could mean:');
      console.log('• You need to grant Full Disk Access permissions');
      console.log('• You\'re using browsers we don\'t support yet');
      console.log('• You have the cleanest browsing history known to humanity');
      console.log('\nTry running the main test: node test-local.js');
      return;
    }
    
    // Show sample history (sanitized)
    printSubHeader('SAMPLE BROWSER HISTORY ENTRIES');
    const sampleEntries = history.slice(0, 8);
    sampleEntries.forEach((entry, i) => {
      const time = entry.visitTime.toLocaleString();
      const domain = colorize(entry.domain.padEnd(25), 'blue');
      const browser = colorize(entry.browser.padEnd(10), 'magenta');
      console.log(`${i + 1}. ${domain} ${browser} ${time}`);
    });
    
    // Apply privacy filtering
    const defaultSettings = privacyFilter.getDefaultPrivacySettings();
    const filteredHistory = privacyFilter.filterHistory(history, defaultSettings);
    const sanitizedHistory = privacyFilter.sanitizeHistoryForRoasting(filteredHistory);
    
    console.log(`\n🔒 After privacy filtering: ${colorize(sanitizedHistory.length, 'green')} entries remain`);
    
    if (sanitizedHistory.length === 0) {
      console.log(colorize('\n🎉 Congratulations!', 'green'));
      console.log('Your browsing history is so clean, even our privacy filters can\'t find anything to roast!');
      console.log('You\'re either incredibly boring or incredibly private. We\'re going with boring. 😴');
      return;
    }
    
    // Show analysis
    printHeader('BROWSING PATTERN ANALYSIS');
    
    const analysis = roastGenerator.analyzePatterns(sanitizedHistory);
    
    console.log(`📈 Total visits analyzed: ${colorize(analysis.totalVisits, 'green')}`);
    console.log(`🌐 Unique domains visited: ${colorize(analysis.uniqueDomains, 'green')}`);
    console.log(`⏰ Productivity score: ${colorize((analysis.productivity.productivityScore * 100).toFixed(1) + '%', analysis.productivity.productivityScore > 0.7 ? 'green' : analysis.productivity.productivityScore > 0.4 ? 'yellow' : 'red')}`);
    
    printSubHeader('TOP DOMAINS (Your Digital Hangouts)');
    analysis.topDomains.slice(0, 8).forEach((domain, i) => {
      const percentage = colorize(domain.percentage.toFixed(1) + '%', 'cyan');
      const count = colorize(domain.count.toString(), 'green');
      console.log(`${i + 1}. ${domain.domain.padEnd(25)} ${count.padEnd(8)} visits (${percentage})`);
    });
    
    printSubHeader('TIME PATTERNS (When You Browse)');
    const timeLabels = {
      morningVisits: '🌅 Morning (6-12)',
      afternoonVisits: '☀️  Afternoon (12-18)',
      eveningVisits: '🌆 Evening (18-23)',
      lateNightVisits: '🌙 Late Night (23-6)'
    };
    
    Object.entries(analysis.timePatterns).forEach(([key, count]) => {
      const percentage = ((count / analysis.totalVisits) * 100).toFixed(1);
      const label = timeLabels[key].padEnd(20);
      const countStr = colorize(count.toString(), 'green').padEnd(15);
      const percentStr = colorize(percentage + '%', 'cyan');
      console.log(`${label} ${countStr} (${percentStr})`);
    });
    
    if (analysis.patterns.length > 0) {
      printSubHeader('DETECTED PATTERNS (Uh Oh...)');
      analysis.patterns.forEach(pattern => {
        const emoji = pattern.type.includes('social') ? '📱' : 
                     pattern.type.includes('procrastination') ? '⏰' : 
                     pattern.type.includes('shopping') ? '🛒' : '🤔';
        const percentage = colorize(pattern.percentage.toFixed(1) + '%', 'red');
        console.log(`${emoji} ${pattern.type.replace(/_/g, ' ').toUpperCase()}: ${pattern.count} visits (${percentage})`);
      });
    }
    
    // Generate roasts at different severity levels
    const severities = ['gentle', 'medium', 'savage'];
    
    for (const severity of severities) {
      printHeader(`${severity.toUpperCase()} ROAST 🔥`);
      
      const roast = await roastGenerator.generateRoast(sanitizedHistory, severity);
      
      // Add some styling to the roast
      const styledRoast = roast
        .split('\n')
        .map(line => {
          if (line.trim() === '') return line;
          if (line.includes('visits') || line.includes('%')) {
            return colorize(line, 'bright');
          }
          return line;
        })
        .join('\n');
      
      console.log(styledRoast);
      
      // Pause between roasts for dramatic effect
      if (severity !== 'savage') {
        console.log(colorize('\n⏸️  (Pausing for you to recover...)', 'yellow'));
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    printHeader('🎉 DEMO COMPLETE');
    console.log(colorize('Ready to get roasted by Claude? Here\'s how:', 'bright'));
    console.log('\n1. Make sure you\'ve run: ' + colorize('./setup.sh', 'green'));
    console.log('2. Restart Claude Desktop');
    console.log('3. Ask Claude: ' + colorize('"Can you roast my browser history?"', 'cyan'));
    console.log('\n' + colorize('Pro tip:', 'yellow') + ' Start with gentle mode if you have fragile feelings! 😄');
    
    console.log('\n' + colorize('Share this with your fellow developers!', 'magenta'));
    console.log('Nothing builds team bonding like mutual digital embarrassment. 🤝');
    
  } catch (error) {
    console.error(colorize('\n❌ Demo failed:', 'red'), error.message);
    console.log('\n' + colorize('Troubleshooting tips:', 'yellow'));
    console.log('• Run: node test-local.js');
    console.log('• Check: DEVELOPER_SETUP.md');
    console.log('• Ensure: Browser permissions are granted');
  }
}

// Add some ASCII art for fun
console.log(colorize(`
  ╭─────────────────────────────────────────╮
  │                                         │
  │   🔥 ROASTED MCP DEMONSTRATION 🔥      │
  │                                         │
  │   Prepare to see your browsing habits   │
  │   exposed in all their glory...         │
  │                                         │
  ╰─────────────────────────────────────────╯
`, 'red'));

runDemo().catch(console.error);