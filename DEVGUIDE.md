# Builder Community — 研发交接文档

> 本项目为 Builder Community（作品社区）的前端原型，基于 **Next.js App Router + Zustand + Tailwind CSS** 构建。当前为**纯前端 Mock 状态**，所有数据存储在客户端 Zustand Store 中，需对接后端 API。

---

## 一、项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── (main)/             # 带侧边栏布局的路由组
│   │   ├── page.tsx              # / 作品集首页
│   │   ├── feed/page.tsx         # /feed 讨论广场
│   │   ├── notifications/page.tsx # /notifications 提醒
│   │   ├── profile/page.tsx      # /profile 个人主页
│   │   ├── users/[id]/page.tsx   # /users/:id 用户主页
│   │   ├── builds/new/page.tsx   # /builds/new 上传作品
│   │   ├── builds/[id]/page.tsx  # /builds/:id 作品详情
│   │   └── builds/[id]/edit/     # /builds/:id/edit 修改作品
│   ├── layout.tsx          # 根布局（字体、全局样式）
│   └── globals.css         # Tailwind + 自定义 CSS 变量
├── components/             # UI 组件（按功能分目录）
├── hooks/                  # 自定义 Hooks
│   └── use-store.ts        # 反规范化层，将 Store 的 ID 引用还原为嵌套对象
├── store/                  # Zustand 状态管理
│   ├── types.ts            # 规范化类型定义 (NUser, NBuild, NPost, ...)
│   ├── seed.ts             # Mock 数据 → 规范化初始状态
│   └── index.ts            # Store 创建 + Actions
├── data/                   # Mock 数据 & 常量
│   ├── mock.ts             # 全量 Mock 数据（用户、作品、帖子、评论、通知等）
│   └── constants.ts        # 导航项配置
├── types/                  # TypeScript 类型（视图模型，供组件 props 使用）
│   └── index.ts
└── lib/
    └── utils.ts            # 工具函数 (cn 等)
```

---

## 二、页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 作品集（首页） | 最热作品、专题精选、全部作品（搜索/筛选/分页） |
| `/builds/[id]` | 作品详情 | 介绍、图片画廊、评论、相关帖子、侧边栏（顶/作者/链接/版本） |
| `/builds/[id]/edit` | 修改作品 | 与上传页结构一致，预填已有数据 |
| `/builds/new` | 上传作品 | 仅桌面端，表单结构见第五节 |
| `/feed` | 讨论广场 | 帖子列表（最新/最热）、发帖、评论、右侧排行榜 |
| `/notifications` | 提醒 | 全部 / 评论和@ / 点赞和顶 |
| `/profile` | 个人主页 | 当前登录用户 |
| `/users/[id]` | 用户主页 | 其他用户 |

---

## 三、布局架构

### 3.1 AppShell 总体结构

```
AppShell (components/layout/app-shell.tsx)
├── DesktopSidebar (左侧 w-64，桌面端)
│   ├── Logo
│   ├── 导航：作品集 / 讨论广场 / 提醒
│   └── 底部：上传作品按钮
└── 内容区 (flex-1)
    ├── MobileHeader (移动端顶栏)
    ├── <main className="relative">
    │   ├── DesktopTopbar (absolute 右上角，提醒+头像)
    │   └── {children} (页面内容)
    └── MobileNav (移动端底部导航)
