import { describe, expect, it } from "vitest";

import {
  getNextPhotoIndex,
  getPreviousPhotoIndex,
  getTravelStats,
  resolveTravelCountryFromParam,
  resolveTravelCountrySlugFromParam,
  travelCountries,
} from "@/lib/travel-data";

describe("travel data", () => {
  it("keeps the seeded country data valid and globe-addressable", () => {
    const slugs = new Set(travelCountries.map((country) => country.slug));
    const isoCodes = new Set(travelCountries.map((country) => country.isoNumeric));

    expect(slugs.size).toBe(travelCountries.length);
    expect(isoCodes.size).toBe(travelCountries.length);

    for (const country of travelCountries) {
      expect(country.slug).toMatch(/^[a-z0-9-]+$/);
      expect(country.isoNumeric).toMatch(/^\d{3}$/);
      expect(country.photos.length).toBeGreaterThanOrEqual(2);
      expect(country.coverPhoto.src).toMatch(/^\/travel\//);
      expect(country.photos).toContain(country.coverPhoto);
    }
  });

  it("derives editorial travel stats from the local dataset", () => {
    expect(getTravelStats()).toEqual({
      countryCount: 2,
      continentCount: 2,
      cityCount: 6,
      photoCount: 6,
    });
  });

  it("resolves search params with a stable fallback", () => {
    expect(resolveTravelCountrySlugFromParam("united-kingdom")).toBe(
      "united-kingdom",
    );
    expect(resolveTravelCountrySlugFromParam(["nigeria", "ignored"])).toBe(
      "nigeria",
    );
    expect(resolveTravelCountryFromParam("unknown-place").slug).toBe("nigeria");
    expect(resolveTravelCountryFromParam(undefined).slug).toBe("nigeria");
  });

  it("wraps lightbox photo indexes in both directions", () => {
    expect(getNextPhotoIndex(0, 3)).toBe(1);
    expect(getNextPhotoIndex(2, 3)).toBe(0);
    expect(getPreviousPhotoIndex(0, 3)).toBe(2);
    expect(getPreviousPhotoIndex(2, 3)).toBe(1);
    expect(getNextPhotoIndex(0, 0)).toBe(-1);
    expect(getPreviousPhotoIndex(0, 0)).toBe(-1);
  });
});
