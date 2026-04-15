import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { db } from "@/lib/db"
import LessonView from "@/components/lesson/LessonView"

interface Props {
  params: Promise<{ lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      sections: { orderBy: { sortOrder: "asc" } },
      unit: {
        include: {
          track: { select: { name: true, slug: true, id: true } },
          lessons: { orderBy: { sortOrder: "asc" }, select: { id: true, title: true, sortOrder: true } },
        },
      },
    },
  })

  if (!lesson) notFound()

  const progress = await db.userProgress.findUnique({
    where: {
      userId_lessonId: { userId: session.user.id, lessonId },
    },
  })

  const flags = await db.userFeatureFlags.findUnique({
    where: { userId: session.user.id },
  })

  // Find prev/next lessons in the unit
  const allLessons = lesson.unit.lessons
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <LessonView
      lesson={{
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        estimatedMins: lesson.estimatedMins,
        sections: lesson.sections,
      }}
      unitTitle={lesson.unit.title}
      trackName={lesson.unit.track.name}
      trackSlug={lesson.unit.track.slug}
      isCompleted={progress?.completed ?? false}
      bookmarksUnlocked={flags?.bookmarksUnlocked ?? false}
      prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null}
      nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null}
      unitId={lesson.unit.id}
      questionCount={0}
    />
  )
}
