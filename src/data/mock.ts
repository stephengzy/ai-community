import type { User, Build, Post, Comment, Notification } from "@/types"

// ===== Users =====
export const users: User[] = [
  {
    id: "u1",
    name: "恒宇",
    realName: "高震宇",
    avatar: "/images/avatars/恒宇.png",
    department: "战略",
    role: "社区战略组",
    level: "IC",
  },
  {
    id: "u2",
    name: "阿瑟",
    realName: "Arthur",
    avatar: "/images/avatars/阿瑟.png",
    department: "战略",
    role: "社区战略组",
    level: "IC",
  },
  {
    id: "u3",
    name: "初一",
    realName: "项姝蕾",
    avatar: "/images/avatars/初一.png",
    department: "战略",
    role: "社区战略组",
    level: "IC",
    bio: "🤔.",
  },
  {
    id: "u4",
    name: "北星",
    realName: "刘佳慧",
    avatar: "/images/avatars/北星.png",
    department: "战略",
    role: "社区战略组",
    level: "IC",
    bio: "活得具体 做自己",
  },
  {
    id: "u5",
    name: "杰特",
    realName: "林圣垚",
    avatar: "/images/avatars/杰特.png",
    department: "战略",
    role: "社区战略组",
    level: "IC",
  },
  {
    id: "u6",
    name: "曼巴",
    realName: "章子琦",
    avatar: "/images/avatars/曼巴.png",
    department: "公司管理",
    role: "财务投资部",
    level: "L2",
    bio: "再活一次",
  },
  {
    id: "u7",
    name: "菲雅",
    realName: "叶家雯",
    avatar: "/images/avatars/菲雅.png",
    department: "投资",
    role: "投资研究",
    level: "IC",
    bio: "Exploration. Exploitation. Expedition.",
  },
  {
    id: "u8",
    name: "星云",
    realName: "王沐晨",
    avatar: "/images/avatars/星云.png",
    department: "产品",
    role: "UG Labs",
    level: "IC",
  },
  {
    id: "u9",
    name: "启山",
    realName: "吴金辰",
    avatar: "/images/avatars/启山.png",
    department: "HR CoE",
    role: "文化与人才发展组",
    level: "IC",
    bio: "壁立千仞，无欲则刚",
  },
  {
    id: "u10",
    name: "文生",
    realName: "伍翔宇",
    avatar: "/images/avatars/文生.png",
    department: "投资",
    role: "投资研究",
    level: "L1",
  },
  {
    id: "u11",
    name: "帕鲁",
    realName: "Ace",
    avatar: "/images/avatars/帕鲁.png",
    department: "产品",
    role: "社区部",
    level: "L1",
  },
]

// Helper to get user by id
export function getUserById(id: string): User {
  return users.find((u) => u.id === id) ?? users[0]
}

