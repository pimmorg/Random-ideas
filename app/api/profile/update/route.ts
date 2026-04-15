import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { dailyGoalMinutes } = await req.json()

  await db.userOnboarding.updateMany({
    where: { userId: session.user.id },
    data: { dailyGoalMinutes },
  })

  return NextResponse.json({ success: true })
}
