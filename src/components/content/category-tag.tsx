import { cn } from "@/lib/utils"
import { categoryLabels } from "@/data/constants"

interface CategoryTagProps {
  category: string
  /** "sm" (default) or "xs" for compact inline usage */
  size?: "sm" | "xs"
  className?: string
}

export function CategoryTag({ category, size = "sm", className }: CategoryTagProps) {
  return (
    <span
      className={cn(
        "inline-block font-bold rounded uppercase text-primary border border-primary/20 bg-primary/10 shrink-0",
        size === "xs"
          ? "px-1.5 py-px text-[8px] tracking-tight"
          : "px-2 py-0.5 text-[10px] tracking-tighter",
        className
      )}
    >
      {categoryLabels[category] ?? category}
    </span>
  )
}
