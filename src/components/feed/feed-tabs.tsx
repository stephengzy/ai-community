"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { TOPICS, TOPIC_MAP } from "@/data/constants"
import type { Department } from "@/types"

const tabs = ["Latest", "Trending", "Following"] as const

const DEPARTMENTS: Department[] = ["战略", "公司管理", "投资", "产品", "HR CoE", "增长"]

interface FeedTabsProps {
  className?: string
  onTabChange?: (tab: string) => void
  activeTopicId?: string | null
  onTopicFilter?: (topicId: string | null) => void
  activeDepartment?: string | null
  onDepartmentFilter?: (dept: string | null) => void
}

export function FeedTabs({
  className,
  onTabChange,
  activeTopicId,
  onTopicFilter,
  activeDepartment,
  onDepartmentFilter,
}: FeedTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("Latest")
  const [showFilter, setShowFilter] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  const hasActiveFilter = !!(activeTopicId || activeDepartment)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const activeFilterLabel = activeTopicId
    ? TOPIC_MAP[activeTopicId]
      ? `${TOPIC_MAP[activeTopicId].emoji || ""} ${TOPIC_MAP[activeTopicId].name}`
      : null
    : activeDepartment || null

  return (
    <div className={cn("border-b border-surface-container-high pb-2", className)}>
      <div className="flex items-center justify-between">
        {/* Left: tabs */}
        <div className="flex gap-5 md:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab)
                onTabChange?.(tab)
              }}
              className={cn(
                "relative text-[15px] md:text-base font-headline font-semibold tracking-tight pb-2 transition-colors",
                activeTab === tab
                  ? "text-on-surface after:content-[''] after:absolute after:-bottom-[9px] after:left-0 after:w-full after:h-[2px] after:bg-primary"
                  : "text-on-surface/40 hover:text-on-surface/60"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right: Filter button */}
        <div className="flex items-center gap-2" ref={filterRef}>
          {/* Active filter chip (dismissible) */}
          {activeFilterLabel && (
            <span className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[11px] font-medium">
              {activeFilterLabel}
              <button
                type="button"
                onClick={() => {
                  if (activeTopicId) onTopicFilter?.(null)
                  if (activeDepartment) onDepartmentFilter?.(null)
                }}
                className="ml-0.5 hover:text-primary/60 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[12px]">close</span>
              </button>
            </span>
          )}

          {/* Filter button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer",
                showFilter || hasActiveFilter
                  ? "text-primary bg-primary/8"
                  : "text-on-surface/40 hover:text-on-surface/60 hover:bg-surface-container"
              )}
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span className="hidden sm:inline">Filter</span>
              {hasActiveFilter && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>

            {/* Filter popover */}
            {showFilter && (
              <div className="absolute right-0 top-full mt-2 w-[260px] bg-surface-container-lowest rounded-xl border border-outline-variant/12 shadow-lg z-50 py-3 px-3">
                {/* Topics */}
                <p className="text-[11px] text-secondary/50 px-1 mb-2">Topic</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        const newId = activeTopicId === topic.id ? null : topic.id
                        onTopicFilter?.(newId)
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border cursor-pointer",
                        activeTopicId === topic.id
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-transparent text-on-surface/50 border-outline-variant/12 hover:border-primary/30"
                      )}
                    >
                      {topic.emoji && <span className="mr-0.5">{topic.emoji}</span>}
                      {topic.name}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-outline-variant/8 mb-3" />

                {/* Department */}
                <p className="text-[11px] text-secondary/50 px-1 mb-2">Department</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDepartmentFilter?.(null)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border cursor-pointer",
                      !activeDepartment
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-transparent text-on-surface/50 border-outline-variant/12 hover:border-primary/30"
                    )}
                  >
                    All
                  </button>
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        const newDept = activeDepartment === dept ? null : dept
                        onDepartmentFilter?.(newDept)
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border cursor-pointer",
                        activeDepartment === dept
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-transparent text-on-surface/50 border-outline-variant/12 hover:border-primary/30"
                      )}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
