"use client";

import { cva } from "class-variance-authority";
import { memo } from "react";
import { CheckIcon } from "@/core/components/icons/Icons";
import { Badge, type BadgeProps } from "@/core/components/ui";
import { cn } from "@/core/lib/cn";
import { useComparisonStore } from "@/features/comparison/store/ComparisonStoreProvider";
import {
  accentClasses,
  accentForSlot,
} from "@/features/comparison/utils/slotAccent";
import { useCharacterSlotId } from "../context/CharacterSectionContext";
import type { Character, CharacterStatus } from "../types/character.types";
import { CharacterAvatar } from "./CharacterAvatar";

const STATUS_TONES: Record<CharacterStatus, BadgeProps["tone"]> = {
  Alive: "positive",
  Dead: "negative",
  unknown: "neutral",
};

const cardStyles = cva(
  "flex w-full items-center gap-3 rounded-card border border-hairline bg-panel p-3 text-left transition",
  {
    variants: {
      accent: { primary: "", secondary: "" },
      isSelected: { true: "", false: "hover:-translate-y-px" },
    },
    compoundVariants: [
      {
        accent: "primary",
        isSelected: true,
        class: "border-slot-1 bg-slot-1-wash ring-2 ring-slot-1",
      },
      {
        accent: "secondary",
        isSelected: true,
        class: "border-slot-2 bg-slot-2-wash ring-2 ring-slot-2",
      },
      { accent: "primary", isSelected: false, class: "hover:border-slot-1" },
      { accent: "secondary", isSelected: false, class: "hover:border-slot-2" },
    ],
  },
);

interface CharacterCardProps {
  character: Character;
}

function CharacterCardComponent({ character }: CharacterCardProps) {
  const slotId = useCharacterSlotId();
  const accent = accentForSlot(slotId);

  const isSelected = useComparisonStore(
    (state) => state.slots[slotId] === character.id,
  );
  const selectCharacterForSlot = useComparisonStore(
    (state) => state.selectCharacterForSlot,
  );

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => selectCharacterForSlot(slotId, character.id)}
      className={cn(cardStyles({ accent, isSelected }), "relative")}
    >
      <CharacterAvatar
        character={character}
        size={72}
        className="size-18 rounded-input"
      />

      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="type-mono-label text-text-faint">
          ID {String(character.id).padStart(3, "0")}
        </span>
        <span className="type-body-lg text-text">{character.name}</span>
        <Badge tone={STATUS_TONES[character.status]}>
          {character.status} · {character.species}
        </Badge>
      </span>

      {isSelected && (
        <CheckIcon
          className={cn(
            "absolute top-2 right-2 size-4",
            accentClasses(accent).text,
          )}
        />
      )}
    </button>
  );
}

export const CharacterCard = memo(CharacterCardComponent);
