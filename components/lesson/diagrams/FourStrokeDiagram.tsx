"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"

const STROKES = [
  {
    name: "1. Intake",
    color: "#0ea5e9",
    bg: "bg-sky-50 dark:bg-sky-950",
    border: "border-sky-200 dark:border-sky-800",
    icon: "⬇️",
    description: "Piston moves DOWN. Intake valve opens. Air/fuel mixture drawn into cylinder.",
    pistonY: 70,
    valveLeft: "open",
    valveRight: "closed",
  },
  {
    name: "2. Compression",
    color: "#f97316",
    bg: "bg-orange-50 dark:bg-orange-950",
    border: "border-orange-200 dark:border-orange-800",
    icon: "⬆️",
    description: "Both valves CLOSED. Piston moves UP. Mixture compressed to ~1/8 original volume.",
    pistonY: 20,
    valveLeft: "closed",
    valveRight: "closed",
  },
  {
    name: "3. Power",
    color: "#ef4444",
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    icon: "💥",
    description: "Spark plug fires. Mixture ignites. Expanding gases force piston DOWN — this is what turns the crankshaft.",
    pistonY: 70,
    valveLeft: "closed",
    valveRight: "closed",
  },
  {
    name: "4. Exhaust",
    color: "#8b5cf6",
    bg: "bg-purple-50 dark:bg-purple-950",
    border: "border-purple-200 dark:border-purple-800",
    icon: "💨",
    description: "Exhaust valve opens. Piston moves UP again. Burned gases pushed out. Cycle repeats.",
    pistonY: 20,
    valveLeft: "closed",
    valveRight: "open",
  },
]

export default function FourStrokeDiagram() {
  const [active, setActive] = useState(0)
  const stroke = STROKES[active]

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide text-center mb-4">
        Interactive: Four-Stroke Engine Cycle
      </h3>

      {/* Step buttons */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {STROKES.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActive(i)}
            className={`rounded-lg py-2 px-1 text-xs font-semibold transition-all border-2 ${
              active === i
                ? `${s.bg} ${s.border}`
                : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300"
            }`}
            style={{ color: active === i ? s.color : undefined }}
          >
            {s.icon} {s.name.split(". ")[1]}
          </button>
        ))}
      </div>

      {/* Cylinder animation */}
      <div className="flex gap-4 items-center">
        <div className="shrink-0">
          <svg viewBox="0 0 80 120" className="w-20">
            {/* Cylinder walls */}
            <rect x="15" y="10" width="50" height="90" rx="4" fill="none" stroke="#94a3b8" strokeWidth="3" />

            {/* Left valve (intake) */}
            <rect
              x="5" y="18" width="12" height="6"
              rx="2"
              fill={stroke.valveLeft === "open" ? "#22c55e" : "#64748b"}
            />

            {/* Right valve (exhaust) */}
            <rect
              x="63" y="18" width="12" height="6"
              rx="2"
              fill={stroke.valveRight === "open" ? "#8b5cf6" : "#64748b"}
            />

            {/* Spark plug */}
            <circle cx="40" cy="10" r="4" fill={active === 2 ? "#fbbf24" : "#94a3b8"} />
            {active === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.4 }}>
                <line x1="38" y1="15" x2="35" y2="22" stroke="#fbbf24" strokeWidth="2" />
                <line x1="42" y1="15" x2="45" y2="22" stroke="#fbbf24" strokeWidth="2" />
              </motion.g>
            )}

            {/* Piston */}
            <motion.g animate={{ y: stroke.pistonY - 20 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
              <rect x="16" y="10" width="48" height="18" rx="3" fill={stroke.color} opacity="0.9" />
              <text x="40" y="23" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">▐▌</text>
              {/* Connecting rod */}
              <line x1="40" y1="28" x2="40" y2="44" stroke="#94a3b8" strokeWidth="3" />
            </motion.g>

            {/* Crankshaft */}
            <circle cx="40" cy="108" r="10" fill="none" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="40" cy="108" r="3" fill="#94a3b8" />

            {/* Gas/mixture indicator */}
            {active === 0 && (
              <motion.text x="40" y="55" textAnchor="middle" fontSize="14"
                animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                💨
              </motion.text>
            )}
            {active === 2 && (
              <motion.text x="40" y="55" textAnchor="middle" fontSize="14"
                animate={{ scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 0.3 }}>
                🔥
              </motion.text>
            )}
          </svg>
        </div>

        {/* Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={`flex-1 rounded-xl p-3 border ${stroke.bg} ${stroke.border}`}
          >
            <div className="text-sm font-bold mb-1" style={{ color: stroke.color }}>
              {stroke.name}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {stroke.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      <button
        onClick={() => setActive((active + 1) % 4)}
        className="mt-3 w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Next stroke <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
