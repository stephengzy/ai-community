"use client"

import { useState, useRef, useEffect } from "react"
import type { Post, Comment, User } from "@/types"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { Avatar } from "@/components/content/avatar"
import { ImageLightbox } from "@/components/content/image-lightbox"
import { BuildBar } from "@/components/cards/build-bar"
import { LikeButton } from "@/components/interactions/like-button"
import { ShareButton } from "@/components/interactions/share-button"
import { CommentInput } from "@/components/interactions/comment-input"
import { useCurrentUser, useUsers } from "@/hooks/use-store"
import { TOPIC_MAP } from "@/data/constants"
import { cn } from "@/lib/utils"

const PREVIEW_NON_SPONSOR = 1
const PREVIEW_REPLIES = 1

// Single source of truth for comment font size — change here to resize all comments
const COMMENT_TEXT_SIZE = "text-[14px]"

interface PostCardProps {
  post: Post
  className?: string
}

// ===== @ mention rendering =====
function MentionText({ text }: { text: string }) {
  const users = useUsers()
  // Match @Name patterns (Chinese + English + parentheses)
  const parts = text.split(/(@[\w\u4e00-\u9fff]+(?:\([\w\u4e00-\u9fff]+\))?)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("@")) {
          const mentionName = part.slice(1) // remove @
          // Try to find user by name
          const mentionedUser = users.find(
            (u) => mentionName === u.name || mentionName === `${u.name}(${u.realName})`
          )
          if (mentionedUser) {
            return <MentionTag key={i} user={mentionedUser} />
          }
          // Fallback: just show as styled text
          return (
            <span key={i} className="text-primary font-medium">
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function MentionTag({ user }: { user: User }) {
  return (
    <UserHoverCard
      user={user}
      avatarSize="xs"
      showAvatar={false}
      nameClassName="text-primary font-medium cursor-pointer hover:underline text-[inherit]"
      namePrefix="@"
    />
  )
}

export function PostCard({ post, className }: PostCardProps) {
  const currentUser = useCurrentUser()
  const [showMore, setShowMore] = useState(false)
  const [isClamped, setIsClamped] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>(post.comments)
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeAgo = getTimeAgo(post.createdAt)

  useEffect(() => {
    const el = contentRef.current
    if (el) {
      // Only show "Read More" if content overflows by at least one full line (~26px)
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 26
      setIsClamped(el.scrollHeight > el.clientHeight + lineHeight * 0.8)
    }
  }, [])

  const totalComments = comments.reduce(
    (sum, c) => sum + 1 + (c.replies?.length ?? 0),
    0
  )

  const handleCommentClick = () => {
    setShowInput(true)
    setReplyingTo(null)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId)
    setShowInput(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const findCommentById = (id: string): Comment | undefined => {
    for (const c of comments) {
      if (c.id === id) return c
      for (const r of c.replies ?? []) {
        if (r.id === id) return r
      }
    }
    return undefined
  }

  const handleSubmit = () => {
    if (!commentText.trim()) return

    const replyToComment = replyingTo ? findCommentById(replyingTo) : null

    const newComment: Comment = {
      id: `new-${Date.now()}`,
      author: currentUser,
      content: commentText.trim(),
      isSponsor: false,
      likes: 0,
      replyTo: replyToComment?.author,
      createdAt: new Date().toISOString(),
    }

    if (replyingTo) {
      const parentId = findTopLevelParent(replyingTo)
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies ?? []), newComment] }
            : c
        )
      )
      setExpandedReplies((prev) => new Set(prev).add(parentId))
    } else {
      setComments((prev) => [...prev, newComment])
    }
    setCommentText("")
    setReplyingTo(null)
  }

  const findTopLevelParent = (id: string): string => {
    const topLevel = comments.find((c) => c.id === id)
    if (topLevel) return id
    for (const c of comments) {
      if (c.replies?.some((r) => r.id === id)) return c.id
    }
    return id
  }

  const handleDelete = (commentId: string, replyId?: string) => {
    if (replyId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: c.replies?.filter((r) => r.id !== replyId) }
            : c
        )
      )
    } else {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    }
  }

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev)
      if (next.has(commentId)) next.delete(commentId)
      else next.add(commentId)
      return next
    })
  }

  const replyTarget = replyingTo ? findCommentById(replyingTo) : null

  // Which thread is being replied to? Used to position the input inline
  const replyThreadId = replyingTo ? findTopLevelParent(replyingTo) : null

  // Always show all sponsor comments; if none, show 1 non-sponsor comment
  const visibleComments = expanded
    ? comments
    : (() => {
        const sponsors = comments.filter((c) => c.isSponsor)
        if (sponsors.length > 0) return sponsors
        return comments.slice(0, PREVIEW_NON_SPONSOR)
      })()
  const hiddenCount = comments.length - visibleComments.length

  // Render the comment input
  const renderInput = (inline?: boolean) => (
    <CommentInput
      replyTarget={replyTarget}
      onCancelReply={() => setReplyingTo(null)}
      onSubmit={(text) => {
        setCommentText(text)
        // Trigger submit via the existing handleSubmit logic
        const replyToComment = replyingTo ? findCommentById(replyingTo) : null
        const newComment: Comment = {
          id: `new-${Date.now()}`,
          author: currentUser,
          content: text,
          isSponsor: false,
          likes: 0,
          replyTo: replyToComment?.author,
          createdAt: new Date().toISOString(),
        }
        if (replyingTo) {
          const parentId = findTopLevelParent(replyingTo)
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? { ...c, replies: [...(c.replies ?? []), newComment] }
                : c
            )
          )
          setExpandedReplies((prev) => new Set(prev).add(parentId))
        } else {
          setComments((prev) => [...prev, newComment])
        }
        setCommentText("")
        setReplyingTo(null)
      }}
      inline={inline}
      className={inline ? "mt-2" : "mt-2"}
    />
  )

  return (
    <article
      className={cn(
        "bg-surface-container-lowest rounded-xl border border-surface-container/50 shadow-sm px-5 py-4",
        className
      )}
    >
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-2">
        <UserHoverCard user={post.author} avatarSize="sm" nameClassName="text-[14px] tracking-tight" />
        <span className="text-[12px] text-secondary">{timeAgo}</span>
        <span className="text-[11px] text-secondary/40">
          {post.visibility === "DEPARTMENT" ? "Dept only" : "Public"}
        </span>
        {post.topicIds && post.topicIds.length > 0 && (
          <>
            <span className="text-[11px] text-secondary/20">·</span>
            {post.topicIds.map((tid) => {
              const topic = TOPIC_MAP[tid]
              if (!topic) return null
              return (
                <span key={tid} className="text-[11px] text-primary/50 font-medium">
                  {topic.emoji} {topic.name}
                </span>
              )
            })}
          </>
        )}
      </div>

      {/* Content */}
      <div className="mb-2">
        <p
          ref={contentRef}
          className={cn(
            "text-on-surface text-[15px] leading-[1.75]",
            !showMore && "line-clamp-3"
          )}
        >
          {post.content}
        </p>
        {isClamped && !showMore && (
          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="text-primary font-medium text-[14px] mt-0.5 cursor-pointer hover:underline"
          >
            Read More
          </button>
        )}
        {showMore && (
          <button
            type="button"
            onClick={() => setShowMore(false)}
            className="text-primary font-medium text-[14px] mt-0.5 cursor-pointer hover:underline"
          >
            Show less
          </button>
        )}
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="flex gap-1.5 mb-2 overflow-x-auto">
          {post.images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-surface-container-low cursor-zoom-in"
            >
              <img src={img} alt="Post image" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {lightboxIndex !== null && post.images && (
        <ImageLightbox
          images={post.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Linked Build */}
      {post.linkedBuild && (
        <BuildBar build={post.linkedBuild} className="mb-2" />
      )}

      {/* Interaction Bar */}
      <div className="flex items-center gap-1 pt-1">
        <LikeButton count={post.likes} />
        <button
          type="button"
          onClick={handleCommentClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-secondary hover:bg-surface-container hover:text-primary transition-all"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>chat_bubble_outline</span>
          <span className="text-[13px]">{totalComments}</span>
        </button>
        <ShareButton />
      </div>

      {/* Comments Section */}
      {(comments.length > 0 || showInput) && (
        <div className="border-t border-outline-variant/6 pt-2 mt-2">
          {/* Top-level comment input — appears at the top */}
          {showInput && !replyingTo && renderInput()}

          {visibleComments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
              repliesExpanded={expandedReplies.has(comment.id)}
              onToggleReplies={() => toggleReplies(comment.id)}
              inputSlot={
                showInput && replyThreadId === comment.id
                  ? renderInput(true)
                  : null
              }
            />
          ))}

          {/* Expand / Collapse */}
          {!expanded && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-[13px] text-secondary hover:text-primary font-medium mt-1 transition-colors"
            >
              View all {totalComments} comments →
            </button>
          )}
          {expanded && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-[13px] text-secondary hover:text-primary font-medium mt-1 transition-colors"
            >
              Collapse comments
            </button>
          )}
        </div>
      )}
    </article>
  )
}

