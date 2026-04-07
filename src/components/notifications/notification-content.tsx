"use client"

import { useState, useMemo } from "react"
import { NotificationTabs } from "./notification-tabs"
import { NotificationItem } from "./notification-item"
import { useNotifications, useUnreadNotificationCount } from "@/hooks/use-store"
import { useStore } from "@/store"

export function NotificationContent() {
  const [activeTab, setActiveTab] = useState("All")
  const notifications = useNotifications()
  const unreadCount = useUnreadNotificationCount()
  const markNotificationRead = useStore((s) => s.markNotificationRead)
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead)

  const filteredNotifications = useMemo(() => {
    if (activeTab === "Mentions") {
      return notifications.filter((n) => n.type === "mention")
    }
    return notifications
  }, [notifications, activeTab])

  return (
    <>
      {/* Sticky header */}
      <div className="sticky top-14 lg:top-0 z-30 bg-surface/90 backdrop-blur-md -mx-4 px-4 lg:-mx-6 lg:px-6 xl:-mx-10 xl:px-10 border-b border-outline-variant/10">
        <div className="flex items-center justify-between py-3">
          <h1 className="text-[18px] font-headline font-semibold text-on-surface tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-[13px] text-primary font-medium hover:text-primary/70 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
        <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} className="-mx-4 lg:-mx-6 xl:-mx-10" />
      </div>

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
            {activeTab === "Mentions" ? "alternate_email" : "notifications"}
          </span>
          <p className="text-[14px] text-secondary/50 text-center max-w-[260px]">
            {activeTab === "Mentions"
              ? "When someone @mentions you in a post or comment, it will show up here."
              : "When someone interacts with your builds or posts, you'll see it here."}
          </p>
        </div>
      )}
    </>
  )
}
