"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageCropProps {
  src: string
  alt: string
  className?: string
}

export function ImageCrop({ src, alt, className }: ImageCropProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden cursor-pointer transition-all duration-300",
        !expanded && "max-h-[200px] lg:max-h-[200px] max-h-[160px]",
        className
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
