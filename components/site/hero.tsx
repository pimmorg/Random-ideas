import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border/50"
    >
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div
        className="absolute inset-0 bg-grid mask-fade-edges opacity-[0.35] dark:opacity-[0.25]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pt-28 lg:pt-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-success" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Live 24/7 intake · Avg. response under 90 seconds
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1.05] tracking-tight text-balance">
            Turn any accident into the{" "}
            <span className="bg-gradient-to-r from-accent via-accent to-success bg-clip-text text-transparent">
              maximum possible claim.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            AccidentMaxxing is the modern intake layer for accident victims. In
            minutes, we document your case, estimate its value, and match you
            with a vetted attorney who fights for every dollar you deserve.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-transform hover:translate-y-[-1px]"
            >
              Estimate my case in 2 minutes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#attorneys"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-semibold text-foreground/90 backdrop-blur-md transition-colors hover:border-accent/50"
            >
              I&rsquo;m an attorney
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              No fee unless your attorney wins
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Built with 30+ top personal-injury firms
            </span>
          </div>
        </div>

        <HeroPreview />

        <LogoStrip />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-accent/20 via-success/10 to-accent/20 blur-2xl"
        aria-hidden
      />
      <div className="border-gradient relative overflow-hidden rounded-2xl bg-card/80 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/30 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(40_80%_55%)]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
          <span className="ml-3 font-mono text-[11px] tracking-wide text-muted-foreground">
            app.accidentmaxxing.com/intake/CX-48219
          </span>
        </div>
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Case CX-48219 · Rear-end collision
            </div>
            <div className="mt-1 font-display text-2xl font-semibold">
              Estimated case value
            </div>
            <div className="mt-3 font-display text-5xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
                $48,400 – $72,600
              </span>
            </div>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Based on 12,840 similar cases in your state, injury type, and
              insurance coverage. Final offer depends on medical review.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <MiniStat label="Medical" value="$18.2k" accent />
              <MiniStat label="Lost wages" value="$6.4k" />
              <MiniStat label="Pain & suffering" value="$32.1k" accent />
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-xl border border-border/70 bg-background/60 p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Matched attorney
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-accent/40 to-success/40">
                  <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-semibold">
                    MR
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    Morales & Reyes, LLP
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Austin, TX · 4.9 ★ · 2,340 cases
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <Row label="Contingency fee" value="28%" />
                <Row label="Avg. settlement" value="$61,200" />
                <Row label="Response time" value="< 10 min" />
              </div>
              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-2 text-xs font-semibold text-background"
              >
                Connect me now
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 px-3 py-2.5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-lg font-semibold ${accent ? "text-accent" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="font-mono text-foreground">{value}</span>
    </div>
  );
}

function LogoStrip() {
  const firms = [
    "Morales & Reyes",
    "Brightline Legal",
    "Chen Injury Group",
    "Ironwood & Coe",
    "Harbor PI",
    "Lantern Law",
    "Oakridge Trial Firm",
    "Kestrel Advocates",
  ];
  return (
    <div className="relative mt-20">
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by modern personal-injury firms
      </p>
      <div className="relative mt-6 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10"
          aria-hidden
        />
        <div className="flex w-max animate-marquee items-center gap-12">
          {[...firms, ...firms].map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display text-lg font-semibold text-muted-foreground/70"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
