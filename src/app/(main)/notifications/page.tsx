"use client"

import { NotificationContent } from "@/components/notifications/notification-content"

export default function NotificationsPage() {
  return (
    <div className="flex-1 min-w-0">
      <div className="py-4 px-4 lg:px-6 xl:px-10">
        <NotificationContent />
      </div>
    </div>
  )
}
