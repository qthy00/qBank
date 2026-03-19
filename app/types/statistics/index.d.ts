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

/**
 * 知识点掌握程度
 */
export interface KnowledgePointVO {
  /* 知识点ID */
  id: number
  /* 知识点名称 */
  name: string
  /* 所属科目 */
  subjectName: string
  /* 掌握程度（0-100）*/
  mastery: number
  /* 做题数量 */
  questionCount: number
  /* 正确数量 */
  correctCount: number
  /* 正确率 */
  accuracy: number
}

/**
 * 章节正确率
 */
export interface ChapterAccuracyVO {
  /* 章节ID */
  chapterId: number
  /* 章节名称 */
  chapterName: string
  /* 所属科目 */
  subjectName: string
  /* 正确率 */
  accuracy: number
  /* 做题数量 */
  totalCount: number
  /* 正确数量 */
  correctCount: number
  /* 章节进度（百分比）*/
  progress: number
}

/**
 * 薄弱知识点
 */
export interface WeakPointVO {
  /* 知识点ID */
  id: number
  /* 知识点名称 */
  name: string
  /* 所属科目 */
  subjectName: string
  /* 正确率 */
  accuracy: number
  /* 推荐优先级（1-5，越高越优先）*/
  priority: number
  /* 推荐理由 */
  reason: string
  /* 推荐练习数量 */
  recommendCount: number
}

/**
 * 学习建议
 */
export interface StudySuggestionVO {
  /* 建议类型：strength-优势, weakness-薄弱, habit-习惯, goal-目标 */
  type: 'strength' | 'weakness' | 'habit' | 'goal'
  /* 建议标题 */
  title: string
  /* 建议内容 */
  content: string
  /* 相关数据 */
  data?: string
  /* 优先级（1-5）*/
  priority: number
}

/**
 * 能力评估报告
 */
export interface AbilityAssessmentVO {
  /* 综合评分（0-100）*/
  overallScore: number
  /* 知识点掌握程度列表 */
  knowledgePoints: KnowledgePointVO[]
  /* 章节正确率列表 */
  chapterAccuracy: ChapterAccuracyVO[]
  /* 薄弱知识点列表（已排序）*/
  weakPoints: WeakPointVO[]
  /* 学习建议列表 */
  suggestions: StudySuggestionVO[]
  /* 报告生成时间 */
  generateTime: string
  /* 数据更新时间 */
  updateTime: string
}

/**
 * 能力评估查询参数
 */
export interface AbilityAssessmentQueryReqVO {
  /* 科目ID（可选，不传则查询全部）*/
  subjectId?: number
  /* 时间范围：week-近7天，month-近30天，all-全部 */
  timeRange?: 'week' | 'month' | 'all'
}
