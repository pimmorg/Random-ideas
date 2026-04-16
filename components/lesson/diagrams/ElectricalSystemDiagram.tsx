"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ComponentData {
  id: string
  label: string
  sublabel: string
  icon: string
  color: string
  title: string
  body: string
  tip?: string
  tipType?: "warning" | "info"
}

const COMPONENTS: ComponentData[] = [
  {
    id: "battery",
    label: "Battery",
    sublabel: "12V / 35Ah",
    icon: "🔋",
    color: "#0ea5e9",
    title: "Battery",
    body: "The battery provides power for engine starting and acts as a backup if the alternator fails. Most training aircraft use a 12V or 24V sealed lead-acid battery mounted in the engine compartment.",
    tip: "With the alternator out, battery-only endurance is typically 20–30 minutes at normal electrical load. Shed all non-essential equipment immediately.",
    tipType: "warning",
  },
  {
    id: "alternator",
    label: "Alternator",
    sublabel: "60–70 A output",
    icon: "⚡",
    color: "#f97316",
    title: "Alternator",
    body: "The alternator is the primary electrical source in flight. Belt-driven off the engine crankshaft, it produces AC current rectified to DC — powering all systems and charging the battery simultaneously.",
    tip: "If the LOW VOLTAGE light illuminates with the engine running, the alternator has failed. Follow the alternator-out emergency checklist in your POH.",
    tipType: "warning",
  },
  {
    id: "master",
    label: "Master Switch",
    sublabel: "BAT | ALT",
    icon: "🔀",
    color: "#22c55e",
    title: "Master Switch (Split-Rocker)",
    body: "The master switch is two switches in one rocker. The BAT side connects the battery to the main bus. The ALT side energises the alternator field — without it, the alternator produces no output even if the engine is running.",
    tip: "Startup: BAT ON → engine start → ALT ON. Shutdown: ALT OFF first, then BAT OFF. This avoids a voltage spike when the alternator field collapses.",
    tipType: "info",
  },
  {
    id: "ammeter",
    label: "Ammeter",
    sublabel: "Charge / Discharge",
    icon: "📊",
    color: "#8b5cf6",
    title: "Ammeter / Loadmeter",
    body: "The ammeter shows whether the battery is charging (+) or discharging (−). With the engine running, a negative or zero reading means the alternator is not supplying current — likely an alternator failure.",
    tip: "Some aircraft use a LOADMETER instead, which shows total amps being drawn. Typical cruise load is 15–30A depending on equipment in use.",
    tipType: "info",
  },
  {
    id: "bus",
    label: "Main Bus Bar",
    sublabel: "Power distribution",
    icon: "▬",
    color: "#64748b",
    title: "Main Bus Bar",
    body: "The bus bar is a central copper conductor that distributes electrical power to every system in the aircraft. Power flows in from the battery and alternator, then out through individual circuit breakers to each load.",
    tip: "Some aircraft add a separate avionics bus with its own master switch. This isolates sensitive avionics from voltage spikes during engine start.",
    tipType: "info",
  },
  {
    id: "radio",
    label: "Comm / Nav",
    sublabel: "Radios & GPS",
    icon: "📻",
    color: "#0ea5e9",
    title: "Communications & Navigation",
    body: "Comm radios, nav receivers, GPS units, and the transponder all draw from the bus. Each is individually protected by a 5A or 7.5A circuit breaker. Typically the highest-priority loads to keep during an electrical emergency.",
  },
  {
    id: "lights",
    label: "Lighting",
    sublabel: "Nav + Strobe + Landing",
    icon: "💡",
    color: "#eab308",
    title: "Aircraft Lighting",
    body: "Navigation lights (red/green/white) are required sunset to sunrise. Anti-collision strobes are required day and night in most airspace. Landing lights draw 4–8A and have a duty-cycle limit on some aircraft — don't leave them on continuously.",
  },
  {
    id: "pump",
    label: "Fuel Pump",
    sublabel: "Auxiliary electric",
    icon: "💧",
    color: "#06b6d4",
    title: "Electric Fuel Pump",
    body: "The auxiliary electric fuel pump operates independently of the engine-driven mechanical pump. Used during start, takeoff, and landing as a backup, and anytime the engine-driven pump may be unreliable.",
    tip: "Always ON during takeoff and landing. If the engine-driven pump fails, the electric pump keeps fuel flowing to the engine.",
    tipType: "warning",
  },
  {
    id: "instruments",
    label: "Instruments",
    sublabel: "Gyros + Pitot heat",
    icon: "🎛️",
    color: "#a78bfa",
    title: "Flight Instruments",
    body: "The electric turn coordinator, pitot heat, and electric gyros (on some aircraft) run from the main bus. On aircraft with vacuum systems, the attitude indicator and directional gyro are vacuum-powered — giving two independent backup systems.",
  },
]

const TOP_IDS = ["battery", "alternator"]
const MID_IDS = ["master", "ammeter"]
const LOAD_IDS = ["radio", "lights", "pump", "instruments"]

const byId = (id: string) => COMPONENTS.find((c) => c.id === id)!

