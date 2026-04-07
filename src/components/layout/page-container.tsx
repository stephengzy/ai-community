import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("max-w-6xl mx-auto px-4 lg:px-8 py-6", className)}>
      {children}
    </div>
  )
}
