"use client"

import { motion } from "framer-motion"
import { Lock, CheckCircle2, Plane } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrackInfo {
  id: string
  slug: string
  name: string
  shortName: string
  description: string
  icon: string
  sortOrder: number
  isUnlocked: boolean
  isActive: boolean
  completionPercent: number
}

interface JourneyClientProps {
  tracks: TrackInfo[]
  activeTrackId: string | null
}

// The "ideal" pilot progression path
const PROGRESSION = ["ppl", "ir", "cpl", "me", "cfi", "atp"]

export default function JourneyClient({ tracks, activeTrackId }: JourneyClientProps) {
  const orderedTracks = [...tracks].sort((a, b) => {
    const ai = PROGRESSION.indexOf(a.slug)
    const bi = PROGRESSION.indexOf(b.slug)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Journey</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Your full pilot certification roadmap
        </p>
      </div>

      {/* Journey path */}
      <div className="relative">
        {/* Vertical connector */}
        <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-4">
          {orderedTracks.map((track, index) => {
            const isActive = track.id === activeTrackId
            const isCompleted = track.completionPercent >= 100

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                className={cn(
                  "relative flex items-start gap-4 pl-0",
                )}
              >
                {/* Node */}
                <div
                  className={cn(
                    "relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 transition-all",
                    isActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-sm shadow-blue-200 dark:shadow-blue-900"
                      : isCompleted
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950"
                      : track.isUnlocked
                      ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 opacity-50"
                  )}
                >
                  <span className={cn(!track.isUnlocked && !isActive && "grayscale opacity-60")}>
                    {track.icon}
                  </span>
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {!track.isUnlocked && !isActive && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Plane className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <h3
                      className={cn(
                        "font-semibold",
                        isActive
                          ? "text-blue-700 dark:text-blue-300"
                          : track.isUnlocked
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400 dark:text-slate-600"
                      )}
                    >
                      {track.name}
                    </h3>
                    {isActive && (
                      <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                        Complete
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm mt-0.5",
                      track.isUnlocked
                        ? "text-slate-500 dark:text-slate-400"
                        : "text-slate-300 dark:text-slate-700"
                    )}
                  >
                    {track.description}
                  </p>
                  {track.isUnlocked && track.completionPercent > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full max-w-[120px]">
                        <div
                          className="h-full bg-blue-400 rounded-full"
                          style={{ width: `${track.completionPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {Math.round(track.completionPercent)}%
                      </span>
                    </div>
                  )}
                  {!track.isUnlocked && (
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                      Complete your current track to unlock
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-center text-slate-400 dark:text-slate-600 px-4">
        SkySchool is a study aid. It does not satisfy FAA training requirements. Always train with a certified flight instructor.
      </p>
    </div>
  )
}
