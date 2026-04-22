import {
  Scale,
  Target,
  Database,
  BarChart3,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

export function ForAttorneys() {
  return (
    <section
      id="attorneys"
      className="relative overflow-hidden border-y border-border/40 bg-gradient-to-b from-secondary/40 via-background to-background py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15] mask-fade-edges" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Scale className="h-3.5 w-3.5 text-accent" />
              For attorneys
            </div>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.1] tracking-tight text-balance">
              Finally, leads that behave like clients — not clicks.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Every case you receive has already been pre-qualified, document-ed,
              and matched to your firm&rsquo;s exact criteria. No racing five other
              firms to the phone. No chasing ghosts.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                {
                  icon: Target,
                  title: "Filtered on your rules",
                  copy: "State, injury severity, policy limits, liability posture, statute-of-limitations window — all set by you.",
                },
                {
                  icon: FileCheck2,
                  title: "Evidence-ready intake packet",
                  copy: "Medical records, police reports, photos, and timelines arrive structured and signed, not in a voicemail.",
                },
                {
                  icon: Database,
                  title: "Exclusive — not resold",
                  copy: "Each case routes to a single firm. If you decline, it goes to the next best fit, never to six at once.",
                },
                {
                  icon: BarChart3,
                  title: "Plug into your case management",
                  copy: "Webhooks and native integrations with Filevine, Litify, SmartAdvocate, MyCase, and Clio.",
                },
              ].map((it) => (
                <li
                  key={it.title}
                  className="flex items-start gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-border/60"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold">
                      {it.title}
                    </div>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {it.copy}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:translate-y-[-1px]"
              >
                Request firm onboarding
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#faq"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold text-foreground/90 backdrop-blur-md transition-colors hover:border-accent/50"
              >
                See pricing model
              </a>
            </div>
          </div>

          <div className="relative">
            <FirmDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}

function FirmDashboard() {
  const cases = [
    { id: "CX-48219", type: "Rear-end · TX", range: "$48k – $72k", score: 92, new: true },
    { id: "CX-48211", type: "T-bone · TX", range: "$91k – $140k", score: 88 },
    { id: "CX-48203", type: "Head-on · OK", range: "$210k – $320k", score: 96 },
    { id: "CX-48197", type: "Rear-end · TX", range: "$12k – $24k", score: 74 },
  ];
  return (
    <div className="relative">
      <div
        className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-accent/25 via-success/10 to-transparent blur-2xl"
        aria-hidden
      />
      <div className="border-gradient relative overflow-hidden rounded-2xl bg-card/85 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-5 py-3">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success pulse-ring" />
            Inbox · Morales & Reyes, LLP
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Today · 4 new
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 grid grid-cols-3 gap-3">
            <StatBlock label="Acceptance" value="83%" trend="+6%" />
            <StatBlock label="Avg. value" value="$74k" trend="+$11k" />
            <StatBlock label="Time to call" value="7m" trend="-3m" />
          </div>
          <ul className="space-y-2.5">
            {cases.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.id}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{c.type}</div>
                    <div className="text-xs text-muted-foreground">
                      Range {c.range}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden items-center gap-2 sm:flex">
                    <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-border">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-success"
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs">{c.score}</span>
                  </div>
                  {c.new ? (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-success">
                      New
                    </span>
                  ) : (
                    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Matched
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 px-3 py-2.5">
      <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 flex items-baseline justify-between gap-2">
        <div className="font-display text-lg font-semibold">{value}</div>
        <div className="font-mono text-[11px] text-success">{trend}</div>
      </div>
    </div>
  );
}
