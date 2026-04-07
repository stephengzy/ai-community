"use client"

import { useState, useMemo } from "react"
import type { Post } from "@/types"
import { FeedTabs } from "@/components/feed/feed-tabs"
import { FeedFilterTags } from "@/components/feed/feed-filter-tags"
import { PostCard } from "@/components/cards/post-card"

interface FeedContentProps {
  posts: Post[]
  composer?: React.ReactNode
}

export function FeedContent({ posts, composer }: FeedContentProps) {
  const [activeTab, setActiveTab] = useState("Latest")
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredAndSortedPosts = useMemo(() => {
    let result = posts

    // Filter by department
    if (activeFilter !== "All") {
      result = result.filter(
        (post) =>
          post.author.department.toLowerCase() === activeFilter.toLowerCase()
      )
    }

    // Sort based on active tab
    result = [...result].sort((a, b) => {
      if (activeTab === "Trending") {
        return b.likes - a.likes
      }
      // "Latest" and "Following" both sort by date descending
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return result
  }, [posts, activeTab, activeFilter])

  return (
    <>
      <div className="sticky top-14 lg:top-0 z-30 bg-surface/90 backdrop-blur-md -mx-4 px-4 lg:-mx-6 lg:px-6 xl:-mx-10 xl:px-10 py-3 mb-4 border-b border-outline-variant/10">
        <FeedTabs onTabChange={setActiveTab} />
        <FeedFilterTags onFilterChange={setActiveFilter} />
      </div>
      {composer && <div className="mb-4">{composer}</div>}
      <div className="space-y-4">
        {filteredAndSortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}
