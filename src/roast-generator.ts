import { BrowserHistoryEntry } from "./browser-history.js";

interface BrowsingPattern {
  type: string;
  count: number;
  percentage: number;
  examples: string[];
}

interface BrowsingAnalysis {
  totalVisits: number;
  uniqueDomains: number;
  topDomains: Array<{ domain: string; count: number; percentage: number }>;
  timePatterns: {
    morningVisits: number;
    afternoonVisits: number;
    eveningVisits: number;
    lateNightVisits: number;
  };
  patterns: BrowsingPattern[];
  embarrassingFactors: Array<{ factor: string; severity: number; description: string }>;
  productivity: {
    productiveVisits: number;
    procrastinationVisits: number;
    productivityScore: number;
  };
}

export class RoastGenerator {
  private readonly roastTemplates = {
    gentle: {
      openings: [
        "So I took a look at your browser history and... well, this should be fun.",
        "Your internet activity is like a Netflix series - I can't look away.",
        "I've seen your browsing patterns, and I have some thoughts...",
        "Let's talk about your digital lifestyle choices, shall we?",
      ],
      patterns: {
        social_media_addiction: [
          "You visited social media {count} times. At this point, you're basically an unpaid intern for Mark Zuckerberg.",
          "Instagram is getting more attention from you than your actual relationships.",
          "You've refreshed Twitter so much, you're single-handedly keeping their servers warm.",
        ],
        procrastination: [
          "YouTube has seen more of you than your family this week.",
          "You've turned 'quick Reddit check' into an Olympic sport.",
          "Your productivity is like a unicorn - everyone talks about it, nobody's seen it.",
        ],
        shopping: [
          "Amazon delivery drivers have your coffee order memorized at this point.",
          "You browse online stores like some people browse museums - frequently and with reverence.",
          "Your credit card is crying and filing a restraining order.",
        ],
        binge_watching: [
          "Your streaming habits suggest you're training for the Olympics of doing nothing.",
          "Netflix is considering adding you to their board of directors.",
        ],
        developer_procrastination: [
          "You've turned 'researching best practices' into an art form of avoiding actual work.",
          "Your GitHub stars list is longer than your commit history.",
        ],
        digital_obsession: [
          "You visit the same site so often, they're considering naming a server after you.",
        ],
        compulsive_refreshing: [
          "Your F5 key has filed for workers' compensation.",
        ],
      },
      closings: [
        "But hey, consistency is a virtue, right?",
        "At least you're committed to your hobbies!",
        "Keep being... exactly who you are, I guess.",
      ],
    },
    medium: {
      openings: [
        "Alright, let's roast this browser history like it owes me money.",
        "I analyzed your browsing habits and... someone needs an intervention.",
        "Your internet activity reads like a case study in digital self-destruction.",
        "Let me paint you a picture of your online existence...",
      ],
      patterns: {
        social_media_addiction: [
          "You've been on social media {count} times. That's not scrolling, that's a medical condition.",
          "Instagram models are jealous of how much time you spend looking at Instagram models.",
          "You refresh Facebook more often than some people blink.",
          "TikTok's algorithm has achieved consciousness just to keep up with your viewing habits.",
        ],
        procrastination: [
          "You've mastered the ancient art of turning 'I'll just watch one video' into a four-hour commitment.",
          "Reddit has seen more dedication from you than most marriages receive.",
          "Your browser history is like a masterclass in avoiding responsibilities.",
          "YouTube's recommendation engine is basically your life coach at this point.",
        ],
        shopping: [
          "You window shop online so much, actual windows are getting jealous.",
          "Amazon's algorithm knows what you want before you do - and that's concerning.",
          "Your shopping cart abandonment rate is lower than most people's commitment to exercise.",
          "Jeff Bezos could probably retire just on your browsing data alone.",
        ],
        weird_hours: [
          "3 AM browsing sessions? Your sleep schedule has given up and moved out.",
          "You treat the internet like a 24-hour diner - always open, questionable choices.",
          "Your late-night browsing habits make insomniacs look well-adjusted.",
        ],
        binge_watching: [
          "Your binge-watching stamina is impressive, if this were a competitive sport for couch potatoes.",
          "You've turned 'just one more episode' into a lifestyle philosophy.",
          "Your streaming service usage would impress a data center.",
        ],
        developer_procrastination: [
          "You've mastered the art of 'researching' instead of coding.",
          "Your bookmark folder is more organized than your actual code.",
          "You spend more time reading about programming than actually programming.",
        ],
        digital_obsession: [
          "You've achieved true dedication to digital monotony.",
          "Your browser history reads like a love letter to one website.",
        ],
        compulsive_refreshing: [
          "You refresh pages more than a broken air freshener.",
          "Your browser thinks it's stuck in a time loop.",
        ],
      },
      closings: [
        "But at least you're thorough in your digital dysfunction!",
        "Your commitment to chaos is almost admirable.",
        "Never change... actually, please change.",
      ],
    },
    savage: {
      openings: [
        "Holy hell, your browser history is a crime scene and I'm the detective.",
        "I've seen war zones with better organization than your browsing habits.",
        "Your internet activity is like watching a slow-motion car crash in real time.",
        "Buckle up, because your digital life choices are about to get absolutely destroyed.",
      ],
      patterns: {
        social_media_addiction: [
          "You've been on social media {count} times. At this point, you're not using the app - you ARE the app.",
          "Your Instagram addiction is so severe, influencers are starting a support group for you.",
          "You've spent so much time on TikTok, your attention span is now measured in milliseconds.",
          "Facebook's data center has a shrine dedicated to your engagement metrics.",
          "You refresh social media more than a broken browser. Get help.",
        ],
        procrastination: [
          "You've turned procrastination into performance art, and nobody asked for this exhibition.",
          "Your productivity is so non-existent, it's being studied by physicists as theoretical matter.",
          "YouTube has seen more of your potential than your actual accomplishments.",
          "You've spent {count} visits avoiding work. Congratulations, you're professionally useless.",
          "Your browsing history is what happens when ADHD meets unlimited internet access.",
        ],
        shopping: [
          "Your online shopping habits are so excessive, economists use you as a case study for consumer madness.",
          "Amazon's stock price fluctuates based on your mood swings.",
          "You've browsed so many products, you're basically an unpaid market researcher for capitalism.",
          "Your cart-to-purchase ratio is more unstable than your life choices.",
          "Online retailers have nightmares about customers like you - lots of looking, zero commitment.",
        ],
        weird_hours: [
          "Your 3 AM browsing sessions are so consistent, shift workers are jealous of your schedule.",
          "You treat the internet like a vampire treats blood - constant, nocturnal, and slightly concerning.",
          "Your late-night browsing is so extensive, you're basically funding server farms worldwide.",
          "Sleep is for people who don't need to know what happens next on Reddit at 2:47 AM.",
        ],
        questionable_content: [
          "Some of these sites make me question not just your judgment, but the entire concept of free will.",
          "Your browsing history needs a parental advisory warning, and you're the parent.",
          "I've seen things in your history that would make a search engine blush.",
        ],
        binge_watching: [
          "Your streaming addiction is so severe, you've single-handedly caused bandwidth shortages.",
          "You've turned binge-watching into a full-contact sport, and you're losing.",
          "Your relationship with Netflix is more committed than most marriages.",
        ],
        developer_procrastination: [
          "You've achieved legendary status in the art of coding avoidance.",
          "Your 'research' time vs actual coding time ratio violates several laws of physics.",
          "You collect programming articles like some people collect stamps - obsessively and pointlessly.",
        ],
        digital_obsession: [
          "Your obsession with one website is so intense, stalkers are taking notes.",
          "You've transcended being a user - you're basically digital furniture at this point.",
        ],
        compulsive_refreshing: [
          "Your compulsive refreshing has reached levels that would concern addiction specialists.",
          "You refresh pages so obsessively, the servers are developing anxiety disorders.",
        ],
      },
      closings: [
        "But hey, at least you're consistent in your digital disasters!",
        "Your internet habits are what anthropologists will study when civilization falls.",
        "I'd say touch grass, but at this point, you might need professional intervention.",
        "Your browser history is getting its own Netflix documentary called 'How Not to Internet'.",
      ],
    },
  };

