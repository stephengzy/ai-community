"use client"

import { cn } from "@/lib/utils"

interface CommentButtonProps {
  count: number
  className?: string
  onClick?: () => void
}

export function CommentButton({ count, className, onClick }: CommentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-secondary hover:bg-primary/5 hover:text-primary transition-all",
        className
      )}
    >
      <span className="material-symbols-outlined text-[18px]">
        chat_bubble_outline
      </span>
      <span className="text-[13px] font-medium">{count}</span>
    </button>
  )
}
