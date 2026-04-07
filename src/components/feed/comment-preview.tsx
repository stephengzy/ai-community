import type { Comment } from "@/types"
import { UserHoverCard } from "@/components/content/user-hover-card"

interface CommentPreviewProps {
  comment: Comment
}

export function CommentPreview({ comment }: CommentPreviewProps) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <UserHoverCard user={comment.author} avatarSize="xs" nameClassName="text-[13px]" />
        </div>
        <p className="text-sm text-on-surface/70 leading-relaxed line-clamp-2 pl-[22px]">
          {comment.content}
        </p>
      </div>
    </div>
  )
}
