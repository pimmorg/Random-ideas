"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  HeartPulse,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SectionHeader } from "./section-header";

type AccidentType = "rear-end" | "t-bone" | "head-on" | "hit-run" | "other";
type InjuryLevel = "none" | "minor" | "moderate" | "severe";
type Treatment = "none" | "er" | "followup" | "ongoing";

type FormState = {
  accidentType: AccidentType | null;
  injuryLevel: InjuryLevel | null;
  treatment: Treatment | null;
  atFault: "me" | "them" | "unclear" | null;
  state: string;
  zip: string;
};

const initial: FormState = {
  accidentType: null,
  injuryLevel: null,
  treatment: null,
  atFault: null,
  state: "",
  zip: "",
};

const STATES = [
  "CA", "TX", "FL", "NY", "IL", "PA", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA",
];

export function DemoIntake() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const totalSteps = 5;

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return !!form.accidentType;
      case 1:
        return !!form.injuryLevel && !!form.treatment;
      case 2:
        return !!form.atFault;
      case 3:
        return form.state.length === 2 && /^\d{5}$/.test(form.zip);
      default:
        return true;
    }
  }, [step, form]);

  const estimate = useMemo(() => computeEstimate(form), [form]);

  const reset = () => {
    setForm(initial);
    setStep(0);
  };

  return (
    <section id="demo" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-hero-glow opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Demo intake flow"
          title="Try a 60-second case estimator."
          description="A preview of what real accident victims complete in under 2 minutes. Nothing is submitted — try it, break it, see how the numbers move."
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="border-gradient relative overflow-hidden rounded-2xl bg-card/85 shadow-2xl backdrop-blur-xl">
              <Progress step={step} total={totalSteps} />

              <div className="p-6 sm:p-8">
                {step === 0 && (
                  <Step
                    title="What kind of accident was it?"
                    subtitle="We use this to weight fault and injury patterns."
                  >
                    <Choices
                      options={[
                        { value: "rear-end", label: "Rear-end", icon: Car },
                        { value: "t-bone", label: "T-bone / side impact", icon: Car },
                        { value: "head-on", label: "Head-on", icon: Car },
                        { value: "hit-run", label: "Hit and run", icon: Car },
                        { value: "other", label: "Something else", icon: Car },
                      ]}
                      value={form.accidentType}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, accidentType: v as AccidentType }))
                      }
                    />
                  </Step>
                )}

                {step === 1 && (
                  <Step
                    title="How are you feeling?"
                    subtitle="Your health drives the majority of the case value — be honest."
                  >
                    <div className="space-y-5">
                      <LabeledGroup label="Injury level">
                        <Choices
                          columns={2}
                          options={[
                            { value: "none", label: "No injuries" },
                            { value: "minor", label: "Minor (soft tissue)" },
                            { value: "moderate", label: "Moderate (fracture, sprain)" },
                            { value: "severe", label: "Severe (surgery, hospitalized)" },
                          ]}
                          value={form.injuryLevel}
                          onChange={(v) =>
                            setForm((f) => ({ ...f, injuryLevel: v as InjuryLevel }))
                          }
                        />
                      </LabeledGroup>
                      <LabeledGroup label="Medical treatment so far">
                        <Choices
                          columns={2}
                          options={[
                            { value: "none", label: "None yet" },
                            { value: "er", label: "ER visit" },
                            { value: "followup", label: "Follow-up care" },
                            { value: "ongoing", label: "Ongoing treatment" },
                          ]}
                          value={form.treatment}
                          onChange={(v) =>
                            setForm((f) => ({ ...f, treatment: v as Treatment }))
                          }
                        />
                      </LabeledGroup>
                    </div>
                  </Step>
                )}

                {step === 2 && (
                  <Step
                    title="Who was at fault?"
                    subtitle="It's okay to not be sure. We'll still give you a range."
                  >
                    <Choices
                      columns={1}
                      options={[
                        { value: "them", label: "The other driver", icon: ShieldCheck },
                        { value: "me", label: "I think I was", icon: ShieldCheck },
                        { value: "unclear", label: "I'm not sure yet", icon: ShieldCheck },
                      ]}
                      value={form.atFault}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, atFault: v as FormState["atFault"] }))
                      }
                    />
                  </Step>
                )}

                {step === 3 && (
                  <Step
                    title="Where did it happen?"
                    subtitle="Settlement ranges and laws vary heavily by jurisdiction."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="State">
                        <select
                          value={form.state}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, state: e.target.value }))
                          }
                          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25"
                        >
                          <option value="">Select…</option>
                          {STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="ZIP code">
                        <input
                          value={form.zip}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              zip: e.target.value.replace(/\D/g, "").slice(0, 5),
                            }))
                          }
                          placeholder="78704"
                          inputMode="numeric"
                          className="h-11 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25"
                        />
                      </Field>
                    </div>
                  </Step>
                )}

                {step === 4 && (
                  <Step
                    title="Your estimate is ready."
                    subtitle="This is a demo. Real cases run through attorney-side review before any number is shared with an adjuster."
                  >
                    <ResultCard form={form} estimate={estimate} />
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-5 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Start over
                    </button>
                  </Step>
                )}

                {step < totalSteps - 1 && (
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => canAdvance && setStep((s) => s + 1)}
                      disabled={!canAdvance}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow transition-transform hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                    >
                      {step === totalSteps - 2 ? "See estimate" : "Continue"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <SidePanel form={form} estimate={estimate} step={step} />
          </aside>
        </div>
      </div>
    </section>
  );
}

