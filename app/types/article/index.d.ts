/**
 * 资讯/文章相关类型定义
 */

/**
 * 资讯基础信息
 */
export interface ArticleDetailVO  extends ArticleVO{
  content?: string
  keywords?: string
  author?: string
  source?: string
  isTop?: boolean
  isHot?: boolean
  prevArticle?: ArticleNavVO
  nextArticle?: ArticleNavVO
}


export interface ArticleVO {
  id: number
  title: string
  summary: string
  cover?: string
  viewCount: number
  publishDate: number
  categoryId: number
  categoryName: string
  tags?: TagVO[]
}

export interface TagVO {
  id: number
  name: string
}

/**
 * 资讯列表请求参数
 */
export interface ArticleListReqVO {
  keyword?: string
  categoryId?: number
  catalogId?: number
  page?: number
  limit?: number
  tags?: number[]
  hasAttr?: string[]
}

/**
 * 资讯列表响应
 */
export interface ArticleListRespVO {
  list: ArticleVO[]
  total: number
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
