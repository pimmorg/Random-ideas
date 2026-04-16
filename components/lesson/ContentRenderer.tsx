"use client"

import dynamic from "next/dynamic"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
      <div className={`text-xs leading-relaxed ${style.text}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 last:mb-0 leading-7 text-slate-700 dark:text-slate-300">{children}</p>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-6 mb-2 first:mt-0">{children}</h3>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="space-y-1.5 my-3 pl-5 list-disc marker:text-slate-400">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="space-y-1.5 my-3 pl-5 list-decimal marker:text-slate-400">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-7 text-slate-700 dark:text-slate-300">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wide">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-2.5 text-left">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">{children}</td>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="even:bg-slate-50/50 dark:even:bg-slate-800/30">{children}</tr>
  ),
  hr: () => <hr className="my-5 border-slate-200 dark:border-slate-700" />,
}

export default function ContentRenderer({ content }: { content: string }) {
  const parts = parseContent(content)

  return (
    <div className="space-y-5">
      {parts.map((part, i) => {
        if (part.type === "markdown") {
          return (
            <div key={i} className="max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{part.content}</ReactMarkdown>
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
