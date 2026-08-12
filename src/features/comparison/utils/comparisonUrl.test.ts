import { describe, expect, it } from "vitest";
import { buildComparisonUrl, parseComparisonSlots } from "./comparisonUrl";

const CURRENT_URL = "https://example.com/?c1=1&utm_source=newsletter#episodes";

describe("sharing a comparison through the url", () => {
  it("round-trips a comparison unchanged", () => {
    const slots = { "1": 361, "2": 2 };
    const built = buildComparisonUrl("https://example.com/", slots);
    const params = new URLSearchParams(built.split("?")[1]);

    expect(parseComparisonSlots(Object.fromEntries(params))).toEqual(slots);
  });

  it("ignores values that are not a usable character id", () => {
    const parsedIds = ["abc", "1.5", "0", "-3", ""].map(
      (rawValue) => parseComparisonSlots({ c1: rawValue })["1"],
    );

    expect(parsedIds).toEqual([null, null, null, null, null]);
  });

  // Dropping these would silently lose campaign attribution and break deep links.
  it("keeps the params and fragment the visitor arrived with", () => {
    const built = buildComparisonUrl(CURRENT_URL, { "1": 1, "2": 47 });

    expect(built).toContain("utm_source=newsletter");
    expect(built).toContain("#episodes");
    expect(built).toContain("c2=47");
  });

  it("removes the param of a slot that was cleared", () => {
    const built = buildComparisonUrl(CURRENT_URL, { "1": null, "2": null });

    expect(built).not.toContain("c1=");
    expect(built).toContain("utm_source=newsletter");
  });
});
