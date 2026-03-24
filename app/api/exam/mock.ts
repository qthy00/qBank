import type {
  WeakKnowledgePoint,
  SmartPaperConfigRespVO,
  SmartPaperRespVO,
  SmartPaperHistoryVO,
  SmartPaperReqVO,
} from '~/types/exam/smart'
import type { QuestionVO } from '~/types/qBank'

/**
 * 智能组卷 Mock 数据
 */

/* ==================== 薄弱知识点数据 ==================== */

/**
 * 薄弱知识点列表
 */
export const mockWeakPoints: WeakKnowledgePoint[] = [
  {
    id: 1,
    name: '高等数学-极限',
    subjectId: 1,
    subjectName: '高等数学',
    accuracy: 45,
    priority: 5,
    totalQuestions: 50,
    completedQuestions: 20,
    wrongQuestions: 11,
  },
  {
    id: 2,
    name: '高等数学-导数',
    subjectId: 1,
    subjectName: '高等数学',
    accuracy: 52,
    priority: 4,
    totalQuestions: 45,
    completedQuestions: 25,
    wrongQuestions: 12,
  },
  {
    id: 3,
    name: '线性代数-矩阵',
    subjectId: 2,
    subjectName: '线性代数',
    accuracy: 38,
    priority: 5,
    totalQuestions: 40,
    completedQuestions: 21,
    wrongQuestions: 13,
  },
  {
    id: 4,
    name: '概率论-分布',
    subjectId: 3,
    subjectName: '概率论',
    accuracy: 48,
    priority: 4,
    totalQuestions: 35,
    completedQuestions: 25,
    wrongQuestions: 13,
  },
  {
    id: 5,
    name: '高等数学-积分',
    subjectId: 1,
    subjectName: '高等数学',
    accuracy: 55,
    priority: 3,
    totalQuestions: 60,
    completedQuestions: 40,
    wrongQuestions: 18,
  },
  {
    id: 6,
    name: '线性代数-向量',
    subjectId: 2,
    subjectName: '线性代数',
    accuracy: 62,
    priority: 2,
    totalQuestions: 30,
    completedQuestions: 21,
    wrongQuestions: 8,
  },
  {
    id: 7,
    name: '概率论-期望方差',
    subjectId: 3,
    subjectName: '概率论',
    accuracy: 58,
    priority: 3,
    totalQuestions: 28,
    completedQuestions: 19,
    wrongQuestions: 8,
  },
  {
    id: 8,
    name: '高等数学-级数',
    subjectId: 1,
    subjectName: '高等数学',
    accuracy: 35,
    priority: 5,
    totalQuestions: 25,
    completedQuestions: 20,
    wrongQuestions: 13,
  },
]

/* ==================== Mock 题目数据 ==================== */

/**
 * 生成 Mock 题目
 */
const generateMockQuestions = (count: number, difficulty: number): QuestionVO[] => {
  const questions: QuestionVO[] = []
  const types = [
    { type: 0, typeName: '单选题', score: 1 },
    { type: 1, typeName: '多选题', score: 2 },
    { type: 3, typeName: '判断题', score: 1 },
  ]

  for (let i = 0; i < count; i++) {
    const typeConfig = types[Math.floor(Math.random() * types.length)]
    const pointIndex = Math.floor(Math.random() * mockWeakPoints.length)
    const point = mockWeakPoints[pointIndex]

    questions.push({
      id: 10000 + i,
      type: typeConfig.type,
      typeName: typeConfig.typeName,
      content: `第${i + 1}题：这是一道关于${point.name}的测试题目，难度等级${difficulty}`,
      options: [
        { label: 'A', content: '选项A内容' },
        { label: 'B', content: '选项B内容' },
        { label: 'C', content: '选项C内容' },
        { label: 'D', content: '选项D内容' },
      ],
      answer: 'A',
      analysis: `本题考查${point.name}知识点，正确答案是A。`,
      score: typeConfig.score,
      difficulty: difficulty,
      difficultyName: ['简单', '较易', '中等', '较难', '困难'][difficulty - 1],
      knowledgePointId: point.id,
      knowledgePointName: point.name,
      subjectId: point.subjectId,
      subjectName: point.subjectName,
    })
  }

  return questions
}

/* ==================== 查询函数 ==================== */

