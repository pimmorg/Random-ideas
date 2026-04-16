"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"

const PHASES = [
  {
    name: "1. Normal",
    icon: "✅",
    color: "#22c55e",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-200 dark:border-emerald-800",
    aoa: 8,
    liftH: 56,
    flowKey: "smooth",
    title: "Normal Flight — ~8° AoA",
    body: "Airflow stays smoothly attached to the entire upper wing surface. The fast-moving air above creates low pressure — this pressure difference between upper and lower surfaces is what generates lift. All four forces are balanced.",
    alert: null,
    alertStyle: "",
  },
  {
    name: "2. High AoA",
    icon: "🔔",
    color: "#f97316",
    bg: "bg-orange-50 dark:bg-orange-950",
    border: "border-orange-200 dark:border-orange-800",
    aoa: 15,
    liftH: 66,
    flowKey: "separating",
    title: "Approaching Stall — ~15° AoA",
    body: "Lift is near its maximum, but airflow is beginning to detach from the trailing edge. The stall warning horn activates at approximately 5–10 knots above stall speed. Back pressure is holding the nose high.",
    alert: "🔔 Stall warning — horn sounding",
    alertStyle: "bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-100",
  },
  {
    name: "3. Stall",
    icon: "⚠️",
    color: "#ef4444",
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    aoa: 20,
    liftH: 14,
    flowKey: "separated",
    title: "Full Stall — Critical AoA Exceeded",
    body: "Airflow has completely separated from the upper surface. Lift collapses. The aircraft buffets and the nose pitches down. This can happen at ANY airspeed — it is purely a function of angle of attack, not speed.",
    alert: "⚠️ STALL — Lift has collapsed",
    alertStyle: "bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100",
  },
  {
    name: "4. Recovery",
    icon: "💙",
    color: "#0ea5e9",
    bg: "bg-sky-50 dark:bg-sky-950",
    border: "border-sky-200 dark:border-sky-800",
    aoa: 5,
    liftH: 46,
    flowKey: "reattaching",
    title: "Recovery — AoA Reduced",
    body: "Forward pressure reduces angle of attack. Full power minimizes altitude loss. Rudder levels the wings. Airflow reattaches from the leading edge back and lift returns. Act promptly — every second matters.",
    alert: "✅ Pitch → Power → Rudder",
    alertStyle: "bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-100",
  },
]

// Streamline paths for each airflow state — all use M C C format for smooth morphing
const FLOW: Record<string, Record<string, string>> = {
  smooth: {
    s1: "M 10,28 C 85,27 138,25 185,27 C 222,29 262,28 295,28",
    s2: "M 10,45 C 80,43 128,37 172,43 C 212,48 258,47 295,46",
    s3: "M 10,63 C 74,60 112,53 150,58 C 186,63 235,62 295,62",
    sub: "M 10,155 C 95,153 148,158 178,156 C 210,154 256,153 295,152",
  },
  separating: {
    s1: "M 10,28 C 85,27 138,25 185,27 C 222,29 262,28 295,28",
    s2: "M 10,45 C 80,43 128,37 172,43 C 212,48 255,51 295,53",
    s3: "M 10,63 C 74,60 108,52 145,57 C 180,62 218,71 295,74",
    sub: "M 10,155 C 95,153 148,158 178,156 C 210,154 256,153 295,152",
  },
  separated: {
    s1: "M 10,28 C 85,27 138,25 185,28 C 222,30 262,32 295,32",
    s2: "M 10,45 C 78,43 120,37 160,42 C 196,47 232,67 295,82",
    s3: "M 10,63 C 68,60 90,53 118,57 C 140,61 158,85 295,101",
    sub: "M 10,155 C 95,153 148,158 178,156 C 210,154 256,153 295,152",
  },
  reattaching: {
    s1: "M 10,28 C 85,27 138,25 185,27 C 222,29 262,28 295,28",
    s2: "M 10,45 C 80,43 128,38 172,44 C 212,49 258,47 295,47",
    s3: "M 10,63 C 74,60 114,54 152,60 C 188,65 236,63 295,62",
    sub: "M 10,155 C 95,153 148,158 178,156 C 210,154 256,153 295,152",
  },
}

