import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import JourneyClient from "@/components/journey/JourneyClient"

export default async function JourneyPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const tracks = await db.track.findMany({
    orderBy: { sortOrder: "asc" },
  })

  const userTracks = await db.userTrack.findMany({
    where: { userId },
  })
  const userTrackMap = new Map(userTracks.map((ut) => [ut.trackId, ut]))

  const tracksWithStatus = tracks.map((t) => {
    const ut = userTrackMap.get(t.id)
    return {
      id: t.id,
      slug: t.slug,
      name: t.name,
      shortName: t.shortName,
      description: t.description,
      icon: t.icon,
      sortOrder: t.sortOrder,
      isUnlocked: ut?.isUnlocked ?? false,
      isActive: ut?.isActive ?? false,
      completionPercent: ut?.completionPercent ?? 0,
    }
  })

  const activeTrack = tracksWithStatus.find((t) => t.isActive)

  return (
    <JourneyClient
      tracks={tracksWithStatus}
      activeTrackId={activeTrack?.id ?? null}
    />
  )
}
