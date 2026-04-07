/**
 * Normalized store types.
 * All cross-entity references use IDs (strings) instead of embedded objects.
 * The original types in @/types remain as "view model" types for component props.
 */

import type { BuildLink, Department, NotificationType, UserLevel, Visibility } from "@/types"

// ── Entities (normalized) ──────────────────────────────────

/** User is already flat — no embedded references */
export interface NUser {
  id: string
  name: string
  realName: string
  avatar: string
  department: Department
  subDepartment?: string
  role: string
  level: UserLevel
  bio?: string
}

export interface NBuild {
  id: string
  name: string
  description: string
  coverImage: string
  iconImage: string
  screenshots: string[]
  problem: string
  solution: string
  pitch?: string
  good?: string
  techStack: string[]
  authorId: string
  collaboratorIds: string[]
  upvotes: number
  weeklyUpvotes: number
  monthlyUpvotes: number
  downloads: number
  visibility: Visibility
  department?: Department
  links?: BuildLink[]

  attachments?: string[]
  version: string
  commentIds: string[]
  createdAt: string
  updatedAt: string
}

export interface NPost {
  id: string
  authorId: string
  content: string
  images?: string[]
  linkedBuildId?: string
  likes: number
  commentIds: string[] // top-level comment IDs only
  visibility: Visibility
  department?: string

  createdAt: string
}

export interface NComment {
  id: string
  postId?: string // back-reference (post comments)
  buildId?: string // back-reference (build comments)
  authorId: string
  content: string
  likes: number
  replyToUserId?: string
  parentId?: string // null for top-level
  replyIds: string[] // child comment IDs
  createdAt: string
}

export interface NNotification {
  id: string
  type: NotificationType
  actorId: string
  targetType: "post" | "build" | "comment"
  targetId?: string
  targetName?: string
  contentPreview?: string
  isRead: boolean
  createdAt: string
}

// ── Curated / Editorial ────────────────────────────────────

export interface NEditorsPick {
  id: string
  title: string
  description: string
  emoji: string
  buildIds: string[]
}

// ── Store State ────────────────────────────────────────────

export interface StoreState {
  // Entity tables
  users: Record<string, NUser>
  builds: Record<string, NBuild>
  posts: Record<string, NPost>
  comments: Record<string, NComment>

  // Session
  currentUserId: string

  // Curated
  editorsPicks: NEditorsPick[]

  // Notifications
  notifications: NNotification[]

  // Social
  followedUserIds: string[]

  // Interaction tracking (client-side)
  likedPostIds: string[]
  likedCommentIds: string[]
  upvotedBuildIds: string[]
}

// ── Actions ────────────────────────────────────────────────

export interface StoreActions {
  // Users
  updateUser: (userId: string, patch: Partial<Omit<NUser, "id">>) => void
  toggleFollow: (userId: string) => void

  // Builds
  createBuild: (data: Omit<NBuild, "id" | "version" | "createdAt" | "updatedAt" | "upvotes" | "weeklyUpvotes" | "monthlyUpvotes" | "downloads">) => string
  updateBuild: (buildId: string, patch: Partial<Omit<NBuild, "id">>) => void
  toggleUpvote: (buildId: string) => void

  // Posts
  createPost: (data: { content: string; images?: string[]; linkedBuildId?: string; visibility: Visibility }) => string
  updatePost: (postId: string, patch: Partial<Pick<NPost, "content" | "images" | "visibility">>) => void
  deletePost: (postId: string) => void
  togglePostLike: (postId: string) => void

  // Comments
  addComment: (postId: string, content: string) => string
  addReply: (parentCommentId: string, content: string) => string
  deleteComment: (commentId: string) => void
  toggleCommentLike: (commentId: string) => void
  // Notifications
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void

  // Editor's Picks
  updateEditorsPicks: (picks: NEditorsPick[]) => void

  // Identity
  setCurrentUserId: (userId: string) => void
}

export type Store = StoreState & StoreActions