// ===== Builds =====
export const builds: Build[] = [
  {
    id: "b1",
    name: "简历智能筛选",
    description:
      "基于语义理解的简历与JD智能匹配工具，初筛效率提升70%，技术岗筛选准确率92%。",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/resume-screener/800/450",
    screenshots: [
      "https://picsum.photos/seed/resume-dash/1200/675",
      "https://picsum.photos/seed/resume-results/1200/675",
    ],
    problem:
      "HR团队每天收到大量简历，传统关键词匹配无法理解候选人的真实经历。比如一个'带领5人团队从0到1搭建实时数据管道'的候选人，关键词匹配根本识别不出他同时具备管理能力和数据工程能力。",
    solution:
      "用Claude对简历做语义解析，提取候选人的核心能力、项目经验和成长轨迹，再与JD做embedding相似度匹配。系统每天处理500+份简历，技术岗筛选准确率达到92%。",
    pitch:
      "不再靠关键词碰运气。一个写着'负责用户增长策略落地'的候选人，系统能理解他既懂增长也懂执行。",
    good:
      "上传JD和一批简历，几分钟内返回排序结果。最适合技术岗和产品岗等经验维度复杂的岗位。",
    techStack: ["Claude API", "Python", "FastAPI", "PostgreSQL"],
    author: users[8],
    collaborators: [users[0]],
    upvotes: 143,
    weeklyUpvotes: 28,
    downloads: 62,
    visibility: "PUBLIC",
    demoUrl: "https://resume-screener.internal.co",
    createdAt: "2026-03-12T10:00:00Z",
    updatedAt: "2026-03-28T14:30:00Z",
    comments: [],
  },
  {
    id: "b2",
    name: "代码审查助手",
    description:
      "自动检查代码风格和常见逻辑问题，每周为团队节省12小时Review时间。",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/code-review/800/450",
    screenshots: [
      "https://picsum.photos/seed/code-pr-review/1200/675",
      "https://picsum.photos/seed/code-diff-view/1200/675",
    ],
    problem:
      "代码Review中大量时间花在格式规范、命名风格、简单逻辑错误上。高级工程师的时间不应该浪费在检查分号和缩进上。",
    solution:
      "接入GitHub Webhook，用Claude结合团队的代码风格指南分析每个PR的diff，自动在行内添加review评论。会根据reviewer的反馈不断学习，减少误报。",
    pitch:
      "让机器处理琐碎的格式问题，让人专注在架构和业务逻辑上。上线一个月，团队Review效率提升40%。",
    good:
      "安装GitHub App，在repo里加一个配置文件就可以自动工作。目前支持Python、TypeScript、Go。",
    techStack: ["Claude API", "TypeScript", "GitHub API", "Redis"],
    author: users[0],
    collaborators: [users[1]],
    upvotes: 128,
    weeklyUpvotes: 19,
    downloads: 55,
    visibility: "PUBLIC",
    demoUrl: "https://github.com/internal/code-review-bot",
    createdAt: "2026-03-05T09:00:00Z",
    updatedAt: "2026-03-25T16:00:00Z",
    comments: [],
  },
  {
    id: "b3",
    name: "笔记灵感生成",
    description:
      "基于站内热点趋势和用户兴趣，AI生成多条笔记创作灵感和文案框架，帮助创作者告别'空白页焦虑'。",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/note-inspire/800/450",
    screenshots: [
      "https://picsum.photos/seed/note-inspire-ui/1200/675",
      "https://picsum.photos/seed/note-inspire-result/1200/675",
    ],
    problem:
      "大量创作者反馈'不知道写什么'是创作的最大障碍。尤其是新创作者，面对空白编辑页不知从何下手，导致创作频率低、留存差。",
    solution:
      "输入感兴趣的话题方向（如'春季穿搭''家居收纳'），系统结合站内近7天的热点笔记、搜索趋势和用户画像，生成5-10条创作灵感，每条包含标题建议、内容框架和配图方向。",
    pitch:
      "让每个创作者都有'选题参谋'。内测期间，使用该功能的创作者周均发布量提升了2.3倍。",
    good:
      "选择你感兴趣的内容方向，AI会结合当前热点为你生成灵感卡片，点击即可直接开始创作。",
    techStack: ["Claude API", "Python", "React", "小红书内容API"],
    author: users[7],
    collaborators: [users[3]],
    upvotes: 185,
    weeklyUpvotes: 42,
    downloads: 78,
    visibility: "PUBLIC",
    createdAt: "2026-03-25T11:00:00Z",
    updatedAt: "2026-04-03T09:00:00Z",
    comments: [],
  },
  {
    id: "b4",
    name: "投研速读",
    description:
      "自动汇总研报、新闻和公告，提取关键观点和信号，让投资团队的信息消化效率提升5倍。",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/invest-digest/800/450",
    screenshots: ["https://picsum.photos/seed/invest-digest-ui/1200/675"],
    problem:
      "投研团队每天需要阅读几十篇研报、新闻和公告，信息量巨大但关键信号隐藏在大量文字中。靠人工阅读，重要信号经常被遗漏或延迟发现。",
    solution:
      "接入多个数据源（研报、新闻、公告），用Claude做摘要提取和信号识别。每天早上自动推送'今日速读'，标注重要程度和关联标的，支持按行业、标的、主题维度筛选。",
    techStack: ["Claude API", "Python", "Scrapy", "飞书API"],
    author: users[1],
    collaborators: [],
    upvotes: 71,
    weeklyUpvotes: 9,
    downloads: 31,
    visibility: "PUBLIC",
    createdAt: "2026-02-28T08:00:00Z",
    updatedAt: "2026-03-20T12:00:00Z",
    comments: [],
  },
  {
    id: "b5",
    name: "评论区智能助手",
    description:
      "帮助创作者高效管理评论互动，AI辅助生成回复、识别高价值评论，粉丝互动率提升60%。",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/comment-assistant/800/450",
    screenshots: ["https://picsum.photos/seed/comment-assist-ui/1200/675"],
    problem:
      "头部创作者每条笔记有几百到几千条评论，根本回复不过来。但粉丝互动率直接影响流量分发和商业化能力，不回复又损失粘性。",
    solution:
      "AI自动识别评论中的提问、好评、负面反馈等类型，优先展示高价值评论。对于常见问题自动生成回复草稿，创作者只需审核确认。支持批量回复和自定义回复风格。",
    pitch:
      "内测的500位创作者中，日均回复量提升3倍，粉丝互动率提升60%，评论区氛围评分提升22%。",
    good:
      "打开评论管理页面，AI自动将评论分类并推荐回复。创作者可以一键采纳或微调后发送。",
    techStack: ["Claude API", "React", "Node.js", "小红书社区API"],
    author: users[7],
    collaborators: [users[0]],
    upvotes: 112,
    weeklyUpvotes: 16,
    downloads: 47,
    visibility: "PUBLIC",
    createdAt: "2026-03-20T14:00:00Z",
    updatedAt: "2026-04-02T10:00:00Z",
    comments: [],
  },
  {
    id: "b6",
    name: "周报自动生成",
    description:
      "汇总飞书日程、项目管理工具和代码仓库的活动记录，自动生成结构化周报。",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/weekly-report/800/450",
    screenshots: ["https://picsum.photos/seed/weekly-report-auto/1200/675"],
    problem:
      "每周五下午大家都在写周报，信息其实早就散落在飞书、Jira和代码仓库里了。手动汇总不仅耗时，还容易遗漏。",
    solution:
      "自动抓取本周的飞书日程、Jira工单状态变更和Git提交记录，用Claude整理成'本周进展 - 风险&问题 - 下周计划'的标准格式。支持自定义模板。",
    techStack: ["Python", "飞书API", "Jira API", "Claude API"],
    author: users[2],
    collaborators: [users[0]],
    upvotes: 83,
    weeklyUpvotes: 11,
    downloads: 39,
    visibility: "PUBLIC",
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-03-15T16:00:00Z",
    comments: [],
  },
  {
    id: "b7",
    name: "搜索意图理解",
    description:
      "用AI理解用户搜索背后的真实意图，优化结果排序，搜索满意度提升18%。",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/search-intent/800/450",
    screenshots: [
      "https://picsum.photos/seed/search-intent-ui/1200/675",
      "https://picsum.photos/seed/search-intent-result/1200/675",
    ],
    problem:
      "用户搜索'平价好用的防晒'时，关键词匹配会返回大量含'防晒'的笔记，但用户真正想要的是'便宜+好用+防晒推荐'。搜索满意度一直是用户体验的短板。",
    solution:
      "用Claude对搜索query做意图解析，识别出用户的核心需求（推荐类、教程类、测评类等），再结合用户画像做个性化重排。A/B实验显示搜索满意度提升18%，搜索后点击率提升12%。",
    pitch:
      "让搜索真正'懂'用户。搜'怎么搭配灰色大衣'不再返回一堆卖灰色大衣的笔记，而是真正的穿搭教程。",
    good:
      "在搜索框输入自然语言query，系统实时展示意图解析结果和优化后的搜索排序。",
    techStack: ["Claude API", "Python", "ElasticSearch", "React"],
    author: users[7],
    collaborators: [users[0], users[3]],
    upvotes: 167,
    weeklyUpvotes: 35,
    downloads: 73,
    visibility: "PUBLIC",
    createdAt: "2026-03-28T09:00:00Z",
    updatedAt: "2026-04-05T11:00:00Z",
    comments: [],
  },
  {
    id: "b8",
    name: "竞品舆情监控",
    description:
      "自动追踪竞品产品动态、用户口碑和行业趋势，每日推送摘要到飞书群。",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/competitive-intel/800/450",
    screenshots: ["https://picsum.photos/seed/competitive-dashboard/1200/675"],
    problem:
      "战略和产品团队需要持续关注竞品动态，但靠手动搜索和截图效率太低。很多重要的竞品功能更新和用户反馈，发现时已经过了最佳应对窗口。",
    solution:
      "自动抓取主要竞品的应用商店更新日志、社交媒体讨论、新闻报道和用户评论。Claude做每日摘要，标注重要程度并推送到飞书群。支持自定义关注的竞品列表和关键词。",
    techStack: ["Python", "Scrapy", "Claude API", "飞书API"],
    author: users[3],
    collaborators: [users[6]],
    upvotes: 58,
    weeklyUpvotes: 7,
    downloads: 24,
    visibility: "DEPARTMENT",
    department: "战略",
    createdAt: "2026-03-08T13:00:00Z",
    updatedAt: "2026-03-30T09:00:00Z",
    comments: [],
  },
  {
    id: "b9",
    name: "会议纪要助手",
    description:
      "接入飞书会议，自动转录并提取决策事项和Action Item，按参会人分发待办。",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/meeting-notes/800/450",
    screenshots: ["https://picsum.photos/seed/meeting-summary/1200/675"],
    problem:
      "每周花在写会议纪要上的时间加起来有3小时+，而且经常遗漏Action Item。最头疼的是跨部门会议，事后谁该做什么说不清楚。",
    solution:
      "对接飞书会议的录音，用Whisper转录后通过Claude提取决策事项、Action Item和关键讨论点，自动按参会人分发待办到飞书任务，同步到Notion会议纪要数据库。",
    techStack: ["Claude API", "Whisper", "飞书API", "Notion API", "Python"],
    author: users[4],
    collaborators: [users[2]],
    upvotes: 96,
    weeklyUpvotes: 14,
    downloads: 44,
    visibility: "PUBLIC",
    createdAt: "2026-03-15T15:00:00Z",
    updatedAt: "2026-04-01T10:00:00Z",
    comments: [],
  },
  {
    id: "b10",
    name: "Talent Flow Map",
    description:
      "一眼看清硅谷头部公司过去两年人才流入流出情况的可视化工具。",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/org-snowball/800/450",
    screenshots: ["https://picsum.photos/seed/talent-flow-viz/1200/675", "https://picsum.photos/seed/sankey-chart/1200/675"],
    problem:
      "投资和战略团队缺乏对硅谷头部科技公司人才流动的系统性观察。依赖零散新闻和LinkedIn手动检索，难以形成全局判断。",
    solution:
      "通过爬取公开人才数据，构建公司级人才净流入/流出的时间序列面板。非常清晰地看出：OpenAI人才净流出最多，Anthropic人才净流入最多且非常稳定。接下来准备做国内公司的版本。",
    pitch:
      "如果早一年有这个工具，我们就能提前发现Anthropic的人才虹吸效应，做出更好的投资判断。",
    good:
      "选择时间范围和公司，即可看到人才流入流出的Sankey图和趋势线。支持按职能筛选（Engineering、Research、Product等）。",
    techStack: ["Python", "Scrapy", "Claude API", "D3.js", "Next.js"],
    author: users[6],
    collaborators: [users[0], users[1]],
    upvotes: 342,
    weeklyUpvotes: 89,
    downloads: 127,
    visibility: "PUBLIC",
    createdAt: "2026-04-02T09:00:00Z",
    updatedAt: "2026-04-04T16:00:00Z",
    comments: [
      {
        id: "bc1",
        author: users[7],
        content:
          "这个工具对增长团队也很有价值，能不能加一个按行业维度筛选的功能？比如只看AI/SaaS公司的人才流动。",
        isSponsor: false,
        likes: 15,
        replies: [
          {
            id: "bc1r1",
            author: users[6],
            replyTo: users[7],
            content: "好建议！行业标签目前在数据里有，下个版本加上筛选器。",
            isSponsor: false,
            likes: 5,
            createdAt: "2026-04-02T11:30:00Z",
          },
        ],
        createdAt: "2026-04-02T10:30:00Z",
      },
      {
        id: "bc2",
        author: users[0],
        content: "Sankey图的交互体验非常流畅，hover时能看到具体的人数变化，这个细节做得很好。",
        isSponsor: false,
        likes: 12,
        replies: [
          {
            id: "bc2r1",
            author: users[6],
            content: "谢谢恒宇！hover的tooltip花了不少时间调，能被注意到很开心。",
            isSponsor: false,
            likes: 3,
            createdAt: "2026-04-02T15:00:00Z",
          },
        ],
        createdAt: "2026-04-02T14:00:00Z",
      },
      {
        id: "bc3",
        author: users[2],
        content: "能不能加个导出PDF的功能？我想直接把图表放进投资报告里。",
        isSponsor: false,
        likes: 9,
        replies: [
          {
            id: "bc3r1",
            author: users[6],
            content: "好建议！已经加到下个迭代的backlog了。",
            isSponsor: false,
            likes: 2,
            createdAt: "2026-04-03T10:00:00Z",
          },
          {
            id: "bc3r2",
            author: users[1],
            replyTo: users[2],
            content: "我也需要这个功能，+1",
            isSponsor: false,
            likes: 4,
            createdAt: "2026-04-03T10:30:00Z",
          },
        ],
        createdAt: "2026-04-03T09:00:00Z",
      },
      {
        id: "bc4",
        author: users[3],
        content: "数据更新频率是多少？能做到实时吗？",
        isSponsor: false,
        likes: 7,
        replies: [
          {
            id: "bc4r1",
            author: users[6],
            content: "目前是每周更新一次，实时的话API成本太高了，但可以做到每日更新。",
            isSponsor: false,
            likes: 5,
            createdAt: "2026-04-03T14:30:00Z",
          },
        ],
        createdAt: "2026-04-03T14:00:00Z",
      },
      {
        id: "bc5",
        author: users[8],
        content: "UI设计很漂亮，配色和动画都很舒服。请问前端是用什么框架做的？",
        isSponsor: false,
        likes: 6,
        createdAt: "2026-04-03T16:00:00Z",
      },
      {
        id: "bc6",
        author: users[4],
        content: "建议加一个alert功能，当某个公司出现异常人才流出时自动通知相关团队。",
        isSponsor: false,
        likes: 14,
        replies: [
          {
            id: "bc6r1",
            author: users[3],
            content: "这个feature request +1，对投资决策非常关键。",
            isSponsor: false,
            likes: 5,
            createdAt: "2026-04-04T10:00:00Z",
          },
          {
            id: "bc6r2",
            author: users[6],
            replyTo: users[4],
            content: "已经在backlog里了，预计下周可以上线。",
            isSponsor: false,
            likes: 3,
            createdAt: "2026-04-04T10:30:00Z",
          },
        ],
        createdAt: "2026-04-04T09:00:00Z",
      },
    ],
  },
  {
    id: "b11",
    name: "人群理解到素材生成",
    description:
      "通过小红书高爆内容分析与人群理解，自动生成投放素材，CPA降低30%，七日留存提升5%。",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/crowd-creative/800/450",
    screenshots: ["https://picsum.photos/seed/crowd-insights/1200/675", "https://picsum.photos/seed/ad-material-gen/1200/675"],
    problem:
      "增长团队的投放素材制作流程依赖人工经验，从人群洞察到素材产出周期长、成本高，且难以规模化。",
    solution:
      "通过小红书站内高爆内容分析、搜索词分析、以及人群理解相关分析和数据，自动生成相关人群的投放素材。和运营实验发现投放CPA降低30%，七日留存提升5%。",
    pitch:
      "不再依赖投放优化师的个人经验，让数据驱动素材生成，实现规模化精准投放。",
    good:
      "输入目标人群标签和投放平台，系统自动分析对标内容并生成多套素材方案，支持A/B测试直接下发。",
    techStack: ["Claude API", "Python", "小红书API", "Stable Diffusion", "React"],
    author: users[7],
    collaborators: [users[0], users[3]],
    upvotes: 289,
    weeklyUpvotes: 67,
    downloads: 95,
    visibility: "PUBLIC",
    createdAt: "2026-04-01T14:00:00Z",
    updatedAt: "2026-04-04T11:00:00Z",
    comments: [],
  },
]

