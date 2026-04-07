"use client"

import { use, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Avatar } from "@/components/content/avatar"
import { BuildCard } from "@/components/cards/build-card"
import { PostCard } from "@/components/cards/post-card"
import { useUser, useCurrentUser, useBuildsByUser, usePostsByUser } from "@/hooks/use-store"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const tabs = [
  { key: "builds", label: "Builds" },
  { key: "posts", label: "Posts" },
] as const

type TabKey = (typeof tabs)[number]["key"]

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return (
    <Suspense>
      <UserProfileContent userId={id} />
    </Suspense>
  )
}

function UserProfileContent({ userId }: { userId: string }) {
  const searchParams = useSearchParams()
  const user = useUser(userId)
  const currentUser = useCurrentUser()
  const userBuilds = useBuildsByUser(userId)
  const userPosts = usePostsByUser(userId)
  const following = useStore((s) => s.followedUserIds.includes(userId))
  const toggleFollow = useStore((s) => s.toggleFollow)
  const totalUpvotes = userBuilds.reduce((sum, b) => sum + b.upvotes, 0)

  const isSelf = userId === currentUser.id

  const rawTab = searchParams.get("tab")
  const activeTab: TabKey = rawTab === "posts" ? rawTab : "builds"

  const stats = [
    { label: "Builds", value: userBuilds.length },
    { label: "Posts", value: userPosts.length },
    { label: "Upvotes", value: totalUpvotes },
  ]

  if (!user || user.name === "Unknown") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="material-symbols-outlined text-[48px] text-primary/15 mb-3">person_off</span>
        <p className="text-[14px] text-secondary/50">User not found</p>
        <Link href="/" className="text-[13px] text-primary mt-3 hover:underline">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
      {/* ===== Profile Hero ===== */}

      {/* Mobile: centered layout */}
      <div className="flex flex-col items-center text-center md:hidden">
        <Avatar
          src={user.avatar}
          name={user.name}
          size="2xl"
          className="w-20 h-20"
        />
        <h1 className="mt-3 text-xl font-headline font-semibold tracking-tight text-on-surface">
          {user.name}({user.realName})
        </h1>
        <p className="text-[12px] text-secondary/70 mt-0.5">
          {user.department} · {user.role}
        </p>
        {user.bio && (
          <p className="text-[13px] text-on-surface/50 mt-2 max-w-xs">
            {user.bio}
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
          {isSelf ? (
            <Link
              href="/profile"
              className="rounded-full px-4 py-1.5 text-[12px] font-medium text-primary bg-primary/[0.06] hover:bg-primary/[0.1] transition-colors"
            >
              Edit Profile
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => toggleFollow(userId)}
              className={cn(
                "rounded-full px-5 py-1.5 text-[12px] font-semibold transition-all",
                following
                  ? "bg-surface-container text-secondary border border-outline-variant/12 hover:bg-surface-container-low"
                  : "bg-primary text-on-primary hover:opacity-90"
              )}
            >
              {following ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Desktop: horizontal layout */}
      <div className="hidden md:flex items-start gap-7">
        <Avatar
          src={user.avatar}
          name={user.name}
          size="2xl"
          className="w-28 h-28 shrink-0"
        />
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-headline font-semibold tracking-tight text-on-surface">
                {user.name}({user.realName})
              </h1>
              <p className="text-[12px] text-secondary/70 mt-0.5">
                {user.department} · {user.role}
              </p>
              {user.bio && (
                <p className="text-[13px] text-on-surface/50 mt-2">
                  {user.bio}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isSelf ? (
                <Link
                  href="/profile"
                  className="rounded-full px-4 py-1.5 text-[12px] font-medium text-primary bg-primary/[0.06] hover:bg-primary/[0.1] transition-colors"
                >
                  Edit Profile
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleFollow(userId)}
                  className={cn(
                    "rounded-full px-5 py-1.5 text-[12px] font-semibold transition-all",
                    following
                      ? "bg-surface-container text-secondary border border-outline-variant/12 hover:bg-surface-container-low"
                      : "bg-primary text-on-primary hover:opacity-90"
                  )}
                >
                  {following ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* Stats row desktop */}
          <div className="flex items-center gap-8 mt-5">
            {stats.map((stat) => (
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
          <Link
            key={tab.key}
            href={tab.key === "builds" ? `/users/${userId}` : `/users/${userId}?tab=${tab.key}`}
            scroll={false}
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
          </Link>
        ))}
      </div>

      {/* ===== Content ===== */}
      <div className="mt-8">
        {activeTab === "builds" && (
          <div>
            {userBuilds.length === 0 ? (
              <EmptyState icon="inventory_2" text="No builds yet" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {userBuilds.map((build) => (
                  <BuildCard key={build.id} build={build} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div>
            {userPosts.length === 0 ? (
              <EmptyState icon="edit_note" text="No posts yet" />
            ) : (
              <div className="space-y-4 max-w-2xl">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
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
