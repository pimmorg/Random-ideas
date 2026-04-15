import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const { unitId, score, totalQuestions, correctAnswers, answers } = await req.json()

  const masteryLevel =
    score >= 95 ? "gold" : score >= 85 ? "silver" : score >= 70 ? "bronze" : null

  const xpEarned = correctAnswers * 5 + (masteryLevel ? 25 : 0)

  const attempt = await db.quizAttempt.create({
    data: {
      userId,
      unitId,
      score,
      totalQuestions,
      correctAnswers,
      xpEarned,
      masteryLevel,
      questionAttempts: {
        create: (answers as Array<{ questionId: string; selectedOptionId: string; isCorrect: boolean }>).map(
          (a) => ({
            questionId: a.questionId,
            selectedOptionId: a.selectedOptionId,
            isCorrect: a.isCorrect,
          })
        ),
      },
    },
  })

  // Log XP to streak
  const today = new Date().toISOString().split("T")[0]
  await db.streakLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: { xpEarned: { increment: xpEarned } },
    create: { userId, date: today, xpEarned },
  })

  // Unlock leaderboard after first unit completion
  await db.userFeatureFlags.updateMany({
    where: { userId, leaderboardUnlocked: false },
    data: { leaderboardUnlocked: true },
  })

  return NextResponse.json({ success: true, attempt })
}
