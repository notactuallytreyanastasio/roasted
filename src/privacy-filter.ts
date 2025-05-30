import { BrowserHistoryEntry } from "./browser-history.js";

export interface PrivacySettings {
  excludeSensitiveSites: boolean;
  excludeWorkSites: boolean;
  excludePersonalSites: boolean;
  maxHistoryAge: number; // days
  allowNightTimeAnalysis: boolean;
}

export class PrivacyFilter {
  private readonly sensitiveDomains = [
    // Health and medical
    "webmd.com", "mayoclinic.org", "healthline.com", "drugs.com",
    // Financial
    "chase.com", "bankofamerica.com", "wellsfargo.com", "paypal.com",
    "mint.com", "creditkarma.com", "irs.gov", "turbotax.com",
    // Legal
    "legalzoom.com", "avvo.com", "findlaw.com",
    // Dating and relationships
    "tinder.com", "bumble.com", "match.com", "eharmony.com",
    "okcupid.com", "hinge.com", "pof.com",
    // Adult content (keeping it clean)
    "onlyfans.com", "pornhub.com", "xvideos.com", "xnxx.com",
    // Mental health
    "betterhelp.com", "talkspace.com", "psychologytoday.com",
    // Job searching
    "indeed.com", "linkedin.com", "glassdoor.com", "monster.com",
  ];

  private readonly workDomains = [
    "slack.com", "teams.microsoft.com", "zoom.us", "webex.com",
    "salesforce.com", "workday.com", "bamboohr.com", "adp.com",
    "office.com", "sharepoint.com", "confluence.atlassian.com",
    "jira.atlassian.com", "github.com", "gitlab.com", "bitbucket.org",
  ];

  private readonly personalDomains = [
    // Personal email
    "gmail.com", "outlook.com", "yahoo.com", "icloud.com",
    // Personal cloud storage
    "drive.google.com", "dropbox.com", "onedrive.com", "icloud.com",
    // Personal photos
    "photos.google.com", "icloud.com", "flickr.com",
  ];

  filterHistory(history: BrowserHistoryEntry[], settings: PrivacySettings): BrowserHistoryEntry[] {
    return history.filter(entry => {
      // Filter by age
      const daysSinceVisit = (Date.now() - entry.visitTime.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceVisit > settings.maxHistoryAge) {
        return false;
      }

      // Filter sensitive sites
      if (settings.excludeSensitiveSites && this.isSensitiveDomain(entry.domain)) {
        return false;
      }

      // Filter work sites
      if (settings.excludeWorkSites && this.isWorkDomain(entry.domain)) {
        return false;
      }

      // Filter personal sites
      if (settings.excludePersonalSites && this.isPersonalDomain(entry.domain)) {
        return false;
      }

      // Filter night time browsing if requested
      if (!settings.allowNightTimeAnalysis) {
        const hour = entry.visitTime.getHours();
        if (hour >= 23 || hour < 6) {
          return false;
        }
      }

      return true;
    });
  }

  sanitizeHistoryForRoasting(history: BrowserHistoryEntry[]): BrowserHistoryEntry[] {
    // Remove sensitive information but keep domain patterns for roasting
    return history.map(entry => ({
      ...entry,
      url: this.sanitizeUrl(entry.url),
      title: this.sanitizeTitle(entry.title),
    }));
  }

  private isSensitiveDomain(domain: string): boolean {
    return this.sensitiveDomains.some(sensitive => 
      domain === sensitive || domain.endsWith('.' + sensitive)
    );
  }

  private isWorkDomain(domain: string): boolean {
    return this.workDomains.some(work => 
      domain === work || domain.endsWith('.' + work)
    );
  }

  private isPersonalDomain(domain: string): boolean {
    return this.personalDomains.some(personal => 
      domain === personal || domain.endsWith('.' + personal)
    );
  }

  private sanitizeUrl(url?: string): string {
    if (!url) return "";
    
    try {
      const urlObj = new URL(url);
      // Keep only the domain and basic path structure, remove query params and fragments
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname.split('/').slice(0, 3).join('/')}`;
    } catch {
      return "[sanitized-url]";
    }
  }

  private sanitizeTitle(title?: string): string {
    if (!title) return "";
    
    // Remove potentially personal information from titles
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN patterns
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Credit card patterns
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email addresses
      /\b\d{3}-\d{3}-\d{4}\b/g, // Phone numbers
    ];

    let sanitized = title;
    sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    return sanitized;
  }

  getDefaultPrivacySettings(): PrivacySettings {
    return {
      excludeSensitiveSites: true,
      excludeWorkSites: false,
      excludePersonalSites: false,
      maxHistoryAge: 7,
      allowNightTimeAnalysis: true,
    };
  }

  getParanoidPrivacySettings(): PrivacySettings {
    return {
      excludeSensitiveSites: true,
      excludeWorkSites: true,
      excludePersonalSites: true,
      maxHistoryAge: 3,
      allowNightTimeAnalysis: false,
    };
  }
}