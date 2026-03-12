import type {
  QbankInfoVO,
  QbankDetailVO,
  QbankListRespVO,
  QbankAccessVO,
  ChapterVO,
  SectionVO,
} from '~/types/qBank/index'

/**
 * 题库模拟数据
 * 用于开发和演示环境
 */

/* ==================== 分类模拟数据（支持二级分类） ==================== */

export interface CategoryWithChildren {
  id: number
  name: string
  icon: string
  sort: number
  children?: { id: number; name: string; count?: number }[]
}

export const mockCategoriesWithChildren: CategoryWithChildren[] = [
  {
    id: 1,
    name: '建筑工程',
    icon: 'ep:office-building',
    sort: 1,
    children: [
      { id: 101, name: '一级建造师', count: 12 },
      { id: 102, name: '二级建造师', count: 8 },
      { id: 103, name: '造价工程师', count: 6 },
      { id: 104, name: '监理工程师', count: 5 },
      { id: 105, name: '安全工程师', count: 4 },
      { id: 106, name: '消防工程师', count: 3 },
    ]
  },
  {
    id: 2,
    name: '财务会计',
    icon: 'ep:money',
    sort: 2,
    children: [
      { id: 201, name: '注册会计师', count: 15 },
      { id: 202, name: '初级会计职称', count: 10 },
      { id: 203, name: '中级会计职称', count: 8 },
      { id: 204, name: '高级会计职称', count: 5 },
      { id: 205, name: '税务师', count: 6 },
      { id: 206, name: '经济师', count: 4 },
    ]
  },
  {
    id: 3,
    name: '医药卫生',
    icon: 'ep:first-aid-kit',
    sort: 3,
    children: [
      { id: 301, name: '执业医师', count: 20 },
      { id: 302, name: '执业药师', count: 12 },
      { id: 303, name: '护士资格', count: 8 },
      { id: 304, name: '健康管理师', count: 6 },
    ]
  },
  {
    id: 4,
    name: '教师资格',
    icon: 'ep:user',
    sort: 4,
    children: [
      { id: 401, name: '幼儿教师资格', count: 8 },
      { id: 402, name: '小学教师资格', count: 10 },
      { id: 403, name: '中学教师资格', count: 12 },
      { id: 404, name: '教师资格面试', count: 6 },
    ]
  },
  {
    id: 5,
    name: 'IT认证',
    icon: 'ep:monitor',
    sort: 5,
    children: [
      { id: 501, name: 'PMP项目管理', count: 5 },
      { id: 502, name: '软考中级', count: 8 },
      { id: 503, name: '软考高级', count: 6 },
      { id: 504, name: 'AWS认证', count: 4 },
      { id: 505, name: '华为认证', count: 5 },
    ]
  },
  {
    id: 6,
    name: '公务员考试',
    icon: 'ep:document-checked',
    sort: 6,
    children: [
      { id: 601, name: '国考公务员', count: 15 },
      { id: 602, name: '省考公务员', count: 20 },
      { id: 603, name: '事业单位', count: 18 },
      { id: 604, name: '三支一扶', count: 8 },
    ]
  },
]

/* 兼容旧版本的分类数据 */
export const mockCategories = mockCategoriesWithChildren.map(({ id, name, icon, sort }) => ({
  id, name, icon, sort
}))

/* ==================== 题库列表模拟数据 ==================== */

