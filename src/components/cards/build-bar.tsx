"use client"

import { useState } from "react"
import Link from "next/link"
import type { Build } from "@/types"
import { categoryIcons } from "@/data/constants"
import { CategoryTag } from "@/components/content/category-tag"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"
import { cn } from "@/lib/utils"

interface BuildBarProps {
  build: Build
  className?: string
}

export function BuildBar({ build, className }: BuildBarProps) {
  const [upvoted, setUpvoted] = useState(false)
  const [count, setCount] = useState(build.upvotes)
  const isDemo = build.category === "DEMO"

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
        "flex items-center gap-4 rounded-xl py-3.5 px-4 bg-surface-container-low/50 border border-outline-variant/8 hover:border-primary/30 hover:bg-surface-container-low transition-all duration-200 group",
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
        isDemo ? "bg-demo/10" : "bg-primary/6"
      )}>
        <span className={cn(
          "material-symbols-outlined text-[22px]",
          isDemo ? "text-demo" : "text-primary"
        )}>
          {categoryIcons[build.category] ?? "category"}
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
          <CategoryTag category={build.category} size="xs" />
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
          "shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl border transition-all cursor-pointer",
          upvoted
            ? "border-outline-variant/8 bg-surface-container-lowest text-primary"
            : "border-outline-variant/15 bg-surface-container-lowest text-on-surface/70 hover:text-primary hover:border-primary/20"
        )}
      >
        <UpvoteIcon size={16} filled={upvoted} />
        <span className="text-[11px] font-bold tabular-nums mt-0.5">
          {count}
        </span>
      </button>
    </Link>
  )
}
