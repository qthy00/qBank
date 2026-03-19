/**
 * 搜索功能 Mock 数据
 * 用于开发和演示环境
 */
import type {
  SearchResultItem,
  SearchSuggestItem,
  HotSearchItem,
  SearchResultGroup,
  SearchRespVO,
  SearchSuggestRespVO,
  QbankSearchResult,
  QuestionSearchResult,
  ArticleSearchResult,
} from '~/types/search'

/* ==================== 热门搜索 Mock 数据 ==================== */

export const mockHotSearchList: HotSearchItem[] = [
  { keyword: '一级建造师', searchCount: 12580, sort: 1 },
  { keyword: '注册会计师', searchCount: 9876, sort: 2 },
  { keyword: '二级建造师', searchCount: 8654, sort: 3 },
  { keyword: '执业医师', searchCount: 7543, sort: 4 },
  { keyword: '教师资格证', searchCount: 6890, sort: 5 },
  { keyword: 'PMP项目管理', searchCount: 5678, sort: 6 },
  { keyword: '中级会计职称', searchCount: 4567, sort: 7 },
  { keyword: '公务员', searchCount: 4321, sort: 8 },
  { keyword: '软考中级', searchCount: 3890, sort: 9 },
  { keyword: '工程造价', searchCount: 3456, sort: 10 },
]

/* ==================== 题库搜索结果 Mock 数据 ==================== */

export const mockQbankSearchResults: QbankSearchResult[] = [
  {
    id: 1,
    type: 'qbank',
    title: '2025年一级建造师《建设工程经济》真题库',
    name: '2025年一级建造师《建设工程经济》真题库',
    summary: '涵盖历年真题、模拟试题、章节练习，助力一建考试通关。包含工程经济、工程财务、建设工程估价等核心内容。',
    categoryName: '建筑工程',
    createTime: '2025-01-15 10:00:00',
    questionCount: 2580,
    price: 99,
    coverUrl: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: 2,
    type: 'qbank',
    title: '一级建造师《建设工程项目管理》精题库',
    name: '一级建造师《建设工程项目管理》精题库',
    summary: '精选高频考点，配套详细解析。覆盖项目组织与管理、项目成本管理、项目进度管理等重点章节。',
    categoryName: '建筑工程',
    createTime: '2025-01-20 09:00:00',
    questionCount: 3200,
    price: 129,
    coverUrl: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: 3,
    type: 'qbank',
    title: '二级建造师《建筑工程管理与实务》通关宝典',
    name: '二级建造师《建筑工程管理与实务》通关宝典',
    summary: '实务科目专项突破，案例题精讲精练。针对建筑工程实务考试特点，提供大量案例分析练习题。',
    categoryName: '建筑工程',
    createTime: '2025-02-01 14:00:00',
    questionCount: 1560,
    price: 0,
    coverUrl: 'https://picsum.photos/400/300?random=3',
  },
  {
    id: 5,
    type: 'qbank',
    title: '2025年注册会计师《会计》真题精讲',
    name: '2025年注册会计师《会计》真题精讲',
    summary: 'CPA会计科目历年真题汇编，配套视频精讲。覆盖会计基本原理、财务报表、收入确认等重点内容。',
    categoryName: '财务会计',
    createTime: '2025-01-05 11:00:00',
    questionCount: 5800,
    price: 199,
    coverUrl: 'https://picsum.photos/400/300?random=5',
  },
  {
    id: 8,
    type: 'qbank',
    title: '执业医师《临床医学综合》历年真题库',
    name: '执业医师《临床医学综合》历年真题库',
    summary: '临床执业医师考试必备，涵盖内科、外科、妇产科、儿科等临床综合知识点。',
    categoryName: '医药卫生',
    createTime: '2025-01-08 14:00:00',
    questionCount: 6500,
    price: 159,
    coverUrl: 'https://picsum.photos/400/300?random=8',
  },
  {
    id: 11,
    type: 'qbank',
    title: '中学教师资格证《教育知识与能力》通关题库',
    name: '中学教师资格证《教育知识与能力》通关题库',
    summary: '中学教资考试教育知识与能力科目，覆盖教育学、心理学、教育法律法规等必考内容。',
    categoryName: '教师资格',
    createTime: '2025-01-18 10:00:00',
    questionCount: 2200,
    price: 59,
    coverUrl: 'https://picsum.photos/400/300?random=11',
  },
]

