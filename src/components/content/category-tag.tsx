import { cn } from "@/lib/utils"
import { categoryLabels } from "@/data/constants"

interface CategoryTagProps {
  category: string
  /** "sm" (default) or "xs" for compact inline usage */
  size?: "sm" | "xs"
  className?: string
}

export function CategoryTag({ category, size = "sm", className }: CategoryTagProps) {
  const isDemo = category === "DEMO"
  return (
    <span
      className={cn(
        "inline-block font-semibold rounded-full shrink-0",
        isDemo
          ? "text-demo bg-demo/8"
          : "text-primary bg-primary/8",
        size === "xs"
          ? "px-1.5 py-px text-[9px]"
          : "px-2.5 py-0.5 text-[11px]",
        className
      )}
    >
      {categoryLabels[category] ?? category}
    </span>
  )
}
