"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const filters = ["All", "Product", "Engineering", "Design", "Data"]

interface FeedFilterTagsProps {
  onFilterChange?: (filter: string) => void
}

export function FeedFilterTags({ onFilterChange }: FeedFilterTagsProps) {
  const [active, setActive] = useState("All")

  return (
    <div className="lg:hidden flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 py-2">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => {
            setActive(filter)
            onFilterChange?.(filter)
          }}
          className={cn(
            "px-4 py-1.5 rounded-full text-[11px] font-bold tracking-tight shrink-0 uppercase transition-colors",
            active === filter
              ? "bg-primary text-on-primary"
              : "bg-secondary-fixed text-on-secondary-fixed-variant"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
