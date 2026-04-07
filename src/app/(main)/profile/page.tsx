"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Avatar } from "@/components/content/avatar"
import { BuildCard } from "@/components/cards/build-card"
import { PostCard } from "@/components/cards/post-card"
import { useCurrentUser, useBuildsByUser, usePostsByUser, useUpvotedBuilds } from "@/hooks/use-store"
import { cn } from "@/lib/utils"

const tabs = [
  { key: "builds", label: "My Builds" },
  { key: "posts", label: "My Posts" },
  { key: "upvotes", label: "My Upvotes" },
] as const

type TabKey = (typeof tabs)[number]["key"]

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  )
}

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentUser = useCurrentUser()
  const userBuilds = useBuildsByUser(currentUser.id)
  const userPosts = usePostsByUser(currentUser.id)
  const upvotedBuilds = useUpvotedBuilds()
  const totalUpvotes = userBuilds.reduce((sum, b) => sum + b.upvotes, 0)

  const rawTab = searchParams.get("tab")
  const activeTab: TabKey = rawTab === "posts" || rawTab === "upvotes" ? rawTab : "builds"

  const stats = [
    { label: "Builds", value: userBuilds.length },
    { label: "Posts", value: userPosts.length },
    { label: "Upvotes", value: totalUpvotes },
  ]

  const setTab = (key: TabKey) => {
    if (key === "builds") {
      router.push("/profile", { scroll: false })
    } else {
      router.push(`/profile?tab=${key}`, { scroll: false })
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
      {/* Disclaimer banner */}
      <div className="flex items-center gap-3 px-5 py-3.5 mb-5 rounded-xl bg-primary/[0.07] border border-primary/15">
        <span className="material-symbols-outlined text-[18px] text-primary/70 shrink-0">info</span>
        <p className="text-[13px] text-on-surface/60 leading-[1.5] font-medium">
          计划接入 Workspace 的统一个人页，此处仅为示意，最终以 Workspace 侧的个人页为准。
        </p>
      </div>

      {/* ===== Profile Hero ===== */}

      {/* Mobile: centered layout */}
      <div className="flex flex-col items-center text-center md:hidden">
        <Avatar
          src={currentUser.avatar}
          name={currentUser.name}
          size="2xl"
          className="w-20 h-20"
        />
        <h1 className="mt-3 text-xl font-headline font-semibold tracking-tight text-on-surface">
          {currentUser.name}({currentUser.realName})
        </h1>
        <p className="text-[12px] text-secondary/70 mt-0.5">
          {currentUser.department} · {currentUser.role}
        </p>
        {currentUser.bio && (
          <p className="text-[13px] text-on-surface/50 mt-2 max-w-xs">
            {currentUser.bio}
          </p>
        )}

        {/* Stats row mobile */}
        <div className="flex items-center gap-6 mt-5">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-body font-bold text-on-surface">
                {stat.value}
              </p>
              <p className="text-[10px] text-secondary/50 uppercase tracking-wider font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile action buttons */}
        <div className="flex items-center gap-2.5 mt-4">
          <button className="rounded-full px-4 py-1.5 text-[12px] font-medium text-on-surface/60 bg-surface-container-low hover:bg-surface-container transition-colors">
            Edit Profile
          </button>
          <button className="rounded-full px-4 py-1.5 text-[12px] font-medium text-on-surface/60 bg-surface-container-low hover:bg-surface-container transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Desktop: horizontal layout */}
      <div className="hidden md:flex items-start gap-7">
        <Avatar
          src={currentUser.avatar}
          name={currentUser.name}
          size="2xl"
          className="w-28 h-28 shrink-0"
        />
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-headline font-semibold tracking-tight text-on-surface">
                {currentUser.name}({currentUser.realName})
              </h1>
              <p className="text-[12px] text-secondary/70 mt-0.5">
                {currentUser.department} · {currentUser.role}
              </p>
              {currentUser.bio && (
                <p className="text-[13px] text-on-surface/50 mt-2">
                  {currentUser.bio}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full px-4 py-1.5 text-[12px] font-medium text-on-surface/60 bg-surface-container-low hover:bg-surface-container transition-colors">
                Share
              </button>
              <button className="rounded-full px-4 py-1.5 text-[12px] font-medium text-primary bg-primary/[0.06] hover:bg-primary/[0.1] transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats row desktop */}
          <div className="flex items-center gap-8 mt-5">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <span className="text-xl font-body font-bold text-on-surface">
                  {stat.value}
                </span>
                <span className="text-[12px] text-secondary/50 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="flex items-center border-b border-outline-variant/8 mt-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setTab(tab.key)}
            className={cn(
              "px-5 py-3 text-[14px] font-headline font-semibold transition-colors relative",
              activeTab === tab.key
                ? "text-primary"
                : "text-on-surface/35 hover:text-on-surface/60"
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ===== Content ===== */}
      <div className="mt-8">
        {activeTab === "builds" && (
          <div>
            {userBuilds.length === 0 ? (
              <EmptyState icon="inventory_2" text="No builds yet. Create your first one!" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {userBuilds.map((build) => (
                  <BuildCard
                    key={build.id}
                    build={build}
                    badge={build.author.id !== currentUser.id ? "Collaborator" : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div>
            {userPosts.length === 0 ? (
              <EmptyState icon="edit_note" text="No posts yet. Share what you've built!" />
            ) : (
              <div className="space-y-4 max-w-2xl">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "upvotes" && (
          <div>
            {upvotedBuilds.length === 0 ? (
              <EmptyState icon="arrow_upward" text="No upvoted builds yet. Explore the gallery!" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {upvotedBuilds.map((build) => (
                  <BuildCard key={build.id} build={build} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <span className="material-symbols-outlined text-[40px] text-primary/15 mb-3">{icon}</span>
      <p className="text-[14px] text-secondary/50">{text}</p>
    </div>
  )
}
