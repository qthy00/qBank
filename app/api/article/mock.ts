/**
 * 资讯/文章 Mock 数据
 */
import type {ArticleVO, ArticleDetailVO, ArticleCategoryVO, ArticleListRespVO} from '~/types/article'

/* 资讯分类 */
export const mockCategories: ArticleCategoryVO[] = [
  { id: 1, name: '考试动态', count: 12 },
  { id: 2, name: '新手必读', count: 8 },
  { id: 3, name: '考试问答', count: 15 },
  { id: 4, name: '报考指南', count: 6 },
]

/* 资讯列表数据 */
export const mockArticleList: ArticleVO[] = [
  {
    id: 1,
    title: '2025年建筑行业最新政策解读与发展趋势分析',
    summary: '本文详细解读了2025年建筑行业最新政策变化，分析了行业发展趋势和机遇，为备考一级建造师的同学提供重要参考。',
    coverImage: 'https://picsum.photos/400/300?random=1',
    author: '学次元编辑部',
    source: '住建部官网',
    viewCount: 2456,
    publishTime: '2025-04-24 10:30:00',
    categoryId: 1,
    categoryName: '考试动态',
    tags: ['政策解读', '行业动态'],
    isTop: true,
    isHot: true,
  },
  {
    id: 2,
    title: '一级建造师考试报名时间及流程详解',
    summary: '2025年一级建造师考试报名即将开始，本文详细介绍报名时间、报名流程、资格审核等注意事项。',
    coverImage: 'https://picsum.photos/400/300?random=2',
    author: '张老师',
    source: '学次元',
    viewCount: 1892,
    publishTime: '2025-04-23 14:20:00',
    categoryId: 4,
    categoryName: '报考指南',
    tags: ['报名指南', '考试流程'],
    isTop: false,
    isHot: true,
  },
  {
    id: 3,
    title: '零基础备考一级建造师：三个月通关攻略',
    summary: '针对零基础考生，分享高效备考方法和时间管理技巧，帮助你在短时间内掌握考试要点。',
    coverImage: 'https://picsum.photos/400/300?random=3',
    author: '李学长',
    source: '学员分享',
    viewCount: 3210,
    publishTime: '2025-04-22 09:15:00',
    categoryId: 2,
    categoryName: '新手必读',
    tags: ['备考攻略', '学习方法'],
    isTop: false,
    isHot: true,
  },
  {
    id: 4,
    title: '一级建造师考试科目难度分析及备考重点',
    summary: '详细分析四门考试科目的难度分布和分值占比，帮助你合理分配学习时间，提高备考效率。',
    coverImage: 'https://picsum.photos/400/300?random=4',
    author: '王教授',
    source: '学次元',
    viewCount: 1567,
    publishTime: '2025-04-21 16:45:00',
    categoryId: 2,
    categoryName: '新手必读',
    tags: ['科目分析', '备考重点'],
    isTop: false,
    isHot: false,
  },
  {
    id: 5,
    title: '二级建造师和一级建造师有什么区别？',
    summary: '很多考生对一建和二建的区别不太清楚，本文从报考条件、考试难度、执业范围等方面进行对比分析。',
    coverImage: 'https://picsum.photos/400/300?random=5',
    author: '学次元编辑部',
    source: '学次元',
    viewCount: 2103,
    publishTime: '2025-04-20 11:30:00',
    categoryId: 3,
    categoryName: '考试问答',
    tags: ['一建二建对比', '报考指导'],
    isTop: false,
    isHot: false,
  },
  {
    id: 6,
    title: '2025年一级建造师考试大纲变动说明',
    summary: '最新考试大纲已发布，本文梳理了各科目的变动内容，帮助考生及时调整备考计划。',
    coverImage: 'https://picsum.photos/400/300?random=6',
    author: '教育部考试中心',
    source: '官方发布',
    viewCount: 4521,
    publishTime: '2025-04-19 08:00:00',
    categoryId: 1,
    categoryName: '考试动态',
    tags: ['考试大纲', '政策变动'],
    isTop: true,
    isHot: true,
  },
  {
    id: 7,
    title: '一级建造师考试常见问答汇总（2025版）',
    summary: '整理了考生最常问的50个问题，涵盖报考、备考、考试、证书领取等各个环节。',
    coverImage: 'https://picsum.photos/400/300?random=7',
    author: '学次元编辑部',
    source: '学次元',
    viewCount: 1876,
    publishTime: '2025-04-18 15:20:00',
    categoryId: 3,
    categoryName: '考试问答',
    tags: ['常见问题', '问答汇总'],
    isTop: false,
    isHot: false,
  },
  {
    id: 8,
    title: '如何制定一级建造师备考计划？时间表推荐',
    summary: '根据不同基础的考生，提供3个月、6个月、1年的备考时间表，帮助你科学规划学习进度。',
    coverImage: 'https://picsum.photos/400/300?random=8',
    author: '陈老师',
    source: '学次元',
    viewCount: 2345,
    publishTime: '2025-04-17 10:00:00',
    categoryId: 2,
    categoryName: '新手必读',
    tags: ['备考计划', '时间管理'],
    isTop: false,
    isHot: false,
  },
  {
    id: 9,
    title: '一级建造师证书含金量及就业前景分析',
    summary: '深入分析一建证书的市场价值、薪资水平和发展前景，为你的职业规划提供参考。',
    coverImage: 'https://picsum.photos/400/300?random=9',
    author: '行业分析师',
    source: '学次元',
    viewCount: 3123,
    publishTime: '2025-04-16 14:30:00',
    categoryId: 1,
    categoryName: '考试动态',
    tags: ['证书价值', '就业前景'],
    isTop: false,
    isHot: true,
  },
  {
    id: 10,
    title: '一级建造师考试资格审核需要哪些材料？',
    summary: '详细列举报考资格审核所需的各类材料清单，提前准备避免错过报名时间。',
    coverImage: 'https://picsum.photos/400/300?random=10',
    author: '学次元编辑部',
    source: '学次元',
    viewCount: 1456,
    publishTime: '2025-04-15 09:45:00',
    categoryId: 4,
    categoryName: '报考指南',
    tags: ['资格审核', '材料准备'],
    isTop: false,
    isHot: false,
  },
  {
    id: 11,
    title: '2025年一级建造师考试时间安排公布',
    summary: '官方已公布2025年考试时间，本文整理了各科目的具体考试日期和时间安排。',
    coverImage: 'https://picsum.photos/400/300?random=11',
    author: '人社部考试中心',
    source: '官方发布',
    viewCount: 5678,
    publishTime: '2025-04-14 08:30:00',
    categoryId: 1,
    categoryName: '考试动态',
    tags: ['考试时间', '官方通知'],
    isTop: true,
    isHot: true,
  },
  {
    id: 12,
    title: '一级建造师备考：如何选择合适的培训班？',
    summary: '市场上培训班众多，本文从师资力量、课程设置、通过率等方面教你如何选择适合自己的培训班。',
    coverImage: 'https://picsum.photos/400/300?random=12',
    author: '学次元编辑部',
    source: '学次元',
    viewCount: 1789,
    publishTime: '2025-04-13 16:00:00',
    categoryId: 2,
    categoryName: '新手必读',
    tags: ['培训班选择', '备考建议'],
    isTop: false,
    isHot: false,
  },
]