// ===== Comments =====
const comments: Record<string, Comment[]> = {
  p1: [
    {
      id: "c1",
      author: users[5],
      content:
        "这个工具解决了HR效率的核心痛点。我支持在全公司范围推广，Token额度不限。",
      isSponsor: true,
      sponsorAmount: 12000,
      likes: 14,
      replies: [
        {
          id: "c1r1",
          author: users[0],
          content: "同意，可以先从技术岗试点，验证效果后再扩展到其他岗位。",
          isSponsor: false,
          likes: 4,
          createdAt: "2026-03-13T09:30:00Z",
        },
      ],
      createdAt: "2026-03-13T08:00:00Z",
    },
    {
      id: "c2",
      author: users[0],
      content: "语义匹配的准确率不错，有没有考虑加上候选人能力画像的可视化？比如做个雷达图。",
      isSponsor: false,
      likes: 6,
      replies: [
        {
          id: "c2r1",
          author: users[8],
          content: "好主意！下个版本会加上候选人能力雷达图，方便面试官快速了解候选人。",
          isSponsor: false,
          likes: 3,
          createdAt: "2026-03-13T10:30:00Z",
        },
      ],
      createdAt: "2026-03-13T09:00:00Z",
    },
  ],
  p2: [
    {
      id: "c3",
      author: users[7],
      content: "试用了一下，检查效果不错。能不能支持自定义规则？我们团队有些特殊的代码规范。",
      isSponsor: false,
      likes: 5,
      replies: [
        {
          id: "c3r1",
          author: users[0],
          content: "可以的，在配置文件里加custom rules就行。文档在README里，有问题随时问我。",
          isSponsor: false,
          likes: 2,
          createdAt: "2026-03-06T11:00:00Z",
        },
      ],
      createdAt: "2026-03-06T10:00:00Z",
    },
  ],
  p3: [
    {
      id: "c4",
      author: users[2],
      content: "试了一下美妆方向的，生成的灵感和近期热门笔记的方向很接近，感觉能切中用户需求。",
      isSponsor: false,
      likes: 9,
      createdAt: "2026-03-26T11:00:00Z",
    },
    {
      id: "c5",
      author: users[10],
      content: "从社区生态角度看，这个功能对新创作者的留存帮助会很大。建议在创作引导流程里加入这个入口。",
      isSponsor: false,
      likes: 7,
      createdAt: "2026-03-26T14:00:00Z",
    },
  ],
  p4: [
    {
      id: "c6",
      author: users[3],
      content: "太需要了！能不能也支持腾讯会议？有些跨部门的会议不在飞书上。",
      isSponsor: false,
      likes: 6,
      replies: [
        {
          id: "c6r1",
          author: users[4],
          content: "正在对接中，预计下周可以上线腾讯会议的支持。",
          isSponsor: false,
          likes: 3,
          createdAt: "2026-03-16T15:00:00Z",
        },
      ],
      createdAt: "2026-03-16T14:00:00Z",
    },
  ],
  p5: [
    {
      id: "c7",
      author: users[5],
      content:
        "投研效率工具对我们的决策速度提升非常关键。Sponsor这个项目继续迭代，Token不限量。",
      isSponsor: true,
      sponsorAmount: 8000,
      likes: 12,
      createdAt: "2026-03-01T09:00:00Z",
    },
  ],
  p6: [
    {
      id: "c8",
      author: users[5],
      content:
        "我支持这个产品Idea GTM。如果早一年知道这个，我们就可以直接投资Anthropic了。@文生(伍翔宇) 这个项目支持继续开发，Token不限量",
      isSponsor: true,
      sponsorAmount: 10000,
      likes: 28,
      replies: [
        {
          id: "c8r1",
          author: users[9],
          content: "收到",
          isSponsor: false,
          likes: 3,
          createdAt: "2026-04-02T11:00:00Z",
        },
        {
          id: "c8r2",
          author: users[6],
          replyTo: users[5],
          content: "感谢曼巴支持！接下来会加上国内版本的数据。",
          isSponsor: false,
          likes: 5,
          createdAt: "2026-04-02T11:30:00Z",
        },
        {
          id: "c8r3",
          author: users[0],
          replyTo: users[6],
          content: "从投资角度来看，这个工具的价值非常大。我们战略团队也可以直接用。",
          isSponsor: false,
          likes: 4,
          createdAt: "2026-04-02T12:00:00Z",
        },
        {
          id: "c8r4",
          author: users[1],
          replyTo: users[5],
          content: "建议加一个按职能筛选的功能，比如只看Research岗位的流动。",
          isSponsor: false,
          likes: 6,
          createdAt: "2026-04-02T13:00:00Z",
        },
      ],
      createdAt: "2026-04-02T10:30:00Z",
    },
    {
      id: "c10",
      author: users[0],
      content: "数据来源是公开的LinkedIn数据吗？准确度怎么样？",
      isSponsor: false,
      likes: 7,
      replies: [
        {
          id: "c10r1",
          author: users[6],
          content: "主要是LinkedIn + 公开新闻，准确率大约85%左右。对于大公司的核心岗位变动基本都能追踪到。",
          isSponsor: false,
          likes: 4,
          createdAt: "2026-04-02T14:30:00Z",
        },
        {
          id: "c10r2",
          author: users[0],
          replyTo: users[6],
          content: "85%已经不错了，比我们现在手动查的效率高太多。",
          isSponsor: false,
          likes: 2,
          createdAt: "2026-04-02T15:00:00Z",
        },
      ],
      createdAt: "2026-04-02T14:00:00Z",
    },
    {
      id: "c11",
      author: users[2],
      content: "Anthropic人才稳定性这个发现很有意思，能不能做一个月度的变化趋势？",
      isSponsor: false,
      likes: 9,
      replies: [
        {
          id: "c11r1",
          author: users[6],
          content: "好建议，下个版本会加上时间序列的view。",
          isSponsor: false,
          likes: 3,
          createdAt: "2026-04-02T16:00:00Z",
        },
      ],
      createdAt: "2026-04-02T15:30:00Z",
    },
    {
      id: "c12",
      author: users[7],
      content: "这个可视化做得很漂亮，D3.js用得很熟练。Sankey图是手写的还是用的库？",
      isSponsor: false,
      likes: 5,
      replies: [
        {
          id: "c12r1",
          author: users[6],
          content: "Sankey部分用的d3-sankey，但做了大量自定义，特别是交互hover的部分。",
          isSponsor: false,
          likes: 2,
          createdAt: "2026-04-03T09:30:00Z",
        },
        {
          id: "c12r2",
          author: users[4],
          replyTo: users[6],
          content: "能不能开源这个可视化组件？其他项目也可以复用。",
          isSponsor: false,
          likes: 7,
          createdAt: "2026-04-03T10:00:00Z",
        },
        {
          id: "c12r3",
          author: users[6],
          replyTo: users[4],
          content: "可以考虑，先把代码整理一下。",
          isSponsor: false,
          likes: 1,
          createdAt: "2026-04-03T10:30:00Z",
        },
      ],
      createdAt: "2026-04-03T09:00:00Z",
    },
    {
      id: "c13",
      author: users[3],
      content: "国内版本的数据源怎么解决？LinkedIn在国内覆盖率不高。",
      isSponsor: false,
      likes: 11,
      replies: [
        {
          id: "c13r1",
          author: users[6],
          content: "国内打算结合脉脉、Boss直聘和公开新闻做交叉验证。",
          isSponsor: false,
          likes: 8,
          createdAt: "2026-04-03T11:30:00Z",
        },
      ],
      createdAt: "2026-04-03T11:00:00Z",
    },
    {
      id: "c14",
      author: users[8],
      content: "可以给HR团队也开个权限吗？我们在做竞对人才mapping，这个工具太好用了。",
      isSponsor: false,
      likes: 6,
      createdAt: "2026-04-03T14:00:00Z",
    },
    {
      id: "c15",
      author: users[4],
      content: "建议加一个alert功能，当某个公司出现异常的人才流出时自动通知。",
      isSponsor: false,
      likes: 14,
      replies: [
        {
          id: "c15r1",
          author: users[3],
          content: "这个feature request +1，对于投资决策非常关键。",
          isSponsor: false,
          likes: 5,
          createdAt: "2026-04-03T16:00:00Z",
        },
        {
          id: "c15r2",
          author: users[6],
          replyTo: users[4],
          content: "已经在backlog里了，预计下周可以上线。",
          isSponsor: false,
          likes: 3,
          createdAt: "2026-04-03T16:30:00Z",
        },
      ],
      createdAt: "2026-04-03T15:00:00Z",
    },
    {
      id: "c16",
      author: users[10],
      content: "从增长角度看，如果能追踪到人才流向的细分领域，对我们判断市场趋势也很有帮助。",
      isSponsor: false,
      likes: 4,
      createdAt: "2026-04-04T09:00:00Z",
    },
  ],
  p7: [
    {
      id: "c9",
      author: users[5],
      content:
        "无论从拉新效率、还是财务ROI，或是组织敏捷度上来说，都因为这个项目可以提升不少。我Sponsor这个项目继续开发，希望可以看到更多UG相关的成果",
      isSponsor: true,
      sponsorAmount: 20000,
      likes: 22,
      replies: [],
      createdAt: "2026-04-01T15:30:00Z",
    },
    {
      id: "c9r1",
      author: users[9],
      content: "同意曼巴。我也Sponsor这个项目",
      isSponsor: true,
      sponsorAmount: 10000,
      likes: 8,
      createdAt: "2026-04-01T16:00:00Z",
    },
  ],
}

