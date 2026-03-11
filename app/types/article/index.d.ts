/**
 * 资讯/文章相关类型定义
 */

/**
 * 资讯基础信息
 */
export interface ArticleVO {
  id: number
  title: string
  summary?: string
  content?: string
  coverImage?: string
  author?: string
  source?: string
  viewCount: number
  publishTime: string
  categoryId?: number
  categoryName?: string
  tags?: string[]
  isTop?: boolean
  isHot?: boolean
}

/**
 * 资讯列表请求参数
 */
export interface ArticleListReqVO {
  keyword?: string
  categoryId?: number
  page?: number
  limit?: number
}

/**
 * 资讯列表响应
 */
export interface ArticleListRespVO {
  list: ArticleVO[]
  total: number
}

/**
 * 资讯详情
 */
export interface ArticleDetailVO extends ArticleVO {
  content: string
  prevArticle?: ArticleNavVO
  nextArticle?: ArticleNavVO
}

/**
 * 资讯导航（上一篇/下一篇）
 */
export interface ArticleNavVO {
  id: number
  title: string
}

/**
 * 资讯分类
 */
export interface ArticleCategoryVO {
  id: number
  name: string
  count?: number
}
