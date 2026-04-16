"use client"

import { motion } from "framer-motion"
import { Award, Zap, CheckCircle2, Target, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface UnitStat {
  id: string
  title: string
  totalLessons: number
  completedLessons: number
  questionCount: number
  bestScore: number | null
  masteryLevel: string | null
}

interface ProgressClientProps {
  trackName: string
  unitStats: UnitStat[]
  totalXp: number
  lessonsCompleted: number
  quizzesTaken: number
  avgAccuracy: number
  streakData: { date: string; xp: number }[]
  weakAreasUnlocked: boolean
}

const masteryColor = {
  bronze: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  silver: "text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800",
  gold: "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950",
}

export default function ProgressClient({
  trackName,
  unitStats,
  totalXp,
  lessonsCompleted,
  quizzesTaken,
  avgAccuracy,
  streakData,
  weakAreasUnlocked,
}: ProgressClientProps) {
  const weakUnits = unitStats.filter(
    (u) => u.bestScore !== null && u.bestScore < 70
  )
  const overallReadiness =
    unitStats.length > 0
      ? Math.round(
          unitStats.reduce((sum, u) => {
            const lessonsScore =
              u.totalLessons > 0
                ? (u.completedLessons / u.totalLessons) * 50
                : 0
            const quizScore = u.bestScore !== null ? (u.bestScore / 100) * 50 : 0
            return sum + lessonsScore + quizScore
          }, 0) / unitStats.length
        )
      : 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Progress</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{trackName}</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: <Zap className="w-4 h-4 text-blue-500" />, value: totalXp, label: "Total XP" },
          { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, value: lessonsCompleted, label: "Lessons Done" },
          { icon: <Target className="w-4 h-4 text-purple-500" />, value: `${avgAccuracy}%`, label: "Avg Accuracy" },
          { icon: <TrendingUp className="w-4 h-4 text-orange-500" />, value: `${overallReadiness}%`, label: "Readiness" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            {stat.icon}
            <span className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</span>
            <span className="text-xs text-slate-400">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Readiness meter */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Written Exam Readiness
          </h2>
          <span
            className={cn(
              "text-sm font-bold",
              overallReadiness >= 80
                ? "text-emerald-600"
                : overallReadiness >= 60
                ? "text-yellow-600"
                : "text-red-500"
            )}
          >
            {overallReadiness}%
          </span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallReadiness}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              overallReadiness >= 80
                ? "bg-emerald-500"
                : overallReadiness >= 60
                ? "bg-yellow-400"
                : "bg-red-400"
            )}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {overallReadiness >= 80
            ? "Looking great! Consider scheduling your written exam."
            : overallReadiness >= 60
            ? "Good progress. Keep studying weak areas."
            : "Keep working through the lessons and quizzes."}
        </p>
      </div>

      {/* Unit breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
          Unit Breakdown
        </h2>
        <div className="space-y-3">
          {unitStats.map((unit) => (
            <div
              key={unit.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white text-sm truncate">
                      {unit.title}
                    </span>
                    {unit.masteryLevel && unit.masteryLevel in masteryColor && (
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                          masteryColor[unit.masteryLevel as keyof typeof masteryColor]
                        )}
                      >
                        {unit.masteryLevel}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {unit.completedLessons}/{unit.totalLessons} lessons
                    </span>
                    {unit.bestScore !== null && (
                      <span>Best quiz: {Math.round(unit.bestScore)}%</span>
                    )}
                  </div>
                </div>
                {unit.bestScore !== null && (
                  <div
                    className={cn(
                      "text-sm font-bold shrink-0",
                      unit.bestScore >= 80
                        ? "text-emerald-600"
                        : unit.bestScore >= 70
                        ? "text-yellow-600"
                        : "text-red-500"
                    )}
                  >
                    {Math.round(unit.bestScore)}%
                  </div>
                )}
              </div>
              <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${unit.totalLessons > 0 ? (unit.completedLessons / unit.totalLessons) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak areas */}
      {weakAreasUnlocked && weakUnits.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            Weak Areas — Review These
          </h2>
          <ul className="space-y-1">
            {weakUnits.map((u) => (
              <li key={u.id} className="text-sm text-red-700 dark:text-red-300">
                • {u.title} ({Math.round(u.bestScore!)}%)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Streak calendar (last 30 days) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Study Activity (last 30 days)
        </h2>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: 30 }).map((_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (29 - i))
            const dateStr = date.toISOString().split("T")[0]
            const entry = streakData.find((s) => s.date === dateStr)
            return (
              <div
                key={i}
                className={cn(
                  "w-4 h-4 rounded-sm",
                  entry && entry.xp > 0
                    ? entry.xp >= 50
                      ? "bg-blue-600"
                      : entry.xp >= 20
                      ? "bg-blue-400"
                      : "bg-blue-200"
                    : "bg-slate-100 dark:bg-slate-800"
                )}
                title={`${dateStr}: ${entry?.xp ?? 0} XP`}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
          <span>No study</span>
          <div className="w-3 h-3 rounded-sm bg-blue-200 ml-2" />
          <span>Light</span>
          <div className="w-3 h-3 rounded-sm bg-blue-400 ml-2" />
          <span>Good</span>
          <div className="w-3 h-3 rounded-sm bg-blue-600 ml-2" />
          <span>Heavy</span>
        </div>
      </div>
    </div>
  )
}
