"use client"

import { motion } from "framer-motion"

export default function FourForcesDiagram() {
  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-sky-50 to-white dark:from-sky-950 dark:to-slate-900 p-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-center mb-3">
        The Four Forces in Equilibrium
      </h3>

      <div className="flex items-center justify-center">
        <svg viewBox="0 0 320 210" className="w-full max-w-sm">
          <defs>
            <linearGradient id="ffSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
            {/* One arrow marker per color — orient=auto rotates to match line direction */}
            <marker id="ffBlue"   markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M 0 0 L 8 3 L 0 6 Z" fill="#0ea5e9" />
            </marker>
            <marker id="ffRed"    markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M 0 0 L 8 3 L 0 6 Z" fill="#ef4444" />
            </marker>
            <marker id="ffGreen"  markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M 0 0 L 8 3 L 0 6 Z" fill="#22c55e" />
            </marker>
            <marker id="ffOrange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M 0 0 L 8 3 L 0 6 Z" fill="#f97316" />
            </marker>
          </defs>

          {/* Sky background */}
          <rect width="320" height="210" fill="url(#ffSky)" rx="12" />

          {/* Ground */}
          <rect x="0" y="188" width="320" height="22" fill="#dcfce7" />
          <line x1="0" y1="188" x2="320" y2="188" stroke="#86efac" strokeWidth="2" />

          {/* ── Aircraft — side-view silhouette, nose pointing RIGHT ── */}

          {/* Fuselage */}
          <path
            d="M 246,108
               C 228,99 203,96 172,95
               L 138,95
               L 106,100
               L 100,108
               L 106,116
               L 172,121
               C 203,120 228,117 246,108 Z"
            fill="#1e293b"
          />

          {/* Main wing — high-wing, sits on top of fuselage */}
          <path
            d="M 150,95 L 166,95 L 226,87 L 221,90 L 166,91 L 150,91 Z"
            fill="#334155"
          />

          {/* Vertical stabilizer at tail */}
          <path d="M 100,108 L 102,87 L 119,99 Z" fill="#334155" />

          {/* Horizontal stabilizer at tail */}
          <path d="M 102,108 L 78,106 L 78,111 L 102,111 Z" fill="#334155" />

          {/* Cockpit windows */}
          <path
            d="M 180,95 L 207,95 L 212,104 L 180,104 Z"
            fill="#7dd3fc"
            opacity="0.75"
          />

          {/* Propeller — vertical line at nose */}
          <line x1="249" y1="93" x2="249" y2="123"
            stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" opacity="0.45" />

          {/* ── Force arrows ── */}

          {/* LIFT — up from wing */}
          <motion.g
            initial={{ y: 5, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.2, ease: "easeInOut" }}
          >
            <line x1="183" y1="87" x2="183" y2="31"
              stroke="#0ea5e9" strokeWidth="2.5" markerEnd="url(#ffBlue)" />
            <text x="189" y="56" fontSize="10" fontWeight="700" fill="#0ea5e9">LIFT</text>
          </motion.g>

          {/* WEIGHT — down from center of gravity */}
          <motion.g
            initial={{ y: -5, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.2, ease: "easeInOut", delay: 0.3 }}
          >
            <line x1="173" y1="122" x2="173" y2="179"
              stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#ffRed)" />
            <text x="179" y="161" fontSize="10" fontWeight="700" fill="#ef4444">WEIGHT</text>
          </motion.g>

          {/* THRUST — forward / rightward from propeller */}
          <motion.g
            initial={{ x: -5, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.4, ease: "easeInOut", delay: 0.1 }}
          >
            <line x1="253" y1="108" x2="303" y2="108"
              stroke="#22c55e" strokeWidth="2.5" markerEnd="url(#ffGreen)" />
            <text x="255" y="100" fontSize="10" fontWeight="700" fill="#22c55e">THRUST</text>
          </motion.g>

          {/* DRAG — rearward / leftward from tail */}
          <motion.g
            initial={{ x: 5, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.4, ease: "easeInOut", delay: 0.4 }}
          >
            <line x1="76" y1="108" x2="34" y2="108"
              stroke="#f97316" strokeWidth="2.5" markerEnd="url(#ffOrange)" />
            <text x="36" y="100" fontSize="10" fontWeight="700" fill="#f97316">DRAG</text>
          </motion.g>
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {[
          { color: "#0ea5e9", label: "Lift",   desc: "Upward aerodynamic force" },
          { color: "#ef4444", label: "Weight", desc: "Gravity pulling down" },
          { color: "#22c55e", label: "Thrust", desc: "Engine pushing forward" },
          { color: "#f97316", label: "Drag",   desc: "Aerodynamic resistance" },
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
