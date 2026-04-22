"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeader } from "./section-header";

const faqs: Array<{ q: string; a: React.ReactNode; category: "victims" | "attorneys" }> = [
  {
    category: "victims",
    q: "How much does AccidentMaxxing cost me?",
    a: (
      <>
        Zero, up front. Our intake and attorney match are free. If you sign with
        one of our partner firms, they work on <strong>contingency</strong> —
        they only get paid (typically 25–30%) if they win your case. You never
        pay us directly.
      </>
    ),
  },
  {
    category: "victims",
    q: "Is the case value estimate real?",
    a: (
      <>
        The range in our demo is illustrative. In the real product, your final
        range is reviewed by a licensed attorney using the same comparables they
        use to prepare a demand letter. The number you see is the number they&rsquo;d
        open negotiations on.
      </>
    ),
  },
  {
    category: "victims",
    q: "Do I need a police report or photos to start?",
    a: (
      <>
        No. You can start with just what you remember. Our intake walks you
        through obtaining the police report, medical records, and witness
        statements later — we even file the records requests for you.
      </>
    ),
  },
  {
    category: "victims",
    q: "What if I was partly at fault?",
    a: (
      <>
        You can still have a case. Most US states follow comparative negligence
        — meaning your recovery is reduced by your share of fault, but not
        eliminated. We flag cases where this matters and route them to firms
        experienced in that jurisdiction&rsquo;s rules.
      </>
    ),
  },
  {
    category: "attorneys",
    q: "How are cases priced for firms?",
    a: (
      <>
        Flat per-accepted-case or revenue-share on recovery. No subscriptions,
        no lead-purchase minimums. Pricing scales with case value and exclusivity.
      </>
    ),
  },
  {
    category: "attorneys",
    q: "Are these leads exclusive?",
    a: (
      <>
        Yes. Every matched case routes to a single firm. If you pass within the
        SLA window, it re-routes to the next best fit — never to multiple firms
        simultaneously.
      </>
    ),
  },
  {
    category: "attorneys",
    q: "What integrations do you support?",
    a: (
      <>
        Native integrations with Filevine, Litify, SmartAdvocate, MyCase, and
        Clio. We also ship a generic webhook + REST API if your stack is custom.
      </>
    ),
  },
  {
    category: "attorneys",
    q: "How do you handle UPL and referral rules?",
    a: (
      <>
        We are not a law firm and we do not charge per-lead splits. Our model is
        compliant with ABA Model Rule 7.2 and state-specific attorney
        advertising rules; we provide a compliance memo for your bar opinion file.
      </>
    ),
  },
];

export function FAQ() {
  const [filter, setFilter] = useState<"all" | "victims" | "attorneys">("all");
  const [open, setOpen] = useState<number | null>(0);
  const shown = faqs.filter((f) => filter === "all" || f.category === filter);

  return (
    <section id="faq" className="border-t border-border/40 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader
          eyebrow="FAQ"
          title="The questions you'd ask at 2 a.m."
        />

        <div className="mt-10 flex items-center justify-center gap-2">
          {(
            [
              ["all", "All"],
              ["victims", "For victims"],
              ["attorneys", "For attorneys"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setFilter(v);
                setOpen(0);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === v
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
          {shown.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-base font-semibold tracking-tight text-balance sm:text-[17px]">
                    {f.q}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform ${
                      isOpen ? "rotate-45 bg-accent/10 text-accent" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <div className="px-6 pb-6 text-[15px] leading-relaxed text-muted-foreground">
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
