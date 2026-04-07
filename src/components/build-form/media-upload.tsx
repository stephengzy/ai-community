"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  file: File
  preview: string
}

interface MediaUploadProps {
  className?: string
  onHasCoverChange?: (hasCover: boolean) => void
}

export function MediaUpload({ className, onHasCoverChange }: MediaUploadProps) {
  const [cover, setCover] = useState<UploadedFile | null>(null)
  const [gallery, setGallery] = useState<UploadedFile[]>([])
  const coverRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const createFile = (file: File): UploadedFile => ({
    id: crypto.randomUUID(),
    file,
    preview: URL.createObjectURL(file),
  })

  const handleCover = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return
    if (cover) URL.revokeObjectURL(cover.preview)
    setCover(createFile(file))
    onHasCoverChange?.(true)
  }

  const removeCover = () => {
    if (cover) URL.revokeObjectURL(cover.preview)
    setCover(null)
    if (coverRef.current) coverRef.current.value = ""
    onHasCoverChange?.(false)
  }

  const handleGalleryFiles = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/")).map(createFile)
    setGallery((prev) => [...prev, ...newFiles])
  }

  const removeGalleryFile = (id: string) => {
    const target = gallery.find((f) => f.id === id)
    if (target) URL.revokeObjectURL(target.preview)
    setGallery((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className={cn(className)}>
      <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleCover(e.target.files?.[0])} />
      <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleGalleryFiles(e.target.files)} />

      <div className="grid grid-cols-2 gap-4">
        {/* Cover */}
        <div>
          <p className="text-[12px] text-on-surface/50 mb-2">Cover image <span className="text-primary/60">*</span></p>
          {cover ? (
            <div className="relative group h-[140px] rounded-xl overflow-hidden border border-outline-variant/15 bg-surface-container-low">
              <img src={cover.preview} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button type="button" onClick={() => coverRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-white/90 text-[12px] font-medium text-on-surface hover:bg-white transition-colors">Replace</button>
                <button type="button" onClick={removeCover} className="px-3 py-1.5 rounded-lg bg-white/90 text-[12px] font-medium text-red-500 hover:bg-white transition-colors">Remove</button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              className="w-full h-[140px] rounded-xl border border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/[0.03] transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[24px] text-on-surface/35 group-hover:text-primary/60 transition-colors">add_photo_alternate</span>
              <span className="text-[12px] text-on-surface/40 group-hover:text-on-surface/60 transition-colors">16:9 recommended</span>
            </button>
          )}
          <p className="mt-1.5 text-[11px] text-on-surface/35">Shown in Gallery</p>
        </div>

        {/* Additional images */}
        <div>
          <p className="text-[12px] text-on-surface/50 mb-2">Additional images</p>
          <div className="flex flex-wrap gap-2 min-h-[140px] content-start">
            {gallery.map((f) => (
              <div key={f.id} className="relative group w-[66px] h-[66px] rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/15">
                <img src={f.preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryFile(f.id)}
                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[11px] text-white">close</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="w-[66px] h-[66px] rounded-lg border border-dashed border-outline-variant/50 flex items-center justify-center hover:border-primary/40 hover:bg-primary/[0.03] transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface/35 group-hover:text-primary/60 transition-colors">add</span>
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-on-surface/35">Shown on detail page</p>
        </div>
      </div>
    </div>
  )
}
