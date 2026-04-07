"use client"

import { useBuilds } from "@/hooks/use-store"
import { GalleryContent } from "@/components/gallery/gallery-content"

export default function HomePage() {
  const builds = useBuilds()
  return <GalleryContent builds={builds} />
}
