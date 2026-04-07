import type { NavItem } from "@/types"

// ===== Navigation Items =====
export const desktopNavItems: NavItem[] = [
  { label: "作品集", href: "/", icon: "grid_view" },
  { label: "讨论广场", href: "/feed", icon: "forum" },
  { label: "提醒", href: "/notifications", icon: "notifications" },
]

export const mobileNavItems: NavItem[] = [
  { label: "作品集", href: "/", icon: "grid_view" },
  { label: "讨论广场", href: "/feed", icon: "forum" },
  { label: "我的", href: "/profile", icon: "person" },
]
