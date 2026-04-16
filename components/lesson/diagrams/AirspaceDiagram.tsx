"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type ClassId = "A" | "B" | "C" | "D" | "E" | "G"

interface AirspaceClass {
  id: ClassId
  label: string
  color: string
  altDesc: string
  entry: string
  radio: string
  equipment: string
  wxDay: string
  wxNight: string
  notes: string
}

const CLASSES: AirspaceClass[] = [
  {
    id: "A",
    label: "Class A",
    color: "#1e40af",
    altDesc: "FL180 (18,000 ft MSL) to FL600",
    entry: "IFR clearance required — no VFR operations permitted",
    radio: "Yes — IFR clearance (ATC contact mandatory)",
    equipment: "IFR avionics, transponder + Mode C, ADS-B Out",
    wxDay: "IFR only — VFR cloud/visibility minimums do not apply",
    wxNight: "IFR only",
    notes: "Covers the entire continental US above FL180. All operations are conducted under IFR regardless of actual weather conditions. Pilots need an instrument rating.",
  },
  {
    id: "B",
    label: "Class B",
    color: "#0369a1",
    altDesc: "Surface to 10,000 ft MSL — 'upside-down wedding cake' shape, 3 shelves",
    entry: "Explicit ATC clearance: must hear 'Cleared into Class Bravo'",
    radio: "Yes — explicit clearance required before entry (not just contact)",
    equipment: "Mode C transponder, 2-way radio, ADS-B Out",
    wxDay: "3 SM visibility, clear of clouds",
    wxNight: "3 SM visibility, clear of clouds",
    notes: "Surrounds the 37 busiest US airports (ORD, LAX, ATL, JFK…). Student pilots need a logbook endorsement to fly in most Class B. Speed limit: 250 KIAS below 10,000 ft; 200 KIAS within 4 nm / 2,500 ft of primary airport.",
  },
  {
    id: "C",
    label: "Class C",
    color: "#86198f",
    altDesc: "Inner (0–5 nm): surface to 4,000 AGL · Outer (5–10 nm): 1,200 AGL to 4,000 AGL",
    entry: "Two-way radio contact established — ATC must acknowledge your call sign",
    radio: "Yes — 'N12345, standby' counts; a flat 'unable' does NOT",
    equipment: "Mode C transponder, 2-way radio, ADS-B Out",
    wxDay: "3 SM · 500 below / 1,000 above / 2,000 horiz from clouds",
    wxNight: "3 SM · 500 below / 1,000 above / 2,000 horiz",
    notes: "Surrounds medium-traffic airports with an operating tower and radar. Shown as two magenta circles on a sectional chart. The key distinction from Class B: you don't need an explicit clearance — just established communication.",
  },
  {
    id: "D",
    label: "Class D",
    color: "#1d4ed8",
    altDesc: "Surface to ~2,500 ft AGL · ~4.4 nm radius",
    entry: "Two-way radio contact established with the tower",
    radio: "Yes — 'N12345, 3 miles north, landing' before entry",
    equipment: "2-way radio only (no transponder required by airspace class alone)",
    wxDay: "3 SM · 500 below / 1,000 above / 2,000 horiz",
    wxNight: "3 SM · 500 below / 1,000 above / 2,000 horiz",
    notes: "Surrounds smaller towered airports. Shown as a blue dashed circle on the sectional. When the tower closes, Class D reverts to Class E (or G) — different rules apply. Check NOTAMs and airport info for tower hours.",
  },
  {
    id: "E",
    label: "Class E",
    color: "#7e22ce",
    altDesc: "Various floors: 700 AGL (transition areas near airports), 1,200 AGL (general), or surface (some airports)",
    entry: "No clearance required for VFR flight",
    radio: "No",
    equipment: "Transponder + ADS-B Out above 10,000 MSL and in Class E surface areas",
    wxDay: "Below 10,000: 3 SM · 500/1,000/2,000 cloud clearance",
    wxNight: "3 SM · 500 below / 1,000 above / 2,000 horiz",
    notes: "Class E is all controlled airspace not classified A–D. It provides IFR separation without requiring VFR pilots to call ATC. The magenta vignette (fuzzy edge) on sectionals marks a 700 AGL transition area protecting instrument approaches.",
  },
  {
    id: "G",
    label: "Class G",
    color: "#475569",
    altDesc: "Surface to base of Class E (typically 700 or 1,200 AGL). Above 14,500 MSL in some remote areas.",
    entry: "No clearance, no communication required",
    radio: "No",
    equipment: "None for VFR",
    wxDay: "Below 1,200 AGL: 1 SM, clear of clouds · Above 1,200 AGL: 1 SM, 500/1,000/2,000",
    wxNight: "3 SM · 500 below / 1,000 above / 2,000 horiz",
    notes: "Uncontrolled airspace — no ATC separation provided. Daytime VFR minimum of 1 SM 'clear of clouds' is the most permissive in the system. Not shown on sectionals; it's the absence of depicted airspace.",
  },
]

