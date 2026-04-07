"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Visibility } from "@/types"

interface VisibilitySelectorProps {
  className?: string
  onChange?: (visibility: Visibility | null) => void
  error?: boolean
}

const options = [
  {
    value: "PUBLIC" as Visibility,
    label: "全公司可见",
    description: "所有员工都可以看到。",
    icon: "public",
  },
  {
    value: "DEPARTMENT" as Visibility,
    label: "仅部门可见",
    description: "仅限你所在部门的同事查看。",
    icon: "lock",
  },
]

export function VisibilitySelector({
  className,
  onChange,
  error,
}: VisibilitySelectorProps) {
  const [selected, setSelected] = useState<Visibility | null>(null)

  const handleChange = (value: Visibility) => {
    const next = selected === value ? null : value
    setSelected(next)
    onChange?.(next)
  }

  return (
    <div className={cn(className)}>
      <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
        可见范围 <span className="text-primary/50">*</span>
      </label>
      {error && (
        <p className="text-[12px] text-red-500 mb-2">请选择可见范围</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selected === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange(option.value)}
              className={cn(
                "flex flex-col items-start gap-2 px-5 py-4 rounded-xl border text-left transition-all duration-150 cursor-pointer select-none active:scale-[0.97]",
                isSelected
                  ? "border-primary/30 bg-primary/[0.06] shadow-sm"
                  : "border-outline-variant/30 hover:border-outline-variant/45 hover:bg-surface-container-low/50"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "material-symbols-outlined text-[20px]",
                    isSelected ? "text-primary" : "text-on-surface/70"
                  )}
                  style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {option.icon}
                </span>
                <span className={cn(
                  "text-[14px] font-headline font-semibold",
                  isSelected ? "text-primary" : "text-on-surface/70"
                )}>
                  {option.label}
                </span>
              </div>
              <p className={cn(
                "text-[12px] leading-relaxed",
                isSelected ? "text-primary/60" : "text-on-surface/55"
              )}>
                {option.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
