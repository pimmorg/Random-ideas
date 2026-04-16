import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: {
    default: "SkySchool",
    template: "%s | SkySchool",
  },
  description: "Your student pilot study platform.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] px-4">
      {/* Aviation branding header */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Plane icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 text-blue-500 group-hover:text-blue-400 transition-colors"
            aria-hidden="true"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
          <span className="text-3xl font-bold tracking-tight text-white group-hover:text-blue-100 transition-colors">
            SkySchool
          </span>
        </Link>
        <p className="text-sm text-blue-400/80 tracking-wide uppercase font-medium">
          Student Pilot Study Platform
        </p>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer */}
      <p className="mt-8 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SkySchool. Safe skies ahead.
      </p>
    </div>
  )
}
