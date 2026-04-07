"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = "Search builds by name, type, or keyword...",
  className,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("")

  return (
    <div className={cn("relative", className)}>
      <span className="material-symbols-outlined text-[18px] text-secondary absolute left-3 top-1/2 -translate-y-1/2">
        search
      </span>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value)
          onSearch?.(e.target.value)
        }}
        className="w-full pl-9 pr-3 py-2.5 text-[14px] bg-surface-container-lowest border border-outline-variant/15 rounded-lg text-on-surface placeholder:text-secondary/40 placeholder:font-headline placeholder:text-[14px] placeholder:tracking-tight focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors"
      />
    </div>
  )
}
