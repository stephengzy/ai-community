"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FormTextarea } from "@/components/build-form/form-textarea"
import { BuildPreview } from "@/components/build-form/build-preview"
import { Avatar } from "@/components/content/avatar"
import { CategoryTag } from "@/components/content/category-tag"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"
import type { BuildCategory, Visibility } from "@/types"

const categories = [
  { value: "SKILL", label: "Skill", icon: "psychology" },
  { value: "DEMO", label: "Demo", icon: "deployed_code" },
  { value: "OTHER", label: "Other", icon: "category" },
]

function bumpVersion(current: string, type: "patch" | "minor" | "major"): string {
  const parts = current.split(".").map(Number)
  const major = parts[0] || 1
  const minor = parts[1] || 0

  switch (type) {
    case "patch":
      return `${major}.${minor + 1}`
    case "minor":
      return `${major + 1}.0`
    case "major":
      return `${major + 1}.0`
    default:
      return current
  }
}

export function BuildEditClient({ buildId }: { buildId: string }) {
  const router = useRouter()
  // Read raw store data directly — stable references, no denormalization
  const rawBuild = useStore((s) => s.builds[buildId])
  const currentUserId = useStore((s) => s.currentUserId)
  const currentUser = useStore((s) => s.users[s.currentUserId])
  const updateBuild = useStore((s) => s.updateBuild)
  // Form state — initialized from build data via lazy initializers (no useEffect needed)
  const [name, setName] = useState(() => rawBuild?.name ?? "")
  const [tagline, setTagline] = useState(() => rawBuild?.description ?? "")
  const [selectedCategory, setSelectedCategory] = useState<BuildCategory | "">(() => rawBuild?.category ?? "")
  const [pitch, setPitch] = useState(() => rawBuild?.pitch ?? "")
  const [problem, setProblem] = useState(() => rawBuild?.problem ?? "")
  const [solution, setSolution] = useState(() => rawBuild?.solution ?? "")
  const [techTags, setTechTags] = useState<string[]>(() => rawBuild?.techStack ?? [])
  const [tagInput, setTagInput] = useState("")
  const [links, setLinks] = useState(() =>
    rawBuild?.links && rawBuild.links.length > 0
      ? rawBuild.links.map((l) => ({ title: l.label, url: l.url }))
      : [{ title: "", url: "" }]
  )
  const [visibility, setVisibility] = useState<Visibility>(() => rawBuild?.visibility ?? "PUBLIC")
  const [version, setVersion] = useState(() => rawBuild?.version ?? "1.0")
  const [versionBump, setVersionBump] = useState<"patch" | "minor" | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const isComposingRef = useRef(false)

  // Auto-save indicator
  useEffect(() => {
    const timer = setTimeout(() => setLastSaved(new Date()), 1500)
    return () => clearTimeout(timer)
  }, [name, tagline, selectedCategory, techTags, links, pitch, problem, solution])

  if (!rawBuild) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[14px] text-on-surface/40">Build not found</p>
      </div>
    )
  }

  const isOwner = rawBuild.authorId === currentUserId
  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[14px] text-on-surface/40">You don't have permission to edit this build.</p>
      </div>
    )
  }

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed || techTags.includes(trimmed)) return
    setTechTags([...techTags, trimmed])
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setTechTags(techTags.filter((t) => t !== tag))
  }

  const computedVersion = versionBump ? bumpVersion(rawBuild.version, versionBump) : version

  const handleUpdate = () => {
    const hasValidLink = links.some((l) => l.title.trim() && l.url.trim())

    updateBuild(buildId, {
      name: name.trim(),
      description: tagline.trim(),
      category: selectedCategory as BuildCategory,
      pitch: pitch.trim() || undefined,
      problem: problem.trim(),
      solution: solution.trim(),
      techStack: techTags,
      links: hasValidLink
        ? links
          .filter((l) => l.title.trim() && l.url.trim())
          .map((l) => ({ label: l.title.trim(), url: l.url.trim() }))
        : undefined,
      visibility,
      version: computedVersion,
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
            Build editing is available on desktop.
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
              <span className="text-[14px] font-headline font-semibold">Edit Build</span>
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

          {/* ===== Version ===== */}
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
              <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">Version</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
            </div>

            <div className="flex items-start gap-8">
              {/* Current version */}
              <div className="space-y-1.5">
                <p className="text-[12px] text-on-surface/45 font-medium">Current</p>
                <div className="flex items-center gap-2">
                  <span className="text-[28px] font-headline font-semibold text-on-surface/25 tracking-tight">
                    v{rawBuild.version}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="pt-7">
                <span className="material-symbols-outlined text-[24px] text-on-surface/20">arrow_forward</span>
              </div>

              {/* New version */}
              <div className="space-y-1.5">
                <p className="text-[12px] text-on-surface/45 font-medium">New</p>
                <span className="text-[28px] font-headline font-semibold text-primary tracking-tight">
                  v{computedVersion}
                </span>
              </div>
            </div>

            {/* Bump buttons */}
            <div className="flex items-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => setVersionBump(versionBump === "patch" ? null : "patch")}
                className={cn(
                  "px-4 py-2 rounded-xl border text-[13px] font-headline font-semibold transition-all",
                  versionBump === "patch"
                    ? "border-primary/30 bg-primary/[0.06] text-primary"
                    : "border-outline-variant/15 text-on-surface/45 hover:border-outline-variant/30 hover:text-on-surface/70"
                )}
              >
                Patch
                <span className="ml-2 text-[11px] font-body font-normal opacity-60">
                  {bumpVersion(rawBuild.version, "patch")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setVersionBump(versionBump === "minor" ? null : "minor")}
                className={cn(
                  "px-4 py-2 rounded-xl border text-[13px] font-headline font-semibold transition-all",
                  versionBump === "minor"
                    ? "border-primary/30 bg-primary/[0.06] text-primary"
                    : "border-outline-variant/15 text-on-surface/45 hover:border-outline-variant/30 hover:text-on-surface/70"
                )}
              >
                Minor
                <span className="ml-2 text-[11px] font-body font-normal opacity-60">
                  {bumpVersion(rawBuild.version, "minor")}
                </span>
              </button>
              <div className="h-5 w-px bg-outline-variant/10 mx-1" />
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-on-surface/35">or type:</span>
                <input
                  type="text"
                  value={versionBump ? "" : version}
                  onChange={(e) => {
                    setVersion(e.target.value)
                    setVersionBump(null)
                  }}
                  placeholder={rawBuild.version}
                  className="w-[80px] bg-transparent border-b border-outline-variant/12 focus:border-primary/40 focus:ring-0 focus:outline-none py-1 text-[14px] font-headline font-semibold text-on-surface placeholder:text-on-surface/20 text-center transition-colors"
                />
              </div>
            </div>
          </section>

          {/* ===== Hero: Name + Tagline ===== */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 40))}
                placeholder="Name your build"
                className="w-full bg-transparent border-b border-outline-variant/12 focus:border-primary/50 focus:ring-0 focus:outline-none pb-3 text-[36px] font-headline font-semibold placeholder:text-on-surface/18 text-on-surface tracking-tight leading-[1.2] transition-colors"
              />
              {name.length > 0 && (
                <span className={cn(
                  "absolute right-0 bottom-4 text-[12px]",
                  name.length >= 40 ? "text-red-400" : "text-on-surface/20"
                )}>
                  {name.length}/40
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value.slice(0, 80))}
                placeholder="Write a tagline for your build"
                className="w-full bg-transparent border-b border-outline-variant/8 focus:border-primary/40 focus:ring-0 focus:outline-none mt-4 pb-3 text-[14px] font-body placeholder:text-on-surface/30 text-on-surface/60 transition-colors"
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
              <div>
                <label className="block text-[18px] font-headline font-semibold text-on-surface mb-3">
                  Category <span className="text-primary/50">*</span>
                </label>
                <div className="flex items-center gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setSelectedCategory(selectedCategory === cat.value ? "" : cat.value as BuildCategory)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-left transition-all cursor-pointer select-none active:scale-[0.97]",
                        selectedCategory === cat.value
                          ? "border-primary/30 bg-primary/[0.06]"
                          : "border-outline-variant/30 hover:border-outline-variant/45"
                      )}
                    >
                      <span
                        className={cn(
                          "material-symbols-outlined text-[18px]",
                          selectedCategory === cat.value ? "text-primary" : "text-on-surface/70"
                        )}
                        style={{ fontVariationSettings: selectedCategory === cat.value ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {cat.icon}
                      </span>
                      <span className={cn(
                        "text-[13px] font-headline font-semibold",
                        selectedCategory === cat.value ? "text-primary" : "text-on-surface/70"
                      )}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Story fields */}
              <FormTextarea
                label="The Pitch"
                placeholder="Introduce your build"
                isRequired
                maxLength={800}
                defaultValue={pitch}
                onChange={(html) => setPitch(html.replace(/<[^>]*>/g, "").trim())}
              />
              <FormTextarea
                label="The Problem"
                placeholder="What problem does this solve?"
                isRequired
                maxLength={800}
                defaultValue={problem}
                onChange={(html) => setProblem(html.replace(/<[^>]*>/g, "").trim())}
              />
              <FormTextarea
                label="The Solution"
                placeholder="How does it work?"
                isRequired
                maxLength={800}
                defaultValue={solution}
                onChange={(html) => setSolution(html.replace(/<[^>]*>/g, "").trim())}
              />

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
                      if (val.endsWith(",") || val.endsWith("\uff0c")) {
                        const trimmed = val.slice(0, -1).trim()
                        if (trimmed && !techTags.includes(trimmed)) {
                          setTechTags((prev) => [...prev, trimmed])
                        }
                        setTagInput("")
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value
                      if (!isComposingRef.current && (val.endsWith(",") || val.endsWith("\uff0c"))) {
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
                    placeholder={techTags.length === 0 ? "e.g. Python, Claude API" : "Add more..."}
                    className="flex-1 min-w-[120px] bg-transparent focus:ring-0 focus:outline-none h-[30px] text-[14px] font-body placeholder:text-on-surface/30 text-on-surface"
                  />
                </div>
                <p className="mt-1.5 text-[12px] text-on-surface/25">
                  Press Enter to add · Backspace to remove
                </p>
              </div>
            </div>
          </section>

          {/* ===== Links ===== */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
              <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">Links</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
            </div>
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
          </section>
        </div>

        {/* Fixed footer */}
        <div className="sticky bottom-0 z-20 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/5">
          <div className="max-w-[960px] mx-auto flex items-center justify-between px-10 py-3.5">
            <button
              type="button"
              onClick={() => router.push(`/builds/${buildId}`)}
              className="text-[14px] text-on-surface/35 hover:text-on-surface/60 transition-colors font-medium"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 mr-4">
                <CategoryTag category={rawBuild.category} />
                <span className="material-symbols-outlined text-[14px] text-on-surface/20">arrow_forward</span>
                {selectedCategory && <CategoryTag category={selectedCategory as BuildCategory} />}
              </div>
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
                onClick={handleUpdate}
                className="px-6 py-2 rounded-xl text-[14px] font-headline font-semibold bg-primary text-on-primary hover:opacity-90 transition-all"
              >
                Update to v{computedVersion}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <BuildPreview
          name={name}
          tagline={tagline}
          category={selectedCategory as any}
          pitch={pitch}
          problem={problem}
          solution={solution}
          techTags={techTags}
          links={links.map((l) => ({ title: l.title, url: l.url }))}
          coverImage={rawBuild.coverImage}
          iconImage={rawBuild.iconImage}
          author={{ ...currentUser, id: currentUserId } as any}
          version={computedVersion}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  )
}
