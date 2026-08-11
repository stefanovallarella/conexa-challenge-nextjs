import { describe, expect, it } from "vitest";
import { compareEpisodeIds, unionOfEpisodeIds } from "./episodeSets";

describe("splitting two characters' episodes into the three sections", () => {
  it("separates what is exclusive to each from what they share", () => {
    expect(compareEpisodeIds([1, 2, 3, 4], [3, 4, 5])).toEqual({
      onlyInFirst: [1, 2],
      sharedByBoth: [3, 4],
      onlyInSecond: [5],
    });
  });

  it("reports no shared episodes when the characters never meet", () => {
    expect(compareEpisodeIds([1, 2], [3, 4])).toEqual({
      onlyInFirst: [1, 2],
      sharedByBoth: [],
      onlyInSecond: [3, 4],
    });
  });

  it("puts every episode in shared when the same character fills both slots", () => {
    expect(compareEpisodeIds([1, 2, 3], [1, 2, 3])).toEqual({
      onlyInFirst: [],
      sharedByBoth: [1, 2, 3],
      onlyInSecond: [],
    });
  });

  /** The union is what gets requested, so it must ask for each episode once. */
  it("deduplicates the ids that will be fetched", () => {
    expect(unionOfEpisodeIds([31, 2, 3], [3, 10])).toEqual([2, 3, 10, 31]);
  });
});
