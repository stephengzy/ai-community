"use client"

import { useState, useMemo } from "react"
import { NotificationTabs } from "./notification-tabs"
import { NotificationItem } from "./notification-item"
import { useNotifications, useUnreadNotificationCount } from "@/hooks/use-store"
import { useStore } from "@/store"

export function NotificationContent() {
  const [activeTab, setActiveTab] = useState("全部")
  const notifications = useNotifications()
  const unreadCount = useUnreadNotificationCount()
  const markNotificationRead = useStore((s) => s.markNotificationRead)
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead)

  const filteredNotifications = useMemo(() => {
    if (activeTab === "评论和@") {
      return notifications.filter((n) =>
        n.type === "comment" || n.type === "reply" || n.type === "mention"
      )
    }
    if (activeTab === "点赞和顶") {
      return notifications.filter((n) =>
        n.type === "upvote" || n.type === "like"
      )
    }
    return notifications
  }, [notifications, activeTab])

  return (
    <>
      {/* Sticky header */}
      <div className="lg:sticky lg:top-0 z-30 lg:bg-surface/90 lg:backdrop-blur-md -mx-4 px-4 lg:-mx-6 lg:px-6 xl:-mx-10 xl:px-10 border-b border-outline-variant/6">
        <div className="flex items-center justify-between py-2.5 lg:py-3">
          <h1 className="text-[16px] lg:text-[18px] font-headline font-semibold text-on-surface tracking-tight">提醒</h1>
        </div>
        <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} className="-mx-4 lg:-mx-6 xl:-mx-10" />
      </div>

      {/* Mark all read */}
      {unreadCount > 0 && (
        <div className="flex justify-end py-2.5">
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="text-[13px] text-primary font-medium hover:text-primary/70 transition-colors"
          >
            全部已读
          </button>
        </div>
      )}

      {/* Notification list */}
      {filteredNotifications.length > 0 ? (
        <div className="-mx-4 lg:-mx-6 xl:-mx-10">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => {
                if (!notification.isRead) {
                  markNotificationRead(notification.id)
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <span className="material-symbols-outlined text-[40px] text-primary/15 mb-3">
            {activeTab === "评论和@" ? "chat_bubble_outline" : activeTab === "点赞和顶" ? "thumb_up" : "notifications"}
          </span>
          <p className="text-[14px] text-secondary/50 text-center max-w-[260px]">
            {activeTab === "评论和@"
              ? "当有人评论、回复或 @你时，会在这里显示。"
              : activeTab === "点赞和顶"
              ? "当有人为你的作品点赞或顶时，会在这里显示。"
              : "当有人与你的作品或帖子互动时，会在这里显示。"}
          </p>
        </div>
      )}
    </>
  )
}
