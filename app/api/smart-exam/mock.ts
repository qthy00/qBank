import type {
  WeakPoint,
  WeakPointQuery,
  WeakPointListResp,
  SmartExamParams,
  SmartExamResult,
  SmartPracticeRecord,
  SmartPracticeQuery,
  SmartPracticeListResp
} from '~/types/smart-exam'

/**
 * 智能组卷 Mock 数据
 */

/* ==================== 薄弱知识点 Mock 数据 ==================== */

export const mockWeakPoints: WeakPoint[] = [
  {
    knowledgePointId: 1,
    knowledgePointName: '高等数学-微积分基础',
    parentId: 10,
    parentName: '高等数学',
    wrongCount: 15,
    totalCount: 20,
    accuracy: 25,
    weakLevel: 'high'
  },
  {
    knowledgePointId: 2,
    knowledgePointName: '线性代数-矩阵运算',
    parentId: 11,
    parentName: '线性代数',
    wrongCount: 12,
    totalCount: 18,
    accuracy: 33.3,
    weakLevel: 'high'
  },
  {
    knowledgePointId: 3,
    knowledgePointName: '概率论-随机变量',
    parentId: 12,
    parentName: '概率论与数理统计',
    wrongCount: 8,
    totalCount: 15,
    accuracy: 46.7,
    weakLevel: 'high'
  },
  {
    knowledgePointId: 4,
    knowledgePointName: '高等数学-极限计算',
    parentId: 10,
    parentName: '高等数学',
    wrongCount: 10,
    totalCount: 20,
    accuracy: 50,
    weakLevel: 'medium'
  },
  {
    knowledgePointId: 5,
    knowledgePointName: '线性代数-向量空间',
    parentId: 11,
    parentName: '线性代数',
    wrongCount: 7,
    totalCount: 15,
    accuracy: 53.3,
    weakLevel: 'medium'
  },
  {
    knowledgePointId: 6,
    knowledgePointName: '概率论-概率分布',
    parentId: 12,
    parentName: '概率论与数理统计',
    wrongCount: 6,
    totalCount: 15,
    accuracy: 60,
    weakLevel: 'medium'
  },
  {
    knowledgePointId: 7,
    knowledgePointName: '高等数学-导数应用',
    parentId: 10,
    parentName: '高等数学',
    wrongCount: 5,
    totalCount: 15,
    accuracy: 66.7,
    weakLevel: 'medium'
  },
  {
    knowledgePointId: 8,
    knowledgePointName: '线性代数-特征值',
    parentId: 11,
    parentName: '线性代数',
    wrongCount: 4,
    totalCount: 15,
    accuracy: 73.3,
    weakLevel: 'low'
  },
  {
    knowledgePointId: 9,
    knowledgePointName: '概率论-假设检验',
    parentId: 12,
    parentName: '概率论与数理统计',
    wrongCount: 3,
    totalCount: 12,
    accuracy: 75,
    weakLevel: 'low'
  },
  {
    knowledgePointId: 10,
    knowledgePointName: '高等数学-积分应用',
    parentId: 10,
    parentName: '高等数学',
    wrongCount: 2,
    totalCount: 10,
    accuracy: 80,
    weakLevel: 'low'
  }
]

/**
 * 获取薄弱知识点列表（Mock）
 * @param query 查询参数
 */
export const getMockWeakPointList = (query?: WeakPointQuery): WeakPointListResp => {
  let list = [...mockWeakPoints]

  /* 按薄弱程度筛选 */
  if (query?.weakLevel && query.weakLevel.length > 0) {
    list = list.filter(item => query.weakLevel!.includes(item.weakLevel))
  }

  /* 按父级分类筛选 */
  if (query?.parentId) {
    list = list.filter(item => item.parentId === query.parentId)
  }

  /* 按正确率排序（从低到高） */
  list.sort((a, b) => a.accuracy - b.accuracy)

  const highCount = mockWeakPoints.filter(item => item.weakLevel === 'high').length
  const mediumCount = mockWeakPoints.filter(item => item.weakLevel === 'medium').length
  const lowCount = mockWeakPoints.filter(item => item.weakLevel === 'low').length

  return {
    list,
    total: list.length,
    highCount,
    mediumCount,
    lowCount
  }
}

/* ==================== 智能组卷 Mock 数据 ==================== */

/**
 * 生成智能组卷结果
 * @param params 组卷参数
 */
export const generateMockSmartExam = (params: SmartExamParams): SmartExamResult => {
  const questions = generateMockQuestions(params)

  /* 统计各类型题目数量 */
  const singleCount = questions.filter(q => q.type === 1).length
  const multiCount = questions.filter(q => q.type === 2).length
  const judgeCount = questions.filter(q => q.type === 3).length
  const fillCount = questions.filter(q => q.type === 4).length

  /* 统计各难度题目数量 */
  const easyCount = questions.filter(q => q.difficulty === 1).length
  const mediumCount = questions.filter(q => q.difficulty === 2).length
  const hardCount = questions.filter(q => q.difficulty === 3).length

  /* 统计覆盖的薄弱知识点 */
  const knowledgePointIds = new Set(questions.map(q => q.knowledgePointId))

  return {
    examId: Date.now(),
    examName: `智能组卷-${new Date().toLocaleDateString()}`,
    questions,
    stats: {
      totalCount: questions.length,
      singleCount,
      multiCount,
      judgeCount,
      fillCount,
      easyCount,
      mediumCount,
      hardCount,
      weakPointCount: knowledgePointIds.size,
      estimatedTime: Math.ceil(questions.length * 1.5)
    }
  }
}

