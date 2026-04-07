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
  const [activeTab, setActiveTab] = useState("Latest")

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (activeTab === "Trending") {
        return b.likes - a.likes
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
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