const generateMockQbanks = (): QbankInfoVO[] => {
  const qbanks: QbankInfoVO[] = [
    /* 建筑工程类 */
    {
      id: 1,
      name: '2025年一级建造师《建设工程经济》真题库',
      description: '涵盖历年真题、模拟试题、章节练习，助力一建考试通关。包含工程经济、工程财务、建设工程估价等核心内容。',
      categoryId: 1,
      categoryName: '建筑工程',
      coverImage: 'https://picsum.photos/400/300?random=1',
      price: 9900,
      originalPrice: 19900,
      questionCount: 2580,
      difficulty: 2,
      difficultyName: '中等',
      status: 1,
      sort: 1,
      createTime: '2025-01-15T10:00:00',
      updateTime: '2025-03-01T15:30:00',
    },
    {
      id: 2,
      name: '2025年一级建造师《建设工程项目管理》精题库',
      description: '精选高频考点，配套详细解析。覆盖项目组织与管理、项目成本管理、项目进度管理等重点章节。',
      categoryId: 1,
      categoryName: '建筑工程',
      coverImage: 'https://picsum.photos/400/300?random=2',
      price: 12900,
      originalPrice: 25900,
      questionCount: 3200,
      difficulty: 3,
      difficultyName: '困难',
      status: 1,
      sort: 2,
      createTime: '2025-01-20T09:00:00',
      updateTime: '2025-03-05T11:20:00',
    },
    {
      id: 3,
      name: '二级建造师《建筑工程管理与实务》通关宝典',
      description: '实务科目专项突破，案例题精讲精练。针对建筑工程实务考试特点，提供大量案例分析练习题。',
      categoryId: 1,
      categoryName: '建筑工程',
      coverImage: 'https://picsum.photos/400/300?random=3',
      price: 0,
      questionCount: 1560,
      difficulty: 2,
      difficultyName: '中等',
      status: 1,
      sort: 3,
      createTime: '2025-02-01T14:00:00',
      updateTime: '2025-02-28T16:45:00',
    },
    {
      id: 4,
      name: '注册造价工程师《建设工程造价管理》必刷题库',
      description: '造价师考试必备，涵盖工程造价管理、工程计价、技术与计量等核心知识点。',
      categoryId: 1,
      categoryName: '建筑工程',
      coverImage: 'https://picsum.photos/400/300?random=4',
      price: 14900,
      originalPrice: 29900,
      questionCount: 4200,
      difficulty: 3,
      difficultyName: '困难',
      status: 1,
      sort: 4,
      createTime: '2025-01-10T08:30:00',
      updateTime: '2025-03-08T09:15:00',
    },
    /* 财务会计类 */
    {
      id: 5,
      name: '2025年注册会计师《会计》真题精讲',
      description: 'CPA会计科目历年真题汇编，配套视频精讲。覆盖会计基本原理、财务报表、收入确认等重点内容。',
      categoryId: 2,
      categoryName: '财务会计',
      coverImage: 'https://picsum.photos/400/300?random=5',
      price: 19900,
      originalPrice: 39900,
      questionCount: 5800,
      difficulty: 3,
      difficultyName: '困难',
      status: 1,
      sort: 5,
      createTime: '2025-01-05T11:00:00',
      updateTime: '2025-03-10T14:30:00',
    },
    {
      id: 6,
      name: '中级会计职称《财务管理》通关题库',
      description: '中级财管科目系统练习，包含财务管理基础、预算管理、筹资管理、投资管理等核心章节。',
      categoryId: 2,
      categoryName: '财务会计',
      coverImage: 'https://picsum.photos/400/300?random=6',
      price: 7900,
      originalPrice: 15900,
      questionCount: 2100,
      difficulty: 2,
      difficultyName: '中等',
      status: 1,
      sort: 6,
      createTime: '2025-02-10T10:30:00',
      updateTime: '2025-03-02T11:00:00',
    },
    {
      id: 7,
      name: '初级会计职称《初级会计实务》零基础入门',
      description: '适合零基础学员，从会计基础概念到实务操作，循序渐进，配套大量练习题巩固知识点。',
      categoryId: 2,
      categoryName: '财务会计',
      coverImage: 'https://picsum.photos/400/300?random=7',
      price: 0,
      questionCount: 1800,
      difficulty: 1,
      difficultyName: '简单',
      status: 1,
      sort: 7,
      createTime: '2025-02-15T09:00:00',
      updateTime: '2025-03-05T10:20:00',
    },
    /* 医药卫生类 */
    {
      id: 8,
      name: '执业医师《临床医学综合》历年真题库',
      description: '临床执业医师考试必备，涵盖内科、外科、妇产科、儿科等临床综合知识点。',
      categoryId: 3,
      categoryName: '医药卫生',
      coverImage: 'https://picsum.photos/400/300?random=8',
      price: 15900,
      originalPrice: 31900,
      questionCount: 6500,
      difficulty: 3,
      difficultyName: '困难',
      status: 1,
      sort: 8,
      createTime: '2025-01-08T14:00:00',
      updateTime: '2025-03-06T16:00:00',
    },
    {
      id: 9,
      name: '执业药师《药学专业知识（一）》精编题库',
      description: '药学专业考生必备，系统覆盖药剂学、药物化学、药效学、药物分析等专业知识。',
      categoryId: 3,
      categoryName: '医药卫生',
      coverImage: 'https://picsum.photos/400/300?random=9',
      price: 11900,
      originalPrice: 23900,
      questionCount: 3800,
      difficulty: 2,
      difficultyName: '中等',
      status: 1,
      sort: 9,
      createTime: '2025-01-25T11:30:00',
      updateTime: '2025-03-09T13:45:00',
    },
    {
      id: 10,
      name: '护士执业资格考试《专业实务》高频考点',
      description: '护士资格证考试专业实务科目，涵盖基础护理、内科护理、外科护理、妇产科护理等高频考点。',
      categoryId: 3,
      categoryName: '医药卫生',
      coverImage: 'https://picsum.photos/400/300?random=10',
      price: 6900,
      originalPrice: 13900,
      questionCount: 2800,
      difficulty: 1,
      difficultyName: '简单',
      status: 1,
      sort: 10,
      createTime: '2025-02-05T15:00:00',
      updateTime: '2025-03-04T09:30:00',
    },
    /* 教师资格类 */
    {
      id: 11,
      name: '中学教师资格证《教育知识与能力》通关题库',
      description: '中学教资考试教育知识与能力科目，覆盖教育学、心理学、教育法律法规等必考内容。',
      categoryId: 4,
      categoryName: '教师资格',
      coverImage: 'https://picsum.photos/400/300?random=11',
      price: 5900,
      originalPrice: 11900,
      questionCount: 2200,
      difficulty: 2,
      difficultyName: '中等',
      status: 1,
      sort: 11,
      createTime: '2025-01-18T10:00:00',
      updateTime: '2025-03-07T11:30:00',
    },
    {
      id: 12,
      name: '小学教师资格证《综合素质》真题汇编',
      description: '小学教资综合素质科目，包含职业理念、教育法律法规、教师职业道德、文化素养等内容。',
      categoryId: 4,
      categoryName: '教师资格',
      coverImage: 'https://picsum.photos/400/300?random=12',
      price: 0,
      questionCount: 1600,
      difficulty: 1,
      difficultyName: '简单',
      status: 1,
      sort: 12,
      createTime: '2025-02-20T09:30:00',
      updateTime: '2025-03-01T14:00:00',
    },
    /* IT认证类 */
    {
      id: 13,
      name: 'PMP项目管理认证考试模拟题库',
      description: 'PMP认证考试全套模拟题，覆盖项目启动、规划、执行、监控、收尾五大过程组。',
      categoryId: 5,
      categoryName: 'IT认证',
      coverImage: 'https://picsum.photos/400/300?random=13',
      price: 24900,
      originalPrice: 49900,
      questionCount: 1200,
      difficulty: 3,
      difficultyName: '困难',
      status: 1,
      sort: 13,
      createTime: '2025-01-12T11:00:00',
      updateTime: '2025-03-11T10:00:00',
    },
    {
      id: 14,
      name: 'AWS云从业者认证（CLF-C02）官方题库',
      description: 'AWS Cloud Practitioner认证考试官方题库中文版，覆盖云计算概念、AWS核心服务、安全与合规等内容。',
      categoryId: 5,
      categoryName: 'IT认证',
      coverImage: 'https://picsum.photos/400/300?random=14',
      price: 19900,
      originalPrice: 39900,
      questionCount: 800,
      difficulty: 2,
      difficultyName: '中等',
      status: 1,
      sort: 14,
      createTime: '2025-02-08T14:30:00',
      updateTime: '2025-03-08T15:30:00',
    },
    {
      id: 15,
      name: '软考中级《软件设计师》历年真题集',
      description: '软件设计师考试历年真题汇编，包含计算机系统、程序设计语言、数据结构、软件工程等考点。',
      categoryId: 5,
      categoryName: 'IT认证',
      coverImage: 'https://picsum.photos/400/300?random=15',
      price: 8900,
      originalPrice: 17900,
      questionCount: 1500,
      difficulty: 2,
      difficultyName: '中等',
      status: 1,
      sort: 15,
      createTime: '2025-01-28T09:00:00',
      updateTime: '2025-03-03T11:45:00',
    },
    /* 公务员考试类 */
    {
      id: 16,
      name: '2025年国家公务员考试《行政职业能力测验》',
      description: '国考行测全套题库，涵盖言语理解、数量关系、判断推理、资料分析、常识判断五大模块。',
      categoryId: 6,
      categoryName: '公务员考试',
      coverImage: 'https://picsum.photos/400/300?random=16',
      price: 14900,
      originalPrice: 29900,
      questionCount: 8000,
      difficulty: 2,
      difficultyName: '中等',
      status: 1,
      sort: 16,
      createTime: '2025-01-03T10:00:00',
      updateTime: '2025-03-12T09:00:00',
    },
    {
      id: 17,
      name: '2025年国家公务员考试《申论》写作训练',
      description: '国考申论专项训练，包含归纳概括、综合分析、提出对策、贯彻执行、大作文等题型。',
      categoryId: 6,
      categoryName: '公务员考试',
      coverImage: 'https://picsum.photos/400/300?random=17',
      price: 12900,
      originalPrice: 25900,
      questionCount: 500,
      difficulty: 2,
      difficultyName: '中等',
      status: 1,
      sort: 17,
      createTime: '2025-01-06T14:00:00',
      updateTime: '2025-03-10T16:00:00',
    },
    {
      id: 18,
      name: '省考公务员《公共基础知识》高频题库',
      description: '各省公务员考试公基科目，覆盖政治、法律、经济、管理、公文写作等公共基础知识。',
      categoryId: 6,
      categoryName: '公务员考试',
      coverImage: 'https://picsum.photos/400/300?random=18',
      price: 9900,
      originalPrice: 19900,
      questionCount: 4500,
      difficulty: 1,
      difficultyName: '简单',
      status: 1,
      sort: 18,
      createTime: '2025-02-12T11:00:00',
      updateTime: '2025-03-06T10:30:00',
    },
  ]

  return qbanks
}