```

### 3.2 DesktopTopbar 隐藏规则

以下页面**隐藏** DesktopTopbar（因为有自己的顶栏）：

| 页面 | 原因 |
|------|------|
| `/feed` | 讨论广场右侧边栏自带提醒+头像 |
| `/builds/new` | 上传页有独立顶栏（返回+保存状态） |
| `/builds/[id]/edit` | 修改页有独立顶栏（返回+保存状态） |

其他所有页面均显示 DesktopTopbar（absolute 定位在 `<main>` 内右上角，不占据内容流空间）。

---

## 四、组件目录

### 4.1 layout/ — 布局层

| 文件 | 说明 |
|------|------|
| `app-shell.tsx` | 全局壳：左侧导航 + 主内容区 |
| `desktop-sidebar.tsx` | 桌面端左侧导航栏 |
| `desktop-topbar.tsx` | 桌面端右上角提醒+头像（absolute 定位） |
| `mobile-header.tsx` | 移动端顶栏（logo + 搜索 + 提醒） |
| `mobile-nav.tsx` | 移动端底部导航 |
| `page-container.tsx` | 通用页面容器（max-w-6xl 居中） |
| `identity-switcher.tsx` | （预留）身份切换组件 |

### 4.2 gallery/ — 作品集

| 文件 | 说明 |
|------|------|
| `gallery-content.tsx` | 首页核心组件（最热作品 + 专题精选 + 全部作品 + 部门筛选） |
| `search-bar.tsx` | 独立搜索组件（未直接使用，逻辑内联在 gallery-content） |
| `filter-pills.tsx` | 独立筛选标签（未直接使用） |
| `department-filter.tsx` | 独立部门筛选（未直接使用，逻辑内联在 gallery-content） |

### 4.3 build-detail/ — 作品详情

| 文件 | 说明 |
|------|------|
| `sticky-sidebar.tsx` | 右侧粘性侧边栏（顶按钮 / 发布者 / 合作者 / 链接 / 详细信息） |
| `content-section.tsx` | 通用内容段落（标题+正文） |
| `comment-item.tsx` | 评论项组件 |
| `tech-stack-list.tsx` | 关键词标签列表 |

### 4.4 build-form/ — 作品表单（上传 & 修改共用）

| 文件 | 说明 |
|------|------|
| `form-input.tsx` | 通用文本输入 |
| `form-textarea.tsx` | 富文本 Markdown 输入（加粗/斜体/列表） |
| `media-upload.tsx` | 图片上传（封面图/图标/更多图片） |
| `visibility-selector.tsx` | 可见范围选择（全公司/仅部门） |
| `build-preview.tsx` | （预留）作品预览组件 |

### 4.5 feed/ — 讨论广场

| 文件 | 说明 |
|------|------|
| `feed-content.tsx` | 帖子列表主组件（最新/最热排序） |
| `feed-tabs.tsx` | 最新/最热 Tab 切换 |
| `post-composer.tsx` | 发帖输入框（文字/图片/挂载作品/@提及/权限） |
| `mobile-fab.tsx` | 移动端发帖浮动按钮 |
| `comment-preview.tsx` | 评论预览组件 |
| `feed-filter-tags.tsx` | （未使用，筛选已移除） |

### 4.6 cards/ — 卡片组件

| 文件 | 说明 |
|------|------|
| `build-card.tsx` | 作品卡片（封面+标题+描述+作者+顶数）— 首页网格 |
| `build-bar.tsx` | 作品条形卡片（带顶按钮）— 帖子挂载的作品 |
| `post-card.tsx` | 帖子卡片 — 讨论广场 |

### 4.7 interactions/ — 交互组件

| 文件 | 说明 |
|------|------|
| `comment-input.tsx` | 评论输入框（支持 @提及下拉、回复） |
| `upvote-button.tsx` | 顶按钮 |
| `upvote-icon.tsx` | 顶图标（SVG） |
| `like-button.tsx` | 赞按钮 |
| `comment-button.tsx` | 评论按钮 |
| `share-button.tsx` | 分享按钮 |

### 4.8 content/ — 公共内容组件

| 文件 | 说明 |
|------|------|
| `avatar.tsx` | 头像组件（xs/sm/md/lg/xl 尺寸） |
| `user-hover-card.tsx` | 用户悬浮卡片（当前为占位，待对接 Hi 统一浮窗） |
| `image-lightbox.tsx` | 图片灯箱（全屏查看、左右切换） |
| `image-crop.tsx` | （预留）图片裁剪组件 |
| `tech-tag.tsx` | 标签组件 |
| `user-badge.tsx` | 用户徽章 |

### 4.9 notifications/ — 提醒

| 文件 | 说明 |
|------|------|
| `notification-content.tsx` | 提醒页主组件（Tab 切换 + 列表） |
| `notification-tabs.tsx` | 全部 / 评论和@ / 点赞和顶 |
| `notification-item.tsx` | 单条提醒（类型标记 + 内容预览 + 时间） |

### 4.10 sidebar/ — 侧边栏内容块

| 文件 | 说明 | 使用位置 |
|------|------|---------|
| `trending-list.tsx` | 本周最热作品（前5） | 讨论广场右侧 |
| `top-builders.tsx` | 本周最热 Builder（前5） | 讨论广场右侧 |
| `event-carousel.tsx` | （未使用）活动轮播 | — |
| `hackathon-card.tsx` | （未使用）黑客松卡片 | — |
| `search-box.tsx` | （未使用）搜索框 | — |

---

## 五、核心业务逻辑

### 5.1 最热作品排序

```
位置：gallery-content.tsx
逻辑：
  近一周 → 按 weeklyUpvotes 降序，取前 10
  近一月 → 按 monthlyUpvotes 降序，取前 10
  不限作品发布时间，只看对应周期内的顶数
