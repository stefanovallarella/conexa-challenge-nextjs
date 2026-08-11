"use client";

import { cn } from "@/core/lib/cn";
import type { Character } from "@/features/characters/types/character.types";
import { accentClasses } from "../utils/slotAccent";

const LEFT_CENTER_X = 80;
const RIGHT_CENTER_X = 144;
const CENTER_Y = 56;
const RADIUS = 46;

interface CirclePortraitProps {
  character: Character;
  centerX: number;
  clipPathId: string;
  tintClassName: string;
}

function CirclePortrait({
  character,
  centerX,
  clipPathId,
  tintClassName,
}: CirclePortraitProps) {
  return (
    <g clipPath={`url(#${clipPathId})`}>
      <image
        href={character.imageUrl}
        x={centerX - RADIUS}
        y={CENTER_Y - RADIUS}
        width={RADIUS * 2}
        height={RADIUS * 2}
        preserveAspectRatio="xMidYMid slice"
        className="saturate-[0.35]"
      />
      <circle
        cx={centerX}
        cy={CENTER_Y}
        r={RADIUS}
        className={cn(tintClassName, "opacity-35")}
      />
    </g>
  );
}

interface CircleOutlineProps {
  centerX: number;
  isFilled: boolean;
  strokeClassName: string;
}

function CircleOutline({
  centerX,
  isFilled,
  strokeClassName,
}: CircleOutlineProps) {
  return (
    <circle
      cx={centerX}
      cy={CENTER_Y}
      r={RADIUS}
      fill="none"
      strokeWidth={2}
      strokeDasharray={isFilled ? undefined : "4 4"}
      className={isFilled ? strokeClassName : "stroke-hairline"}
    />
  );
}

interface VennRegionButtonProps {
  count: number;
  label: string;
  horizontalPosition: string;
  onSelect: () => void;
  className?: string;
}

function VennRegionButton({
  count,
  label,
  horizontalPosition,
  onSelect,
  className,
}: VennRegionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ left: horizontalPosition }}
      className={cn(
        "type-mono-data absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-0.5",
        className,
      )}
    >
      {count}
      <span className="sr-only"> {label}</span>
    </button>
  );
}

interface VennDiagramProps {
  first: Character | null;
  second: Character | null;
  onlyInFirstCount: number;
  sharedCount: number;
  onlyInSecondCount: number;
  onRegionSelect: (section: "first" | "shared" | "second") => void;
}

export function VennDiagram({
  first,
  second,
  onlyInFirstCount,
  sharedCount,
  onlyInSecondCount,
  onRegionSelect,
}: VennDiagramProps) {
  const isReady = first !== null && second !== null;

  return (
    <div className="relative h-28 w-56 shrink-0">
      <svg viewBox="0 0 224 112" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <clipPath id="venn-left">
            <circle cx={LEFT_CENTER_X} cy={CENTER_Y} r={RADIUS} />
          </clipPath>
          <clipPath id="venn-right">
            <circle cx={RIGHT_CENTER_X} cy={CENTER_Y} r={RADIUS} />
          </clipPath>
        </defs>

        {first && (
          <CirclePortrait
            character={first}
            centerX={LEFT_CENTER_X}
            clipPathId="venn-left"
            tintClassName={accentClasses("primary").fill}
          />
        )}

        {second && (
          <CirclePortrait
            character={second}
            centerX={RIGHT_CENTER_X}
            clipPathId="venn-right"
            tintClassName={accentClasses("secondary").fill}
          />
        )}

        {/* The right circle clipped by the left one is the lens where both overlap. */}
        {isReady && (
          <g clipPath="url(#venn-left)">
            <circle
              cx={RIGHT_CENTER_X}
              cy={CENTER_Y}
              r={RADIUS}
              className="fill-scrim"
            />
          </g>
        )}

        <CircleOutline
          centerX={LEFT_CENTER_X}
          isFilled={first !== null}
          strokeClassName={accentClasses("primary").stroke}
        />
        <CircleOutline
          centerX={RIGHT_CENTER_X}
          isFilled={second !== null}
          strokeClassName={accentClasses("secondary").stroke}
        />
      </svg>

      {isReady && (
        <>
          <VennRegionButton
            count={onlyInFirstCount}
            label={`episodes with only ${first.name}`}
            horizontalPosition="27%"
            onSelect={() => onRegionSelect("first")}
            className={cn("bg-panel/80", accentClasses("primary").text)}
          />
          <VennRegionButton
            count={sharedCount}
            label={`episodes shared by ${first.name} and ${second.name}`}
            horizontalPosition="50%"
            onSelect={() => onRegionSelect("shared")}
            className="type-body-lg text-white"
          />
          <VennRegionButton
            count={onlyInSecondCount}
            label={`episodes with only ${second.name}`}
            horizontalPosition="73%"
            onSelect={() => onRegionSelect("second")}
            className={cn("bg-panel/80", accentClasses("secondary").text)}
          />
        </>
      )}
    </div>
  );
}
