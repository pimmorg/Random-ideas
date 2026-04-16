"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, ZapOff, Battery } from "lucide-react"

interface Load {
  id: string
  name: string
  amps: number
  essential: boolean
  description: string
  icon: string
}

const LOADS: Load[] = [
  { id: "comm1",     name: "Comm Radio 1",      amps: 5,  essential: true,  icon: "📻", description: "Required to talk to ATC and other aircraft. Keep this." },
  { id: "nav",       name: "GPS / Nav",          amps: 3,  essential: true,  icon: "🗺️", description: "Keep one nav source to find an airport." },
  { id: "transponder", name: "Transponder",      amps: 2,  essential: true,  icon: "📡", description: "ATC needs your squawk to find you. Keep it on." },
  { id: "comm2",     name: "Comm Radio 2",       amps: 5,  essential: false, icon: "📻", description: "Redundant with Comm 1. Shed this to save amps." },
  { id: "pitotheat", name: "Pitot Heat",         amps: 6,  essential: false, icon: "🌡️", description: "Only essential in icing conditions. Shed if clear." },
  { id: "landing",   name: "Landing Light",      amps: 7,  essential: false, icon: "💡", description: "Very high draw. Shed immediately — use at landing only." },
  { id: "strobes",   name: "Strobes",            amps: 2,  essential: false, icon: "⚡", description: "Anti-collision — desirable, but sheddable if needed." },
  { id: "navlights", name: "Nav Lights",         amps: 3,  essential: false, icon: "🔴", description: "Required at night. Shed only in daylight emergency." },
  { id: "autopilot", name: "Autopilot",          amps: 4,  essential: false, icon: "🤖", description: "High draw. Hand-fly and shed this." },
  { id: "cabin",     name: "Cabin / Panel Lights", amps: 2, essential: false, icon: "🔆", description: "Shed at night only if absolutely necessary — you need to see." },
]

const BATTERY_AMP_HOURS = 35 // typical 12V 35Ah battery

export default function AlternatorFailureDiagram() {
  const [failed, setFailed] = useState(false)
  const [shed, setShed] = useState<Set<string>>(new Set())

  const toggleShed = (id: string) => {
    setShed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalAmps = LOADS.reduce((sum, l) => sum + l.amps, 0)
  const activeAmps = LOADS.filter((l) => !shed.has(l.id)).reduce((sum, l) => sum + l.amps, 0)
  const enduranceMinutes = Math.round((BATTERY_AMP_HOURS / activeAmps) * 60)

  const enduranceColor =
    enduranceMinutes >= 45
      ? "#22c55e"
      : enduranceMinutes >= 25
      ? "#f97316"
      : "#ef4444"

  const enduranceLabel =
    enduranceMinutes >= 45
      ? "Good"
      : enduranceMinutes >= 25
      ? "Marginal"
      : "Critical"

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
          Interactive: Alternator Failure — Load Shedding
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-0.5">
          Simulate an in-flight alternator failure and manage your battery load
        </p>
      </div>

      {/* Big failure toggle */}
      <div className="px-4 pb-4 flex flex-col items-center gap-3">
        <button
          onClick={() => {
            setFailed((f) => !f)
            if (!failed) {
              // Auto-shed obvious non-essentials when failure triggered
              setShed(new Set(["landing", "comm2", "autopilot"]))
            } else {
              setShed(new Set())
            }
          }}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            failed
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {failed ? (
            <>
              <ZapOff className="w-4 h-4" />
              ALTERNATOR FAILED — Battery running down
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Normal Operation — Click to simulate failure
            </>
          )}
        </button>

        <AnimatePresence>
          {failed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full overflow-hidden"
            >
              {/* Battery endurance display */}
              <div className="rounded-xl border-2 p-3 mb-3 flex items-center gap-4"
                style={{ borderColor: enduranceColor }}>
                <Battery className="w-8 h-8 shrink-0" style={{ color: enduranceColor }} />
                <div className="flex-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Est. battery endurance</div>
                  <div className="text-2xl font-bold" style={{ color: enduranceColor }}>
                    ~{enduranceMinutes} min
                  </div>
                  <div className="text-xs font-semibold" style={{ color: enduranceColor }}>
                    {enduranceLabel} — {activeAmps}A draw / {totalAmps}A normal
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 dark:text-slate-500 shrink-0">
                  <div>{shed.size} loads</div>
                  <div>shed</div>
                </div>
              </div>

              <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 mb-3">
                ⚠️ Tap each load below to shed it and extend battery life. Keep essential navigation and communication equipment ON.
              </p>

              {/* Load list */}
              <div className="space-y-1.5">
                {LOADS.map((load) => {
                  const isShed = shed.has(load.id)
                  return (
                    <motion.button
                      key={load.id}
                      layout
                      onClick={() => !load.essential && toggleShed(load.id)}
                      disabled={load.essential}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
                        load.essential
                          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 cursor-default"
                          : isShed
                          ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-50"
                          : "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950 hover:border-orange-400"
                      }`}
                    >
                      {/* Status dot */}
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          load.essential
                            ? "bg-emerald-500"
                            : isShed
                            ? "bg-slate-300 dark:bg-slate-600"
                            : "bg-orange-400"
                        }`}
                      />

                      {/* Icon + name */}
                      <span className="text-base shrink-0">{load.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold ${isShed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                          {load.name}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 leading-tight">
                          {load.description}
                        </div>
                      </div>

                      {/* Amps badge */}
                      <div className={`text-xs font-mono px-2 py-0.5 rounded shrink-0 ${
                        isShed
                          ? "bg-slate-100 dark:bg-slate-700 text-slate-400"
                          : load.essential
                          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                          : "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                      }`}>
                        {isShed ? "OFF" : `${load.amps}A`}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-center">
                Green = essential / keep ON &nbsp;·&nbsp; Orange = shed to extend endurance
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