```

### 5.2 全部作品

```
排序：最新（createdAt 降序）/ 最多顶（upvotes 降序）
搜索：薯名或作品名，薯名有 sug 下拉（最多 5 条）
      薯名搜索同时匹配发布者和合作者
      搜索结果分"TA 发布的作品"和"TA 参与的作品"
部门筛选：一级部门→二级部门级联（当前为占位数据，需接入真实组织架构）
分页：每页 20（默认）/ 50 / 100，页码显示 [1 2 3 … N]
```

### 5.3 讨论广场 Feed

```
Tab 排序：
  最新 → createdAt 降序
  最热 → 7天内帖子按 likes 降序优先，超过7天的排在后面

评论外显：
  默认 1 条一级评论 + 1 条二级评论
  一级评论排序：likes 降序，likes 相同时 createdAt 升序（更早的在前）
  二级评论排序：createdAt 升序（最早的在前）

帖子折叠：默认 3 行，超出显示"展开"/"收起"
```

### 5.4 发帖功能

```
文字：最多 300 字
图片：最多 10 张（URL.createObjectURL 本地预览）
挂载作品：仅可挂载"我为发布者或合作者"的作品
@提及：输入 @ 触发用户下拉（最多 6 条），支持键盘导航
权限：全公司 / 仅部门
权限联动：挂载仅部门可见的作品时，帖子权限自动锁定为"仅部门"，不可手动改为全公司
```

### 5.5 本周最热 Builder 排行

```
位置：hooks/use-store.ts → useTopBuilders()
逻辑：
  遍历所有作品，对每个作品的发布者和合作者（去重）都计入 weeklyUpvotes
  按用户总 weeklyUpvotes 降序，取前 5
  显示的"作品数"= 该用户作为发布者或合作者的作品总数
```

### 5.6 上传/修改作品表单

```
作品名称 *          最多 40 字
─── 作品简介 ───
  一句话介绍 *      最多 80 字
  项目介绍 *        Markdown，最多 2000 字
  关键词            最多 10 个
─── 作品展示 ───
  作品链接 *        至少 1 个，最多 10 个
  图片/视频 *       封面图必传，最多 10 个
─── 其他设置 ───
  合作者            最多 10 个
  作品版本          默认 1.0
  可见范围 *        全公司 / 仅部门
```

### 5.7 提醒过滤

```
全部      → 所有类型
评论和@   → type: comment / reply / mention
点赞和顶  → type: upvote / like
```

通知类型：`upvote` | `like` | `comment` | `reply` | `mention` | `collaborator`

---

## 六、数据模型

### 6.1 类型体系

项目使用**双层类型**：

- **视图模型** (`types/index.ts`)：嵌套对象结构，供组件 props 直接使用
- **规范化模型** (`store/types.ts`)：扁平 ID 引用结构，Store 内部使用

`hooks/use-store.ts` 负责将规范化数据还原为视图模型。

### 6.2 核心实体

```
NUser
├── id, name(薯名), realName(真名), avatar
├── department(一级部门), subDepartment(二级部门)
├── role(岗位), level(L1/L2/IC), bio(简介)