/**
 * 生成Mock题目
 * @param params 组卷参数
 */
const generateMockQuestions = (params: SmartExamParams) => {
  const questions = []
  const typeNames: Record<number, string> = { 1: '单选题', 2: '多选题', 3: '判断题', 4: '填空题' }
  const difficultyNames: Record<number, string> = { 1: '简单', 2: '中等', 3: '困难' }

  /* 薄弱知识点列表 */
  const weakPoints = mockWeakPoints.filter(
    wp => params.weakLevel.includes(wp.weakLevel)
  )

  for (let i = 1; i <= params.questionCount; i++) {
    /* 随机选择一个薄弱知识点 */
    const weakPoint = weakPoints[Math.floor(Math.random() * weakPoints.length)]

    /* 随机选择题型（在允许的范围内） */
    const type = params.questionTypes[Math.floor(Math.random() * params.questionTypes.length)]

    /* 随机选择难度（在允许的范围内） */
    const difficulty = params.difficulty[Math.floor(Math.random() * params.difficulty.length)]

    const question: SmartExamResult['questions'][0] = {
      id: 1000 + i,
      number: i,
      content: `${typeNames[type]}第${i}题：这是一个针对"${weakPoint.knowledgePointName}"知识点的练习题目，请认真作答。`,
      type,
      typeName: typeNames[type],
      difficulty,
      difficultyName: difficultyNames[difficulty],
      options: type === 3 ? undefined : generateMockOptions(type),
      answer: type === 1 ? 'A' : type === 2 ? 'AB' : type === 3 ? '正确' : '填空答案',
      analysis: `本题考查"${weakPoint.knowledgePointName}"知识点，正确答案是${type === 1 ? 'A' : type === 2 ? 'AB' : type === 3 ? '正确' : '填空答案'}。`,
      knowledgePointId: weakPoint.knowledgePointId,
      knowledgePointName: weakPoint.knowledgePointName,
      knowledgePointAccuracy: weakPoint.accuracy
    }

    questions.push(question)
  }

  return questions
}

/**
 * 生成Mock选项
 * @param type 题型
 */
const generateMockOptions = (type: number) => {
  if (type === 1) {
    /* 单选题 */
    return [
      { label: 'A', content: '选项A的内容' },
      { label: 'B', content: '选项B的内容' },
      { label: 'C', content: '选项C的内容' },
      { label: 'D', content: '选项D的内容' }
    ]
  } else if (type === 2) {
    /* 多选题 */
    return [
      { label: 'A', content: '选项A的内容' },
      { label: 'B', content: '选项B的内容' },
      { label: 'C', content: '选项C的内容' },
      { label: 'D', content: '选项D的内容' }
    ]
  }
  return undefined
}

/* ==================== 智能练习记录 Mock 数据 ==================== */

export const mockSmartPracticeRecords: SmartPracticeRecord[] = [
  {
    id: 1,
    examId: 10001,
    examName: '智能组卷-2026-03-20',
    questionCount: 20,
    correctCount: 12,
    wrongCount: 8,
    accuracy: 60,
    duration: 1800,
    createTime: '2026-03-20 14:30:00'
  },
  {
    id: 2,
    examId: 10002,
    examName: '智能组卷-2026-03-19',
    questionCount: 20,
    correctCount: 15,
    wrongCount: 5,
    accuracy: 75,
    duration: 1500,
    createTime: '2026-03-19 16:00:00'
  },
  {
    id: 3,
    examId: 10003,
    examName: '智能组卷-2026-03-18',
    questionCount: 30,
    correctCount: 20,
    wrongCount: 10,
    accuracy: 66.7,
    duration: 2400,
    createTime: '2026-03-18 10:30:00'
  }
]

/**
 * 获取智能练习记录列表（Mock）
 * @param query 查询参数
 */
export const getMockSmartPracticeList = (query?: SmartPracticeQuery): SmartPracticeListResp => {
  const page = query?.page || 1
  const limit = query?.limit || 10

  let list = [...mockSmartPracticeRecords]

  /* 按时间倒序 */
  list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

  /* 分页 */
  const total = list.length
  const start = (page - 1) * limit
  const end = start + limit
  list = list.slice(start, end)

  return {
    list,
    total
  }
}

/**
 * 获取智能练习记录详情（Mock）
 * @param id 记录ID
 */
export const getMockSmartPracticeDetail = (id: number): SmartPracticeRecord | null => {
  return mockSmartPracticeRecords.find(item => item.id === id) || null
}
