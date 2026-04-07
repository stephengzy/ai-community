import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { Store, NComment } from "./types"
import { createInitialState } from "./seed"

let nextId = 1000
function genId(prefix: string) {
  return `${prefix}${++nextId}`
}

export const useStore = create<Store>()(
  immer((set, get) => ({
    ...createInitialState(),

    // ── Users ────────────────────────────────────────────

    updateUser: (userId, patch) =>
      set((s) => {
        const user = s.users[userId]
        if (user) Object.assign(user, patch)
      }),

    toggleFollow: (userId) =>
      set((s) => {
        const idx = s.followedUserIds.indexOf(userId)
        if (idx >= 0) {
          s.followedUserIds.splice(idx, 1)
        } else {
          s.followedUserIds.push(userId)
        }
      }),

    // ── Builds ───────────────────────────────────────────

    createBuild: (data) => {
      const id = genId("b")
      const now = new Date().toISOString()
      set((s) => {
        s.builds[id] = {
          ...data,
          id,
          version: "1.0",
          upvotes: 0,
          weeklyUpvotes: 0,
          downloads: 0,
          createdAt: now,
          updatedAt: now,
        }
      })
      return id
    },

    updateBuild: (buildId, patch) =>
      set((s) => {
        const build = s.builds[buildId]
        if (build) {
          Object.assign(build, patch)
          build.updatedAt = new Date().toISOString()
        }
      }),

    toggleUpvote: (buildId) =>
      set((s) => {
        const build = s.builds[buildId]
        if (!build) return
        const idx = s.upvotedBuildIds.indexOf(buildId)
        if (idx >= 0) {
          s.upvotedBuildIds.splice(idx, 1)
          build.upvotes = Math.max(0, build.upvotes - 1)
        } else {
          s.upvotedBuildIds.push(buildId)
          build.upvotes += 1
        }
      }),

    // ── Posts ────────────────────────────────────────────

    createPost: (data) => {
      const id = genId("p")
      set((s) => {
        s.posts[id] = {
          id,
          authorId: s.currentUserId,
          content: data.content,
          images: data.images,
          linkedBuildId: data.linkedBuildId,
          likes: 0,
          commentIds: [],
          visibility: data.visibility,
          topicIds: data.topicIds,
          createdAt: new Date().toISOString(),
        }
      })
      return id
    },

    updatePost: (postId, patch) =>
      set((s) => {
        const post = s.posts[postId]
        if (post) Object.assign(post, patch)
      }),

    deletePost: (postId) =>
      set((s) => {
        const post = s.posts[postId]
        if (!post) return
        // Remove all comments associated with this post
        const toRemove = Object.values(s.comments).filter((c) => c.postId === postId)
        for (const c of toRemove) {
          delete s.comments[c.id]
        }
        delete s.posts[postId]
      }),

    togglePostLike: (postId) =>
      set((s) => {
        const post = s.posts[postId]
        if (!post) return
        const idx = s.likedPostIds.indexOf(postId)
        if (idx >= 0) {
          s.likedPostIds.splice(idx, 1)
          post.likes = Math.max(0, post.likes - 1)
        } else {
          s.likedPostIds.push(postId)
          post.likes += 1
        }
      }),

    // ── Comments ─────────────────────────────────────────

    addComment: (postId, content) => {
      const id = genId("c")
      set((s) => {
        const post = s.posts[postId]
        if (!post) return
        const comment: NComment = {
          id,
          postId,
          authorId: s.currentUserId,
          content,
          isSponsor: false,
          likes: 0,
          replyIds: [],
          createdAt: new Date().toISOString(),
        }
        s.comments[id] = comment
        post.commentIds.push(id)
      })
      return id
    },

    addReply: (parentCommentId, content) => {
      const id = genId("c")
      set((s) => {
        const parent = s.comments[parentCommentId]
        if (!parent) return
        const reply: NComment = {
          id,
          postId: parent.postId,
          authorId: s.currentUserId,
          content,
          isSponsor: false,
          likes: 0,
          replyToUserId: parent.authorId,
          parentId: parentCommentId,
          replyIds: [],
          createdAt: new Date().toISOString(),
        }
        s.comments[id] = reply
        parent.replyIds.push(id)
      })
      return id
    },

    deleteComment: (commentId) =>
      set((s) => {
        const comment = s.comments[commentId]
        if (!comment) return

        // Recursively collect all descendant IDs
        const toDelete: string[] = []
        const collect = (cid: string) => {
          toDelete.push(cid)
          const c = s.comments[cid]
          if (c) c.replyIds.forEach(collect)
        }
        collect(commentId)

        // Remove from parent's replyIds or post's commentIds
        if (comment.parentId) {
          const parent = s.comments[comment.parentId]
          if (parent) {
            parent.replyIds = parent.replyIds.filter((id) => id !== commentId)
          }
        } else {
          if (comment.postId) {
            const post = s.posts[comment.postId]
            if (post) {
              post.commentIds = post.commentIds.filter((id: string) => id !== commentId)
            }
          }
          if (comment.buildId) {
            const build = s.builds[comment.buildId]
            if (build) {
              build.commentIds = build.commentIds.filter((id: string) => id !== commentId)
            }
          }
        }

        for (const cid of toDelete) {
          delete s.comments[cid]
        }
      }),

    toggleCommentLike: (commentId) =>
      set((s) => {
        const comment = s.comments[commentId]
        if (!comment) return
        const idx = s.likedCommentIds.indexOf(commentId)
        if (idx >= 0) {
          s.likedCommentIds.splice(idx, 1)
          comment.likes = Math.max(0, comment.likes - 1)
        } else {
          s.likedCommentIds.push(commentId)
          comment.likes += 1
        }
      }),

    addSponsorComment: (postId, content, amount) => {
      const id = genId("c")
      set((s) => {
        const post = s.posts[postId]
        if (!post) return
        const comment: NComment = {
          id,
          postId,
          authorId: s.currentUserId,
          content,
          isSponsor: true,
          sponsorAmount: amount,
          likes: 0,
          replyIds: [],
          createdAt: new Date().toISOString(),
        }
        s.comments[id] = comment
        post.commentIds.push(id)
      })
      return id
    },

    // ── Notifications ────────────────────────────────────

    markNotificationRead: (notificationId) =>
      set((s) => {
        const n = s.notifications.find((x) => x.id === notificationId)
        if (n) n.isRead = true
      }),

    markAllNotificationsRead: () =>
      set((s) => {
        for (const n of s.notifications) {
          n.isRead = true
        }
      }),

    // ── Editor's Picks ───────────────────────────────────

    updateEditorsPicks: (picks) =>
      set((s) => {
        s.editorsPicks = picks
      }),
  }))
)
