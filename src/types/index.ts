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
  subDepartment?: string
  role: string
  level: UserLevel
  bio?: string
}

export type Visibility = "PUBLIC" | "DEPARTMENT"

export interface Build {
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
  author: User
  collaborators: User[]
  upvotes: number
  weeklyUpvotes: number
  monthlyUpvotes: number
  downloads: number
  visibility: Visibility
  department?: Department
  links?: BuildLink[]

  attachments?: string[]
  version: string
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
  department?: string

  createdAt: string
}

export interface Comment {
  id: string
  author: User
  content: string
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

export interface BuildLink {
  label: string
  url: string
}

export type NavItem = {
  label: string
  href: string
  icon: string
}
