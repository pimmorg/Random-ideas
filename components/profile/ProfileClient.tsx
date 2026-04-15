"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Settings, LogOut, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Track {
  id: string
  name: string
  icon: string
  slug: string
  isUnlocked: boolean
  isActive: boolean
}

interface ProfileClientProps {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    createdAt: Date
  }
  tracks: Track[]
  dailyGoalMinutes: number
  trainingStage: string | null
}

const GOAL_OPTIONS = [5, 10, 15, 30]

export default function ProfileClient({
  user,
  tracks,
  dailyGoalMinutes,
  trainingStage,
}: ProfileClientProps) {
  const router = useRouter()
  const [goal, setGoal] = useState(dailyGoalMinutes)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const saveGoal = async (minutes: number) => {
    setSaving(true)
    await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyGoalMinutes: minutes }),
    })
    setGoal(minutes)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const unlockTrack = async (trackId: string) => {
    await fetch("/api/tracks/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId }),
    })
    router.refresh()
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile & Settings</h1>

      {/* User info */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center text-sky-700 dark:text-sky-300 text-xl font-bold">
            {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {user.name ?? "Pilot"}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
            <div className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Daily goal */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Daily Study Goal
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {GOAL_OPTIONS.map((mins) => (
            <button
              key={mins}
              onClick={() => saveGoal(mins)}
              disabled={saving}
              className={cn(
                "py-2 rounded-lg text-sm font-medium transition-colors",
                goal === mins
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {mins}m
            </button>
          ))}
        </div>
        {saved && (
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <Check className="w-3 h-3" /> Saved
          </p>
        )}
      </div>

      {/* Active tracks */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Active Certifications
        </h2>
        <div className="space-y-2">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{track.icon}</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {track.name}
                </span>
              </div>
              {track.isActive ? (
                <span className="text-xs bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 px-2 py-0.5 rounded-full font-medium">
                  Active
                </span>
              ) : track.isUnlocked ? (
                <span className="text-xs text-slate-400">Unlocked</span>
              ) : (
                <button
                  onClick={() => unlockTrack(track.id)}
                  className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-600 mt-3">
          Add certifications to your study plan from Settings, or they unlock automatically as you progress.
        </p>
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>

      <p className="text-xs text-center text-slate-400 dark:text-slate-500 px-4">
        SkySchool is a study aid only. It does not satisfy FAA training requirements or replace a certified flight instructor.
      </p>
    </div>
  )
}
