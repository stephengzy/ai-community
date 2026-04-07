"use client"

import { useState, useMemo } from "react"
import type { Post } from "@/types"
import { FeedTabs } from "@/components/feed/feed-tabs"
import { PostCard } from "@/components/cards/post-card"

interface FeedContentProps {
  posts: Post[]
  composer?: React.ReactNode
}

export function FeedContent({ posts, composer }: FeedContentProps) {
  const [activeTab, setActiveTab] = useState("最新")
  const sortedPosts = useMemo(() => {
    if (activeTab === "最热") {
      const now = Date.now()
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      const recent: Post[] = []
      const older: Post[] = []
      for (const p of posts) {
        if (now - new Date(p.createdAt).getTime() <= sevenDays) {
          recent.push(p)
        } else {
          older.push(p)
        }
      }
      recent.sort((a, b) => b.likes - a.likes)
      older.sort((a, b) => b.likes - a.likes)
      return [...recent, ...older]
    }
    return [...posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [posts, activeTab])

  return (
    <>
      <div className="lg:sticky lg:top-0 z-30 lg:bg-surface/90 lg:backdrop-blur-md -mx-4 px-4 lg:-mx-6 lg:px-6 xl:-mx-10 xl:px-10 py-3 mb-4 lg:border-b lg:border-outline-variant/6">
        <FeedTabs onTabChange={setActiveTab} />
      </div>
      {composer && <div className="mb-4">{composer}</div>}
      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}
