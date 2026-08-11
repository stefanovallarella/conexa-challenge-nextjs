"use client";

import {
  queryOptions,
  skipToken,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { SLOT_IDS, type SlotId } from "@/core/config/constants";
import { useComparisonStore } from "@/features/comparison/store/ComparisonStoreProvider";
import {
  characterDetailQuery,
  characterKeys,
  findCharacterInLoadedPages,
} from "../queries";
import type { Character } from "../types/character.types";

export type SelectedCharacters = Record<SlotId, Character | null>;

function noSelectedCharacters(): SelectedCharacters {
  return { "1": null, "2": null };
}

export function useSelectedCharacters(): SelectedCharacters {
  const slots = useComparisonStore((state) => state.slots);
  const queryClient = useQueryClient();

  return useQueries({
    queries: SLOT_IDS.map((slotId) => {
      const characterId = slots[slotId];

      if (characterId === null) {
        return queryOptions<Character | null>({
          queryKey: characterKeys.emptySlot(slotId),
          queryFn: skipToken,
        });
      }

      return {
        ...characterDetailQuery(characterId),
        initialData: () => findCharacterInLoadedPages(queryClient, characterId),
      };
    }),
    combine: (results) => {
      const selected = noSelectedCharacters();

      SLOT_IDS.forEach((slotId, index) => {
        selected[slotId] = results[index].data ?? null;
      });

      return selected;
    },
  });
}
