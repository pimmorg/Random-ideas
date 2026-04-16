import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import TrackQuizClient from "@/components/quiz/TrackQuizClient"

export default async function DailyQuizPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id

  // Find all lessons the user has completed
  const completedProgress = await db.userProgress.findMany({
    where: { userId, completed: true },
    select: { lessonId: true },
  })

  if (completedProgress.length === 0) {
    redirect("/dashboard")
  }

  const completedLessonIds = completedProgress.map((p) => p.lessonId)

  // Find units that contain at least one completed lesson and have quiz questions
  const units = await db.unit.findMany({
    where: {
      lessons: { some: { id: { in: completedLessonIds } } },
      questions: { some: {} },
    },
    include: {
      questions: {
        include: {
          options: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  })

  const allQuestions = units.flatMap((unit) =>
    unit.questions.map((q) => ({
      id: q.id,
      question: q.question,
      explanation: q.explanation,
      farAimRef: q.farAimRef ?? undefined,
      unitTitle: unit.title,
      options: q.options.map((o) => ({
        id: o.id,
        text: o.text,
        isCorrect: o.isCorrect,
      })),
    }))
  )

  if (allQuestions.length === 0) {
    redirect("/dashboard")
  }

  // Shuffle and take 5
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 5)

  return (
    <TrackQuizClient
      trackId="daily"
      trackName="Daily Quick Quiz"
      questions={shuffled}
    />
  )
}