NBuild
├── id, name(作品名), description(一句话介绍)
├── pitch(项目介绍), problem/solution(旧字段，保留向后兼容)
├── coverImage, iconImage, screenshots
├── techStack(关键词), links(作品链接)
├── authorId, collaboratorIds
├── upvotes(总顶数), weeklyUpvotes(周顶数), monthlyUpvotes(月顶数)
├── version, visibility, commentIds
├── createdAt, updatedAt

NPost
├── id, authorId, content(最多300字)
├── images(图片), linkedBuildId(挂载作品)
├── likes(赞数), commentIds
├── visibility, createdAt

NComment
├── id, authorId, content
├── postId / buildId (归属帖子或作品)
├── parentId (null=一级评论), replyIds(子评论)
├── replyToUserId, likes, createdAt

NNotification
├── id, type, actorId
├── targetType(post/build/comment), targetId, targetName
├── contentPreview, isRead, createdAt
```

### 6.3 Store State

```
Zustand Store
├── users: Record<id, NUser>
├── builds: Record<id, NBuild>
├── posts: Record<id, NPost>
├── comments: Record<id, NComment>
├── notifications: NNotification[]
├── editorsPicks: NEditorsPick[]
├── currentUserId: string
├── likedPostIds: string[]
├── upvotedBuildIds: string[]
└── likedCommentIds: string[]
```

### 6.4 Store Actions

| Action | 说明 |
|--------|------|
| `createBuild(data)` | 创建作品，返回新 ID |
| `updateBuild(id, patch)` | 更新作品 |
| `toggleUpvote(buildId)` | 顶/取消顶 |
| `createPost(data)` | 发帖（含 images、linkedBuildId、visibility） |
| `deletePost(id)` | 删除帖子 |
| `togglePostLike(id)` | 赞/取消赞帖子 |
| `addComment(postId, content)` | 添加一级评论 |
| `addReply(commentId, content)` | 添加二级评论 |
| `deleteComment(id)` | 删除评论 |
| `toggleCommentLike(id)` | 赞/取消赞评论 |
| `markNotificationRead(id)` | 标记已读 |
| `markAllNotificationsRead()` | 全部已读 |
| `setCurrentUserId(id)` | 切换当前用户 |

### 6.5 反规范化 Hooks

| Hook | 返回 | 说明 |
|------|------|------|
| `useCurrentUser()` | `User` | 当前登录用户 |
| `useUsers()` | `User[]` | 全部用户 |
| `useBuilds()` | `Build[]` | 全部作品（含嵌套 author/collaborators/comments） |
| `useBuild(id)` | `Build \| null` | 单个作品 |
| `useBuildsByUser(id)` | `Build[]` | 某用户作为发布者或合作者的作品 |
| `usePosts()` | `Post[]` | 全部帖子 |
| `useTrendingBuilds(n)` | `Build[]` | 按 weeklyUpvotes 排序的前 n 个作品 |
| `useTopBuilders(n)` | `{user, weeklyUpvotes, builds}[]` | 本周最热 Builder（含合作者） |
| `useEditorsPicks()` | 专题精选 | 含反规范化的作品 |
| `useNotifications()` | `Notification[]` | 全部通知 |
| `useUnreadNotificationCount()` | `number` | 未读通知数 |

---

## 七、待对接后端 API 清单

### 7.1 用户

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/users/me` | GET | 获取当前用户信息 |
| `/api/users/:id` | GET | 获取指定用户信息 |
| `/api/users/search?q=` | GET | 搜索用户（薯名/真名） |

