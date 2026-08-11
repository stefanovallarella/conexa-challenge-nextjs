import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCharacterFilters } from "./useCharacterFilters";

describe("character panel filters", () => {
  /**
   * Without this, somebody on page 12 who then searches lands on page 12 of a
   * result set that may only have one page, and sees nothing.
   */
  it("returns to the first page whenever the results are narrowed", () => {
    const { result } = renderHook(() => useCharacterFilters());

    act(() => result.current.goToPage(12));
    act(() => result.current.search("rick"));
    expect(result.current.filters.page).toBe(1);

    act(() => result.current.goToPage(12));
    act(() => result.current.filterByStatus("dead"));
    expect(result.current.filters.page).toBe(1);
  });
});
