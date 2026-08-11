"use client";

import { Panel } from "@/core/components/ui";
import { useComparedEpisodes } from "@/features/episodes/hooks/useComparedEpisodes";
import { useComparisonUrlProjection } from "../hooks/useComparisonUrlProjection";
import { useComparisonStore } from "../store/ComparisonStoreProvider";
import { accentForSlot } from "../utils/slotAccent";
import { CharacterChip } from "./CharacterChip";
import { ClearComparisonButton } from "./ClearComparisonButton";
import { VennDiagram } from "./VennDiagram";

const EPISODE_SECTION_ANCHORS = {
  first: "episodes-first",
  shared: "episodes-shared",
  second: "episodes-second",
} as const;

export function ComparisonBar() {
  // Mounted here because it must run exactly once for the whole page.
  useComparisonUrlProjection();

  const { selectedCharacters, counts } = useComparedEpisodes();
  const clearSlot = useComparisonStore((state) => state.clearSlot);

  function scrollToSection(section: keyof typeof EPISODE_SECTION_ANCHORS) {
    document
      .getElementById(EPISODE_SECTION_ANCHORS[section])
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <ClearComparisonButton />
      </div>

      <Panel className="items-center gap-4 p-3 md:grid md:grid-cols-[1fr_auto_1fr]">
        <div className="w-full justify-self-start md:w-auto">
          <CharacterChip
            character={selectedCharacters["1"]}
            accent={accentForSlot("1")}
            onClear={() => clearSlot("1")}
          />
        </div>

        <VennDiagram
          first={selectedCharacters["1"]}
          second={selectedCharacters["2"]}
          onlyInFirstCount={counts.onlyInFirst}
          sharedCount={counts.sharedByBoth}
          onlyInSecondCount={counts.onlyInSecond}
          onRegionSelect={scrollToSection}
        />

        <div className="w-full justify-self-end md:w-auto">
          <CharacterChip
            character={selectedCharacters["2"]}
            accent={accentForSlot("2")}
            onClear={() => clearSlot("2")}
          />
        </div>
      </Panel>
    </div>
  );
}
