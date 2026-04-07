"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar } from "@/components/content/avatar"
import { useCurrentUser } from "@/hooks/use-store"
import { cn } from "@/lib/utils"

export function MobileFab() {
  const currentUser = useCurrentUser()
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      // Lock body scroll
      document.body.style.overflow = "hidden"
      setTimeout(() => textareaRef.current?.focus(), 200)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const handlePost = () => {
    if (!content.trim()) return
    // In a real app, this would submit the post
    setContent("")
    setOpen(false)
  }

  return (
    <>
      {/* FAB Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-20 right-5 w-12 h-12 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center z-40 active:scale-95 hover:shadow-xl transition-all"
      >
        <span className="material-symbols-outlined text-[22px]">add</span>
      </button>

      {/* Compose Sheet */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-50 animate-in fade-in-0 duration-200"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[14px] text-secondary/50 font-medium"
              >
                Cancel
              </button>
              <span className="text-[14px] font-headline font-semibold text-on-surface">
                New Post
              </span>
              <button
                type="button"
                onClick={handlePost}
                className={cn(
                  "text-[14px] font-headline font-semibold px-4 py-1.5 rounded-lg transition-all",
                  content.trim()
                    ? "bg-primary text-on-primary"
                    : "bg-primary/10 text-primary/30"
                )}
              >
                Post
              </button>
            </div>

            {/* Compose Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex gap-3">
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="sm"
                  className="shrink-0 mt-0.5"
                />
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What did you build?"
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-[16px] leading-[1.7] font-body placeholder:text-on-surface/30 text-on-surface min-h-[200px]"
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="px-4 py-3 border-t border-outline-variant/10 flex items-center gap-3 pb-safe">
              <button
                type="button"
                className="p-2 text-secondary/40 hover:text-primary transition-colors rounded-lg"
              >
                <span className="material-symbols-outlined text-[22px]">image</span>
              </button>
              <button
                type="button"
                className="p-2 text-secondary/40 hover:text-primary transition-colors rounded-lg"
              >
                <span className="material-symbols-outlined text-[22px]">alternate_email</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-secondary/40 hover:text-primary border border-outline-variant/15 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                <span className="text-[12px] font-medium">My Builds</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