/* 生成资讯详情内容 */
const generateArticleContent = (article: ArticleVO): string => {
  return `
    <h2>一、${article.title}概述</h2>
    <p>
      ${article.summary}。随着建筑行业的不断发展，对专业人才的需求也越来越高。
      一级建造师作为建筑行业的重要资格证书，其含金量和市场需求一直保持在较高水平。
    </p>
    <p>
      本文将从多个角度深入分析，帮助广大考生更好地了解相关政策，制定合理的备考计划。
    </p>

    <h2>二、主要内容</h2>
    <h3>1. 政策背景</h3>
    <p>
      近年来，国家对建筑行业的管理越来越规范，对从业人员的资质要求也越来越高。
      一级建造师证书作为建筑行业的重要准入门槛，其考试难度和含金量都在不断提升。
    </p>
    <p>
      根据最新政策规定，从事建筑工程项目管理的人员必须取得相应的资格证书，
      这也使得一建证书的市场需求持续增加。
    </p>

    <h3>2. 考试要点</h3>
    <p>一级建造师考试共包含四个科目：</p>
    <ul>
      <li><strong>建设工程经济</strong>：主要考察工程经济学的基本理论和方法</li>
      <li><strong>建设工程法规及相关知识</strong>：考察建筑法规、合同法等法律知识</li>
      <li><strong>建设工程项目管理</strong>：考察项目管理的基本理论和方法</li>
      <li><strong>专业工程管理与实务</strong>：考察专业知识和实际操作能力</li>
    </ul>

    <h3>3. 备考建议</h3>
    <p>
      针对不同的基础情况，建议采用不同的备考策略：
    </p>
    <ul>
      <li><strong>零基础考生</strong>：建议提前6-12个月开始准备，系统学习各科基础知识</li>
      <li><strong>有基础考生</strong>：3-6个月集中复习，重点攻克薄弱环节</li>
      <li><strong>增项考生</strong>：2-3个月集中准备实务科目</li>
    </ul>

    <h2>三、常见问题解答</h2>
    <h3>Q1: 一级建造师报名条件是什么？</h3>
    <p>
      答：根据规定，报考一级建造师需要具备以下条件：工程类或工程经济类大学专科及以上学历，
      并满足相应的工作年限要求。具体要求可查阅官方报名通知。
    </p>

    <h3>Q2: 考试成绩有效期是多久？</h3>
    <p>
      答：一级建造师考试成绩实行两年滚动管理，即在连续两个考试年度内通过全部四个科目即可。
    </p>

    <h3>Q3: 证书注册需要注意什么？</h3>
    <p>
      答：取得资格证书后，需要在规定时间内完成初始注册。注册时需要提供与报考时一致的学历证明、
      工作经历证明等材料。
    </p>

    <h2>四、总结</h2>
    <p>
      ${article.title}是每位考生都需要关注的重要内容。希望通过本文的介绍，
      能够帮助大家更好地了解相关政策，制定科学合理的备考计划。
    </p>
    <p>
      最后祝愿所有考生都能顺利通过考试，取得理想的成绩！如有任何问题，
      欢迎在评论区留言或联系我们的客服团队。
    </p>

    <blockquote>
      <p>声明：本文内容仅供参考，具体政策以官方发布为准。</p>
    </blockquote>
  `
}

