"use client";

import { AlertIcon, SearchIcon } from "@/core/components/icons/Icons";
import { Button, EmptyState } from "@/core/components/ui";
import type { Character } from "../types/character.types";
import { CharacterCard } from "./CharacterCard";
import { CharacterCardSkeleton } from "./CharacterCardSkeleton";

const SKELETON_COUNT = 6;

interface CharacterGridProps {
  characters: Character[];
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  onRetry: () => void;
  onClearSearch: () => void;
}

export function CharacterGrid({
  characters,
  isLoading,
  isError,
  searchTerm,
  onRetry,
  onClearSearch,
}: CharacterGridProps) {
  if (isError) {
    return (
      <EmptyState
        icon={<AlertIcon className="size-6" />}
        title="Couldn't load characters"
        description="The Rick and Morty API didn't respond."
        action={
          <Button size="sm" onClick={onRetry}>
            Try again
          </Button>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-3 p-3 xl:grid-cols-2">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <CharacterCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <EmptyState
        icon={<SearchIcon className="size-6" />}
        title={
          searchTerm
            ? `No characters match "${searchTerm}"`
            : "No characters match these filters"
        }
        description="Try another name, or reset the search."
        action={
          <Button size="sm" onClick={onClearSearch}>
            Reset search
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-3 p-3 xl:grid-cols-2">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
