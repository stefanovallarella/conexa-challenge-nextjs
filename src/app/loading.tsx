import { PageShell } from "@/core/components/PageShell";
import { Panel, Skeleton } from "@/core/components/ui";
import { SLOT_IDS } from "@/core/config/constants";
import { CharacterCardSkeleton } from "@/features/characters/components/CharacterCardSkeleton";

const CARDS_PER_PANEL = 6;

/** Mirrors the real layout so nothing jumps when the data lands. */
export default function ComparisonPageLoading() {
  return (
    <PageShell>
      <Skeleton className="h-4 w-56" />

      <div className="grid gap-4 md:grid-cols-2">
        {SLOT_IDS.map((slotId) => (
          <Panel key={slotId}>
            <div className="flex flex-col gap-3 p-3">
              <Skeleton className="h-3 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>

            <div className="grid gap-3 border-t border-hairline p-3 xl:grid-cols-2">
              {Array.from({ length: CARDS_PER_PANEL }, (_, index) => (
                <CharacterCardSkeleton key={index} />
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
