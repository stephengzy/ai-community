"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
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
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({})
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const openAbove = spaceBelow < 220
        const left = Math.min(rect.left, window.innerWidth - 268)
        setPopupStyle(
          openAbove
            ? { position: "fixed", bottom: window.innerHeight - rect.top + 8, left }
            : { position: "fixed", top: rect.bottom + 8, left }
        )
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
  const profileHref = isSelf ? "/profile" : `/users/${user.id}`

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-flex items-center gap-2.5", className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children ? (
        <Link href={profileHref} onClick={(e) => e.stopPropagation()}>
          {children}
        </Link>
      ) : (
        <Link href={profileHref} className="inline-flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
          {showAvatar && (
            <Avatar src={user.avatar} name={user.name} size={avatarSize} className="cursor-pointer" />
          )}
          <span className={cn("text-[15px] font-semibold text-on-surface cursor-pointer", nameClassName)}>
            {namePrefix}{displayName}
          </span>
        </Link>
      )}

      {open && (
        <div
          className="z-50 bg-surface-container-lowest rounded-xl border border-outline-variant/8 shadow-lg p-5 w-[260px] animate-in fade-in-0 zoom-in-95 duration-150"
          style={popupStyle}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <p className="text-[13px] text-on-surface/40 text-center leading-relaxed">
            与 Hi 统一的个人信息浮窗保持一致
          </p>
        </div>
      )}
    </div>
  )
}
