"use client";

import { useMemo, useState } from "react";
import type { Character } from "@/types/game";

type CharacterAvatarProps = {
  character: Pick<Character, "name" | "portraitPath">;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-base",
  lg: "h-24 w-24 text-2xl"
};

export function CharacterAvatar({ character, size = "md" }: CharacterAvatarProps) {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(
    () =>
      character.name
        .replace(/^Dr\.\s+/, "")
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
    [character.name]
  );

  if (!character.portraitPath || failed) {
    return (
      <div
        className={`${sizes[size]} grid shrink-0 place-items-center border border-ink/15 bg-oxide text-center font-semibold text-paper`}
        aria-label={character.name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={character.portraitPath}
      alt={character.name}
      className={`${sizes[size]} shrink-0 border border-ink/15 object-cover`}
      onError={() => setFailed(true)}
    />
  );
}
