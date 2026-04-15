import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import ProfileClient from "@/components/profile/ProfileClient"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  })
  if (!user) redirect("/login")

  const onboarding = await db.userOnboarding.findUnique({ where: { userId } })

  const allTracks = await db.track.findMany({ orderBy: { sortOrder: "asc" } })
  const userTracks = await db.userTrack.findMany({
    where: { userId },
    include: { track: true },
  })
  const userTrackMap = new Map(userTracks.map((ut) => [ut.trackId, ut]))

  const tracksData = allTracks.map((t) => {
    const ut = userTrackMap.get(t.id)
    return {
      id: t.id,
      name: t.name,
      icon: t.icon,
      slug: t.slug,
      isUnlocked: ut?.isUnlocked ?? false,
      isActive: ut?.isActive ?? false,
    }
  })

  return (
    <ProfileClient
      user={user}
      tracks={tracksData}
      dailyGoalMinutes={onboarding?.dailyGoalMinutes ?? 15}
      trainingStage={onboarding?.trainingStage ?? null}
    />
  )
}
