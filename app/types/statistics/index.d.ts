/**
 * 学习统计类型定义
 */

/**
 * 学习时长统计
 */
export interface StudyDurationVO {
  /* 今日学习时长（分钟） */
  today: number
  /* 本周学习时长（分钟） */
  thisWeek: number
  /* 本月学习时长（分钟） */
  thisMonth: number
  /* 总计学习时长（分钟） */
  total: number
}

/**
 * 正确率趋势数据项
 */
export interface AccuracyTrendItemVO {
  /* 日期 */
  date: string
  /* 正确率（百分比） */
  accuracy: number
  /* 做题数量 */
  questionCount: number
  /* 正确数量 */
  correctCount: number
}

/**
 * 正确率趋势
 */
export interface AccuracyTrendVO {
  /* 近7天数据 */
  week: AccuracyTrendItemVO[]
  /* 近30天数据 */
  month: AccuracyTrendItemVO[]
}

/**
 * 做题数量统计
 */
export interface QuestionCountVO {
  /* 今日做题数 */
  today: number
  /* 本周做题数 */
  thisWeek: number
  /* 本月做题数 */
  thisMonth: number
  /* 总计做题数 */
  total: number
  /* 正确数 */
  correct: number
  /* 错误数 */
  incorrect: number
}

/**
 * 科目正确率分布
 */
export interface SubjectAccuracyVO {
  /* 科目ID */
  subjectId: number
  /* 科目名称 */
  subjectName: string
  /* 正确率 */
  accuracy: number
  /* 做题数量 */
  totalCount: number
  /* 正确数量 */
  correctCount: number
}

/**
 * 学习热力图数据项
 */
export interface StudyHeatmapItemVO {
  /* 日期 */
  date: string
  /* 学习时长（分钟） */
  duration: number
  /* 做题数量 */
  questionCount: number
}

/**
 * 学习统计概览
 */
export interface StudyStatsOverviewVO {
  /* 学习时长统计 */
  duration: StudyDurationVO
  /* 做题数量统计 */
  questionCount: QuestionCountVO
  /* 连续学习天数 */
  streakDays: number
  /* 今日是否已学习 */
  studiedToday: boolean
  /* 平均正确率 */
  avgAccuracy: number
}

/**
 * 完整学习统计数据
 */
export interface StudyStatisticsVO {
  /* 概览数据 */
  overview: StudyStatsOverviewVO
  /* 正确率趋势 */
  accuracyTrend: AccuracyTrendVO
  /* 科目正确率分布 */
  subjectAccuracy: SubjectAccuracyVO[]
  /* 学习热力图数据（近一年） */
  heatmap: StudyHeatmapItemVO[]
}

/**
 * 学习记录查询参数
 */
export interface StudyRecordQueryReqVO {
  /* 开始日期 */
  startDate?: string
  /* 结束日期 */
  endDate?: string
  /* 科目ID */
  subjectId?: number
  /* 页码 */
  page?: number
  /* 每页数量 */
  limit?: number
}

/**
 * 学习记录
 */
export interface StudyRecordVO {
  /* 记录ID */
  id: number
  /* 学习日期 */
  date: string
  /* 学习时长（分钟） */
  duration: number
  /* 做题数量 */
  questionCount: number
  /* 正确数量 */
  correctCount: number
  /* 正确率 */
  accuracy: number
  /* 学习内容摘要 */
  content: string
  /* 科目列表 */
  subjects: string[]
}

/**
 * 学习记录列表响应
 */
export interface StudyRecordListRespVO {
  /* 记录列表 */
  list: StudyRecordVO[]
  /* 总数 */
  total: number
}
