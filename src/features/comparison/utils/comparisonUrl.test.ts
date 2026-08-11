import { describe, expect, it } from "vitest";
import {
  buildComparisonQueryString,
  parseComparisonSlots,
} from "./comparisonUrl";

describe("sharing a comparison through the url", () => {
  it("round-trips a comparison unchanged", () => {
    const slots = { "1": 361, "2": 2 };
    const params = new URLSearchParams(buildComparisonQueryString(slots));

    expect(parseComparisonSlots(Object.fromEntries(params))).toEqual(slots);
  });

  /** A shared link is untrusted input: anything unusable degrades to no selection. */
  it("ignores values that are not a usable character id", () => {
    const parsedIds = ["abc", "1.5", "0", "-3", ""].map(
      (rawValue) => parseComparisonSlots({ c1: rawValue })["1"],
    );

    expect(parsedIds).toEqual([null, null, null, null, null]);
  });
});
