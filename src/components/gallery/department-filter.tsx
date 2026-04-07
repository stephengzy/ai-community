"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const departments = [
  "All Departments",
  "战略",
  "公司管理",
  "投资",
  "产品",
  "HR CoE",
  "增长",
]

interface DepartmentFilterProps {
  className?: string
  onDepartmentChange?: (dept: string) => void
}

export function DepartmentFilter({
  className,
  onDepartmentChange,
}: DepartmentFilterProps) {
  const [active, setActive] = useState("All Departments")

  return (
    <div className={cn("flex gap-1.5 flex-wrap", className)}>
      {departments.map((dept) => (
        <button
          key={dept}
          type="button"
          onClick={() => {
            setActive(dept)
            onDepartmentChange?.(dept)
          }}
          className={cn(
            "px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200",
            active === dept
              ? "bg-primary/10 text-primary font-semibold"
              : "text-on-surface/40 hover:text-on-surface/70 hover:bg-surface-container-low"
          )}
        >
          {dept}
        </button>
      ))}
    </div>
  )
}
