/**
 * 学习统计API封装
 */
import { httpGet } from '~/composables/useHttp'
import type {
  StudyStatisticsVO,
  StudyRecordQueryReqVO,
  StudyRecordListRespVO,
  StudyStatsOverviewVO,
  AccuracyTrendVO,
  SubjectAccuracyVO,
  StudyHeatmapItemVO,
  AbilityAssessmentVO,
  AbilityAssessmentQueryReqVO,
} from '~/types/statistics'

/* 是否使用模拟数据 */
const USE_MOCK = true

/**
 * 获取学习统计概览
 */
export const getStudyStatsOverview = async (): Promise<StudyStatsOverviewVO> => {
  if (USE_MOCK) {
    return getMockStudyStatsOverview()
  }
  return await httpGet('StudyStatsOverview', '/member/statistics/overview')
}

/**
 * 获取完整学习统计数据
 */
export const getStudyStatistics = async (): Promise<StudyStatisticsVO> => {
  if (USE_MOCK) {
    return getMockStudyStatistics()
  }
  return await httpGet('StudyStatistics', '/member/statistics/all')
}

/**
 * 获取正确率趋势
 * @param type 趋势类型：week-近7天，month-近30天
 */
export const getAccuracyTrend = async (type: 'week' | 'month' = 'week'): Promise<AccuracyTrendVO> => {
  if (USE_MOCK) {
    return getMockAccuracyTrend()
  }
  return await httpGet('AccuracyTrend', '/member/statistics/accuracy-trend', {
    query: { type },
  })
}

/**
 * 获取科目正确率分布
 */
export const getSubjectAccuracy = async (): Promise<SubjectAccuracyVO[]> => {
  if (USE_MOCK) {
    return getMockSubjectAccuracy()
  }
  return await httpGet('SubjectAccuracy', '/member/statistics/subject-accuracy')
}

/**
 * 获取学习热力图数据
 */
export const getStudyHeatmap = async (): Promise<StudyHeatmapItemVO[]> => {
  if (USE_MOCK) {
    return getMockStudyHeatmap()
  }
  return await httpGet('StudyHeatmap', '/member/statistics/heatmap')
}

/**
 * 获取学习记录列表
 * @param params 查询参数
 */
export const getStudyRecords = async (params: StudyRecordQueryReqVO): Promise<StudyRecordListRespVO> => {
  if (USE_MOCK) {
    return getMockStudyRecords(params)
  }
  return await httpGet('StudyRecords', '/member/statistics/records', { query: params })
}

/* ==================== Mock Data ==================== */

/**
 * 生成模拟学习统计概览
 */
const getMockStudyStatsOverview = (): StudyStatsOverviewVO => {
  return {
    duration: {
      today: Math.floor(Math.random() * 120) + 30,
      thisWeek: Math.floor(Math.random() * 600) + 300,
      thisMonth: Math.floor(Math.random() * 3000) + 1500,
      total: Math.floor(Math.random() * 50000) + 10000,
    },
    questionCount: {
      today: Math.floor(Math.random() * 50) + 10,
      thisWeek: Math.floor(Math.random() * 300) + 100,
      thisMonth: Math.floor(Math.random() * 1500) + 500,
      total: Math.floor(Math.random() * 10000) + 2000,
      correct: Math.floor(Math.random() * 7000) + 1500,
      incorrect: Math.floor(Math.random() * 3000) + 500,
    },
    streakDays: Math.floor(Math.random() * 30) + 1,
    studiedToday: Math.random() > 0.3,
    avgAccuracy: Math.floor(Math.random() * 30) + 65,
  }
}

/**
 * 生成模拟正确率趋势
 */