// ===== Posts =====
export const posts: Post[] = [
  {
    id: "p1",
    author: users[8],
    content:
      "HR团队做了一个简历智能筛选工具，初筛效率提升了70%。通过语义分析匹配候选人经历和JD要求，不再只看关键词匹配。技术岗位的筛选准确率达到了92%，终于不用每天花半天时间翻简历了。",
    linkedBuild: builds[0],
    likes: 24,
    comments: comments.p1,
    visibility: "PUBLIC",
    createdAt: "2026-03-13T10:30:00Z",
  },
  {
    id: "p2",
    author: users[0],
    content:
      "做了一个代码审查助手，自动检查代码风格违规和常见逻辑问题。上线一个月，团队每周省下大约12小时的Review时间，大家终于可以把精力放在架构和业务逻辑上了。",
    linkedBuild: builds[1],
    likes: 43,
    comments: comments.p2,
    visibility: "PUBLIC",
    createdAt: "2026-03-06T09:30:00Z",
  },
  {
    id: "p3",
    author: users[7],
    content:
      "分享一下笔记灵感生成的Demo效果🎉 用户输入感兴趣的话题方向，AI会结合站内热点趋势，生成多条笔记创作灵感和文案框架。内测创作者反馈：'终于不用对着空白页发呆了'。目前正在扩大内测范围，欢迎大家试用反馈。",
    linkedBuild: builds[2],
    images: ["https://picsum.photos/seed/laptop-workspace/800/450", "https://picsum.photos/seed/code-editor-dark/800/450"],
    likes: 38,
    comments: comments.p3,
    visibility: "PUBLIC",
    createdAt: "2026-03-26T10:30:00Z",
  },
  {
    id: "p4",
    author: users[4],
    content:
      "会议纪要助手上线了！接入飞书会议后，自动转录并提取决策事项和Action Item，还能按参会人自动分发待办。再也不用边开会边记笔记了。上线一周已经帮战略组处理了15场会议。",
    linkedBuild: builds[8],
    images: ["https://picsum.photos/seed/meeting-notes-demo/800/450"],
    likes: 26,
    comments: comments.p4,
    visibility: "PUBLIC",
    createdAt: "2026-03-16T11:00:00Z",
  },
  {
    id: "p5",
    author: users[1],
    content:
      "投研速读工具上线第一周就帮投资团队发现了一个重要信号：某赛道连续三周出现负面舆情集中的趋势。如果靠人工翻阅几十篇研报，可能月底才能察觉。自动化信息处理真的太重要了。",
    linkedBuild: builds[3],
    likes: 35,
    comments: comments.p5,
    visibility: "PUBLIC",
    createdAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "p6",
    author: users[6],
    content:
      "非常清晰地一眼看出过去2年硅谷头部公司人才流入流出的情况：OpenAI人才净流出最多，Anthropic人才净流入最多，且人才非常稳定，很少有流出。接下来准备继续尝试做一下国内公司的情况。",
    linkedBuild: builds[9],
    likes: 87,
    comments: comments.p6,
    visibility: "PUBLIC",
    createdAt: "2026-04-02T09:30:00Z",
  },
  {
    id: "p7",
    author: users[7],
    content:
      "通过小红书站内的高爆内容分析、搜索词分析、以及人群理解相关分析和数据，自动生成相关人群的投放素材。和运营实验发现投放CPA降低30%，七日留存提升5%。",
    linkedBuild: builds[10],
    likes: 64,
    comments: comments.p7,
    visibility: "PUBLIC",
    createdAt: "2026-04-01T14:30:00Z",
  },
]

