"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  count: number
  liked?: boolean
  className?: string
}

export function LikeButton({
  count: initialCount,
  liked: initialLiked = false,
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)

  const toggle = () => {
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-secondary hover:bg-surface-container hover:text-primary transition-all",
        liked && "text-primary bg-primary/8",
        className
      )}
    >
      <span
        className={cn(
          "material-symbols-outlined text-[20px]",
          liked ? "material-symbols-fill" : ""
        )}
        style={{ fontVariationSettings: liked ? "'wght' 400" : "'wght' 300" }}
      >
        thumb_up
      </span>
      <span className="text-[13px]">{count}</span>
    </button>
  )
}