  private readonly embarrassingDomains = {
    social_media: [
      "facebook.com", "instagram.com", "twitter.com", "tiktok.com", "snapchat.com",
      "linkedin.com", "reddit.com", "pinterest.com", "tumblr.com", "discord.com",
    ],
    procrastination: [
      "youtube.com", "reddit.com", "9gag.com", "buzzfeed.com", "imgur.com",
      "netflix.com", "twitch.tv", "memes.com", "boredpanda.com", "distractify.com",
    ],
    shopping: [
      "amazon.com", "ebay.com", "etsy.com", "alibaba.com", "wish.com",
      "aliexpress.com", "shopify.com", "target.com", "walmart.com", "shein.com",
    ],
    weird_content: [
      "wikihow.com", "stackoverflow.com", "quora.com", "yahoo.answers.com",
    ],
    productivity_killers: [
      "youtube.com", "reddit.com", "facebook.com", "instagram.com", "twitter.com",
      "netflix.com", "twitch.tv", "tiktok.com",
    ],
    binge_worthy: [
      "netflix.com", "hulu.com", "disney.com", "amazon.com", "youtube.com",
      "twitch.tv", "crunchyroll.com", "funimation.com",
    ],
    developer_procrastination: [
      "stackoverflow.com", "github.com", "hackernews.com", "dev.to", "medium.com",
      "reddit.com", "producthunt.com",
    ],
  };

