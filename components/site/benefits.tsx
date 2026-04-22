import {
  Scale,
  HeartPulse,
  Clock3,
  ShieldCheck,
  MessageSquareText,
  Lock,
} from "lucide-react";
import { SectionHeader } from "./section-header";

const benefits = [
  {
    icon: Scale,
    title: "Higher settlements, on average",
    copy: "Our verified evidence packets and real-time case valuation give your attorney a documented floor the carrier can't negotiate below.",
  },
  {
    icon: HeartPulse,
    title: "Medical care you can afford today",
    copy: "We connect you to in-network lien-based providers so you start treatment immediately, with zero out-of-pocket until you settle.",
  },
  {
    icon: Clock3,
    title: "Zero time wasted",
    copy: "No more phone trees, fax forms, or three-week callbacks. Your case is intake-ready before you leave the ER parking lot.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted, specialist attorneys",
    copy: "We only partner with firms with 4.8+ star records in your jurisdiction, injury type, and insurance carrier class.",
  },
  {
    icon: MessageSquareText,
    title: "One place for everything",
    copy: "Track messages, bills, appointments, and offers in one dashboard. Forward the adjuster to a single email and we log it.",
  },
  {
    icon: Lock,
    title: "Your data, locked down",
    copy: "SOC 2 Type II, end-to-end encrypted uploads, and HIPAA-grade handling of your medical records. Never sold. Never shared.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Case value & benefits"
          title="A single platform for everything that decides what you get paid."
          description="Built by former trial attorneys and claims adjusters — so every detail is already loaded for the fight the carrier is already planning."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group relative bg-card/80 p-8 transition-colors hover:bg-card"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-success/5 text-accent ring-1 ring-inset ring-accent/20 transition-transform group-hover:-translate-y-0.5">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.copy}
              </p>
            </div>
          ))}
        </div>

        <ComparisonTable />
      </div>
    </section>
  );
}

function ComparisonTable() {
  const rows: Array<{
    label: string;
    diy: string;
    billboard: string;
    amx: string;
  }> = [
    {
      label: "Time to first legal advice",
      diy: "Days",
      billboard: "24–72 hrs",
      amx: "Under 10 min",
    },
    {
      label: "Transparent case valuation",
      diy: "—",
      billboard: "—",
      amx: "Included",
    },
    {
      label: "Evidence collection tools",
      diy: "DIY",
      billboard: "Paper forms",
      amx: "Guided app",
    },
    {
      label: "Attorney specialization match",
      diy: "Random",
      billboard: "Generalist",
      amx: "Jurisdiction + injury",
    },
    {
      label: "Fees",
      diy: "0%",
      billboard: "33–40%",
      amx: "25–30%",
    },
    {
      label: "Lead resold to multiple firms",
      diy: "—",
      billboard: "Often",
      amx: "Never",
    },
  ];
  return (
    <div className="mt-16 overflow-hidden rounded-2xl border border-border/60 bg-card/80">
      <div className="grid grid-cols-4 border-b border-border/60 bg-muted/30 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <div>Feature</div>
        <div className="text-center">Go it alone</div>
        <div className="text-center">Billboard firm</div>
        <div className="text-center text-accent">AccidentMaxxing</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={`grid grid-cols-4 items-center px-6 py-4 text-sm ${
            i !== rows.length - 1 ? "border-b border-border/50" : ""
          }`}
        >
          <div className="font-medium">{r.label}</div>
          <div className="text-center text-muted-foreground">{r.diy}</div>
          <div className="text-center text-muted-foreground">{r.billboard}</div>
          <div className="text-center font-semibold text-accent">{r.amx}</div>
        </div>
      ))}
    </div>
  );
}
