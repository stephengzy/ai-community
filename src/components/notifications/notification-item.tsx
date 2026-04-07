"use client"

import type { Notification } from "@/types"
import { Avatar } from "@/components/content/avatar"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { cn } from "@/lib/utils"

function getActionText(n: Notification): string {
  switch (n.type) {
    case "upvote":
      return `顶了你的作品${n.targetName ? `「${n.targetName}」` : ""}`
    case "like":
      return "赞了你的帖子"
    case "comment":
      return `评论了你的${n.targetType === "build" ? "作品" : "帖子"}`
    case "reply":
      return "回复了你的评论"
    case "mention":
      return "@了你"
    case "collaborator":
      return `将你添加为「${n.targetName}」的合作者`
  }
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 30) return `${Math.floor(diffDays / 30)}个月前`
  if (diffDays > 0) return `${diffDays}天前`
  if (diffHours > 0) return `${diffHours}小时前`
  return "刚刚"
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
