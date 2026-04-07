"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { Comment, User } from "@/types"
import { Avatar } from "@/components/content/avatar"
import { useCurrentUser, useUsers } from "@/hooks/use-store"
import { cn } from "@/lib/utils"

interface CommentInputProps {
  /** Currently replying to this comment (shows @tag) */
  replyTarget?: Comment | null
  /** Called to clear the reply state */
  onCancelReply?: () => void
  /** Called when user submits a comment */
  onSubmit: (text: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Whether to render in inline (reply) mode — slightly smaller */
  inline?: boolean
  /** Additional class */
  className?: string
}

export function CommentInput({
  replyTarget,
  onCancelReply,
  onSubmit,
  placeholder = "Write a comment...",
  inline,
  className,
}: CommentInputProps) {
  const currentUser = useCurrentUser()
  const allUsers = useUsers()
  const [text, setText] = useState("")
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionIndex, setMentionIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter users for @ mention
  const filteredUsers = mentionQuery
    ? allUsers.filter(
        (u) =>
          u.id !== currentUser.id &&
          (u.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
            u.realName.toLowerCase().includes(mentionQuery.toLowerCase()))
      )
    : allUsers.filter((u) => u.id !== currentUser.id)

  // Focus input when replyTarget changes
  useEffect(() => {
    if (replyTarget && inputRef.current) {
      inputRef.current.focus()
    }
  }, [replyTarget])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowMentionDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Detect @ in input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setText(value)

    const cursorPos = e.target.selectionStart ?? value.length
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

  // Insert mention
  const insertMention = useCallback(
    (user: User) => {
      if (!inputRef.current) return
      const cursorPos = inputRef.current.selectionStart ?? text.length
      const textBeforeCursor = text.slice(0, cursorPos)
      const textAfterCursor = text.slice(cursorPos)
      const atIndex = textBeforeCursor.lastIndexOf("@")
      const mention = `@${user.name}(${user.realName})`
      const newText =
        textBeforeCursor.slice(0, atIndex) + mention + " " + textAfterCursor
      setText(newText)
      setShowMentionDropdown(false)

      setTimeout(() => {
        if (inputRef.current) {
          const newPos = atIndex + mention.length + 1
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newPos, newPos)
        }
      }, 0)
    },
    [text]
  )

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentionDropdown && filteredUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setMentionIndex((prev) =>
          prev < Math.min(filteredUsers.length, 6) - 1 ? prev + 1 : 0
        )
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setMentionIndex((prev) =>
          prev > 0 ? prev - 1 : Math.min(filteredUsers.length, 6) - 1
        )
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        insertMention(filteredUsers[mentionIndex])
        return
      }
      if (e.key === "Escape") {
        setShowMentionDropdown(false)
        return
      }
    }

    if (e.key === "Enter" && !showMentionDropdown) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit(text.trim())
    setText("")
    setShowMentionDropdown(false)
  }

  return (
    <div className={cn("flex items-center", inline ? "gap-2 pl-1" : "gap-2.5", className)}>
      <Avatar
        src={currentUser.avatar}
        name={currentUser.name}
        size={inline ? "xs" : "sm"}
        className="shrink-0 self-center"
      />
      <div className={cn(
        "relative flex-1 flex items-center gap-1.5 bg-surface-container-low rounded-full pr-1.5 border border-transparent focus-within:border-primary/20 focus-within:ring-1 focus-within:ring-primary/10 transition-all",
        inline ? "pl-3 py-0.5" : "pl-3.5 py-1"
      )}>
        {/* Reply tag */}
        {replyTarget && (
          <button
            type="button"
            onClick={onCancelReply}
            className="text-[12px] text-primary bg-primary/8 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 hover:bg-primary/12 transition-colors"
          >
            @{replyTarget.author.name}
            <span className="material-symbols-outlined text-[12px]">close</span>
          </button>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            replyTarget
              ? `Reply to ${replyTarget.author.name}...`
              : placeholder
          }
          className="flex-1 min-w-0 bg-transparent text-[14px] text-on-surface placeholder:text-on-surface/30 border-none focus:outline-none py-1"
        />

        {/* @ trigger button */}
        <button
          type="button"
          onClick={() => {
            if (inputRef.current) {
              const cursorPos = inputRef.current.selectionStart ?? text.length
              const before = text.slice(0, cursorPos)
              const after = text.slice(cursorPos)
              const needSpace = before.length > 0 && !before.endsWith(" ")
              const newText = before + (needSpace ? " @" : "@") + after
              setText(newText)
              setTimeout(() => {
                if (inputRef.current) {
                  const newPos = cursorPos + (needSpace ? 2 : 1)
                  inputRef.current.focus()
                  inputRef.current.setSelectionRange(newPos, newPos)
                  setMentionQuery("")
                  setShowMentionDropdown(true)
                  setMentionIndex(0)
                }
              }, 0)
            }
          }}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-on-surface/25 hover:text-primary hover:bg-primary/5 transition-colors"
          title="Mention someone"
        >
          <span className="text-[14px] font-bold">@</span>
        </button>

        {/* Send button */}
        {text.trim() && (
          <button
            type="button"
            onClick={handleSubmit}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-primary text-on-primary hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_upward
            </span>
          </button>
        )}

        {/* @ Mention Dropdown */}
        {showMentionDropdown && filteredUsers.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 bottom-full z-50 mb-1.5 bg-surface-container-lowest rounded-xl border border-outline-variant/15 shadow-lg max-h-[220px] overflow-y-auto"
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
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-on-surface truncate">
                    {user.name}({user.realName})
                  </p>
                  <p className="text-[11px] text-secondary/50 truncate">
                    {user.department} · {user.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
