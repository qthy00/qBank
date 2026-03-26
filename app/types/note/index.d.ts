/**
 * 学习笔记类型定义
 * @module types/note
 */

/**
 * 笔记视图对象
 */
export interface NoteVO {
  /** 笔记ID */
  id: number
  /** 用户ID */
  userId: number
  /** 关联题目ID */
  questionId: number
  /** 关联题库ID */
  qbankId: number
  /** 题库名称 */
  qbankName: string
  /** 题目内容（摘要） */
  questionContent: string
  /** 笔记内容 */
  content: string
  /** 笔记标签（逗号分隔） */
  tags: string
  /** 标签数组（前端处理） */
  tagList: string[]
  /** 是否公开 */
  isPublic: boolean
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 笔记列表查询请求
 */
export interface NoteListQueryReqVO {
  /** 页码 */
  page?: number
  /** 每页数量 */
  limit?: number
  /** 题库ID筛选 */
  qbankId?: number
  /** 关键词搜索 */
  keyword?: string
  /** 标签筛选 */
  tag?: string
}

/**
 * 笔记列表响应
 */
export interface NoteListRespVO {
  /** 笔记列表 */
  list: NoteVO[]
  /** 总数量 */
  total: number
}

/**
 * 笔记创建请求
 */
export interface NoteCreateReqVO {
  /** 关联题目ID */
  questionId: number
  /** 关联题库ID */
  qbankId: number
  /** 笔记内容 */
  content: string
  /** 笔记标签 */
  tags?: string
  /** 是否公开 */
  isPublic?: boolean
}

/**
 * 笔记更新请求
 */
export interface NoteUpdateReqVO {
  /** 笔记ID */
  id: number
  /** 笔记内容 */
  content: string
  /** 笔记标签 */
  tags?: string
  /** 是否公开 */
  isPublic?: boolean
}

/**
 * 笔记删除请求
 */
export interface NoteDeleteReqVO {
  /** 笔记ID */
  id: number
}

/**
 * 笔记统计响应
 */
export interface NoteStatisticsRespVO {
  /** 笔记总数 */
  totalCount: number
  /** 今日新增 */
  todayCount: number
  /** 本周新增 */
  weekCount: number
  /** 标签数量 */
  tagCount: number
}

/**
 * 笔记标签统计
 */
export interface NoteTagStatVO {
  /** 标签名称 */
  tag: string
  /** 使用该标签的笔记数量 */
  count: number
}
