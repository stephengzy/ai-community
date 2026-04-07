"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PostComposer } from "@/components/feed/post-composer"
import { FeedContent } from "@/components/feed/feed-content"
import { MobileFab } from "@/components/feed/mobile-fab"
import { TrendingList } from "@/components/sidebar/trending-list"
import { TopBuilders } from "@/components/sidebar/top-builders"
import { usePosts, useUnreadNotificationCount, useCurrentUser } from "@/hooks/use-store"
import { cn } from "@/lib/utils"

export default function FeedPage() {
  const posts = usePosts()
  const pathname = usePathname()
  const unreadCount = useUnreadNotificationCount()
  const currentUser = useCurrentUser()

  return (
    <div className="flex">
      {/* Main Feed Column */}
      <div className="flex-1 min-w-0">
        <div className="py-4 px-4 lg:px-6 xl:px-10">
          <FeedContent
            posts={posts}
            composer={
              <div className="hidden lg:block">
                <PostComposer />
              </div>
            }
          />
        </div>
      </div>

      {/* Right Sidebar (desktop only) */}
      <aside className="hidden xl:block w-[340px] shrink-0 px-6 pt-4 pb-6 h-screen sticky top-0 overflow-y-auto hide-scrollbar border-l border-outline-variant/6">
        {/* Notification + Avatar */}
        <div className="flex items-center justify-end gap-2 mb-5">
          <Link
            href="/notifications"
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              pathname.startsWith("/notifications")
                ? "text-primary bg-surface-container"
                : "text-on-surface/45 hover:text-on-surface/70 hover:bg-surface-container/50"
            )}
          >
            <span className={cn("material-symbols-outlined text-[22px]", pathname.startsWith("/notifications") && "material-symbols-fill")}>
              notifications
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-on-primary text-[9px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className="block p-1 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </Link>
        </div>

        <TrendingList />
        <div className="mt-5"><TopBuilders /></div>
      </aside>

      {/* Mobile FAB */}
      <MobileFab />
    </div>
  )
}