export default function ElectricalSystemDiagram() {
  const [selectedId, setSelectedId] = useState<string>("battery")

  const toggle = (id: string) =>
    setSelectedId((prev) => (prev === id ? "" : id))

  const selected = COMPONENTS.find((c) => c.id === selectedId) ?? null

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Title */}
      <div className="px-4 pt-4 pb-1 text-center">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Interactive: Aircraft Electrical System
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Tap any component to learn more
        </p>
      </div>

      {/* Diagram grid */}
      <div className="px-4 pt-3 pb-4 space-y-1">

        {/* Row 1: Battery + Alternator */}
        <div className="flex gap-2">
          {TOP_IDS.map((id) => (
            <NodeButton key={id} data={byId(id)} active={selectedId === id} onSelect={toggle} />
          ))}
        </div>

        {/* Connector lines */}
        <div className="flex gap-2">
          {TOP_IDS.map((id) => (
            <div key={id + "-wire-a"} className="flex-1 flex justify-center">
              <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
            </div>
          ))}
        </div>

        {/* Row 2: Master Switch + Ammeter */}
        <div className="flex gap-2">
          {MID_IDS.map((id) => (
            <NodeButton key={id} data={byId(id)} active={selectedId === id} onSelect={toggle} />
          ))}
        </div>

        {/* Connector lines */}
        <div className="flex gap-2">
          {MID_IDS.map((id) => (
            <div key={id + "-wire-b"} className="flex-1 flex justify-center">
              <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
            </div>
          ))}
        </div>

        {/* Row 3: Bus bar (full width) */}
        <button
          onClick={() => toggle("bus")}
          className="w-full py-2.5 rounded-xl border-2 transition-all font-semibold text-sm flex items-center justify-center gap-2"
          style={{
            borderColor: selectedId === "bus" ? byId("bus").color : undefined,
            backgroundColor: selectedId === "bus" ? "#f8fafc" : undefined,
          }}
          data-selected={selectedId === "bus"}
        >
          <span>▬</span>
          <span className="text-slate-700 dark:text-slate-200">MAIN BUS BAR</span>
          {selectedId !== "bus" && (
            <span className="text-xs font-normal text-slate-400">— tap to learn</span>
          )}
        </button>

        {/* Connector lines to loads */}
        <div className="grid grid-cols-4 gap-2">
          {LOAD_IDS.map((id) => (
            <div key={id + "-wire-c"} className="flex justify-center">
              <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-600" />
            </div>
          ))}
        </div>

        {/* Circuit breakers */}
        <div className="grid grid-cols-4 gap-2">
          {LOAD_IDS.map((id) => (
            <div
              key={id + "-cb"}
              className={`text-center text-xs py-1 rounded border font-mono transition-colors ${
                selectedId === id
                  ? "bg-emerald-100 border-emerald-400 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-600 dark:text-emerald-300"
                  : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400"
              }`}
            >
              CB
            </div>
          ))}
        </div>

        {/* Connector lines from CB to loads */}
        <div className="grid grid-cols-4 gap-2">
          {LOAD_IDS.map((id) => (
            <div key={id + "-wire-d"} className="flex justify-center">
              <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-600" />
            </div>
          ))}
        </div>

        {/* Row 4: Load nodes (compact) */}
        <div className="grid grid-cols-4 gap-2">
          {LOAD_IDS.map((id) => (
            <NodeButton key={id} data={byId(id)} active={selectedId === id} onSelect={toggle} compact />
          ))}
        </div>
      </div>

      {/* Info panel */}
      <div className="border-t border-slate-100 dark:border-slate-800 min-h-[110px]">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="p-4"
            >
              <p
                className="text-sm font-bold mb-1.5 flex items-center gap-1.5"
                style={{ color: selected.color }}
              >
                {selected.icon} {selected.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                {selected.body}
              </p>
              {selected.tip && (
                <div
                  className={`rounded-lg px-3 py-2 text-xs leading-relaxed border ${
                    selected.tipType === "warning"
                      ? "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200"
                      : "bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200"
                  }`}
                >
                  {selected.tipType === "warning" ? "⚠️ " : "ℹ️ "}{selected.tip}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 text-center text-xs text-slate-400 dark:text-slate-600"
            >
              Tap a component above to learn what it does
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function NodeButton({
  data,
  active,
  onSelect,
  compact = false,
}: {
  data: ComponentData
  active: boolean
  onSelect: (id: string) => void
  compact?: boolean
}) {
  return (
    <button
      onClick={() => onSelect(data.id)}
      className={`flex-1 rounded-xl border-2 transition-all text-left ${compact ? "p-2" : "p-3"} ${
        active
          ? "shadow-sm"
          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
      style={
        active
          ? { borderColor: data.color, backgroundColor: data.color + "18" }
          : undefined
      }
    >
      <div className={compact ? "text-lg text-center mb-0.5" : "text-2xl mb-1"}>{data.icon}</div>
      <div
        className={`font-semibold leading-tight ${compact ? "text-xs text-center" : "text-xs"}`}
        style={{ color: active ? data.color : undefined }}
      >
        {data.label}
      </div>
      {!compact && (
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
          {data.sublabel}
        </div>
      )}
    </button>
  )
}
