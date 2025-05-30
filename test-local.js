#!/usr/bin/env node

import { BrowserHistoryExtractor } from "./dist/browser-history.js";
import { RoastGenerator } from "./dist/roast-generator.js";

async function testLocal() {
  try {
    console.log("Testing browser history extraction...");
    
    const extractor = new BrowserHistoryExtractor();
    const history = await extractor.extractHistory({
      days: 7,
      includeChrome: true,
      includeSafari: true,
    });
    
    console.log(`Found ${history.length} history entries`);
    console.log("Sample entries:");
    history.slice(0, 5).forEach((entry, i) => {
      console.log(`${i + 1}. ${entry.domain} - ${entry.browser} - ${entry.visitTime.toISOString()}`);
    });
    
    if (history.length > 0) {
      console.log("\nGenerating roast...");
      const roastGenerator = new RoastGenerator();
      const roast = await roastGenerator.generateRoast(history, "medium");
      console.log("\n--- ROAST ---");
      console.log(roast);
      console.log("--- END ROAST ---\n");
      
      console.log("Analysis:");
      const analysis = roastGenerator.analyzePatterns(history);
      console.log(`Total visits: ${analysis.totalVisits}`);
      console.log(`Unique domains: ${analysis.uniqueDomains}`);
      console.log(`Top domains:`);
      analysis.topDomains.slice(0, 5).forEach(domain => {
        console.log(`  ${domain.domain}: ${domain.count} visits (${domain.percentage.toFixed(1)}%)`);
      });
    } else {
      console.log("No history found - you might need to give permission to access browser databases");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testLocal();