import { cn } from "@/lib/utils"

type TextVariant =
  | "display"
  | "headline-lg"
  | "headline-md"
  | "headline-sm"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "label-lg"
  | "label-md"
  | "label-sm"

const variantStyles: Record<TextVariant, string> = {
  display: "font-headline text-5xl font-medium tracking-wide",
  "headline-lg": "font-headline text-4xl font-medium tracking-wide",
  "headline-md": "font-headline text-2xl font-semibold tracking-wide",
  "headline-sm": "font-headline text-xl font-semibold tracking-wider",
  "body-lg": "font-body text-base leading-relaxed",
  "body-md": "font-body text-sm leading-[1.5]",
  "body-sm": "font-body text-xs leading-[1.4]",
  "label-lg": "font-label text-xs uppercase tracking-[0.15em] font-bold",
  "label-md": "font-label text-[11px] uppercase tracking-[0.1em] font-bold",
  "label-sm":
    "font-label text-[10px] uppercase tracking-[0.15em] font-bold",
}

type TextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "label"

interface TextProps {
  variant?: TextVariant
  as?: TextElement
  className?: string
  children: React.ReactNode
}

export function Text({
  variant = "body-md",
  as: Component = "p",
  className,
  children,
}: TextProps) {
  return (
    <Component className={cn(variantStyles[variant], className)}>
      {children}
    </Component>
  )
}
