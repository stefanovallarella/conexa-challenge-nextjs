"use client";

import { useEffect, useState } from "react";
import { ShareIcon } from "@/core/components/icons/Icons";
import { Button } from "@/core/components/ui";
import { SLOT_IDS } from "@/core/config/constants";
import { useSelectedCharacters } from "@/features/characters/hooks/useSelectedCharacters";

const CONFIRMATION_MS = 2000;

type CopyOutcome = "idle" | "copied" | "failed";

export function ShareButton() {
  const selectedCharacters = useSelectedCharacters();
  const [copyOutcome, setCopyOutcome] = useState<CopyOutcome>("idle");

  const isComparisonComplete = SLOT_IDS.every(
    (slotId) => selectedCharacters[slotId] !== null,
  );

  useEffect(() => {
    if (copyOutcome === "idle") return;
    const timeoutId = setTimeout(() => setCopyOutcome("idle"), CONFIRMATION_MS);
    return () => clearTimeout(timeoutId);
  }, [copyOutcome]);

  async function copyComparisonLink() {
    try {
      // Undefined over plain http, and rejects outright when permission is denied.
      await navigator.clipboard.writeText(window.location.href);
      setCopyOutcome("copied");
    } catch {
      setCopyOutcome("failed");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={!isComparisonComplete}
      onClick={copyComparisonLink}
      className={copyOutcome === "copied" ? "text-accent-portal" : undefined}
    >
      <ShareIcon />
      {copyOutcome === "copied" && "Link copied"}
      {copyOutcome === "failed" && "Copy the address bar"}
      {copyOutcome === "idle" && "Share"}
    </Button>
  );
}
