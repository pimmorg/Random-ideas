import { SectionHeader } from "./section-header";
import { Scale, Rocket, ShieldCheck } from "lucide-react";

export function About() {
  return (
    <section id="about" className="relative border-t border-border/40 bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="About"
          title={<>We think the worst day of your life deserves software as good as your bank&rsquo;s.</>}
          description="AccidentMaxxing was built by a team of former trial attorneys, claims adjusters, and fintech engineers who watched too many people accept too little — because the system is built to confuse, not to serve."
        />

        <div className="mx-auto mt-14 max-w-4xl space-y-6 text-[17px] leading-relaxed text-muted-foreground">
          <p>
            For decades, the personal-injury industry has run on billboards,
            late-night TV ads, and lead brokers. The people writing the
            biggest checks to find clients rarely have the best outcomes for
            those clients — because the money spent on acquisition has to come
            out of the settlement.
          </p>
          <p>
            We built a better shape: a single, modern intake that delivers
            exclusive, evidence-rich cases to the firms most qualified to win
            them. No brokered leads. No resale. No wasted settlements.
          </p>
          <p>
            We believe transparency wins. Victims deserve to see their case
            value before they pick an attorney. Attorneys deserve to see the
            case before they pick up the phone. And everyone deserves a
            software experience that doesn&rsquo;t feel like a 1998 law-firm lobby.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            {
              icon: Scale,
              label: "Built by lawyers",
              copy: "Our founding team has argued cases worth more than $2B combined.",
            },
            {
              icon: Rocket,
              label: "Backed by top investors",
              copy: "Venture-backed, with a 10-year roadmap — not a quarterly ad-buy.",
            },
            {
              icon: ShieldCheck,
              label: "SOC 2 + HIPAA-grade",
              copy: "Enterprise-grade security on every byte of personal health data.",
            },
          ].map((b) => (
            <div
              key={b.label}
              className="rounded-xl border border-border/70 bg-card/70 p-5 backdrop-blur-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
                <b.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 font-display text-base font-semibold">
                {b.label}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{b.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
