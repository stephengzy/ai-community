"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const tabs = ["Latest", "Trending", "Following"] as const

interface FeedTabsProps {
  className?: string
  onTabChange?: (tab: string) => void
}

export function FeedTabs({ className, onTabChange }: FeedTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("Latest")

  return (
    <div className={cn("border-b border-surface-container-high pb-2", className)}>
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab)
              onTabChange?.(tab)
            }}
            className={cn(
              "relative text-base font-headline font-semibold tracking-tight pb-2 transition-colors",
              activeTab === tab
                ? "text-on-surface after:content-[''] after:absolute after:-bottom-[9px] after:left-0 after:w-full after:h-[2px] after:bg-primary"
                : "text-on-surface/40 hover:text-on-surface/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
