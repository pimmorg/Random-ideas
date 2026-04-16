"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { cn, getProficiencyColor } from "@/lib/utils"
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
      {/* Track + stats header card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Track row */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl shrink-0">{trackIcon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{trackName}</span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0">{overallCompletion}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${overallCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800">
          <StatItem
            icon={<Flame className="w-3.5 h-3.5 text-orange-500" />}
            label="Streak"
            value={stats.currentStreak}
            unit="days"
            sub={stats.currentStreak > 0 ? "Keep it up!" : "Start today"}
            valueClass="text-orange-500"
          />
          <StatItem
            icon={<Zap className="w-3.5 h-3.5 text-blue-500" />}
            label="Total XP"
            value={stats.totalXp}
            unit={null}
            sub="earned so far"
            valueClass="text-blue-600 dark:text-blue-400"
          />
          <StatItem
            icon={<Target className="w-3.5 h-3.5 text-emerald-500" />}
            label="Daily Goal"
            value={stats.dailyGoalMinutes}
            unit="min"
            sub="per day"
            valueClass="text-emerald-600 dark:text-emerald-400"
          />
        </div>
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
          className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-sm transition-colors group"
        >
          <Shuffle className="w-8 h-8 text-amber-500 shrink-0" />
          <div className="flex-1">
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-0.5">5 random questions</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Daily Quick Quiz</div>
            <div className="text-xs text-slate-400 mt-0.5">From your completed lessons</div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </Link>
      </motion.div>

      {/* Skill tree */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-0.5 h-5 bg-blue-500 rounded-full" />
          <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
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
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-xl shadow-sm transition-all group"
          >
            <Trophy className="w-8 h-8 text-blue-200 shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-blue-200 mb-0.5">Mixed questions from all units</div>
              <div className="font-semibold">Overall Track Test</div>
              <div className="text-xs text-blue-200 mt-0.5">Test your knowledge across {trackShortName} →</div>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
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

function StatItem({
  icon,
  label,
  value,
  unit,
  sub,
  valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: number
  unit: string | null
  sub: string
  valueClass: string
}) {
  return (
    <div className="px-4 py-4 flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className={cn("text-2xl font-extrabold tabular-nums", valueClass)}>
          {value.toLocaleString()}
        </span>
        {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
      </div>
      <div className="text-[11px] text-slate-400">{sub}</div>
    </div>
  )
}

function UnitCard({ unit, unitIndex }: { unit: Unit; unitIndex: number }) {
  const [open, setOpen] = useState(false)
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
          : "border-slate-200 dark:border-slate-800 shadow-sm"
      )}
    >
      {/* Unit header — the whole rectangle is the progress bar */}
      <div
        role="button"
        onClick={() => setOpen((o) => !o)}
        className="group relative flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none overflow-hidden"
      >
        {/* Base background */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/50" />
        {/* Progress fill — grows left→right */}
        <div
          className="absolute inset-y-0 left-0 bg-blue-100 dark:bg-blue-900/30 transition-[width] duration-500 ease-out"
          style={{ width: `${unit.completionPercent}%` }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-900/5 dark:bg-white/5 transition-opacity" />

        {/* Content sits above the fill layers */}
        <div className="relative flex items-center gap-3 w-full">
          {/* Icon + title */}
          <span className="text-xl shrink-0">{unit.icon ?? "📚"}</span>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
              {unit.title}
            </span>
            {mastery !== "none" && (
              <Award className={cn("w-4 h-4 shrink-0", masteryColors[mastery])} />
            )}
          </div>

          {/* Right: proficiency + quiz btn + chevron */}
          <div className="flex items-center gap-3 shrink-0">
            {unit.quizScore !== null && (
              <div className="text-right hidden sm:block">
                <div className={cn("text-sm font-extrabold leading-none tabular-nums", getProficiencyColor(unit.quizScore ?? 0))}>
                  {unit.quizScore}%
                </div>
                <div className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">
                  Proficiency
                </div>
              </div>
            )}

            {unit.questionCount > 0 && unit.completionPercent > 0 && (
              <Link
                href={`/quiz/${unit.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors"
              >
                Quiz
              </Link>
            )}

            <ChevronRight
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0",
                open && "rotate-90"
              )}
            />
          </div>
        </div>
      </div>

      {/* Collapsible lesson list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="lessons"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-slate-50 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
              {unit.lessons.map((lesson) => (
                <LessonRow key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  if (pct >= 85) return { label: "Well prepared",       color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950", ring: "#10b981" }
  if (pct >= 70) return { label: "Nearly ready",        color: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950", ring: "#10b981" }
  if (pct >= 50) return { label: "Making progress",     color: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950",         ring: "#f59e0b" }
  if (pct >= 25) return { label: "Building foundation", color: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950",             ring: "#3b82f6" }
  return                { label: "Just starting",       color: "text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800",        ring: "#94a3b8" }
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.color}`}>
        {status.label}
      </span>

      {/* Note */}
      <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">{note}</p>
    </Link>
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
