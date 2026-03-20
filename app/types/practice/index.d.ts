/**
 * 练习记录类型定义
 */

/**
 * 练习类型枚举
 */
export type PracticeType = 'chapter' | 'sequence' | 'random' | 'daily' | 'exam'

/**
 * 练习状态枚举
 */
export type PracticeStatus = 'in_progress' | 'completed' | 'abandoned'

/**
 * 练习记录VO
 */
export interface PracticeRecordVO {
  /* 记录ID */
  id: number
  /* 题库ID */
  qbankId: number
  /* 题库名称 */
  qbankName: string
  /* 题库封面 */
  qbankCover?: string
  /* 练习类型 */
  type: PracticeType
  /* 练习类型名称 */
  typeName: string
  /* 练习状态 */
  status: PracticeStatus
  /* 状态名称 */
  statusName: string
  /* 当前做到第几题 */
  currentQuestionIndex: number
  /* 总题目数量 */
  totalQuestionCount: number
  /* 已完成题目数量 */
  completedCount: number
  /* 正确数量 */
  correctCount: number
  /* 错误数量 */
  incorrectCount: number
  /* 正确率 */
  accuracy: number
  /* 练习时长（分钟） */
  duration: number
  /* 开始时间 */
  startTime: string
  /* 最后更新时间 */
  updateTime: string
  /* 完成时间（可能为空） */
  completeTime?: string
  /* 章节名称（章节练习时有效） */
  chapterName?: string
  /* 练习模式说明 */
  modeDescription: string
}

/**
 * 练习记录查询请求VO
 */
export interface PracticeRecordQueryReqVO {
  /* 页码 */
  page?: number
  /* 每页数量 */
  limit?: number
  /* 题库ID */
  qbankId?: number
  /* 练习类型 */
  type?: PracticeType
  /* 练习状态 */
  status?: PracticeStatus
  /* 开始日期 */
  startDate?: string
  /* 结束日期 */
  endDate?: string
}

/**
 * 练习记录列表响应VO
 */
export interface PracticeRecordListRespVO {
  /* 记录列表 */
  list: PracticeRecordVO[]
  /* 总数 */
  total: number
}

/**
 * 练习统计VO
 */
export interface PracticeStatisticsVO {
  /* 总练习次数 */
  totalCount: number
  /* 进行中次数 */
  inProgressCount: number
  /* 已完成次数 */
  completedCount: number
  /* 总练习时长（分钟） */
  totalDuration: number
  /* 总做题数 */
  totalQuestions: number
  /* 平均正确率 */
  avgAccuracy: number
}

/**
 * 继续练习请求VO
 */
export interface ContinuePracticeReqVO {
  /* 练习记录ID */
  recordId: number
}

/**
 * 继续练习响应VO
 */
export interface ContinuePracticeRespVO {
  /* 是否可以继续 */
  canContinue: boolean
  /* 跳转路径 */
  redirectUrl?: string
  /* 提示信息 */
  message?: string
}
