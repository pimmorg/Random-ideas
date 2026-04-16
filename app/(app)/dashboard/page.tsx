import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getUserStats, getFeatureFlags } from "@/lib/actions/user"
import DashboardClient from "@/components/dashboard/DashboardClient"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id

  // Get active track with all units and lessons
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
              questions: { select: { id: true } },
            },
          },
        },
      },
    },
  })

  if (!userTrack) {
    redirect("/onboarding")
  }

  // Get user progress for all lessons
  const allLessonIds = userTrack.track.units.flatMap((u) =>
    u.lessons.map((l) => l.id)
  )
  const progressRecords = await db.userProgress.findMany({
    where: { userId, lessonId: { in: allLessonIds } },
  })
  const progressMap = new Map(progressRecords.map((p) => [p.lessonId, p]))

  // Get quiz attempts per unit
  const unitIds = userTrack.track.units.map((u) => u.id)
  const quizAttempts = await db.quizAttempt.findMany({
    where: { userId, unitId: { in: unitIds } },
    orderBy: { completedAt: "desc" },
  })
  const bestAttemptMap = new Map<string, { score: number; masteryLevel: string | null }>()
  for (const attempt of quizAttempts) {
    const existing = bestAttemptMap.get(attempt.unitId)
    if (!existing || attempt.score > existing.score) {
      bestAttemptMap.set(attempt.unitId, {
        score: attempt.score,
        masteryLevel: attempt.masteryLevel,
      })
    }
  }

  // Build enriched units
  const units = userTrack.track.units.map((unit, unitIndex) => {
    const prevUnit = unitIndex > 0 ? userTrack.track.units[unitIndex - 1] : null
    const prevUnitLessons = prevUnit?.lessons ?? []
    const prevUnitCompleted =
      prevUnit === null ||
      prevUnitLessons.every((l) => progressMap.get(l.id)?.completed)

    const lessons = unit.lessons.map((lesson, lessonIndex) => {
      const prevLesson = lessonIndex > 0 ? unit.lessons[lessonIndex - 1] : null
      const prevLessonCompleted =
        prevLesson === null || progressMap.get(prevLesson.id)?.completed === true
      const isLocked = !prevUnitCompleted || (lessonIndex > 0 && !prevLessonCompleted)
      const progress = progressMap.get(lesson.id)

      return {
        ...lesson,
        completed: progress?.completed ?? false,
        isLocked,
        xpEarned: progress?.xpEarned ?? 0,
      }
    })

    const completedCount = lessons.filter((l) => l.completed).length
    const completionPercent =
      lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0
    const bestAttempt = bestAttemptMap.get(unit.id)
    const masteryLevel =
      bestAttempt?.score != null
        ? bestAttempt.score >= 95
          ? "gold"
          : bestAttempt.score >= 85
          ? "silver"
          : bestAttempt.score >= 70
          ? "bronze"
          : "none"
        : "none"

    return {
      ...unit,
      lessons,
      completionPercent,
      masteryLevel,
      questionCount: unit.questions.length,
    }
  })

  // Find current lesson (first incomplete, non-locked)
  let currentLesson: { id: string; title: string; unitTitle: string } | null = null
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      if (!lesson.completed && !lesson.isLocked) {
        currentLesson = { id: lesson.id, title: lesson.title, unitTitle: unit.title }
        break
      }
    }
    if (currentLesson) break
  }

  const [stats, flags] = await Promise.all([
    getUserStats(userId),
    getFeatureFlags(userId),
  ])

  // Check if we should show next track preview (75%+ completion)
  const totalLessons = units.flatMap((u) => u.lessons).length
  const completedLessons = units.flatMap((u) => u.lessons).filter((l) => l.completed).length
  const overallCompletion = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const showNextTrackPreview = overallCompletion >= 75 && flags.nextTrackPreview

  return (
    <DashboardClient
      trackId={userTrack.track.id}
      trackName={userTrack.track.name}
      trackShortName={userTrack.track.shortName}
      trackIcon={userTrack.track.icon}
      units={units}
      currentLesson={currentLesson}
      stats={stats}
      flags={flags}
      showNextTrackPreview={showNextTrackPreview}
      overallCompletion={Math.round(overallCompletion)}
    />
  )
}
