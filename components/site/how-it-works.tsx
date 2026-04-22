import {
  FileText,
  Gauge,
  Handshake,
  DollarSign,
  ArrowDown,
} from "lucide-react";
import { SectionHeader } from "./section-header";

const steps = [
  {
    icon: FileText,
    title: "Tell us what happened",
    time: "2 minutes",
    description:
      "A guided, plain-English intake that captures every detail that matters — from ER visits to the adjuster who just called you.",
    detail: "Smart branching · Voice & photo upload · Auto-saves if you leave",
  },
  {
    icon: Gauge,
    title: "See your case value",
    time: "Instant",
    description:
      "Our model compares your case to 400,000+ historical settlements to generate a realistic, attorney-verified range.",
    detail: "Medical + wages + non-economic · Jurisdiction adjusted",
  },
  {
    icon: Handshake,
    title: "Get matched with a vetted attorney",
    time: "Under 10 min",
    description:
      "We route your case only to firms that specialize in your injury, state, and carrier — and that actually take cases like yours.",
    detail: "No bidding wars · No sold leads · No spam calls",
  },
  {
    icon: DollarSign,
    title: "Maximize your settlement",
    time: "Ongoing",
    description:
      "Your attorney handles the carrier. We keep the evidence organized and the clock honest — tracking every deadline and demand.",
    detail: "Evidence vault · Demand drafting · Carrier response SLAs",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="How it works"
          title="From crash scene to settlement, in four clean steps."
          description="We replace the chaotic patchwork of billboards, referral services, and sold leads with a single, streamlined flow — designed around how real accident victims actually behave."
        />

        <ol className="mx-auto mt-16 max-w-3xl space-y-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="border-gradient relative rounded-2xl bg-card/80 p-6 backdrop-blur-sm sm:p-7"
            >
              <div className="flex items-start gap-5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-success/10 ring-1 ring-inset ring-accent/30">
                  <step.icon className="h-5 w-5 text-accent" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background font-mono text-[11px] font-semibold">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <span className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {step.time}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-success">
                    {step.detail}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <ArrowDown
                  className="absolute -bottom-3 left-11 h-5 w-5 rounded-full border border-border bg-background p-1 text-muted-foreground"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
