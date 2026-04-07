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

  const toggle = () => {
    setUpvoted(!upvoted)
    setCount(upvoted ? count - 1 : count + 1)
  }

  if (variant === "badge") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex items-center gap-1 px-3 py-1 bg-surface-container-lowest/90 backdrop-blur rounded-md border border-outline-variant/10 shadow-sm",
          upvoted && "bg-primary/10",
          className
        )}
      >
        <UpvoteIcon size={16} className="text-primary" filled={upvoted} />
        <span className="text-[12px] font-bold text-on-surface">{count}</span>
      </button>
    )
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant/10 shadow-sm",
          upvoted && "bg-primary/10",
          className
        )}
      >
        <UpvoteIcon size={14} className="text-primary" filled={upvoted} />
        <span className="text-[10px] font-bold">{count}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex items-center gap-1 text-secondary hover:text-primary transition-colors",
        upvoted && "text-primary",
        className
      )}
    >
      <UpvoteIcon size={18} filled={upvoted} />
      <span className="text-[10px] font-bold">{count}</span>
    </button>
  )
}