// ===== Comment Thread =====

function CommentThread({
  comment,
  onReply,
  onDelete,
  repliesExpanded,
  onToggleReplies,
  inputSlot,
}: {
  comment: Comment
  onReply: (id: string) => void
  onDelete: (commentId: string, replyId?: string) => void
  repliesExpanded: boolean
  onToggleReplies: () => void
  inputSlot: React.ReactNode
}) {
  const replies = comment.replies ?? []
  const hasMoreReplies = replies.length > PREVIEW_REPLIES
  const visibleReplies = repliesExpanded ? replies : replies.slice(0, PREVIEW_REPLIES)
  const hiddenReplyCount = replies.length - PREVIEW_REPLIES

  return (
    <div className="py-1">
      <CommentItem
        comment={comment}
        onReply={() => onReply(comment.id)}
        onDelete={() => onDelete(comment.id)}
      />
      {(replies.length > 0 || inputSlot) && (
        <div className="pl-9 mt-0.5 border-l-2 border-outline-variant/6 ml-3.5">
          {visibleReplies.map((reply) => (
            <ReplyItem
              key={reply.id}
              comment={reply}
              parentAuthor={comment.author}
              onReply={() => onReply(reply.id)}
              onDelete={() => onDelete(comment.id, reply.id)}
            />
          ))}
          {hasMoreReplies && !repliesExpanded && (
            <button
              type="button"
              onClick={onToggleReplies}
              className="text-[12px] text-secondary hover:text-primary font-medium py-1 pl-1 transition-colors"
            >
              View {hiddenReplyCount} more {hiddenReplyCount === 1 ? "reply" : "replies"}
            </button>
          )}
          {repliesExpanded && hasMoreReplies && (
            <button
              type="button"
              onClick={onToggleReplies}
              className="text-[12px] text-secondary hover:text-primary font-medium py-1 pl-1 transition-colors"
            >
              Hide replies
            </button>
          )}
          {inputSlot}
        </div>
      )}
    </div>
  )
}

