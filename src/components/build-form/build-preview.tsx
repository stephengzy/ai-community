"use client"

import { CategoryTag } from "@/components/content/category-tag"
import { Avatar } from "@/components/content/avatar"
import type { BuildCategory, User } from "@/types"
import { cn } from "@/lib/utils"

interface BuildPreviewProps {
  name: string
  tagline: string
  category: BuildCategory | ""
  pitch: string
  problem: string
  solution: string
  techTags: string[]
  links: { title: string; url: string }[]
  coverImage?: string
  iconImage?: string
  author: User
  version: string
  onClose: () => void
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant/20" />
      <h2 className="text-[13px] font-headline font-semibold uppercase tracking-[0.18em] text-primary/50 shrink-0 px-3">
        {title}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent" />
    </div>
  )
}

function StoryBlock({ label, content }: { label: string; content: string }) {
  if (!content) return null
  return (
    <div className="space-y-2">
      <h4 className="text-[14px] font-headline font-semibold text-primary/60">{label}</h4>
      <p className="text-[14px] text-on-surface/70 leading-[1.8]">{content}</p>
    </div>
  )
}

export function BuildPreview({
  name,
  tagline,
  category,
  pitch,
  problem,
  solution,
  techTags,
  links,
  coverImage,
  iconImage,
  author,
  version,
  onClose,
}: BuildPreviewProps) {
  const validLinks = links.filter((l) => l.title.trim() && l.url.trim())

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[800px] max-h-[90vh] overflow-y-auto mt-[5vh] mx-4 bg-surface rounded-2xl shadow-2xl border border-outline-variant/10">
        {/* Close bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-3 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/5">
          <div className="flex items-center gap-2 text-[13px] text-secondary/50">
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Preview
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] text-on-surface/50 hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            Close
          </button>
        </div>

        {/* Preview content */}
        <div className="px-8 pt-6 pb-10">
          {/* Cover image */}
          {coverImage && (
            <div className="aspect-video rounded-xl overflow-hidden bg-surface-container-low mb-6">
              <img src={coverImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              {category && <CategoryTag category={category as BuildCategory} />}
              <span className="text-[12px] text-secondary/40">v{version}</span>
            </div>
            <h1 className="text-[32px] font-headline font-semibold tracking-tight text-on-surface leading-tight">
              {name || "Untitled Build"}
            </h1>
            {tagline && (
              <p className="text-[15px] text-on-surface/50 mt-2 leading-relaxed">
                {tagline}
              </p>
            )}
          </div>

          {/* Author */}
          <div className="flex items-center gap-2.5 mb-6 pb-6 border-b border-outline-variant/8">
            <Avatar src={author.avatar} name={author.name} size="sm" />
            <div>
              <p className="text-[13px] font-semibold text-on-surface">
                {author.name}({author.realName})
              </p>
              <p className="text-[11px] text-secondary/50">{author.department} · {author.role}</p>
            </div>
          </div>

          {/* The Story */}
          {(pitch || problem || solution) && (
            <>
              <SectionDivider title="The Story" />
              <div className="space-y-6">
                <StoryBlock label="The Pitch" content={pitch} />
                <StoryBlock label="The Problem" content={problem} />
                <StoryBlock label="The Solution" content={solution} />
              </div>
            </>
          )}

          {/* Keywords */}
          {techTags.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {techTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-surface-container text-[12px] font-medium text-on-surface/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {validLinks.length > 0 && (
            <>
              <SectionDivider title="Links" />
              <div className="space-y-2">
                {validLinks.map((link, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container-lowest"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface/35">link</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-on-surface truncate">{link.title}</p>
                      <p className="text-[11px] text-secondary/40 truncate">{link.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {!name && !tagline && !pitch && !problem && !solution && techTags.length === 0 && validLinks.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-[48px] text-on-surface/10">edit_note</span>
              <p className="text-[14px] text-secondary/40 mt-3">Fill in the form to see a preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
