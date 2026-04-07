import { cn } from "@/lib/utils"

interface UserBadgeProps {
  department: string
  className?: string
}

export function UserBadge({ department, className }: UserBadgeProps) {
  return (
    <span
      className={cn(
        "text-[9px] text-on-surface/40 uppercase tracking-wider font-bold",
        className
      )}
    >
      {department}
    </span>
  )
}
