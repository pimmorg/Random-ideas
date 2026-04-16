"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw, Home } from "lucide-react"
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
  unitTitle: string
  options: Option[]
}

interface TrackQuizClientProps {
  trackName: string
  trackId: string
  questions: Question[]
}

interface Answer {
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
}

export default function TrackQuizClient({ trackName, questions }: TrackQuizClientProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [finished, setFinished] = useState(false)

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
      setFinished(true)
    }
  }, [currentIndex, questions.length])

  const correctCount = answers.filter((a) => a.isCorrect).length
  const score =
    answers.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  if (finished) {
    const masteryLevel =
      score >= 95 ? "gold" : score >= 85 ? "silver" : score >= 70 ? "bronze" : "needs_work"
    return (
      <TrackResults
        score={score}
        correctCount={correctCount}
        total={questions.length}
        masteryLevel={masteryLevel}
        trackName={trackName}
        onRetry={() => {
          setFinished(false)
          setCurrentIndex(0)
          setSelected(null)
          setRevealed(false)
          setAnswers([])
        }}
        onHome={() => router.push("/dashboard")}
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          {trackName} — Overall Test
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
        <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
          Unit: {currentQuestion.unitTitle}
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
                <p className="mt-2 text-xs opacity-70">Reference: {currentQuestion.farAimRef}</p>
              )}
            </motion.div>
          )}

          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-end"
            >
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  "See Results"
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function TrackResults({
  score,
  correctCount,
  total,
  masteryLevel,
  trackName,
  onRetry,
  onHome,
}: {
  score: number
  correctCount: number
  total: number
  masteryLevel: string
  trackName: string
  onRetry: () => void
  onHome: () => void
}) {
  const emoji =
    masteryLevel === "gold"
      ? "🏆"
      : masteryLevel === "silver"
      ? "🥈"
      : masteryLevel === "bronze"
      ? "🥉"
      : "📚"

  const message =
    masteryLevel === "gold"
      ? "Outstanding knowledge across the board!"
      : masteryLevel === "silver"
      ? "Strong overall understanding!"
      : masteryLevel === "bronze"
      ? "Good foundation — keep reviewing the weak spots."
      : "Keep studying — review the units and try again."

  const bgColor =
    masteryLevel === "gold"
      ? "from-yellow-50 to-white dark:from-yellow-950 dark:to-slate-900"
      : masteryLevel === "silver"
      ? "from-slate-50 to-white dark:from-slate-800 dark:to-slate-900"
      : masteryLevel === "bronze"
      ? "from-amber-50 to-white dark:from-amber-950 dark:to-slate-900"
      : "from-slate-50 to-white dark:from-slate-900 dark:to-slate-900"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`max-w-md mx-auto text-center rounded-2xl bg-gradient-to-b ${bgColor} p-8 border border-slate-100 dark:border-slate-800`}
    >
      <div className="text-6xl mb-4">{emoji}</div>
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full mb-3">
        <Trophy className="w-3.5 h-3.5" />
        Overall Track Test
      </div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{score}%</h1>
      <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">{message}</p>
      <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">
        {correctCount} / {total} correct · {trackName}
      </p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
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
