import crypto from "crypto";

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export class AgentCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private defaultTTL: number; // milliseconds

  constructor(defaultTTLMinutes: number = 60) {
    this.defaultTTL = defaultTTLMinutes * 60 * 1000;
  }

  /**
   * Generate cache key from input
   */
  private generateKey(input: string | Record<string, unknown>): string {
    const str = typeof input === "string" ? input : JSON.stringify(input);
    return crypto.createHash("sha256").update(str).digest("hex");
  }

  /**
   * Get value from cache
   */
  get(input: string | Record<string, unknown>): T | null {
    const key = this.generateKey(input);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count
    entry.hits++;
    return entry.data;
  }

  /**
   * Set value in cache
   */
  set(
    input: string | Record<string, unknown>,
    data: T,
    ttlMinutes?: number
  ): void {
    const key = this.generateKey(input);
    const ttl = (ttlMinutes || this.defaultTTL / (60 * 1000)) * 60 * 1000;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });
  }

  /**
   * Clear expired entries
   */
  cleanup(): number {
    let removed = 0;
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
    return keysToDelete.length;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    totalHits: number;
    entries: Array<{ key: string; hits: number; age: number }>;
  } {
    const entries: Array<{ key: string; hits: number; age: number }> = [];
    let totalHits = 0;

    this.cache.forEach((entry, key) => {
      entries.push({
        key: key.substring(0, 8) + "...",
        hits: entry.hits,
        age: Date.now() - entry.timestamp,
      });
      totalHits += entry.hits;
    });

    return {
      size: this.cache.size,
      totalHits,
      entries,
    };
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Set TTL for all entries
   */
  setDefaultTTL(minutes: number): void {
    this.defaultTTL = minutes * 60 * 1000;
  }
}

// Create singleton caches for each agent
export const summaryCache = new AgentCache(60); // 1 hour
export const actionItemsCache = new AgentCache(60);
export const qaCache = new AgentCache(120); // 2 hours
export const sentimentCache = new AgentCache(60);
