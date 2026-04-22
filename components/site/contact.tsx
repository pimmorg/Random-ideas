"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { SectionHeader } from "./section-header";

type Intent = "victim" | "attorney" | "press";

export function Contact() {
  const [intent, setIntent] = useState<Intent>("victim");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Demo only — no submission. Real version would POST to an API route.
    setSent(true);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Contact"
          title="Ready when you are — 24/7."
          description="Victims get a human on the line in under 10 minutes. Firms get a response from our partnerships team within one business day."
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="space-y-5">
              <ContactItem
                icon={Phone}
                label="24/7 intake line"
                value="(855) 555-0199"
                href="tel:+18555550199"
                highlight
              />
              <ContactItem
                icon={Mail}
                label="Victims"
                value="help@accidentmaxxing.com"
                href="mailto:help@accidentmaxxing.com"
              />
              <ContactItem
                icon={Mail}
                label="Attorneys / partnerships"
                value="firms@accidentmaxxing.com"
                href="mailto:firms@accidentmaxxing.com"
              />
              <ContactItem
                icon={MapPin}
                label="HQ"
                value="400 Congress Ave · Austin, TX"
              />
            </div>

            <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/50 p-4 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              AccidentMaxxing is a case intake platform, not a law firm, and we
              do not provide legal advice. Contacting us does not create an
              attorney-client relationship.
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="border-gradient overflow-hidden rounded-2xl bg-card/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {(
                  [
                    ["victim", "I was in an accident"],
                    ["attorney", "I'm an attorney"],
                    ["press", "Press / other"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setIntent(v)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      intent === v
                        ? "bg-accent text-accent-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success ring-1 ring-inset ring-success/30">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">
                    We&rsquo;ve got it.
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    If you marked this urgent, a real human will call you back
                    within the next few minutes. Otherwise expect a reply by
                    end of business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" required>
                      <input
                        required
                        type="text"
                        name="name"
                        autoComplete="name"
                        className="input-base"
                        placeholder="Jordan Rivera"
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="input-base"
                        placeholder="you@email.com"
                      />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone">
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        className="input-base"
                        placeholder="(555) 123-4567"
                      />
                    </Field>
                    <Field
                      label={
                        intent === "attorney"
                          ? "Firm name"
                          : intent === "press"
                            ? "Organization"
                            : "State of the accident"
                      }
                    >
                      <input
                        type="text"
                        name="context"
                        className="input-base"
                        placeholder={
                          intent === "attorney"
                            ? "Smith & Partners, LLP"
                            : intent === "press"
                              ? "The Verge"
                              : "TX"
                        }
                      />
                    </Field>
                  </div>
                  <Field
                    label={
                      intent === "victim"
                        ? "What happened?"
                        : "How can we help?"
                    }
                  >
                    <textarea
                      name="message"
                      rows={5}
                      className="input-base resize-none"
                      placeholder={
                        intent === "victim"
                          ? "Brief description of the accident, injuries, and when it happened."
                          : "Tell us about your firm, your practice area, or your question."
                      }
                    />
                  </Field>

                  {intent === "victim" && (
                    <label className="flex items-start gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-3.5 w-3.5 accent-[hsl(var(--accent))]"
                      />
                      <span>
                        This is urgent — the accident happened within the last
                        72 hours. Call me as soon as possible.
                      </span>
                    </label>
                  )}

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      By submitting, you agree to our Terms and Privacy Policy.
                      We never sell your information.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow transition-transform hover:translate-y-[-1px]"
                    >
                      Send
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .input-base {
          height: 2.75rem;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background) / 0.6);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 120ms, box-shadow 120ms;
        }
        textarea.input-base {
          height: auto;
          padding: 0.75rem;
        }
        .input-base::placeholder {
          color: hsl(var(--muted-foreground));
        }
        .input-base:focus {
          border-color: hsl(var(--accent));
          box-shadow: 0 0 0 3px hsl(var(--accent) / 0.2);
        }
      `}</style>
    </section>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  highlight?: boolean;
}) {
  const Inner = (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
        highlight
          ? "border-accent/40 bg-accent/5 hover:border-accent/70"
          : "border-border/60 bg-card/60 hover:border-accent/40"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          highlight ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="font-display text-base font-semibold tracking-tight">
          {value}
        </div>
      </div>
    </div>
  );
  return href ? <a href={href}>{Inner}</a> : Inner;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}
