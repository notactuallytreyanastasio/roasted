import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";
import os from "os";
import fs from "fs";

export interface BrowserHistoryEntry {
  url: string;
  title?: string;
  visitTime: Date;
  visitCount: number;
  browser: string;
  domain: string;
  isOrganic?: boolean;
  transitionType?: string;
}

export interface HistoryExtractionOptions {
  days: number;
  includeChrome: boolean;
  includeSafari: boolean;
}

export class BrowserHistoryExtractor {
  private readonly homeDir = os.homedir();

  async extractHistory(options: HistoryExtractionOptions): Promise<BrowserHistoryEntry[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - options.days);
    const cutoffTimestamp = cutoffDate.getTime();

    const allHistory: BrowserHistoryEntry[] = [];

    if (options.includeSafari) {
      try {
        const safariHistory = await this.extractSafariHistory(cutoffTimestamp);
        allHistory.push(...safariHistory);
      } catch (error) {
        console.error("Failed to extract Safari history:", error);
      }
    }

    if (options.includeChrome) {
      try {
        const chromeHistory = await this.extractChromeHistory(cutoffTimestamp);
        allHistory.push(...chromeHistory);
      } catch (error) {
        console.error("Failed to extract Chrome history:", error);
      }
    }

    // Sort by visit time and deduplicate
    const sortedHistory = allHistory.sort((a, b) => b.visitTime.getTime() - a.visitTime.getTime());
    return this.deduplicateHistory(sortedHistory);
  }

  private async extractSafariHistory(cutoffTimestamp: number): Promise<BrowserHistoryEntry[]> {
    const safariDbPath = path.join(this.homeDir, "Library/Safari/History.db");
    
    if (!fs.existsSync(safariDbPath)) {
      console.warn("Safari history database not found");
      return [];
    }

    const db = new sqlite3.Database(safariDbPath, sqlite3.OPEN_READONLY);
    const allAsync = promisify(db.all.bind(db)) as (query: string, params?: any[]) => Promise<any[]>;
    
    try {
      // Safari stores time as seconds since 2001-01-01 00:00:00 UTC
      const safariEpoch = new Date("2001-01-01T00:00:00Z").getTime();
      const safariCutoff = (cutoffTimestamp - safariEpoch) / 1000;

      const query = `
        SELECT 
          hv.url,
          hi.url as title_url,
          hv.title,
          hv.visit_time,
          hv.load_successful,
          hv.origin,
          hi.visit_count,
          hi.visit_count_score
        FROM history_visits hv
        JOIN history_items hi ON hv.history_item = hi.id
        WHERE hv.visit_time > ?
        AND hv.load_successful = 1
        ORDER BY hv.visit_time DESC
      `;

      const rows = await allAsync(query, [safariCutoff]) as any[];
      
      return rows.map(row => ({
        url: row.url,
        title: row.title || "",
        visitTime: new Date(safariEpoch + (row.visit_time * 1000)),
        visitCount: row.visit_count || 1,
        browser: "Safari",
        domain: this.extractDomain(row.url),
        isOrganic: this.classifyOrganicBrowsing(row.origin, row.url),
      }));
    } finally {
      db.close();
    }
  }

  private async extractChromeHistory(cutoffTimestamp: number): Promise<BrowserHistoryEntry[]> {
    const chromePaths = [
      "Library/Application Support/Google/Chrome/Default/History",
      "Library/Application Support/Google/Chrome Beta/Default/History",
      "Library/Application Support/Google/Chrome Canary/Default/History",
      "Library/Application Support/Arc/User Data/Default/History",
      "Library/Application Support/BraveSoftware/Brave-Browser/Default/History",
    ];

    const allHistory: BrowserHistoryEntry[] = [];

    for (const relativePath of chromePaths) {
      const historyPath = path.join(this.homeDir, relativePath);
      
      if (fs.existsSync(historyPath)) {
        try {
          const browserName = this.getBrowserNameFromPath(relativePath);
          const history = await this.extractChromeHistoryFromPath(historyPath, cutoffTimestamp, browserName);
          allHistory.push(...history);
        } catch (error) {
          console.error(`Failed to extract history from ${relativePath}:`, error);
        }
      }
    }

    return allHistory;
  }

  private async extractChromeHistoryFromPath(
    historyPath: string, 
    cutoffTimestamp: number, 
    browserName: string
  ): Promise<BrowserHistoryEntry[]> {
    // Chrome stores time as microseconds since 1601-01-01 00:00:00 UTC
    const chromeEpoch = new Date("1601-01-01T00:00:00Z").getTime();
    const chromeCutoff = (cutoffTimestamp - chromeEpoch) * 1000; // Convert to microseconds

    const db = new sqlite3.Database(historyPath, sqlite3.OPEN_READONLY);
    const allAsync = promisify(db.all.bind(db)) as (query: string, params?: any[]) => Promise<any[]>;
    
    try {
      const query = `
        SELECT 
          u.url,
          u.title,
          v.visit_time,
          u.visit_count,
          v.transition,
          v.from_visit
        FROM urls u
        JOIN visits v ON u.id = v.url
        WHERE v.visit_time > ?
        ORDER BY v.visit_time DESC
      `;

      const rows = await allAsync(query, [chromeCutoff]) as any[];
      
      return rows.map(row => ({
        url: row.url,
        title: row.title || "",
        visitTime: new Date(chromeEpoch + (row.visit_time / 1000)),
        visitCount: row.visit_count || 1,
        browser: browserName,
        domain: this.extractDomain(row.url),
        transitionType: this.getChromeTransitionType(row.transition),
        isOrganic: this.classifyOrganicChromeBrowsing(row.transition, row.from_visit),
      }));
    } finally {
      db.close();
    }
  }

  private getBrowserNameFromPath(path: string): string {
    if (path.includes("Chrome Beta")) return "Chrome Beta";
    if (path.includes("Chrome Canary")) return "Chrome Canary";
    if (path.includes("Chrome")) return "Chrome";
    if (path.includes("Arc")) return "Arc";
    if (path.includes("Brave")) return "Brave";
    return "Chrome-based";
  }

  private getChromeTransitionType(transition: number): string {
    const types = {
      0: "link",
      1: "typed",
      2: "auto_bookmark",
      3: "auto_subframe",
      4: "manual_subframe",
      5: "generated",
      6: "auto_toplevel",
      7: "form_submit",
      8: "reload",
    };
    return types[transition as keyof typeof types] || "unknown";
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return "unknown";
    }
  }

  private classifyOrganicBrowsing(origin: number | null, url: string): boolean {
    // Safari origin classification
    if (origin === 0) return true; // Direct navigation
    if (origin === 1) return true; // Link click
    return false; // Other types might be less organic
  }

  private classifyOrganicChromeBrowsing(transition: number, fromVisit: number | null): boolean {
    // Chrome transition type classification
    if (transition === 0) return true; // Link click
    if (transition === 1) return false; // Typed URL (intentional)
    if (transition === 2) return false; // Auto bookmark
    if (transition === 7) return true; // Form submit (organic interaction)
    return true; // Default to organic
  }

  private deduplicateHistory(history: BrowserHistoryEntry[]): BrowserHistoryEntry[] {
    const seen = new Map<string, BrowserHistoryEntry>();
    
    for (const entry of history) {
      const key = `${entry.url}:${entry.visitTime.toISOString()}`;
      if (!seen.has(key)) {
        seen.set(key, entry);
      }
    }
    
    return Array.from(seen.values());
  }
}