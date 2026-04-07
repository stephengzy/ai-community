"use client"

import type { Notification } from "@/types"
import { Avatar } from "@/components/content/avatar"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { cn } from "@/lib/utils"

function getActionText(n: Notification): string {
  switch (n.type) {
    case "upvote":
      return `upvoted your build${n.targetName ? ` "${n.targetName}"` : ""}`
    case "like":
      return "liked your post"
    case "comment":
      return `commented on your ${n.targetType === "build" ? "build" : "post"}`
    case "reply":
      return "replied to your comment"
    case "mention":
      return "mentioned you"
    case "collaborator":
      return `added you as a collaborator on "${n.targetName}"`
    case "sponsor":
      return "sponsored your post"
  }
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 30) return `${Math.floor(diffDays / 30)}m ago`
  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  return "just now"
}

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const action = getActionText(notification)
  const displayName = `${notification.actor.name}(${notification.actor.realName})`

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 lg:px-5 py-3.5 text-left transition-colors hover:bg-surface-container-low/50 border-b border-outline-variant/6",
        !notification.isRead && "bg-primary/[0.03]"
      )}
    >
      {/* Avatar */}
      <UserHoverCard user={notification.actor} avatarSize="md" showAvatar={true} className="shrink-0">
        <Avatar
          src={notification.actor.avatar}
          name={notification.actor.name}
          size="md"
          className="mt-0.5 cursor-pointer"
        />
      </UserHoverCard>

      {/* Text content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="text-[14px] leading-snug">
          <UserHoverCard user={notification.actor} showAvatar={false} nameClassName="font-semibold text-on-surface tracking-tight cursor-pointer hover:underline" />
          <span className="text-secondary"> {action}</span>
          <span className="text-secondary/40 text-[12px] ml-1.5">{getTimeAgo(notification.createdAt)}</span>
        </div>

        {notification.contentPreview && (
          <p className="mt-1 text-[13px] text-secondary/60 leading-relaxed line-clamp-2">
            {notification.contentPreview}
          </p>
        )}
      </div>
    </button>
  )
}
