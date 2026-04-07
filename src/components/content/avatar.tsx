import { cn } from "@/lib/utils"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-4 h-4 text-[6px]",
  sm: "w-6 h-6 text-[8px]",
  md: "w-8 h-8 text-[10px]",
  lg: "w-10 h-10 text-[12px]",
  xl: "w-12 h-12 text-[14px]",
  "2xl": "w-32 h-32 text-[32px]",
}

interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  className?: string
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name.charAt(0)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover shrink-0",
          sizeStyles[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0",
        sizeStyles[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
