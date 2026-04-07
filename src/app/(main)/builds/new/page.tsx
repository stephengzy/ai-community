"use client"

import { useState, useRef, useEffect } from "react"
import { FormInput } from "@/components/build-form/form-input"
import { FormTextarea } from "@/components/build-form/form-textarea"
import { MediaUpload } from "@/components/build-form/media-upload"
import { VisibilitySelector } from "@/components/build-form/visibility-selector"
import { BuildPreview } from "@/components/build-form/build-preview"
import { Avatar } from "@/components/content/avatar"
import { useCurrentUser, useUsers } from "@/hooks/use-store"
import { cn } from "@/lib/utils"

const categories = [
  { value: "SKILL", label: "Skill", icon: "psychology", desc: "Your hard-earned expertise, distilled into a reusable AI capability." },
  { value: "DEMO", label: "Demo", icon: "deployed_code", desc: "From idea to working product — built on or inspired by rednote." },
  { value: "OTHER", label: "Other", icon: "category", desc: "Everything else worth sharing." },
]

export default function BuildSubmissionPage() {
  const currentUser = useCurrentUser()
  const users = useUsers()
  const [buildName, setBuildName] = useState("")
  const [tagline, setTagline] = useState("")
  const [techTags, setTechTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [links, setLinks] = useState([{ title: "", url: "" }])
  const [collaborators, setCollaborators] = useState<string[]>([])
  const [pitch, setPitch] = useState("")
  const [problem, setProblem] = useState("")
  const [solution, setSolution] = useState("")
  const [hasCover, setHasCover] = useState(false)
  const [visibility, setVisibility] = useState<string | null>(null)
  const isComposingRef = useRef(false)
  const [showCollabSearch, setShowCollabSearch] = useState(false)
  const [collabSearch, setCollabSearch] = useState("")
  const collabRef = useRef<HTMLDivElement>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showPreview, setShowPreview] = useState(false)

  // Simulate auto-save on any form change
  useEffect(() => {
    const timer = setTimeout(() => setLastSaved(new Date()), 1500)
    return () => clearTimeout(timer)
  }, [buildName, tagline, selectedCategory, techTags, links, collaborators])

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

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    if (techTags.includes(trimmed)) {
      // Duplicate: keep the text, don't clear
      return
    }
    setTechTags([...techTags, trimmed])
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setTechTags(techTags.filter((t) => t !== tag))
  }

  const toggleCollaborator = (userId: string) => {
    setCollaborators((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const availableCollabs = users.filter(
    (u) =>
      u.id !== currentUser.id &&
      (collabSearch === "" ||
        u.name.includes(collabSearch) ||
        u.realName.toLowerCase().includes(collabSearch.toLowerCase()))
  )

  const selectedCollabs = users.filter((u) => collaborators.includes(u.id))

  const hasValidLink = links.some((l) => l.title.trim() && l.url.trim())

  const handlePublish = () => {
    const newErrors: Record<string, boolean> = {}
    if (!buildName.trim()) newErrors.buildName = true
    if (!tagline.trim()) newErrors.tagline = true
    if (!selectedCategory) newErrors.category = true
    if (!pitch.trim()) newErrors.pitch = true
    if (!problem.trim()) newErrors.problem = true
    if (!solution.trim()) newErrors.solution = true
    if (!hasValidLink) newErrors.links = true
    if (!hasCover) newErrors.media = true
    if (!visibility) newErrors.visibility = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstKey = Object.keys(newErrors)[0]
      const el = document.querySelector(`[data-field="${firstKey}"]`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    // All valid — proceed with publish
  }

  // Clear individual errors as user fills them
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
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
            Build submission is available on desktop.
          </p>
        </div>
      </div>

      {/* Desktop: full form */}
      <div className="hidden md:block min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/5">
          <div className="max-w-[960px] mx-auto flex items-center justify-between px-10 py-3.5">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-on-surface/50 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="text-[14px] font-headline font-semibold">New Build</span>
            </button>
            <div className="flex items-center gap-4">
              <span className="text-[12px] text-secondary/40">
                {lastSaved ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400/70 mr-1.5 align-middle" />
                    Saved just now
                  </>
                ) : (
                  "Not saved yet"
                )}
              </span>
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Main form */}
        <div className="max-w-[960px] mx-auto px-10 pt-10 pb-36">

          {/* ===== Hero: Name + Tagline ===== */}
          <div className="mb-8" data-field="buildName">
            <div className="relative">
              <input
                type="text"
                value={buildName}
                onChange={(e) => { setBuildName(e.target.value.slice(0, 40)); clearError("buildName") }}
                placeholder="Name your build"
                className={cn(
                  "w-full bg-transparent border-b focus:border-primary/50 focus:ring-0 focus:outline-none pb-3 text-[36px] font-headline font-semibold placeholder:text-on-surface/18 text-on-surface tracking-tight leading-[1.2] transition-colors",
                  errors.buildName ? "border-red-500/60" : "border-outline-variant/12"
                )}
              />
              {buildName.length > 0 && (
                <span className={cn(
                  "absolute right-0 bottom-4 text-[12px]",
                  buildName.length >= 40 ? "text-red-400" : "text-on-surface/20"
                )}>
                  {buildName.length}/40
                </span>
              )}
            </div>
            <div className="relative" data-field="tagline">
              <input
                type="text"
                value={tagline}
                onChange={(e) => { setTagline(e.target.value.slice(0, 80)); clearError("tagline") }}
                placeholder="Write a tagline for your build"
                className={cn(
                  "w-full bg-transparent border-b focus:border-primary/40 focus:ring-0 focus:outline-none mt-4 pb-3 text-[14px] font-body placeholder:text-on-surface/30 text-on-surface/60 transition-colors",
                  errors.tagline ? "border-red-500/60" : "border-outline-variant/8"
                )}
              />
              {tagline.length > 0 && (
                <span className={cn(
                  "absolute right-0 bottom-4 text-[12px]",
                  tagline.length >= 80 ? "text-red-400" : "text-on-surface/20"
                )}>
                  {tagline.length}/80
                </span>
              )}
            </div>
          </div>

          {/* ===== The Story ===== */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
              <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">The Story</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
            </div>
            <div className="space-y-6">
              {/* Category */}
              <div data-field="category">
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  Category <span className="text-primary/50">*</span>
                </label>
                {errors.category && (
                  <p className="text-[12px] text-red-500 mb-2">Please select a category</p>
                )}
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => { setSelectedCategory(selectedCategory === cat.value ? "" : cat.value); clearError("category") }}
                      className={cn(
                        "flex flex-col items-start gap-2 px-5 py-4 rounded-xl border text-left transition-all duration-150 cursor-pointer select-none active:scale-[0.97]",
                        selectedCategory === cat.value
                          ? "border-primary/30 bg-primary/[0.06] shadow-sm"
                          : "border-outline-variant/30 hover:border-outline-variant/45 hover:bg-surface-container-low/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "material-symbols-outlined text-[20px]",
                            selectedCategory === cat.value ? "text-primary" : "text-on-surface/70"
                          )}
                          style={{ fontVariationSettings: selectedCategory === cat.value ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {cat.icon}
                        </span>
                        <span className={cn(
                          "text-[14px] font-headline font-semibold",
                          selectedCategory === cat.value ? "text-primary" : "text-on-surface/70"
                        )}>
                          {cat.label}
                        </span>
                      </div>
                      <p className={cn(
                        "text-[12px] leading-relaxed",
                        selectedCategory === cat.value ? "text-primary/60" : "text-on-surface/55"
                      )}>
                        {cat.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Story */}
              <div data-field="pitch">
                <FormTextarea
                  label="The Pitch"
                  placeholder="Introduce your build — what it is and why it matters"
                  isRequired
                  maxLength={800}
                  onChange={(html) => { setPitch(html.replace(/<[^>]*>/g, "").trim()); clearError("pitch") }}
                  error={errors.pitch}
                />
              </div>
              <div data-field="problem">
                <FormTextarea
                  label="The Problem"
                  placeholder="What problem does this solve? Why does it matter?"
                  isRequired
                  maxLength={800}
                  onChange={(html) => { setProblem(html.replace(/<[^>]*>/g, "").trim()); clearError("problem") }}
                  error={errors.problem}
                />
              </div>
              <div data-field="solution">
                <FormTextarea
                  label="The Solution"
                  placeholder="How does it work? Describe the technical approach."
                  isRequired
                  maxLength={800}
                  onChange={(html) => { setSolution(html.replace(/<[^>]*>/g, "").trim()); clearError("solution") }}
                  error={errors.solution}
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  Keywords
                </label>
                <div className="flex flex-wrap gap-2 items-center py-2 border-b border-outline-variant/12 focus-within:border-primary/40 transition-colors">
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
                        if (trimmed && !techTags.includes(trimmed)) {
                          setTechTags((prev) => [...prev, trimmed])
                        }
                        setTagInput("")
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value
                      if (!isComposingRef.current && (val.endsWith(",") || val.endsWith("，"))) {
                        const trimmed = val.slice(0, -1).trim()
                        if (trimmed && !techTags.includes(trimmed)) {
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
                    placeholder={techTags.length === 0 ? "e.g. 组织穿透、日常数据报表、财务分析" : "Add more..."}
                    className="flex-1 min-w-[120px] bg-transparent focus:ring-0 focus:outline-none h-[30px] text-[14px] font-body placeholder:text-on-surface/30 text-on-surface"
                  />
                </div>
                <p className="mt-1.5 text-[12px] text-on-surface/25">
                  Press Enter to add · Backspace to remove
                </p>
              </div>
            </div>
          </section>


          {/* ===== The Goods ===== */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
              <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">The Goods</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
            </div>
            <div className="space-y-6">
              {/* Links */}
              <div data-field="links">
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  Show Us Your Goods <span className="text-primary/50">*</span>
                </label>
                {errors.links && (
                  <p className="text-[12px] text-red-500 mb-2">At least one link with title and URL is required</p>
                )}
                <div className="space-y-3">
                  {links.map((link, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-3 border-b border-outline-variant/12 focus-within:border-primary/40 transition-colors">
                        <input
                          value={link.title}
                          onChange={(e) => {
                            const next = [...links]
                            next[i] = { ...next[i], title: e.target.value }
                            setLinks(next)
                            clearError("links")
                          }}
                          placeholder="Title"
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
                  <button
                    type="button"
                    onClick={() => setLinks([...links, { title: "", url: "" }])}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-primary/50 hover:text-primary/80 transition-colors mt-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Add another link
                  </button>
                </div>
              </div>

              {/* Media */}
              <div data-field="media">
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  Media <span className="text-primary/50">*</span>
                </label>
                {errors.media && (
                  <p className="text-[12px] text-red-500 mb-2">A cover image is required</p>
                )}
                <MediaUpload onHasCoverChange={(has) => { setHasCover(has); if (has) clearError("media") }} />
              </div>
            </div>
          </section>


          {/* ===== The Setup ===== */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
              <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">The Setup</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
            </div>
            <div className="space-y-6">
              {/* Collaborators */}
              <div>
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  Collaborators
                </label>
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
                      Add people
                    </button>

                    {showCollabSearch && (
                      <div className="absolute top-full left-0 mt-2 w-[280px] bg-surface-container-lowest rounded-2xl border border-outline-variant/8 shadow-xl z-30 overflow-hidden">
                        <div className="p-3.5 border-b border-outline-variant/6">
                          <input
                            autoFocus
                            value={collabSearch}
                            onChange={(e) => setCollabSearch(e.target.value)}
                            placeholder="Search people..."
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

              {/* Visibility */}
              <div data-field="visibility">
                <VisibilitySelector onChange={(v) => { setVisibility(v); if (v) clearError("visibility") }} error={errors.visibility} />
              </div>
            </div>
          </section>
        </div>

        {/* Fixed footer */}
        <div className="sticky bottom-0 z-20 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/5">
          <div className="max-w-[960px] mx-auto flex items-center justify-between px-10 py-3.5">
            <button
              type="button"
              className="text-[14px] font-headline font-semibold text-on-surface/35 hover:text-on-surface/60 transition-colors"
            >
              Discard
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl border border-outline-variant/15 text-[14px] font-headline font-semibold text-on-surface/55 hover:bg-surface-container hover:text-on-surface/80 hover:border-outline-variant/40 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Preview
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl border border-outline-variant/15 text-[14px] font-headline font-semibold text-on-surface/55 hover:bg-surface-container hover:text-on-surface/80 hover:border-outline-variant/40 transition-all"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2 rounded-xl text-[14px] font-headline font-semibold bg-primary text-on-primary hover:opacity-90 transition-all"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <BuildPreview
          name={buildName}
          tagline={tagline}
          category={selectedCategory as any}
          pitch={pitch}
          problem={problem}
          solution={solution}
          techTags={techTags}
          links={links.map((l) => ({ title: l.title, url: l.url }))}
          author={currentUser}
          version="1.0"
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  )
}
