import { InlineBadge } from "@/components/InlineBadge";
import { TimelineBoard } from "@/components/timeline/TimelineBoard";
import { getCharacters, getEvidence, getLocations, getTimelineEvents } from "@/lib/data";

export default async function TimelinePage() {
  const [publicEvents, trueEvents, evidence, characters, locations] = await Promise.all([
    getTimelineEvents("public"),
    getTimelineEvents("true"),
    getEvidence(),
    getCharacters(),
    getLocations()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <InlineBadge tone="oxide">Timeline board</InlineBadge>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Sequence Reconstruction</h1>
      </div>
      <TimelineBoard
        publicEvents={publicEvents}
        trueEvents={trueEvents}
        evidence={evidence}
        characters={characters}
        locations={locations}
      />
    </div>
  );
}
