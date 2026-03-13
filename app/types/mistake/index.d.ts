/**
 * 错题本相关类型定义
 */

import type { QuestionVO } from './index'

/**
 * 错题查询请求
 */
export interface MistakeQueryReqVO {
  /** 分类ID */
  categoryId?: number
  /** 科目ID */
  subjectId?: number
  /** 章节ID */
  chapterId?: number
  /** 题型 */
  questionType?: number
  /** 难度 */
  difficulty?: number
  /** 是否已掌握 */
  isMastered?: boolean
  /** 关键词搜索 */
  keyword?: string
  /** 页码 */
  page?: number
  /** 每页数量 */
  limit?: number
}

/**
 * 错题信息
 */
export interface MistakeVO {
  /** 错题记录ID */
  id: number
  /** 题目ID */
  questionId: number
  /** 题目信息 */
  question?: QuestionVO
  /** 科目ID */
  subjectId: number
  /** 科目名称 */
  subjectName?: string
  /** 章节ID */
  chapterId?: number
  /** 章节名称 */
  chapterName?: string
  /** 错误次数 */
  mistakeCount: number
  /** 最后错误时间 */
  lastMistakeTime: number
  /** 是否已掌握 */
  isMastered: boolean
  /** 掌握时间 */
  masteredTime?: number
  /** 创建时间 */
  createTime?: string
}

/**
 * 错题列表响应
 */
export interface MistakeListRespVO {
  /** 错题列表 */
  list: MistakeVO[]
  /** 总数 */
  total: number
}

/**
 * 错题统计
 */
export interface MistakeStatsVO {
  /** 错题总数 */
  totalCount: number
  /** 未掌握数量 */
  unMasteredCount: number
  /** 已掌握数量 */
  masteredCount: number
  /** 今日新增 */
  todayCount: number
  /** 本周新增 */
  weekCount: number
  /** 科目统计 */
  subjectStats: MistakeSubjectStatVO[]
  /** 题型统计 */
  typeStats: MistakeTypeStatVO[]
}

/**
 * 错题科目统计
 */
export interface MistakeSubjectStatVO {
  /** 科目ID */
  subjectId: number
  /** 科目名称 */
  subjectName: string
  /** 错题数量 */
  count: number
  /** 占比 */
  percentage: number
}

/**
 * 错题题型统计
 */
export interface MistakeTypeStatVO {
  /** 题型 */
  type: number
  /** 题型名称 */
  typeName: string
  /** 错题数量 */
  count: number
  /** 占比 */
  percentage: number
}

/**
 * 标记掌握请求
 */
export interface MarkMasteredReqVO {
  /** 题目ID */
  questionId: number
  /** 是否掌握 */
  isMastered: boolean
}

/**
 * 移除错题请求
 */
export interface RemoveMistakeReqVO {
  /** 题目ID */
  questionId: number
}

/**
 * 错题筛选条件
 */
export interface MistakeFilterVO {
  /** 分类 */
  categoryId?: number
  /** 科目 */
  subjectId?: number
  /** 章节 */
  chapterId?: number
  /** 题型 */
  questionType?: number
  /** 难度 */
  difficulty?: number
  /** 掌握状态 */
  isMastered?: boolean | null
}
