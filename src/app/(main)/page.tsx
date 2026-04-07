"use client"

import { PostComposer } from "@/components/feed/post-composer"
import { FeedContent } from "@/components/feed/feed-content"
import { MobileFab } from "@/components/feed/mobile-fab"
import { SearchBox } from "@/components/sidebar/search-box"
import { EventCarousel } from "@/components/sidebar/event-carousel"
import { TrendingList } from "@/components/sidebar/trending-list"
import { TopBuilders } from "@/components/sidebar/top-builders"
import { usePosts } from "@/hooks/use-store"

export default function FeedPage() {
  const posts = usePosts()

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
      <aside className="hidden xl:block w-[340px] shrink-0 px-6 pt-7 pb-6 h-screen sticky top-0 overflow-y-auto hide-scrollbar border-l border-outline-variant/10">
        <SearchBox />
        <div className="mt-8"><EventCarousel /></div>
        <div className="mt-5"><TrendingList /></div>
        <div className="mt-5"><TopBuilders /></div>
      </aside>

      {/* Mobile FAB */}
      <MobileFab />
    </div>
  )
}
