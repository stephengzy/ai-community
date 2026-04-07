"use client"

import { useState } from "react"
import type { Build } from "@/types"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"
import { Avatar } from "@/components/content/avatar"
import { CategoryTag } from "@/components/content/category-tag"
import { cn } from "@/lib/utils"

interface StickySidebarProps {
  build: Build
  className?: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function StickySidebar({ build, className }: StickySidebarProps) {
  const [upvoted, setUpvoted] = useState(false)
  const [following, setFollowing] = useState(false)
  const displayUpvotes = build.upvotes + (upvoted ? 1 : 0)
  return (
    <div className={cn("sticky top-8 space-y-4", className)}>

      {/* Upvote */}
      <button
        type="button"
        onClick={() => setUpvoted(!upvoted)}
        className={cn(
          "w-full flex items-center gap-4 p-5 rounded-2xl transition-all cursor-pointer group",
          upvoted
            ? "bg-surface-container-low border border-outline-variant/8"
            : "bg-surface-container-low border border-transparent hover:border-primary/15 hover:bg-primary/[0.03]"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
          upvoted
            ? "bg-surface-container"
            : "bg-surface-container group-hover:bg-primary/10"
        )}>
          <UpvoteIcon
            size={22}
            className={cn(
              "transition-colors",
              upvoted ? "text-primary" : "text-on-surface/60 group-hover:text-primary/60"
            )}
            filled={upvoted}
          />
        </div>
        <div className="text-left">
          <span className={cn(
            "text-[24px] font-headline font-semibold leading-none",
            upvoted ? "text-primary" : "text-on-surface"
          )}>
            {displayUpvotes.toLocaleString()}
          </span>
          <p className={cn(
            "text-[12px] mt-0.5 transition-colors",
            upvoted ? "text-primary/60" : "text-on-surface/30 group-hover:text-on-surface/50"
          )}>
            {upvoted ? "You upvoted this" : "Upvote this build"}
          </p>
        </div>
      </button>

      {/* Author */}
      <div className="bg-surface-container-low rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar src={build.author.avatar} name={build.author.name} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-headline font-semibold text-on-surface truncate">
              {build.author.name}({build.author.realName})
            </p>
            <p className="text-[12px] text-on-surface/35 truncate">
              {build.author.department} · {build.author.role}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFollowing(!following)}
          className={cn(
            "w-full py-2.5 rounded-xl text-[14px] font-headline font-semibold transition-all",
            following
              ? "border border-outline-variant/15 text-on-surface/45 hover:text-on-surface/70"
              : "bg-primary text-on-primary hover:opacity-90"
          )}
        >
          {following ? "Following" : "Follow"}
        </button>

        {/* Collaborators */}
        {build.collaborators.length > 0 && (
          <div className="pt-3 border-t border-outline-variant/6">
            <p className="text-[12px] text-on-surface/30 mb-2.5">Collaborators</p>
            <div className="space-y-2">
              {build.collaborators.map((user) => (
                <div key={user.id} className="flex items-center gap-2.5">
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <span className="text-[13px] text-on-surface/55 truncate">
                    {user.name}({user.realName})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Links */}
      {build.demoUrl && (
        <div className="bg-surface-container-low rounded-2xl p-5 space-y-3">
          <p className="text-[12px] text-on-surface/30">Links</p>
          <a
            href={build.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-outline-variant/8 hover:border-primary/25 hover:bg-primary/[0.03] transition-all group"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface/30 group-hover:text-primary/60 transition-colors">open_in_new</span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-on-surface/65 group-hover:text-on-surface truncate">Live Demo</p>
              <p className="text-[11px] text-on-surface/20 truncate">{build.demoUrl.replace(/^https?:\/\//, "")}</p>
            </div>
          </a>
        </div>
      )}

      {/* Meta info */}
      <div className="bg-surface-container-low rounded-2xl p-5 space-y-3">
        <p className="text-[12px] text-on-surface/30">Details</p>

        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface/35">Published</span>
          <span className="text-[12px] text-on-surface/60 font-medium">{formatDate(build.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface/35">Updated</span>
          <span className="text-[12px] text-on-surface/60 font-medium">{formatDate(build.updatedAt)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface/35">Version</span>
          <span className="text-[12px] text-on-surface/60 font-medium">v1.0</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface/35">Category</span>
          <CategoryTag category={build.category} />
        </div>

        {build.techStack.length > 0 && (
          <div className="pt-2 border-t border-outline-variant/5">
            <p className="text-[12px] text-on-surface/35 mb-2">Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {build.techStack.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-full border border-outline-variant/8 text-[11px] text-on-surface/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
