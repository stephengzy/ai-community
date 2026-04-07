"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import type { Build, BuildCategory } from "@/types"
import { BuildCard } from "@/components/cards/build-card"
import { Avatar } from "@/components/content/avatar"
import { UserHoverCard } from "@/components/content/user-hover-card"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"
import { CategoryTag } from "@/components/content/category-tag"
import { useEditorsPicks, useUsers, usePosts, useCurrentUser } from "@/hooks/use-store"
import { cn } from "@/lib/utils"

/** Consistent horizontal padding used across all sections */
const SECTION_PX = "px-4 md:px-10"

/* ── Category definitions with user-friendly labels ── */
const CATEGORIES: {
  key: string
  label: string
  desc: string
  icon: string
  value: BuildCategory | null
}[] = [
  { key: "all", label: "全部", desc: "", icon: "apps", value: null },
  { key: "skill", label: "Skill", desc: "技能提效", icon: "psychology", value: "SKILL" },
  { key: "demo", label: "Demo", desc: "产品演示", icon: "deployed_code", value: "DEMO" },
  { key: "other", label: "其他", desc: "更多探索", icon: "explore", value: "OTHER" },
]

/* Department filter modes */
type DeptFilter = "all" | "mine" | string

type ResultType = "post" | "user" | "build"

interface SearchResult {
  type: ResultType
  id: string
  title: string
  subtitle: string
  avatar?: string
  href: string
}

const typeLabels: Record<ResultType, string> = {
  user: "用户",
  build: "产品",
  post: "帖子",
}

