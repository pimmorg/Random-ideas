"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function AngleOfAttackDiagram() {
  const [aoa, setAoa] = useState(8)
  const isStalled = aoa >= 18
  const liftPct = isStalled ? 50 : Math.min(100, (aoa / 16) * 100)
  const liftHeight = 10 + liftPct * 0.42
  // Positive rotation in SVG = clockwise = leading edge (left) goes UP ✓
  const rotDeg = aoa * 0.75

  // AoA arc endpoint: sweep clockwise from horizontal by `aoa` degrees
  const arcR = 22
  const arcEndX = 68 + arcR * Math.cos((aoa * Math.PI) / 180)
  const arcEndY = 72 + arcR * Math.sin((aoa * Math.PI) / 180)

  const liftColor = isStalled ? "#ef4444" : "#0ea5e9"

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-sky-50 to-white dark:from-sky-950 dark:to-slate-900 p-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-center mb-1">
        Interactive: Angle of Attack
      </h3>
      <p className="text-xs text-slate-400 text-center mb-4">
        Drag the slider to change angle of attack
      </p>

      <div className="flex justify-center mb-4">
        <svg viewBox="0 0 280 135" className="w-full max-w-xs">
          <defs>
            <marker id="aoaWind" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M 0 0 L 7 3 L 0 6 Z" fill="#f59e0b" />
            </marker>
            <marker id="aoaLift" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M 0 0 L 7 3 L 0 6 Z" fill={liftColor} />
            </marker>
          </defs>

          {/* Background */}
          <rect width="280" height="135" fill="#f0f9ff" rx="10" />

          {/* ── Wing group — rotates around chord midpoint ── */}
          {/* Positive rotation = clockwise = leading edge (LEFT) goes UP */}
          <g transform={`rotate(${rotDeg}, 140, 72)`}>
            {/*
              Airfoil cross-section, side view:
              Leading edge = LEFT (x≈60), Trailing edge = RIGHT (x≈220)
              Top surface curves UP (lower y) — more camber than bottom
              Vertical tangent at leading edge for smooth rounded nose
            */}
            <path
              d="M 60,72
                 C 60,60 105,50 160,55
                 C 196,59 212,65 220,72
                 C 212,79 196,82 160,80
                 C 105,78 60,84 60,72 Z"
              fill="#334155"
            />
            {/* Chord line (leading edge → trailing edge, horizontal before rotation) */}
            <line
              x1="60" y1="72" x2="220" y2="72"
              stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="5,3"
            />
          </g>

          {/* ── Relative wind arrow — always horizontal ── */}
          <motion.g
            animate={{ x: [-7, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          >
            <line
              x1="6" y1="72" x2="52" y2="72"
              stroke="#f59e0b" strokeWidth="2.2" markerEnd="url(#aoaWind)"
            />
            <text x="7" y="65" fontSize="8.5" fill="#f59e0b" fontWeight="600">
              Relative Wind
            </text>
          </motion.g>

          {/* ── AoA arc — clockwise from horizontal to chord direction ── */}
          {aoa > 0 && (
            <>
              <path
                d={`M ${68 + arcR},72 A ${arcR} ${arcR} 0 0 1 ${arcEndX} ${arcEndY}`}
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.8"
              />
              <text
                x={68 + (arcR + 12) * Math.cos((aoa / 2) * Math.PI / 180)}
                y={72 + (arcR + 12) * Math.sin((aoa / 2) * Math.PI / 180) + 3}
                fontSize="9.5"
                fill="#a855f7"
                fontWeight="700"
                textAnchor="middle"
              >
                {aoa}°
              </text>
            </>
          )}

          {/* ── Lift arrow — upward from above the wing ── */}
          <motion.g
            animate={{ y: isStalled ? [0, 4, 0] : [3, 0, 3] }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
          >
            {/* Line goes upward — markerEnd places arrowhead at the top */}
            <line
              x1="152" y1={64 - liftHeight}
              x2="152" y2="62"
              stroke={liftColor}
              strokeWidth="2.5"
              markerEnd="url(#aoaLift)"
            />
            <text
              x="158"
              y={68 - liftHeight}
              fontSize="9"
              fill={liftColor}
              fontWeight="700"
            >
              LIFT
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Slider */}
      <div className="px-2">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>0°</span>
          <span className="font-semibold" style={{ color: isStalled ? "#ef4444" : "#0284c7" }}>
            AoA: {aoa}°{isStalled ? " ⚠️ STALLED" : ""}
          </span>
          <span className="text-red-400 font-semibold">18° (stall)</span>
        </div>
        <input
          type="range" min={0} max={22} value={aoa}
          onChange={(e) => setAoa(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      {/* Status */}
      <div className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium text-center ${
        isStalled
          ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
          : aoa > 12
          ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
          : "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300"
      }`}>
        {isStalled
          ? "Wing has exceeded critical AoA — airflow separated. STALL!"
          : aoa > 12
          ? `Approaching critical AoA — stall warning may activate soon`
          : `Normal flight — lift is ${Math.round(liftPct)}% of maximum`}
      </div>
    </div>
  )
}