/* ==================== 题目搜索结果 Mock 数据 ==================== */

export const mockQuestionSearchResults: QuestionSearchResult[] = [
  {
    id: 101,
    type: 'question',
    title: '关于建设工程项目管理的说法，正确的是？',
    summary: '建设工程项目管理的核心任务是项目的目标控制，包括费用控制、进度控制和质量控制...',
    categoryName: '建筑工程',
    createTime: '2025-01-20 14:30:00',
    questionType: 1,
    typeName: '单选题',
    difficulty: 2,
    qbankId: 2,
    qbankName: '一级建造师《建设工程项目管理》精题库',
  },
  {
    id: 102,
    type: 'question',
    title: '下列关于建设工程项目总承包的说法，错误的是？',
    summary: '建设工程项目总承包是指业主方把建设工程项目的设计和施工任务进行综合委托...',
    categoryName: '建筑工程',
    createTime: '2025-01-21 10:00:00',
    questionType: 1,
    typeName: '单选题',
    difficulty: 3,
    qbankId: 2,
    qbankName: '一级建造师《建设工程项目管理》精题库',
  },
  {
    id: 103,
    type: 'question',
    title: '建设工程项目管理的内涵是：自项目开始至项目完成，通过项目策划和项目控制，以使项目的费用目标、进度目标和质量目标得以实现。',
    summary: '项目管理的核心任务是目标控制，包括三大目标的协调统一...',
    categoryName: '建筑工程',
    createTime: '2025-01-22 09:00:00',
    questionType: 2,
    typeName: '判断题',
    difficulty: 1,
    qbankId: 2,
    qbankName: '一级建造师《建设工程项目管理》精题库',
  },
  {
    id: 201,
    type: 'question',
    title: '下列各项中，属于会计信息质量要求的有？',
    summary: '会计信息质量要求包括可靠性、相关性、可理解性、可比性、实质重于形式、重要性、谨慎性和及时性...',
    categoryName: '财务会计',
    createTime: '2025-01-10 11:00:00',
    questionType: 3,
    typeName: '多选题',
    difficulty: 2,
    qbankId: 5,
    qbankName: '2025年注册会计师《会计》真题精讲',
  },
  {
    id: 202,
    type: 'question',
    title: '关于固定资产折旧方法，下列说法正确的是？',
    summary: '固定资产折旧方法包括年限平均法、工作量法、双倍余额递减法和年数总和法...',
    categoryName: '财务会计',
    createTime: '2025-01-12 15:30:00',
    questionType: 1,
    typeName: '单选题',
    difficulty: 3,
    qbankId: 5,
    qbankName: '2025年注册会计师《会计》真题精讲',
  },
  {
    id: 301,
    type: 'question',
    title: '下列关于高血压的诊断标准，正确的是？',
    summary: '高血压的诊断标准为收缩压≥140mmHg和（或）舒张压≥90mmHg...',
    categoryName: '医药卫生',
    createTime: '2025-01-15 09:00:00',
    questionType: 1,
    typeName: '单选题',
    difficulty: 2,
    qbankId: 8,
    qbankName: '执业医师《临床医学综合》历年真题库',
  },
]

/* ==================== 文章搜索结果 Mock 数据 ==================== */