const getMockAccuracyTrend = (): AccuracyTrendVO => {
  const week: AccuracyTrendItemVO[] = []
  const month: AccuracyTrendItemVO[] = []

  /* 生成近7天数据 */
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const questionCount = Math.floor(Math.random() * 50) + 10
    const correctCount = Math.floor(questionCount * (Math.random() * 0.3 + 0.6))
    week.push({
      date: date.toISOString().split('T')[0],
      accuracy: Math.round((correctCount / questionCount) * 100),
      questionCount,
      correctCount,
    })
  }

  /* 生成近30天数据 */
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const questionCount = Math.floor(Math.random() * 50) + 10
    const correctCount = Math.floor(questionCount * (Math.random() * 0.3 + 0.6))
    month.push({
      date: date.toISOString().split('T')[0],
      accuracy: Math.round((correctCount / questionCount) * 100),
      questionCount,
      correctCount,
    })
  }

  return { week, month }
}

/**
 * 生成模拟科目正确率分布
 */
const getMockSubjectAccuracy = (): SubjectAccuracyVO[] => {
  const subjects = [
    { id: 1, name: '高等数学' },
    { id: 2, name: '线性代数' },
    { id: 3, name: '概率统计' },
    { id: 4, name: '数据结构' },
    { id: 5, name: '操作系统' },
    { id: 6, name: '计算机网络' },
    { id: 7, name: '数据库原理' },
    { id: 8, name: '英语' },
  ]

  return subjects.map((subject) => {
    const totalCount = Math.floor(Math.random() * 500) + 100
    const correctCount = Math.floor(totalCount * (Math.random() * 0.4 + 0.5))
    return {
      subjectId: subject.id,
      subjectName: subject.name,
      accuracy: Math.round((correctCount / totalCount) * 100),
      totalCount,
      correctCount,
    }
  })
}

/**
 * 生成模拟学习热力图数据
 */
const getMockStudyHeatmap = (): StudyHeatmapItemVO[] => {
  const heatmap: StudyHeatmapItemVO[] = []
  const today = new Date()

  /* 生成近一年数据 */
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    /* 随机决定是否学习（70%概率） */
    if (Math.random() > 0.3) {
      const duration = Math.floor(Math.random() * 180) + 30
      const questionCount = Math.floor(duration / 3) + Math.floor(Math.random() * 20)
      heatmap.push({
        date: date.toISOString().split('T')[0],
        duration,
        questionCount,
      })
    }
  }

  return heatmap
}

/**
 * 生成模拟学习记录
 */
const getMockStudyRecords = (params: StudyRecordQueryReqVO): StudyRecordListRespVO => {
  const page = params.page || 1
  const limit = params.limit || 10
  const total = 128
  const list: StudyRecordVO[] = []

  const subjects = ['高等数学', '线性代数', '概率统计', '数据结构', '操作系统', '计算机网络', '数据库原理']
  const contents = [
    '完成了章节练习：函数与极限',
    '进行了模拟考试：数据结构基础',
    '练习了错题本中的题目',
    '完成了每日练习任务',
    '复习了高等数学重点难点',
    '进行了专项练习：积分计算',
    '完成了历年真题练习',
  ]

  for (let i = 0; i < limit; i++) {
    const index = (page - 1) * limit + i
    if (index >= total) break

    const date = new Date()
    date.setDate(date.getDate() - index)

    const questionCount = Math.floor(Math.random() * 40) + 10
    const correctCount = Math.floor(questionCount * (Math.random() * 0.3 + 0.6))
    const duration = Math.floor(Math.random() * 120) + 20

    list.push({
      id: index + 1,
      date: date.toISOString().split('T')[0],
      duration,
      questionCount,
      correctCount,
      accuracy: Math.round((correctCount / questionCount) * 100),
      content: contents[Math.floor(Math.random() * contents.length)],
      subjects: [subjects[Math.floor(Math.random() * subjects.length)]],
    })
  }

  return { list, total }
}

/**
 * 生成模拟完整统计数据
 */
const getMockStudyStatistics = (): StudyStatisticsVO => {
  return {
    overview: getMockStudyStatsOverview(),
    accuracyTrend: getMockAccuracyTrend(),
    subjectAccuracy: getMockSubjectAccuracy(),
    heatmap: getMockStudyHeatmap(),
  }
}

/**
 * 获取能力评估报告
 * @param params 查询参数
 */