function CommentItem({
  comment,
  onReply,
  onDelete,
}: {
  comment: Comment
  onReply?: () => void
  onDelete?: () => void
}) {
  const currentUser = useCurrentUser()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likes)
  const isOwnComment = comment.author.id === currentUser.id

  const toggleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const formatTokens = (amount: number) => {
    if (amount >= 1000) return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
    return String(amount)
  }

  return (
    <div className={cn(
      "flex items-start gap-2 py-2 group/comment",
      comment.isSponsor && "border-l-2 border-l-primary/50 pl-3 -ml-0.5 bg-primary/[0.03] rounded-r-lg py-2.5 pr-3"
    )}>
      <UserHoverCard user={comment.author} avatarSize="sm" showAvatar={true} className="shrink-0">
        <Avatar
          src={comment.author.avatar}
          name={comment.author.name}
          size="sm"
          className="mt-0.5 cursor-pointer"
        />
      </UserHoverCard>
      <div className="flex-1 min-w-0">
        <div className={cn(COMMENT_TEXT_SIZE, "text-on-surface leading-[1.6]")}>
          <UserHoverCard user={comment.author} showAvatar={false} nameClassName={cn("font-semibold text-on-surface cursor-pointer hover:underline", COMMENT_TEXT_SIZE)} />
          <span className="ml-1.5"><MentionText text={comment.content} /></span>
        </div>
        <div className="flex items-center flex-wrap gap-y-1 justify-between mt-0.5">
          <div className="flex items-center gap-3 text-[11px] text-secondary/50 flex-wrap">
            <span>{getTimeAgo(comment.createdAt)}</span>
            {onReply && (
              <button
                type="button"
                onClick={onReply}
                className="hover:text-primary transition-colors"
              >
                Reply
              </button>
            )}
            {isOwnComment && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="hover:text-error transition-colors opacity-0 group-hover/comment:opacity-100"
              >
                Delete
              </button>
            )}
            {comment.isSponsor && comment.sponsorAmount && (
              <span className="inline-flex items-center gap-1 text-primary/80">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
                <span className="font-semibold">Sponsored {formatTokens(comment.sponsorAmount)} tokens</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={toggleLike}
            className={cn(
              "flex items-center gap-1 text-secondary/60 hover:text-primary transition-colors shrink-0",
              liked && "text-primary"
            )}
          >
            <span
              className={cn(
                "material-symbols-outlined text-[9px]",
                liked ? "material-symbols-fill" : ""
              )}
              style={{ fontVariationSettings: "'wght' 300" }}
            >
              thumb_up
            </span>
            {likeCount > 0 && (
              <span className="text-[11px]">{likeCount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function ReplyItem({
  comment,
  parentAuthor,
  onReply,
  onDelete,
}: {
  comment: Comment
  parentAuthor: User
  onReply?: () => void
  onDelete?: () => void
}) {
  const currentUser = useCurrentUser()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likes)
  const isOwnComment = comment.author.id === currentUser.id
  const replyToUser = comment.replyTo

  const toggleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <div className="flex items-start gap-2 py-1.5 group/comment">
      <UserHoverCard user={comment.author} avatarSize="sm" showAvatar={true} className="shrink-0">
        <Avatar
          src={comment.author.avatar}
          name={comment.author.name}
          size="sm"
          className="mt-0.5 cursor-pointer"
        />
      </UserHoverCard>
      <div className="flex-1 min-w-0">
        <div className={cn(COMMENT_TEXT_SIZE, "text-on-surface leading-[1.6]")}>
          <UserHoverCard user={comment.author} showAvatar={false} nameClassName={cn("font-semibold cursor-pointer hover:underline", COMMENT_TEXT_SIZE)} />
          {replyToUser && (
            <span className={cn("text-secondary/50 font-normal mx-1", COMMENT_TEXT_SIZE)}>回复</span>
          )}
          {replyToUser && (
            <UserHoverCard user={replyToUser} showAvatar={false} nameClassName={cn("font-semibold cursor-pointer hover:underline", COMMENT_TEXT_SIZE)} />
          )}
          <span className="ml-1.5"><MentionText text={comment.content} /></span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-3 text-[11px] text-secondary/50">
            <span>{getTimeAgo(comment.createdAt)}</span>
            {onReply && (
              <button
                type="button"
                onClick={onReply}
                className="hover:text-primary transition-colors"
              >
                Reply
              </button>
            )}
            {isOwnComment && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="hover:text-error transition-colors opacity-0 group-hover/comment:opacity-100"
              >
                Delete
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={toggleLike}
            className={cn(
              "flex items-center gap-1 text-secondary/60 hover:text-primary transition-colors shrink-0",
              liked && "text-primary"
            )}
          >
            <span
              className={cn(
                "material-symbols-outlined text-[9px]",
                liked ? "material-symbols-fill" : ""
              )}
              style={{ fontVariationSettings: "'wght' 300" }}
            >
              thumb_up
            </span>
            {likeCount > 0 && (
              <span className="text-[11px]">{likeCount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 30) return `${Math.floor(diffDays / 30)}m ago`
  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  return "just now"
}
