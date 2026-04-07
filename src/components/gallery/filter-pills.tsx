"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const filters = ["All", "Skill", "Demo", "Other"]

interface FilterPillsProps {
  className?: string
  onFilterChange?: (filter: string) => void
}

export function FilterPills({ className, onFilterChange }: FilterPillsProps) {
  const [active, setActive] = useState("All")

  return (
    <div className={cn("flex gap-1.5 flex-wrap", className)}>
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => {
            setActive(filter)
            onFilterChange?.(filter)
          }}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold transition-all duration-200",
            active === filter
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-surface-container-low text-on-surface/50 hover:text-on-surface/80 hover:bg-surface-container"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
