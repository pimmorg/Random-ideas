import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const { trackId } = await req.json()

  await db.userTrack.upsert({
    where: { userId_trackId: { userId, trackId } },
    update: { isUnlocked: true, unlockedAt: new Date() },
    create: {
      userId,
      trackId,
      isUnlocked: true,
      isActive: false,
      unlockedAt: new Date(),
    },
  })

  return NextResponse.json({ success: true })
}