export const getAbilityAssessment = async (params?: AbilityAssessmentQueryReqVO): Promise<AbilityAssessmentVO> => {
  if (USE_MOCK) {
    return getMockAbilityAssessment(params)
  }
  return await httpGet('AbilityAssessment', '/member/statistics/ability-assessment', { query: params })
}

/**
 * 生成模拟能力评估报告
 */
const getMockAbilityAssessment = (_params?: AbilityAssessmentQueryReqVO): AbilityAssessmentVO => {
  const subjects = ['高等数学', '线性代数', '概率统计', '数据结构', '操作系统', '计算机网络', '数据库原理']
  const knowledgePoints: KnowledgePointVO[] = []
  const chapterAccuracy: ChapterAccuracyVO[] = []
  const weakPoints: WeakPointVO[] = []

  /* 生成知识点数据 */
  subjects.forEach((subject, subjectIndex) => {
    const pointCount = Math.floor(Math.random() * 5) + 3
    for (let i = 0; i < pointCount; i++) {
      const questionCount = Math.floor(Math.random() * 100) + 20
      const correctCount = Math.floor(questionCount * (Math.random() * 0.4 + 0.4))
      const accuracy = Math.round((correctCount / questionCount) * 100)
      knowledgePoints.push({
        id: subjectIndex * 100 + i,
        name: `${subject}知识点${i + 1}`,
        subjectName: subject,
        mastery: accuracy,
        questionCount,
        correctCount,
        accuracy,
      })
    }

    /* 生成章节数据 */
    const chapterCount = Math.floor(Math.random() * 4) + 2
    for (let i = 0; i < chapterCount; i++) {
      const totalCount = Math.floor(Math.random() * 80) + 20
      const correctCount = Math.floor(totalCount * (Math.random() * 0.4 + 0.4))
      chapterAccuracy.push({
        chapterId: subjectIndex * 100 + i,
        chapterName: `第${i + 1}章 ${subject}基础`,
        subjectName: subject,
        accuracy: Math.round((correctCount / totalCount) * 100),
        totalCount,
        correctCount,
        progress: Math.floor(Math.random() * 40) + 60,
      })
    }
  })

  /* 生成薄弱知识点（正确率低于60%的）*/
  knowledgePoints
    .filter((kp) => kp.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)
    .forEach((kp, index) => {
      weakPoints.push({
        id: kp.id,
        name: kp.name,
        subjectName: kp.subjectName,
        accuracy: kp.accuracy,
        priority: 5 - index,
        reason: `${kp.subjectName}中正确率较低，建议重点练习`,
        recommendCount: Math.floor(Math.random() * 20) + 10,
      })
    })

  /* 生成学习建议 */
  const suggestions: StudySuggestionVO[] = [
    {
      type: 'weakness',
      title: '重点攻克薄弱环节',
      content: '您在' + weakPoints[0]?.subjectName + '的正确率偏低，建议每天额外练习20道相关题目。',
      data: `薄弱知识点: ${weakPoints.length}个`,
      priority: 5,
    },
    {
      type: 'habit',
      title: '保持每日学习习惯',
      content: '建议每天保持至少30分钟的学习时间，有助于知识点的巩固。',
      priority: 4,
    },
    {
      type: 'strength',
      title: '发挥优势科目',
      content: '您在' + subjects[0] + '方面表现优秀，可以尝试挑战更高难度的题目。',
      priority: 3,
    },
    {
      type: 'goal',
      title: '设定阶段性目标',
      content: '建议每周完成至少3次模拟考试，检验学习效果。',
      priority: 4,
    },
  ]

  /* 计算综合评分 */
  const avgAccuracy = knowledgePoints.reduce((sum, kp) => sum + kp.accuracy, 0) / knowledgePoints.length
  const overallScore = Math.round(avgAccuracy * 0.8 + (knowledgePoints.length > 10 ? 20 : knowledgePoints.length * 2))

  return {
    overallScore: Math.min(overallScore, 100),
    knowledgePoints,
    chapterAccuracy,
    weakPoints,
    suggestions,
    generateTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  }
}
