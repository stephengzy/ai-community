import { cn } from "@/lib/utils"

interface SponsorBadgeProps {
  className?: string
}

export function SponsorBadge({ className }: SponsorBadgeProps) {
  return (
    <span
      className={cn(
        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-primary/5 text-primary/60 rounded-full border border-primary/10",
        className
      )}
    >
      Sponsored
    </span>
  )
}