### 7.2 作品

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/builds` | GET | 列表（搜索、部门筛选、排序、分页） |
| `/api/builds/trending?period=week\|month` | GET | 最热作品（按 weeklyUpvotes / monthlyUpvotes 排序，前 10） |
| `/api/builds/picks` | GET | 专题精选（无配置时返回空，前端隐藏该模块） |
| `/api/builds/:id` | GET | 详情 |
| `/api/builds` | POST | 创建 |
| `/api/builds/:id` | PUT | 更新 |
| `/api/builds/:id/upvote` | POST | 顶/取消顶 |

### 7.3 帖子

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/posts` | GET | 列表（最新：createdAt 降序；最热：7天内 likes 降序） |
| `/api/posts` | POST | 发帖（含 content、images、linkedBuildId、visibility） |
| `/api/posts/:id` | DELETE | 删除 |
| `/api/posts/:id/like` | POST | 赞/取消赞 |

### 7.4 评论

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/comments` | POST | 发表评论（需传 postId 或 buildId + content） |
| `/api/comments/:id/reply` | POST | 回复评论 |
| `/api/comments/:id` | DELETE | 删除 |
| `/api/comments/:id/like` | POST | 赞/取消赞 |

### 7.5 提醒

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/notifications` | GET | 列表（支持 type 筛选） |
| `/api/notifications/unread-count` | GET | 未读数 |
| `/api/notifications/:id/read` | PUT | 标记已读 |
| `/api/notifications/read-all` | PUT | 全部已读 |

### 7.6 排行榜

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/rankings/trending-builds?limit=5` | GET | 本周最热作品（按 weeklyUpvotes 降序） |
| `/api/rankings/top-builders?limit=5` | GET | 本周最热 Builder（含合作者的顶数与作品数） |

### 7.7 文件上传

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/upload/image` | POST | 上传图片（封面/图标/截图/帖子图片） |

---

## 八、设计规范

### 8.1 设计 Token（Tailwind 自定义色）

| Token | 用途 |
|-------|------|
| `primary` | 主色调（按钮、高亮、活跃状态） |
| `on-primary` | 主色上的文字 |
| `surface` | 页面背景 |
| `surface-container` | 卡片/容器背景 |
| `surface-container-low` | 次级容器背景 |
| `surface-container-lowest` | 白底输入框/表单区域 |
| `on-surface` | 主要文字颜色 |
| `secondary` | 次要文字 |
| `outline-variant` | 边框/分割线 |

### 8.2 白底输入框统一样式

```css
rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-4
/* focus 状态 */
focus-within:border-primary/30
```

### 8.3 图标

使用 [Material Symbols Outlined](https://fonts.google.com/icons)（可变字重），部分填充图标使用 `material-symbols-fill` class。

### 8.4 字体

- `font-headline`：标题字体（导航、卡片标题、按钮）
- `font-body`：正文字体（描述、输入框）

### 8.5 名字格式

所有地方统一使用 **`薯名(真名)`** 格式，如：`菲雅(叶家雯)`。

---

## 九、待完善 / 注意事项

1. **用户悬浮卡片**：当前为占位文案"与 Hi 统一的个人信息浮窗保持一致"，需对接 Hi 系统
2. **作品详情页**：顶部有提示"作品详情页以 CoWork 的整体作品详情页面为准，此处仅供参考"
3. **部门筛选**：当前为占位数据，需接入真实组织架构
4. **图片上传**：当前为本地预览（`URL.createObjectURL`），需对接 OSS/CDN
5. **搜索**：当前为前端内存过滤，需对接后端搜索接口
6. **关注体系**：已从 UI 和 Hook 中完全移除，Store 中仍保留 `followedUserIds` 字段但无处引用
7. **Build 遗留字段**：`problem`、`solution` 已合并为 `pitch`（项目介绍），旧字段保留向后兼容
8. **移动端**：上传/修改作品仅支持桌面端
9. **专题精选**：无人工配置时应隐藏整个模块
10. **帖子图片上传**：发帖的图片选择功能已实现前端 UI，但实际文件上传需对接后端
11. **未使用组件**：`sidebar/` 下的 `event-carousel`、`hackathon-card`、`search-box` 为预留组件，暂未接入
