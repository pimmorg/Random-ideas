"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Flame,
  Star,
  Target,
  ChevronRight,
  Lock,
  CheckCircle2,
  Circle,
  Award,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import AIChatButton from "@/components/chat/AIChatButton"

interface Lesson {
  id: string
  slug: string
  title: string
  estimatedMins: number
  completed: boolean
  isLocked: boolean
  xpEarned: number
}

interface Unit {
  id: string
  slug: string
  title: string
  description: string
  icon: string | null
  lessons: Lesson[]
  completionPercent: number
  masteryLevel: string
  questionCount: number
}

interface DashboardClientProps {
  trackName: string
  trackShortName: string
  trackIcon: string
  units: Unit[]
  currentLesson: { id: string; title: string; unitTitle: string } | null
  stats: {
    totalXp: number
    currentStreak: number
    dailyGoalMinutes: number
    lessonsCompleted: number
    averageAccuracy: number
  }
  flags: {
    progressStatsUnlocked: boolean
    achievementsUnlocked: boolean
  }
  showNextTrackPreview: boolean
  overallCompletion: number
}

const masteryColors = {
  none: "",
  bronze: "text-amber-600 dark:text-amber-400",
  silver: "text-slate-500 dark:text-slate-300",
  gold: "text-yellow-500 dark:text-yellow-300",
}

const masteryBg = {
  none: "",
  bronze: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800",
  silver: "bg-slate-50 border-slate-300 dark:bg-slate-800 dark:border-slate-600",
  gold: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
}

export default function DashboardClient({
  trackName,
  trackShortName,
  trackIcon,
  units,
  currentLesson,
  stats,
  flags,
  showNextTrackPreview,
  overallCompletion,
}: DashboardClientProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Track header */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="text-base">{trackIcon}</span>
        <span>{trackName}</span>
        <span className="ml-auto text-xs bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 px-2 py-0.5 rounded-full font-medium">
          {overallCompletion}% complete
        </span>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Flame className="w-4 h-4 text-orange-500" />}
          value={stats.currentStreak}
          label="day streak"
        />
        <StatCard
          icon={<Zap className="w-4 h-4 text-sky-500" />}
          value={stats.totalXp}
          label="total XP"
        />
        <StatCard
          icon={<Target className="w-4 h-4 text-emerald-500" />}
          value={`${stats.dailyGoalMinutes}m`}
          label="daily goal"
        />
      </div>

      {/* Continue learning CTA */}
      {currentLesson && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href={`/lesson/${currentLesson.id}`}
            className="flex items-center gap-4 p-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-colors group"
          >
            <div className="flex-1">
              <div className="text-xs text-sky-200 mb-0.5">{currentLesson.unitTitle}</div>
              <div className="font-semibold">{currentLesson.title}</div>
              <div className="text-xs text-sky-200 mt-0.5">Continue learning →</div>
            </div>
            <ChevronRight className="w-5 h-5 text-sky-200 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      )}

      {/* Skill tree */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
          Skill Tree
        </h2>
        <div className="space-y-4">
          {units.map((unit, unitIndex) => (
            <UnitCard key={unit.id} unit={unit} unitIndex={unitIndex} />
          ))}
        </div>
      </div>

      {/* Next track preview */}
      {showNextTrackPreview && (
        <div className="p-4 rounded-xl border-2 border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-950/30">
          <p className="text-sm font-medium text-sky-700 dark:text-sky-300">
            You're almost ready for your next rating!
          </p>
          <p className="text-xs text-sky-600/70 dark:text-sky-400/70 mt-1">
            Want a preview of what comes next? Check Settings → "Browse all certifications"
          </p>
        </div>
      )}

      {/* AI tutor floating button */}
      <AIChatButton />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number | string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
      {icon}
      <span className="text-lg font-bold text-slate-900 dark:text-white">{value}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  )
}

function UnitCard({ unit, unitIndex }: { unit: Unit; unitIndex: number }) {
  const isFullyCompleted = unit.completionPercent === 100
  const mastery = unit.masteryLevel as keyof typeof masteryColors

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: unitIndex * 0.05 }}
      className={cn(
        "rounded-xl border bg-white dark:bg-slate-900 overflow-hidden",
        isFullyCompleted && mastery !== "none"
          ? masteryBg[mastery]
          : "border-slate-100 dark:border-slate-800"
      )}
    >
      {/* Unit header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xl">{unit.icon ?? "📚"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
              {unit.title}
            </span>
            {mastery !== "none" && (
              <Award
                className={cn("w-4 h-4 shrink-0", masteryColors[mastery])}
              />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: `${unit.completionPercent}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 shrink-0">
              {unit.completionPercent}%
            </span>
          </div>
        </div>
        {unit.questionCount > 0 && unit.completionPercent > 0 && (
          <Link
            href={`/quiz/${unit.id}`}
            className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-900 transition-colors"
          >
            Quiz
          </Link>
        )}
      </div>

      {/* Lessons */}
      <div className="divide-y divide-slate-50 dark:divide-slate-800">
        {unit.lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </motion.div>
  )
}

function LessonRow({ lesson }: { lesson: Lesson }) {
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors",
        lesson.isLocked
          ? "opacity-50 cursor-not-allowed"
          : lesson.completed
          ? "hover:bg-slate-50 dark:hover:bg-slate-800/50"
          : "hover:bg-sky-50/50 dark:hover:bg-sky-950/20"
      )}
    >
      <div className="shrink-0">
        {lesson.isLocked ? (
          <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        ) : lesson.completed ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <Circle className="w-4 h-4 text-sky-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
          {lesson.title}
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">
          {lesson.estimatedMins} min
        </div>
      </div>
      {lesson.completed && lesson.xpEarned > 0 && (
        <div className="flex items-center gap-0.5 text-xs text-sky-600 dark:text-sky-400 shrink-0">
          <Star className="w-3 h-3" />
          {lesson.xpEarned}
        </div>
      )}
      {!lesson.isLocked && !lesson.completed && (
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
      )}
    </div>
  )

  if (lesson.isLocked) return content

  return <Link href={`/lesson/${lesson.id}`}>{content}</Link>
}