export const mockQbankList: QbankInfoVO[] = generateMockQbanks()

/* ==================== 章节模拟数据 ==================== */

const generateMockChapters = (qbankId: number): ChapterVO[] => {
  const chapters: ChapterVO[] = [
    {
      id: 1,
      name: '第一章 基础理论知识',
      total: 120,
      completedCount: 45,
      accuracyRate: 78.5,
      sectionList: [
        { id: 11, name: '1.1 基本概念', total: 40, chapterId: 1, chapterName: '第一章 基础理论知识' },
        { id: 12, name: '1.2 基本原理', total: 45, chapterId: 1, chapterName: '第一章 基础理论知识' },
        { id: 13, name: '1.3 核心方法', total: 35, chapterId: 1, chapterName: '第一章 基础理论知识' },
      ],
    },
    {
      id: 2,
      name: '第二章 实务操作',
      total: 200,
      completedCount: 80,
      accuracyRate: 72.3,
      sectionList: [
        { id: 21, name: '2.1 操作流程', total: 80, chapterId: 2, chapterName: '第二章 实务操作' },
        { id: 22, name: '2.2 常见问题', total: 70, chapterId: 2, chapterName: '第二章 实务操作' },
        { id: 23, name: '2.3 案例分析', total: 50, chapterId: 2, chapterName: '第二章 实务操作' },
      ],
    },
    {
      id: 3,
      name: '第三章 综合应用',
      total: 150,
      completedCount: 30,
      accuracyRate: 65.0,
      sectionList: [
        { id: 31, name: '3.1 综合练习一', total: 50, chapterId: 3, chapterName: '第三章 综合应用' },
        { id: 32, name: '3.2 综合练习二', total: 50, chapterId: 3, chapterName: '第三章 综合应用' },
        { id: 33, name: '3.3 综合练习三', total: 50, chapterId: 3, chapterName: '第三章 综合应用' },
      ],
    },
    {
      id: 4,
      name: '第四章 历年真题',
      total: 300,
      completedCount: 120,
      accuracyRate: 70.2,
      sectionList: [
        { id: 41, name: '4.1 2024年真题', total: 100, chapterId: 4, chapterName: '第四章 历年真题' },
        { id: 42, name: '4.2 2023年真题', total: 100, chapterId: 4, chapterName: '第四章 历年真题' },
        { id: 43, name: '4.3 2022年真题', total: 100, chapterId: 4, chapterName: '第四章 历年真题' },
      ],
    },
    {
      id: 5,
      name: '第五章 模拟测试',
      total: 250,
      completedCount: 0,
      accuracyRate: 0,
      sectionList: [
        { id: 51, name: '5.1 模拟测试一', total: 80, chapterId: 5, chapterName: '第五章 模拟测试' },
        { id: 52, name: '5.2 模拟测试二', total: 85, chapterId: 5, chapterName: '第五章 模拟测试' },
        { id: 53, name: '5.3 模拟测试三', total: 85, chapterId: 5, chapterName: '第五章 模拟测试' },
      ],
    },
  ]
  return chapters
}

