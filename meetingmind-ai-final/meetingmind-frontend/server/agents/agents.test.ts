import { describe, it, expect, beforeEach } from "vitest";
import {
  validateTranscript,
  validateQuestion,
  extractJson,
  sanitizeText,
} from "./utils";
import { AgentCache } from "./cache";

describe("Agent Utilities", () => {
  describe("validateTranscript", () => {
    it("should accept valid transcripts", () => {
      const valid = "This is a valid meeting transcript with enough content";
      expect(validateTranscript(valid)).toBe(valid.trim());
    });

    it("should reject empty transcripts", () => {
      expect(() => validateTranscript("")).toThrow("non-empty string");
    });

    it("should reject short transcripts", () => {
      expect(() => validateTranscript("short")).toThrow("too short");
    });

    it("should reject very long transcripts", () => {
      const long = "a".repeat(100001);
      expect(() => validateTranscript(long)).toThrow("too long");
    });
  });

  describe("validateQuestion", () => {
    it("should accept valid questions", () => {
      const valid = "What was discussed?";
      expect(validateQuestion(valid)).toBe(valid.trim());
    });

    it("should reject short questions", () => {
      expect(() => validateQuestion("ab")).toThrow("too short");
    });

    it("should reject long questions", () => {
      const long = "a".repeat(501);
      expect(() => validateQuestion(long)).toThrow("too long");
    });
  });

  describe("extractJson", () => {
    it("should extract JSON object", () => {
      const text = 'Some text {"key": "value"} more text';
      const result = extractJson(text);
      expect(JSON.parse(result)).toEqual({ key: "value" });
    });

    it("should extract JSON array", () => {
      const text = "Text [1, 2, 3] more text";
      const result = extractJson(text);
      expect(JSON.parse(result)).toEqual([1, 2, 3]);
    });

    it("should throw on no JSON", () => {
      expect(() => extractJson("no json here")).toThrow("No JSON found");
    });
  });

  describe("sanitizeText", () => {
    it("should normalize whitespace", () => {
      const text = "Text   with   extra    spaces";
      expect(sanitizeText(text)).toBe("Text with extra spaces");
    });

    it("should remove special characters", () => {
      const text = "Text@#$%with^&*special";
      expect(sanitizeText(text)).toBe("Textwithspecial");
    });
  });
});

describe("Agent Cache", () => {
  let cache: AgentCache<string>;

  beforeEach(() => {
    cache = new AgentCache(1); // 1 minute TTL
  });

  it("should store and retrieve values", () => {
    cache.set("test-input", "test-output");
    expect(cache.get("test-input")).toBe("test-output");
  });

  it("should return null for missing keys", () => {
    expect(cache.get("nonexistent")).toBeNull();
  });

  it("should handle object inputs", () => {
    const input = { transcript: "test" };
    cache.set(input, "result");
    expect(cache.get(input)).toBe("result");
  });

  it("should track hit count", () => {
    cache.set("test", "value");
    cache.get("test");
    cache.get("test");

    const stats = cache.getStats();
    expect(stats.totalHits).toBe(2);
  });

  it("should clear cache", () => {
    cache.set("test", "value");
    cache.clear();
    expect(cache.get("test")).toBeNull();
  });

  it("should provide statistics", () => {
    cache.set("test1", "value1");
    cache.set("test2", "value2");

    const stats = cache.getStats();
    expect(stats.size).toBe(2);
    expect(stats.entries.length).toBe(2);
  });
});
