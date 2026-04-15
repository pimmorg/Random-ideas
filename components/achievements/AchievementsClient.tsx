"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  xpReward: number
  category: string
  earned: boolean
  earnedAt: Date | null
}

export default function AchievementsClient({
  achievements,
}: {
  achievements: Achievement[]
}) {
  const categories = [...new Set(achievements.map((a) => a.category))]
  const earnedCount = achievements.filter((a) => a.earned).length

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {earnedCount} / {achievements.length} earned
        </p>
      </div>

      {/* Progress */}
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(earnedCount / achievements.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-yellow-400 rounded-full"
        />
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3 capitalize">
            {category}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {achievements
              .filter((a) => a.category === category)
              .map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border transition-all",
                    a.earned
                      ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60"
                  )}
                >
                  <span className={cn("text-3xl", !a.earned && "grayscale opacity-40")}>
                    {a.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      {a.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {a.description}
                    </div>
                    {a.earned && a.earnedAt && (
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-medium">
                        ✓ Earned {new Date(a.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                    {!a.earned && (
                      <div className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                        +{a.xpReward} XP when earned
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
