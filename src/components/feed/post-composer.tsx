"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Avatar } from "@/components/content/avatar"
import { useCurrentUser, useUsers, useBuildsByUser } from "@/hooks/use-store"
import { categoryIcons, TOPICS } from "@/data/constants"
import { CategoryTag } from "@/components/content/category-tag"
import type { User, Build, Visibility } from "@/types"
import { cn } from "@/lib/utils"

// Rich text overlay: renders all text, with @mentions in primary color
function RichOverlay({ text }: { text: string }) {
  const parts = text.split(/(@[\w\u4e00-\u9fff]+(?:\([\w\u4e00-\u9fff]+\))?)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("@")) {
          return (
            <span key={i} className="text-primary font-medium">
              {part}
            </span>
          )
        }
        return <span key={i} className="text-on-surface">{part}</span>
      })}
    </>
  )
}

export function PostComposer() {
  const currentUser = useCurrentUser()
  const users = useUsers()
  const [content, setContent] = useState("")
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionIndex, setMentionIndex] = useState(0)
  const [showBuildPicker, setShowBuildPicker] = useState(false)
  const [buildQuery, setBuildQuery] = useState("")
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null)
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC")
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [showTopicPicker, setShowTopicPicker] = useState(false)
  const topicPickerRef = useRef<HTMLDivElement>(null)
  const visibilityRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const mentionDropdownRef = useRef<HTMLDivElement>(null)
  const buildPickerRef = useRef<HTMLDivElement>(null)

  // Check if content has any @mentions
  const hasMentions = /@[\w\u4e00-\u9fff]+/.test(content)

  // Get builds where currentUser is author or collaborator
  const myBuilds = useBuildsByUser(currentUser.id)

  // Filter users for mention dropdown
  const filteredUsers = mentionQuery
    ? users.filter(
        (u) =>
          u.id !== currentUser.id &&
          (u.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
            u.realName.toLowerCase().includes(mentionQuery.toLowerCase()))
      )
    : users.filter((u) => u.id !== currentUser.id)

  // Filter builds for picker
  const filteredBuilds = buildQuery
    ? myBuilds.filter((b) =>
        b.name.toLowerCase().includes(buildQuery.toLowerCase())
      )
    : myBuilds

  // Handle textarea input change with @ detection
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)

    const cursorPos = e.target.selectionStart
    const textBeforeCursor = value.slice(0, cursorPos)
    const atMatch = textBeforeCursor.match(/@([^\s@]*)$/)

    if (atMatch) {
      setMentionQuery(atMatch[1])
      setShowMentionDropdown(true)
      setMentionIndex(0)
    } else {
      setShowMentionDropdown(false)
    }
  }

  // Insert mention into content
  const insertMention = useCallback(
    (user: User) => {
      if (!textareaRef.current) return
      const cursorPos = textareaRef.current.selectionStart
      const textBeforeCursor = content.slice(0, cursorPos)
      const textAfterCursor = content.slice(cursorPos)
      const atIndex = textBeforeCursor.lastIndexOf("@")
      const newContent =
        textBeforeCursor.slice(0, atIndex) +
        `@${user.name}(${user.realName}) ` +
        textAfterCursor
      setContent(newContent)
      setShowMentionDropdown(false)

      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = atIndex + `@${user.name}(${user.realName}) `.length
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(newPos, newPos)
        }
      }, 0)
    },
    [content]
  )

  // Trigger @ from button click
  const triggerMention = () => {
    setShowMentionDropdown(false)
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart
      const before = content.slice(0, cursorPos)
      const after = content.slice(cursorPos)
      const needSpace =
        before.length > 0 && !before.endsWith(" ") && !before.endsWith("\n")
      const newContent = before + (needSpace ? " @" : "@") + after
      setContent(newContent)
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = cursorPos + (needSpace ? 2 : 1)
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(newPos, newPos)
          setMentionQuery("")
          setShowMentionDropdown(true)
          setMentionIndex(0)
        }
      }, 0)
    }
  }

  // Handle keyboard navigation in mention dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentionDropdown || filteredUsers.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setMentionIndex((prev) =>
        prev < filteredUsers.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setMentionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredUsers.length - 1
      )
    } else if (e.key === "Enter" && showMentionDropdown) {
      e.preventDefault()
      insertMention(filteredUsers[mentionIndex])
    } else if (e.key === "Escape") {
      setShowMentionDropdown(false)
    }
  }

  // Select a build to attach
  const selectBuild = (build: Build) => {
    setSelectedBuild(build)
    setShowBuildPicker(false)
    setBuildQuery("")
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mentionDropdownRef.current &&
        !mentionDropdownRef.current.contains(e.target as Node)
      ) {
        setShowMentionDropdown(false)
      }
      if (
        buildPickerRef.current &&
        !buildPickerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-build-trigger]")
      ) {
        setShowBuildPicker(false)
      }
      if (
        visibilityRef.current &&
        !visibilityRef.current.contains(e.target as Node)
      ) {
        setShowVisibilityMenu(false)
      }
      if (
        topicPickerRef.current &&
        !topicPickerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-topic-trigger]")
      ) {
        setShowTopicPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Auto-resize textarea + sync overlay scroll
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.max(56, textareaRef.current.scrollHeight)}px`
    }
  }, [content])

  // Sync scroll between textarea and overlay
  const handleScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const iconStyle = { fontVariationSettings: "'wght' 300" } as const

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-surface-container/50 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
        <div className="flex-1 min-w-0">
          {/* Text input area with rich overlay */}
          <div className="relative">
            {/* Rich overlay for @mention highlighting */}
            {hasMentions && (
              <div
                ref={overlayRef}
                aria-hidden
                className="absolute inset-0 pointer-events-none min-h-[56px] text-base font-body whitespace-pre-wrap break-words overflow-hidden"
                style={{ wordBreak: "break-word" }}
              >
                <RichOverlay text={content} />
              </div>
            )}
            <textarea
              ref={textareaRef}
              placeholder="What did you build?"
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              className={cn(
                "w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none min-h-[56px] text-base placeholder:text-on-surface/40 placeholder:font-headline font-body whitespace-pre-wrap",
                hasMentions && "caret-on-surface"
              )}
              style={hasMentions ? { color: "transparent", caretColor: "var(--color-on-surface)" } : undefined}
            />

            {/* @ Mention Dropdown */}
            {showMentionDropdown && filteredUsers.length > 0 && (
              <div
                ref={mentionDropdownRef}
                className="absolute left-0 right-0 top-full z-50 mt-1 bg-surface-container-lowest rounded-xl border border-outline-variant/12 shadow-lg max-h-[200px] overflow-y-auto"
              >
                {filteredUsers.slice(0, 6).map((user, i) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => insertMention(user)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer",
                      i === mentionIndex
                        ? "bg-primary/8"
                        : "hover:bg-surface-container-low"
                    )}
                  >
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <div className="min-w-0">
                      <span className="text-[13px] font-semibold text-on-surface">
                        {user.name}({user.realName})
                      </span>
                      <span className="text-[11px] text-secondary ml-2">
                        {user.department} · {user.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected topics */}
          {selectedTopicIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1 mb-1">
              {selectedTopicIds.map((id) => {
                const topic = TOPICS.find((t) => t.id === id)
                if (!topic) return null
                return (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/8 text-primary text-[11px] font-medium">
                    {topic.emoji && <span>{topic.emoji}</span>}
                    {topic.name}
                    <button
                      type="button"
                      onClick={() => setSelectedTopicIds((prev) => prev.filter((tid) => tid !== id))}
                      className="ml-0.5 hover:text-primary/60 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          {/* Attached Build - compact preview matching BuildBar style */}
          {selectedBuild && (
            <div className="relative mt-1 mb-1 flex items-center gap-3 rounded-xl py-3 px-3.5 bg-surface-container-low/50 border border-outline-variant/8">
              {/* Icon */}
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", selectedBuild.category === "DEMO" ? "bg-demo/8" : "bg-primary/6")}>
                <span className={cn("material-symbols-outlined text-[20px]", selectedBuild.category === "DEMO" ? "text-demo" : "text-primary")}>
                  {categoryIcons[selectedBuild.category] ?? "category"}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-on-surface leading-tight truncate">
                  {selectedBuild.name}
                </p>
                <p className="text-[12px] text-secondary mt-0.5 truncate">
                  {selectedBuild.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CategoryTag category={selectedBuild.category} size="xs" />
                </div>
              </div>
              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedBuild(null)}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-secondary/60 hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  close
                </span>
              </button>
            </div>
          )}

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-surface-container-low">
            <div className="flex items-center gap-0.5">
              {/* Icon buttons - uniform size */}
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary rounded-full hover:bg-surface-container transition-colors cursor-pointer"
                title="Add image"
              >
                <span
                  className="material-symbols-outlined text-[19px]"
                  style={iconStyle}
                >
                  image
                </span>
              </button>
              <button
                type="button"
                onClick={triggerMention}
                className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary rounded-full hover:bg-surface-container transition-colors cursor-pointer"
                title="@mention"
              >
                <span
                  className="material-symbols-outlined text-[19px]"
                  style={iconStyle}
                >
                  alternate_email
                </span>
              </button>

              {/* Topic picker */}
              <div className="relative">
                <button
                  type="button"
                  data-topic-trigger
                  onClick={() => setShowTopicPicker(!showTopicPicker)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer",
                    selectedTopicIds.length > 0
                      ? "text-primary bg-primary/8"
                      : "text-secondary hover:text-primary hover:bg-surface-container"
                  )}
                  title="Add topic"
                >
                  <span className="material-symbols-outlined text-[19px]" style={iconStyle}>
                    tag
                  </span>
                </button>
                {showTopicPicker && (
                  <div ref={topicPickerRef} className="absolute left-0 bottom-full z-50 mb-1.5 w-[240px] bg-surface-container-lowest rounded-xl border border-outline-variant/12 shadow-lg py-3 px-3">
                    <p className="text-[11px] text-secondary/50 px-1 mb-2">Select Topic</p>
                    <div className="flex flex-wrap gap-1.5">
                      {TOPICS.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            setSelectedTopicIds((prev) =>
                              prev.includes(topic.id)
                                ? prev.filter((id) => id !== topic.id)
                                : [...prev, topic.id]
                            )
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border cursor-pointer",
                            selectedTopicIds.includes(topic.id)
                              ? "bg-primary text-on-primary border-primary"
                              : "bg-transparent text-on-surface/50 border-outline-variant/12 hover:border-primary/30"
                          )}
                        >
                          {topic.emoji && <span className="mr-0.5">{topic.emoji}</span>}
                          {topic.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-outline-variant/15 mx-1.5" />

              {/* Attach Build Button - prominent pill */}
              <div className="relative">
                <button
                  type="button"
                  data-build-trigger
                  onClick={() => setShowBuildPicker(!showBuildPicker)}
                  className={cn(
                    "h-8 flex items-center gap-1.5 pl-2 pr-3 rounded-full text-[12px] font-medium transition-all cursor-pointer border",
                    showBuildPicker || selectedBuild
                      ? "bg-primary/8 text-primary border-primary/20"
                      : "bg-surface-container-lowest text-secondary border-outline-variant/12 hover:border-primary/30 hover:text-primary"
                  )}
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'wght' 400" }}
                  >
                    deployed_code
                  </span>
                  My Builds
                </button>

                {/* Build Picker Dropdown */}
                {showBuildPicker && (
                  <div
                    ref={buildPickerRef}
                    className="absolute left-0 top-full z-50 mt-1.5 w-[280px] bg-surface-container-lowest rounded-xl border border-outline-variant/12 shadow-lg overflow-hidden"
                  >
                    <div className="px-3 pt-3 pb-2">
                      <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-2.5 py-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          search
                        </span>
                        <input
                          type="text"
                          placeholder="Search my builds..."
                          value={buildQuery}
                          onChange={(e) => setBuildQuery(e.target.value)}
                          className="flex-1 bg-transparent border-none text-[13px] focus:ring-0 focus:outline-none placeholder:text-outline-variant"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-[220px] overflow-y-auto px-1.5 pb-1.5">
                      {filteredBuilds.length === 0 ? (
                        <p className="text-[12px] text-secondary text-center py-4">
                          No builds found
                        </p>
                      ) : (
                        filteredBuilds.map((build) => (
                          <button
                            key={build.id}
                            type="button"
                            onClick={() => selectBuild(build)}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer",
                              selectedBuild?.id === build.id
                                ? "bg-primary/8"
                                : "hover:bg-surface-container-low"
                            )}
                          >
                            <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0", build.category === "DEMO" ? "bg-demo/8" : "bg-primary/6")}>
                              <span className={cn("material-symbols-outlined text-[15px]", build.category === "DEMO" ? "text-demo" : "text-primary")}>
                                {categoryIcons[build.category] ?? "category"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-on-surface truncate">
                                {build.name}
                              </p>
                              <CategoryTag category={build.category} size="xs" />
                            </div>
                            <span className="text-[11px] text-secondary shrink-0">
                              ↑{build.upvotes}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Visibility Selector */}
              <div className="relative" ref={visibilityRef}>
                <button
                  type="button"
                  onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                  className={cn(
                    "h-8 flex items-center gap-1 pl-2 pr-2.5 rounded-full text-[12px] font-medium transition-all cursor-pointer border",
                    showVisibilityMenu
                      ? "bg-primary/8 text-primary border-primary/20"
                      : "bg-surface-container-lowest text-secondary border-outline-variant/12 hover:border-primary/30 hover:text-primary"
                  )}
                >
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: visibility === "PUBLIC" ? "'FILL' 0" : "'FILL' 1" }}
                  >
                    {visibility === "PUBLIC" ? "public" : "lock"}
                  </span>
                  <span>{visibility === "PUBLIC" ? "Public" : "Dept"}</span>
                  <span className="material-symbols-outlined text-[14px] -mr-0.5" style={iconStyle}>expand_more</span>
                </button>

                {showVisibilityMenu && (
                  <div className="absolute right-0 top-full z-50 mt-1.5 w-[220px] bg-surface-container-lowest rounded-xl border border-outline-variant/12 shadow-lg overflow-hidden py-1.5 px-1.5">
                    <button
                      type="button"
                      onClick={() => { setVisibility("PUBLIC"); setShowVisibilityMenu(false) }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer",
                        visibility === "PUBLIC" ? "bg-primary/6" : "hover:bg-surface-container-low"
                      )}
                    >
                      <span className={cn("material-symbols-outlined text-[18px]", visibility === "PUBLIC" ? "text-primary" : "text-on-surface/40")}>public</span>
                      <div className="flex-1">
                        <p className={cn("text-[13px] font-medium", visibility === "PUBLIC" ? "text-primary" : "text-on-surface")}>Public</p>
                        <p className="text-[11px] text-on-surface/30">Visible to everyone</p>
                      </div>
                      {visibility === "PUBLIC" && <span className="material-symbols-outlined text-[14px] text-primary">check</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setVisibility("DEPARTMENT"); setShowVisibilityMenu(false) }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer",
                        visibility === "DEPARTMENT" ? "bg-primary/6" : "hover:bg-surface-container-low"
                      )}
                    >
                      <span className={cn("material-symbols-outlined text-[18px]", visibility === "DEPARTMENT" ? "text-primary" : "text-on-surface/40")} style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                      <div className="flex-1">
                        <p className={cn("text-[13px] font-medium", visibility === "DEPARTMENT" ? "text-primary" : "text-on-surface")}>Dept only</p>
                        <p className="text-[11px] text-on-surface/30">Your department only</p>
                      </div>
                      {visibility === "DEPARTMENT" && <span className="material-symbols-outlined text-[14px] text-primary">check</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Post Button */}
              <button
                type="button"
                disabled={content.trim().length === 0 && !selectedBuild}
                className={cn(
                  "bg-primary text-on-primary rounded-lg px-5 py-1.5 text-[13px] font-headline font-semibold tracking-tight transition-all cursor-pointer",
                  content.trim().length === 0 && !selectedBuild
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:opacity-90 active:scale-[0.97]"
                )}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
