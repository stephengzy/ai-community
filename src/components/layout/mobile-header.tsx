"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUnreadNotificationCount } from "@/hooks/use-store"

export function MobileHeader() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const unreadCount = useUnreadNotificationCount()

  return (
    <header className="lg:hidden sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/6">
      {!showSearch ? (
        <div className="flex justify-between items-center px-4 h-14">
          <Link href="/" className="font-headline text-lg font-semibold tracking-wide text-on-surface">
            Builder Community
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="p-2 text-primary hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
            <Link
              href="/notifications"
              className="relative p-2 text-primary hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-[22px]">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-on-primary text-[9px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 h-14">
          <button
            type="button"
            onClick={() => {
              setShowSearch(false)
              setSearchQuery("")
            }}
            className="p-1.5 text-secondary/50"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, people, builds..."
            className="flex-1 bg-surface-container-low rounded-full px-4 py-2 text-[14px] placeholder:text-secondary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowSearch(false)
                setSearchQuery("")
              }
            }}
          />
        </div>
      )}
    </header>
  )
}
