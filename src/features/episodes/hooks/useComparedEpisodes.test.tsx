import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { characterKeys } from "@/features/characters/queries";
import type { Character } from "@/features/characters/types/character.types";
import { createAppWrapper } from "@/test/test-utils";
import { useComparedEpisodes } from "./useComparedEpisodes";

function buildCharacter(id: number, episodeIds: number[]): Character {
  return {
    id,
    name: `Character ${id}`,
    status: "Alive",
    species: "Human",
    imageUrl: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
    episodeIds,
  };
}

function seedSelectedCharacters(
  queryClient: ReturnType<typeof createAppWrapper>["queryClient"],
) {
  queryClient.setQueryData(
    characterKeys.detail(1),
    buildCharacter(1, [1, 2, 3]),
  );
  queryClient.setQueryData(
    characterKeys.detail(2),
    buildCharacter(2, [3, 4, 5]),
  );
}

describe("useComparedEpisodes", () => {
  // The brief asks for this literally: nothing shows until both panels have a pick.
  it("stays empty and asks for nothing while a slot is unfilled", async () => {
    const { wrapper } = createAppWrapper({ initialSlots: { "1": 1, "2": null } });
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const { result } = renderHook(() => useComparedEpisodes(), { wrapper });

    expect(result.current.isComparisonReady).toBe(false);
    expect(result.current.onlyInFirst).toEqual([]);
    expect(result.current.sharedByBoth).toEqual([]);
    expect(result.current.onlyInSecond).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("/episode/"),
      expect.anything(),
    );

    fetchSpy.mockRestore();
  });

  it("splits the episodes into the three sections once both slots are filled", async () => {
    const { wrapper, queryClient } = createAppWrapper({
      initialSlots: { "1": 1, "2": 2 },
    });
    seedSelectedCharacters(queryClient);

    const { result } = renderHook(() => useComparedEpisodes(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isComparisonReady).toBe(true);
    expect(result.current.onlyInFirst.map((e) => e.id)).toEqual([1, 2]);
    expect(result.current.sharedByBoth.map((e) => e.id)).toEqual([3]);
    expect(result.current.onlyInSecond.map((e) => e.id)).toEqual([4, 5]);
  });

  // Fetching one request per section would still look right on screen, so only a
  // test can catch it.
  it("serves all three sections with a single request", async () => {
    const { wrapper, queryClient } = createAppWrapper({
      initialSlots: { "1": 1, "2": 2 },
    });
    seedSelectedCharacters(queryClient);

    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useComparedEpisodes(), { wrapper });

    await waitFor(() => expect(result.current.sharedByBoth).toHaveLength(1));

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    fetchSpy.mockRestore();
  });
});
