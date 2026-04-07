import type { Comment } from "@/types"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { SponsorBadge } from "@/components/content/sponsor-badge"

interface SponsorCommentProps {
  comment: Comment
}

export function SponsorComment({ comment }: SponsorCommentProps) {
  return (
    <div className="bg-primary/[0.03] p-5 rounded-xl border border-primary/10 relative">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[16px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
          <UserHoverCard user={comment.author} showAvatar={false} nameClassName="text-sm font-bold text-on-surface cursor-pointer hover:underline" />
        </div>
        <SponsorBadge />
      </div>
      <p className="text-sm text-on-surface/80 leading-relaxed italic">
        {comment.content}
      </p>
    </div>
  )
}
