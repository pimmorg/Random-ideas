"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function AngleOfAttackDiagram() {
  const [aoa, setAoa] = useState(8) // degrees
  const isStalled = aoa >= 18
  const liftPercent = isStalled ? 60 : Math.min(100, (aoa / 16) * 100)

  return (
    <div className="my-6 rounded-2xl border border-purple-100 dark:border-purple-900 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 p-4">
      <h3 className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide text-center mb-1">
        Interactive: Angle of Attack
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-4">
        Drag the slider to change angle of attack
      </p>

      {/* Wing diagram */}
      <div className="flex justify-center mb-4">
        <svg viewBox="0 0 280 120" className="w-full max-w-xs">
          <defs>
            <linearGradient id="wingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <g transform={`rotate(${-aoa * 0.6}, 140, 60)`}>
            {/* Wing cross section (airfoil) */}
            <path
              d="M 60 60 Q 120 38 200 58 Q 220 62 230 65 Q 200 72 60 68 Z"
              fill="#7c3aed"
              opacity="0.85"
            />
            {/* Chord line */}
            <line x1="60" y1="64" x2="230" y2="62" stroke="#c4b5fd" strokeWidth="1.5" strokeDasharray="5,3" />
            <text x="130" y="56" fontSize="9" fill="#c4b5fd" textAnchor="middle">chord line</text>
          </g>

          {/* Relative wind arrow */}
          <motion.g animate={{ x: [-8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
            <line x1="10" y1="65" x2="55" y2="65" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#windArrow)" />
            <text x="12" y="58" fontSize="9" fill="#fbbf24" fontWeight="600">Relative Wind</text>
          </motion.g>

          {/* AoA arc */}
          <path
            d={`M 70 65 A 15 15 0 0 1 ${70 + 15 * Math.cos((-aoa * 0.6 * Math.PI) / 180)} ${65 + 15 * Math.sin((-aoa * 0.6 * Math.PI) / 180)}`}
            fill="none"
            stroke="#f472b6"
            strokeWidth="2"
          />
          <text x="85" y="60" fontSize="9" fill="#f472b6" fontWeight="700">{aoa}°</text>

          {/* Lift arrow (changes size with AoA) */}
          <motion.g animate={{ scaleY: liftPercent / 100 }} style={{ transformOrigin: "140px 60px" }}>
            <line
              x1="140"
              y1={isStalled ? 40 : 60 - liftPercent * 0.3}
              x2="140"
              y2="60"
              stroke={isStalled ? "#ef4444" : "#0ea5e9"}
              strokeWidth="3"
              markerStart="url(#liftArrow)"
            />
          </motion.g>

          <defs>
            <marker id="windArrow" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6" fill="#fbbf24" />
            </marker>
            <marker id="liftArrow" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto-start-reverse">
              <path d="M 0 6 L 3 0 L 6 6" fill={isStalled ? "#ef4444" : "#0ea5e9"} />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Slider */}
      <div className="px-2">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>0°</span>
          <span className="font-semibold" style={{ color: isStalled ? "#ef4444" : "#7c3aed" }}>
            AoA: {aoa}° {isStalled ? "⚠️ STALLED" : ""}
          </span>
          <span className="text-red-400 font-semibold">18° (stall)</span>
        </div>
        <input
          type="range"
          min={0}
          max={22}
          value={aoa}
          onChange={(e) => setAoa(Number(e.target.value))}
          className="w-full accent-purple-600"
        />
      </div>

      {/* Status */}
      <div className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium text-center ${
        isStalled
          ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
          : aoa > 12
          ? "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
          : "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300"
      }`}>
        {isStalled
          ? "Wing has exceeded critical AoA — airflow has separated. STALL!"
          : aoa > 12
          ? "Approaching critical AoA — stall warning may activate soon"
          : `Normal flight — lift is ${Math.round(liftPercent)}% of maximum`}
      </div>
    </div>
  )
}
