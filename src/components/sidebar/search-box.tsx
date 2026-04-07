"use client"

import { useState, useRef, useEffect } from "react"
import { useUsers, useBuilds, usePosts } from "@/hooks/use-store"
import { Avatar } from "@/components/content/avatar"
import { cn } from "@/lib/utils"

type ResultType = "post" | "user" | "build"

interface SearchResult {
  type: ResultType
  id: string
  title: string
  subtitle: string
  avatar?: string
  href: string
}

const typeLabels: Record<ResultType, string> = {
  user: "用户",
  build: "产品",
  post: "帖子",
}

const typeIcons: Record<ResultType, string> = {
  user: "person",
  build: "deployed_code",
  post: "article",
}

export function SearchBox() {
  const users = useUsers()
  const builds = useBuilds()
  const posts = usePosts()

  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const results: SearchResult[] = (() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const res: SearchResult[] = []

    for (const user of users) {
      if (
        user.name.toLowerCase().includes(q) ||
        user.realName.toLowerCase().includes(q) ||
        user.department.toLowerCase().includes(q)
      ) {
        res.push({
          type: "user",
          id: user.id,
          title: `${user.name}(${user.realName})`,
          subtitle: `${user.department} · ${user.role}`,
          avatar: user.avatar,
          href: "/profile",
        })
      }
    }

    for (const build of builds) {
      if (
        build.name.toLowerCase().includes(q) ||
        build.description.toLowerCase().includes(q)
      ) {
        res.push({
          type: "build",
          id: build.id,
          title: build.name,
          subtitle: build.description,
          href: `/builds/${build.id}`,
        })
      }
    }

    for (const post of posts) {
      if (post.content.toLowerCase().includes(q)) {
        res.push({
          type: "post",
          id: post.id,
          title: post.content.slice(0, 60) + (post.content.length > 60 ? "…" : ""),
          subtitle: `${post.author.name}(${post.author.realName})`,
          href: "/",
        })
      }
    }

    return res.slice(0, 8)
  })()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const showDropdown = focused && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <span className="material-symbols-outlined text-[18px] text-secondary absolute left-3 top-1/2 -translate-y-1/2">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search posts, people, builds"
          className="w-full pl-9 pr-3 py-2.5 text-[14px] bg-surface-container-lowest border border-outline-variant/15 rounded-lg text-on-surface placeholder:text-secondary/40 placeholder:font-headline placeholder:text-[14px] placeholder:tracking-tight focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors"
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-container-lowest border border-outline-variant/15 rounded-xl shadow-lg overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-[13px] text-secondary">
              未找到相关结果
            </div>
          ) : (
            <div className="py-1.5">
              {results.map((result) => (
                <a
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-surface-container-low/60 transition-colors"
                  onClick={() => {
                    setFocused(false)
                    setQuery("")
                  }}
                >
                  {result.type === "user" && result.avatar !== undefined ? (
                    <Avatar src={result.avatar} name={result.title} size="sm" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        {typeIcons[result.type]}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-on-surface truncate">
                      {result.title}
                    </p>
                    <p className="text-[11px] text-secondary truncate">{result.subtitle}</p>
                  </div>
                  <span className="text-[10px] text-secondary/50 shrink-0">
                    {typeLabels[result.type]}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
