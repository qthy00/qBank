/**
 * 文档下载相关类型定义
 */

/**
 * 文档类型
 */
export type DocumentType = 'real' | 'material'

/**
 * 文档基础信息
 */
export interface DocumentVO {
  id: number
  title: string
  summary?: string
  description?: string
  coverImage?: string
  fileUrl?: string
  fileSize?: number
  fileType?: string
  downloadCount: number
  viewCount: number
  docType: DocumentType
  docTypeName?: string
  categoryId?: number
  categoryName?: string
  examType?: string
  year?: number
  pages?: number
  isVip?: boolean
  isFree?: boolean
  price?: number
  tags?: string[]
  createTime?: string
  updateTime?: string
}

/**
 * 文档列表请求参数
 */
export interface DocumentListReqVO {
  keyword?: string
  docType?: DocumentType
  categoryId?: number
  examType?: string
  year?: number
  isFree?: boolean
  page?: number
  limit?: number
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
 * 考试类型
 */
export interface ExamTypeVO {
  code: string
  name: string
  count?: number
}

/**
 * 年份筛选
 */
export interface YearOptionVO {
  year: number
  count?: number
}
