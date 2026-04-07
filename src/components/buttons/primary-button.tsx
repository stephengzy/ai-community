import { cn } from "@/lib/utils"

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeStyles = {
  sm: "px-4 py-1.5 text-[10px]",
  md: "px-6 py-2.5 text-[11px]",
  lg: "px-8 py-3 text-[11px]",
}

export function PrimaryButton({
  children,
  className,
  size = "md",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "bg-primary text-on-primary rounded-lg uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-200 active:scale-95",
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
}
