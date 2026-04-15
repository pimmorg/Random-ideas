import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import AppNav from "@/components/app/AppNav"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Check if onboarding is complete
  const onboarding = await db.userOnboarding.findUnique({
    where: { userId: session.user.id },
  })

  if (!onboarding?.completed) {
    redirect("/onboarding")
  }

  const flags = await db.userFeatureFlags.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppNav
        user={session.user}
        flags={{
          achievementsUnlocked: flags?.achievementsUnlocked ?? false,
          journeyMapUnlocked: flags?.journeyMapUnlocked ?? false,
          progressStatsUnlocked: flags?.progressStatsUnlocked ?? false,
        }}
      />
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