// ===== Trending Builds (sorted by weekly upvotes) =====
export const trendingBuilds = builds
  .slice()
  .sort((a, b) => b.weeklyUpvotes - a.weeklyUpvotes)
  .slice(0, 5)

// ===== Top Builders (sorted by weekly upvotes received) =====
export const topBuilders = [
  { user: users[7], weeklyUpvotes: 160, builds: 4 },
  { user: users[6], weeklyUpvotes: 89, builds: 1 },
  { user: users[8], weeklyUpvotes: 28, builds: 1 },
  { user: users[0], weeklyUpvotes: 19, builds: 1 },
  { user: users[4], weeklyUpvotes: 14, builds: 1 },
]

// ===== Editor's Picks =====
export const editorsPicks = [
  {
    id: "ep1",
    title: "商业化精选",
    description: "直接驱动业务增长和商业变现的优秀作品",
    emoji: "💰",
    builds: [builds[9], builds[10], builds[4]], // Org Snowball, 人群理解, 评论区智能助手
  },
  {
    id: "ep2",
    title: "产品创新",
    description: "探索小红书产品新可能的功能Demo",
    emoji: "⭐",
    builds: [builds[2], builds[6], builds[4]], // 笔记灵感, 搜索意图, 评论区智能助手
  },
  {
    id: "ep3",
    title: "新人必看",
    description: "入职第一周就该知道的效率神器",
    emoji: "🚀",
    builds: [builds[5], builds[8], builds[1]], // 周报自动生成, 会议纪要, 代码审查
  },
  {
    id: "ep4",
    title: "数据驱动",
    description: "用数据说话，让决策更科学",
    emoji: "📊",
    builds: [builds[3], builds[7], builds[10]], // 投研速读, 竞品舆情, 人群理解
  },
]

