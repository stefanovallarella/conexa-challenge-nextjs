import { Skeleton } from "@/core/components/ui";

export function CharacterCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-card border border-hairline bg-panel p-3">
      <Skeleton className="size-18 shrink-0" />
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-2.5 w-10" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
