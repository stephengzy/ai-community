import { cn } from "@/lib/utils"

interface UpvoteIconProps {
  size?: number
  className?: string
  filled?: boolean
}

export function UpvoteIcon({ size = 18, className, filled = false }: UpvoteIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
    >
      <path d="M12 5l-7 9h4.5v5h5v-5H19l-7-9z" />
    </svg>
  )
}