  analyzePatterns(history: BrowserHistoryEntry[]): BrowsingAnalysis {
    const totalVisits = history.length;
    const domainCounts = new Map<string, number>();
    const patterns: BrowsingPattern[] = [];
    const embarrassingFactors: Array<{ factor: string; severity: number; description: string }> = [];

    // Count domain visits
    history.forEach(entry => {
      const count = domainCounts.get(entry.domain) || 0;
      domainCounts.set(entry.domain, count + 1);
    });

    const topDomains = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([domain, count]) => ({
        domain,
        count,
        percentage: (count / totalVisits) * 100,
      }));

    // Analyze time patterns
    const timePatterns = this.analyzeTimePatterns(history);

    // Analyze browsing patterns with more comedian-friendly detection
    patterns.push(...this.analyzeSocialMediaUsage(history, domainCounts));
    patterns.push(...this.analyzeProcrastination(history, domainCounts));
    patterns.push(...this.analyzeShoppingHabits(history, domainCounts));
    patterns.push(...this.analyzeBingePatterns(history, domainCounts));
    patterns.push(...this.analyzeDeveloperProcrastination(history, domainCounts));
    patterns.push(...this.analyzeDigitalAddictionPatterns(history, domainCounts));

    // Calculate embarrassing factors
    embarrassingFactors.push(...this.calculateEmbarrassingFactors(history, domainCounts, timePatterns));

    // Calculate productivity score
    const productivity = this.calculateProductivity(history, domainCounts);

