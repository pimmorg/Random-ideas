"use client"

import dynamic from "next/dynamic"
import ReactMarkdown from "react-markdown"

const FourForcesDiagram = dynamic(() => import("./diagrams/FourForcesDiagram"), { ssr: false })
const AngleOfAttackDiagram = dynamic(() => import("./diagrams/AngleOfAttackDiagram"), { ssr: false })
const FourStrokeDiagram = dynamic(() => import("./diagrams/FourStrokeDiagram"), { ssr: false })
const ElectricalSystemDiagram = dynamic(() => import("./diagrams/ElectricalSystemDiagram"), { ssr: false })
const AlternatorFailureDiagram = dynamic(() => import("./diagrams/AlternatorFailureDiagram"), { ssr: false })
const SteepTurnDiagram = dynamic(() => import("./diagrams/SteepTurnDiagram"), { ssr: false })
const StallRecoveryDiagram = dynamic(() => import("./diagrams/StallRecoveryDiagram"), { ssr: false })
const TurnsAroundPointDiagram = dynamic(() => import("./diagrams/TurnsAroundPointDiagram"), { ssr: false })
const AirspaceDiagram = dynamic(() => import("./diagrams/AirspaceDiagram"), { ssr: false })

const DIAGRAMS: Record<string, React.ComponentType> = {
  "four-forces": FourForcesDiagram,
  "angle-of-attack": AngleOfAttackDiagram,
  "four-stroke": FourStrokeDiagram,
  "electrical-system": ElectricalSystemDiagram,
  "alternator-failure": AlternatorFailureDiagram,
  "steep-turn": SteepTurnDiagram,
  "stall-recovery": StallRecoveryDiagram,
  "turns-around-point": TurnsAroundPointDiagram,
  "airspace": AirspaceDiagram,
}

type CalloutVariant = "info" | "tip" | "warning"

type Part =
  | { type: "markdown"; content: string }
  | { type: "diagram"; name: string }
  | { type: "callout"; variant: CalloutVariant; content: string }

function parseContent(raw: string): Part[] {
  const lines = raw.split("\n")
  const parts: Part[] = []
  let markdownBuffer: string[] = []
  let inCallout: { variant: string; lines: string[] } | null = null

  const flushMarkdown = () => {
    const text = markdownBuffer.join("\n").trim()
    if (text) parts.push({ type: "markdown", content: text })
    markdownBuffer = []
  }

  for (const line of lines) {
    const diagramMatch = line.match(/^\[DIAGRAM:([^\]]+)\]$/)
    if (diagramMatch && !inCallout) {
      flushMarkdown()
      parts.push({ type: "diagram", name: diagramMatch[1] })
      continue
    }

    const calloutStart = line.match(/^:::(\w+)$/)
    if (calloutStart && !inCallout) {
      flushMarkdown()
      inCallout = { variant: calloutStart[1], lines: [] }
      continue
    }

    if (line === ":::" && inCallout) {
      parts.push({
        type: "callout",
        variant: inCallout.variant as CalloutVariant,
        content: inCallout.lines.join("\n"),
      })
      inCallout = null
      continue
    }

    if (inCallout) {
      inCallout.lines.push(line)
    } else {
      markdownBuffer.push(line)
    }
  }

  flushMarkdown()
  return parts
}

const calloutStyles: Record<
  CalloutVariant,
  { bg: string; border: string; icon: string; label: string; text: string }
> = {
  info: {
    bg: "bg-sky-50 dark:bg-sky-950/60",
    border: "border-sky-200 dark:border-sky-800",
    icon: "ℹ️",
    label: "Note",
    text: "text-sky-900 dark:text-sky-100",
  },
  tip: {
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "💡",
    label: "Tip",
    text: "text-emerald-900 dark:text-emerald-100",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/60",
    border: "border-amber-200 dark:border-amber-800",
    icon: "⚠️",
    label: "Remember",
    text: "text-amber-900 dark:text-amber-100",
  },
}

function Callout({ variant, content }: { variant: CalloutVariant; content: string }) {
  const style = calloutStyles[variant] ?? calloutStyles.info
  return (
    <div className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
      <div className={`flex items-center gap-1.5 text-xs font-bold mb-2 ${style.text}`}>
        <span>{style.icon}</span>
        {style.label}
      </div>
      <div className={`prose prose-sm dark:prose-invert max-w-none ${style.text}`}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

export default function ContentRenderer({ content }: { content: string }) {
  const parts = parseContent(content)

  return (
    <div className="space-y-4">
      {parts.map((part, i) => {
        if (part.type === "markdown") {
          return (
            <div key={i} className="prose prose-sm prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown>{part.content}</ReactMarkdown>
            </div>
          )
        }
        if (part.type === "diagram") {
          const DiagramComponent = DIAGRAMS[part.name]
          if (!DiagramComponent) return null
          return <DiagramComponent key={i} />
        }
        if (part.type === "callout") {
          return <Callout key={i} variant={part.variant} content={part.content} />
        }
        return null
      })}
    </div>
  )
}
