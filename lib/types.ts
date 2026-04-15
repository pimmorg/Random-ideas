// Domain types for SkySchool

export type TrainingStage =
  | "just_starting"
  | "ppl"
  | "has_ppl"
  | "instrument"
  | "commercial"
  | "multi_engine"
  | "cfi"
  | "atp"
  | "show_all"

export type MasteryLevel = "none" | "bronze" | "silver" | "gold"

export interface TrackWithProgress {
  id: string
  slug: string
  name: string
  shortName: string
  description: string
  icon: string
  sortOrder: number
  isActive: boolean
  isUnlocked: boolean
  completionPercent: number
  xp: number
  units: UnitWithProgress[]
}

export interface UnitWithProgress {
  id: string
  slug: string
  title: string
  description: string
  sortOrder: number
  icon: string | null
  lessons: LessonWithProgress[]
  masteryLevel: MasteryLevel
  completionPercent: number
  questionCount: number
}

export interface LessonWithProgress {
  id: string
  slug: string
  title: string
  description: string
  estimatedMins: number
  sortOrder: number
  completed: boolean
  isLocked: boolean
  xpEarned: number
}

export interface UserStats {
  totalXp: number
  currentStreak: number
  longestStreak: number
  dailyGoalMinutes: number
  dailyProgressMinutes: number
  lessonsCompleted: number
  quizzesTaken: number
  averageAccuracy: number
}

export interface FeatureFlags {
  bookmarksUnlocked: boolean
  progressStatsUnlocked: boolean
  achievementsUnlocked: boolean
  leaderboardUnlocked: boolean
  weakAreasUnlocked: boolean
  nextTrackPreview: boolean
  multiTrackUI: boolean
  journeyMapUnlocked: boolean
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}
