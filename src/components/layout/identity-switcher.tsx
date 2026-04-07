"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/use-store"
import { useStore } from "@/store"

/** Users available for identity switching */
const SWITCHABLE_USER_IDS = ["u1", "u6"] // 恒宇 (IC), 曼巴 (L2 Leader)

interface IdentitySwitcherProps {
  variant?: "sidebar" | "topbar"
}

export function IdentitySwitcher({ variant = "sidebar" }: IdentitySwitcherProps) {
  const currentUser = useCurrentUser()
  const setCurrentUserId = useStore((s) => s.setCurrentUserId)
  const allUsers = useStore((s) => s.users)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const switchableUsers = SWITCHABLE_USER_IDS
    .map((id) => allUsers[id])
    .filter(Boolean)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const isTopbar = variant === "topbar"

  return (
    <div className="relative" ref={panelRef}>
      {/* Current user button */}
      {isTopbar ? (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container/50 transition-colors"
        >
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {currentUser.name.charAt(0)}
            </div>
          )}
          <span
            className={cn(
              "material-symbols-outlined text-[14px] text-secondary/30 transition-transform shrink-0",
              open && "rotate-180"
            )}
          >
            expand_more
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full px-4 py-4 border-t border-outline-variant/6 group/user text-left hover:bg-surface-container/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-on-surface group-hover/user:text-primary transition-colors truncate">
                  {currentUser.name}({currentUser.realName})
                </p>
              </div>
              <p className="text-[11px] text-secondary/40 truncate">
                {currentUser.department} · {currentUser.role}
              </p>
            </div>
            <span
              className={cn(
                "material-symbols-outlined text-[18px] text-secondary/30 transition-transform shrink-0",
                open && "rotate-180"
              )}
            >
              expand_more
            </span>
          </div>
        </button>
      )}

      {/* Dropdown panel */}
      {open && (
        <div className={cn(
          "absolute bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-xl z-50 overflow-hidden",
          isTopbar
            ? "top-full right-0 mt-1.5 w-[260px]"
            : "bottom-full left-0 right-0 mb-1 mx-2"
        )}>
          <div className="px-3 py-2 border-b border-outline-variant/6">
            <p className="text-[11px] font-semibold text-secondary/40 uppercase tracking-wider">
              Switch Identity
            </p>
          </div>
          <div className="py-1">
            {switchableUsers.map((user) => {
              const isActive = user.id === currentUser.id
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setCurrentUserId(user.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "bg-primary/5"
                      : "hover:bg-surface-container/50"
                  )}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[13px] font-semibold truncate",
                        isActive ? "text-primary" : "text-on-surface"
                      )}>
                        {user.name}({user.realName})
                      </span>
                    </div>
                    <p className="text-[11px] text-secondary/40 truncate">
                      {user.department} · {user.role}
                    </p>
                  </div>
                  {isActive && (
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
                      check_circle
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
