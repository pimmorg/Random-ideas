"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingWizardProps {
  userId: string
  userName?: string
  currentStep: number
}

const TRAINING_STAGES = [
  {
    value: "just_starting",
    label: "Just getting started",
    emoji: "🌱",
    description: "Haven't begun training yet, curious about flying",
    trackSlug: "ppl",
  },
  {
    value: "ppl",
    label: "Studying for my Private Pilot",
    emoji: "📘",
    description: "Currently working toward PPL (written or checkride)",
    trackSlug: "ppl",
  },
  {
    value: "has_ppl",
    label: "I have my Private Pilot",
    emoji: "✈️",
    description: "PPL complete, ready for what's next",
    trackSlug: "ir",
  },
  {
    value: "instrument",
    label: "Working on my Instrument Rating",
    emoji: "🌧️",
    description: "Currently studying for IR written or practical",
    trackSlug: "ir",
  },
  {
    value: "commercial",
    label: "Working on my Commercial",
    emoji: "💼",
    description: "Building toward CPL certificate",
    trackSlug: "cpl",
  },
  {
    value: "multi_engine",
    label: "Working on Multi-Engine",
    emoji: "🛩️",
    description: "Adding the ME rating to your certificate",
    trackSlug: "me",
  },
  {
    value: "cfi",
    label: "Becoming a CFI",
    emoji: "👨‍🏫",
    description: "Preparing for your flight instructor certificate",
    trackSlug: "cfi",
  },
  {
    value: "atp",
    label: "Preparing for ATP",
    emoji: "🛫",
    description: "Working toward the Airline Transport Pilot certificate",
    trackSlug: "atp",
  },
  {
    value: "show_all",
    label: "Not sure / show me everything",
    emoji: "🤷",
    description: "Power user mode — unlock all tracks",
    trackSlug: "ppl",
  },
]

const DAILY_GOALS = [
  { minutes: 5, label: "5 min", description: "Light — quick review" },
  { minutes: 10, label: "10 min", description: "Easy — daily habits" },
  { minutes: 15, label: "15 min", description: "Steady — good progress" },
  { minutes: 30, label: "30 min", description: "Serious — fast prep" },
]

export default function OnboardingWizard({
  userId,
  userName,
  currentStep: initialStep,
}: OnboardingWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(initialStep)
  const [trainingStage, setTrainingStage] = useState<string | null>(null)
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null)
  const [dailyGoal, setDailyGoal] = useState(15)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedStage = TRAINING_STAGES.find((s) => s.value === trainingStage)

  const pplFollowUps = [
    { value: "no_ground_school", label: "Haven't started ground school yet" },
    { value: "in_ground_school", label: "Currently in ground school" },
    { value: "finished_ground_school", label: "Finished ground school, preparing for written" },
    { value: "has_written", label: "Passed the written, preparing for checkride" },
  ]

  const irFollowUps = [
    { value: "not_comfortable", label: "Still learning the basics" },
    { value: "somewhat_comfortable", label: "Somewhat comfortable" },
    { value: "very_comfortable", label: "Very comfortable — need procedural practice" },
  ]

  const getFollowUpOptions = () => {
    if (trainingStage === "ppl" || trainingStage === "just_starting") return pplFollowUps
    if (trainingStage === "instrument") return irFollowUps
    return null
  }

  const handleComplete = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          trainingStage,
          followUpAnswer,
          dailyGoalMinutes: dailyGoal,
          trackSlug: selectedStage?.trackSlug ?? "ppl",
          showAll: trainingStage === "show_all",
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Failed to save onboarding")
      }
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const followUpOptions = getFollowUpOptions()
  const hasFollowUp =
    followUpOptions !== null &&
    (trainingStage === "ppl" || trainingStage === "just_starting" || trainingStage === "instrument")

  const totalSteps = hasFollowUp ? 4 : 3

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Plane className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">SkySchool</span>
        </div>
        {step === 0 && (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {userName ? `Welcome, ${userName.split(" ")[0]}!` : "Welcome!"} Let's personalize your learning.
          </p>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i < step ? "w-6 bg-blue-500" : i === step ? "w-6 bg-blue-500" : "w-4 bg-slate-200 dark:bg-slate-700"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Training stage */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
              Where are you in your training?
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm">
              We'll tailor your experience to match exactly where you are.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {TRAINING_STAGES.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => setTrainingStage(stage.value)}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                    trainingStage === stage.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
                  )}
                >
                  <span className="text-2xl">{stage.emoji}</span>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white text-sm">
                      {stage.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {stage.description}
                    </div>
                  </div>
                  {trainingStage === stage.value && (
                    <CheckCircle className="w-4 h-4 text-blue-500 ml-auto shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(hasFollowUp ? 1 : 2)}
                disabled={!trainingStage}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 1: Follow-up question */}
        {step === 1 && followUpOptions && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg"
          >
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
              {trainingStage === "instrument"
                ? "How comfortable are you with instrument scanning?"
                : "How far along are you?"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm">
              This helps us pick the right starting point.
            </p>
            <div className="flex flex-col gap-2">
              {followUpOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFollowUpAnswer(opt.value)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all",
                    followUpAnswer === opt.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                  )}
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {opt.label}
                  </span>
                  {followUpAnswer === opt.value && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(0)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!followUpAnswer}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Daily goal */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
              How much time can you study per day?
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm">
              Consistency beats intensity. Even 5 minutes a day adds up.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DAILY_GOALS.map((goal) => (
                <button
                  key={goal.minutes}
                  onClick={() => setDailyGoal(goal.minutes)}
                  className={cn(
                    "p-5 rounded-xl border-2 text-center transition-all",
                    dailyGoal === goal.minutes
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                  )}
                >
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {goal.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {goal.description}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(hasFollowUp ? 1 : 0)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Ready to launch */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md text-center"
          >
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              You're all set!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              We've set up your <strong className="text-slate-700 dark:text-slate-200">{selectedStage?.label}</strong> track with a {dailyGoal}-minute daily goal.
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">
              Let's start with your first lesson. You learn best by doing.
            </p>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <button
              onClick={handleComplete}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors w-full"
            >
              {loading ? "Setting up your track…" : "Let's start learning →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
