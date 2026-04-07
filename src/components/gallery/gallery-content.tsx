"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import type { Build } from "@/types"
import { BuildCard } from "@/components/cards/build-card"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"
import { useEditorsPicks, useUsers } from "@/hooks/use-store"
import { cn } from "@/lib/utils"

/** Consistent horizontal padding used across all sections */
const SECTION_PX = "px-4 md:px-10"

/* Department filter modes */
type DeptFilter = "all" | "mine" | string

type SortOrder = "latest" | "most-upvoted"
type TimePeriod = "week" | "month"

interface GalleryContentProps {
  builds: Build[]
}

/* Horizontal scroll arrow button — hidden on mobile, visible on desktop hover */
function ScrollArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right"
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-surface/95 border border-outline-variant/8 shadow-md items-center justify-center text-on-surface/50 hover:text-primary hover:border-primary/30 transition-all backdrop-blur-sm opacity-0 group-hover/scroll:opacity-100",
        direction === "left" ? "left-3" : "right-3"
      )}
    >
      <span className="material-symbols-outlined text-[16px]">
        {direction === "left" ? "chevron_left" : "chevron_right"}
      </span>
    </button>
  )
}

/* ── Pick detail modal ── */
interface PickModalData {
  title: string
  description: string
  builds: Build[]
}

