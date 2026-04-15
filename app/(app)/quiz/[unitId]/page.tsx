import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { db } from "@/lib/db"
import QuizClient from "@/components/quiz/QuizClient"

interface Props {
  params: Promise<{ unitId: string }>
}

export default async function QuizPage({ params }: Props) {
  const { unitId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const unit = await db.unit.findUnique({
    where: { id: unitId },
    include: {
      track: { select: { name: true } },
      questions: {
        include: {
          options: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!unit || unit.questions.length === 0) notFound()

  // Shuffle questions
  const shuffled = [...unit.questions].sort(() => Math.random() - 0.5).slice(0, 20)

  return (
    <QuizClient
      unitId={unit.id}
      unitTitle={unit.title}
      trackName={unit.track.name}
      questions={shuffled.map((q) => ({
        id: q.id,
        question: q.question,
        explanation: q.explanation,
        farAimRef: q.farAimRef ?? undefined,
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      }))}
    />
  )
}
