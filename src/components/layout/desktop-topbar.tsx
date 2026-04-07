"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUnreadNotificationCount, useCurrentUser } from "@/hooks/use-store"

export function DesktopTopbar() {
  const pathname = usePathname()
  const unreadCount = useUnreadNotificationCount()
  const currentUser = useCurrentUser()

  // Pages that have their own header
  if (pathname === "/feed" || pathname === "/builds/new" || (pathname.startsWith("/builds/") && pathname.endsWith("/edit"))) return null

  return (
    <div className="hidden lg:flex items-center justify-end px-6 xl:px-10 py-3 absolute top-0 right-0 z-40 pointer-events-none">
      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        <Link
          href="/notifications"
          className={cn(
            "relative p-2 rounded-lg transition-colors",
            pathname.startsWith("/notifications")
              ? "text-primary bg-surface-container"
              : "text-on-surface/45 hover:text-on-surface/70 hover:bg-surface-container/50"
          )}
        >
          <span className={cn("material-symbols-outlined text-[20px]", pathname.startsWith("/notifications") && "material-symbols-fill")}>
            notifications
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-primary text-on-primary text-[9px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        <Link
          href="/profile"
          className="block p-1 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
        >
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {currentUser.name.charAt(0)}
            </div>
          )}
        </Link>
      </div>
    </div>
  )
}
