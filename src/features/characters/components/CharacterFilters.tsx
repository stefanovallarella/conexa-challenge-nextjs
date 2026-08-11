"use client";

import {
  CHARACTER_STATUSES,
  type CharacterStatusFilter,
} from "@/core/config/constants";
import { SearchInput, Select, type SelectOption } from "@/core/components/ui";
import { accentForSlot } from "@/features/comparison/utils/slotAccent";
import { useCharacterSlotId } from "../context/CharacterSectionContext";

const STATUS_OPTIONS: readonly SelectOption<CharacterStatusFilter>[] =
  CHARACTER_STATUSES.map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }));

interface CharacterFiltersProps {
  searchTerm: string;
  status: CharacterStatusFilter | null;
  onSearch: (searchTerm: string) => void;
  onStatusChange: (status: CharacterStatusFilter | null) => void;
}

export function CharacterFilters({
  searchTerm,
  status,
  onSearch,
  onStatusChange,
}: CharacterFiltersProps) {
  const slotId = useCharacterSlotId();

  return (
    <div className="flex gap-2 border-b border-hairline p-3">
      <SearchInput
        label={`Search characters by name for slot ${slotId}`}
        placeholder="Search by name…"
        value={searchTerm}
        onValueChange={onSearch}
        className="flex-1"
      />
      <Select
        label="Status"
        value={status}
        options={STATUS_OPTIONS}
        onValueChange={onStatusChange}
        accent={accentForSlot(slotId)}
      />
    </div>
  );
}
