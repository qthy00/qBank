/**
 * 练习记录API封装
 */
import { httpGet, httpPost } from '~/composables/useHttp'
import type {
  PracticeRecordVO,
  PracticeRecordQueryReqVO,
  PracticeRecordListRespVO,
  PracticeStatisticsVO,
  ContinuePracticeReqVO,
  ContinuePracticeRespVO,
} from '~/types/practice'

/* 是否使用模拟数据 */
const USE_MOCK = true

/**
 * 获取练习记录列表
 * @param params 查询参数
 */
export const getPracticeRecords = async (params: PracticeRecordQueryReqVO): Promise<PracticeRecordListRespVO> => {
  if (USE_MOCK) {
    return getMockPracticeRecords(params)
  }
  return await httpGet('PracticeRecords', '/member/practice/records', { query: params })
}

/**
 * 获取练习统计数据
 */
export const getPracticeStatistics = async (): Promise<PracticeStatisticsVO> => {
  if (USE_MOCK) {
    return getMockPracticeStatistics()
  }
  return await httpGet('PracticeStatistics', '/member/practice/statistics')
}

/**
 * 继续练习
 * @param data 请求参数
 */
export const continuePractice = async (data: ContinuePracticeReqVO): Promise<ContinuePracticeRespVO> => {
  if (USE_MOCK) {
    return getMockContinuePractice(data)
  }
  return await httpPost('ContinuePractice', '/member/practice/continue', data)
}

/* ==================== Mock Data ==================== */

/**
 * 练习类型映射
 */
const practiceTypeMap: Record<string, { name: string; description: string }> = {
  chapter: { name: '章节练习', description: '按章节进行练习' },
  sequence: { name: '顺序练习', description: '按顺序做题' },
  random: { name: '随机练习', description: '随机抽题练习' },
  daily: { name: '每日练习', description: '每日推荐练习' },
  exam: { name: '模拟考试', description: '模拟真实考试' },
}

/**
 * 练习状态映射
 */
const practiceStatusMap: Record<string, { name: string; color: string }> = {
  in_progress: { name: '进行中', color: '#3b82f6' },
  completed: { name: '已完成', color: '#22c55e' },
  abandoned: { name: '已放弃', color: '#9ca3af' },
}

/**
 * 生成模拟练习记录
 */
const getMockPracticeRecords = (params: PracticeRecordQueryReqVO): PracticeRecordListRespVO => {
  const page = params.page || 1
  const limit = params.limit || 10
  const total = 45

  const qbanks = [
    { id: 1, name: '高等数学题库', cover: 'https://picsum.photos/400/300?random=1' },
    { id: 2, name: '线性代数题库', cover: 'https://picsum.photos/400/300?random=2' },
    { id: 3, name: '概率统计题库', cover: 'https://picsum.photos/400/300?random=3' },
    { id: 4, name: '数据结构题库', cover: 'https://picsum.photos/400/300?random=4' },
    { id: 5, name: '操作系统题库', cover: 'https://picsum.photos/400/300?random=5' },
  ]

  const types: ('chapter' | 'sequence' | 'random' | 'daily' | 'exam')[] = ['chapter', 'sequence', 'random', 'daily', 'exam']
  const statuses: ('in_progress' | 'completed' | 'abandoned')[] = ['in_progress', 'completed', 'completed', 'completed', 'abandoned']

  const list: PracticeRecordVO[] = []

  for (let i = 0; i < limit; i++) {
    const index = (page - 1) * limit + i
    if (index >= total) break

    const qbank = qbanks[Math.floor(Math.random() * qbanks.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const typeInfo = practiceTypeMap[type]
    const statusInfo = practiceStatusMap[status]

    const totalQuestionCount = Math.floor(Math.random() * 50) + 10
    let completedCount: number
    let currentQuestionIndex: number

    if (status === 'completed') {
      completedCount = totalQuestionCount
      currentQuestionIndex = totalQuestionCount
    } else if (status === 'in_progress') {
      completedCount = Math.floor(Math.random() * (totalQuestionCount - 1)) + 1
      currentQuestionIndex = completedCount
    } else {
      completedCount = Math.floor(Math.random() * totalQuestionCount)
      currentQuestionIndex = completedCount
    }

    const correctCount = Math.floor(completedCount * (Math.random() * 0.4 + 0.5))
    const incorrectCount = completedCount - correctCount
    const accuracy = completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(index / 3))

    list.push({
      id: index + 1,
      qbankId: qbank.id,
      qbankName: qbank.name,
      qbankCover: qbank.cover,
      type,
      typeName: typeInfo.name,
      status,
      statusName: statusInfo.name,
      currentQuestionIndex,
      totalQuestionCount,
      completedCount,
      correctCount,
      incorrectCount,
      accuracy,
      duration: Math.floor(Math.random() * 120) + 10,
      startTime: date.toISOString(),
      updateTime: date.toISOString(),
      completeTime: status === 'completed' ? date.toISOString() : undefined,
      chapterName: type === 'chapter' ? `第${Math.floor(Math.random() * 10) + 1}章` : undefined,
      modeDescription: typeInfo.description,
    })
  }

  /* 按时间倒序 */
  list.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  return { list, total }
}

/**
 * 生成模拟练习统计
 */
const getMockPracticeStatistics = (): PracticeStatisticsVO => {
  const totalCount = 45
  const completedCount = 32
  const inProgressCount = 10
  const _abandonedCount = 3

  return {
    totalCount,
    inProgressCount,
    completedCount,
    totalDuration: Math.floor(Math.random() * 5000) + 2000,
    totalQuestions: Math.floor(Math.random() * 2000) + 500,
    avgAccuracy: Math.floor(Math.random() * 30) + 60,
  }
}

/**
 * 生成模拟继续练习响应
 */
const getMockContinuePractice = (data: ContinuePracticeReqVO): ContinuePracticeRespVO => {
  const recordId = data.recordId
  const canContinue = Math.random() > 0.2

  if (!canContinue) {
    return {
      canContinue: false,
      message: '该练习已过期或已被删除',
    }
  }

  /* 模拟不同练习类型的跳转路径 */
  const types = ['chapter', 'sequence', 'random', 'daily', 'exam']
  const type = types[Math.floor(Math.random() * types.length)]

  let redirectUrl = ''
  switch (type) {
    case 'chapter':
      redirectUrl = `/study/practice/chapter?recordId=${recordId}`
      break
    case 'sequence':
      redirectUrl = `/study/practice/sequence?recordId=${recordId}`
      break
    case 'random':
      redirectUrl = `/study/practice/random?recordId=${recordId}`
      break
    case 'daily':
      redirectUrl = `/study/practice/daily?recordId=${recordId}`
      break
    case 'exam':
      redirectUrl = `/study/exam/${recordId}`
      break
    default:
      redirectUrl = `/study/practice?recordId=${recordId}`
  }

  return {
    canContinue: true,
    redirectUrl,
    message: '可以继续练习',
  }
}
