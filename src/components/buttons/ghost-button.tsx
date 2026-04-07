import { cn } from "@/lib/utils"

interface GhostButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function GhostButton({
  children,
  className,
  ...props
}: GhostButtonProps) {
  return (
    <button
      className={cn(
        "border border-outline-variant/20 rounded-lg px-4 py-2 text-[11px] font-bold text-on-surface hover:bg-surface-container-low transition-all duration-200 active:scale-95",
        className
      )}
      {...props}
    />
  )
}
