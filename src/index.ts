#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BrowserHistoryExtractor } from "./browser-history.js";
import { RoastGenerator } from "./roast-generator.js";
import { PrivacyFilter, PrivacySettings } from "./privacy-filter.js";

class RoastedMCPServer {
  private server: Server;
  private historyExtractor: BrowserHistoryExtractor;
  private roastGenerator: RoastGenerator;
  private privacyFilter: PrivacyFilter;

  constructor() {
    this.server = new Server(
      {
        name: "roasted",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.historyExtractor = new BrowserHistoryExtractor();
    this.roastGenerator = new RoastGenerator();
    this.privacyFilter = new PrivacyFilter();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "roast_browser_history",
            description: "Generate a humorous roast based on your browser history patterns",
            inputSchema: {
              type: "object",
              properties: {
                days: {
                  type: "number",
                  description: "Number of days to analyze (default: 7)",
                  default: 7,
                },
                severity: {
                  type: "string",
                  enum: ["gentle", "medium", "savage"],
                  description: "How harsh the roast should be",
                  default: "medium",
                },
                include_chrome: {
                  type: "boolean",
                  description: "Include Chrome-based browsers",
                  default: true,
                },
                include_safari: {
                  type: "boolean",
                  description: "Include Safari",
                  default: true,
                },
                privacy_level: {
                  type: "string",
                  enum: ["default", "paranoid", "custom"],
                  description: "Privacy level for filtering sensitive content",
                  default: "default",
                },
                exclude_sensitive: {
                  type: "boolean",
                  description: "Exclude sensitive sites (health, finance, dating)",
                  default: true,
                },
                exclude_work: {
                  type: "boolean",
                  description: "Exclude work-related sites",
                  default: false,
                },
              },
            },
          },
          {
            name: "analyze_browsing_patterns",
            description: "Analyze browsing patterns without generating roasts",
            inputSchema: {
              type: "object",
              properties: {
                days: {
                  type: "number",
                  description: "Number of days to analyze (default: 7)",
                  default: 7,
                },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "roast_browser_history":
            return await this.handleRoastHistory(args);
          case "analyze_browsing_patterns":
            return await this.handleAnalyzePatterns(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async handleRoastHistory(args: any) {
    const {
      days = 7,
      severity = "medium",
      include_chrome = true,
      include_safari = true,
      privacy_level = "default",
      exclude_sensitive = true,
      exclude_work = false,
    } = args;

    // Extract browser history
    let history = await this.historyExtractor.extractHistory({
      days,
      includeChrome: include_chrome,
      includeSafari: include_safari,
    });

    // Apply privacy filtering
    const privacySettings = this.getPrivacySettings(privacy_level, {
      excludeSensitiveSites: exclude_sensitive,
      excludeWorkSites: exclude_work,
      excludePersonalSites: false,
      maxHistoryAge: days,
      allowNightTimeAnalysis: true,
    });

    history = this.privacyFilter.filterHistory(history, privacySettings);
    history = this.privacyFilter.sanitizeHistoryForRoasting(history);

    if (history.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "I tried to roast your browser history, but found nothing to roast! This could be because:\n\n" +
                  "• **No browser history found** - Check the logs above to see which browsers were checked\n" +
                  "• **Privacy filters removed everything** - Try setting `exclude_sensitive: false` for more lenient filtering\n" +
                  "• **Permission issues** - On macOS, grant Full Disk Access to Claude Desktop in System Settings\n" +
                  "• **Recent browser activity** - Make sure you've browsed normally in the last " + days + " days\n\n" +
                  "Either you're incredibly boring, incredibly private, or there's a technical issue. I'm going with boring. 😴",
          },
        ],
      };
    }

    // Generate roast
    const roast = await this.roastGenerator.generateRoast(history, severity);

    return {
      content: [
        {
          type: "text",
          text: `🔥 **ROASTED** 🔥\n\n${roast}\n\n_Privacy level: ${privacy_level}, analyzed ${history.length} visits_`,
        },
      ],
    };
  }

  private async handleAnalyzePatterns(args: any) {
    const { days = 7 } = args;

    const history = await this.historyExtractor.extractHistory({
      days,
      includeChrome: true,
      includeSafari: true,
    });

    const analysis = this.roastGenerator.analyzePatterns(history);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  }

  private getPrivacySettings(level: string, customSettings: Partial<PrivacySettings>): PrivacySettings {
    switch (level) {
      case "paranoid":
        return this.privacyFilter.getParanoidPrivacySettings();
      case "custom":
        return { ...this.privacyFilter.getDefaultPrivacySettings(), ...customSettings };
      default:
        return this.privacyFilter.getDefaultPrivacySettings();
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Roasted MCP server running on stdio");
  }
}

const server = new RoastedMCPServer();
server.run().catch(console.error);