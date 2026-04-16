"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import AIChatPanel from "./AIChatPanel"

interface AIChatButtonProps {
  lessonContext?: string
}

export default function AIChatButton({ lessonContext }: AIChatButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-20 right-4 z-40 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all",
          open && "opacity-0 pointer-events-none"
        )}
        aria-label="Open AI tutor"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Chat panel */}
      {open && (
        <AIChatPanel
          lessonContext={lessonContext}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
