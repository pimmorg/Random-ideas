"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"

export default function SteepTurnDiagram() {
  const [bank, setBank] = useState(45)

  const stats = useMemo(() => {
    const rad = (bank * Math.PI) / 180
    const cosB = Math.cos(rad)
    const loadFactor = cosB > 0.01 ? 1 / cosB : 99
    const verticalLiftPct = cosB * 100
    const stallSpeedMult = Math.sqrt(loadFactor)
    return { loadFactor, verticalLiftPct, stallSpeedMult }
  }, [bank])

  const dangerLevel =
    bank >= 70 ? "critical" : bank >= 55 ? "warning" : "normal"

  // Arrow lengths — total lift grows with bank to show pilot must increase lift
  const liftLength = 60 + bank * 0.6
  const rad = (bank * Math.PI) / 180
  const vertLen = liftLength * Math.cos(rad)
  const horizLen = liftLength * Math.sin(rad)

  // Load factor reference line positions (from center y=120, going up)
  // 1G baseline = vertLen at 0° bank = 60px
  const baseLen = 60 // lift length at 0° bank
  const g1Y = 120 - baseLen
  const g2Y = 120 - baseLen * 2
  const g38Y = 120 - baseLen * 3.8

  return (
    <div className="my-6 rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950 dark:to-slate-900 p-4 overflow-hidden">
      <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-center mb-1">
        Interactive: Bank Angle &amp; Vertical Lift
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-4">
        Drag the slider to see how banking affects the vertical component of lift
      </p>

      {/* SVG Diagram */}
      <div className="flex justify-center mb-4">
        <svg viewBox="0 0 300 240" className="w-full max-w-sm">
          <defs>
            <linearGradient id="skyBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.1" />
            </linearGradient>
            {/* Wing gradient — white to light gray for a 3D feel */}
            <linearGradient id="wingTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          <rect width="300" height="240" fill="url(#skyBg)" rx="12" />

          {/* Horizon line */}
          <line x1="0" y1="175" x2="300" y2="175" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6,3" />
          <text x="290" y="170" fontSize="8" fill="#94a3b8" textAnchor="end">horizon</text>

          {/* ── Load Factor Reference Lines ── */}
          {/* 1G line */}
          <line x1="20" y1={g1Y} x2="280" y2={g1Y} stroke="#6366f1" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.5" />
          <text x="283" y={g1Y + 3} fontSize="7" fill="#6366f1" opacity="0.7" fontWeight="600">1G</text>

          {/* 2G line */}
          {g2Y > 5 && (
            <>
              <line x1="20" y1={g2Y} x2="280" y2={g2Y} stroke="#f97316" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.5" />
              <text x="283" y={g2Y + 3} fontSize="7" fill="#f97316" opacity="0.7" fontWeight="600">2G</text>
            </>
          )}

          {/* 3.8G structural limit line */}
          {g38Y > 5 && (
            <>
              <line x1="20" y1={g38Y} x2="280" y2={g38Y} stroke="#ef4444" strokeWidth="1" strokeDasharray="2,3" opacity="0.6" />
              <text x="283" y={g38Y + 3} fontSize="7" fill="#ef4444" opacity="0.8" fontWeight="700">3.8G</text>
              <text x="17" y={g38Y + 3} fontSize="6" fill="#ef4444" opacity="0.6" textAnchor="end">LIMIT</text>
            </>
          )}

          {/* ── CENTER POINT: 150, 120 ── */}
          <g transform="translate(150, 120)">

            {/* Weight arrow — always straight down */}
            <line x1="0" y1="5" x2="0" y2="55" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4,3" />
            <polygon points="-5,55 0,63 5,55" fill="#ef4444" />
            <text x="8" y="58" fontSize="10" fontWeight="700" fill="#ef4444">W</text>

            {/* ── Rotating group: aircraft + total lift ── */}
            <g transform={`rotate(${-bank})`}>

              {/* Total lift arrow */}
              <line x1="0" y1="-5" x2="0" y2={-liftLength} stroke="#22c55e" strokeWidth="3" />
              <polygon points={`-5,${-liftLength} 0,${-liftLength - 8} 5,${-liftLength}`} fill="#22c55e" />
              <text
                x="8" y={-liftLength + 5} fontSize="9" fontWeight="700" fill="#22c55e"
                transform={`rotate(${bank}, 8, ${-liftLength + 5})`}
              >
                Total Lift
              </text>

              {/* ── Aircraft (front view) ── */}
              {/* Fuselage — rounded dark body */}
              <ellipse cx="0" cy="0" rx="7" ry="12" fill="#334155" />
              <ellipse cx="0" cy="-1" rx="6" ry="9" fill="#475569" />

              {/* Left wing — solid white airfoil shape */}
              <polygon
                points="-7,-1 -62,3 -64,5 -60,6 -7,3"
                fill="url(#wingTop)" stroke="#94a3b8" strokeWidth="0.8"
              />
              {/* Left wingtip light (red) */}
              <circle cx="-63" cy="4" r="2" fill="#ef4444" opacity="0.9" />

              {/* Right wing — solid white airfoil shape */}
              <polygon
                points="7,-1 62,3 64,5 60,6 7,3"
                fill="url(#wingTop)" stroke="#94a3b8" strokeWidth="0.8"
              />
              {/* Right wingtip light (green) */}
              <circle cx="63" cy="4" r="2" fill="#22c55e" opacity="0.9" />

              {/* Windshield */}
              <ellipse cx="0" cy="-5" rx="4.5" ry="3.5" fill="#7dd3fc" opacity="0.85" />

              {/* Vertical stabilizer hint */}
              <rect x="-1" y="-12" width="2" height="6" rx="1" fill="#475569" />
            </g>

            {/* ── Vertical component — dashed blue, always straight up ── */}
            <line x1="0" y1="-5" x2="0" y2={-vertLen} stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5,3" />
            {vertLen > 15 && (
              <polygon points={`-4,${-vertLen} 0,${-vertLen - 7} 4,${-vertLen}`} fill="#3b82f6" />
            )}
            {vertLen > 22 && (
              <text x="-8" y={-vertLen + 5} fontSize="9" fontWeight="700" fill="#3b82f6" textAnchor="end">
                {Math.round(stats.verticalLiftPct)}%
              </text>
            )}

            {/* ── Horizontal component — dashed orange, horizontal ── */}
            {horizLen > 5 && (
              <>
                <line x1="5" y1="0" x2={horizLen} y2="0" stroke="#f97316" strokeWidth="2.5" strokeDasharray="5,3" />
                <polygon points={`${horizLen},-4 ${horizLen + 7},0 ${horizLen},4`} fill="#f97316" />
                {horizLen > 18 && (
                  <text x={horizLen / 2 + 3} y="-7" fontSize="8" fontWeight="700" fill="#f97316" textAnchor="middle">
                    Horiz: {Math.round(100 - stats.verticalLiftPct)}%
                  </text>
                )}
              </>
            )}

            {/* Right-angle indicator between vertical and horizontal components */}
            {bank > 8 && bank < 72 && (
              <rect
                x="1" y={-10} width="8" height="8"
                fill="none" stroke="#94a3b8" strokeWidth="0.7" opacity="0.6"
              />
            )}
          </g>

          {/* Legend */}
          <g transform="translate(8, 12)">
            <line x1="0" y1="0" x2="14" y2="0" stroke="#22c55e" strokeWidth="2.5" />
            <text x="18" y="4" fontSize="8" fill="#64748b">Total Lift</text>
            <line x1="0" y1="12" x2="14" y2="12" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
            <text x="18" y="16" fontSize="8" fill="#64748b">Vertical Component</text>
            <line x1="0" y1="24" x2="14" y2="24" stroke="#f97316" strokeWidth="2" strokeDasharray="4,2" />
            <text x="18" y="28" fontSize="8" fill="#64748b">Horizontal Component</text>
            <line x1="0" y1="36" x2="14" y2="36" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
            <text x="18" y="40" fontSize="8" fill="#64748b">Weight</text>
          </g>
        </svg>
      </div>

      {/* Slider */}
      <div className="px-2 mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>0° (wings level)</span>
          <span
            className="font-bold"
            style={{
              color: dangerLevel === "critical" ? "#ef4444" : dangerLevel === "warning" ? "#f97316" : "#6366f1",
            }}
          >
            Bank: {bank}°
          </span>
          <span className="text-red-400 font-semibold">75°</span>
        </div>
        <input
          type="range"
          min={0}
          max={75}
          value={bank}
          onChange={(e) => setBank(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-300 dark:text-slate-600 px-0.5 mt-0.5">
          {[0, 15, 30, 45, 60, 75].map((t) => (
            <span key={t} className={bank === t ? "text-indigo-500 font-bold" : ""}>|</span>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 px-0">
          <span>0°</span>
          <span>15°</span>
          <span>30°</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">45°</span>
          <span>60°</span>
          <span>75°</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatCard
          label="Load Factor"
          value={`${stats.loadFactor.toFixed(1)}G`}
          danger={dangerLevel}
          sublabel={stats.loadFactor > 3.8 ? "LIMIT!" : stats.loadFactor > 2 ? "High" : "Normal"}
        />
        <StatCard
          label="Vertical Lift"
          value={`${Math.round(stats.verticalLiftPct)}%`}
          danger={stats.verticalLiftPct < 50 ? "critical" : stats.verticalLiftPct < 75 ? "warning" : "normal"}
          sublabel={stats.verticalLiftPct < 50 ? "Losing altitude fast" : stats.verticalLiftPct < 75 ? "Add back pressure" : "Supporting weight"}
        />
        <StatCard
          label="Stall Speed"
          value={`×${stats.stallSpeedMult.toFixed(2)}`}
          danger={stats.stallSpeedMult > 1.6 ? "critical" : stats.stallSpeedMult > 1.3 ? "warning" : "normal"}
          sublabel={stats.stallSpeedMult > 1.4 ? "Much higher!" : stats.stallSpeedMult > 1.1 ? "Increased" : "Near normal"}
        />
      </div>

      {/* Context message */}
      <motion.div
        key={dangerLevel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-lg px-3 py-2 text-xs font-medium text-center ${
          dangerLevel === "critical"
            ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
            : dangerLevel === "warning"
            ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
            : "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
        }`}
      >
        {bank === 0
          ? "Wings level — all lift supports the aircraft's weight"
          : bank <= 30
          ? "Shallow bank — minimal altitude loss, standard turns in the pattern"
          : bank <= 50
          ? "PPL steep turn standard is 45° ±5° — load factor is ~1.4G and stall speed increases ~19%"
          : bank <= 65
          ? "60° bank doubles the load factor to 2G — the aircraft feels twice as heavy and will lose altitude rapidly without adding back pressure and power"
          : "Extreme bank — structural limit of most GA aircraft is 3.8G. At 75° the aircraft cannot maintain altitude without exceeding normal category limits."}
      </motion.div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sublabel,
  danger,
}: {
  label: string
  value: string
  sublabel: string
  danger: "normal" | "warning" | "critical"
}) {
  const color =
    danger === "critical" ? "#ef4444" : danger === "warning" ? "#f97316" : "#6366f1"

  return (
    <div
      className="rounded-xl border p-2.5 text-center transition-colors"
      style={{ borderColor: color + "40", backgroundColor: color + "08" }}
    >
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</div>
      <div className="text-xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs mt-0.5" style={{ color: color + "cc" }}>
        {sublabel}
      </div>
    </div>
  )
}