/* 获取资讯列表（Mock） */
export const getMockArticleList = (params: {
  page?: number
  limit?: number
  categoryId?: number
  keyword?: string
}): ArticleListRespVO => {
  const { page = 1, limit = 10, categoryId, keyword } = params

  let list = [...mockArticleList]

  /* 按分类筛选 */
  if (categoryId) {
    list = list.filter(item => item.categoryId === categoryId)
  }

  /* 按关键词搜索 */
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    list = list.filter(item =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.summary?.toLowerCase().includes(lowerKeyword)
    )
  }

  /* 排序：置顶 > 热门 > 时间 */
  list.sort((a, b) => {
    if (a.isTop !== b.isTop) return (b.isTop ? 1 : 0) - (a.isTop ? 1 : 0)
    if (a.isHot !== b.isHot) return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0)
    return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
  })

  const total = list.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedList = list.slice(start, end)

  return {
    list: paginatedList,
    total,
  }
}

/* 获取资讯详情（Mock） */
export const getMockArticleDetail = (id: number): ArticleDetailVO | null => {
  const article = mockArticleList.find(item => item.id === id)
  if (!article) return null

  const currentIndex = mockArticleList.findIndex(item => item.id === id)
  const prevArticle = currentIndex < mockArticleList.length - 1
    ? { id: mockArticleList[currentIndex + 1].id, title: mockArticleList[currentIndex + 1].title }
    : undefined
  const nextArticle = currentIndex > 0
    ? { id: mockArticleList[currentIndex - 1].id, title: mockArticleList[currentIndex - 1].title }
    : undefined

  return {
    ...article,
    content: generateArticleContent(article),
    prevArticle,
    nextArticle,
  }
}

/* 获取资讯分类（Mock） */
export const getMockArticleCategories = (): ArticleCategoryVO[] => {
  return mockCategories.map(cat => ({
    ...cat,
    count: mockArticleList.filter(item => item.categoryId === cat.id).length,
  }))
}

/* 增加浏览量（Mock） */
export const incrementMockViewCount = (id: number): void => {
  const article = mockArticleList.find(item => item.id === id)
  if (article) {
    article.viewCount += 1
  }
}
