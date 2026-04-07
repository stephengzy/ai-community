import Link from "next/link"
import type { Build } from "@/types"
import { Avatar } from "@/components/content/avatar"
import { CategoryTag } from "@/components/content/category-tag"
import { UpvoteButton } from "@/components/interactions/upvote-button"
import { cn } from "@/lib/utils"

interface BuildCardProps {
  build: Build
  /** Optional badge text shown top-right of the content area (e.g. "Collaborator") */
  badge?: string
  className?: string
}

export function BuildCard({ build, badge, className }: BuildCardProps) {
  return (
    <Link
      href={`/builds/${build.id}`}
      className={cn(
        "group block bg-surface-container-lowest border border-outline-variant/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-outline-variant/20",
        className
      )}
    >
      {/* Cover image — consistent aspect-video across all usages */}
      <div className="aspect-video overflow-hidden bg-surface-container-low relative">
        <img
          src={build.coverImage}
          alt={build.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <UpvoteButton count={build.upvotes} variant="badge" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-3.5 space-y-1.5">
        {/* Category + badge */}
        <div className="flex items-center justify-between">
          <CategoryTag category={build.category} />
          {badge && (
            <span className="text-[10px] text-secondary/50 font-medium">
              {badge}
            </span>
          )}
        </div>

        {/* Title — 2 lines max to accommodate longer names */}
        <h3 className="text-[15px] font-semibold font-headline leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {build.name}
        </h3>

        {/* Description */}
        <p className="text-[12px] text-on-surface/45 line-clamp-1 leading-relaxed">
          {build.description}
        </p>

        {/* Footer: author */}
        <div className="flex items-center gap-2 pt-1">
          <Avatar src={build.author.avatar} name={build.author.name} size="sm" />
          <span className="text-[11px] font-medium text-on-surface/55">
            {build.author.name}({build.author.realName})
          </span>
        </div>
      </div>
    </Link>
  )
}
