"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { User } from "@/types"
import { Avatar } from "@/components/content/avatar"
import { useCurrentUser } from "@/hooks/use-store"
import { cn } from "@/lib/utils"

interface UserHoverCardProps {
  user: User
  avatarSize?: "xs" | "sm" | "md" | "lg" | "xl"
  nameClassName?: string
  className?: string
  showAvatar?: boolean
  namePrefix?: string
  children?: React.ReactNode
}

export function UserHoverCard({
  user,
  avatarSize = "md",
  nameClassName,
  className,
  showAvatar = true,
  namePrefix = "",
  children,
}: UserHoverCardProps) {
  const currentUser = useCurrentUser()
  const [open, setOpen] = useState(false)
  const [following, setFollowing] = useState(false)
  const [openAbove, setOpenAbove] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      // Check if there's enough space below
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        setOpenAbove(spaceBelow < 220)
      }
      setOpen(true)
    }, 300)
  }, [])

  const handleLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setOpen(false), 200)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const displayName = `${user.name}(${user.realName})`
  const isSelf = user.id === currentUser.id

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-flex items-center gap-2.5", className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children ? (
        children
      ) : (
        <>
          {showAvatar && (
            <Avatar src={user.avatar} name={user.name} size={avatarSize} className="cursor-pointer" />
          )}
          <span className={cn("text-[15px] font-semibold text-on-surface cursor-pointer", nameClassName)}>
            {namePrefix}{displayName}
          </span>
        </>
      )}

      {open && (
        <div
          className={cn(
            "absolute left-0 z-50 bg-surface-container-lowest rounded-xl border border-outline-variant/8 shadow-lg p-4 w-[260px] animate-in fade-in-0 zoom-in-95 duration-150",
            openAbove ? "bottom-full mb-2" : "top-full mt-2"
          )}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {/* Header: avatar + name */}
          <div className="flex items-start gap-3">
            <Avatar src={user.avatar} name={user.name} size="lg" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-on-surface leading-tight truncate">
                {displayName}
              </p>
              <p className="text-[12px] text-secondary mt-0.5">
                {user.role}
              </p>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-[13px] text-on-surface/70 mt-3 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Follow button */}
          {!isSelf && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setFollowing(!following)
              }}
              className={cn(
                "w-full mt-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer",
                following
                  ? "bg-surface-container text-secondary border border-outline-variant/12 hover:bg-surface-container-low"
                  : "bg-primary text-on-primary hover:opacity-90"
              )}
            >
              {following ? "Following" : "Follow"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
