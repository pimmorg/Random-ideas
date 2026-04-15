import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import OnboardingWizard from "@/components/onboarding/OnboardingWizard"

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const onboarding = await db.userOnboarding.findUnique({
    where: { userId: session.user.id },
  })

  if (onboarding?.completed) {
    redirect("/dashboard")
  }

  return (
    <OnboardingWizard
      userId={session.user.id}
      userName={session.user.name ?? undefined}
      currentStep={onboarding?.currentStep ?? 0}
    />
  )
}