const typeIcons: Record<ResultType, string> = {
  user: "person",
  build: "deployed_code",
  post: "article",
}

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
  const [activeCategory, setActiveCategory] = useState("all")
  const [deptFilter, setDeptFilter] = useState<DeptFilter>("all")
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week")

  const currentUser = useCurrentUser()
  const editorsPicks = useEditorsPicks()
  const allUsers = useUsers()
  const allPosts = usePosts()
  const trendingScrollRef = useRef<HTMLDivElement>(null)
  const picksScrollRef = useRef<HTMLDivElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const deptDropdownRef = useRef<HTMLDivElement>(null)

  const categoryValue = CATEGORIES.find((c) => c.key === activeCategory)?.value ?? null

  // Derive all unique departments from builds data
  const allDepartments = useMemo(() => {
    const depts = new Set<string>()
    for (const b of builds) {
      if (b.author.department) depts.add(b.author.department)
    }
    return Array.from(depts).sort()
  }, [builds])

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

  /* ── "Big search" results: builds + users + posts ── */
  const searchResults: SearchResult[] = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    const res: SearchResult[] = []

    for (const user of allUsers) {
      if (
        user.name.toLowerCase().includes(q) ||
        user.realName.toLowerCase().includes(q) ||
        user.department.toLowerCase().includes(q)
      ) {
        res.push({
          type: "user",
          id: user.id,
          title: `${user.name}(${user.realName})`,
          subtitle: `${user.department} · ${user.role}`,
          avatar: user.avatar,
          href: "/profile",
        })
      }
    }

    for (const build of builds) {
      if (
        build.name.toLowerCase().includes(q) ||
        build.description.toLowerCase().includes(q)
      ) {
        res.push({
          type: "build",
          id: build.id,
          title: build.name,
          subtitle: build.description,
          href: `/builds/${build.id}`,
        })
      }
    }

    for (const post of allPosts) {
      if (post.content.toLowerCase().includes(q)) {
        res.push({
          type: "post",
          id: post.id,
          title: post.content.slice(0, 60) + (post.content.length > 60 ? "…" : ""),
          subtitle: `${post.author.name}(${post.author.realName})`,
          href: "/",
        })
      }
    }

    return res.slice(0, 8)
  }, [searchQuery, allUsers, builds, allPosts])

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const showSearchDropdown = searchFocused && searchQuery.trim().length > 0

  // Resolve the actual department name from the filter mode
  const resolvedDept = deptFilter === "all" ? null : deptFilter === "mine" ? currentUser.department : deptFilter

  const filteredBuilds = useMemo(() => {
    let result = builds

    if (categoryValue) {
      result = result.filter((b) => b.category === categoryValue)
    }

    if (resolvedDept) {
      result = result.filter((b) => b.author.department === resolvedDept)
    }

    return result
  }, [builds, categoryValue, resolvedDept])

  const sortedBuilds = useMemo(() => {
    const sorted = filteredBuilds.slice()
    if (sortOrder === "latest") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else {
      sorted.sort((a, b) => b.upvotes - a.upvotes)
    }
    return sorted
  }, [filteredBuilds, sortOrder])

  const trendingBuilds = useMemo(() => {
    return builds
      .slice()
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 10)
  }, [builds])

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
          Page header + Big search
          ══════════════════════════════════════════════ */}
      <div className={cn(SECTION_PX, "pt-5 md:pt-6 pb-4")}>
        <div ref={searchContainerRef} className="relative">
          <div className="relative">
            <span className="material-symbols-outlined text-[20px] text-secondary/50 absolute left-4 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search posts, people, builds..."
              className="w-full pl-11 pr-4 py-3 text-[15px] bg-surface-container-lowest border border-outline-variant/8 rounded-xl text-on-surface placeholder:text-secondary/35 placeholder:font-headline placeholder:tracking-tight focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          {/* Search dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-container-lowest border border-outline-variant/8 rounded-xl shadow-lg overflow-hidden z-50">
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-[13px] text-secondary">
                  未找到相关结果
                </div>
              ) : (
                <div className="py-1.5">
                  {searchResults.map((result) => (
                    <a
                      key={`${result.type}-${result.id}`}
                      href={result.href}
                      className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-surface-container-low/60 transition-colors"
                      onClick={() => {
                        setSearchFocused(false)
                        setSearchQuery("")
                      }}
                    >
                      {result.type === "user" && result.avatar !== undefined ? (
                        <Avatar src={result.avatar} name={result.title} size="sm" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            {typeIcons[result.type]}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-on-surface truncate">
                          {result.title}
                        </p>
                        <p className="text-[11px] text-secondary truncate">{result.subtitle}</p>
                      </div>
                      <span className="text-[10px] text-secondary/50 shrink-0">
                        {typeLabels[result.type]}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          Trending This Week / Month
          ══════════════════════════════════════════════ */}
      <section className="pt-2 pb-5">
        <div className={cn(SECTION_PX, "flex items-center justify-between mb-3 md:mb-4")}>
          <h2 className="text-lg md:text-2xl font-headline font-semibold tracking-wide text-on-surface">
            Trending {timePeriod === "week" ? "This Week" : "This Month"}
          </h2>
          <TogglePills
            options={[
              { label: "This Week", value: "week" as TimePeriod },
              { label: "This Month", value: "month" as TimePeriod },
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
          Editor&apos;s Pick
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
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-[20px]">{pick.emoji}</span>
                    <h3 className="text-[15px] font-headline font-semibold text-on-surface">
                      {pick.title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-secondary/40 ml-[33px] leading-relaxed">
                    {pick.description}
                  </p>
                </div>

                {/* Build list — clean, no images */}
                <div className="px-3 pb-3 space-y-0.5">
                  {pick.builds.map((build, idx) => (
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
                          <CategoryTag category={build.category} size="xs" />
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
        {/* Section title + sort */}
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h2 className="text-lg md:text-2xl font-headline font-semibold tracking-wide text-on-surface">
            All Builds
          </h2>
          <TogglePills
            options={[
              { label: "Latest", value: "latest" as SortOrder },
              { label: "Most Upvoted", value: "most-upvoted" as SortOrder },
            ]}
            value={sortOrder}
            onChange={setSortOrder}
          />
        </div>

        {/* Category + department filters */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar md:overflow-visible md:flex-wrap mb-5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 border shrink-0",
                  isActive
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-transparent text-on-surface/50 border-outline-variant/8 hover:text-on-surface/80 hover:border-outline-variant/20 hover:bg-surface-container-low"
                )}
              >
                <span className={cn("material-symbols-outlined text-[14px]", isActive ? "text-on-primary" : "text-on-surface/35")}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                {cat.desc && (
                  <span className={cn(
                    "text-[10px] font-normal",
                    isActive ? "text-on-primary/70" : "text-on-surface/30"
                  )}>
                    {cat.desc}
                  </span>
                )}
              </button>
            )
          })}

          {/* Divider */}
          <div className="w-px h-5 bg-outline-variant/15 mx-1 hidden md:block" />

          {/* Department filter — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDeptFilter("all")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 border",
                deptFilter === "all"
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-transparent text-on-surface/50 border-outline-variant/8 hover:text-on-surface/80 hover:border-outline-variant/20 hover:bg-surface-container-low"
              )}
            >
              全部门
            </button>

            <button
              type="button"
              onClick={() => setDeptFilter("mine")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 border",
                deptFilter === "mine"
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-transparent text-on-surface/50 border-outline-variant/8 hover:text-on-surface/80 hover:border-outline-variant/20 hover:bg-surface-container-low"
              )}
            >
              <span className={cn("material-symbols-outlined text-[14px]", deptFilter === "mine" ? "text-on-primary" : "text-on-surface/35")}>
                apartment
              </span>
              我的部门
            </button>

            <div ref={deptDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDeptDropdownOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 border",
                  deptFilter !== "all" && deptFilter !== "mine"
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-transparent text-on-surface/50 border-outline-variant/8 hover:text-on-surface/80 hover:border-outline-variant/20 hover:bg-surface-container-low"
                )}
              >
                <span className={cn("material-symbols-outlined text-[14px]", deptFilter !== "all" && deptFilter !== "mine" ? "text-on-primary" : "text-on-surface/35")}>
                  tune
                </span>
                {deptFilter !== "all" && deptFilter !== "mine" ? resolvedDept : "其他部门"}
                <span className={cn(
                  "material-symbols-outlined text-[12px] transition-transform",
                  deptDropdownOpen && "rotate-180",
                  deptFilter !== "all" && deptFilter !== "mine" ? "text-on-primary/70" : "text-on-surface/30"
                )}>
                  expand_more
                </span>
              </button>

              {deptDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 min-w-[160px] bg-surface-container-lowest border border-outline-variant/8 rounded-xl shadow-lg overflow-hidden z-50 py-1">
                  {allDepartments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setDeptFilter(dept)
                        setDeptDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-[12px] transition-colors",
                        resolvedDept === dept
                          ? "text-primary font-semibold bg-primary/5"
                          : "text-on-surface/70 hover:bg-surface-container-low"
                      )}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Build grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {sortedBuilds.map((build) => (
            <BuildCard key={build.id} build={build} />
          ))}
        </div>
      </section>
    </div>
  )
}
