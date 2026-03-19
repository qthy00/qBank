/**
 * 搜索模块类型定义
 * @description 全局搜索相关类型
 */

/**
 * 搜索类型枚举
 */
export type SearchType = 'all' | 'qbank' | 'question' | 'article'

/**
 * 搜索结果项类型
 */
export type SearchResultType = 'qbank' | 'question' | 'article'

/**
 * 搜索请求参数
 */
export interface SearchReqVO {
  /* 搜索关键词 */
  keyword: string
  /* 搜索类型: all-全部, qbank-题库, question-题目, article-文章 */
  type?: SearchType
  /* 分类ID */
  categoryId?: number
  /* 页码 */
  pageNo?: number
  /* 每页数量 */
  pageSize?: number
}

/**
 * 搜索结果项基础接口
 */
export interface SearchResultItem {
  /* 结果ID */
  id: number
  /* 结果类型 */
  type: SearchResultType
  /* 标题 */
  title: string
  /* 摘要/描述 */
  summary?: string
  /* 分类名称 */
  categoryName?: string
  /* 创建时间 */
  createTime?: string
}

/**
 * 题库搜索结果
 */
export interface QbankSearchResult extends SearchResultItem {
  type: 'qbank'
  /* 题库名称 */
  name: string
  /* 题目数量 */
  questionCount: number
  /* 价格 */
  price?: number
  /* 封面图 */
  coverUrl?: string
}

/**
 * 题目搜索结果
 */
export interface QuestionSearchResult extends SearchResultItem {
  type: 'question'
  /* 题目类型 */
  questionType: number
  /* 题型名称 */
  typeName: string
  /* 难度 */
  difficulty?: number
  /* 所属题库ID */
  qbankId?: number
  /* 所属题库名称 */
  qbankName?: string
}

/**
 * 文章搜索结果
 */
export interface ArticleSearchResult extends SearchResultItem {
  type: 'article'
  /* 文章标题 */
  title: string
  /* 作者 */
  author?: string
  /* 浏览量 */
  viewCount?: number
  /* 封面图 */
  coverUrl?: string
}

/**
 * 搜索结果分组
 */
export interface SearchResultGroup {
  /* 分组类型 */
  type: SearchResultType
  /* 分组名称 */
  name: string
  /* 结果列表 */
  items: SearchResultItem[]
  /* 总数 */
  total: number
}

/**
 * 搜索响应
 */
export interface SearchRespVO {
  /* 搜索结果列表 */
  list: SearchResultItem[]
  /* 分组结果（按类型分组） */
  groups?: SearchResultGroup[]
  /* 总数量 */
  total: number
  /* 当前页 */
  pageNo: number
  /* 每页数量 */
  pageSize: number
}

/**
 * 搜索建议项
 */
export interface SearchSuggestItem {
  /* 建议文本 */
  text: string
  /* 建议类型 */
  type: SearchResultType
  /* 高亮文本 */
  highlightText?: string
  /* 搜索次数 */
  searchCount?: number
}

/**
 * 搜索建议响应
 */
export interface SearchSuggestRespVO {
  /* 建议列表 */
  list: SearchSuggestItem[]
}

/**
 * 热门搜索项
 */
export interface HotSearchItem {
  /* 关键词 */
  keyword: string
  /* 搜索次数 */
  searchCount: number
  /* 排序 */
  sort: number
}

/**
 * 搜索历史记录（本地存储）
 */
export interface SearchHistoryItem {
  /* 关键词 */
  keyword: string
  /* 搜索时间 */
  timestamp: number
  /* 搜索类型 */
  type?: SearchType
}

/**
 * 搜索筛选条件
 */
export interface SearchFilter {
  /* 分类ID */
  categoryId?: number
  /* 难度 */
  difficulty?: number
  /* 价格区间 */
  priceRange?: [number, number]
  /* 排序方式 */
  sort?: 'relevance' | 'newest' | 'popular' | 'price_asc' | 'price_desc'
}

/**
 * 高级搜索请求
 */
export interface AdvancedSearchReqVO extends SearchReqVO {
  /* 筛选条件 */
  filter?: SearchFilter
}
