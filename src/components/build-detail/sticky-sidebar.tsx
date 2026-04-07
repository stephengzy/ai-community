"use client"

import { useState } from "react"
import type { Build } from "@/types"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"
import { Avatar } from "@/components/content/avatar"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { cn } from "@/lib/utils"

interface StickySidebarProps {
  build: Build
  className?: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function StickySidebar({ build, className }: StickySidebarProps) {
  const [upvoted, setUpvoted] = useState(false)
  const displayUpvotes = build.upvotes + (upvoted ? 1 : 0)
  return (
    <div className={cn("sticky top-8 space-y-4 pt-10", className)}>

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
            upvoted ? "text-primary/60" : "text-on-surface/40 group-hover:text-on-surface/55"
          )}>
            {upvoted ? "已顶" : "顶一下"}
          </p>
        </div>
      </button>

      {/* Author */}
      <div className="bg-surface-container-low rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <UserHoverCard user={build.author} avatarSize="lg" showAvatar={true} className="shrink-0">
            <Avatar src={build.author.avatar} name={build.author.name} size="lg" className="cursor-pointer" />
          </UserHoverCard>
          <div className="flex-1 min-w-0">
            <UserHoverCard user={build.author} showAvatar={false} nameClassName="text-[14px] font-headline font-semibold text-on-surface cursor-pointer hover:underline" />
            <p className="text-[12px] text-on-surface/45 truncate">
              {build.author.department} · {build.author.role}
            </p>
          </div>
        </div>
        {/* Collaborators */}
        {build.collaborators.length > 0 && (
          <div className="pt-3 border-t border-outline-variant/6">
            <p className="text-[12px] text-on-surface/45 mb-2.5">合作者</p>
            <div className="space-y-2">
              {build.collaborators.map((user) => (
                <div key={user.id} className="flex items-center gap-2.5">
                  <UserHoverCard user={user} avatarSize="sm" showAvatar={true} className="shrink-0">
                    <Avatar src={user.avatar} name={user.name} size="sm" className="cursor-pointer" />
                  </UserHoverCard>
                  <UserHoverCard user={user} showAvatar={false} nameClassName="text-[13px] text-on-surface/55 cursor-pointer hover:underline" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Links */}
      {build.links && build.links.length > 0 && (
        <div className="bg-surface-container-low rounded-2xl p-5 space-y-3">
          <p className="text-[12px] text-on-surface/45">作品链接</p>
          <div className="space-y-2">
            {build.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-outline-variant/8 hover:border-primary/20 hover:bg-primary/[0.03] transition-all group"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface/30 group-hover:text-primary/60 transition-colors">
                  link
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-on-surface/80 group-hover:text-primary transition-colors">
                    {link.label}
                  </p>
                  <p className="text-[11px] text-on-surface/35 truncate">
                    {link.url.replace(/^https?:\/\//, "")}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[14px] text-on-surface/25 group-hover:text-primary/40 transition-colors">
                  open_in_new
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Meta info */}
      <div className="bg-surface-container-low rounded-2xl p-5 space-y-3">
        <p className="text-[12px] text-on-surface/45">详细信息</p>

        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface/45">发布时间</span>
          <span className="text-[12px] text-on-surface/70 font-medium">{formatDate(build.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface/45">更新时间</span>
          <span className="text-[12px] text-on-surface/70 font-medium">{formatDate(build.updatedAt)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface/45">版本</span>
          <span className="text-[12px] text-on-surface/70 font-medium">v{build.version}</span>
        </div>

        {build.techStack.length > 0 && (
          <div className="pt-2 border-t border-outline-variant/6">
            <p className="text-[12px] text-on-surface/45 mb-2">关键词</p>
            <div className="flex flex-wrap gap-1.5">
              {build.techStack.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-full border border-outline-variant/10 text-[11px] text-on-surface/55"
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