// ===== Navigation Items =====
export const desktopNavItems = [
  { label: "Posts", href: "/", icon: "home" },
  { label: "Builds Gallery", href: "/gallery", icon: "grid_view" },
  { label: "Notifications", href: "/notifications", icon: "notifications" },
]

export const desktopNavMeItems = [
  { label: "My Builds", href: "/profile", icon: "construction" },
  { label: "My Upvotes", href: "/profile", icon: "arrow_upward" },
]

export const mobileNavItems = [
  { label: "Posts", href: "/", icon: "home" },
  { label: "Gallery", href: "/gallery", icon: "grid_view" },
  { label: "Profile", href: "/profile", icon: "person" },
]

// ===== Category Labels =====
export const categoryLabels: Record<string, string> = {
  SKILL: "Skill",
  WORKFLOW: "Workflow",
  DATA_PRODUCT: "Data Product",
  TOOL: "Tool",
  OTHER: "Other",
}

// ===== Current User (logged in) =====
export const currentUser = users[0]

// ===== Notifications =====
export const notifications: Notification[] = [
  // ── Unread ──────────────────────────────────────────────
  {
    id: "n1",
    type: "mention",
    actor: users[2],
    targetType: "post",
    contentPreview: "@恒宇(高震宇) 你之前提到的那个自动化方案能展开聊聊吗？感觉对我们部门也很有启发",
    isRead: false,
    createdAt: "2026-04-06T09:30:00Z",
  },
  {
    id: "n2",
    type: "upvote",
    actor: users[6],
    targetType: "build",
    targetName: "代码审查助手",
    isRead: false,
    createdAt: "2026-04-06T08:15:00Z",
  },
  {
    id: "n3",
    type: "comment",
    actor: users[5],
    targetType: "post",
    targetName: "做了一个代码审查助手，自动检查代码风格违规...",
    contentPreview: "这个思路太棒了！我们财务部正好需要类似的方案，能不能做个财务版本？",
    isRead: false,
    createdAt: "2026-04-06T07:00:00Z",
  },
  {
    id: "n4",
    type: "like",
    actor: users[1],
    targetType: "post",
    targetName: "做了一个代码审查助手，自动检查代码风格违规...",
    isRead: false,
    createdAt: "2026-04-05T22:00:00Z",
  },
  {
    id: "n5",
    type: "reply",
    actor: users[7],
    targetType: "comment",
    contentPreview: "同意你的观点，prompt engineering确实被低估了，很多人只关注模型能力",
    isRead: false,
    createdAt: "2026-04-05T20:30:00Z",
  },
  // ── Read ────────────────────────────────────────────────
  {
    id: "n6",
    type: "collaborator",
    actor: users[7],
    targetType: "build",
    targetName: "人群理解到素材生成",
    isRead: true,
    createdAt: "2026-04-05T14:00:00Z",
  },
  {
    id: "n7",
    type: "mention",
    actor: users[3],
    targetType: "comment",
    contentPreview: "@恒宇(高震宇) 上次demo的那个工具叫什么来着？我想给我们组也用起来",
    isRead: true,
    createdAt: "2026-04-05T11:00:00Z",
  },
  {
    id: "n8",
    type: "upvote",
    actor: users[8],
    targetType: "build",
    targetName: "代码审查助手",
    isRead: true,
    createdAt: "2026-04-05T09:00:00Z",
  },
  {
    id: "n9",
    type: "sponsor",
    actor: users[5],
    targetType: "post",
    targetName: "做了一个代码审查助手，自动检查代码风格违规...",
    contentPreview: "Sponsored 15,000 tokens",
    isRead: true,
    createdAt: "2026-04-04T18:00:00Z",
  },
  {
    id: "n10",
    type: "like",
    actor: users[2],
    targetType: "post",
    targetName: "做了一个代码审查助手，自动检查代码风格违规...",
    isRead: true,
    createdAt: "2026-04-04T15:00:00Z",
  },
  {
    id: "n11",
    type: "comment",
    actor: users[6],
    targetType: "build",
    targetName: "代码审查助手",
    contentPreview: "试用了一下，代码审查效果很不错，有考虑加多语言支持吗？",
    isRead: true,
    createdAt: "2026-04-04T10:00:00Z",
  },
  {
    id: "n12",
    type: "reply",
    actor: users[1],
    targetType: "comment",
    contentPreview: "哈哈确实，我也踩过同样的坑，后来用了structured output才解决",
    isRead: true,
    createdAt: "2026-04-03T16:00:00Z",
  },
  {
    id: "n13",
    type: "mention",
    actor: users[8],
    targetType: "post",
    contentPreview: "推荐 @恒宇(高震宇) 做的代码审查助手，已经帮我们团队省了大量时间",
    isRead: true,
    createdAt: "2026-04-03T11:00:00Z",
  },
  {
    id: "n14",
    type: "upvote",
    actor: users[3],
    targetType: "build",
    targetName: "代码审查助手",
    isRead: true,
    createdAt: "2026-04-02T09:00:00Z",
  },
  {
    id: "n15",
    type: "like",
    actor: users[4],
    targetType: "post",
    targetName: "做了一个代码审查助手，自动检查代码风格违规...",
    isRead: true,
    createdAt: "2026-04-01T14:00:00Z",
  },
]