// Altitude → SVG y coordinate. Surface = y 172, FL180 = y 26.
const altToY = (ft: number) => 172 - (ft / 18000) * 146

// Horizontal scale: 5px per nm, centered at x=150
const nm = (n: number, side: "L" | "R") => (side === "R" ? 150 + n * 5 : 150 - n * 5)

const Y_A   = altToY(18000) // 26   FL180
const Y_10K = altToY(10000) // 91
const Y_7K  = altToY(7000)  // 115
const Y_4K  = altToY(4000)  // 140
const Y_3K  = altToY(3000)  // 148
const Y_25K = altToY(2500)  // 152
const Y_12K = altToY(1200)  // 162
const Y_700 = altToY(700)   // 166
const Y_SFC = altToY(0)     // 172

export default function AirspaceDiagram() {
  const [sel, setSel] = useState<ClassId>("B")
  const cls = CLASSES.find(c => c.id === sel)!
  const s = (id: ClassId) => id === sel

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center mb-1">
        Interactive: Airspace Classification
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-3">
        Select a class to see altitude limits, entry rules, and weather minimums
      </p>

      {/* Class selector */}
      <div className="grid grid-cols-6 gap-1.5 mb-3">
        {CLASSES.map(c => (
          <button
            key={c.id}
            onClick={() => setSel(c.id)}
            className={`rounded-lg py-2 text-sm font-black border-2 transition-all ${
              sel === c.id ? "text-white" : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300"
            }`}
            style={sel === c.id ? { backgroundColor: c.color, borderColor: c.color } : undefined}
          >
            {c.id}
          </button>
        ))}
      </div>

      {/* Cross-section SVG */}
      <div className="flex justify-center mb-3">
        <svg viewBox="0 0 300 200" className="w-full max-w-sm">
          <defs>
            <linearGradient id="airSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="300" height="200" fill="url(#airSky)" rx="12" />
          {/* Ground band */}
          <rect x="0" y={Y_SFC} width="300" height={200 - Y_SFC} fill="#bbf7d0" opacity="0.45" />
          <line x1="0" y1={Y_SFC} x2="300" y2={Y_SFC} stroke="#6b7280" strokeWidth="1" />

          {/* ── Class A ── top band above FL180 */}
          <rect x="0" y="2" width="300" height={Y_A - 2}
            fill={s("A") ? "#1e3a8a" : "#94a3b8"} opacity={s("A") ? 0.28 : 0.07} />
          {s("A") && <rect x="0" y="2" width="300" height={Y_A - 2} fill="none" stroke="#1e3a8a" strokeWidth="2" />}
          <text x="150" y={Y_A - 5} fontSize="6.5" fill={s("A") ? "#1e3a8a" : "#94a3b8"} textAnchor="middle" fontWeight="700">
            CLASS A
          </text>

          {/* ── Class B ── stepped wedding cake */}
          {/* Outer shelf: ±20nm, 7k–10k */}
          <rect x={nm(20,"L")} y={Y_10K} width={nm(20,"R") - nm(20,"L")} height={Y_7K - Y_10K}
            fill={s("B") ? "#0369a1" : "#94a3b8"} opacity={s("B") ? 0.28 : 0.07} />
          {/* Middle shelf: ±10nm, 3k–10k */}
          <rect x={nm(10,"L")} y={Y_10K} width={nm(10,"R") - nm(10,"L")} height={Y_3K - Y_10K}
            fill={s("B") ? "#0369a1" : "#94a3b8"} opacity={s("B") ? 0.28 : 0.07} />
          {/* Inner: ±5nm, sfc–10k */}
          <rect x={nm(5,"L")} y={Y_10K} width={nm(5,"R") - nm(5,"L")} height={Y_SFC - Y_10K}
            fill={s("B") ? "#0369a1" : "#94a3b8"} opacity={s("B") ? 0.28 : 0.07} />
          {s("B") && (
            <path
              d={`M${nm(20,"L")},${Y_10K} H${nm(20,"R")} V${Y_7K} H${nm(10,"R")} V${Y_3K} H${nm(5,"R")} V${Y_SFC} H${nm(5,"L")} V${Y_3K} H${nm(10,"L")} V${Y_7K} H${nm(20,"L")} Z`}
              fill="none" stroke="#0369a1" strokeWidth="1.8"
            />
          )}

          {/* ── Class C ── two rings */}
          {/* Inner: ±5nm, sfc–4k */}
          <rect x={nm(5,"L")} y={Y_4K} width={nm(5,"R") - nm(5,"L")} height={Y_SFC - Y_4K}
            fill={s("C") ? "#86198f" : "#94a3b8"} opacity={s("C") ? 0.28 : 0.07} />
          {/* Outer left: 5–10nm, 1200–4k */}
          <rect x={nm(10,"L")} y={Y_4K} width={nm(5,"L") - nm(10,"L")} height={Y_12K - Y_4K}
            fill={s("C") ? "#86198f" : "#94a3b8"} opacity={s("C") ? 0.28 : 0.07} />
          {/* Outer right: 5–10nm, 1200–4k */}
          <rect x={nm(5,"R")} y={Y_4K} width={nm(10,"R") - nm(5,"R")} height={Y_12K - Y_4K}
            fill={s("C") ? "#86198f" : "#94a3b8"} opacity={s("C") ? 0.28 : 0.07} />
          {s("C") && (
            <>
              <rect x={nm(5,"L")} y={Y_4K} width={nm(5,"R") - nm(5,"L")} height={Y_SFC - Y_4K}
                fill="none" stroke="#86198f" strokeWidth="1.8" />
              <path
                d={`M${nm(10,"L")},${Y_12K} H${nm(10,"R")} V${Y_4K} H${nm(5,"R")} M${nm(5,"L")},${Y_4K} H${nm(10,"L")} V${Y_12K}`}
                fill="none" stroke="#86198f" strokeWidth="1.8" strokeDasharray="5,3" />
            </>
          )}

          {/* ── Class D ── single dashed ring */}
          <rect x={nm(4.4,"L")} y={Y_25K} width={nm(4.4,"R") - nm(4.4,"L")} height={Y_SFC - Y_25K}
            fill={s("D") ? "#1d4ed8" : "#94a3b8"} opacity={s("D") ? 0.22 : 0.06} />
          {s("D") && (
            <rect x={nm(4.4,"L")} y={Y_25K} width={nm(4.4,"R") - nm(4.4,"L")} height={Y_SFC - Y_25K}
              fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeDasharray="6,3" />
          )}

          {/* ── Class E ── shown as side strips (1,200 AGL floor away from airport) */}
          {/* Left side */}
          <rect x="0" y={Y_A} width={nm(20,"L")} height={Y_12K - Y_A}
            fill={s("E") ? "#7e22ce" : "#c084fc"} opacity={s("E") ? 0.15 : 0.04} />
          {/* Right side */}
          <rect x={nm(20,"R")} y={Y_A} width={300 - nm(20,"R")} height={Y_12K - Y_A}
            fill={s("E") ? "#7e22ce" : "#c084fc"} opacity={s("E") ? 0.15 : 0.04} />
          {/* 700 AGL transition band near airport (between D and C, above 700 AGL) */}
          <rect x={nm(10,"L")} y={Y_A} width={nm(20,"L") - nm(10,"L")} height={Y_700 - Y_A}
            fill={s("E") ? "#7e22ce" : "#c084fc"} opacity={s("E") ? 0.15 : 0.04} />
          <rect x={nm(10,"R")} y={Y_A} width={nm(20,"R") - nm(10,"R")} height={Y_700 - Y_A}
            fill={s("E") ? "#7e22ce" : "#c084fc"} opacity={s("E") ? 0.15 : 0.04} />
          {s("E") && (
            <>
              <line x1="0" y1={Y_12K} x2={nm(20,"L")} y2={Y_12K} stroke="#7e22ce" strokeWidth="1" strokeDasharray="3,3" opacity="0.8" />
              <line x1={nm(20,"R")} y1={Y_12K} x2="300" y2={Y_12K} stroke="#7e22ce" strokeWidth="1" strokeDasharray="3,3" opacity="0.8" />
              <text x="6" y={Y_12K - 3} fontSize="6" fill="#7e22ce" fontWeight="600">1,200 AGL</text>
              <line x1={nm(10,"L")} y1={Y_700} x2={nm(10,"R")} y2={Y_700} stroke="#7e22ce" strokeWidth="1" strokeDasharray="3,3" opacity="0.8" />
              <text x={nm(10,"L") + 2} y={Y_700 - 3} fontSize="6" fill="#7e22ce" fontWeight="600">700 AGL</text>
            </>
          )}

          {/* ── Class G ── thin surface band beyond other airspace */}
          <rect x="0" y={Y_700} width={nm(10,"L")} height={Y_SFC - Y_700}
            fill={s("G") ? "#475569" : "#94a3b8"} opacity={s("G") ? 0.22 : 0.06} />
          <rect x={nm(10,"R")} y={Y_700} width={300 - nm(10,"R")} height={Y_SFC - Y_700}
            fill={s("G") ? "#475569" : "#94a3b8"} opacity={s("G") ? 0.22 : 0.06} />
          {s("G") && (
            <>
              <rect x="0" y={Y_700} width={nm(10,"L")} height={Y_SFC - Y_700}
                fill="none" stroke="#475569" strokeWidth="1.5" />
              <rect x={nm(10,"R")} y={Y_700} width={300 - nm(10,"R")} height={Y_SFC - Y_700}
                fill="none" stroke="#475569" strokeWidth="1.5" />
              <text x="4" y={Y_SFC - 4} fontSize="6" fill="#475569" fontWeight="600">G</text>
              <text x={nm(10,"R") + 4} y={Y_SFC - 4} fontSize="6" fill="#475569" fontWeight="600">G</text>
            </>
          )}

          {/* ── Altitude reference lines & labels ── */}
          <line x1="0" y1={Y_A} x2="285" y2={Y_A} stroke="#1e3a8a" strokeWidth="0.7" strokeDasharray="4,3" opacity="0.35" />
          {[
            [Y_10K, "10,000"],
            [Y_4K,  "4,000"],
            [Y_25K, "2,500"],
            [Y_12K, "1,200"],
          ].map(([y, label]) => (
            <text key={label as string} x="296" y={(y as number) + 3.5} fontSize="6" fill="#94a3b8" textAnchor="end">
              {label}
            </text>
          ))}
          <text x="296" y={Y_A + 3.5} fontSize="6" fill="#94a3b8" textAnchor="end">FL180</text>
          <text x="296" y={Y_SFC - 1} fontSize="6" fill="#94a3b8" textAnchor="end">SFC</text>

          {/* ── Airport marker ── */}
          <circle cx="150" cy={Y_SFC} r="3.5" fill="none" stroke="#374151" strokeWidth="1.3" />
          <line x1="143" y1={Y_SFC} x2="157" y2={Y_SFC} stroke="#374151" strokeWidth="1.3" />
          <line x1="150" y1={Y_SFC - 7} x2="150" y2={Y_SFC + 7} stroke="#374151" strokeWidth="1.3" />
          <text x="150" y="196" fontSize="6" fill="#6b7280" textAnchor="middle">Airport</text>

          {/* ── Distance labels along bottom ── */}
          {[5, 10, 20].map(n2 => (
            <g key={n2}>
              <text x={nm(n2,"L") + 1} y="189" fontSize="5.5" fill="#94a3b8" textAnchor="middle">{n2}nm</text>
              <text x={nm(n2,"R") - 1} y="189" fontSize="5.5" fill="#94a3b8" textAnchor="middle">{n2}nm</text>
            </g>
          ))}

          {/* ── Selected class label in diagram ── */}
          {s("B") && <text x="150" y={Y_10K + 12} fontSize="7" fill="#0369a1" textAnchor="middle" fontWeight="800">B</text>}
          {s("C") && <text x="150" y={Y_4K + 12} fontSize="7" fill="#86198f" textAnchor="middle" fontWeight="800">C</text>}
          {s("D") && <text x="150" y={Y_25K + 12} fontSize="7" fill="#1d4ed8" textAnchor="middle" fontWeight="800">D</text>}
          {s("E") && <text x="18" y={Y_A + 24} fontSize="7" fill="#7e22ce" textAnchor="middle" fontWeight="800">E</text>}
          {s("G") && <text x="22" y={Y_700 + 12} fontSize="7" fill="#475569" textAnchor="middle" fontWeight="800">G</text>}
        </svg>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="rounded-xl border p-3"
          style={{ borderColor: cls.color + "44", backgroundColor: cls.color + "0e" }}
        >
          <div className="text-sm font-bold mb-2.5" style={{ color: cls.color }}>
            {cls.label}
          </div>

          <div className="space-y-1.5 text-xs mb-2.5">
            <InfoRow label="Altitude" value={cls.altDesc} />
            <InfoRow label="Entry" value={cls.entry} />
            <InfoRow label="Radio" value={cls.radio} />
            <InfoRow label="Equipment" value={cls.equipment} />
            <InfoRow label="VFR day wx" value={cls.wxDay} />
            <InfoRow label="VFR night wx" value={cls.wxNight} />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{cls.notes}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 font-semibold w-20 text-slate-500 dark:text-slate-400">{label}:</span>
      <span className="text-slate-800 dark:text-slate-200 leading-tight">{value}</span>
    </div>
  )
}
