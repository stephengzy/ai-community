"use client"

import { useState } from "react"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"
import { cn } from "@/lib/utils"

interface UpvoteButtonProps {
  count: number
  upvoted?: boolean
  className?: string
  variant?: "default" | "badge" | "compact"
}

export function UpvoteButton({
  count: initialCount,
  upvoted: initialUpvoted = false,
  className,
  variant = "default",
}: UpvoteButtonProps) {
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [count, setCount] = useState(initialCount)

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setUpvoted(!upvoted)
    setCount(upvoted ? count - 1 : count + 1)
  }

  if (variant === "badge") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-lg border backdrop-blur-sm transition-all cursor-pointer",
          upvoted
            ? "bg-surface-container-lowest/90 border-outline-variant/6 text-primary"
            : "bg-surface-container-lowest/90 border-outline-variant/15 text-on-surface/70 hover:text-primary hover:border-primary/20",
          className
        )}
      >
        <UpvoteIcon size={14} filled={upvoted} />
        <span className="text-[12px] font-bold tabular-nums">{count}</span>
      </button>
    )
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg border transition-all cursor-pointer",
          upvoted
            ? "bg-surface-container-lowest border-outline-variant/6 text-primary"
            : "bg-surface-container-lowest border-outline-variant/15 text-on-surface/70 hover:text-primary hover:border-primary/20",
          className
        )}
      >
        <UpvoteIcon size={12} filled={upvoted} />
        <span className="text-[10px] font-bold tabular-nums">{count}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex items-center gap-1 transition-colors cursor-pointer",
        upvoted ? "text-primary" : "text-on-surface/70 hover:text-primary",
        className
      )}
    >
      <UpvoteIcon size={16} filled={upvoted} />
      <span className="text-[11px] font-bold tabular-nums">{count}</span>
    </button>
  )
}
