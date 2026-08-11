import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { PageShell } from "@/core/components/PageShell";
import { ThemeToggle } from "@/core/components/ui/ThemeToggle";
import { SLOT_IDS } from "@/core/config/constants";
import { createQueryClient } from "@/core/lib/queryClient";
import { CharacterSections } from "@/features/characters/components/CharacterSections";
import {
  characterPageQuery,
  prefetchSelectedCharacters,
} from "@/features/characters/queries";
import { ComparisonBar } from "@/features/comparison/components/ComparisonBar";
import { ShareButton } from "@/features/comparison/components/ShareButton";
import { ComparisonStoreProvider } from "@/features/comparison/store/ComparisonStoreProvider";
import {
  parseComparisonSlots,
  selectedCharacterIds,
} from "@/features/comparison/utils/comparisonUrl";
import { EpisodeComparison } from "@/features/episodes/components/EpisodeComparison";
import { episodeBatchQuery } from "@/features/episodes/queries";
import { unionOfEpisodeIds } from "@/features/episodes/utils/episodeSets";

export default async function ComparisonPage({ searchParams }: PageProps<"/">) {
  const initialSlots = parseComparisonSlots(await searchParams);
  const queryClient = createQueryClient();

  const [, selectedCharacters] = await Promise.all([
    queryClient.prefetchQuery(characterPageQuery({ page: 1 })),
    // Both prefetches are optimisations. Letting either reject would trade a
    // slower first paint for an error page.
    prefetchSelectedCharacters(
      queryClient,
      selectedCharacterIds(initialSlots),
    ).catch(() => []),
  ]);

  // Resolved here and not on the client, or a shared link opens empty first.
  if (selectedCharacters.length === SLOT_IDS.length) {
    const [first, second] = selectedCharacters;
    await queryClient.prefetchQuery(
      episodeBatchQuery(unionOfEpisodeIds(first.episodeIds, second.episodeIds)),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ComparisonStoreProvider initialSlots={initialSlots}>
        <PageShell>
          <header className="flex items-center justify-between">
            <p className="type-mono-label text-text-muted">
              <span className="text-accent-portal">●</span> rick &amp; morty
              episode explorer
            </p>
            <div className="flex items-center gap-1">
              <ShareButton />
              <ThemeToggle />
            </div>
          </header>

          <CharacterSections />

          <ComparisonBar />

          <EpisodeComparison />
        </PageShell>
      </ComparisonStoreProvider>
    </HydrationBoundary>
  );
}
