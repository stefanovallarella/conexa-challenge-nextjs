import { describe, expect, it } from "vitest";
import { fetchCharacterPage } from "./characters.service";

describe("characters service", () => {
  // A search with no matches answers 404, not an empty list.
  it("treats a search with no matches as an empty page, not a failure", async () => {
    const page = await fetchCharacterPage({ page: 5, name: "nobody" });

    expect(page.characters).toEqual([]);
    expect(page.totalCount).toBe(0);
    expect(page.currentPage).toBe(5);
  });
});
