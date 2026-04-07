/**
 * Transforms the current mock.ts embedded data into normalized store state.
 * This runs once at store initialization.
 */

import {
  users as rawUsers,
  builds as rawBuilds,
  posts as rawPosts,
  editorsPicks as rawEditorsPicks,
  notifications as rawNotifications,
} from "@/data/mock"
import type { Comment } from "@/types"
import type { NUser, NBuild, NPost, NComment, NEditorsPick, NNotification, StoreState } from "./types"

// ── Normalize Users ────────────────────────────────────────

function normalizeUsers(): Record<string, NUser> {
  const map: Record<string, NUser> = {}
  for (const u of rawUsers) {
    map[u.id] = { ...u }
  }
  return map
}

// ── Normalize Builds ───────────────────────────────────────

function normalizeBuildsAndComments(): {
  builds: Record<string, NBuild>
  comments: Record<string, NComment>
} {
  const buildsMap: Record<string, NBuild> = {}
  const commentsMap: Record<string, NComment> = {}

  for (const b of rawBuilds) {
    const topLevelIds = (b.comments || []).map((c) => c.id)
    buildsMap[b.id] = {
      id: b.id,
      name: b.name,
      description: b.description,
      category: b.category,
      coverImage: b.coverImage,
      iconImage: b.iconImage,
      screenshots: b.screenshots,
      problem: b.problem,
      solution: b.solution,
      pitch: b.pitch,
      good: b.good,
      techStack: b.techStack,
      authorId: b.author.id,
      collaboratorIds: b.collaborators.map((c) => c.id),
      upvotes: b.upvotes,
      weeklyUpvotes: b.weeklyUpvotes,
      downloads: b.downloads,
      visibility: b.visibility,
      department: b.department,
      links: b.links,
      topicIds: b.topicIds,
      attachments: b.attachments,
      version: b.version,
      commentIds: topLevelIds,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }

    if (b.comments && b.comments.length > 0) {
      const flat = flattenComments(b.comments, { buildId: b.id })
      for (const nc of flat) {
        commentsMap[nc.id] = nc
      }
    }
  }

  return { builds: buildsMap, comments: commentsMap }
}

// ── Flatten & Normalize Comments ───────────────────────────

function flattenComments(
  rawComments: Comment[],
  ref: { postId?: string; buildId?: string },
  parentId?: string
): NComment[] {
  const flat: NComment[] = []
  for (const c of rawComments) {
    const replyIds = (c.replies ?? []).map((r) => r.id)
    flat.push({
      id: c.id,
      postId: ref.postId,
      buildId: ref.buildId,
      authorId: c.author.id,
      content: c.content,
      isSponsor: c.isSponsor,
      sponsorAmount: c.sponsorAmount,
      likes: c.likes,
      replyToUserId: c.replyTo?.id,
      parentId,
      replyIds,
      createdAt: c.createdAt,
    })
    if (c.replies && c.replies.length > 0) {
      flat.push(...flattenComments(c.replies, ref, c.id))
    }
  }
  return flat
}

// ── Normalize Posts + Comments ──────────────────────────────

function normalizePostsAndComments(): {
  posts: Record<string, NPost>
  comments: Record<string, NComment>
} {
  const postsMap: Record<string, NPost> = {}
  const commentsMap: Record<string, NComment> = {}

  for (const p of rawPosts) {
    const topLevelIds = p.comments.map((c) => c.id)
    postsMap[p.id] = {
      id: p.id,
      authorId: p.author.id,
      content: p.content,
      images: p.images,
      linkedBuildId: p.linkedBuild?.id,
      likes: p.likes,
      commentIds: topLevelIds,
      visibility: p.visibility,
      department: p.department,
      topicIds: p.topicIds,
      createdAt: p.createdAt,
    }

    const flat = flattenComments(p.comments, { postId: p.id })
    for (const nc of flat) {
      commentsMap[nc.id] = nc
    }
  }

  return { posts: postsMap, comments: commentsMap }
}

// ── Normalize Editor's Picks ───────────────────────────────

function normalizeEditorsPicks(): NEditorsPick[] {
  return rawEditorsPicks.map((ep) => ({
    id: ep.id,
    title: ep.title,
    description: ep.description,
    emoji: ep.emoji,
    buildIds: ep.builds.map((b) => b.id),
  }))
}

// ── Normalize Notifications ───────────────────────────────

function normalizeNotifications(): NNotification[] {
  return rawNotifications.map((n) => ({
    id: n.id,
    type: n.type,
    actorId: n.actor.id,
    targetType: n.targetType,
    targetId: n.targetId,
    targetName: n.targetName,
    contentPreview: n.contentPreview,
    isRead: n.isRead,
    createdAt: n.createdAt,
  }))
}

// ── Build Initial State ────────────────────────────────────

export function createInitialState(): StoreState {
  const { builds, comments: buildComments } = normalizeBuildsAndComments()
  const { posts, comments: postComments } = normalizePostsAndComments()

  return {
    users: normalizeUsers(),
    builds,
    posts,
    comments: { ...buildComments, ...postComments },
    currentUserId: rawUsers[0].id,
    followedUserIds: rawUsers.filter((u) => u.department === "战略" && u.id !== rawUsers[0].id).map((u) => u.id),
    notifications: normalizeNotifications(),
    editorsPicks: normalizeEditorsPicks(),
    likedPostIds: [],
    likedCommentIds: [],
    upvotedBuildIds: ["b1", "b4", "b8", "b10"],
  }
}
