"use client"

import { cn } from "@/lib/utils"

const tabs = ["All", "Comments", "Upvotes"] as const

interface NotificationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export function NotificationTabs({ activeTab, onTabChange, className }: NotificationTabsProps) {
  return (
    <div className={cn("flex border-b border-outline-variant/6", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={cn(
            "flex-1 py-3 text-[14px] font-headline font-semibold tracking-tight transition-colors relative",
            activeTab === tab
              ? "text-on-surface after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-14 after:h-[2px] after:bg-primary after:rounded-full"
              : "text-on-surface/35 hover:text-on-surface/55 hover:bg-surface-container-low/30"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