/* ==================== 题库详情模拟数据 ==================== */

export const getMockQbankDetail = (id: number): QbankDetailVO | null => {
  const qbank = mockQbankList.find(q => q.id === id)
  if (!qbank) return null

  return {
    ...qbank,
    chapters: generateMockChapters(id),
    tags: ['历年真题', '章节练习', '模拟测试', '错题回顾'],
    salesCount: Math.floor(Math.random() * 5000) + 500,
    rating: Number((4.0 + Math.random() * 0.9).toFixed(1)),
    isPurchased: Math.random() > 0.7,
    purchaseCount: Math.floor(Math.random() * 1000) + 100,
  }
}

/* ==================== 列表查询模拟函数 ==================== */

export const getMockQbankList = (
  keyword?: string,
  categoryId?: number,
  difficulty?: number,
  sort?: string,
  page: number = 1,
  limit: number = 12
): QbankListRespVO => {
  let list = [...mockQbankList]

  /* 关键字筛选 */
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    list = list.filter(q =>
      q.name.toLowerCase().includes(lowerKeyword) ||
      q.description?.toLowerCase().includes(lowerKeyword)
    )
  }

  /* 分类筛选 */
  if (categoryId) {
    list = list.filter(q => q.categoryId === categoryId)
  }

  /* 难度筛选 */
  if (difficulty) {
    list = list.filter(q => q.difficulty === difficulty)
  }

  /* 排序 */
  switch (sort) {
    case 'newest':
      list.sort((a, b) => new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime())
      break
    case 'hot':
      list.sort((a, b) => (b.questionCount || 0) - (a.questionCount || 0))
      break
    case 'price_asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      list.sort((a, b) => b.price - a.price)
      break
    default:
      list.sort((a, b) => (a.sort || 0) - (b.sort || 0))
  }

  const total = list.length
  const start = (page - 1) * limit
  const end = start + limit
  list = list.slice(start, end)

  return {
    list,
    total,
  }
}

/* ==================== 权限检查模拟数据 ==================== */

export const getMockQbankAccess = (qbankId: number): QbankAccessVO => {
  const qbank = mockQbankList.find(q => q.id === qbankId)

  /* 免费题库直接返回有权限 */
  if (qbank?.price === 0) {
    return {
      qbankId,
      hasAccess: true,
      accessType: 'free',
    }
  }

  /* 模拟已购买情况（30%概率） */
  if (Math.random() > 0.7) {
    return {
      qbankId,
      hasAccess: true,
      accessType: 'purchased',
    }
  }

  /* 模拟试用权限（20%概率） */
  if (Math.random() > 0.8) {
    return {
      qbankId,
      hasAccess: false,
      accessType: 'trial',
      remainingUses: 10,
    }
  }

  /* 无权限 */
  return {
    qbankId,
    hasAccess: false,
    accessType: 'free',
  }
}
