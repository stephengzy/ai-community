export type Department =
  | "战略"
  | "公司管理"
  | "投资"
  | "产品"
  | "HR CoE"
  | "增长"

export type UserLevel = "L1" | "L2" | "IC"

export interface User {
  id: string
  name: string
  realName: string
  avatar: string
  department: Department
  role: string
  level: UserLevel
  bio?: string
}

export type BuildCategory =
  | "SKILL"
  | "DEMO"
  | "OTHER"

export type Visibility = "PUBLIC" | "DEPARTMENT"

export interface Build {
  id: string
  name: string
  description: string
  category: BuildCategory
  coverImage: string
  screenshots: string[]
  problem: string
  solution: string
  pitch?: string
  good?: string
  techStack: string[]
  author: User
  collaborators: User[]
  upvotes: number
  weeklyUpvotes: number
  downloads: number
  visibility: Visibility
  department?: Department
  demoUrl?: string
  attachments?: string[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  author: User
  content: string
  images?: string[]
  linkedBuild?: Build
  likes: number
  comments: Comment[]
  visibility: Visibility
  createdAt: string
}

export interface Comment {
  id: string
  author: User
  content: string
  isSponsor: boolean
  sponsorAmount?: number
  likes: number
  replyTo?: User
  replies?: Comment[]
  createdAt: string
}

// ── Notifications ─────────────────────────────────────────

export type NotificationType =
  | "upvote"
  | "like"
  | "comment"
  | "reply"
  | "mention"
  | "collaborator"
  | "sponsor"

export interface Notification {
  id: string
  type: NotificationType
  actor: User
  targetType: "post" | "build" | "comment"
  targetId?: string
  targetName?: string
  contentPreview?: string
  isRead: boolean
  createdAt: string
}

export type NavItem = {
  label: string
  href: string
  icon: string
}
