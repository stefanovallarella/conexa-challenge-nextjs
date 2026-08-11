"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { SlotId } from "@/core/config/constants";

const CharacterSectionContext = createContext<SlotId | null>(null);

interface CharacterSectionProviderProps {
  slotId: SlotId;
  children: ReactNode;
}

export function CharacterSectionProvider({
  slotId,
  children,
}: CharacterSectionProviderProps) {
  return (
    <CharacterSectionContext.Provider value={slotId}>
      {children}
    </CharacterSectionContext.Provider>
  );
}

export function useCharacterSlotId(): SlotId {
  const slotId = useContext(CharacterSectionContext);

  if (slotId === null) {
    throw new Error(
      "useCharacterSlotId must be used inside a CharacterSectionProvider",
    );
  }

  return slotId;
}
