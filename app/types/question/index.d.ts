/**
 * 题目搜索模块类型定义
 * @description 题目搜索相关类型
 */

import type { QuestionVO } from '~/types/qBank'

/**
 * 题目搜索类型
 */
export type QuestionSearchType = 'all' | 'single' | 'multiple' | 'judge' | 'fill' | 'essay'

/**
 * 题目难度枚举
 */
export enum QuestionDifficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3
}

/**
 * 题目难度标签
 */
export const QuestionDifficultyMap: Record<number, string> = {
  [QuestionDifficulty.EASY]: '简单',
  [QuestionDifficulty.MEDIUM]: '中等',
  [QuestionDifficulty.HARD]: '困难'
}

/**
 * 题目类型枚举
 */
export enum QuestionTypeEnum {
  SINGLE = 1,      /* 单选题 */
  MULTIPLE = 2,    /* 多选题 */
  JUDGE = 3,       /* 判断题 */
  FILL = 4,        /* 填空题 */
  ESSAY = 5        /* 主观题 */
}

/**
 * 题目类型标签
 */
export const QuestionTypeMap: Record<number, string> = {
  [QuestionTypeEnum.SINGLE]: '单选题',
  [QuestionTypeEnum.MULTIPLE]: '多选题',
  [QuestionTypeEnum.JUDGE]: '判断题',
  [QuestionTypeEnum.FILL]: '填空题',
  [QuestionTypeEnum.ESSAY]: '主观题'
}

/**
 * 题目搜索请求参数
 */
export interface QuestionSearchReqVO {
  /* 搜索关键词 */
  keyword?: string
  /* 题型筛选: 1-单选, 2-多选, 3-判断, 4-填空, 5-主观 */
  type?: number
  /* 难度筛选: 1-简单, 2-中等, 3-困难 */
  difficulty?: number
  /* 知识点ID */
  pointId?: number
  /* 题库ID */
  qbankId?: number
  /* 分类ID */
  categoryId?: number
  /* 排序方式: newest-最新, hot-热门, difficulty_asc-难度升序, difficulty_desc-难度降序 */
  sort?: 'newest' | 'hot' | 'difficulty_asc' | 'difficulty_desc'
  /* 页码 */
  pageNo?: number
  /* 每页数量 */
  pageSize?: number
}

/**
 * 题目搜索结果项
 */
export interface QuestionSearchResultItem extends QuestionVO {
  /* 难度 */
  difficulty: number
  /* 难度名称 */
  difficultyName: string
  /* 所属题库ID */
  qbankId: number
  /* 所属题库名称 */
  qbankName: string
  /* 知识点列表 */
  pointList?: { id: number; name: string }[]
  /* 收藏状态 */
  isFavorited?: boolean
  /* 浏览次数 */
  viewCount?: number
  /* 做题次数 */
  practiceCount?: number
  /* 正确率 */
  accuracyRate?: number
  /* 创建时间 */
  createTime: string
}

/**
 * 题目搜索响应
 */
export interface QuestionSearchRespVO {
  /* 题目列表 */
  list: QuestionSearchResultItem[]
  /* 总数量 */
  total: number
  /* 当前页 */
  pageNo: number
  /* 每页数量 */
  pageSize: number
}

/**
 * 筛选选项项
 */
export interface FilterOption {
  /* 选项值 */
  value: number | string
  /* 选项标签 */
  label: string
  /* 数量统计 */
  count?: number
}

/**
 * 题目筛选条件
 */
export interface QuestionFilterVO {
  /* 题型列表 */
  types: FilterOption[]
  /* 难度列表 */
  difficulties: FilterOption[]
  /* 知识点列表 */
  points: FilterOption[]
  /* 题库列表 */
  qbanks: FilterOption[]
}

/**
 * 题目搜索历史项
 */
export interface QuestionSearchHistoryItem {
  /* 搜索ID */
  id: number
  /* 搜索关键词 */
  keyword: string
  /* 搜索时间 */
  searchTime: string
  /* 筛选条件 */
  filters?: {
    type?: number
    difficulty?: number
    pointId?: number
  }
}

/**
 * 热门搜索项
 */
export interface QuestionHotSearchItem {
  /* 关键词 */
  keyword: string
  /* 搜索次数 */
  searchCount: number
}

/**
 * 题目收藏状态变更请求
 */
export interface QuestionFavoriteToggleReqVO {
  /* 题目ID */
  questionId: number
  /* 收藏状态 */
  isFavorited: boolean
}

/**
 * 题目搜索统计
 */
export interface QuestionSearchStatisticVO {
  /* 搜索结果总数 */
  total: number
  /* 各题型数量 */
  typeCounts: Record<number, number>
  /* 各难度数量 */
  difficultyCounts: Record<number, number>
}