function PickDetailModal({
  data,
  onClose,
}: {
  data: PickModalData
  onClose: () => void
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[480px] max-h-[80vh] bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-outline-variant/8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[17px] font-headline font-semibold text-on-surface">
                {data.title}
              </h3>
              <p className="text-[12px] text-secondary/40 mt-1 leading-relaxed">
                {data.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface/30 hover:text-on-surface/60 hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Build list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {data.builds.map((build) => (
            <Link
              key={build.id}
              href={`/builds/${build.id}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container/50 transition-colors group"
              onClick={onClose}
            >
              <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-surface-container-low shrink-0 border border-outline-variant/10 shadow-sm">
                <img src={build.iconImage} alt={build.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold font-headline text-on-surface group-hover:text-primary transition-colors truncate">
                  {build.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="text-[11px] text-secondary/35 truncate">
                    <UserHoverCard user={build.author} showAvatar={false} nameClassName="text-[11px] text-secondary/35 cursor-pointer hover:underline hover:text-secondary/60" />
                    <span> · {build.author.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-on-surface/25 shrink-0 w-12 justify-end">
                <UpvoteIcon size={11} />
                <span className="text-[11px] font-bold tabular-nums">{build.upvotes}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Toggle pill used for time period & sort order ── */
function TogglePills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center bg-surface-container-low rounded-full p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200",
            value === opt.value
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface/50 hover:text-on-surface/80"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function GalleryContent({ builds }: GalleryContentProps) {
  const [deptFilter, setDeptFilter] = useState<DeptFilter>("all")
  const [deptFilterLabel, setDeptFilterLabel] = useState("")
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false)
  const [hoveredL1, setHoveredL1] = useState(0)
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week")
  const [pickModal, setPickModal] = useState<PickModalData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [committedSearch, setCommittedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const editorsPicks = useEditorsPicks()
  const allUsers = useUsers()
  const trendingScrollRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const picksScrollRef = useRef<HTMLDivElement>(null)
  const deptDropdownRef = useRef<HTMLDivElement>(null)

  const selectDept = useCallback((filterValue: string, label: string) => {
    setDeptFilter(filterValue)
    setDeptFilterLabel(label)
    setDeptDropdownOpen(false)
  }, [])

  // Close dept dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(e.target as Node)) {
        setDeptDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounce search for suggestions only
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Auto-commit when no user suggestions (project name search), or when cleared
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setCommittedSearch("")
      setPage(1)
    } else {
      // If no users match, auto-commit as project name search
      const q = debouncedSearch.trim().toLowerCase()
      const hasUserMatch = allUsers.some(
        (u) => u.name.toLowerCase().includes(q) || u.realName.toLowerCase().includes(q)
      )
      if (!hasUserMatch) {
        setCommittedSearch(debouncedSearch)
        setPage(1)
      }
    }
  }, [debouncedSearch, allUsers])

  const commitSearch = useCallback((q: string) => {
    setCommittedSearch(q)
    setPage(1)
  }, [])

  // Reset page when filter/sort changes
  useEffect(() => { setPage(1) }, [deptFilter, sortOrder])

  // Resolve the actual department name from the filter mode
  const resolvedDept = deptFilter === "all" ? null : deptFilter

  // Matched users for search suggestions (driven by debounced input)
  const matchedUsers = useMemo(() => {
    if (!debouncedSearch.trim()) return []
    const q = debouncedSearch.trim().toLowerCase()
    return allUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.realName.toLowerCase().includes(q)
    ).slice(0, 5)
  }, [allUsers, debouncedSearch])

  // Show suggestions only when typing and not yet committed to this exact query
  const showSuggestions = matchedUsers.length > 0 && debouncedSearch.trim().length > 0 && debouncedSearch !== committedSearch

  // Is the committed search matching a person?
  const isPersonSearch = useMemo(() => {
    if (!committedSearch.trim()) return false
    const q = committedSearch.trim().toLowerCase()
    return allUsers.some((u) => u.name.toLowerCase().includes(q) || u.realName.toLowerCase().includes(q))
  }, [allUsers, committedSearch])

  // Build filtering uses committedSearch (not debounced)
  const filteredBuilds = useMemo(() => {
    let result = builds

    if (resolvedDept) {
      result = result.filter((b) => b.author.department === resolvedDept)
    }

    if (committedSearch.trim()) {
      const q = committedSearch.trim().toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.author.name.toLowerCase().includes(q) ||
          b.author.realName.toLowerCase().includes(q) ||
          b.collaborators.some(
            (c) => c.name.toLowerCase().includes(q) || c.realName.toLowerCase().includes(q)
          )
      )
    }

    return result
  }, [builds, resolvedDept, committedSearch])

  // Split into "as author" and "as collaborator" when searching by person
  const { authorBuilds, collabBuilds } = useMemo(() => {
    if (!isPersonSearch || !committedSearch.trim()) {
      return { authorBuilds: filteredBuilds, collabBuilds: [] as Build[] }
    }
    const q = committedSearch.trim().toLowerCase()
    const asAuthor: Build[] = []
    const asCollab: Build[] = []
    for (const b of filteredBuilds) {
      const authorMatch =
        b.author.name.toLowerCase().includes(q) ||
        b.author.realName.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q)
      if (authorMatch) {
        asAuthor.push(b)
      } else {
        asCollab.push(b)
      }
    }
    return { authorBuilds: asAuthor, collabBuilds: asCollab }
  }, [filteredBuilds, isPersonSearch, committedSearch])

  const sortFn = useCallback((list: Build[]) => {
    const sorted = list.slice()
    if (sortOrder === "latest") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      sorted.sort((a, b) => b.upvotes - a.upvotes)
    }
    return sorted
  }, [sortOrder])

  const sortedAuthorBuilds = useMemo(() => sortFn(authorBuilds), [authorBuilds, sortFn])
  const sortedCollabBuilds = useMemo(() => sortFn(collabBuilds), [collabBuilds, sortFn])

  const trendingBuilds = useMemo(() => {
    return builds
      .slice()
      .sort((a, b) =>
        timePeriod === "week"
          ? b.weeklyUpvotes - a.weeklyUpvotes
          : b.monthlyUpvotes - a.monthlyUpvotes
      )
      .slice(0, 10)
  }, [builds, timePeriod])

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (!ref.current) return
    const container = ref.current
    const firstChild = container.firstElementChild as HTMLElement | null
    if (!firstChild) return
    const gap = 20
    const amount = firstChild.offsetWidth + gap
    container.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <div className="w-full">
      {/* ══════════════════════════════════════════════
          Trending This Week / Month
          ══════════════════════════════════════════════ */}
      <section className="pt-4 lg:pt-24 pb-5">
        <div className={cn(SECTION_PX, "flex items-center justify-between mb-3 md:mb-4")}>
          <h2 className="text-lg md:text-2xl font-headline font-semibold tracking-wide text-on-surface">
            最热作品
          </h2>
          <TogglePills
            options={[
              { label: "近一周", value: "week" as TimePeriod },
              { label: "近一月", value: "month" as TimePeriod },
            ]}
            value={timePeriod}
            onChange={setTimePeriod}
          />
        </div>

        <div className={cn("relative group/scroll", SECTION_PX)}>
          <ScrollArrow
            direction="left"
            onClick={() => scrollContainer(trendingScrollRef, "left")}
          />
          <div
            ref={trendingScrollRef}
            className="flex gap-5 overflow-x-auto pb-2 hide-scrollbar snap-x"
          >
            {trendingBuilds.map((build) => (
              <div key={build.id} className="w-[240px] md:w-[calc((100%-40px)/3)] shrink-0 snap-start">
                <BuildCard build={build} />
              </div>
            ))}
          </div>
          <ScrollArrow
            direction="right"
            onClick={() => scrollContainer(trendingScrollRef, "right")}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          Editor's Pick — clean numbered list
          ══════════════════════════════════════════════ */}
      <section className="pt-5 pb-5 border-t border-outline-variant/5">
        <h2 className={cn(SECTION_PX, "text-lg md:text-2xl font-headline font-semibold tracking-wide text-on-surface mb-3 md:mb-4")}>
          专题精选
        </h2>

        <div className={cn("relative group/scroll", SECTION_PX)}>
          <ScrollArrow
            direction="left"
            onClick={() => scrollContainer(picksScrollRef, "left")}
          />
          <div
            ref={picksScrollRef}
            className="flex gap-5 overflow-x-auto pb-2 hide-scrollbar snap-x"
          >
            {editorsPicks.map((pick) => (
              <div
                key={pick.id}
                className="w-[260px] md:w-[calc((100%-40px)/3)] shrink-0 snap-start bg-surface-container-lowest rounded-2xl border border-surface-container/50 shadow-sm overflow-hidden"
              >
                {/* Collection header */}
                <div className="px-5 pt-5 pb-3">
                  <div className="mb-1">
                    <h3 className="text-[15px] font-headline font-semibold text-on-surface">
                      {pick.title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-secondary/40 leading-relaxed">
                    {pick.description}
                  </p>
                </div>

                {/* Build list — show first 3, with "查看更多" */}
                <div className="px-3 pb-3 space-y-0.5">
                  {pick.builds.slice(0, 3).map((build) => (
                    <Link
                      key={build.id}
                      href={`/builds/${build.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container/50 transition-colors group"
                    >
                      {/* Icon image */}
                      <div className="w-9 h-9 rounded-[10px] overflow-hidden bg-surface-container-low shrink-0 border border-outline-variant/10 shadow-sm">
                        <img
                          src={build.iconImage}
                          alt={build.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Build info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold font-headline text-on-surface group-hover:text-primary transition-colors truncate">
                          {build.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="text-[11px] text-secondary/35 truncate">
                            <UserHoverCard user={build.author} showAvatar={false} nameClassName="text-[11px] text-secondary/35 cursor-pointer hover:underline hover:text-secondary/60" />
                            <span> · {build.author.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Upvote count — fixed width for alignment */}
                      <div className="flex items-center gap-0.5 text-on-surface/25 shrink-0 w-12 justify-end">
                        <UpvoteIcon size={11} />
                        <span className="text-[11px] font-bold tabular-nums">{build.upvotes}</span>
                      </div>
                    </Link>
                  ))}

                  {pick.builds.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setPickModal({ title: pick.title, description: pick.description, builds: pick.builds })}
                      className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[12px] font-medium text-primary/70 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      查看全部 {pick.builds.length} 个作品
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ScrollArrow
            direction="right"
            onClick={() => scrollContainer(picksScrollRef, "right")}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          All Builds — search, filters, sort, grid
          ══════════════════════════════════════════════ */}
      <section className={cn(SECTION_PX, "pt-5 pb-12 border-t border-outline-variant/5")}>
        {/* Section title + filter & sort */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-lg md:text-2xl font-headline font-semibold tracking-wide text-on-surface">
            全部作品
          </h2>
          <div className="flex items-center gap-2">
            {/* Department filter dropdown */}
            <div ref={deptDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => { setDeptDropdownOpen((v) => !v); setHoveredL1(0) }}
                className={cn(
                  "flex items-center gap-1 px-3 h-7 rounded-full text-[11px] transition-all duration-200",
                  deptFilter !== "all"
                    ? "text-primary font-semibold"
                    : "text-on-surface/35 hover:text-on-surface/50"
                )}
              >
                {deptFilter !== "all" ? deptFilterLabel : "按部门筛选"}
                <span className={cn(
                  "material-symbols-outlined text-[12px] transition-transform",
                  deptDropdownOpen && "rotate-180",
                  deptFilter !== "all" ? "text-primary/70" : "text-on-surface/25"
                )}>
                  expand_more
                </span>
              </button>

              {/* TODO: 接入真实部门树数据 */}
              {deptDropdownOpen && (
                <div className="absolute top-full right-0 mt-1.5 bg-surface-container-lowest border border-outline-variant/8 rounded-xl shadow-lg overflow-hidden z-50 flex">
                  {/* Left: 一级部门 */}
                  <div className="w-[130px] border-r border-outline-variant/6 py-1">
                    <button
                      type="button"
                      onClick={() => selectDept("all", "")}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-[12px] transition-colors",
                        deptFilter === "all" ? "text-primary font-semibold bg-primary/5" : "text-on-surface/70 hover:bg-surface-container-low"
                      )}
                    >
                      全部门
                    </button>
                    <div className="h-px bg-outline-variant/6 my-0.5" />
                    <div className="px-3 pt-1.5 pb-0.5">
                      <span className="text-[10px] font-bold tracking-wider text-on-surface/20">我的部门</span>
                    </div>
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredL1(0)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-[12px] transition-colors flex items-center justify-between",
                        hoveredL1 === 0 ? "bg-primary/5 text-on-surface font-medium" : "text-on-surface/70 hover:bg-surface-container-low"
                      )}
                    >
                      一级部门
                      <span className="material-symbols-outlined text-[14px] text-on-surface/25">chevron_right</span>
                    </button>
                    <div className="h-px bg-outline-variant/6 my-0.5" />
                    {[1, 2, 3].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHoveredL1(i)}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-[12px] transition-colors flex items-center justify-between",
                          hoveredL1 === i ? "bg-surface-container-low text-on-surface font-medium" : "text-on-surface/70 hover:bg-surface-container-low"
                        )}
                      >
                        一级部门
                        <span className="material-symbols-outlined text-[14px] text-on-surface/25">chevron_right</span>
                      </button>
                    ))}
                  </div>

                  {/* Right: 二级部门 */}
                  <div className="w-[140px] py-1">
                    {[1, 2, 3].map((i) => (
                      <button
                        key={i}
                        type="button"
                        className="w-full text-left px-4 py-2.5 text-[12px] text-on-surface/70 hover:bg-surface-container-low transition-colors"
                      >
                        二级部门
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort toggle */}
            <TogglePills
              options={[
                { label: "最新", value: "latest" as SortOrder },
                { label: "最多顶", value: "most-upvoted" as SortOrder },
              ]}
              value={sortOrder}
              onChange={setSortOrder}
            />
          </div>
        </div>

        {/* Search box with user suggestions */}
        <div ref={searchRef} className="relative mb-4">
          <span className="material-symbols-outlined text-[18px] text-on-surface/30 absolute left-3 top-[18px] -translate-y-1/2 z-10">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitSearch(searchQuery)
              }
            }}
            placeholder="搜索薯名或项目名..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/10 text-[13px] text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setCommittedSearch(""); setPage(1) }}
              className="absolute right-3 top-[18px] -translate-y-1/2 text-on-surface/30 hover:text-on-surface/60 z-10"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}

          {/* User suggestions dropdown — only show before commit */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/10 rounded-xl shadow-lg overflow-hidden z-50">
              {matchedUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => { setSearchQuery(u.name); commitSearch(u.name) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-low transition-colors"
                >
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                      {u.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left min-w-0">
                    <p className="text-[13px] font-medium text-on-surface truncate">
                      {u.name}({u.realName})
                    </p>
                    <p className="text-[11px] text-on-surface/35">{u.department}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Build grid with pagination */}
        {(() => {
          // Combine all results for pagination: author section first, then collab
          const allResults = [...sortedAuthorBuilds, ...sortedCollabBuilds]
          const totalCount = allResults.length
          const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
          const safeP = Math.min(page, totalPages)
          const start = (safeP - 1) * pageSize
          const pageItems = allResults.slice(start, start + pageSize)

          // Figure out how many author builds are on this page
          const authorOnPage = pageItems.filter((b) => sortedAuthorBuilds.includes(b))
          const collabOnPage = pageItems.filter((b) => sortedCollabBuilds.includes(b))

          return (
            <div className="min-h-[300px]">
              {totalCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-on-surface/30">
                  <span className="material-symbols-outlined text-[40px] mb-2">search_off</span>
                  <p className="text-[14px]">没有找到匹配的作品</p>
                </div>
              ) : (
                <>
                  {authorOnPage.length > 0 && (
                    <div>
                      {collabOnPage.length > 0 && (
                        <p className="text-[12px] text-on-surface/35 font-medium mb-2">TA 发布的作品</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                        {authorOnPage.map((build) => (
                          <BuildCard key={build.id} build={build} />
                        ))}
                      </div>
                    </div>
                  )}

                  {collabOnPage.length > 0 && (
                    <div className={authorOnPage.length > 0 ? "mt-6" : ""}>
                      <p className="text-[12px] text-on-surface/35 font-medium mb-2">TA 参与的作品</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                        {collabOnPage.map((build) => (
                          <BuildCard key={build.id} build={build} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              {totalCount > 0 && (
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-outline-variant/8">
                  {/* Page numbers — left/center */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={safeP <= 1}
                      onClick={() => setPage(safeP - 1)}
                      className="p-1 rounded-md text-on-surface/40 hover:text-on-surface/70 hover:bg-surface-container-low disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p <= 3 || p === totalPages)
                      .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…")
                        acc.push(p)
                        return acc
                      }, [])
                      .map((item, idx) =>
                        item === "…" ? (
                          <span key={`ellipsis-${idx}`} className="px-0.5 text-[12px] text-on-surface/25">…</span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setPage(item as number)}
                            className={cn(
                              "min-w-[28px] h-7 rounded-md text-[12px] font-medium transition-colors",
                              safeP === item
                                ? "bg-primary text-on-primary"
                                : "text-on-surface/50 hover:bg-surface-container-low"
                            )}
                          >
                            {item}
                          </button>
                        )
                      )}

                    <button
                      type="button"
                      disabled={safeP >= totalPages}
                      onClick={() => setPage(safeP + 1)}
                      className="p-1 rounded-md text-on-surface/40 hover:text-on-surface/70 hover:bg-surface-container-low disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>

                  {/* Right: total + page size selector */}
                  <div className="flex items-center gap-3 text-[12px] text-on-surface/50">
                    <span className="text-on-surface/30">共 {totalCount} 个作品</span>
                    <div className="flex items-center gap-1.5">
                      <span>每页展示</span>
                      {[20, 50, 100].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => { setPageSize(size); setPage(1) }}
                          className={cn(
                            "min-w-[32px] h-7 rounded-lg text-[12px] font-medium transition-all duration-200 border",
                            pageSize === size
                              ? "bg-primary text-on-primary border-primary"
                              : "text-on-surface/50 border-outline-variant/15 hover:border-outline-variant/30 hover:bg-surface-container-low"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                      <span>个</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </section>

      {/* Pick detail modal */}
      {pickModal && (
        <PickDetailModal data={pickModal} onClose={() => setPickModal(null)} />
      )}
    </div>
  )
}
