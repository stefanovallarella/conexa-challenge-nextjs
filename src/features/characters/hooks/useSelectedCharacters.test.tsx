import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createAppWrapper } from "@/test/test-utils";
import { characterKeys } from "../queries";
import type { Character } from "../types/character.types";
import { useSelectedCharacters } from "./useSelectedCharacters";

const RICK: Character = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  imageUrl: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  episodeIds: [1, 2, 3],
};

describe("resolving the selected characters", () => {
  it("reuses a character already loaded in a page instead of refetching", async () => {
    const { wrapper, queryClient } = createAppWrapper({
      initialSlots: { "1": 1, "2": null },
    });
    queryClient.setQueryData(characterKeys.page({ page: 1 }), {
      characters: [RICK],
      currentPage: 1,
      totalPages: 42,
      totalCount: 826,
    });

    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useSelectedCharacters(), { wrapper });

    await waitFor(() => expect(result.current["1"]?.name).toBe("Rick Sanchez"));
    expect(fetchSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
  });
});
