"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

const events = [
  {
    id: 1,
    title: "一大波实用 Skills 向你袭来！",
    image: "/images/events/event-1.jpg",
  },
  {
    id: 2,
    title: "商业化优质Skills精选集正式上线！",
    image: "/images/events/event-2.jpg",
  },
  {
    id: 3,
    title: "数据全系官方Skills宇宙正式开启！",
    image: "/images/events/event-3.jpg",
  },
]

export function EventCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % events.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + events.length) % events.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image area */}
      <div className="relative overflow-hidden rounded-xl group">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {events.map((event) => (
            <div key={event.id} className="w-full shrink-0">
              <img
                src={event.image}
                alt={event.title}
                className="w-full aspect-[5/2] object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Left/Right arrows */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>

        {/* Title + dots overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3.5 pt-6 pb-2.5 pointer-events-none">
          <p className="text-[13px] font-semibold text-white leading-snug">
            {events[current].title}
          </p>
          <div className="flex items-center gap-1.5 mt-2 pointer-events-auto">
            {events.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === current
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
