"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FormTextarea } from "@/components/build-form/form-textarea"
import { MediaUpload } from "@/components/build-form/media-upload"
import { VisibilitySelector } from "@/components/build-form/visibility-selector"
import { Avatar } from "@/components/content/avatar"
import { useStore } from "@/store"
import { useUsers } from "@/hooks/use-store"
import { cn } from "@/lib/utils"
import type { Visibility } from "@/types"

export function BuildEditClient({ buildId }: { buildId: string }) {
  const router = useRouter()
  const rawBuild = useStore((s) => s.builds[buildId])
  const currentUserId = useStore((s) => s.currentUserId)
  const currentUser = useStore((s) => s.users[s.currentUserId])
  const updateBuild = useStore((s) => s.updateBuild)
  const users = useUsers()

  // Form state — initialized from build data
  const [buildName, setBuildName] = useState(() => rawBuild?.name ?? "")
  const [tagline, setTagline] = useState(() => rawBuild?.description ?? "")
  const [pitch, setPitch] = useState(() => {
    // Combine old problem/solution/pitch into single field
    const parts = [rawBuild?.pitch, rawBuild?.problem, rawBuild?.solution].filter(Boolean)
    return parts.join("\n\n") || ""
  })
  const [techTags, setTechTags] = useState<string[]>(() => rawBuild?.techStack ?? [])
  const [tagInput, setTagInput] = useState("")
  const [links, setLinks] = useState(() =>
    rawBuild?.links && rawBuild.links.length > 0
      ? rawBuild.links.map((l) => ({ title: l.label, url: l.url }))
      : [{ title: "", url: "" }]
  )
  const [collaborators, setCollaborators] = useState<string[]>(() =>
    rawBuild?.collaboratorIds ?? []
  )
  const [hasCover, setHasCover] = useState(true) // existing build already has cover
  const [visibility, setVisibility] = useState<string | null>(() => rawBuild?.visibility ?? "PUBLIC")
  const [version, setVersion] = useState(() => rawBuild?.version ?? "1.0")
  const isComposingRef = useRef(false)
  const [showCollabSearch, setShowCollabSearch] = useState(false)
  const [collabSearch, setCollabSearch] = useState("")
  const collabRef = useRef<HTMLDivElement>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Auto-save indicator
  useEffect(() => {
    const timer = setTimeout(() => setLastSaved(new Date()), 1500)
    return () => clearTimeout(timer)
  }, [buildName, tagline, pitch, techTags, links, collaborators, version])

  useEffect(() => {
    if (!showCollabSearch) return
    const handleClickOutside = (e: MouseEvent) => {
      if (collabRef.current && !collabRef.current.contains(e.target as Node)) {
        setShowCollabSearch(false)
        setCollabSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showCollabSearch])

  if (!rawBuild) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-[48px] text-primary/15 mb-4">error</span>
        <p className="text-[14px] text-on-surface/40">未找到该作品</p>
      </div>
    )
  }

  const isOwner = rawBuild.authorId === currentUserId
  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-[48px] text-primary/15 mb-4">lock</span>
        <p className="text-[14px] text-on-surface/40">你没有权限修改此作品</p>
      </div>
    )
  }

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed || techTags.includes(trimmed)) return
    if (techTags.length >= 10) return
    setTechTags([...techTags, trimmed])
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setTechTags(techTags.filter((t) => t !== tag))
  }

  const toggleCollaborator = (userId: string) => {
    setCollaborators((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      }
      if (prev.length >= 10) return prev
      return [...prev, userId]
    })
  }

  const availableCollabs = users.filter(
    (u) =>
      u.id !== currentUserId &&
      (collabSearch === "" ||
        u.name.includes(collabSearch) ||
        u.realName.toLowerCase().includes(collabSearch.toLowerCase()))
  )

  const selectedCollabs = users.filter((u) => collaborators.includes(u.id))

  const hasValidLink = links.some((l) => l.title.trim() && l.url.trim())

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleUpdate = () => {
    const newErrors: Record<string, boolean> = {}
    if (!buildName.trim()) newErrors.buildName = true
    if (!tagline.trim()) newErrors.tagline = true
    if (!pitch.trim()) newErrors.pitch = true
    if (!hasValidLink) newErrors.links = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0]
      const el = document.querySelector(`[data-field="${firstKey}"]`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    updateBuild(buildId, {
      name: buildName.trim(),
      description: tagline.trim(),
      pitch: pitch.trim(),
      problem: pitch.trim(),
      solution: "",
      techStack: techTags,
      links: hasValidLink
        ? links
          .filter((l) => l.title.trim() && l.url.trim())
          .map((l) => ({ label: l.title.trim(), url: l.url.trim() }))
        : undefined,
      visibility: (visibility as Visibility) ?? "PUBLIC",
      version: version.trim() || rawBuild.version,
    })

    router.push(`/builds/${buildId}`)
  }

  return (
    <>
      {/* Mobile: desktop-only message */}
      <div className="flex md:hidden items-center justify-center min-h-[60vh] px-6">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-[48px] text-primary/20">
            desktop_windows
          </span>
          <p className="text-[14px] text-secondary/50">
            修改作品仅支持桌面端。
          </p>
        </div>
      </div>

      {/* Desktop: edit form */}
      <div className="hidden md:block min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/5">
          <div className="max-w-[960px] mx-auto flex items-center justify-between px-10 py-3.5">
            <button
              type="button"
              onClick={() => router.push(`/builds/${buildId}`)}
              className="flex items-center gap-2 text-on-surface/50 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="text-[14px] font-headline font-semibold">修改作品</span>
            </button>
            <span className="text-[12px] text-secondary/40">
              {lastSaved ? (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400/70 mr-1.5 align-middle" />
                  已保存
                </>
              ) : (
                "未保存"
              )}
            </span>
          </div>
        </div>

        {/* Main form */}
        <div className="max-w-[960px] mx-auto px-10 pt-10 pb-36">

          {/* ===== 作品名称 ===== */}
          <div className="mb-8" data-field="buildName">
            <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
              作品名称 <span className="text-primary/50">*</span>
            </label>
            <div className={cn(
              "relative rounded-xl bg-surface-container-lowest border p-4 transition-colors focus-within:border-primary/30",
              errors.buildName ? "border-red-500/60" : "border-outline-variant/10"
            )}>
              <input
                type="text"
                value={buildName}
                onChange={(e) => { setBuildName(e.target.value.slice(0, 40)); clearError("buildName") }}
                placeholder="为你的作品命名"
                className="w-full bg-transparent focus:ring-0 focus:outline-none text-[20px] font-headline font-semibold placeholder:text-on-surface/25 text-on-surface tracking-tight"
              />
              {buildName.length > 0 && (
                <span className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 text-[12px]",
                  buildName.length >= 40 ? "text-red-400" : "text-on-surface/20"
                )}>
                  {buildName.length}/40
                </span>
              )}
            </div>
          </div>

          {/* ===== 作品简介 ===== */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
              <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">作品简介</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
            </div>
            <div className="space-y-6">
              {/* 一句话介绍 */}
              <div data-field="tagline">
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  一句话介绍 <span className="text-primary/50">*</span>
                </label>
                <div className={cn(
                  "relative rounded-xl bg-surface-container-lowest border p-4 transition-colors focus-within:border-primary/30",
                  errors.tagline ? "border-red-500/60" : "border-outline-variant/10"
                )}>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => { setTagline(e.target.value.slice(0, 80)); clearError("tagline") }}
                    placeholder="一句话介绍你的作品"
                    className="w-full bg-transparent focus:ring-0 focus:outline-none text-[14px] font-body placeholder:text-on-surface/30 text-on-surface"
                  />
                  {tagline.length > 0 && (
                    <span className={cn(
                      "absolute right-4 top-1/2 -translate-y-1/2 text-[12px]",
                      tagline.length >= 80 ? "text-red-400" : "text-on-surface/20"
                    )}>
                      {tagline.length}/80
                    </span>
                  )}
                </div>
              </div>

              {/* 项目介绍 */}
              <div data-field="pitch">
                <FormTextarea
                  label="项目介绍"
                  placeholder="介绍你的作品——它是什么、解决了什么问题、如何实现的"
                  isRequired
                  maxLength={2000}
                  defaultValue={pitch}
                  onChange={(html) => { setPitch(html.replace(/<[^>]*>/g, "").trim()); clearError("pitch") }}
                  error={errors.pitch}
                />
              </div>

              {/* 关键词 */}
              <div>
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  关键词
                </label>
                <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-4 focus-within:border-primary/30 transition-colors">
                  <div className="flex flex-wrap gap-2 items-center">
                    {techTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="group inline-flex items-center gap-2 px-3.5 h-[30px] rounded-full border border-outline-variant/12 text-[13px] font-medium text-on-surface/60 hover:border-primary/30 hover:text-primary/70 hover:bg-primary/[0.04] active:scale-[0.96] transition-all cursor-pointer"
                      >
                        {tag}
                        <span className="material-symbols-outlined text-[13px] text-on-surface/20 group-hover:text-primary/50 transition-colors">close</span>
                      </button>
                    ))}
                    <input
                      value={tagInput}
                      onCompositionStart={() => { isComposingRef.current = true }}
                      onCompositionEnd={(e) => {
                        isComposingRef.current = false
                        const val = (e.target as HTMLInputElement).value
                        if (val.endsWith(",") || val.endsWith("，")) {
                          const trimmed = val.slice(0, -1).trim()
                          if (trimmed && !techTags.includes(trimmed) && techTags.length < 10) {
                            setTechTags((prev) => [...prev, trimmed])
                          }
                          setTagInput("")
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value
                        if (!isComposingRef.current && (val.endsWith(",") || val.endsWith("，"))) {
                          const trimmed = val.slice(0, -1).trim()
                          if (trimmed && !techTags.includes(trimmed) && techTags.length < 10) {
                            setTechTags((prev) => [...prev, trimmed])
                          }
                          setTagInput("")
                        } else {
                          setTagInput(val)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isComposingRef.current) {
                          e.preventDefault()
                          addTag()
                        } else if (e.key === "Backspace" && tagInput === "" && techTags.length > 0) {
                          removeTag(techTags[techTags.length - 1])
                        }
                      }}
                      placeholder={techTags.length >= 10 ? "已达上限" : techTags.length === 0 ? "如：组织穿透、日常数据报表、财务分析" : "继续添加..."}
                      className="flex-1 min-w-[120px] bg-transparent focus:ring-0 focus:outline-none h-[30px] text-[14px] font-body placeholder:text-on-surface/30 text-on-surface"
                    />
                  </div>
                  <p className="mt-2 text-[12px] text-on-surface/25">
                    回车添加 · 退格删除 · 最多10个
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 作品展示 ===== */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
              <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">作品展示</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
            </div>
            <div className="space-y-6">
              {/* 作品链接 */}
              <div data-field="links">
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  作品链接 <span className="text-primary/50">*</span>
                </label>
                {errors.links && (
                  <p className="text-[12px] text-red-500 mb-2">至少需要一个链接（标题和地址）</p>
                )}
                <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-4 space-y-3">
                  {links.map((link, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-3 border-b border-outline-variant/8 focus-within:border-primary/30 transition-colors">
                        <input
                          value={link.title}
                          onChange={(e) => {
                            const next = [...links]
                            next[i] = { ...next[i], title: e.target.value }
                            setLinks(next)
                            clearError("links")
                          }}
                          placeholder="标题"
                          className="w-[140px] shrink-0 bg-transparent focus:ring-0 focus:outline-none py-2.5 text-[14px] font-body font-medium placeholder:text-on-surface/30 text-on-surface"
                        />
                        <div className="w-px h-4 bg-outline-variant/15" />
                        <input
                          value={link.url}
                          onChange={(e) => {
                            const next = [...links]
                            next[i] = { ...next[i], url: e.target.value }
                            setLinks(next)
                            clearError("links")
                          }}
                          placeholder="https://"
                          className="flex-1 bg-transparent focus:ring-0 focus:outline-none py-2.5 text-[14px] font-body placeholder:text-on-surface/30 text-on-surface"
                        />
                      </div>
                      {links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setLinks(links.filter((_, j) => j !== i))}
                          className="text-on-surface/20 hover:text-on-surface/50 transition-colors p-1"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                  {links.length < 10 && (
                    <button
                      type="button"
                      onClick={() => setLinks([...links, { title: "", url: "" }])}
                      className="flex items-center gap-1.5 text-[13px] font-medium text-primary/50 hover:text-primary/80 transition-colors mt-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      添加链接
                    </button>
                  )}
                  {links.length >= 10 && (
                    <p className="text-[12px] text-on-surface/25 mt-1">最多10个链接</p>
                  )}
                </div>
              </div>

              {/* 图片/视频 */}
              <div data-field="media">
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  图片/视频
                </label>
                <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-4">
                  <MediaUpload onHasCoverChange={(has) => setHasCover(has)} />
                  <p className="mt-3 text-[12px] text-on-surface/25">
                    重新上传将替换现有素材 · 最多10个
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 其他设置 ===== */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
              <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">其他设置</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
            </div>
            <div className="space-y-6">
              {/* 合作者 */}
              <div>
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  合作者
                </label>
                <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {selectedCollabs.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleCollaborator(user.id)}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant/12 hover:border-primary/30 hover:bg-primary/[0.04] active:scale-[0.96] transition-all"
                      >
                        <Avatar src={user.avatar} name={user.name} size="xs" />
                        <span className="text-[13px] font-medium text-on-surface/65">
                          {user.name}({user.realName})
                        </span>
                        <span className="material-symbols-outlined text-[13px] text-on-surface/20 group-hover:text-primary/50 transition-colors">
                          close
                        </span>
                      </button>
                    ))}
                    <div className="relative" ref={collabRef}>
                      {collaborators.length < 10 ? (
                        <button
                          type="button"
                          onClick={() => setShowCollabSearch(!showCollabSearch)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full border border-dashed transition-all text-[13px] font-medium cursor-pointer",
                            showCollabSearch
                              ? "border-primary/30 text-primary bg-primary/[0.03]"
                              : "border-outline-variant/15 text-on-surface/35 hover:border-primary/25 hover:text-primary/60"
                          )}
                        >
                          <span className="material-symbols-outlined text-[17px]">person_add</span>
                          添加成员
                        </button>
                      ) : (
                        <span className="text-[12px] text-on-surface/25">最多10位合作者</span>
                      )}

                      {showCollabSearch && collaborators.length < 10 && (
                        <div className="absolute top-full left-0 mt-2 w-[280px] bg-surface-container-lowest rounded-2xl border border-outline-variant/8 shadow-xl z-30 overflow-hidden">
                          <div className="p-3.5 border-b border-outline-variant/6">
                            <input
                              autoFocus
                              value={collabSearch}
                              onChange={(e) => setCollabSearch(e.target.value)}
                              placeholder="搜索成员..."
                              className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-[14px] placeholder:text-secondary/35 focus:outline-none focus:ring-1 focus:ring-primary/20"
                            />
                          </div>
                          <div className="max-h-[240px] overflow-y-auto py-1.5">
                            {availableCollabs.map((user) => {
                              const isSelected = collaborators.includes(user.id)
                              return (
                                <button
                                  key={user.id}
                                  type="button"
                                  onClick={() => toggleCollaborator(user.id)}
                                  className={cn(
                                    "flex items-center gap-3 w-full px-4 py-2.5 hover:bg-surface-container transition-colors text-left",
                                    isSelected && "bg-primary/[0.04]"
                                  )}
                                >
                                  <Avatar src={user.avatar} name={user.name} size="sm" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-medium text-on-surface truncate">
                                      {user.name}({user.realName})
                                    </p>
                                    <p className="text-[12px] text-secondary/45">{user.role}</p>
                                  </div>
                                  {isSelected && (
                                    <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 作品版本 */}
              <div>
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  作品版本
                </label>
                <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-4 focus-within:border-primary/30 transition-colors">
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder={rawBuild.version}
                    className="w-[120px] bg-transparent focus:ring-0 focus:outline-none text-[14px] font-body placeholder:text-on-surface/30 text-on-surface"
                  />
                  <p className="mt-2 text-[12px] text-on-surface/25">
                    当前版本 v{rawBuild.version}，修改后将更新为新版本号
                  </p>
                </div>
              </div>

              {/* 可见范围 */}
              <div data-field="visibility">
                <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-4">
                  <VisibilitySelector onChange={(v) => setVisibility(v)} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Fixed footer */}
        <div className="sticky bottom-0 z-20 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/5">
          <div className="max-w-[960px] mx-auto flex items-center justify-between px-10 py-3.5">
            <button
              type="button"
              onClick={() => router.push(`/builds/${buildId}`)}
              className="text-[14px] font-headline font-semibold text-on-surface/40 hover:text-on-surface/60 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="px-6 py-2 rounded-xl text-[14px] font-headline font-semibold bg-primary text-on-primary hover:opacity-90 transition-all"
            >
              更新
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
