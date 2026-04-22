import { AlertTriangle, TrendingUp, Clock, Receipt } from "lucide-react";
import { SectionHeader } from "./section-header";

const stats = [
  {
    icon: TrendingUp,
    stat: "3.5×",
    label: "Higher settlements",
    detail:
      "Injury victims with an attorney settle for ~3.5× more on average than those who self-represent.",
    source: "Insurance Research Council",
  },
  {
    icon: Clock,
    stat: "72h",
    label: "The critical window",
    detail:
      "Most of the best physical evidence — skid marks, witness recall, dash cam — is lost within three days.",
    source: "NHTSA crash reconstruction guidance",
  },
  {
    icon: Receipt,
    stat: "42%",
    label: "Underpaid medical claims",
    detail:
      "Nearly half of accident victims accept early settlements that fail to cover total future medical costs.",
    source: "J.D. Power claims satisfaction study",
  },
];

export function WhyItMatters() {
  return (
    <section className="relative border-y border-border/40 bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Why it matters"
          title="The hours after an accident decide the next decade of your life."
          description="Most accident victims don't lose their case in court. They lose it in the 72 hours after the crash — when they're still in shock, still on painkillers, and already fielding calls from the at-fault carrier."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-7 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/30">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-5xl font-semibold tracking-tight">
                <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {s.stat}
                </span>
              </div>
              <div className="mt-1 font-display text-lg font-semibold">
                {s.label}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.detail}
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80">
                Source: {s.source}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 flex max-w-2xl items-start gap-3 rounded-xl border border-border/60 bg-background/60 p-5 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(40_85%_55%)]" />
          <p>
            The carrier&rsquo;s first offer is almost never their best offer. Every
            minute you wait to lock in evidence, get treatment documented, and
            retain counsel is a minute they use to reduce what they owe you.
          </p>
        </div>
      </div>
    </section>
  );
}
