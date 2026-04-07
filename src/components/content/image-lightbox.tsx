"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

interface ImageLightboxProps {
  images: string[]
  initialIndex: number
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const translateStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const resetTransform = useCallback(() => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }, [])

  const prev = useCallback(() => {
    resetTransform()
    setIndex((i) => (i > 0 ? i - 1 : images.length - 1))
  }, [images.length, resetTransform])

  const next = useCallback(() => {
    resetTransform()
    setIndex((i) => (i < images.length - 1 ? i + 1 : 0))
  }, [images.length, resetTransform])

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(s + 0.5, 4))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s - 0.5, 1)
      if (next === 1) setTranslate({ x: 0, y: 0 })
      return next
    })
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          prev()
          break
        case "ArrowRight":
          next()
          break
        case "+":
        case "=":
          zoomIn()
          break
        case "-":
          zoomOut()
          break
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, prev, next, zoomIn, zoomOut])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      setScale((s) => Math.min(s + 0.2, 4))
    } else {
      setScale((s) => {
        const next = Math.max(s - 0.2, 1)
        if (next === 1) setTranslate({ x: 0, y: 0 })
        return next
      })
    }
  }, [])

  // Drag to pan when zoomed
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= 1) return
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    translateStart.current = { ...translate }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [scale, translate])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    setTranslate({
      x: translateStart.current.x + (e.clientX - dragStart.current.x),
      y: translateStart.current.y + (e.clientY - dragStart.current.y),
    })
  }, [dragging])

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  // Click backdrop to close (only if not zoomed and not dragging)
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current && scale === 1) {
      onClose()
    }
  }, [onClose, scale])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3">
        <span className="text-white/70 text-[14px] font-medium">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={zoomOut}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
          <span className="text-white/50 text-[13px] w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className="w-px h-5 bg-white/15 mx-1" />
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[22px]">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[22px]">chevron_right</span>
          </button>
        </>
      )}

      {/* Image container */}
      <div
        ref={containerRef}
        className={cn(
          "relative z-[1] w-full h-full flex items-center justify-center px-14 py-14",
          scale > 1 ? "cursor-grab" : "cursor-default",
          dragging && "cursor-grabbing"
        )}
        onClick={handleBackdropClick}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <img
          src={images[index]}
          alt=""
          draggable={false}
          className="max-w-full max-h-full object-contain select-none transition-transform duration-150"
          style={{
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
          }}
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1.5">
          {images.map((img, i) => (
            <button
              key={`thumb-${i}`}
              type="button"
              onClick={() => { resetTransform(); setIndex(i) }}
              className={cn(
                "w-10 h-10 rounded-md overflow-hidden border-2 transition-all shrink-0",
                i === index ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-80"
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
