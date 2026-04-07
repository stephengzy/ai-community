"use client"

import { useTopBuilders } from "@/hooks/use-store"
import { Avatar } from "@/components/content/avatar"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"

export function TopBuilders() {
  const topBuilders = useTopBuilders(5)

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
      <div className="px-5 pt-4 pb-3">
        <h4 className="text-base font-headline font-semibold tracking-tight text-on-surface">
          Trending Builders This Week
        </h4>
      </div>
      <div>
        {topBuilders.map((entry) => (
          <div
            key={entry.user.id}
            className="flex items-center gap-3 px-5 py-3 border-t border-outline-variant/8"
          >
            <UserHoverCard user={entry.user} avatarSize="md" showAvatar={true} className="shrink-0">
              <Avatar src={entry.user.avatar} name={entry.user.name} size="md" className="cursor-pointer" />
            </UserHoverCard>
            <div className="flex-1 min-w-0">
              <UserHoverCard user={entry.user} showAvatar={false} nameClassName="text-[13px] font-semibold text-on-surface leading-snug cursor-pointer hover:underline" />
              <div className="flex items-center gap-3 mt-0.5 text-[11px] text-secondary">
                <span>{entry.builds} builds</span>
                <span className="flex items-center gap-1">
                  <UpvoteIcon size={10} className="text-primary/50" filled />
                  +{entry.weeklyUpvotes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
