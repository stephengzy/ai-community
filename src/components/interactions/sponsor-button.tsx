"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/use-store"
import { useStore } from "@/store"

interface SponsorButtonProps {
  postId: string
  className?: string
}

const PRESET_AMOUNTS = [1000, 5000, 10000, 20000]

export function SponsorButton({ postId, className }: SponsorButtonProps) {
  const currentUser = useCurrentUser()
  const addSponsorComment = useStore((s) => s.addSponsorComment)
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [amount, setAmount] = useState<number>(5000)
  const [customAmount, setCustomAmount] = useState("")
  const [useCustom, setUseCustom] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Only show for L2+ users
  if (currentUser.level !== "L2" && currentUser.level !== "L1") return null

  const handleSubmit = () => {
    const finalAmount = useCustom ? Number(customAmount) : amount
    if (!content.trim() || !finalAmount || finalAmount <= 0) return
    addSponsorComment(postId, content.trim(), finalAmount)
    setContent("")
    setAmount(5000)
    setCustomAmount("")
    setUseCustom(false)
    setOpen(false)
  }

  const formatTokens = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
    return String(n)
  }

  const finalAmount = useCustom ? Number(customAmount) : amount

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open)
          if (!open) setTimeout(() => inputRef.current?.focus(), 150)
        }}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-secondary hover:bg-primary/8 hover:text-primary transition-all",
          open && "text-primary bg-primary/8",
          className
        )}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}
        >
          toll
        </span>
        <span className="text-[13px]">Sponsor</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Panel */}
          <div
            ref={panelRef}
            className="absolute bottom-full left-0 mb-2 w-[360px] bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-outline-variant/6 flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[18px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                toll
              </span>
              <span className="text-[14px] font-headline font-semibold text-on-surface">
                Sponsor This Build
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Message */}
              <div>
                <label className="text-[12px] font-semibold text-on-surface/50 uppercase tracking-wider mb-1.5 block">
                  Message
                </label>
                <textarea
                  ref={inputRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a sponsor message..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/15 bg-surface text-[14px] text-on-surface placeholder:text-secondary/30 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 resize-none"
                />
              </div>

              {/* Token Amount */}
              <div>
                <label className="text-[12px] font-semibold text-on-surface/50 uppercase tracking-wider mb-2 block">
                  Token Amount
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAmount(preset)
                        setUseCustom(false)
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all",
                        !useCustom && amount === preset
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-outline-variant/15 text-on-surface/60 hover:border-primary/30 hover:text-primary"
                      )}
                    >
                      {formatTokens(preset)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustom(true)
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all",
                      useCustom
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-outline-variant/15 text-on-surface/60 hover:border-primary/30 hover:text-primary"
                    )}
                  >
                    Custom
                  </button>
                </div>
                {useCustom && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      min={1}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-outline-variant/15 bg-surface text-[13px] text-on-surface placeholder:text-secondary/30 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10"
                    />
                    <span className="text-[12px] text-secondary/50">tokens</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-outline-variant/6 flex items-center justify-between">
              <div className="text-[12px] text-secondary/50">
                {finalAmount > 0 && content.trim()
                  ? `Sponsoring ${formatTokens(finalAmount)} tokens`
                  : "Fill in message & amount"}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() || !finalAmount || finalAmount <= 0}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[13px] font-headline font-semibold transition-all",
                  content.trim() && finalAmount > 0
                    ? "bg-primary text-on-primary hover:bg-primary-container"
                    : "bg-surface-container text-secondary/30 cursor-not-allowed"
                )}
              >
                Send Sponsor
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
