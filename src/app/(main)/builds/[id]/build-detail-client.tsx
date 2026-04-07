"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import type { Comment, User } from "@/types"
import { useBuild, usePosts, useCurrentUser, useUsers } from "@/hooks/use-store"
import { PageContainer } from "@/components/layout/page-container"
import { CategoryTag } from "@/components/content/category-tag"
import { ContentSection } from "@/components/build-detail/content-section"
import { StickySidebar } from "@/components/build-detail/sticky-sidebar"
import { PostCard } from "@/components/cards/post-card"
import { Avatar } from "@/components/content/avatar"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { CommentInput } from "@/components/interactions/comment-input"
import { cn } from "@/lib/utils"

// ===== Helpers =====

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

function formatTokens(amount: number) {
  if (amount >= 1000)
    return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
  return String(amount)
}

// ===== @ mention rendering =====

function MentionText({ text }: { text: string }) {
  const allUsers = useUsers()
  const parts = text.split(/(@[\w\u4e00-\u9fff]+(?:\([\w\u4e00-\u9fff]+\))?)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("@")) {
          const mentionName = part.slice(1)
          const mentionedUser = allUsers.find(
            (u) =>
              mentionName === u.name ||
              mentionName === `${u.name}(${u.realName})`
          )
          if (mentionedUser) {
            return (
              <span
                key={i}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                @{mentionedUser.name}({mentionedUser.realName})
              </span>
            )
          }
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

// ===== Section Divider =====

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
      <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">
        {title}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
    </div>
  )
}

// ===== Image Gallery (horizontal scroll, peek last image) =====

