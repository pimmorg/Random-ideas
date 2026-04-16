"use client"

import { useState, useEffect, useMemo } from "react"

const CX = 150
const CY = 120
const R = 76
const AIRSPEED = 90
const BASE_BANK = 25

// φ = position angle, increases CCW-from-above (left-turn orbit)
// 0 = north side, 90 = west side, 180 = south side, 270 = east side
function getStats(φDeg: number, windKts: number) {
  const φRad = (φDeg * Math.PI) / 180
  // Wind from north (blows south). At heading H, wind component = -windKts*cos(H).
  // For CCW-above orbit: heading = 270 - φ, so cos(270-φ) = -sin(φ)
  // → windComponent = -windKts * (-sin(φ)) = windKts * sin(φ)
  const gs = Math.max(AIRSPEED + windKts * Math.sin(φRad), 30)
  const bankRad = Math.atan(Math.tan((BASE_BANK * Math.PI) / 180) * (gs / AIRSPEED) ** 2)
  return { gs, bankDeg: (bankRad * 180) / Math.PI }
}

function bankColor(bank: number): string {
  const r = bank / BASE_BANK
  if (r < 0.85) return "#22c55e"
  if (r < 1.08) return "#3b82f6"
  if (r < 1.30) return "#f97316"
  return "#ef4444"
}

function bankLabel(bank: number): string {
  const r = bank / BASE_BANK
  if (r < 0.85) return "Shallow"
  if (r < 1.08) return "Normal"
  if (r < 1.30) return "Steeper"
  return "Steepest"
}

