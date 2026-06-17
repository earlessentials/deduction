import Link from "next/link";
import { LockKeyhole, UnlockKeyhole } from "lucide-react";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { InlineBadge } from "@/components/InlineBadge";
import { getCharacters } from "@/lib/data";

export default async function CharacterGalleryPage() {
  const characters = await getCharacters();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <InlineBadge tone="oxide">Cast file</InlineBadge>
          <h1 className="mt-3 font-serif text-4xl font-semibold">Character Gallery</h1>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-ink/65">
          Every profile starts as testimony, motive, or context. Elimination depends on matching
          people to the reconstructed timeline.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {characters.map((character) => (
          <Link
            key={character.id}
            href={`/characters/${character.id}`}
            className="case-panel focus-ring flex min-h-52 flex-col justify-between p-4 transition hover:-translate-y-0.5 hover:border-oxide"
          >
            <div className="flex items-start gap-4">
              <CharacterAvatar character={character} size="lg" />
              <div className="min-w-0">
                <h2 className="font-serif text-xl font-semibold leading-tight">{character.name}</h2>
                <p className="mt-2 text-sm leading-5 text-ink/68">{character.role}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <InlineBadge tone={character.suspectStatus.includes("active") ? "signal" : "neutral"}>
                {character.suspectStatus}
              </InlineBadge>
              <InlineBadge tone={character.unlockState === "locked" ? "brass" : "oxide"}>
                {character.unlockState === "locked" ? (
                  <span className="inline-flex items-center gap-1">
                    <LockKeyhole className="h-3 w-3" /> Locked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <UnlockKeyhole className="h-3 w-3" /> Unlocked
                  </span>
                )}
              </InlineBadge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
