import type { Comment } from "@/types"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { cn } from "@/lib/utils"

interface CommentItemProps {
  comment: Comment
  className?: string
}

export function CommentItem({ comment, className }: CommentItemProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <UserHoverCard user={comment.author} avatarSize="md" nameClassName="text-[14px]" />
      <p className="text-[14px] text-on-surface/70 pl-[42px] leading-[1.8]">
        {comment.content}
      </p>
      <div className="pl-[42px]">
        <button
          type="button"
          className="flex items-center gap-1.5 text-[12px] text-on-surface/30 hover:text-primary/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">
            thumb_up
          </span>
          {comment.likes}
        </button>
      </div>
    </div>
  )
}
