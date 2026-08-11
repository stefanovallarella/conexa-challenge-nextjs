"use client";

import { CloseIcon } from "@/core/components/icons/Icons";
import { cn } from "@/core/lib/cn";
import { CharacterAvatar } from "@/features/characters/components/CharacterAvatar";
import type { Character } from "@/features/characters/types/character.types";
import { accentClasses, type SlotAccent } from "../utils/slotAccent";

const CHIP_SHAPE =
  "flex h-12 w-full items-center rounded-full border md:w-auto md:min-w-56";

interface CharacterChipProps {
  character: Character | null;
  accent: SlotAccent;
  onClear: () => void;
}

export function CharacterChip({
  character,
  accent,
  onClear,
}: CharacterChipProps) {
  if (character === null) {
    return (
      <p
        className={cn(
          CHIP_SHAPE,
          "type-body justify-center border-dashed border-hairline px-4 text-text-faint",
        )}
      >
        Pick a character
      </p>
    );
  }

  return (
    <p
      className={cn(
        CHIP_SHAPE,
        "gap-3 p-1.5",
        accentClasses(accent).border,
      )}
    >
      <CharacterAvatar
        character={character}
        size={36}
        className="size-9 rounded-full"
      />
      <span className="type-body flex-1 truncate text-text">
        {character.name}
      </span>
      <button
        type="button"
        onClick={onClear}
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-text-faint transition-colors hover:bg-panel-sunken hover:text-text"
      >
        <CloseIcon className="size-4" />
        <span className="sr-only">Clear {character.name}</span>
      </button>
    </p>
  );
}
