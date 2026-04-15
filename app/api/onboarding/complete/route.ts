import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const body = await req.json()
  const { trainingStage, followUpAnswer, dailyGoalMinutes, trackSlug, showAll } = body

  // Upsert onboarding record
  await db.userOnboarding.upsert({
    where: { userId },
    update: {
      trainingStage,
      groundSchoolStatus: followUpAnswer,
      dailyGoalMinutes: dailyGoalMinutes ?? 15,
      completed: true,
      currentStep: 4,
    },
    create: {
      userId,
      trainingStage,
      groundSchoolStatus: followUpAnswer,
      dailyGoalMinutes: dailyGoalMinutes ?? 15,
      completed: true,
      currentStep: 4,
    },
  })

  // Ensure feature flags record exists
  await db.userFeatureFlags.upsert({
    where: { userId },
    update: {},
    create: { userId },
  })

  // Find and unlock the starting track
  const track = await db.track.findUnique({ where: { slug: trackSlug } })
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 })
  }

  await db.userTrack.upsert({
    where: { userId_trackId: { userId, trackId: track.id } },
    update: { isActive: true, isUnlocked: true, unlockedAt: new Date() },
    create: {
      userId,
      trackId: track.id,
      isActive: true,
      isUnlocked: true,
      unlockedAt: new Date(),
    },
  })

  // If show_all, unlock all tracks
  if (showAll) {
    const allTracks = await db.track.findMany()
    for (const t of allTracks) {
      await db.userTrack.upsert({
        where: { userId_trackId: { userId, trackId: t.id } },
        update: { isUnlocked: true, unlockedAt: new Date() },
        create: {
          userId,
          trackId: t.id,
          isActive: t.id === track.id,
          isUnlocked: true,
          unlockedAt: new Date(),
        },
      })
    }
  }

  return NextResponse.json({ success: true })
}
