/**
 * 帮助中心类型定义
 */

/* ==================== FAQ 相关类型 ==================== */

/**
 * FAQ分类
 */
export interface FAQCategoryVO {
  id: number
  name: string
  icon?: string
  sort: number
  questionCount: number
}

/**
 * FAQ问题
 */
export interface FAQVO {
  id: number
  categoryId: number
  categoryName: string
  question: string
  answer: string
  sort: number
  viewCount: number
  isHot: boolean
  createTime: string
}

/**
 * FAQ列表请求
 */
export interface FAQListReqVO {
  categoryId?: number
  keyword?: string
  page?: number
  pageSize?: number
}

/**
 * FAQ列表响应
 */
export interface FAQListRespVO {
  list: FAQVO[]
  total: number
}

/* ==================== 使用指南相关类型 ==================== */

/**
 * 指南分类
 */
export interface GuideCategoryVO {
  id: number
  name: string
  description?: string
  icon?: string
  sort: number
  articleCount: number
}

/**
 * 指南文章
 */
export interface GuideVO {
  id: number
  categoryId: number
  categoryName: string
  title: string
  summary?: string
  content: string
  coverImage?: string
  author: string
  viewCount: number
  sort: number
  isTop: boolean
  publishTime: string
  createTime: string
}

/**
 * 指南列表请求
 */
export interface GuideListReqVO {
  categoryId?: number
  keyword?: string
  page?: number
  pageSize?: number
}

/**
 * 指南列表响应
 */
export interface GuideListRespVO {
  list: GuideVO[]
  total: number
}

/* ==================== 搜索相关类型 ==================== */

/**
 * 帮助搜索请求
 */
export interface HelpSearchReqVO {
  keyword: string
  type?: 'all' | 'faq' | 'guide'
  page?: number
  pageSize?: number
}

/**
 * 搜索响应项
 */
export interface HelpSearchItemVO {
  id: number
  type: 'faq' | 'guide'
  title: string
  summary?: string
  categoryName: string
  url: string
}

/**
 * 帮助搜索响应
 */
export interface HelpSearchRespVO {
  list: HelpSearchItemVO[]
  total: number
}

/* ==================== 反馈相关类型 ==================== */

/**
 * 问题反馈请求
 */
export interface FeedbackReqVO {
  type: number
  typeName: string
  title: string
  content: string
  contact?: string
  images?: string[]
}

/**
 * 反馈类型
 */
export interface FeedbackTypeVO {
  id: number
  name: string
}

/* ==================== 帮助首页相关类型 ==================== */

/**
 * 帮助首页数据
 */
export interface HelpHomeVO {
  hotFAQs: FAQVO[]
  categories: FAQCategoryVO[]
  guideCategories: GuideCategoryVO[]
  recentGuides: GuideVO[]
}
