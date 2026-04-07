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
    name: "Smart Resume Screener",
    description:
      "Automated high-fidelity screening tool for matching candidates based on actual experience rather than just keywords.",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/resume-screener/800/450",
    screenshots: [
      "https://picsum.photos/seed/resume-dash/1200/675",
      "https://picsum.photos/seed/resume-results/1200/675",
    ],
    problem:
      "HR team built a resume screener that cut initial screening by 70%. It uses semantic analysis to rank candidates based on actual experience rather than just keywords. We used a combination of custom LLM prompts and an internal database for skill matching that has significantly improved our throughput for technical roles.",
    solution:
      "We built a pipeline that ingests resumes, extracts structured data using Claude, then scores candidates against job requirements using embedding similarity. The system handles 500+ resumes per day with 92% accuracy compared to human reviewers.",
    pitch:
      "Unlike keyword-based ATS systems, our screener understands context. A candidate who 'led a team of 5 engineers to ship a real-time data pipeline' scores high for both leadership and data engineering roles.",
    good:
      "Upload your job description and a batch of resumes. The system returns a ranked list within minutes. Works best with technical roles where experience nuance matters.",
    techStack: ["Claude API", "Python", "FastAPI", "PostgreSQL", "React"],
    author: users[8],
    collaborators: [users[0], users[3]],
    upvotes: 214,
    weeklyUpvotes: 45,
    downloads: 89,
    visibility: "PUBLIC",
    demoUrl: "https://resume-screener.internal.co",
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-03-28T14:30:00Z",
    comments: [],
  },
  {
    id: "b2",
    name: "Code Review Bot",
    description:
      "AI-driven automated code analysis and suggestions for faster, more consistent reviews.",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/code-review/800/450",
    screenshots: [
      "https://picsum.photos/seed/code-pr-review/1200/675",
      "https://picsum.photos/seed/code-diff-view/1200/675",
    ],
    problem:
      "Made a Code Review Bot that catches style guide violations and automates the boring parts of PR audits. It has saved the team approximately 12 hours of manual review time per week by focusing on formatting and obvious logic errors.",
    solution:
      "The bot integrates with GitHub webhooks, analyzes diffs using Claude with our style guide as context, and posts inline comments. It learns from reviewer feedback to reduce false positives over time.",
    pitch:
      "Your senior engineers shouldn't waste time catching missing semicolons. Let the bot handle the mundane so humans can focus on architecture and logic.",
    good:
      "Install the GitHub App, add a .codereview.yml config to your repo, and the bot starts reviewing PRs automatically. Supports Python, TypeScript, Go, and Java.",
    techStack: ["Claude API", "TypeScript", "GitHub API", "Redis", "Docker"],
    author: users[0],
    collaborators: [users[1]],
    upvotes: 156,
    weeklyUpvotes: 22,
    downloads: 67,
    visibility: "PUBLIC",
    demoUrl: "https://github.com/internal/code-review-bot",
    createdAt: "2026-03-10T09:00:00Z",
    updatedAt: "2026-03-25T16:00:00Z",
    comments: [],
  },
  {
    id: "b3",
    name: "Meeting Notes Summarizer",
    description:
      "Professional stakeholder report automation tool that transforms meeting recordings into structured summaries.",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/meeting-notes/800/450",
    screenshots: ["https://picsum.photos/seed/meeting-summary/1200/675"],
    problem:
      "Product team spends 3+ hours per week writing meeting summaries. Action items get lost, decisions aren't documented, and stakeholders complain about lack of visibility.",
    solution:
      "Records meetings via Zoom API, transcribes with Whisper, then uses Claude to extract decisions, action items, and key discussion points. Outputs are formatted and pushed to Notion automatically.",
    techStack: ["Claude API", "Whisper", "Zoom API", "Notion API", "Python"],
    author: users[7],
    collaborators: [users[2]],
    upvotes: 203,
    weeklyUpvotes: 38,
    downloads: 112,
    visibility: "PUBLIC",
    createdAt: "2026-02-20T11:00:00Z",
    updatedAt: "2026-03-18T09:00:00Z",
    comments: [],
  },
  {
    id: "b4",
    name: "Data Quality Checker",
    description:
      "Automated anomaly detection in pipeline data with intelligent alerting and root cause analysis.",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/data-quality/800/450",
    screenshots: ["https://picsum.photos/seed/data-pipeline-check/1200/675"],
    problem:
      "Data pipelines fail silently. By the time someone notices bad data, it's already in dashboards and reports. Manual monitoring doesn't scale across 200+ tables.",
    solution:
      "Automated profiling of every data table on a schedule. Uses statistical methods for numeric drift and LLM analysis for semantic anomalies. Alerts go to Slack with context and suggested fixes.",
    techStack: ["Python", "dbt", "Great Expectations", "Claude API", "Slack API"],
    author: users[1],
    collaborators: [],
    upvotes: 147,
    weeklyUpvotes: 18,
    downloads: 53,
    visibility: "PUBLIC",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-20T12:00:00Z",
    comments: [],
  },
  {
    id: "b5",
    name: "Ad Copy Generator",
    description:
      "Rapid creative generation for multiple platforms with brand voice consistency.",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/ad-copy/800/450",
    screenshots: ["https://picsum.photos/seed/ad-creative-gen/1200/675"],
    problem:
      "Marketing needs to produce 50+ ad variants per campaign across platforms. Manual copywriting takes 2 weeks per campaign. Brand voice consistency is hard to maintain.",
    solution:
      "Feed in brand guidelines, target audience, and campaign brief. The system generates platform-specific copy (Xiaohongshu, Douyin, WeChat) with A/B test variants. Human review takes minutes instead of days.",
    techStack: ["Claude API", "Next.js", "Tailwind CSS"],
    author: users[6],
    collaborators: [users[3]],
    upvotes: 98,
    weeklyUpvotes: 12,
    downloads: 41,
    visibility: "PUBLIC",
    createdAt: "2026-03-05T14:00:00Z",
    updatedAt: "2026-03-22T10:00:00Z",
    comments: [],
  },
  {
    id: "b6",
    name: "Weekly Report Generator",
    description:
      "Professional stakeholder report automation tool that summarizes weekly activities into concise reports.",
    category: "SKILL",
    coverImage: "https://picsum.photos/seed/weekly-report/800/450",
    screenshots: ["https://picsum.photos/seed/weekly-report-auto/1200/675"],
    problem:
      "Every team lead spends Friday afternoons writing weekly reports. Most of the information already exists in Jira, GitHub, and Slack — it just needs to be compiled.",
    solution:
      "Aggregates activity from Jira tickets, GitHub PRs, and Slack channels. Uses Claude to synthesize into a professional stakeholder report with highlights, risks, and next-week priorities.",
    techStack: ["Python", "Jira API", "GitHub API", "Slack API", "Claude API"],
    author: users[2],
    collaborators: [users[7]],
    upvotes: 76,
    weeklyUpvotes: 8,
    downloads: 34,
    visibility: "PUBLIC",
    createdAt: "2026-02-28T10:00:00Z",
    updatedAt: "2026-03-15T16:00:00Z",
    comments: [],
  },
  {
    id: "b7",
    name: "Customer FAQ Auto-responder",
    description:
      "Intelligent support bot with direct CRM integration for instant, accurate customer responses.",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/faq-bot/800/450",
    screenshots: ["https://picsum.photos/seed/faq-chatbot/1200/675"],
    problem:
      "Customer support team handles 500+ tickets daily. 60% are repetitive questions already answered in docs. Response time averages 4 hours.",
    solution:
      "RAG-based bot that indexes our help center, product docs, and past ticket resolutions. Auto-responds to clear-cut questions and drafts responses for ambiguous ones. Escalates complex issues to humans.",
    techStack: ["Claude API", "Pinecone", "Node.js", "Zendesk API"],
    author: users[7],
    collaborators: [users[0]],
    upvotes: 189,
    weeklyUpvotes: 31,
    downloads: 78,
    visibility: "PUBLIC",
    createdAt: "2026-03-08T09:00:00Z",
    updatedAt: "2026-03-26T11:00:00Z",
    comments: [],
  },
  {
    id: "b8",
    name: "Competitive Intel Dashboard",
    description:
      "Visualizing market trends and competitor moves with automated data collection.",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/competitive-intel/800/450",
    screenshots: ["https://picsum.photos/seed/competitive-dashboard/1200/675"],
    problem:
      "Product and strategy teams need competitive intelligence but rely on ad-hoc Google searches and stale reports. No systematic way to track competitor feature launches, pricing changes, or hiring patterns.",
    solution:
      "Automated scraping of competitor websites, app stores, job boards, and news feeds. Claude summarizes changes weekly and flags significant moves. Dashboard shows trends over time.",
    techStack: ["Python", "Scrapy", "Claude API", "Metabase", "PostgreSQL"],
    author: users[3],
    collaborators: [users[6]],
    upvotes: 72,
    weeklyUpvotes: 6,
    downloads: 28,
    visibility: "DEPARTMENT",
    department: "战略",
    createdAt: "2026-03-12T13:00:00Z",
    updatedAt: "2026-03-30T09:00:00Z",
    comments: [],
  },
  {
    id: "b9",
    name: "Design System Tokenizer",
    description:
      "Automated design token extraction and cross-platform synchronization tool.",
    category: "DEMO",
    coverImage: "https://picsum.photos/seed/design-tokenizer/800/450",
    screenshots: ["https://picsum.photos/seed/design-tokens-ui/1200/675"],
    problem:
      "Finally finished the new design system tokenizer for our mobile apps. This should help keep all colors and spacing consistent across platforms with almost zero overhead for developers.",
    solution:
      "Reads Figma files via API, extracts all design tokens (colors, spacing, typography), and generates platform-specific output: CSS variables for web, Swift extensions for iOS, Kotlin objects for Android.",
    techStack: ["TypeScript", "Figma API", "Style Dictionary", "GitHub Actions"],
    author: users[4],
    collaborators: [users[0]],
    upvotes: 134,
    weeklyUpvotes: 15,
    downloads: 56,
    visibility: "PUBLIC",
    createdAt: "2026-03-18T15:00:00Z",
    updatedAt: "2026-04-01T10:00:00Z",
    comments: [],
  },
  {
    id: "b10",
    name: "The Org Snowball",
    description:
      "一眼看清硅谷头部公司过去两年人才流入流出情况的可视化工具。",
    category: "DEMO",
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
    category: "DEMO",
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
        "The representativeness of AI/ML for this industry is a collaborative effort. Looking forward to seeing how to roll this architecture out across all internal administrative institutes next quarter.",
      isSponsor: true,
      sponsorAmount: 15000,
      likes: 12,
      replies: [
        {
          id: "c1r1",
          author: users[0],
          content: "完全同意，下个季度可以先从战略部开始试点。",
          isSponsor: false,
          likes: 3,
          createdAt: "2026-03-16T09:30:00Z",
        },
      ],
      createdAt: "2026-03-16T08:00:00Z",
    },
    {
      id: "c2",
      author: users[0],
      content: "Awesome work on the semantic engine.",
      isSponsor: false,
      likes: 5,
      replies: [
        {
          id: "c2r1",
          author: users[8],
          content: "Thanks! The embedding model took a few iterations to get right.",
          isSponsor: false,
          likes: 2,
          createdAt: "2026-03-16T10:00:00Z",
        },
      ],
      createdAt: "2026-03-16T09:00:00Z",
    },
  ],
  p2: [
    {
      id: "c3",
      author: users[7],
      content: "Does it support TypeScript decorators?",
      isSponsor: false,
      likes: 3,
      replies: [
        {
          id: "c3r1",
          author: users[0],
          content: "Not yet, but it's on the roadmap. PRs welcome!",
          isSponsor: false,
          likes: 1,
          createdAt: "2026-03-11T11:00:00Z",
        },
      ],
      createdAt: "2026-03-11T10:00:00Z",
    },
  ],
  p3: [
    {
      id: "c4",
      author: users[2],
      content:
        "Incredible efficiency gains here. We're looking at how to roll this architecture out across all internal administrative institutes next quarter.",
      isSponsor: false,
      likes: 8,
      createdAt: "2026-03-19T11:00:00Z",
    },
    {
      id: "c5",
      author: users[1],
      content: "Perfect for Q3 hiring surge.",
      isSponsor: false,
      likes: 2,
      createdAt: "2026-03-19T12:00:00Z",
    },
  ],
  p4: [
    {
      id: "c6",
      author: users[4],
      content:
        "This is exactly what the design team needs. Can we get an API endpoint for real-time token sync?",
      isSponsor: false,
      likes: 4,
      replies: [
        {
          id: "c6r1",
          author: users[7],
          content: "我们正在做这个，预计下周上线 webhook 通知。",
          isSponsor: false,
          likes: 3,
          createdAt: "2026-03-19T15:00:00Z",
        },
      ],
      createdAt: "2026-03-19T14:00:00Z",
    },
  ],
  p5: [
    {
      id: "c7",
      author: users[5],
      content:
        "Great initiative. This kind of tool multiplies the impact of every engineer on the team. I'm sponsoring this for org-wide adoption.",
      isSponsor: true,
      sponsorAmount: 8000,
      likes: 15,
      createdAt: "2026-03-26T09:00:00Z",
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
      author: users[10],
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
      "HR team built a resume screener that cut initial screening by 70%. We used a combination of custom LLM prompts and an internal database for skill matching that has significantly improved our throughput for technical roles.",
    linkedBuild: builds[0],
    likes: 24,
    comments: comments.p1,
    visibility: "PUBLIC",
    createdAt: "2026-03-15T10:30:00Z",
  },
  {
    id: "p2",
    author: users[0],
    content:
      "Made a Code Review Bot that catches style guide violations and automates the boring parts of PR audits. It has saved the team approximately 12 hours of manual review time per week by focusing on formatting and obvious logic errors.",
    linkedBuild: builds[1],
    likes: 43,
    comments: comments.p2,
    visibility: "PUBLIC",
    createdAt: "2026-03-10T09:30:00Z",
  },
  {
    id: "p3",
    author: users[7],
    content:
      "Finally finished the new design system tokenizer for our mobile apps. This should help keep all colors and spacing consistent across platforms with almost zero overhead for developers.",
    linkedBuild: builds[8],
    likes: 18,
    comments: comments.p3,
    visibility: "PUBLIC",
    createdAt: "2026-03-18T15:30:00Z",
  },
  {
    id: "p4",
    author: users[4],
    content:
      "Sharing our approach to automated design token extraction. The tool reads Figma files directly and generates platform-specific code. No more manual translation between design and development!",
    images: ["https://picsum.photos/seed/figma-tokens/800/450"],
    likes: 31,
    comments: comments.p4,
    visibility: "PUBLIC",
    createdAt: "2026-03-19T11:00:00Z",
  },
  {
    id: "p5",
    author: users[1],
    content:
      "Data Quality Checker just caught a silent schema drift in our payment pipeline that would have broken 3 downstream dashboards. Automated monitoring pays for itself. If you're not checking your data quality automatically, you're flying blind.",
    linkedBuild: builds[3],
    likes: 56,
    comments: comments.p5,
    visibility: "PUBLIC",
    createdAt: "2026-03-25T08:00:00Z",
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
  { user: users[6], weeklyUpvotes: 89, builds: 2 },
  { user: users[7], weeklyUpvotes: 67, builds: 3 },
  { user: users[0], weeklyUpvotes: 52, builds: 3 },
  { user: users[8], weeklyUpvotes: 45, builds: 2 },
  { user: users[1], weeklyUpvotes: 22, builds: 2 },
]

// ===== Editor's Picks =====
export const editorsPicks = [
  {
    id: "ep1",
    title: "商业化精选",
    description: "直接驱动业务增长和商业变现的优秀作品",
    emoji: "💰",
    builds: [builds[9], builds[10], builds[4]], // Org Snowball, 人群理解, Ad Copy Generator
  },
  {
    id: "ep2",
    title: "社区精选",
    description: "被最多同事使用和好评的效率工具",
    emoji: "⭐",
    builds: [builds[0], builds[1], builds[6]], // Resume Screener, Code Review Bot, FAQ Auto-responder
  },
  {
    id: "ep3",
    title: "新人必看",
    description: "入职第一周就该知道的效率神器",
    emoji: "🚀",
    builds: [builds[2], builds[5], builds[7]], // Meeting Notes, Weekly Report, Competitive Intel
  },
  {
    id: "ep4",
    title: "数据驱动",
    description: "用数据说话，让决策更科学",
    emoji: "📊",
    builds: [builds[3], builds[7], builds[10]], // Data Quality, Competitive Intel, 人群理解
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
    targetName: "Code Review Bot",
    isRead: false,
    createdAt: "2026-04-06T08:15:00Z",
  },
  {
    id: "n3",
    type: "comment",
    actor: users[5],
    targetType: "post",
    targetName: "Made a Code Review Bot that catches style guide violations...",
    contentPreview: "这个思路太棒了！我们财务部正好需要类似的方案，能不能做个财务版本？",
    isRead: false,
    createdAt: "2026-04-06T07:00:00Z",
  },
  {
    id: "n4",
    type: "like",
    actor: users[1],
    targetType: "post",
    targetName: "Made a Code Review Bot that catches style guide violations...",
    isRead: false,
    createdAt: "2026-04-05T22:00:00Z",
  },
  {
    id: "n5",
    type: "reply",
    actor: users[7],
    targetType: "comment",
    contentPreview: "同意你的观点，prompt engineering 确实被低估了，很多人只关注模型能力",
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
    contentPreview: "@恒宇(高震宇) 上次 demo 的那个工具叫什么来着？我想给我们组也用起来",
    isRead: true,
    createdAt: "2026-04-05T11:00:00Z",
  },
  {
    id: "n8",
    type: "upvote",
    actor: users[8],
    targetType: "build",
    targetName: "Code Review Bot",
    isRead: true,
    createdAt: "2026-04-05T09:00:00Z",
  },
  {
    id: "n9",
    type: "sponsor",
    actor: users[5],
    targetType: "post",
    targetName: "Made a Code Review Bot that catches style guide violations...",
    contentPreview: "Sponsored 15,000 tokens",
    isRead: true,
    createdAt: "2026-04-04T18:00:00Z",
  },
  {
    id: "n10",
    type: "like",
    actor: users[2],
    targetType: "post",
    targetName: "Made a Code Review Bot that catches style guide violations...",
    isRead: true,
    createdAt: "2026-04-04T15:00:00Z",
  },
  {
    id: "n11",
    type: "comment",
    actor: users[6],
    targetType: "build",
    targetName: "Code Review Bot",
    contentPreview: "试用了一下，代码审查效果很不错，有考虑加多语言支持吗？",
    isRead: true,
    createdAt: "2026-04-04T10:00:00Z",
  },
  {
    id: "n12",
    type: "reply",
    actor: users[1],
    targetType: "comment",
    contentPreview: "哈哈确实，我也踩过同样的坑，后来用了 structured output 才解决",
    isRead: true,
    createdAt: "2026-04-03T16:00:00Z",
  },
  {
    id: "n13",
    type: "mention",
    actor: users[8],
    targetType: "post",
    contentPreview: "推荐 @恒宇(高震宇) 做的 Code Review Bot，已经帮我们团队省了大量时间",
    isRead: true,
    createdAt: "2026-04-03T11:00:00Z",
  },
  {
    id: "n14",
    type: "upvote",
    actor: users[3],
    targetType: "build",
    targetName: "Code Review Bot",
    isRead: true,
    createdAt: "2026-04-02T09:00:00Z",
  },
  {
    id: "n15",
    type: "like",
    actor: users[4],
    targetType: "post",
    targetName: "Made a Code Review Bot that catches style guide violations...",
    isRead: true,
    createdAt: "2026-04-01T14:00:00Z",
  },
]
