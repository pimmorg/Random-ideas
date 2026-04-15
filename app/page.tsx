import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plane, BookOpen, Brain, Trophy, ArrowRight } from "lucide-react"

export default async function HomePage() {
  const session = await auth()

  if (session?.user?.id) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-sky-950 to-slate-950 text-white flex flex-col">
      {/* Nav */}
      <header className="max-w-5xl mx-auto w-full px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sky-400">
          <Plane className="w-5 h-5" />
          SkySchool
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm bg-sky-600 hover:bg-sky-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="text-6xl mb-4">✈️</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight max-w-2xl">
          Study smarter,{" "}
          <span className="text-sky-400">fly sooner.</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-xl mb-8 leading-relaxed">
          A structured, gamified study platform for student pilots. From Private Pilot to ATP — master aviation knowledge one lesson at a time.
        </p>
        <Link
          href="/register"
          className="flex items-center gap-2 px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-base transition-colors"
        >
          Start Learning Free <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-xs text-slate-500 mt-3">No credit card required</p>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-16 w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: <BookOpen className="w-6 h-6 text-sky-400" />,
              title: "ACS-Aligned Content",
              description: "Lessons and questions mapped to FAA Airman Certification Standards. Accurate, up-to-date, FAR/AIM referenced.",
            },
            {
              icon: <Brain className="w-6 h-6 text-purple-400" />,
              title: "AI Flight Instructor",
              description: "Ask anything. Your personal AI tutor explains complex concepts, gives real-world examples, and quizzes you on demand.",
            },
            {
              icon: <Trophy className="w-6 h-6 text-yellow-400" />,
              title: "Gamified Progress",
              description: "XP, streaks, mastery levels, and achievements keep you motivated. See your exam readiness score grow in real time.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-5 bg-white/5 rounded-2xl border border-white/10"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tracks */}
      <section className="max-w-4xl mx-auto px-4 pb-16 w-full">
        <h2 className="text-center text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">
          All Certifications Covered
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { icon: "✈️", name: "Private Pilot" },
            { icon: "🌧️", name: "Instrument Rating" },
            { icon: "💼", name: "Commercial Pilot" },
            { icon: "🛩️", name: "Multi-Engine" },
            { icon: "👨‍🏫", name: "CFI" },
            { icon: "🛫", name: "ATP" },
          ].map((track) => (
            <div
              key={track.name}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-sm text-slate-300"
            >
              <span>{track.icon}</span>
              {track.name}
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="text-center text-xs text-slate-600 pb-6 px-4">
        SkySchool is a study aid only. It does not satisfy FAA training requirements and does not replace a certified flight instructor.
      </footer>
    </main>
  )
}