export const mockArticleSearchResults: ArticleSearchResult[] = [
  {
    id: 1,
    type: 'article',
    title: '2025年一级建造师考试报名时间及流程详解',
    summary: '2025年一级建造师考试报名即将开始，本文详细介绍报名时间、报名流程、资格审核等注意事项。',
    categoryName: '报考指南',
    createTime: '2025-04-23 14:20:00',
    author: '学次元编辑部',
    viewCount: 1892,
    coverUrl: 'https://picsum.photos/400/300?random=21',
  },
  {
    id: 3,
    type: 'article',
    title: '零基础备考一级建造师：三个月通关攻略',
    summary: '针对零基础考生，分享高效备考方法和时间管理技巧，帮助你在短时间内掌握考试要点。',
    categoryName: '新手必读',
    createTime: '2025-04-22 09:15:00',
    author: '李学长',
    viewCount: 3210,
    coverUrl: 'https://picsum.photos/400/300?random=23',
  },
  {
    id: 6,
    type: 'article',
    title: '2025年一级建造师考试大纲变动说明',
    summary: '最新考试大纲已发布，本文梳理了各科目的变动内容，帮助考生及时调整备考计划。',
    categoryName: '考试动态',
    createTime: '2025-04-19 08:00:00',
    author: '教育部考试中心',
    viewCount: 4521,
    coverUrl: 'https://picsum.photos/400/300?random=26',
  },
  {
    id: 9,
    type: 'article',
    title: '一级建造师证书含金量及就业前景分析',
    summary: '深入分析一建证书的市场价值、薪资水平和发展前景，为你的职业规划提供参考。',
    categoryName: '考试动态',
    createTime: '2025-04-16 14:30:00',
    author: '行业分析师',
    viewCount: 3123,
    coverUrl: 'https://picsum.photos/400/300?random=29',
  },
  {
    id: 11,
    type: 'article',
    title: '2025年一级建造师考试时间安排公布',
    summary: '官方已公布2025年考试时间，本文整理了各科目的具体考试日期和时间安排。',
    categoryName: '考试动态',
    createTime: '2025-04-14 08:30:00',
    author: '人社部考试中心',
    viewCount: 5678,
    coverUrl: 'https://picsum.photos/400/300?random=31',
  },
]

/* ==================== 搜索建议 Mock 数据 ==================== */

export const mockSearchSuggestions: SearchSuggestItem[] = [
  { text: '一级建造师', type: 'qbank', highlightText: '<em>一级</em>建造师', searchCount: 12580 },
  { text: '一级建造师真题', type: 'qbank', highlightText: '<em>一级</em>建造师真题', searchCount: 8567 },
  { text: '一级建造师报名', type: 'article', highlightText: '<em>一级</em>建造师报名', searchCount: 6543 },
  { text: '一级建造师考试时间', type: 'article', highlightText: '<em>一级</em>建造师考试时间', searchCount: 5432 },
  { text: '一级建造师备考攻略', type: 'article', highlightText: '<em>一级</em>建造师备考攻略', searchCount: 4321 },
]

/* ==================== Mock 数据查询函数 ==================== */

/**
 * 全局搜索 Mock
 */
export const mockSearch = (
  keyword: string,
  type?: 'all' | 'qbank' | 'question' | 'article',
  pageNo: number = 1,
  pageSize: number = 10
): SearchRespVO => {
  const lowerKeyword = keyword.toLowerCase()

  /* 根据类型筛选数据 */
  let qbankList: QbankSearchResult[] = []
  let questionList: QuestionSearchResult[] = []
  let articleList: ArticleSearchResult[] = []

  if (!type || type === 'all' || type === 'qbank') {
    qbankList = mockQbankSearchResults.filter(
      item =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.summary?.toLowerCase().includes(lowerKeyword) ||
        item.categoryName?.toLowerCase().includes(lowerKeyword)
    )
  }

  if (!type || type === 'all' || type === 'question') {
    questionList = mockQuestionSearchResults.filter(
      item =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.summary?.toLowerCase().includes(lowerKeyword) ||
        item.qbankName?.toLowerCase().includes(lowerKeyword)
    )
  }

  if (!type || type === 'all' || type === 'article') {
    articleList = mockArticleSearchResults.filter(
      item =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.summary?.toLowerCase().includes(lowerKeyword) ||
        item.author?.toLowerCase().includes(lowerKeyword)
    )
  }

  /* 合并结果并按相关度排序 */
  const allResults: SearchResultItem[] = [...qbankList, ...questionList, ...articleList]

  /* 生成分组数据 */
  const groups: SearchResultGroup[] = []
  if (qbankList.length > 0) {
    groups.push({
      type: 'qbank',
      name: '题库',
      items: qbankList,
      total: qbankList.length,
    })
  }
  if (questionList.length > 0) {
    groups.push({
      type: 'question',
      name: '题目',
      items: questionList,
      total: questionList.length,
    })
  }
  if (articleList.length > 0) {
    groups.push({
      type: 'article',
      name: '文章',
      items: articleList,
      total: articleList.length,
    })
  }

  /* 分页 */
  const total = allResults.length
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize
  const paginatedList = allResults.slice(start, end)

  return {
    list: paginatedList,
    groups: type === 'all' || !type ? groups : undefined,
    total,
    pageNo,
    pageSize,
  }
}

