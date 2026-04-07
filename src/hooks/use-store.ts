/**
 * Typed convenience hooks for store access.
 * These denormalize data back into the "view model" shapes components expect.
 *
 * Key: selectors passed to useStore must return stable references.
 * We use useMemo for denormalization, not inline selectors that create new objects.
 */

import { useMemo } from "react"
import { useStore } from "@/store"
import type { User, Build, Post, Comment, Notification } from "@/types"
import type { NComment, NNotification, StoreState } from "@/store/types"

// ── Denormalization helpers (pure functions, used in useMemo) ──

function toUser(users: StoreState["users"], userId: string): User {
  const u = users[userId]
  if (!u) {
    return { id: userId, name: "Unknown", realName: "", avatar: "", department: "战略", role: "", level: "IC" }
  }
  return { ...u }
}

function toBuild(state: StoreState, buildId: string): Build | undefined {
  const b = state.builds[buildId]
  if (!b) return undefined
  return {
    ...b,
    author: toUser(state.users, b.authorId),
    collaborators: b.collaboratorIds.map((id) => toUser(state.users, id)),
    comments: b.commentIds
      .map((cid) => state.comments[cid])
      .filter(Boolean)
      .map((nc) => toComment(state, nc)),
  }
}

function toComment(state: StoreState, nc: NComment): Comment {
  return {
    id: nc.id,
    author: toUser(state.users, nc.authorId),
    content: nc.content,
    likes: nc.likes,
    replyTo: nc.replyToUserId ? toUser(state.users, nc.replyToUserId) : undefined,
    replies: nc.replyIds
      .map((rid) => state.comments[rid])
      .filter(Boolean)
      .map((r) => toComment(state, r)),
    createdAt: nc.createdAt,
  }
}

function toPost(state: StoreState, postId: string): Post | undefined {
  const p = state.posts[postId]
  if (!p) return undefined
  const linkedBuild = p.linkedBuildId ? toBuild(state, p.linkedBuildId) : undefined
  return {
    id: p.id,
    author: toUser(state.users, p.authorId),
    content: p.content,
    images: p.images,
    linkedBuild,
    likes: p.likes,
    comments: p.commentIds
      .map((cid) => state.comments[cid])
      .filter(Boolean)
      .map((nc) => toComment(state, nc)),
    visibility: p.visibility,
    department: p.department,
    createdAt: p.createdAt,
  }
}

// ── Hooks ──────────────────────────────────────────────────

/** Current logged-in user */
export function useCurrentUser(): User {
  const users = useStore((s) => s.users)
  const currentUserId = useStore((s) => s.currentUserId)
  return useMemo(() => toUser(users, currentUserId), [users, currentUserId])
}

/** Single user by ID */
export function useUser(userId: string): User {
  const users = useStore((s) => s.users)
  return useMemo(() => toUser(users, userId), [users, userId])
}

/** All users as array */
export function useUsers(): User[] {
  const users = useStore((s) => s.users)
  return useMemo(() => Object.values(users), [users])
}

/** Single build (denormalized) */
export function useBuild(buildId: string): Build | undefined {
  const builds = useStore((s) => s.builds)
  const users = useStore((s) => s.users)
  const comments = useStore((s) => s.comments)
  return useMemo(() => {
    const state = { builds, users, comments } as StoreState
    return toBuild(state, buildId)
  }, [builds, users, comments, buildId])
}

/** All builds (denormalized), as array */
export function useBuilds(): Build[] {
  const builds = useStore((s) => s.builds)
  const users = useStore((s) => s.users)
  const comments = useStore((s) => s.comments)
  return useMemo(() => {
    const state = { builds, users, comments } as StoreState
    return Object.values(builds)
      .map((b) => toBuild(state, b.id)!)
      .filter(Boolean)
  }, [builds, users, comments])
}

/** Builds by a specific user (as author or collaborator) */
export function useBuildsByUser(userId: string): Build[] {
  const builds = useStore((s) => s.builds)
  const users = useStore((s) => s.users)
  const comments = useStore((s) => s.comments)
  return useMemo(() => {
    const state = { builds, users, comments } as StoreState
    return Object.values(builds)
      .filter((b) => b.authorId === userId || b.collaboratorIds.includes(userId))
      .map((b) => toBuild(state, b.id)!)
      .filter(Boolean)
  }, [builds, users, comments, userId])
}

/** Single post (denormalized) */
export function usePost(postId: string): Post | undefined {
  const state = useStore()
  return useMemo(() => toPost(state, postId), [state, postId])
}

/** All posts (denormalized), sorted newest first */
export function usePosts(): Post[] {
  const posts = useStore((s) => s.posts)
  const comments = useStore((s) => s.comments)
  const builds = useStore((s) => s.builds)
  const users = useStore((s) => s.users)
  return useMemo(() => {
    const state = { posts, comments, builds, users } as StoreState
    return Object.values(posts)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((p) => toPost(state, p.id)!)
      .filter(Boolean)
  }, [posts, comments, builds, users])
}

