"use client"

import { motion } from "framer-motion"

export default function FourForcesDiagram() {
  return (
    <div className="my-6 rounded-2xl border border-sky-100 dark:border-sky-900 bg-gradient-to-b from-sky-50 to-white dark:from-sky-950 dark:to-slate-900 p-4">
      <h3 className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide text-center mb-3">
        The Four Forces in Equilibrium
      </h3>
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 320 220" className="w-full max-w-sm">
          {/* Sky background */}
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
          </defs>
          <rect width="320" height="220" fill="url(#sky)" rx="12" />

          {/* Ground line */}
          <line x1="0" y1="195" x2="320" y2="195" stroke="#86efac" strokeWidth="3" />
          <rect x="0" y="195" width="320" height="25" fill="#dcfce7" rx="0" />

          {/* Aircraft body */}
          <g transform="translate(160, 110)">
            {/* Fuselage */}
            <ellipse cx="0" cy="0" rx="38" ry="11" fill="#1e293b" />
            {/* Wings */}
            <polygon points="-8,-4 -8,4 -55,14 -55,8" fill="#334155" />
            <polygon points="8,-4 8,4 55,14 55,8" fill="#334155" />
            {/* Tail */}
            <polygon points="-30,-3 -38,-3 -48,-14 -38,-3" fill="#334155" />
            <polygon points="-30,3 -38,3 -45,10 -38,3" fill="#334155" />
            {/* Cockpit */}
            <ellipse cx="14" cy="-4" rx="10" ry="6" fill="#7dd3fc" opacity="0.8" />
            {/* Propeller */}
            <ellipse cx="38" cy="-8" rx="3" ry="9" fill="#64748b" transform="rotate(-20,38,-8)" />
            <ellipse cx="38" cy="8" rx="3" ry="9" fill="#64748b" transform="rotate(-20,38,8)" />
          </g>

          {/* LIFT arrow - up */}
          <motion.g
            initial={{ y: 4, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.2, ease: "easeInOut" }}
          >
            <line x1="160" y1="100" x2="160" y2="42" stroke="#0ea5e9" strokeWidth="3" markerEnd="url(#arrowUp)" />
            <text x="172" y="65" fontSize="11" fontWeight="700" fill="#0ea5e9">LIFT</text>
          </motion.g>

          {/* WEIGHT arrow - down */}
          <motion.g
            initial={{ y: -4, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.2, ease: "easeInOut", delay: 0.3 }}
          >
            <line x1="160" y1="120" x2="160" y2="178" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowDown)" />
            <text x="168" y="162" fontSize="11" fontWeight="700" fill="#ef4444">WEIGHT</text>
          </motion.g>

          {/* THRUST arrow - right */}
          <motion.g
            initial={{ x: -4, opacity: 0.7 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.4, ease: "easeInOut", delay: 0.1 }}
          >
            <line x1="205" y1="110" x2="270" y2="110" stroke="#22c55e" strokeWidth="3" markerEnd="url(#arrowRight)" />
            <text x="228" y="100" fontSize="11" fontWeight="700" fill="#22c55e">THRUST</text>
          </motion.g>

          {/* DRAG arrow - left */}
          <motion.g
            initial={{ x: 4, opacity: 0.7 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.4, ease: "easeInOut", delay: 0.4 }}
          >
            <line x1="115" y1="110" x2="50" y2="110" stroke="#f97316" strokeWidth="3" markerEnd="url(#arrowLeft)" />
            <text x="54" y="100" fontSize="11" fontWeight="700" fill="#f97316">DRAG</text>
          </motion.g>

          {/* Arrow markers */}
          <defs>
            <marker id="arrowUp" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 0 8 L 4 0 L 8 8" fill="#0ea5e9" />
            </marker>
            <marker id="arrowDown" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
              <path d="M 0 0 L 4 8 L 8 0" fill="#ef4444" />
            </marker>
            <marker id="arrowRight" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8" fill="#22c55e" />
            </marker>
            <marker id="arrowLeft" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
              <path d="M 8 0 L 0 4 L 8 8" fill="#f97316" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {[
          { color: "#0ea5e9", label: "Lift", desc: "Upward aerodynamic force" },
          { color: "#ef4444", label: "Weight", desc: "Gravity pulling down" },
          { color: "#22c55e", label: "Thrust", desc: "Engine pulling forward" },
          { color: "#f97316", label: "Drag", desc: "Aerodynamic resistance" },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
            <div>
              <span className="font-semibold" style={{ color: f.color }}>{f.label}</span>
              <span className="text-slate-500 dark:text-slate-400"> — {f.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
