import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { lessonId } = await req.json()
  await db.bookmark.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: {},
    create: { userId: session.user.id, lessonId },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { lessonId } = await req.json()
  await db.bookmark.deleteMany({
    where: { userId: session.user.id, lessonId },
  })

  return NextResponse.json({ success: true })
}
