import { TechTag } from "@/components/content/tech-tag"
import { cn } from "@/lib/utils"

interface TechStackListProps {
  techStack: string[]
  className?: string
}

export function TechStackList({ techStack, className }: TechStackListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-[18px] font-headline font-semibold text-on-surface">
        Tech Stack
      </h3>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <TechTag key={tech} label={tech} />
        ))}
      </div>
    </div>
  )
}
