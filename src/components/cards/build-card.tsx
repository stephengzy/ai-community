import Link from "next/link"
import type { Build } from "@/types"
import { Avatar } from "@/components/content/avatar"
import { UserHoverCard } from "@/components/content/user-hover-card"
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
        "group flex flex-col bg-surface-container-lowest border border-surface-container/50 shadow-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-outline-variant/12 h-full",
        className
      )}
    >
      {/* Cover image */}
      <div className="aspect-video overflow-hidden bg-surface-container-low relative shrink-0">
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
      <div className="flex flex-col flex-1 px-2.5 pt-2 pb-2.5 md:px-4 md:pt-3 md:pb-3.5 gap-1 md:gap-1.5">
        {/* Title */}
        <h3 className="text-[13px] md:text-[15px] font-semibold font-headline leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {build.name}
        </h3>

        {/* Description */}
        <div className="hidden md:block">
          <p className="text-[11px] md:text-[12px] text-on-surface/45 line-clamp-1 leading-relaxed">
            {build.description}
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer: author */}
        <div className="flex items-center gap-1.5 md:gap-2 pt-0.5 md:pt-1">
          <UserHoverCard user={build.author} avatarSize="sm" showAvatar={true} className="shrink-0">
            <Avatar src={build.author.avatar} name={build.author.name} size="sm" className="w-5 h-5 md:w-7 md:h-7 cursor-pointer" />
          </UserHoverCard>
          <UserHoverCard user={build.author} showAvatar={false} nameClassName="text-[10px] md:text-[11px] font-medium text-on-surface/55 cursor-pointer hover:underline" />
        </div>
      </div>
    </Link>
  )
}
