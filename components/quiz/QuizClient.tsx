"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, ArrowRight, Award, RotateCcw, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  question: string
  explanation: string
  farAimRef?: string
  options: Option[]
}

interface QuizClientProps {
  unitId: string
  unitTitle: string
  trackName: string
  questions: Question[]
}

type QuizState = "quiz" | "results"

interface Answer {
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
}

export default function QuizClient({
  unitId,
  unitTitle,
  trackName,
  questions,
}: QuizClientProps) {
  const router = useRouter()
  const [state, setState] = useState<QuizState>("quiz")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [submitting, setSubmitting] = useState(false)

  const currentQuestion = questions[currentIndex]
  const correctOption = currentQuestion?.options.find((o) => o.isCorrect)

  const handleSelect = useCallback(
    (optionId: string) => {
      if (revealed) return
      setSelected(optionId)
      setRevealed(true)

      const isCorrect =
        currentQuestion.options.find((o) => o.id === optionId)?.isCorrect ?? false

      setAnswers((prev) => [
        ...prev,
        { questionId: currentQuestion.id, selectedOptionId: optionId, isCorrect },
      ])
    },
    [revealed, currentQuestion]
  )

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      finishQuiz()
    }
  }, [currentIndex, questions.length])

  const finishQuiz = async () => {
    setSubmitting(true)
    const correctCount = answers.filter((a) => a.isCorrect).length + (selected && correctOption?.id === selected ? 1 : 0)
    const total = questions.length
    const score = Math.round((correctCount / total) * 100)

    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId,
          score,
          totalQuestions: total,
          correctAnswers: correctCount,
          answers,
        }),
      })
    } finally {
      setSubmitting(false)
      setState("results")
    }
  }

  const correctCount = answers.filter((a) => a.isCorrect).length
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0
  const masteryLevel =
    score >= 95 ? "gold" : score >= 85 ? "silver" : score >= 70 ? "bronze" : "needs_work"

  if (state === "results") {
    return <QuizResults
      score={score}
      correctCount={correctCount}
      total={questions.length}
      masteryLevel={masteryLevel}
      unitTitle={unitTitle}
      onRetry={() => {
        setState("quiz")
        setCurrentIndex(0)
        setSelected(null)
        setRevealed(false)
        setAnswers([])
      }}
      onHome={() => router.push("/dashboard")}
    />
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          {trackName} — {unitTitle}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-slate-400 shrink-0">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selected === option.id
              const isCorrect = option.isCorrect

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={revealed}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium",
                    !revealed
                      ? "border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      : isCorrect
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200"
                      : isSelected
                      ? "border-red-400 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200"
                      : "border-slate-100 dark:border-slate-800 opacity-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center",
                        !revealed
                          ? "border-slate-300 dark:border-slate-600"
                          : isCorrect
                          ? "border-emerald-500 bg-emerald-500"
                          : isSelected
                          ? "border-red-400 bg-red-400"
                          : "border-slate-200 dark:border-slate-700"
                      )}
                    >
                      {revealed && isCorrect && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                      {revealed && isSelected && !isCorrect && (
                        <XCircle className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    {option.text}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 p-4 rounded-xl border text-sm",
                selected === correctOption?.id
                  ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
                  : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100"
              )}
            >
              <div className="flex items-center gap-2 font-semibold mb-2">
                {selected === correctOption?.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" /> Not quite
                  </>
                )}
              </div>
              <p className="leading-relaxed">{currentQuestion.explanation}</p>
              {currentQuestion.farAimRef && (
                <p className="mt-2 text-xs opacity-70">
                  Reference: {currentQuestion.farAimRef}
                </p>
              )}
            </motion.div>
          )}

          {/* Next button */}
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-end"
            >
              <button
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  "Finish Quiz"
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function QuizResults({
  score,
  correctCount,
  total,
  masteryLevel,
  unitTitle,
  onRetry,
  onHome,
}: {
  score: number
  correctCount: number
  total: number
  masteryLevel: string
  unitTitle: string
  onRetry: () => void
  onHome: () => void
}) {
  const emoji =
    masteryLevel === "gold"
      ? "🥇"
      : masteryLevel === "silver"
      ? "🥈"
      : masteryLevel === "bronze"
      ? "🥉"
      : "📚"

  const message =
    masteryLevel === "gold"
      ? "Outstanding! Gold mastery achieved!"
      : masteryLevel === "silver"
      ? "Great work! Silver mastery earned."
      : masteryLevel === "bronze"
      ? "Good effort! Bronze mastery unlocked."
      : "Keep studying — you'll get there!"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center"
    >
      <div className="text-6xl mb-4">{emoji}</div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        {score}%
      </h1>
      <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">{message}</p>
      <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">
        {correctCount} / {total} correct · {unitTitle}
      </p>

      {/* Mastery badge */}
      {masteryLevel !== "needs_work" && (
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 font-medium text-sm",
            masteryLevel === "gold"
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              : masteryLevel === "silver"
              ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
          )}
        >
          <Award className="w-4 h-4" />
          {masteryLevel.charAt(0).toUpperCase() + masteryLevel.slice(1)} Mastery
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
        <button
          onClick={onHome}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </button>
      </div>
    </motion.div>
  )
}
