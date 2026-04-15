import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import ProgressClient from "@/components/progress/ProgressClient"

export default async function ProgressPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const flags = await db.userFeatureFlags.findUnique({ where: { userId } })
  if (!flags?.progressStatsUnlocked) {
    redirect("/dashboard")
  }

  const userTrack = await db.userTrack.findFirst({
    where: { userId, isActive: true },
    include: {
      track: {
        include: {
          units: {
            orderBy: { sortOrder: "asc" },
            include: {
              lessons: { select: { id: true } },
              questions: { select: { id: true } },
            },
          },
        },
      },
    },
  })

  if (!userTrack) redirect("/dashboard")

  const allLessonIds = userTrack.track.units.flatMap((u) =>
    u.lessons.map((l) => l.id)
  )
  const completedProgress = await db.userProgress.findMany({
    where: { userId, lessonId: { in: allLessonIds }, completed: true },
  })

  const quizAttempts = await db.quizAttempt.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    take: 20,
    include: { questionAttempts: true },
  })

  const streakLogs = await db.streakLog.findMany({
    where: { userId },
    orderBy: { date: "asc" },
    take: 30,
  })

  const totalXp = streakLogs.reduce((s, l) => s + l.xpEarned, 0)
  const totalCorrect = quizAttempts.reduce((s, a) => s + a.correctAnswers, 0)
  const totalQ = quizAttempts.reduce((s, a) => s + a.totalQuestions, 0)
  const avgAccuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0

  // Build unit stats
  const unitStats = userTrack.track.units.map((unit) => {
    const unitLessonIds = unit.lessons.map((l) => l.id)
    const completed = completedProgress.filter((p) =>
      unitLessonIds.includes(p.lessonId)
    ).length
    const bestAttempt = quizAttempts.find((a) => a.unitId === unit.id)
    return {
      id: unit.id,
      title: unit.title,
      totalLessons: unit.lessons.length,
      completedLessons: completed,
      questionCount: unit.questions.length,
      bestScore: bestAttempt?.score ?? null,
      masteryLevel: bestAttempt?.masteryLevel ?? null,
    }
  })

  return (
    <ProgressClient
      trackName={userTrack.track.name}
      unitStats={unitStats}
      totalXp={totalXp}
      lessonsCompleted={completedProgress.length}
      quizzesTaken={quizAttempts.length}
      avgAccuracy={avgAccuracy}
      streakData={streakLogs.map((l) => ({ date: l.date, xp: l.xpEarned }))}
      weakAreasUnlocked={flags?.weakAreasUnlocked ?? false}
    />
  )
}
