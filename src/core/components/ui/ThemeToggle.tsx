"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/core/components/icons/Icons";
import { useIsHydrated } from "@/core/hooks/useIsHydrated";
import { Button } from "./Button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The server cannot know the theme, so anything derived from it has to wait
  // for the client or hydration fails on the mismatch.
  const isHydrated = useIsHydrated();

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        isHydrated
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle theme"
      }
    >
      {isHydrated && (isDark ? <SunIcon /> : <MoonIcon />)}
    </Button>
  );
}