/** Posts by a specific user */
export function usePostsByUser(userId: string): Post[] {
  const posts = useStore((s) => s.posts)
  const comments = useStore((s) => s.comments)
  const builds = useStore((s) => s.builds)
  const users = useStore((s) => s.users)
  return useMemo(() => {
    const state = { posts, comments, builds, users } as StoreState
    return Object.values(posts)
      .filter((p) => p.authorId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((p) => toPost(state, p.id)!)
      .filter(Boolean)
  }, [posts, comments, builds, users, userId])
}

/** Trending builds (sorted by weeklyUpvotes) */
export function useTrendingBuilds(limit = 5): Build[] {
  const builds = useStore((s) => s.builds)
  const users = useStore((s) => s.users)
  const comments = useStore((s) => s.comments)
  return useMemo(() => {
    const state = { builds, users, comments } as StoreState
    return Object.values(builds)
      .sort((a, b) => b.weeklyUpvotes - a.weeklyUpvotes)
      .slice(0, limit)
      .map((b) => toBuild(state, b.id)!)
      .filter(Boolean)
  }, [builds, users, comments, limit])
}

/** Top builders (computed from builds data) */
export function useTopBuilders(limit = 5) {
  const builds = useStore((s) => s.builds)
  const users = useStore((s) => s.users)
  return useMemo(() => {
    const builderMap = new Map<string, { weeklyUpvotes: number; buildCount: number }>()
    for (const b of Object.values(builds)) {
      // Collect all contributors: author + collaborators (deduplicated)
      const contributorIds = new Set([b.authorId, ...b.collaboratorIds])
      for (const userId of contributorIds) {
        const existing = builderMap.get(userId)
        if (existing) {
          existing.weeklyUpvotes += b.weeklyUpvotes
          existing.buildCount += 1
        } else {
          builderMap.set(userId, { weeklyUpvotes: b.weeklyUpvotes, buildCount: 1 })
        }
      }
    }
    return Array.from(builderMap.entries())
      .sort(([, a], [, b]) => b.weeklyUpvotes - a.weeklyUpvotes)
      .slice(0, limit)
      .map(([userId, data]) => ({
        user: toUser(users, userId),
        weeklyUpvotes: data.weeklyUpvotes,
        builds: data.buildCount,
      }))
  }, [builds, users, limit])
}

/** Editor's picks with denormalized builds */
export function useEditorsPicks() {
  const editorsPicks = useStore((s) => s.editorsPicks)
  const builds = useStore((s) => s.builds)
  const users = useStore((s) => s.users)
  const comments = useStore((s) => s.comments)
  return useMemo(() => {
    const state = { builds, users, comments } as StoreState
    return editorsPicks.map((ep) => ({
      id: ep.id,
      title: ep.title,
      description: ep.description,
      emoji: ep.emoji,
      builds: ep.buildIds
        .map((bid) => toBuild(state, bid)!)
        .filter(Boolean),
    }))
  }, [editorsPicks, builds, users, comments])
}

/** Builds upvoted by current user */
export function useUpvotedBuilds(): Build[] {
  const upvotedBuildIds = useStore((s) => s.upvotedBuildIds)
  const builds = useStore((s) => s.builds)
  const users = useStore((s) => s.users)
  const comments = useStore((s) => s.comments)
  return useMemo(() => {
    const state = { builds, users, comments } as StoreState
    return upvotedBuildIds
      .map((bid) => toBuild(state, bid)!)
      .filter(Boolean)
  }, [upvotedBuildIds, builds, users, comments])
}

// ── Notification hooks ────────────────────────────────────

function toNotification(users: StoreState["users"], nn: NNotification): Notification {
  return {
    id: nn.id,
    type: nn.type,
    actor: toUser(users, nn.actorId),
    targetType: nn.targetType,
    targetId: nn.targetId,
    targetName: nn.targetName,
    contentPreview: nn.contentPreview,
    isRead: nn.isRead,
    createdAt: nn.createdAt,
  }
}

/** All notifications, sorted newest first */
export function useNotifications(): Notification[] {
  const notifications = useStore((s) => s.notifications)
  const users = useStore((s) => s.users)
  return useMemo(
    () =>
      [...notifications]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((nn) => toNotification(users, nn)),
    [notifications, users]
  )
}

/** Count of unread notifications */
export function useUnreadNotificationCount(): number {
  return useStore((s) => s.notifications.filter((n) => !n.isRead).length)
}

/** Check if current user has liked a post */
export function useIsPostLiked(postId: string): boolean {
  return useStore((s) => s.likedPostIds.includes(postId))
}

/** Check if current user has upvoted a build */
export function useIsBuildUpvoted(buildId: string): boolean {
  return useStore((s) => s.upvotedBuildIds.includes(buildId))
}

/** Check if current user has liked a comment */
export function useIsCommentLiked(commentId: string): boolean {
  return useStore((s) => s.likedCommentIds.includes(commentId))
}

// ── Actions (convenience re-exports) ─────────────────────

/** Returns all store actions — stable reference, never re-renders */
export function useActions() {
  return useStore((s) => ({
    updateUser: s.updateUser,
    toggleFollow: s.toggleFollow,
    createBuild: s.createBuild,
    updateBuild: s.updateBuild,
    toggleUpvote: s.toggleUpvote,
    createPost: s.createPost,
    updatePost: s.updatePost,
    deletePost: s.deletePost,
    togglePostLike: s.togglePostLike,
    addComment: s.addComment,
    addReply: s.addReply,
    deleteComment: s.deleteComment,
    toggleCommentLike: s.toggleCommentLike,
    markNotificationRead: s.markNotificationRead,
    markAllNotificationsRead: s.markAllNotificationsRead,
    updateEditorsPicks: s.updateEditorsPicks,
    setCurrentUserId: s.setCurrentUserId,
  }))
}
