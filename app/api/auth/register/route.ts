import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/db"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input"
      return Response.json({ error: message }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    // Check if a user with this email already exists
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and feature flags in a transaction
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })

      await tx.userFeatureFlags.create({
        data: {
          userId: newUser.id,
        },
      })

      return newUser
    })

    return Response.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("[register] Unexpected error:", error)
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
