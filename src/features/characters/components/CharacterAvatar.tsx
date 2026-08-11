"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/core/lib/cn";
import type { Character } from "../types/character.types";

function initialsOf(name: Character["name"]): string {
  const words = name.split(" ").filter(Boolean);

  return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}`.toUpperCase();
}

interface CharacterAvatarProps {
  character: Character;
  size: number;
  className?: string;
}

export function CharacterAvatar({
  character,
  size,
  className,
}: CharacterAvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  if (failedImageUrl === character.imageUrl) {
    return (
      <span
        style={{ width: size, height: size }}
        className={cn(
          "type-mono-label flex shrink-0 items-center justify-center bg-panel-sunken text-text-faint",
          className,
        )}
        aria-hidden
      >
        {initialsOf(character.name)}
      </span>
    );
  }

  return (
    <Image
      src={character.imageUrl}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      onError={() => setFailedImageUrl(character.imageUrl)}
      className={cn("shrink-0 object-cover", className)}
    />
  );
}
