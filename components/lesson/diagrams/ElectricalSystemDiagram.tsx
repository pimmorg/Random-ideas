"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface NodeInfo {
  title: string
  body: string
  tip?: string
  tipVariant?: "warning" | "info"
}

interface Node {
  id: string
  label: string
  sublabel: string
  icon: string
  color: string
  bg: string
  border: string
  info: NodeInfo
}

const NODES: Record<string, Node> = {
  battery: {
    id: "battery",
    label: "Battery",
    sublabel: "12V / 35Ah",
    icon: "🔋",
    color: "#0ea5e9",
    bg: "bg-sky-50 dark:bg-sky-950",
    border: "border-sky-300 dark:border-sky-700",
    info: {
      title: "Battery",
      body: "The battery provides power for engine starting and acts as a backup if the alternator fails. Most training aircraft use a 12V or 24V sealed lead-acid battery located in the engine compartment or nose.",
      tip: "Alternator failure means battery-only power. At normal electrical load, expect 20–30 minutes before total electrical failure. Shed all non-essential loads immediately.",
      tipVariant: "warning",
    },
  },
  alternator: {
    id: "alternator",
    label: "Alternator",
    sublabel: "60–70 A output",
    icon: "⚡",
    color: "#f97316",
    bg: "bg-orange-50 dark:bg-orange-950",
    border: "border-orange-300 dark:border-orange-700",
    info: {
      title: "Alternator",
      body: "The alternator is the primary electrical source during flight. Driven by a belt off the engine crankshaft, it generates AC current that is rectified to DC. It powers all systems AND charges the battery simultaneously.",
      tip: "The ALT half of the master switch engages the alternator field. If the LOW VOLTAGE light illuminates, the alternator has failed — follow the alternator-out checklist.",
      tipVariant: "warning",
    },
  },
  master: {
    id: "master",
    label: "Master Switch",
    sublabel: "BAT  |  ALT",
    icon: "🔀",
    color: "#22c55e",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-300 dark:border-emerald-700",
    info: {
      title: "Master Switch (Split-Rocker)",
      body: "The master switch is actually two switches in one. The BAT (battery) side connects the battery to the main bus. The ALT (alternator) side engages the alternator's voltage regulator field circuit — without it, the alternator produces no output.",
      tip: "Always turn on BAT first (left side), then ALT. When shutting down, turn off ALT first, then BAT — this prevents a voltage spike from the alternator field collapsing.",
      tipVariant: "info",
    },
  },
  ammeter: {
    id: "ammeter",
    label: "Ammeter",
    sublabel: "Charge / Discharge",
    icon: "📊",
    color: "#8b5cf6",
    bg: "bg-violet-50 dark:bg-violet-950",
    border: "border-violet-300 dark:border-violet-700",
    info: {
      title: "Ammeter / Loadmeter",
      body: "The ammeter (or loadmeter in newer aircraft) shows the electrical load on the system. A positive reading means the alternator is charging the battery. A negative (or zero) reading with the engine running usually means alternator failure.",
      tip: "Some aircraft use a LOADMETER instead — it shows total amps being drawn from the system. Normal is around 0–30A depending on what's switched on.",
      tipVariant: "info",
    },
  },
  bus: {
    id: "bus",
    label: "Main Bus Bar",
    sublabel: "Distributes power",
    icon: "⬜",
    color: "#64748b",
    bg: "bg-slate-50 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-600",
    info: {
      title: "Main Bus Bar",
      body: "The bus bar is a central electrical distribution point — a common conductor that all systems tap into. Power flows in from the battery/alternator side and out through individual circuit breakers to each system.",
      tip: "Some aircraft have a separate avionics bus with its own on/off switch (avionics master). This lets you power avionics independently and protects them from voltage spikes during engine start.",
      tipVariant: "info",
    },
  },
  radio: {
    id: "radio",
    label: "Comm / Nav",
    sublabel: "Radios & GPS",
    icon: "📻",
    color: "#0ea5e9",
    bg: "bg-sky-50 dark:bg-sky-950",
    border: "border-sky-200 dark:border-sky-800",
    info: {
      title: "Communications & Navigation",
      body: "Radios, transponder, GPS/nav units, and intercom all draw from the main (or avionics) bus. These are typically on 5A or 7.5A circuit breakers.",
    },
  },
  lights: {
    id: "lights",
    label: "Nav Lights",
    sublabel: "Position + Strobe",
    icon: "🔴",
    color: "#ef4444",
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    info: {
      title: "Navigation & Anti-collision Lights",
      body: "Navigation lights (red left wingtip, green right wingtip, white tail) are required from sunset to sunrise. Anti-collision strobes are required day and night. Landing lights draw significant amperage (4–8A) and have a limited duty cycle on some aircraft.",
    },
  },
  pump: {
    id: "pump",
    label: "Fuel Pump",
    sublabel: "Electric aux",
    icon: "💧",
    color: "#06b6d4",
    bg: "bg-cyan-50 dark:bg-cyan-950",
    border: "border-cyan-200 dark:border-cyan-800",
    info: {
      title: "Electric Fuel Pump",
      body: "The electric fuel pump provides fuel pressure independently of the engine-driven mechanical pump. It is used during takeoff and landing as a backup, and any time the engine-driven pump may be unreliable (e.g., during engine start).",
      tip: "Engine-driven pump fails → electric pump is your backup. The electric pump should always be ON during takeoff and landing.",
      tipVariant: "warning",
    },
  },
  instruments: {
    id: "instruments",
    label: "Instruments",
    sublabel: "Gyros + pitot heat",
    icon: "🎛️",
    color: "#a78bfa",
    bg: "bg-violet-50 dark:bg-violet-950",
    border: "border-violet-200 dark:border-violet-800",
    info: {
      title: "Flight Instruments",
      body: "Electric gyros (attitude indicator, heading indicator on some aircraft), pitot heat, and the turn coordinator draw from the main bus. On aircraft with a vacuum system, the attitude indicator and DI are typically vacuum-powered — not electrical — making the systems redundant.",
    },
  },
}

