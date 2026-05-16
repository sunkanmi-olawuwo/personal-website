import { describe, expect, it } from "vitest";

import {
  formatPublishedDate,
  getReadingMinutes,
  slugifyHeading,
} from "@/lib/utils";

describe("getReadingMinutes", () => {
  it("returns at least 1 minute for empty inputs", () => {
    expect(getReadingMinutes(undefined)).toBe(1);
    expect(getReadingMinutes(null)).toBe(1);
    expect(getReadingMinutes("")).toBe(1);
    expect(getReadingMinutes({ text: "" })).toBe(1);
  });

  it("computes reading time at ~220 wpm from raw text", () => {
    const wordCount = 660;
    const text = Array.from({ length: wordCount }, () => "word").join(" ");
    expect(getReadingMinutes(text)).toBe(3);
  });

  it("strips html tags when given an html string", () => {
    const wordCount = 440;
    const innerText = Array.from({ length: wordCount }, () => "word").join(" ");
    const html = `<p>${innerText}</p>`;
    expect(getReadingMinutes({ html })).toBe(2);
  });
});

describe("formatPublishedDate", () => {
  it("formats ISO strings into en-GB short form", () => {
    expect(formatPublishedDate("2026-05-12T09:00:00Z")).toMatch(/12 May 2026/);
  });

  it("returns null for invalid input", () => {
    expect(formatPublishedDate(undefined)).toBeNull();
    expect(formatPublishedDate(null)).toBeNull();
    expect(formatPublishedDate("not-a-date")).toBeNull();
  });
});

describe("slugifyHeading", () => {
  it("lowercases, collapses whitespace and strips punctuation", () => {
    expect(slugifyHeading("The Cost of Context!")).toBe("the-cost-of-context");
  });

  it("removes diacritics", () => {
    expect(slugifyHeading("Café résumé")).toBe("cafe-resume");
  });

  it("falls back to empty-safe output", () => {
    expect(slugifyHeading("---")).toBe("");
  });
});
