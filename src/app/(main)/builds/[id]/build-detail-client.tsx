"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import type { Comment, User } from "@/types"
import { useBuild, usePosts, useCurrentUser, useUsers } from "@/hooks/use-store"
import { PageContainer } from "@/components/layout/page-container"
import { ContentSection } from "@/components/build-detail/content-section"
import { StickySidebar } from "@/components/build-detail/sticky-sidebar"
import { PostCard } from "@/components/cards/post-card"
import { Avatar } from "@/components/content/avatar"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { CommentInput } from "@/components/interactions/comment-input"
import { ImageLightbox } from "@/components/content/image-lightbox"
import { cn } from "@/lib/utils"

// ===== Helpers =====

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays > 30) return `${Math.floor(diffDays / 30)}个月前`
  if (diffDays > 0) return `${diffDays}天前`
  if (diffHours > 0) return `${diffHours}小时前`
  return "刚刚"
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

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
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 left-3 w-8 h-8 rounded-full bg-surface/95 border border-outline-variant/8 shadow-md items-center justify-center text-on-surface/50 hover:text-primary hover:border-primary/30 transition-all backdrop-blur-sm opacity-0 group-hover/scroll:opacity-100"
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
            className="snap-start shrink-0 w-full sm:w-[80%] aspect-video rounded-xl overflow-hidden bg-surface-container-low cursor-zoom-in"
            onClick={() => setLightboxIndex(i)}
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
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 right-3 w-8 h-8 rounded-full bg-surface/95 border border-outline-variant/8 shadow-md items-center justify-center text-on-surface/50 hover:text-primary hover:border-primary/30 transition-all backdrop-blur-sm opacity-0 group-hover/scroll:opacity-100"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
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
    <div className="flex items-start gap-2 py-2 group/comment">
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
        <div className={cn(COMMENT_TEXT_SIZE, "text-on-surface leading-[1.6]")}>
          <UserHoverCard
            user={comment.author}
            showAvatar={false}
            nameClassName={cn("font-semibold text-on-surface cursor-pointer hover:underline", COMMENT_TEXT_SIZE)}
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
                回复
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
          size="sm"
          className="mt-0.5 cursor-pointer"
        />
      </UserHoverCard>
      <div className="flex-1 min-w-0">
        <div className={cn(COMMENT_TEXT_SIZE, "text-on-surface leading-[1.6]")}>
          <UserHoverCard
            user={comment.author}
            showAvatar={false}
            nameClassName={cn("font-semibold text-on-surface cursor-pointer hover:underline", COMMENT_TEXT_SIZE)}
          />
          {replyToUser && replyToUser.id !== parentAuthor.id && (
            <span className={cn("text-secondary/50 font-normal mx-1", COMMENT_TEXT_SIZE)}>
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
                回复
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

// Single source of truth for comment font size — change here to resize all comments
const COMMENT_TEXT_SIZE = "text-[14px]"

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
        <div className="pl-9 mt-0.5 border-l-2 border-outline-variant/6 ml-3.5">
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
              查看其余 {hiddenCount} 条回复
            </button>
          )}
          {showAllReplies && hasMoreReplies && (
            <button
              type="button"
              onClick={() => setShowAllReplies(false)}
              className="text-[12px] text-secondary hover:text-primary font-medium py-1 pl-1 transition-colors"
            >
              收起回复
            </button>
          )}
          {inputSlot}
        </div>
      )}
    </div>
  )
}

// ===== Main Component =====

type BottomTab = "comments" | "posts"

export function BuildDetailClient({ buildId }: { buildId: string }) {
  const build = useBuild(buildId)
  const posts = usePosts()
  const currentUser = useCurrentUser()
  const [activeTab, setActiveTab] = useState<BottomTab>("comments")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [buildComments, setBuildComments] = useState<Comment[] | null>(null)
  const isOwner = build?.author.id === currentUser.id

  if (!build) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-[48px] text-primary/15 mb-4">
            error
          </span>
          <p className="text-[14px] text-on-surface/40">未找到该作品</p>
        </div>
      </PageContainer>
    )
  }

  // Initialize local comments state from build data
  const comments = buildComments ?? build.comments ?? []

  // Related posts that link to this build
  const relatedPosts = posts.filter((p) => p.linkedBuild?.id === build.id)

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
      placeholder="说说你的看法..."
      inline={inline}
      className={inline ? "mt-2" : ""}
    />
  )

  const tabs: { key: BottomTab; label: string; count: number }[] = [
    { key: "comments", label: "评论", count: comments.length },
    { key: "posts", label: "相关帖子", count: relatedPosts.length },
  ]

  return (
    <PageContainer>
      {/* Mobile sticky header */}
      <div className="sticky top-0 z-40 lg:hidden bg-surface/90 backdrop-blur-xl -mx-4 px-4 py-3 flex items-center gap-3 border-b border-outline-variant/6">
        <Link
          href="/"
          className="text-on-surface/50 hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
        </Link>
        <p className="flex-1 text-[14px] font-headline font-semibold truncate">
          {build.name}
        </p>
        {isOwner && (
          <Link
            href={`/builds/${build.id}/edit`}
            className="shrink-0 p-1.5 text-on-surface/50 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </Link>
        )}
        <span className="shrink-0 bg-primary text-on-primary text-[12px] font-semibold px-2.5 py-1 rounded-full">
          {build.upvotes}
        </span>
      </div>

      <div className="flex gap-10">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Notice banner */}
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary/[0.05] border border-primary/10">
            <span className="material-symbols-outlined text-[18px] text-primary/50">info</span>
            <p className="text-[13px] text-on-surface/50">作品详情页以 CoWork 的整体作品详情页面为准，此处仅供参考</p>
          </div>

          {/* Hero */}
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden lg:flex items-center gap-2 text-on-surface/40 hover:text-on-surface/70 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_back
                </span>
              </Link>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <h1 className="font-headline text-[36px] font-semibold text-on-surface tracking-tight leading-[1.2]">
                  {build.name}
                </h1>
                <p className="text-[14px] text-on-surface/50 leading-[1.8] font-body max-w-2xl">
                  {build.description}
                </p>
              </div>
              {isOwner && (
                <Link
                  href={`/builds/${build.id}/edit`}
                  className="hidden lg:flex items-center gap-2 shrink-0 px-4 py-2 rounded-xl border border-outline-variant/15 text-[13px] font-headline font-semibold text-on-surface/55 hover:bg-surface-container hover:text-on-surface/80 hover:border-outline-variant/40 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  修改作品
                </Link>
              )}
            </div>
          </header>

          {/* Image Gallery (cover + screenshots) */}
          <ImageGallery
            images={[build.coverImage, ...build.screenshots]}
            alt={build.name}
          />

          {/* ===== 作品简介 ===== */}
          <section className="space-y-6">
            {build.description && (
              <ContentSection label="一句话介绍">{build.description}</ContentSection>
            )}

            <ContentSection label="项目介绍">
              {build.pitch || build.problem}
              {build.solution && build.pitch !== build.solution && (
                <>{"\n\n"}{build.solution}</>
              )}
            </ContentSection>
          </section>

          {/* ===== Tabs ===== */}
          <section className="pb-10">
            {/* Tab header */}
            <div className="flex items-center border-b border-outline-variant/8 mb-6">
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
                    暂无评论，来说说你的看法吧
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
                    暂无相关帖子
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