const LOAD_IDS = ["radio", "lights", "pump", "instruments"]

export default function ElectricalSystemDiagram() {
  const [selected, setSelected] = useState<string | null>("battery")

  const select = (id: string) =>
    setSelected((prev) => (prev === id ? null : id))

  const node = selected ? NODES[selected] : null

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide text-center">
          Interactive: Aircraft Electrical System
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-0.5">
          Tap any component to learn more
        </p>
      </div>

      {/* Diagram */}
      <div className="px-4 pt-2 pb-4">
        {/* Row 1: Battery + Alternator */}
        <div className="flex gap-3 justify-between mb-2">
          <ComponentBox node={NODES.battery} selected={selected === "battery"} onClick={() => select("battery")} />
          <ComponentBox node={NODES.alternator} selected={selected === "alternator"} onClick={() => select("alternator")} />
        </div>

        {/* Wires down to master / ammeter */}
        <div className="flex justify-between px-6 mb-0">
          <Wire />
          <Wire />
        </div>

        {/* Row 2: Master Switch + Ammeter side by side */}
        <div className="flex gap-3 justify-between mb-2">
          <ComponentBox node={NODES.master} selected={selected === "master"} onClick={() => select("master")} />
          <ComponentBox node={NODES.ammeter} selected={selected === "ammeter"} onClick={() => select("ammeter")} />
        </div>

        {/* Wires down to bus */}
        <div className="flex justify-around px-2 mb-0">
          <Wire />
          <Wire />
        </div>

        {/* Row 3: Bus Bar */}
        <button
          onClick={() => select("bus")}
          className={`w-full mb-2 py-2.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
            selected === "bus"
              ? `${NODES.bus.bg} ${NODES.bus.border} ring-2 ring-slate-400`
              : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-slate-400"
          }`}
        >
          <span className="text-base">⬛</span>
          <span className="text-slate-700 dark:text-slate-200">MAIN BUS BAR</span>
          <span className="text-xs text-slate-400 font-normal">— distributes to all circuits</span>
        </button>

        {/* Wires down to loads */}
        <div className="grid grid-cols-4 gap-1 mb-1">
          {LOAD_IDS.map(() => (
            <div key={Math.random()} className="flex justify-center">
              <Wire short />
            </div>
          ))}
        </div>

        {/* Circuit Breaker row */}
        <div className="grid grid-cols-4 gap-1 mb-1">
          {LOAD_IDS.map((id) => (
            <CircuitBreaker key={id} active={selected === id} />
          ))}
        </div>

        {/* Wires from CB to loads */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          {LOAD_IDS.map(() => (
            <div key={Math.random()} className="flex justify-center">
              <Wire short />
            </div>
          ))}
        </div>

        {/* Row 4: Individual loads */}
        <div className="grid grid-cols-4 gap-1">
          {LOAD_IDS.map((id) => (
            <ComponentBox
              key={id}
              node={NODES[id]}
              selected={selected === id}
              onClick={() => select(id)}
              compact
            />
          ))}
        </div>
      </div>

      {/* Info panel */}
      <div className="border-t border-slate-100 dark:border-slate-800 min-h-[120px]">
        <AnimatePresence mode="wait">
          {node ? (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`p-4 ${node.bg}`}
            >
              <div
                className="text-sm font-bold mb-1 flex items-center gap-1.5"
                style={{ color: node.color }}
              >
                <span>{node.icon}</span>
                {node.info.title}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                {node.info.body}
              </p>
              {node.info.tip && (
                <div
                  className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    node.info.tipVariant === "warning"
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                      : "bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800"
                  }`}
                >
                  {node.info.tipVariant === "warning" ? "⚠️ " : "ℹ️ "}
                  {node.info.tip}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 flex items-center justify-center text-xs text-slate-400 dark:text-slate-600"
            >
              Select a component above to learn about it
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ComponentBox({
  node,
  selected,
  onClick,
  compact = false,
}: {
  node: Node
  selected: boolean
  onClick: () => void
  compact?: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex-1 rounded-xl border-2 transition-all text-left ${
        compact ? "p-2" : "p-3"
      } ${
        selected
          ? `${node.bg} ${node.border} ring-2 shadow-sm`
          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
      }`}
      style={selected ? { ringColor: node.color } : {}}
    >
      <div className={compact ? "text-base text-center" : "text-xl mb-1"}>{node.icon}</div>
      <div
        className={`font-semibold leading-tight ${compact ? "text-xs text-center" : "text-xs"}`}
        style={{ color: selected ? node.color : undefined }}
      >
        {node.label}
      </div>
      {!compact && (
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{node.sublabel}</div>
      )}
    </motion.button>
  )
}

function Wire({ short = false }: { short?: boolean }) {
  return (
    <div
      className={`w-px bg-slate-300 dark:bg-slate-600 mx-auto ${short ? "h-3" : "h-4"}`}
    />
  )
}

function CircuitBreaker({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`w-full h-4 rounded border text-center text-xs font-mono leading-4 transition-colors ${
          active
            ? "bg-emerald-100 border-emerald-400 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-600 dark:text-emerald-300"
            : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400"
        }`}
      >
        CB
      </div>
    </div>
  )
}