function Progress({ step, total }: { step: number; total: number }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="relative h-1 w-full bg-border/70">
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-success transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div key={title} className="animate-float-up">
      <h3 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-[26px]">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function LabeledGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

type ChoiceOption = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

function Choices({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: ChoiceOption[];
  value: string | null;
  onChange: (v: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <div
      className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}
    >
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${
              selected
                ? "border-accent bg-accent/10 text-foreground shadow-[0_0_0_3px_hsl(var(--accent)/0.2)]"
                : "border-border bg-background/60 text-foreground/90 hover:border-accent/40 hover:bg-background"
            }`}
          >
            <span className="flex items-center gap-3">
              {o.icon && (
                <o.icon
                  className={`h-4 w-4 ${selected ? "text-accent" : "text-muted-foreground"}`}
                />
              )}
              {o.label}
            </span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                selected
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-background"
              }`}
            >
              {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SidePanel({
  form,
  estimate,
  step,
}: {
  form: FormState;
  estimate: ReturnType<typeof computeEstimate>;
  step: number;
}) {
  return (
    <div className="sticky top-24 space-y-4">
      <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Live valuation
        </div>
        <div className="mt-4 font-display text-3xl font-semibold tracking-tight">
          {step === 0 ? (
            <span className="text-muted-foreground">Pending inputs…</span>
          ) : (
            <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
              ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Confidence grows as you add detail. Attorneys see only the final,
          privacy-scrubbed packet.
        </p>
        <div className="mt-5 space-y-2.5 text-xs">
          <Detail icon={Car} label="Accident" value={labelAccident(form.accidentType) ?? "—"} />
          <Detail icon={HeartPulse} label="Injury" value={labelInjury(form.injuryLevel) ?? "—"} />
          <Detail icon={FileText} label="Treatment" value={labelTreatment(form.treatment) ?? "—"} />
          <Detail icon={ShieldCheck} label="Fault" value={labelFault(form.atFault) ?? "—"} />
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background/40 p-5 text-xs leading-relaxed text-muted-foreground backdrop-blur-sm">
        <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground/80">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          Private by default
        </div>
        Demo values never leave your browser. In the real flow, all personal
        health data is encrypted and only shared with the single attorney you
        pick.
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function ResultCard({
  form,
  estimate,
}: {
  form: FormState;
  estimate: ReturnType<typeof computeEstimate>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/60 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
        Estimated settlement range
      </div>
      <div className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
          ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Based on {estimate.sample.toLocaleString()} comparable cases in{" "}
        <span className="text-foreground">{form.state || "your state"}</span>.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Bucket label="Medical" value={estimate.breakdown.medical} />
        <Bucket label="Lost wages" value={estimate.breakdown.wages} />
        <Bucket label="Pain & suffering" value={estimate.breakdown.pain} accent />
      </div>
      <a
        href="#contact"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-transform hover:translate-y-[-1px] sm:w-auto"
      >
        Get matched with an attorney
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function Bucket({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 px-3 py-2.5">
      <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-lg font-semibold ${accent ? "text-accent" : ""}`}
      >
        ${value.toLocaleString()}
      </div>
    </div>
  );
}

// ---- Estimation (deterministic, client-side only — demo math) ----

function computeEstimate(f: FormState) {
  const base = 8000;
  const typeMul: Record<AccidentType, number> = {
    "rear-end": 1.2,
    "t-bone": 1.8,
    "head-on": 2.5,
    "hit-run": 1.6,
    other: 1.3,
  };
  const injMul: Record<InjuryLevel, number> = {
    none: 0.3,
    minor: 1,
    moderate: 2.4,
    severe: 5,
  };
  const treatMul: Record<Treatment, number> = {
    none: 0.6,
    er: 1.2,
    followup: 1.6,
    ongoing: 2.2,
  };
  const faultMul: Record<NonNullable<FormState["atFault"]>, number> = {
    me: 0.25,
    them: 1.25,
    unclear: 0.85,
  };

  const m =
    base *
    (f.accidentType ? typeMul[f.accidentType] : 1) *
    (f.injuryLevel ? injMul[f.injuryLevel] : 1) *
    (f.treatment ? treatMul[f.treatment] : 1) *
    (f.atFault ? faultMul[f.atFault] : 1);

  const mid = Math.max(1500, Math.round(m));
  const low = Math.round(mid * 0.82);
  const high = Math.round(mid * 1.35);

  return {
    low,
    high,
    sample: 12840,
    breakdown: {
      medical: Math.round(mid * 0.45),
      wages: Math.round(mid * 0.15),
      pain: Math.round(mid * 0.55),
    },
  };
}

function labelAccident(v: AccidentType | null) {
  if (!v) return null;
  return {
    "rear-end": "Rear-end",
    "t-bone": "T-bone",
    "head-on": "Head-on",
    "hit-run": "Hit & run",
    other: "Other",
  }[v];
}
function labelInjury(v: InjuryLevel | null) {
  if (!v) return null;
  return {
    none: "None",
    minor: "Minor",
    moderate: "Moderate",
    severe: "Severe",
  }[v];
}
function labelTreatment(v: Treatment | null) {
  if (!v) return null;
  return {
    none: "None",
    er: "ER visit",
    followup: "Follow-up",
    ongoing: "Ongoing",
  }[v];
}
function labelFault(v: FormState["atFault"]) {
  if (!v) return null;
  return {
    me: "I was",
    them: "Other driver",
    unclear: "Unclear",
  }[v];
}
