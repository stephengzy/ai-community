"use client"

import { useTrendingBuilds } from "@/hooks/use-store"
import { UpvoteIcon } from "@/components/interactions/upvote-icon"
import Link from "next/link"

export function TrendingList() {
  const trendingBuilds = useTrendingBuilds(5)

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-surface-container/50 shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3">
        <h4 className="text-base font-headline font-semibold tracking-tight text-on-surface">
          本周最热作品
        </h4>
      </div>
      <div>
        {trendingBuilds.map((build) => (
          <Link
            key={build.id}
            href={`/builds/${build.id}`}
            className="block px-5 py-3 hover:bg-surface-container-low/50 transition-colors border-t border-outline-variant/5"
          >
            <p className="text-[13px] font-semibold text-on-surface leading-snug hover:text-primary transition-colors">
              {build.name}
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1 text-secondary">
                <UpvoteIcon size={10} className="text-primary/50" />
                <span className="text-[11px]">+{build.weeklyUpvotes} 本周</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
