import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import AchievementsClient from "@/components/achievements/AchievementsClient"

export default async function AchievementsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const flags = await db.userFeatureFlags.findUnique({ where: { userId } })
  if (!flags?.achievementsUnlocked) redirect("/dashboard")

  const allAchievements = await db.achievement.findMany({
    orderBy: { category: "asc" },
  })

  const earned = await db.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true, earnedAt: true },
  })
  const earnedMap = new Map(earned.map((e) => [e.achievementId, e.earnedAt]))

  const achievements = allAchievements.map((a) => ({
    ...a,
    earned: earnedMap.has(a.id),
    earnedAt: earnedMap.get(a.id) ?? null,
  }))

  return <AchievementsClient achievements={achievements} />
}
