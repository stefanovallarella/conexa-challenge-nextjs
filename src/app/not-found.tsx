import Link from "next/link";
import { CompareIcon } from "@/core/components/icons/Icons";
import { buttonStyles } from "@/core/components/ui/Button";
import { PageShell } from "@/core/components/PageShell";
import { EmptyState, Panel } from "@/core/components/ui";

export default function NotFound() {
  return (
    <PageShell>
      <Panel>
        <EmptyState
          icon={<CompareIcon className="size-7" />}
          title="There is nothing at this address"
          description="Every comparison lives on the home page."
          action={
            <Link href="/" className={buttonStyles({ size: "sm" })}>
              Start a comparison
            </Link>
          }
        />
      </Panel>
    </PageShell>
  );
}
