"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getUserStats(userId: string) {
  const streakLogs = await db.streakLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 60,
  })

  const today = new Date().toISOString().split("T")[0]
  const sortedDates = streakLogs.map((s) => s.date).sort().reverse()

  let currentStreak = 0
  let checkDate = new Date()
  for (const date of sortedDates) {
    const expected = checkDate.toISOString().split("T")[0]
    if (date === expected) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  const totalXp = streakLogs.reduce((sum, s) => sum + s.xpEarned, 0)

  const quizAttempts = await db.quizAttempt.findMany({ where: { userId } })
  const totalCorrect = quizAttempts.reduce((s, q) => s + q.correctAnswers, 0)
  const totalQuestions = quizAttempts.reduce((s, q) => s + q.totalQuestions, 0)
  const averageAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  const lessonsCompleted = await db.userProgress.count({
    where: { userId, completed: true },
  })

  const onboarding = await db.userOnboarding.findUnique({ where: { userId } })

  return {
    totalXp,
    currentStreak,
    longestStreak: currentStreak,
    dailyGoalMinutes: onboarding?.dailyGoalMinutes ?? 15,
    dailyProgressMinutes: 0,
    lessonsCompleted,
    quizzesTaken: quizAttempts.length,
    averageAccuracy,
  }
}

export async function getFeatureFlags(userId: string) {
  const flags = await db.userFeatureFlags.findUnique({ where: { userId } })
  if (!flags) {
    return {
      bookmarksUnlocked: false,
      progressStatsUnlocked: false,
      achievementsUnlocked: false,
      leaderboardUnlocked: false,
      weakAreasUnlocked: false,
      nextTrackPreview: false,
      multiTrackUI: false,
      journeyMapUnlocked: false,
    }
  }
  return {
    bookmarksUnlocked: flags.bookmarksUnlocked,
    progressStatsUnlocked: flags.progressStatsUnlocked,
    achievementsUnlocked: flags.achievementsUnlocked,
    leaderboardUnlocked: flags.leaderboardUnlocked,
    weakAreasUnlocked: flags.weakAreasUnlocked,
    nextTrackPreview: flags.nextTrackPreview,
    multiTrackUI: flags.multiTrackUI,
    journeyMapUnlocked: flags.journeyMapUnlocked,
  }
}

export async function getActiveTrack(userId: string) {
  const userTrack = await db.userTrack.findFirst({
    where: { userId, isActive: true },
    include: {
      track: {
        include: {
          units: {
            orderBy: { sortOrder: "asc" },
            include: {
              lessons: {
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
      },
    },
  })
  return userTrack
}

export async function updateLessonProgress(lessonId: string, timeSpentSecs: number) {
  const session = await auth()
  if (!session?.user?.id) return null

  const userId = session.user.id

  const existing = await db.userProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  })

  if (existing?.completed) return existing

  const progress = await db.userProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      lastAccessedAt: new Date(),
      timeSpentSecs: { increment: timeSpentSecs },
    },
    create: {
      userId,
      lessonId,
      timeSpentSecs,
    },
  })

  return progress
}

export async function completeLessonProgress(lessonId: string) {
  const session = await auth()
  if (!session?.user?.id) return null
  const userId = session.user.id

  const xpEarned = 20

  const progress = await db.userProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      completed: true,
      completedAt: new Date(),
      xpEarned,
    },
    create: {
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
      xpEarned,
    },
  })

  // Log streak XP
  const today = new Date().toISOString().split("T")[0]
  await db.streakLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: { xpEarned: { increment: xpEarned } },
    create: { userId, date: today, xpEarned },
  })

  // Update feature flags based on progress
  await checkAndUnlockFeatures(userId)

  revalidatePath("/dashboard")
  return progress
}

async function checkAndUnlockFeatures(userId: string) {
  const completedLessons = await db.userProgress.count({
    where: { userId, completed: true },
  })

  const flags = await db.userFeatureFlags.findUnique({ where: { userId } })
  if (!flags) return

  const updates: Record<string, boolean> = {}

  if (completedLessons >= 1 && !flags.bookmarksUnlocked) {
    updates.bookmarksUnlocked = true
    updates.progressStatsUnlocked = true
  }

  if (completedLessons >= 5 && !flags.achievementsUnlocked) {
    updates.achievementsUnlocked = true
  }

  if (Object.keys(updates).length > 0) {
    await db.userFeatureFlags.update({
      where: { userId },
      data: updates,
    })
  }
}
