import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { db } from "@/lib/db"
import TrackQuizClient from "@/components/quiz/TrackQuizClient"

interface Props {
  params: Promise<{ trackId: string }>
}

export default async function TrackQuizPage({ params }: Props) {
  const { trackId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const track = await db.track.findUnique({
    where: { id: trackId },
    include: {
      units: {
        orderBy: { sortOrder: "asc" },
        include: {
          questions: {
            include: {
              options: { orderBy: { sortOrder: "asc" } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  })

  if (!track) notFound()

  // Gather all questions from all units, tagged with their unit title
  const allQuestions = track.units.flatMap((unit) =>
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

  if (allQuestions.length === 0) notFound()

  // Shuffle and cap at 20
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 20)

  return (
    <TrackQuizClient
      trackId={trackId}
      trackName={track.name}
      questions={shuffled}
    />
  )
}
