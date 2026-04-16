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
  Trophy,
  ClipboardList,
  PlaneTakeoff,
  Shuffle,
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
  quizScore: number | null
  questionCount: number
}

interface DashboardClientProps {
  trackId: string
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
  trackId,
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
        <span className="ml-auto text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
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
          icon={<Zap className="w-4 h-4 text-blue-500" />}
          value={stats.totalXp}
          label="total XP"
        />
        <StatCard
          icon={<Target className="w-4 h-4 text-emerald-500" />}
          value={`${stats.dailyGoalMinutes}m`}
          label="daily goal"
        />
      </div>

      {/* Exam Readiness Summary */}
      <ReadinessSummary units={units} overallCompletion={overallCompletion} />

      {/* Continue learning CTA */}
      {currentLesson && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href={`/lesson/${currentLesson.id}`}
            className="flex items-center gap-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors group"
          >
            <div className="flex-1">
              <div className="text-xs text-blue-200 mb-0.5">{currentLesson.unitTitle}</div>
              <div className="font-semibold">{currentLesson.title}</div>
              <div className="text-xs text-blue-200 mt-0.5">Continue learning →</div>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      )}

      {/* Daily Quick Quiz */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <Link
          href="/quiz/daily"
          className="flex items-center gap-4 p-4 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100 rounded-xl transition-colors group"
        >
          <Shuffle className="w-8 h-8 text-amber-500 shrink-0" />
          <div className="flex-1">
            <div className="text-xs text-amber-600 dark:text-amber-400 mb-0.5">5 random questions</div>
            <div className="font-semibold">Daily Quick Quiz</div>
            <div className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">From your completed lessons →</div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </Link>
      </motion.div>

      {/* Skill tree */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-0.5 h-5 bg-blue-500 rounded-full" />
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">
            Skill Tree
          </h2>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="space-y-4">
          {units.map((unit, unitIndex) => (
            <UnitCard key={unit.id} unit={unit} unitIndex={unitIndex} />
          ))}
        </div>
      </div>

      {/* Overall track test CTA */}
      {overallCompletion > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link
            href={`/quiz/track/${trackId}`}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all group"
          >
            <Trophy className="w-8 h-8 text-violet-200 shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-violet-200 mb-0.5">Mixed questions from all units</div>
              <div className="font-semibold">Overall Track Test</div>
              <div className="text-xs text-violet-200 mt-0.5">Test your knowledge across {trackShortName} →</div>
            </div>
            <ChevronRight className="w-5 h-5 text-violet-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        </motion.div>
      )}

      {/* Next track preview */}
      {showNextTrackPreview && (
        <div className="p-4 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            You're almost ready for your next rating!
          </p>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
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
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        {/* Title row */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-xl">{unit.icon ?? "📚"}</span>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
              {unit.title}
            </span>
            {mastery !== "none" && (
              <Award className={cn("w-4 h-4 shrink-0", masteryColors[mastery])} />
            )}
          </div>
          {unit.questionCount > 0 && unit.completionPercent > 0 && (
            <Link
              href={`/quiz/${unit.id}`}
              className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors"
            >
              Quiz
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          {/* Lesson circle progress */}
          <div className="flex items-center gap-2.5">
            <LessonRing pct={unit.completionPercent} />
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lessons</div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{unit.completionPercent}% complete</div>
            </div>
          </div>

          {/* Proficiency — only after first quiz attempt */}
          {unit.quizScore !== null && (
            <>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div>
                <div className="text-lg font-extrabold text-violet-600 dark:text-violet-400 leading-none tabular-nums">
                  {unit.quizScore}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                  Proficiency
                </div>
              </div>
            </>
          )}
        </div>
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

// ── Readiness helpers ───────────────────────────────────────────────────────

function masteryScore(level: string) {
  if (level === "gold")   return 100
  if (level === "silver") return 87
  if (level === "bronze") return 72
  return 0
}

function readinessStatus(pct: number): { label: string; color: string; ring: string } {
  if (pct >= 85) return { label: "Well prepared",      color: "text-emerald-600 dark:text-emerald-400", ring: "#10b981" }
  if (pct >= 70) return { label: "Nearly ready",       color: "text-blue-600 dark:text-blue-400",      ring: "#3b82f6" }
  if (pct >= 50) return { label: "Making progress",    color: "text-amber-600 dark:text-amber-400",    ring: "#f59e0b" }
  if (pct >= 25) return { label: "Building foundation", color: "text-slate-500 dark:text-slate-400",   ring: "#64748b" }
  return            { label: "Just starting",          color: "text-slate-400 dark:text-slate-500",    ring: "#94a3b8" }
}

function ReadinessSummary({ units, overallCompletion }: { units: Unit[]; overallCompletion: number }) {
  const testableUnits = units.filter(u => u.questionCount > 0)

  // Written: 65% quiz mastery, 35% lesson completion
  const avgQuiz = testableUnits.length > 0
    ? testableUnits.reduce((s, u) => s + masteryScore(u.masteryLevel), 0) / testableUnits.length
    : 0
  const avgLesson = units.length > 0
    ? units.reduce((s, u) => s + u.completionPercent, 0) / units.length
    : 0
  const written = Math.round(avgQuiz * 0.65 + avgLesson * 0.35)

  // Checkride: knowledge (written) + depth of lesson coverage, capped lower
  // — practical flying can't be measured, so study progress caps around 80%
  const checkride = Math.min(Math.round(written * 0.6 + overallCompletion * 0.25), 80)

  const ws = readinessStatus(written)
  const cs = readinessStatus(checkride)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-500 shrink-0" />
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Exam Readiness</h2>
        <span className="ml-auto text-xs text-slate-400">Based on quiz & lesson progress</span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
        <ReadinessCard
          icon={<ClipboardList className="w-4 h-4" />}
          title="Written"
          subtitle="FAA Knowledge Test"
          pct={written}
          status={ws}
          note={written < 70 ? "70% needed to pass" : "Pass threshold met"}
        />
        <ReadinessCard
          icon={<PlaneTakeoff className="w-4 h-4" />}
          title="Checkride"
          subtitle="Practical Test (ACS)"
          pct={checkride}
          status={cs}
          note="Study readiness only — flight hrs required"
        />
      </div>
    </div>
  )
}

function ReadinessCard({
  icon, title, subtitle, pct, status, note,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  pct: number
  status: { label: string; color: string; ring: string }
  note: string
}) {
  const circumference = 2 * Math.PI * 36 // r=36 → ~226.2
  const dash = (pct / 100) * circumference

  return (
    <Link href="/progress" className="p-4 flex flex-col items-center text-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      {/* Ring */}
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        {/* Track */}
        <circle cx="50" cy="50" r="36" fill="none" stroke="#e2e8f0" strokeWidth="8"
          className="dark:[stroke:#1e293b]" />
        {/* Progress arc */}
        <circle
          cx="50" cy="50" r="36" fill="none"
          stroke={status.ring} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        {/* Percentage */}
        <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="800"
          fill={status.ring}>{pct}%</text>
        <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#94a3b8">ready</text>
      </svg>

      {/* Label */}
      <div>
        <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 mb-0.5">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-wide">{title}</span>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</div>
      </div>

      {/* Status badge */}
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 ${status.color}`}>
        {status.label}
      </span>

      {/* Note */}
      <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">{note}</p>
    </Link>
  )
}

function LessonRing({ pct }: { pct: number }) {
  const r = 14
  const circumference = 2 * Math.PI * r
  const dash = (pct / 100) * circumference
  return (
    <svg viewBox="0 0 36 36" className="w-9 h-9 text-slate-200 dark:text-slate-700">
      {/* Track */}
      <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeWidth="4" />
      {/* Progress arc */}
      <circle
        cx="18" cy="18" r={r} fill="none"
        stroke="#3b82f6" strokeWidth="4" strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform="rotate(-90 18 18)"
        style={{ transition: "stroke-dasharray 0.5s ease" }}
      />
    </svg>
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
          : "hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
      )}
    >
      <div className="shrink-0">
        {lesson.isLocked ? (
          <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        ) : lesson.completed ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <Circle className="w-4 h-4 text-blue-400" />
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
        <div className="flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-400 shrink-0">
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
