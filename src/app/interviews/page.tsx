import { InlineBadge } from "@/components/InlineBadge";
import { InterviewRoom } from "@/components/interviews/InterviewRoom";
import { getCharacters, getEvidence, getInterviews } from "@/lib/data";

export default async function InterviewsPage() {
  const [interviews, characters, evidence] = await Promise.all([
    getInterviews(),
    getCharacters(),
    getEvidence()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <InlineBadge tone="oxide">Interview room</InlineBadge>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Branching Interviews</h1>
      </div>
      <InterviewRoom interviews={interviews} characters={characters} evidence={evidence} />
    </div>
  );
}