/**
 * 获取薄弱知识点列表（Mock）
 * @param params 查询参数
 */
export const getMockWeakPoints = (params?: {
  subjectId?: number
  limit?: number
}): WeakKnowledgePoint[] => {
  let list = [...mockWeakPoints]

  /* 按科目筛选 */
  if (params?.subjectId) {
    list = list.filter(item => item.subjectId === params.subjectId)
  }

  /* 按优先级排序 */
  list.sort((a, b) => b.priority - a.priority)

  /* 限制数量 */
  if (params?.limit) {
    list = list.slice(0, params.limit)
  }

  return list
}

/**
 * 获取智能组卷配置（Mock）
 * @param qbankId 题库ID
 * @param subjectId 科目ID
 */
export const getMockSmartPaperConfig = (
  qbankId?: number,
  subjectId?: number
): SmartPaperConfigRespVO => {
  const weakPoints = getMockWeakPoints({ subjectId, limit: 8 })

  /* 计算推荐参数 */
  const avgAccuracy = weakPoints.reduce((sum, p) => sum + p.accuracy, 0) / weakPoints.length
  const recommendCount = Math.min(50, weakPoints.length * 5)
  const recommendDuration = Math.ceil(recommendCount * 2.5)
  const suggestDifficulty = avgAccuracy < 40 ? 2 : avgAccuracy < 60 ? 3 : 4

  return {
    weakPoints,
    recommendCount,
    recommendDuration,
    suggestDifficulty,
  }
}

/**
 * 生成智能试卷（Mock）
 * @param data 组卷配置
 */
export const generateMockSmartPaper = (
  data: SmartPaperReqVO
): SmartPaperRespVO => {
  const { questionCount, difficulty, knowledgePointIds } = data

  /* 生成题目 */
  const questions = generateMockQuestions(questionCount, difficulty || 3)

  /* 计算知识点覆盖 */
  const pointMap = new Map<number, { id: number; name: string; questionCount: number }>()
  questions.forEach(q => {
    if (q.knowledgePointId) {
      const existing = pointMap.get(q.knowledgePointId)
      if (existing) {
        existing.questionCount++
      } else {
        pointMap.set(q.knowledgePointId, {
          id: q.knowledgePointId,
          name: q.knowledgePointName || '',
          questionCount: 1,
        })
      }
    }
  })

  const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0)

  return {
    paperId: Date.now(),
    title: `智能组卷-${new Date().toLocaleDateString()}`,
    durationMinutes: data.durationMinutes,
    totalScore,
    questionCount,
    knowledgePoints: Array.from(pointMap.values()),
    questions,
  }
}

/**
 * 智能组卷历史记录
 */
export const mockSmartPaperHistory: SmartPaperHistoryVO[] = [
  {
    id: 1,
    paperId: 1001,
    title: '智能组卷-2026/03/20',
    qbankName: '高等数学题库',
    questionCount: 30,
    score: 65,
    totalScore: 100,
    accuracy: 65,
    spendTime: 2400,
    knowledgePointCount: 5,
    status: 1,
    submitTime: '2026-03-20 15:30:00',
  },
  {
    id: 2,
    paperId: 1002,
    title: '智能组卷-2026/03/18',
    qbankName: '线性代数题库',
    questionCount: 25,
    score: 48,
    totalScore: 100,
    accuracy: 48,
    spendTime: 1800,
    knowledgePointCount: 4,
    status: 1,
    submitTime: '2026-03-18 14:20:00',
  },
  {
    id: 3,
    paperId: 1003,
    title: '智能组卷-2026/03/15',
    qbankName: '概率论题库',
    questionCount: 20,
    score: 72,
    totalScore: 100,
    accuracy: 72,
    spendTime: 1500,
    knowledgePointCount: 3,
    status: 1,
    submitTime: '2026-03-15 10:15:00',
  },
]

/**
 * 获取智能组卷历史列表（Mock）
 * @param params 查询参数
 */
export const getMockSmartPaperHistory = (params?: {
  page?: number
  pageSize?: number
}): { list: SmartPaperHistoryVO[]; total: number } => {
  const { page = 1, pageSize = 10 } = params || {}

  const list = [...mockSmartPaperHistory]
  const total = list.length

  /* 分页 */
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedList = list.slice(start, end)

  return {
    list: paginatedList,
    total,
  }
}