export default function TurnsAroundPointDiagram() {
  const [windKts, setWindKts] = useState(15)
  const [phi, setPhi] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    let lastT = 0
    let raf: number
    const tick = (t: number) => {
      if (lastT > 0) setPhi(p => (p + 30 * (t - lastT) / 1000) % 360)
      lastT = t
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  // 72 colored arc segments — recompute when wind changes
  const segs = useMemo(() =>
    Array.from({ length: 72 }, (_, i) => {
      const φ0r = (i * 5 * Math.PI) / 180
      const φ1r = ((i + 1) * 5 * Math.PI) / 180
      const φmid = i * 5 + 2.5
      const { bankDeg } = getStats(φmid, windKts)
      return {
        x1: CX - R * Math.sin(φ0r), y1: CY - R * Math.cos(φ0r),
        x2: CX - R * Math.sin(φ1r), y2: CY - R * Math.cos(φ1r),
        color: bankColor(bankDeg),
      }
    }), [windKts])

  const { gs, bankDeg } = getStats(phi, windKts)
  const φR = (phi * Math.PI) / 180
  const ax = CX - R * Math.sin(φR)
  const ay = CY - R * Math.cos(φR)
  const hdg = (270 - phi + 720) % 360
  const color = bankColor(bankDeg)

  // Min bank = heading into wind (φ=270, east side); max bank = heading downwind (φ=90, west side)
  const minBank = getStats(270, windKts).bankDeg
  const maxBank = getStats(90, windKts).bankDeg

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center mb-1">
        Interactive: Turns Around a Point
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-3">
        Wind forces the pilot to continuously vary bank — steeper downwind, shallower upwind
      </p>

      <div className="flex justify-center mb-2">
        <svg viewBox="0 0 300 236" className="w-full max-w-sm">
          <defs>
            <radialGradient id="tapBg" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#dcfce7" stopOpacity="0.45" />
            </radialGradient>
            <marker id="tapWArr" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <path d="M0 0 L5 2.5 L0 5" fill="#64748b" />
            </marker>
          </defs>

          <rect width="300" height="236" fill="url(#tapBg)" rx="12" />

          {/* Compass labels */}
          {(["N","E","S","W"] as const).map((label, i) => {
            const tr = (i * 90 * Math.PI) / 180
            const r2 = R + 18
            return (
              <text key={label}
                x={CX + r2 * Math.sin(tr)}
                y={CY - r2 * Math.cos(tr) + 3.5}
                fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="700"
              >{label}</text>
            )
          })}

          {/* Wind indicator — left side column, clear of compass N label */}
          {windKts > 0 && (
            <g transform="translate(22, 52)">
              <text x="0" y="0" fontSize="6" fill="#64748b" textAnchor="middle" fontStyle="italic">Wind</text>
              <text x="0" y="9" fontSize="6" fill="#64748b" textAnchor="middle" fontStyle="italic">from N</text>
              <line x1="0" y1="13" x2="0" y2="35" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#tapWArr)" />
              <text x="0" y="47" fontSize="7.5" fill="#64748b" textAnchor="middle" fontWeight="600">{windKts}kt</text>
            </g>
          )}
          {windKts === 0 && (
            <text x="22" y="76" fontSize="6.5" fill="#94a3b8" textAnchor="middle" fontStyle="italic">No{"\n"}wind</text>
          )}

          {/* Colored orbit segments */}
          {segs.map((s, i) => (
            <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={s.color} strokeWidth="7" strokeLinecap="round" opacity="0.72" />
          ))}

          {/* Ground reference point */}
          <circle cx={CX} cy={CY} r="5" fill="#7c3aed" />
          <circle cx={CX} cy={CY} r="2" fill="white" />
          <text x={CX + 8} y={CY + 3} fontSize="7" fill="#7c3aed" fontWeight="700">GRP</text>

          {/* Aircraft top-down silhouette */}
          <g transform={`translate(${ax}, ${ay}) rotate(${hdg})`}>
            {/* Fuselage */}
            <ellipse cx="0" cy="0" rx="2.5" ry="6.5" fill="#0f172a" />
            {/* Wings */}
            <rect x="-9.5" y="-0.5" width="19" height="2.8" rx="1.4" fill="#1e293b" />
            {/* Horizontal stabilizer */}
            <rect x="-5" y="4.2" width="10" height="2" rx="1" fill="#334155" />
          </g>

          {/* Bank angle badge — positioned to avoid orbit */}
          <text
            x={ax > CX + 8 ? Math.min(ax + 12, 286) : Math.max(ax - 12, 14)}
            y={ay > CY + 8 ? ay + 13 : ay < CY - 8 ? ay - 5 : ay + 13}
            fontSize="9.5" fontWeight="800" fill={color}
            textAnchor={ax > CX + 8 ? "start" : "end"}
          >
            {Math.round(bankDeg)}°
          </text>
        </svg>
      </div>

      {/* Legend row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mb-3">
        {[
          { c: "#22c55e", l: "Shallow (upwind)" },
          { c: "#3b82f6", l: "Base bank" },
          { c: "#f97316", l: "Steeper" },
          { c: "#ef4444", l: "Steepest (downwind)" },
        ].map(({ c, l }) => (
          <span key={l} className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c }} />
            {l}
          </span>
        ))}
      </div>

      {/* Wind slider */}
      <div className="px-2 mb-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Calm</span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">Wind: {windKts} kts</span>
          <span>25 kts</span>
        </div>
        <input
          type="range" min={0} max={25} value={windKts}
          onChange={e => setWindKts(Number(e.target.value))}
          className="w-full accent-purple-600"
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-xl border p-2.5 text-center transition-colors"
          style={{ borderColor: color + "44", backgroundColor: color + "0e" }}>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Current Bank</div>
          <div className="text-xl font-bold" style={{ color }}>{Math.round(bankDeg)}°</div>
          <div className="text-xs font-medium" style={{ color: color + "cc" }}>{bankLabel(bankDeg)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Groundspeed</div>
          <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{Math.round(gs)}</div>
          <div className="text-xs text-slate-400">kts</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Bank Range</div>
          <div className="text-xl font-bold text-slate-700 dark:text-slate-300">
            {windKts === 0 ? `${BASE_BANK}°` : `${Math.round(minBank)}–${Math.round(maxBank)}°`}
          </div>
          <div className="text-xs text-slate-400">{windKts === 0 ? "constant" : "min – max"}</div>
        </div>
      </div>

      {/* Play / Pause */}
      <button
        onClick={() => setPlaying(p => !p)}
        className="w-full py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-3"
      >
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>

      {/* Explanation */}
      <div className="rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 px-3 py-2 text-xs text-purple-800 dark:text-purple-200">
        {windKts === 0
          ? "No wind — bank angle stays constant throughout the orbit. Theoretical ideal: no wind correction needed."
          : `With ${windKts} kts from the north, bank ranges from ~${Math.round(minBank)}° (heading into wind) to ~${Math.round(maxBank)}° (heading downwind) — a ${Math.round(maxBank - minBank)}° spread. The pilot adjusts continuously to keep the radius constant over the ground.`}
      </div>
    </div>
  )
}
