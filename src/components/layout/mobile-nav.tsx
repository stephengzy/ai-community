"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mobileNavItems } from "@/data/constants"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 pb-safe bg-surface/90 backdrop-blur-md border-t border-outline-variant/12 shadow-[0_-4px_20px_rgba(26,28,28,0.06)]">
      {mobileNavItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1 transition-all",
              isActive
                ? "bg-primary-container/10 text-primary rounded-xl"
                : "text-on-surface/40"
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
            <span className="font-label uppercase tracking-tight text-[10px] font-semibold mt-0.5">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
