"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import AIChatButton from "@/components/chat/AIChatButton"
import ReactMarkdown from "react-markdown"

interface Section {
  id: string
  title: string
  content: string
  sortOrder: number
}

interface LessonViewProps {
  lesson: {
    id: string
    title: string
    description: string
    estimatedMins: number
    sections: Section[]
  }
  unitTitle: string
  trackName: string
  trackSlug: string
  isCompleted: boolean
  bookmarksUnlocked: boolean
  prevLesson: { id: string; title: string } | null
  nextLesson: { id: string; title: string } | null
  unitId: string
  questionCount: number
}

export default function LessonView({
  lesson,
  unitTitle,
  trackName,
  isCompleted,
  bookmarksUnlocked,
  prevLesson,
  nextLesson,
  unitId,
  questionCount,
}: LessonViewProps) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState(0)
  const [completed, setCompleted] = useState(isCompleted)
  const [bookmarked, setBookmarked] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [showXp, setShowXp] = useState(false)
  const startTimeRef = useRef<number>(Date.now())
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Update active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (ref) => ref === entry.target
            )
            if (index !== -1) setActiveSection(index)
          }
        })
      },
      { threshold: 0.5 }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [lesson.sections])

  const handleComplete = async () => {
    if (completed || completing) return
    setCompleting(true)
    try {
      const res = await fetch("/api/lessons/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      })
      if (res.ok) {
        setCompleted(true)
        setShowXp(true)
        setTimeout(() => {
          setShowXp(false)
          if (nextLesson) {
            router.push(`/lesson/${nextLesson.id}`)
          } else {
            router.push("/dashboard")
          }
        }, 1500)
      }
    } finally {
      setCompleting(false)
    }
  }

  const toggleBookmark = async () => {
    const newState = !bookmarked
    setBookmarked(newState)
    await fetch("/api/lessons/bookmark", {
      method: newState ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id }),
    })
  }

  const progress = ((activeSection + 1) / lesson.sections.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 z-30 h-0.5 bg-slate-200 dark:bg-slate-800">
        <motion.div
          className="h-full bg-sky-500"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          {trackName} — {unitTitle}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lesson.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              {lesson.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {lesson.estimatedMins} min
            </div>
            {bookmarksUnlocked && (
              <button
                onClick={toggleBookmark}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {bookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-sky-500" />
                ) : (
                  <Bookmark className="w-4 h-4 text-slate-400" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section nav pills */}
      {lesson.sections.length > 1 && (
        <div className="flex gap-1.5 flex-wrap mb-6">
          {lesson.sections.map((section, i) => (
            <button
              key={section.id}
              onClick={() =>
                sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className={cn(
                "text-xs px-2.5 py-1 rounded-full transition-colors",
                i === activeSection
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {i + 1}. {section.title}
            </button>
          ))}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8 pb-32">
        {lesson.sections.map((section, i) => (
          <motion.div
            key={section.id}
            ref={(el) => { sectionRefs.current[i] = el }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-500 shrink-0" />
              {section.title}
            </h2>
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {prevLesson && (
            <Link
              href={`/lesson/${prevLesson.id}`}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Prev
            </Link>
          )}
          <div className="flex-1">
            {!completed ? (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {completing ? (
                  "Marking complete…"
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Complete (+20 XP)
                  </>
                )}
              </button>
            ) : (
              <div className="w-full py-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium rounded-lg flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
          {nextLesson && (
            <Link
              href={`/lesson/${nextLesson.id}`}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* XP animation */}
      {showXp && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-sky-600 text-white font-bold px-4 py-2 rounded-full shadow-lg text-sm z-50"
        >
          +20 XP ✈️
        </motion.div>
      )}

      <AIChatButton lessonContext={lesson.title} />
    </div>
  )
}
