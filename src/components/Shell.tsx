import Link from "next/link";
import {
  Blocks,
  FileQuestion,
  Fingerprint,
  FolderOpen,
  GitBranch,
  ListChecks,
  MessageSquareText,
  Network,
  UsersRound
} from "lucide-react";
import { CaseCompanion } from "@/components/CaseCompanion";

const navItems = [
  { href: "/case", label: "Briefing", icon: FolderOpen },
  { href: "/characters", label: "Characters", icon: UsersRound },
  { href: "/evidence", label: "Evidence", icon: Fingerprint },
  { href: "/interviews", label: "Interviews", icon: MessageSquareText },
  { href: "/timeline", label: "Timeline", icon: ListChecks },
  { href: "/relationships", label: "Relations", icon: Network },
  { href: "/elimination", label: "Eliminate", icon: Blocks },
  { href: "/hypotheses", label: "Hypotheses", icon: GitBranch },
  { href: "/final-report", label: "Report", icon: FileQuestion }
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-oxide/15 bg-paper/92 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 xl:grid-cols-[220px_1fr_270px] xl:items-center">
          <div className="flex items-center justify-between gap-4">
            <Link href="/case" className="focus-ring inline-flex w-fit flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-oxide">
                Case 001
              </span>
              <span className="font-serif text-3xl font-semibold leading-none text-ink">
                THE LUCID HOUR
              </span>
            </Link>
          </div>
          <nav className="grid grid-cols-3 gap-2 sm:grid-cols-5 xl:flex xl:flex-wrap xl:justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring inline-flex h-10 items-center justify-center gap-2 border border-ink/10 bg-midnight/70 px-3 text-sm font-semibold text-ink transition hover:border-oxide hover:bg-midnight"
                >
                  <Icon aria-hidden="true" className="h-4 w-4 text-oxide" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="hidden xl:block">
            <CaseCompanion compact />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
