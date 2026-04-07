"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function DesktopSidebar() {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname.startsWith("/builds")
  const isFeed = pathname === "/feed"

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
          <Link
            href="/"
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200",
              isHome
                ? "text-primary font-bold bg-surface-container"
                : "text-on-surface/80 font-medium hover:text-primary hover:bg-surface-container"
            )}
          >
            <span
              className={cn(
                "material-symbols-outlined text-[24px]",
                isHome && "material-symbols-fill"
              )}
            >
              grid_view
            </span>
            <span className="font-headline text-base tracking-tight">
              作品集
            </span>
          </Link>
          <Link
            href="/feed"
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200",
              isFeed
                ? "text-primary font-bold bg-surface-container"
                : "text-on-surface/80 font-medium hover:text-primary hover:bg-surface-container"
            )}
          >
            <span
              className={cn(
                "material-symbols-outlined text-[24px]",
                isFeed && "material-symbols-fill"
              )}
            >
              forum
            </span>
            <span className="font-headline text-base tracking-tight">
              讨论广场
            </span>
          </Link>
        </div>
      </nav>

      {/* Build CTA */}
      <div className="px-4 pb-4">
        <Link
          href="/builds/new"
          className="flex items-center justify-center gap-3 w-full bg-primary text-on-primary py-3.5 rounded-lg font-headline text-base font-semibold tracking-tight hover:bg-primary-container transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
          上传作品
        </Link>
      </div>
    </aside>
  )
}
