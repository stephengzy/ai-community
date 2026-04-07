import { cn } from "@/lib/utils"

interface ContentSectionProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function ContentSection({
  label,
  children,
  className,
}: ContentSectionProps) {
  return (
    <article className={cn("space-y-3", className)}>
      <h3 className="text-[18px] font-headline font-semibold text-on-surface">
        {label}
      </h3>
      <div className="text-[14px] text-on-surface/70 leading-[1.8] font-body">
        {children}
      </div>
    </article>
  )
}
