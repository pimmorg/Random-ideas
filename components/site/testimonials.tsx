import { Quote, Star } from "lucide-react";
import { SectionHeader } from "./section-header";

const testimonials = [
  {
    quote:
      "I did the intake from the ER parking lot. By the time my wife drove me home, I had an attorney on the phone and a $64,000 range on my screen. The carrier's first offer was $14,000.",
    name: "Darius Okafor",
    meta: "Austin, TX · Rear-end collision",
  },
  {
    quote:
      "Every accident lead I'd ever bought was exhausted by the time I called. AccidentMaxxing is the first channel where signed retainers actually match the top-of-funnel volume.",
    name: "Priya Menon, Esq.",
    meta: "Managing Partner, Menon Law Group",
  },
  {
    quote:
      "I've never had a provider send me a cleaner file. Medical records, crash report, photos, timeline — all annotated. We sent demand the same week.",
    name: "Clay Harper, Esq.",
    meta: "Trial Attorney, Ironwood & Coe",
  },
  {
    quote:
      "As a mom of two with no time for phone tag, this was the first interaction with the legal system that actually respected my time.",
    name: "Hannah Weiss",
    meta: "Charlotte, NC · Hit & run",
  },
  {
    quote:
      "We shut off three other intake vendors. AccidentMaxxing delivers 4× the close rate at a lower effective cost per signed case.",
    name: "Greg Alvarado, COO",
    meta: "Brightline Legal",
  },
  {
    quote:
      "My settlement came in at $112,000. I had no idea my case was even worth that. Worth every minute of the 2-minute intake.",
    name: "Marcus Reyna",
    meta: "Phoenix, AZ · T-bone collision",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by people in the hardest week of their life — and the attorneys who fight for them."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="group relative flex flex-col gap-5 rounded-2xl border border-border/70 bg-card/80 p-7 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <Quote className="h-6 w-6 text-accent/70" aria-hidden />
              <blockquote className="text-[15px] leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-4">
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.meta}</div>
                </div>
                <div className="flex gap-0.5 text-[hsl(40_90%_55%)]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mx-auto mt-14 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-xs font-mono uppercase tracking-wider text-muted-foreground">
          <div>
            <span className="text-foreground font-semibold">4.9</span> / 5 avg. rating
          </div>
          <div>
            <span className="text-foreground font-semibold">18,400+</span> cases submitted
          </div>
          <div>
            <span className="text-foreground font-semibold">$412M</span> recovered
          </div>
        </div>
      </div>
    </section>
  );
}