    return {
      totalVisits,
      uniqueDomains: domainCounts.size,
      topDomains,
      timePatterns,
      patterns,
      embarrassingFactors,
      productivity,
    };
  }

  async generateRoast(history: BrowserHistoryEntry[], severity: string): Promise<string> {
    const analysis = this.analyzePatterns(history);
    const templates = this.roastTemplates[severity as keyof typeof this.roastTemplates] || this.roastTemplates.medium;
    
    let roast = this.getRandomItem(templates.openings) + "\n\n";

    // Build a comedian-style set with observational callbacks
    const roastSegments: string[] = [];

    // Add specific pattern roasts with setup-punchline structure
    const significantPatterns = analysis.patterns.filter(p => p.percentage > 10);
    
    if (significantPatterns.length > 0) {
      significantPatterns.forEach(pattern => {
        const patternRoasts = templates.patterns[pattern.type as keyof typeof templates.patterns];
        if (patternRoasts) {
          const roastTemplate = this.getRandomItem(patternRoasts);
          const roastText = roastTemplate
            .replace("{count}", pattern.count.toString())
            .replace("{percentage}", pattern.percentage.toFixed(1))
            .replace("{days}", "7"); // TODO: make this dynamic
          roastSegments.push(roastText);
        }
      });
    }

    // Add observational humor about browsing patterns
    roastSegments.push(...this.generateObservationalRoasts(analysis, severity));

    // Add time-based roasts with more specificity
    if (analysis.timePatterns.lateNightVisits > analysis.totalVisits * 0.2) {
      const lateNightRoasts = (templates.patterns as any).weird_hours;
      if (lateNightRoasts) {
        roastSegments.push(this.getRandomItem(lateNightRoasts));
      }
    }

    // Add productivity roast with comedian timing
    if (analysis.productivity.productivityScore < 0.3) {
      const productivityScore = (analysis.productivity.productivityScore * 100).toFixed(1);
      roastSegments.push(this.generateProductivityRoast(productivityScore, severity));
    }

    // Add domain-specific observations
    if (analysis.topDomains.length > 0) {
      roastSegments.push(this.generateDomainRoast(analysis.topDomains[0], analysis.totalVisits, severity));
    }

    // Add callback to earlier material (classic roast technique)
    if (roastSegments.length > 1) {
      roastSegments.push(this.generateCallback(analysis, severity));
    }

    // Assemble the roast with proper pacing
    roast += roastSegments.join("\n\n") + "\n\n";
    roast += this.getRandomItem(templates.closings);

    return roast;
  }

  private generateObservationalRoasts(analysis: BrowsingAnalysis, severity: string): string[] {
    const observations: string[] = [];
    
    // Ratio observations (classic roast format)
    const socialMediaRatio = analysis.patterns.find(p => p.type === "social_media_addiction")?.percentage || 0;
    const procrastinationRatio = analysis.patterns.find(p => p.type === "procrastination")?.percentage || 0;
    
    if (socialMediaRatio > 30) {
      if (severity === "savage") {
        observations.push(`You spend ${socialMediaRatio.toFixed(1)}% of your time on social media. That's not networking, that's digital hoarding.`);
      } else if (severity === "medium") {
        observations.push(`${socialMediaRatio.toFixed(1)}% social media usage? At this point, you're basically a content curator for your own loneliness.`);
      } else {
        observations.push(`${socialMediaRatio.toFixed(1)}% of your browsing is social media. That's... thorough market research?`);
      }
    }

    // Time pattern observations
    const nightOwlPercentage = (analysis.timePatterns.lateNightVisits / analysis.totalVisits) * 100;
    if (nightOwlPercentage > 25) {
      if (severity === "savage") {
        observations.push(`${nightOwlPercentage.toFixed(1)}% of your browsing happens after 11 PM. Your circadian rhythm filed for divorce.`);
      } else {
        observations.push(`${nightOwlPercentage.toFixed(1)}% late-night browsing? Someone's living that vampire lifestyle.`);
      }
    }

    // Domain diversity observations
    const diversityRatio = analysis.uniqueDomains / analysis.totalVisits;
    if (diversityRatio < 0.3) {
      observations.push(severity === "savage" 
        ? "You visit the same few sites repeatedly like a digital hamster on a wheel."
        : "You've got your favorite corners of the internet figured out, don't you?");
    }

    return observations;
  }

  private generateProductivityRoast(score: string, severity: string): string {
    const roasts = {
      savage: [
        `Your productivity score is ${score}%. I've seen more accomplishment from a screensaver.`,
        `${score}% productivity? That's not a score, that's a cry for help.`,
        `Your ${score}% productivity score is being studied by economists as a new form of negative growth.`,
      ],
      medium: [
        `Your productivity score is ${score}%. Your potential called - it wants a divorce.`,
        `${score}% productivity? That's impressive commitment to absolutely nothing.`,
        `Your productivity score of ${score}% explains why your to-do list has cobwebs.`,
      ],
      gentle: [
        `Your productivity score is ${score}%. Hey, at least you're consistent!`,
        `${score}% productivity - you've mastered the art of selective engagement.`,
      ]
    };

    const options = roasts[severity as keyof typeof roasts] || roasts.medium;
    return this.getRandomItem(options);
  }

  private generateDomainRoast(topDomain: any, totalVisits: number, severity: string): string {
    const percentage = topDomain.percentage.toFixed(1);
    const domainRoasts = {
      savage: [
        `Your most visited site is ${topDomain.domain} with ${topDomain.count} visits. That's not browsing, that's a relationship.`,
        `${topDomain.domain} represents ${percentage}% of your internet life. They should send you a Christmas card.`,
        `You've been to ${topDomain.domain} ${topDomain.count} times. At this point, you're not a user, you're furniture.`,
      ],
      medium: [
        `Your top site is ${topDomain.domain} with ${topDomain.count} visits. Someone's got a type.`,
        `${percentage}% of your browsing goes to ${topDomain.domain}. That's not loyalty, that's dependency.`,
        `${topDomain.domain} sees more of you than your family does.`,
      ],
      gentle: [
        `Your most visited site is ${topDomain.domain} with ${topDomain.count} visits. You know what you like!`,
        `${topDomain.domain} is clearly your digital happy place.`,
      ]
    };

    const options = domainRoasts[severity as keyof typeof domainRoasts] || domainRoasts.medium;
    return this.getRandomItem(options);
  }

  private generateCallback(analysis: BrowsingAnalysis, severity: string): string {
    // Classic roast technique - callback to earlier material
    const callbacks = {
      savage: [
        "But seriously, looking at all this data together... it's like watching someone speedrun digital self-destruction.",
        "The real question isn't what you're browsing - it's how you have time for anything else.",
        "I've seen addiction documentaries with more balance than your browser history.",
      ],
      medium: [
        "Put it all together, and your browsing habits read like a choose-your-own-adventure book where every choice leads to procrastination.",
        "The pattern here is clear: you've achieved perfect consistency in digital chaos.",
        "Looking at the big picture, you've basically gamified wasting time.",
      ],
      gentle: [
        "All in all, you've created quite the digital ecosystem for yourself.",
        "Your browsing patterns tell a story, and that story is... interesting.",
      ]
    };

    const options = callbacks[severity as keyof typeof callbacks] || callbacks.medium;
    return this.getRandomItem(options);
  }

  private analyzeSocialMediaUsage(history: BrowserHistoryEntry[], domainCounts: Map<string, number>): BrowsingPattern[] {
    const socialMediaVisits = this.countDomainsByCategory(domainCounts, this.embarrassingDomains.social_media);
    const totalVisits = history.length;
    
    if (socialMediaVisits.count > 0) {
      return [{
        type: "social_media_addiction",
        count: socialMediaVisits.count,
        percentage: (socialMediaVisits.count / totalVisits) * 100,
        examples: socialMediaVisits.examples,
      }];
    }
    return [];
  }

  private analyzeProcrastination(history: BrowserHistoryEntry[], domainCounts: Map<string, number>): BrowsingPattern[] {
    const procrastinationVisits = this.countDomainsByCategory(domainCounts, this.embarrassingDomains.procrastination);
    const totalVisits = history.length;
    
    if (procrastinationVisits.count > 0) {
      return [{
        type: "procrastination",
        count: procrastinationVisits.count,
        percentage: (procrastinationVisits.count / totalVisits) * 100,
        examples: procrastinationVisits.examples,
      }];
    }
    return [];
  }

  private analyzeShoppingHabits(history: BrowserHistoryEntry[], domainCounts: Map<string, number>): BrowsingPattern[] {
    const shoppingVisits = this.countDomainsByCategory(domainCounts, this.embarrassingDomains.shopping);
    const totalVisits = history.length;
    
    if (shoppingVisits.count > 0) {
      return [{
        type: "shopping",
        count: shoppingVisits.count,
        percentage: (shoppingVisits.count / totalVisits) * 100,
        examples: shoppingVisits.examples,
      }];
    }
    return [];
  }

  private analyzeTimePatterns(history: BrowserHistoryEntry[]) {
    const patterns = {
      morningVisits: 0,
      afternoonVisits: 0,
      eveningVisits: 0,
      lateNightVisits: 0,
    };

    history.forEach(entry => {
      const hour = entry.visitTime.getHours();
      if (hour >= 6 && hour < 12) patterns.morningVisits++;
      else if (hour >= 12 && hour < 18) patterns.afternoonVisits++;
      else if (hour >= 18 && hour < 23) patterns.eveningVisits++;
      else patterns.lateNightVisits++;
    });

    return patterns;
  }

  private calculateEmbarrassingFactors(
    history: BrowserHistoryEntry[], 
    domainCounts: Map<string, number>, 
    timePatterns: any
  ): Array<{ factor: string; severity: number; description: string }> {
    const factors = [];
    const totalVisits = history.length;

    // Late night browsing
    if (timePatterns.lateNightVisits > totalVisits * 0.2) {
      factors.push({
        factor: "late_night_browsing",
        severity: 8,
        description: "Your 3 AM browsing sessions are more consistent than your sleep schedule.",
      });
    }

    // Social media addiction
    const socialMediaCount = this.countDomainsByCategory(domainCounts, this.embarrassingDomains.social_media).count;
    if (socialMediaCount > totalVisits * 0.3) {
      factors.push({
        factor: "social_media_addiction",
        severity: 9,
        description: "Your social media usage suggests you might need a digital detox... or an intervention.",
      });
    }

    // Shopping addiction
    const shoppingCount = this.countDomainsByCategory(domainCounts, this.embarrassingDomains.shopping).count;
    if (shoppingCount > totalVisits * 0.2) {
      factors.push({
        factor: "shopping_addiction",
        severity: 7,
        description: "Your browser history reads like a shopping spree receipt.",
      });
    }

    return factors;
  }

  private calculateProductivity(history: BrowserHistoryEntry[], domainCounts: Map<string, number>) {
    const productivityKillers = this.countDomainsByCategory(domainCounts, this.embarrassingDomains.productivity_killers);
    const totalVisits = history.length;
    
    const procrastinationVisits = productivityKillers.count;
    const productiveVisits = totalVisits - procrastinationVisits;
    const productivityScore = productiveVisits / totalVisits;

    return {
      productiveVisits,
      procrastinationVisits,
      productivityScore,
    };
  }

  private countDomainsByCategory(domainCounts: Map<string, number>, categoryDomains: string[]) {
    let count = 0;
    const examples: string[] = [];

    categoryDomains.forEach(domain => {
      const domainCount = domainCounts.get(domain) || 0;
      if (domainCount > 0) {
        count += domainCount;
        examples.push(domain);
      }
    });

    return { count, examples: examples.slice(0, 3) };
  }

  private analyzeBingePatterns(history: BrowserHistoryEntry[], domainCounts: Map<string, number>): BrowsingPattern[] {
    const bingeVisits = this.countDomainsByCategory(domainCounts, this.embarrassingDomains.binge_worthy);
    const totalVisits = history.length;
    
    if (bingeVisits.count > 0) {
      return [{
        type: "binge_watching",
        count: bingeVisits.count,
        percentage: (bingeVisits.count / totalVisits) * 100,
        examples: bingeVisits.examples,
      }];
    }
    return [];
  }

  private analyzeDeveloperProcrastination(history: BrowserHistoryEntry[], domainCounts: Map<string, number>): BrowsingPattern[] {
    const devProcrastination = this.countDomainsByCategory(domainCounts, this.embarrassingDomains.developer_procrastination);
    const totalVisits = history.length;
    
    if (devProcrastination.count > 0) {
      return [{
        type: "developer_procrastination",
        count: devProcrastination.count,
        percentage: (devProcrastination.count / totalVisits) * 100,
        examples: devProcrastination.examples,
      }];
    }
    return [];
  }

  private analyzeDigitalAddictionPatterns(history: BrowserHistoryEntry[], domainCounts: Map<string, number>): BrowsingPattern[] {
    const patterns: BrowsingPattern[] = [];
    
    // Check for obsessive single-site usage
    const topDomains = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    topDomains.forEach(([domain, count]) => {
      const percentage = (count / history.length) * 100;
      if (percentage > 40) {
        patterns.push({
          type: "digital_obsession",
          count,
          percentage,
          examples: [domain],
        });
      }
    });

    // Check for rapid-fire browsing (same domain multiple times in short period)
    const rapidFireThreshold = 5; // visits to same domain within 1 hour
    const rapidFireDomains = this.detectRapidFireBrowsing(history, rapidFireThreshold);
    
    if (rapidFireDomains.length > 0) {
      patterns.push({
        type: "compulsive_refreshing",
        count: rapidFireDomains.reduce((sum, d) => sum + d.count, 0),
        percentage: (rapidFireDomains.reduce((sum, d) => sum + d.count, 0) / history.length) * 100,
        examples: rapidFireDomains.map(d => d.domain),
      });
    }

    return patterns;
  }

  private detectRapidFireBrowsing(history: BrowserHistoryEntry[], threshold: number): Array<{domain: string, count: number}> {
    const rapidFire: Array<{domain: string, count: number}> = [];
    const domainTimestamps = new Map<string, Date[]>();
    
    // Group visits by domain with timestamps
    history.forEach(entry => {
      if (!domainTimestamps.has(entry.domain)) {
        domainTimestamps.set(entry.domain, []);
      }
      domainTimestamps.get(entry.domain)!.push(entry.visitTime);
    });

    // Check each domain for rapid-fire patterns
    domainTimestamps.forEach((timestamps, domain) => {
      timestamps.sort((a, b) => a.getTime() - b.getTime());
      
      let consecutiveCount = 1;
      let maxConsecutive = 1;
      
      for (let i = 1; i < timestamps.length; i++) {
        const timeDiff = timestamps[i].getTime() - timestamps[i-1].getTime();
        const hourInMs = 60 * 60 * 1000;
        
        if (timeDiff < hourInMs) {
          consecutiveCount++;
          maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
        } else {
          consecutiveCount = 1;
        }
      }
      
      if (maxConsecutive >= threshold) {
        rapidFire.push({ domain, count: maxConsecutive });
      }
    });

    return rapidFire;
  }

  private getRandomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }
}