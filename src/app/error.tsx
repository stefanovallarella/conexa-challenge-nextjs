"use client";

import { AlertIcon } from "@/core/components/icons/Icons";
import { PageShell } from "@/core/components/PageShell";
import { Button, EmptyState, Panel } from "@/core/components/ui";

interface ComparisonPageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ComparisonPageError({
  reset,
}: ComparisonPageErrorProps) {
  return (
    <PageShell>
      <Panel>
        <EmptyState
          icon={<AlertIcon className="size-7" />}
          title="Something broke on the way here"
          description="The comparison couldn't be loaded. Trying again usually does it."
          action={
            <Button size="sm" onClick={reset}>
              Try again
            </Button>
          }
        />
      </Panel>
    </PageShell>
  );
}
