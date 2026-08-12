import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { Panel, Skeleton } from "@/core/components/ui";
import { cn } from "@/core/lib/cn";
import type { Episode } from "../types/episode.types";
import { EpisodeRow, type EpisodeRowProps } from "./EpisodeRow";

type EpisodeSection = NonNullable<EpisodeRowProps["section"]>;

const SKELETON_ROW_COUNT = 5;

const headingStyles = cva("type-mono-label min-h-8 content-center", {
  variants: {
    section: {
      first: "text-slot-1-text",
      shared:
        "bg-linear-to-r from-slot-1 to-slot-2 bg-clip-text text-transparent",
      second: "text-slot-2-text",
    },
  },
});

interface EpisodePanelBodyProps {
  section: EpisodeSection;
  episodes: Episode[];
  isLoading: boolean;
  emptyState: ReactNode;
}

function EpisodePanelBody({
  section,
  episodes,
  isLoading,
  emptyState,
}: EpisodePanelBodyProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-3">
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-5" />
        ))}
      </div>
    );
  }

  if (episodes.length === 0) {
    return emptyState;
  }

  return (
    <ul className="max-h-[45vh] min-h-0 flex-1 overflow-y-auto lg:max-h-[28rem]">
      {episodes.map((episode) => (
        <EpisodeRow key={episode.id} episode={episode} section={section} />
      ))}
    </ul>
  );
}

interface EpisodePanelProps extends EpisodePanelBodyProps {
  id: string;
  title: string;
  count: number;
}

export function EpisodePanel({
  id,
  title,
  count,
  ...body
}: EpisodePanelProps) {
  return (
    <Panel id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-4">
      <header className="flex items-center justify-between gap-2 border-b border-hairline px-3 py-3">
        <h3 id={`${id}-heading`} className={cn(headingStyles({ section: body.section }))}>
          {title}
        </h3>
        <span className="type-mono-data text-text-muted">{count}</span>
      </header>

      <EpisodePanelBody {...body} />
    </Panel>
  );
}
