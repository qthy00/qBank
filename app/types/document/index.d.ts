/**
 * 文档下载相关类型定义
 */

/**
 * 文档类型
 */
export type DocumentType = 'real' | 'material'

/**
 * 文档等级
 */
export type DocumentLevel = 'free' | 'premium' | 'vip'

/**
 * 文档状态
 */
export type DocumentStatus = 'online' | 'preview' | 'purchased'

/**
 * 文档基础信息
 */
export interface DocumentVO {
  id: number
  title: string
  cover?: string
  summary?: string
  fileSize: number
  fileType?: DocumentType
  downloadCount: number
  categoryId?: number
  categoryName?: string
  /* 等级：free-免费, premium-精品, vip-VIP专享 */
  payMode: number
  downloadPrice?: number
}

export interface DocumentDetailVO extends DocumentVO{
  keywords?: string
  publishDate: number
}
/**
 * 文档列表请求参数
 */
export interface DocumentListReqVO {
  keyword?: string
  catalogId?: number
  tags?: number[]
  /* 排序方式：comprehensive-综合, newest-最新, downloads-下载最多, price_asc-价格从低到高, price_desc-价格从高到低 */
  sortType?: string
  pageNo: number
  pageSize: number
}

/**
 * 文档列表响应
 */
export interface DocumentListRespVO {
  list: DocumentVO[]
  total: number
}

/**
 * 文档详情
 */
export interface DocumentDetailVO extends DocumentVO {
  content?: string
  previewImages?: string[]
  relatedDocuments?: DocumentVO[]
  pageCount?: number
}

/**
 * 文档预览响应
 */
export interface DocumentPreviewVO {
  totalPages: number
  images: string[]
  payMode: number
  hasFullAccess: boolean
  previewLimit: number | null
}

/**
 * 文档分类
 */
export interface DocumentCategoryVO {
  id: number
  name: string
  icon?: string
  count?: number
  docType?: DocumentType
}

/**
 * 大类（建筑工程、财会考试等）
 */
export interface MajorVO {
  code: string
  name: string
  icon?: string
  count?: number
}

/**
 * 考试类型
 */
export interface ExamTypeVO {
  code: string
  name: string
  /* 所属大类编码 */
  majorCode?: string
  count?: number
}

/**
 * 年份筛选
 */
export interface TagOptionVO {
  id: number
  word?: string
}

/**
 * 等级选项
 */
export interface LevelOptionVO {
  value: DocumentLevel
  label: string
  count?: number
}

/**
 * 资料类型选项
 */
export interface MaterialTypeOptionVO {
  value: string
  label: string
  count?: number
}

/**
 * 状态选项
 */
export interface StatusOptionVO {
  value: DocumentStatus
  label: string
  count?: number
}
