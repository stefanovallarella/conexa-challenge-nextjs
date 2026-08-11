import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/core/lib/cn";
import type { Episode } from "../types/episode.types";

const episodeCodeStyles = cva("type-mono-data shrink-0", {
  variants: {
    section: {
      first: "text-slot-1-text",
      shared: "bg-linear-to-r from-slot-1 to-slot-2 bg-clip-text text-transparent",
      second: "text-slot-2-text",
    },
  },
  defaultVariants: { section: "shared" },
});

export interface EpisodeRowProps extends VariantProps<typeof episodeCodeStyles> {
  episode: Episode;
}

export function EpisodeRow({ episode, section }: EpisodeRowProps) {
  return (
    <li className="flex items-baseline gap-3 border-b border-hairline px-3 py-2 last:border-b-0 hover:bg-panel-sunken">
      <span className={cn(episodeCodeStyles({ section }))}>{episode.code}</span>
      <span className="type-body min-w-0 flex-1 truncate text-text">
        {episode.name}
      </span>
      <span className="type-mono-label shrink-0 text-text-muted">
        {episode.airDate}
      </span>
    </li>
  );
}
