"use client";

import { AlertIcon, CompareIcon } from "@/core/components/icons/Icons";
import { Button, EmptyState, Panel } from "@/core/components/ui";
import type { Character } from "@/features/characters/types/character.types";
import { useComparedEpisodes } from "../hooks/useComparedEpisodes";
import { EpisodePanel } from "./EpisodePanel";

interface ExclusiveEpisodesEmptyStateProps {
  character: Character | null;
  otherCharacter: Character | null;
  isSameCharacter: boolean;
}

/**
 * Picking the same character on both sides is allowed: it is a valid, if
 * degenerate, comparison. It needs its own copy, though — "Rick only appears
 * alongside Rick" reads like a bug.
 */
function ExclusiveEpisodesEmptyState({
  character,
  otherCharacter,
  isSameCharacter,
}: ExclusiveEpisodesEmptyStateProps) {
  if (isSameCharacter) {
    return (
      <EmptyState
        title="Same character on both sides"
        description={`${character?.name} is selected in both panels, so every episode is shared.`}
      />
    );
  }

  return (
    <EmptyState
      title="Always together"
      description={`${character?.name} never appears without ${otherCharacter?.name}.`}
    />
  );
}

function MissingSelectionState({
  first,
  second,
}: {
  first: Character | null;
  second: Character | null;
}) {
  const hasOne = first !== null || second !== null;
  const missingSlot = first === null ? "#1" : "#2";

  return (
    <EmptyState
      icon={<CompareIcon className="size-7" />}
      title={hasOne ? "One more to go" : "Pick a character in each panel"}
      description={
        hasOne
          ? `Pick a character in Character ${missingSlot} to see the comparison.`
          : "Choose one on the left and one on the right to compare their episodes."
      }
    />
  );
}

export function EpisodeComparison() {
  const {
    isComparisonReady,
    selectedCharacters,
    counts,
    onlyInFirst,
    sharedByBoth,
    onlyInSecond,
    isLoading,
    isError,
    retry,
  } = useComparedEpisodes();

  const first = selectedCharacters["1"];
  const second = selectedCharacters["2"];
  const isSameCharacter = first !== null && first.id === second?.id;

  if (!isComparisonReady) {
    return (
      <Panel>
        <MissingSelectionState first={first} second={second} />
      </Panel>
    );
  }

  if (isError) {
    return (
      <Panel>
        <EmptyState
          icon={<AlertIcon className="size-7" />}
          title="Couldn't load the episodes"
          description="The Rick and Morty API didn't respond."
          action={
            <Button size="sm" onClick={retry}>
              Try again
            </Button>
          }
        />
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <EpisodePanel
        section="first"
        id="episodes-first"
        title="Character #1 only"
        count={counts.onlyInFirst}
        episodes={onlyInFirst}
        isLoading={isLoading}
        emptyState={
          <ExclusiveEpisodesEmptyState
            character={first}
            otherCharacter={second}
            isSameCharacter={isSameCharacter}
          />
        }
      />

      <EpisodePanel
        section="shared"
        id="episodes-shared"
        title="Shared episodes"
        count={counts.sharedByBoth}
        episodes={sharedByBoth}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title="No episodes in common"
            description="These two never appear together."
          />
        }
      />

      <EpisodePanel
        section="second"
        id="episodes-second"
        title="Character #2 only"
        count={counts.onlyInSecond}
        episodes={onlyInSecond}
        isLoading={isLoading}
        emptyState={
          <ExclusiveEpisodesEmptyState
            character={second}
            otherCharacter={first}
            isSameCharacter={isSameCharacter}
          />
        }
      />
    </div>
  );
}
