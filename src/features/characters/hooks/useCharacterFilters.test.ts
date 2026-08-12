import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCharacterFilters } from "./useCharacterFilters";

describe("character panel filters", () => {
  // Otherwise a reader on page 12 who searches lands on an empty page 12.
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