function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = direction === "left" ? -360 : 360
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
  }

  if (images.length === 0) return null

  return (
    <div className="relative group/scroll">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 left-3 w-8 h-8 rounded-full bg-surface/95 border border-outline-variant/15 shadow-md items-center justify-center text-on-surface/50 hover:text-primary hover:border-primary/30 transition-all backdrop-blur-sm opacity-0 group-hover/scroll:opacity-100"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory"
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="snap-start shrink-0 w-full sm:w-[80%] aspect-video rounded-xl overflow-hidden bg-surface-container-low"
          >
            <img
              src={src}
              alt={`${alt} ${i === 0 ? "cover" : `screenshot ${i}`}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 right-3 w-8 h-8 rounded-full bg-surface/95 border border-outline-variant/15 shadow-md items-center justify-center text-on-surface/50 hover:text-primary hover:border-primary/30 transition-all backdrop-blur-sm opacity-0 group-hover/scroll:opacity-100"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
    </div>
  )
}

// ===== Comment Item (matches Feed style) =====

function BuildCommentItem({
  comment,
  onReply,
}: {
  comment: Comment
  onReply?: (comment: Comment) => void
}) {
  const currentUser = useCurrentUser()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likes)

  const toggleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <div className="flex items-start gap-2.5 py-2 group/comment">
      <UserHoverCard
        user={comment.author}
        avatarSize="sm"
        showAvatar={true}
        className="shrink-0"
      >
        <Avatar
          src={comment.author.avatar}
          name={comment.author.name}
          size="sm"
          className="mt-0.5 cursor-pointer"
        />
      </UserHoverCard>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] text-on-surface leading-[1.6]">
          <UserHoverCard
            user={comment.author}
            showAvatar={false}
            nameClassName="font-semibold text-on-surface text-[15px] cursor-pointer hover:underline"
          />
          <span className="ml-1.5">
            <MentionText text={comment.content} />
          </span>
        </div>
        <div className="flex items-center flex-wrap gap-y-1 justify-between mt-0.5">
          <div className="flex items-center gap-3 text-[11px] text-secondary/50 flex-wrap">
            <span>{getTimeAgo(comment.createdAt)}</span>
            {onReply && (
              <button
                type="button"
                onClick={() => onReply(comment)}
                className="hover:text-primary transition-colors"
              >
                Reply
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

// ===== Reply Item (matches Feed style) =====

function BuildReplyItem({
  comment,
  parentAuthor,
  onReply,
}: {
  comment: Comment
  parentAuthor: User
  onReply?: (comment: Comment) => void
}) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likes)

  const toggleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const replyToUser = comment.replyTo

  return (
    <div className="flex items-start gap-2 py-1.5 group/comment">
      <UserHoverCard
        user={comment.author}
        avatarSize="sm"
        showAvatar={true}
        className="shrink-0"
      >
        <Avatar
          src={comment.author.avatar}
          name={comment.author.name}
          size="xs"
          className="mt-0.5 cursor-pointer"
        />
      </UserHoverCard>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] text-on-surface leading-[1.6]">
          <UserHoverCard
            user={comment.author}
            showAvatar={false}
            nameClassName="font-semibold text-on-surface text-[14px] cursor-pointer hover:underline"
          />
          {replyToUser && replyToUser.id !== parentAuthor.id && (
            <span className="text-secondary/50 font-normal mx-1 text-[13px]">
              {">"} @{replyToUser.name}({replyToUser.realName})
            </span>
          )}
          <span className="ml-1.5">
            <MentionText text={comment.content} />
          </span>
        </div>
        <div className="flex items-center flex-wrap gap-y-1 justify-between mt-0.5">
          <div className="flex items-center gap-3 text-[11px] text-secondary/50">
            <span>{getTimeAgo(comment.createdAt)}</span>
            {onReply && (
              <button
                type="button"
                onClick={() => onReply(comment)}
                className="hover:text-primary transition-colors"
              >
                Reply
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

// ===== Comment Thread (top-level comment + replies + inline input) =====

const PREVIEW_REPLIES = 1

function CommentThread({
  comment,
  onReply,
  inputSlot,
}: {
  comment: Comment
  onReply: (comment: Comment) => void
  inputSlot?: React.ReactNode
}) {
  const [showAllReplies, setShowAllReplies] = useState(false)
  const replies = comment.replies || []
  const hasMoreReplies = replies.length > PREVIEW_REPLIES
  const visibleReplies = showAllReplies ? replies : replies.slice(0, PREVIEW_REPLIES)
  const hiddenCount = replies.length - PREVIEW_REPLIES

  return (
    <div className="py-1">
      <BuildCommentItem comment={comment} onReply={onReply} />
      {(replies.length > 0 || inputSlot) && (
        <div className="pl-9 mt-0.5 border-l-2 border-outline-variant/10 ml-3.5">
          {visibleReplies.map((reply) => (
            <BuildReplyItem
              key={reply.id}
              comment={reply}
              parentAuthor={comment.author}
              onReply={onReply}
            />
          ))}
          {hasMoreReplies && !showAllReplies && (
            <button
              type="button"
              onClick={() => setShowAllReplies(true)}
              className="text-[12px] text-secondary hover:text-primary font-medium py-1 pl-1 transition-colors"
            >
              View {hiddenCount} more{" "}
              {hiddenCount === 1 ? "reply" : "replies"}
            </button>
          )}
          {showAllReplies && hasMoreReplies && (
            <button
              type="button"
              onClick={() => setShowAllReplies(false)}
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

// ===== Sponsor Comment (from post, feed-style with border) =====

function SponsorCommentItem({ comment }: { comment: Comment }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likes)

  return (
    <div className="border-l-2 border-l-primary/50 pl-3 -ml-0.5 bg-primary/[0.03] rounded-r-lg py-2.5 pr-3">
      <div className="flex items-start gap-2.5">
        <UserHoverCard
          user={comment.author}
          avatarSize="sm"
          showAvatar={true}
          className="shrink-0"
        >
          <Avatar
            src={comment.author.avatar}
            name={comment.author.name}
            size="sm"
            className="mt-0.5 cursor-pointer"
          />
        </UserHoverCard>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] text-on-surface leading-[1.6]">
            <UserHoverCard
              user={comment.author}
              showAvatar={false}
              nameClassName="font-semibold text-on-surface text-[15px] cursor-pointer hover:underline"
            />
            <span className="ml-1.5">
              <MentionText text={comment.content} />
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-y-1 justify-between mt-0.5">
            <div className="flex items-center gap-3 text-[11px] text-secondary/50 flex-wrap">
              <span>{getTimeAgo(comment.createdAt)}</span>
              {comment.sponsorAmount && (
                <span className="inline-flex items-center gap-1 text-primary/80">
                  <span
                    className="material-symbols-outlined text-[12px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    toll
                  </span>
                  <span className="font-semibold">
                    Sponsored {formatTokens(comment.sponsorAmount)} tokens
                  </span>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setLiked(!liked)
                setLikeCount(liked ? likeCount - 1 : likeCount + 1)
              }}
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
    </div>
  )
}

// ===== Main Component =====

type BottomTab = "comments" | "sponsors" | "posts"

export function BuildDetailClient({ buildId }: { buildId: string }) {
  const build = useBuild(buildId)
  const posts = usePosts()
  const currentUser = useCurrentUser()
  const [activeTab, setActiveTab] = useState<BottomTab>("comments")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [buildComments, setBuildComments] = useState<Comment[] | null>(null)

  if (!build) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-[48px] text-primary/15 mb-4">
            error
          </span>
          <p className="text-[14px] text-on-surface/40">Build not found</p>
        </div>
      </PageContainer>
    )
  }

  // Initialize local comments state from build data
  const comments = buildComments ?? build.comments ?? []

  // Related posts that link to this build
  const relatedPosts = posts.filter((p) => p.linkedBuild?.id === build.id)

  // Sponsor comments from related posts (sponsors live at the post level)
  const sponsorComments = relatedPosts.flatMap((p) =>
    p.comments.filter((c) => c.isSponsor)
  )

  // ── Reply helpers ──

  const findCommentById = (id: string): Comment | undefined => {
    for (const c of comments) {
      if (c.id === id) return c
      for (const r of c.replies ?? []) {
        if (r.id === id) return r
      }
    }
    return undefined
  }

  const findTopLevelParent = (id: string): string => {
    const topLevel = comments.find((c) => c.id === id)
    if (topLevel) return id
    for (const c of comments) {
      if (c.replies?.some((r) => r.id === id)) return c.id
    }
    return id
  }

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment.id)
  }

  const replyTarget = replyingTo ? findCommentById(replyingTo) : null
  const replyThreadId = replyingTo ? findTopLevelParent(replyingTo) : null

  const handleSubmit = (text: string) => {
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
      setBuildComments(
        comments.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies ?? []), newComment] }
            : c
        )
      )
    } else {
      setBuildComments([...comments, newComment])
    }
    setReplyingTo(null)
  }

  // ── Input renderer (inline or top-level) ──

  const renderInput = (inline?: boolean) => (
    <CommentInput
      replyTarget={replyTarget}
      onCancelReply={() => setReplyingTo(null)}
      onSubmit={handleSubmit}
      placeholder="Share your thoughts on this build..."
      inline={inline}
      className={inline ? "mt-2" : ""}
    />
  )

  const tabs: { key: BottomTab; label: string; count: number }[] = [
    { key: "comments", label: "Comments", count: comments.length },
    { key: "sponsors", label: "Sponsors", count: sponsorComments.length },
    { key: "posts", label: "Related Posts", count: relatedPosts.length },
  ]

  return (
    <PageContainer>
      {/* Mobile sticky header */}
      <div className="sticky top-0 z-40 lg:hidden bg-surface/90 backdrop-blur-xl -mx-4 px-4 py-3 flex items-center gap-3 border-b border-outline-variant/10">
        <Link
          href="/gallery"
          className="text-on-surface/50 hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
        </Link>
        <p className="flex-1 text-[14px] font-headline font-semibold truncate">
          {build.name}
        </p>
        <span className="shrink-0 bg-primary text-on-primary text-[12px] font-semibold px-2.5 py-1 rounded-full">
          {build.upvotes}
        </span>
      </div>

      <div className="flex gap-10">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Hero */}
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/gallery"
                className="hidden lg:flex items-center gap-2 text-on-surface/40 hover:text-on-surface/70 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_back
                </span>
              </Link>
              <CategoryTag category={build.category} />
            </div>
            <h1 className="font-headline text-[36px] font-semibold text-on-surface tracking-tight leading-[1.2]">
              {build.name}
            </h1>
            <p className="text-[14px] text-on-surface/50 leading-[1.8] font-body max-w-2xl">
              {build.description}
            </p>
          </header>

          {/* Image Gallery (cover + screenshots) */}
          <ImageGallery
            images={[build.coverImage, ...build.screenshots]}
            alt={build.name}
          />

          {/* ===== The Story ===== */}
          <section className="space-y-6">
            <SectionDivider title="The Story" />

            {build.pitch && (
              <ContentSection label="The Pitch">{build.pitch}</ContentSection>
            )}

            <ContentSection label="The Problem">
              {build.problem}
            </ContentSection>

            <ContentSection label="The Solution">
              {build.solution}
            </ContentSection>
          </section>

          {/* ===== Tabs ===== */}
          <section className="pb-10">
            {/* Tab header */}
            <div className="flex items-center border-b border-outline-variant/15 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-5 py-3 text-[14px] font-headline font-semibold transition-colors relative",
                    activeTab === tab.key
                      ? "text-primary"
                      : "text-on-surface/35 hover:text-on-surface/60"
                  )}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-1.5 text-[12px] font-body font-normal text-on-surface/25">
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Comments tab ── */}
            {activeTab === "comments" && (
              <div className="space-y-0">
                {/* Always-visible input at the top */}
                {!replyingTo && (
                  <div className="mb-4">
                    {renderInput()}
                  </div>
                )}

                {/* Comment threads with inline input for replies */}
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentThread
                      key={comment.id}
                      comment={comment}
                      onReply={handleReply}
                      inputSlot={
                        replyThreadId === comment.id
                          ? renderInput(true)
                          : null
                      }
                    />
                  ))
                ) : (
                  <p className="text-[14px] text-on-surface/30 italic text-center py-6">
                    No comments yet. Be the first to share your thoughts.
                  </p>
                )}
              </div>
            )}

            {/* ── Sponsors tab ── */}
            {activeTab === "sponsors" && (
              <div className="space-y-3">
                {sponsorComments.length > 0 ? (
                  sponsorComments.map((comment) => (
                    <SponsorCommentItem key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="text-[14px] text-on-surface/30 italic text-center py-6">
                    No sponsors yet.
                  </p>
                )}
              </div>
            )}

            {/* ── Related Posts tab ── */}
            {activeTab === "posts" && (
              <div className="space-y-4">
                {relatedPosts.length > 0 ? (
                  relatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <p className="text-[14px] text-on-surface/30 italic text-center py-6">
                    No posts mentioning this build yet.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Right sidebar — desktop only */}
        <div className="hidden lg:block w-[260px] shrink-0">
          <StickySidebar build={build} />
        </div>
      </div>
    </PageContainer>
  )
}
