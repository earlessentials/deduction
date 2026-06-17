import Link from "next/link";
import { ArrowRight, FileText, MapPinned } from "lucide-react";
import { CaseCompanion } from "@/components/CaseCompanion";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { InlineBadge } from "@/components/InlineBadge";
import { getCase, getCharacters } from "@/lib/data";

export default async function CaseBriefingPage() {
  const [gameCase, characters] = await Promise.all([getCase(), getCharacters()]);
  const suspects = gameCase.briefing.initialSuspects
    .map((id) => characters.find((character) => character.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="case-panel p-6">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <InlineBadge tone="brass">{gameCase.subtitle}</InlineBadge>
            <InlineBadge tone="signal">Locked office death</InlineBadge>
            <InlineBadge tone="oxide">Gala night</InlineBadge>
          </div>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-ink">
            {gameCase.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/78">{gameCase.summary}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="file-tab p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-oxide">
                <FileText className="h-4 w-4" />
                Initial Scene
              </div>
              <p className="text-sm leading-6 text-ink/75">
                {gameCase.briefing.initialCrimeScene}. {gameCase.briefing.misleadingWeapon}
              </p>
            </div>
            <div className="file-tab p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-oxide">
                <MapPinned className="h-4 w-4" />
                Presumed Window
              </div>
              <p className="text-sm leading-6 text-ink/75">
                Found at {gameCase.briefing.foundAt}. First reconstruction places death around{" "}
                {gameCase.briefing.presumedDeathTime}.
              </p>
            </div>
          </div>
        </div>
        <figure className="case-panel overflow-hidden">
          <img
            src="/case/harlow-floorplan.svg"
            alt="Harlow Institute floorplan"
            className="h-full min-h-[320px] w-full object-cover"
          />
        </figure>
      </section>

      <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <CaseCompanion />
        <div className="case-panel scanline p-6">
          <InlineBadge tone="oxide">Quiet Leads</InlineBadge>
          <h2 className="mt-3 font-serif text-3xl font-semibold">The cleanest room is often the loudest lie.</h2>
          <p className="mt-3 max-w-3xl leading-7 text-ink/72">
            Every route, timestamp, and small contradiction belongs somewhere. Put them in the
            right order and the first story starts to come apart.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="case-panel p-6">
          <h2 className="font-serif text-2xl font-semibold">Working Brief</h2>
          <p className="mt-3 leading-7 text-ink/75">{gameCase.initialTheory}</p>
          <div className="mt-6 space-y-3">
            {gameCase.briefing.publicFacts.map((fact) => (
              <div key={fact} className="border-l-4 border-brass bg-midnight/60 px-4 py-3 text-sm">
                {fact}
              </div>
            ))}
          </div>
        </div>

        <div className="case-panel p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold">Initial Suspects</h2>
            <Link
              href="/characters"
              className="focus-ring inline-flex h-10 items-center gap-2 border border-oxide/35 bg-oxide px-3 text-sm font-semibold text-paper"
            >
              Gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {suspects.map((suspect) =>
              suspect ? (
                <Link
                  key={suspect.id}
                  href={`/characters/${suspect.id}`}
                  className="focus-ring flex min-h-20 items-center gap-3 border border-ink/10 bg-midnight/70 p-3 transition hover:border-oxide"
                >
                  <CharacterAvatar character={suspect} size="sm" />
                  <span>
                    <span className="block font-semibold">{suspect.name}</span>
                    <span className="text-xs uppercase tracking-wide text-ink/55">
                      {suspect.relationshipToVictim}
                    </span>
                  </span>
                </Link>
              ) : null
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
