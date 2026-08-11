import { describe, expect, it } from "vitest";
import { fetchCharacterPage } from "./characters.service";

describe("characters service", () => {
  /**
   * The API answers a fruitless search with 404. Reading that as a failure would
   * show an error screen to somebody who simply mistyped a name.
   */
  it("treats a search with no matches as an empty page, not a failure", async () => {
    const page = await fetchCharacterPage({ page: 5, name: "nobody" });

    expect(page.characters).toEqual([]);
    expect(page.totalCount).toBe(0);
    expect(page.currentPage).toBe(5);
  });
});