/**
 * 搜索建议 Mock
 */
export const mockGetSuggestions = (keyword: string): SearchSuggestRespVO => {
  if (!keyword || keyword.length < 1) {
    return { list: [] }
  }

  const lowerKeyword = keyword.toLowerCase()

  /* 生成高亮文本 */
  const generateHighlight = (text: string, keyword: string): string => {
    const regex = new RegExp(`(${keyword})`, 'gi')
    return text.replace(regex, '<em>$1</em>')
  }

  /* 从题库、题目、文章中匹配 */
  const suggestions: SearchSuggestItem[] = []

  /* 匹配题库 */
  mockQbankSearchResults.forEach(item => {
    if (item.title.toLowerCase().includes(lowerKeyword)) {
      suggestions.push({
        text: item.title,
        type: 'qbank',
        highlightText: generateHighlight(item.title, keyword),
        searchCount: Math.floor(Math.random() * 5000) + 100,
      })
    }
  })

  /* 匹配题目 */
  mockQuestionSearchResults.forEach(item => {
    if (item.title.toLowerCase().includes(lowerKeyword)) {
      suggestions.push({
        text: item.title.substring(0, 30) + '...',
        type: 'question',
        highlightText: generateHighlight(item.title.substring(0, 30) + '...', keyword),
        searchCount: Math.floor(Math.random() * 2000) + 50,
      })
    }
  })

  /* 匹配文章 */
  mockArticleSearchResults.forEach(item => {
    if (item.title.toLowerCase().includes(lowerKeyword)) {
      suggestions.push({
        text: item.title,
        type: 'article',
        highlightText: generateHighlight(item.title, keyword),
        searchCount: Math.floor(Math.random() * 3000) + 80,
      })
    }
  })

  /* 去重并限制数量 */
  const uniqueSuggestions = suggestions.filter(
    (item, index, self) => index === self.findIndex(t => t.text === item.text)
  )

  return {
    list: uniqueSuggestions.slice(0, 8),
  }
}

/**
 * 热门搜索 Mock
 */
export const mockGetHotSearch = (limit: number = 10): HotSearchItem[] => {
  return mockHotSearchList.slice(0, limit)
}

/**
 * 题库搜索 Mock
 */
export const mockSearchQbank = (keyword: string, pageNo: number = 1, pageSize: number = 10) => {
  const lowerKeyword = keyword.toLowerCase()
  const list = mockQbankSearchResults.filter(
    item =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.summary?.toLowerCase().includes(lowerKeyword)
  )

  const total = list.length
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize

  return {
    list: list.slice(start, end),
    total,
    pageNo,
    pageSize,
  }
}

/**
 * 题目搜索 Mock
 */
export const mockSearchQuestion = (keyword: string, pageNo: number = 1, pageSize: number = 10) => {
  const lowerKeyword = keyword.toLowerCase()
  const list = mockQuestionSearchResults.filter(
    item =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.summary?.toLowerCase().includes(lowerKeyword)
  )

  const total = list.length
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize

  return {
    list: list.slice(start, end),
    total,
    pageNo,
    pageSize,
  }
}

/**
 * 文章搜索 Mock
 */
export const mockSearchArticle = (keyword: string, pageNo: number = 1, pageSize: number = 10) => {
  const lowerKeyword = keyword.toLowerCase()
  const list = mockArticleSearchResults.filter(
    item =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.summary?.toLowerCase().includes(lowerKeyword)
  )

  const total = list.length
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize

  return {
    list: list.slice(start, end),
    total,
    pageNo,
    pageSize,
  }
}
