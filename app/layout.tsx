import type { Metadata } from "next"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

export const metadata: Metadata = {
  title: {
    default: "SkySchool — Pilot Study Platform",
    template: "%s | SkySchool",
  },
  description: "A structured, gamified study platform for student pilots. From Private Pilot to ATP — master aviation knowledge one lesson at a time.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
