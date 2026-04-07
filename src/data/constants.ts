import type { NavItem } from "@/types"

// ===== Category Labels =====
export const categoryLabels: Record<string, string> = {
  SKILL: "Skill",
  DEMO: "Demo",
  OTHER: "Other",
}

export const categoryDescriptions: Record<string, string> = {
  SKILL: "Your hard-earned expertise, distilled into a reusable AI capability.",
  DEMO: "From idea to working product — built on or inspired by REDnote.",
  OTHER: "Everything else worth sharing.",
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
