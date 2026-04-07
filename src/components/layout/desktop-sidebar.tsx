"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { desktopNavItems, desktopNavMeItems } from "@/data/constants"
import { useUnreadNotificationCount } from "@/hooks/use-store"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"
import { IdentitySwitcher } from "@/components/layout/identity-switcher"

export function DesktopSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const unreadCount = useUnreadNotificationCount()

  return (
    <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-col border-r border-outline-variant/6 bg-surface z-30">
      {/* Logo */}
      <div className="px-6 py-7">
        <h1 className="font-headline text-[28px] font-semibold tracking-wide text-on-surface leading-tight">
          Builder<br />Community
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <div className="space-y-0.5">
          {desktopNavItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "text-primary font-bold bg-surface-container"
                    : "text-on-surface/80 font-medium hover:text-primary hover:bg-surface-container"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[24px]",
                    isActive && "material-symbols-fill"
                  )}
                >
                  {item.icon}
                </span>
                <span className="font-headline text-base tracking-tight">
                  {item.label}
                </span>
                {item.icon === "notifications" && unreadCount > 0 && (
                  <span className="ml-auto bg-primary text-on-primary text-[11px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Me Section */}
        <div className="mt-5 pt-4 border-t border-outline-variant/6">
          <p className="px-4 mb-2 text-[11px] font-semibold text-secondary/50 uppercase tracking-widest">Me</p>
          <div className="space-y-0.5">
            {desktopNavMeItems.map((item) => {
              const isUpvote = item.icon === "arrow_upward"
              const currentTab = searchParams.get("tab")
              const isActive = pathname === "/profile" && (
                item.href === "/profile?tab=upvotes" ? currentTab === "upvotes"
                : item.href === "/profile?tab=posts" ? currentTab === "posts"
                : !currentTab || currentTab === "builds"
              )
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "text-primary font-bold bg-surface-container"
                      : "text-on-surface/80 font-medium hover:text-primary hover:bg-surface-container"
                  )}
                >
                  {isUpvote ? (
                    <UpvoteIcon size={24} filled={isActive} className="shrink-0" />
                  ) : (
                    <span
                      className={cn(
                        "material-symbols-outlined text-[24px]",
                        isActive && "material-symbols-fill"
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="font-headline text-base tracking-tight">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Build CTA */}
      <div className="px-4 pb-4">
        <Link
          href="/builds/new"
          className="flex items-center justify-center gap-3 w-full bg-primary text-on-primary py-3.5 rounded-lg font-headline text-base font-semibold tracking-tight hover:bg-primary-container transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
          Build
        </Link>
      </div>

      {/* Current User / Identity Switcher */}
      <IdentitySwitcher />
    </aside>
  )
}
