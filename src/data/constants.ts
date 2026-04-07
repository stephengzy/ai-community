import type { NavItem } from "@/types"

// ===== Category Labels =====
export const categoryLabels: Record<string, string> = {
  SKILL: "Skill",
  DEMO: "Demo",
  OTHER: "Other",
}

export const categoryIcons: Record<string, string> = {
  SKILL: "psychology",
  DEMO: "deployed_code",
  OTHER: "category",
}

export const categoryDescriptions: Record<string, string> = {
  SKILL: "工作提效的workflow、技术和工具",
  DEMO: "小红书产品功能的原型演示",
  OTHER: "其他值得分享的作品",
}

// ===== Navigation Items =====
export const desktopNavItems: NavItem[] = [
  { label: "Posts", href: "/", icon: "home" },
  { label: "Builds Gallery", href: "/gallery", icon: "grid_view" },
  { label: "Notifications", href: "/notifications", icon: "notifications" },
]

export const desktopNavMeItems: NavItem[] = [
  { label: "My Builds", href: "/profile", icon: "construction" },
  { label: "My Upvotes", href: "/profile?tab=upvotes", icon: "arrow_upward" },
]

export const mobileNavItems: NavItem[] = [
  { label: "Posts", href: "/", icon: "home" },
  { label: "Gallery", href: "/gallery", icon: "grid_view" },
  { label: "Profile", href: "/profile", icon: "person" },
]
