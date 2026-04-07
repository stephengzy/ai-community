"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  className?: string
}

export function ShareButton({ className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-secondary hover:bg-surface-container hover:text-primary transition-all",
        copied && "text-primary bg-primary/8",
        className
      )}
    >
      <span
        className="material-symbols-outlined text-[20px]"
        style={{ fontVariationSettings: "'wght' 300" }}
      >
        {copied ? "check" : "share"}
      </span>
      <span className="text-[13px]">{copied ? "Copied" : "Share"}</span>
    </button>
  )
}