export default function StallRecoveryDiagram() {
  const [active, setActive] = useState(0)
  const phase = PHASES[active]
  const flow = FLOW[phase.flowKey]
  const isStalled = phase.flowKey === "separated"

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center mb-1">
        Interactive: Stall Progression &amp; Recovery
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-4">
        Step through each phase to see what happens to airflow and lift
      </p>

      {/* Phase step buttons */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {PHASES.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActive(i)}
            className={`rounded-lg py-2 px-1 text-xs font-semibold transition-all border-2 ${
              active === i
                ? `${p.bg} ${p.border}`
                : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300"
            }`}
            style={{ color: active === i ? p.color : undefined }}
          >
            {p.icon} {p.name.split(". ")[1]}
          </button>
        ))}
      </div>

      {/* SVG diagram */}
      <div className="flex justify-center mb-4">
        <svg viewBox="0 0 300 190" className="w-full max-w-sm">
          <defs>
            <linearGradient id="stallSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.15" />
            </linearGradient>
            <marker id="wArrow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <path d="M 0 0 L 5 2.5 L 0 5" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Sky background */}
          <rect width="300" height="190" fill="url(#stallSky)" rx="12" />

          {/* Separation zone — stall only */}
          {isStalled && (
            <motion.rect
              x="125" y="35" width="140" height="82" rx="8"
              fill="#ef4444" opacity="0"
              animate={{ opacity: 0.07 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Relative wind label */}
          <text x="13" y="18" fontSize="7.5" fill="#94a3b8" fontStyle="italic">
            Relative wind →
          </text>

          {/* Animated wind arrows on left side */}
          <motion.g
            animate={{ x: [0, 24] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          >
            {[28, 45, 63, 155].map((y) => (
              <line
                key={y}
                x1="2" y1={y} x2="22" y2={y}
                stroke="#94a3b8" strokeWidth="1"
                markerEnd="url(#wArrow)"
              />
            ))}
          </motion.g>

          {/* Streamlines — morph between states */}
          {(["s1", "s2", "s3"] as const).map((key, idx) => {
            const color =
              isStalled && idx === 2
                ? "#ef4444"
                : isStalled && idx === 1
                ? "#f97316"
                : "#3b82f6"
            return (
              <motion.path
                key={key}
                fill="none"
                stroke={color}
                strokeWidth={idx === 2 ? 1.9 : 1.4}
                strokeDasharray={isStalled && idx >= 1 ? "6,3" : undefined}
                animate={{ d: flow[key] }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              />
            )
          })}
          <motion.path
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.4"
            animate={{ d: flow.sub }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />

          {/* Turbulence swirl indicators — stall only */}
          {isStalled &&
            [
              { cx: 174, cy: 67, r: 7, delay: 0 },
              { cx: 205, cy: 80, r: 6, delay: 0.25 },
              { cx: 235, cy: 68, r: 5, delay: 0.1 },
            ].map(({ cx, cy, r, delay }) => (
              <motion.circle
                key={cx}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.2"
                opacity="0.5"
                animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.3, 0.65, 0.3] }}
                transition={{ repeat: Infinity, duration: 0.85, delay }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            ))}

          {/* Airfoil — rotates around center point (150, 115) */}
          <g transform="translate(150, 115)">
            <motion.g
              animate={{ rotate: -phase.aoa }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              {/* Wing body — white filled airfoil shape */}
              <path
                d="M -65,0 C -38,-27 8,-30 65,0 C 14,13 -32,11 -65,0 Z"
                fill="white"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Chord line — dashed */}
              <line
                x1="-65" y1="0" x2="65" y2="0"
                stroke="#cbd5e1" strokeWidth="0.7" strokeDasharray="5,3"
              />
              {/* Leading edge dot */}
              <circle cx="-65" cy="0" r="2" fill="#475569" />
            </motion.g>
          </g>

          {/* Lift arrow — grows/shrinks with lift amount */}
          <line
            x1="150" y1="115"
            x2="150" y2={115 - phase.liftH}
            stroke={isStalled ? "#ef4444" : phase.color}
            strokeWidth="3"
          />
          <polygon
            points={`144,${115 - phase.liftH} 150,${115 - phase.liftH - 9} 156,${115 - phase.liftH}`}
            fill={isStalled ? "#ef4444" : phase.color}
          />
          <text
            x="160"
            y={115 - phase.liftH + 5}
            fontSize="9"
            fontWeight="700"
            fill={isStalled ? "#ef4444" : phase.color}
          >
            {isStalled ? "LIFT↓" : "LIFT"}
          </text>

          {/* AoA angle label near leading edge */}
          <motion.text
            x="78"
            y="96"
            fontSize="9"
            fontWeight="700"
            fill="#f472b6"
            textAnchor="middle"
            animate={{ opacity: 1 }}
          >
            {phase.aoa}°
          </motion.text>

          {/* STALL flash */}
          {isStalled && (
            <motion.text
              x="150" y="24"
              textAnchor="middle"
              fontSize="13"
              fontWeight="900"
              fill="#ef4444"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ repeat: Infinity, duration: 0.55 }}
            >
              ⚠ STALL
            </motion.text>
          )}
        </svg>
      </div>

      {/* Description panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className={`rounded-xl p-3 border ${phase.bg} ${phase.border} mb-3`}
        >
          <div className="text-sm font-bold mb-1" style={{ color: phase.color }}>
            {phase.title}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
            {phase.body}
          </p>
          {phase.alert && (
            <div className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg ${phase.alertStyle}`}>
              {phase.alert}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <button
        onClick={() => setActive((active + 1) % 4)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Next phase <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
