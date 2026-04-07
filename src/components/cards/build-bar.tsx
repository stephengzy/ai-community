"use client"

import { useState } from "react"
import Link from "next/link"
import type { Build } from "@/types"
import { categoryLabels } from "@/data/constants"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"
import { cn } from "@/lib/utils"

interface BuildBarProps {
  build: Build
  className?: string
}

export function BuildBar({ build, className }: BuildBarProps) {
  const [upvoted, setUpvoted] = useState(false)
  const [count, setCount] = useState(build.upvotes)

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setUpvoted(!upvoted)
    setCount(upvoted ? count - 1 : count + 1)
  }

  return (
    <Link
      href={`/builds/${build.id}`}
      className={cn(
        "flex items-center gap-4 rounded-xl py-3.5 px-4 bg-surface-container-low/50 border border-outline-variant/15 hover:border-primary/30 hover:bg-surface-container-low transition-all duration-200 group",
        className
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 bg-primary/6 rounded-lg flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[22px] text-primary">
          deployed_code
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-on-surface leading-tight truncate group-hover:text-primary transition-colors">
          {build.name}
        </p>
        <p className="text-[13px] text-secondary mt-0.5 truncate">
          {build.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-medium text-primary bg-primary/8 px-1.5 py-0.5 rounded">
            {categoryLabels[build.category] ?? build.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-secondary">
            <span className="material-symbols-outlined text-[13px]">download</span>
            {build.downloads}
          </span>
        </div>
      </div>

      {/* Upvote */}
      <button
        type="button"
        onClick={handleUpvote}
        className={cn(
          "shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-lg border transition-colors",
          upvoted
            ? "border-primary/30 bg-primary/8 text-primary"
            : "border-outline-variant/20 bg-surface-container-lowest hover:border-primary/40 text-on-surface"
        )}
      >
        <UpvoteIcon size={18} className="text-primary" filled={upvoted} />
        <span className={cn("text-[13px] font-semibold", upvoted && "text-primary")}>
          {count}
        </span>
      </button>
    </Link>
  )
}
