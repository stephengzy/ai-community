import { cn } from "@/lib/utils"

interface TechTagProps {
  label: string
  className?: string
}

export function TechTag({ label, className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-block bg-secondary-container text-on-surface-variant text-[9px] px-2 py-1 rounded-sm font-label uppercase font-medium",
        className
      )}
    >
      {label}
    </span>
  )
}
