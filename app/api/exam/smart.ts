import type {
  SmartPaperReqVO,
  SmartPaperRespVO,
  SmartPaperConfigRespVO,
  SmartPaperHistoryVO,
  SmartPaperHistoryReqVO,
} from '~/types/exam/smart'
import { httpGet, httpPost } from '~/composables/useHttp'
import {
  getMockWeakPoints,
  getMockSmartPaperConfig,
  generateMockSmartPaper,
  getMockSmartPaperHistory,
} from './mock'

/**
 * 智能组卷相关API
 */

/**
 * 获取薄弱知识点列表
 * @param params 查询参数
 * @param useMock 是否使用Mock数据
 */
export const getWeakPoints = (
  params?: { subjectId?: number; limit?: number },
  useMock: boolean = true
): Promise<{
  list: {
    id: number
    name: string
    subjectId: number
    subjectName: string
    accuracy: number
    priority: number
    totalQuestions: number
    completedQuestions: number
    wrongQuestions: number
  }[]
}> => {
  if (useMock) {
    return Promise.resolve({ list: getMockWeakPoints(params) })
  }
  return httpGet('WeakPoints', '/member/exam/smart/weak-points', { query: params })
}

/**
 * 获取智能组卷配置（薄弱知识点 + 推荐参数）
 * @param qbankId 题库ID
 * @param subjectId 科目ID
 * @param useMock 是否使用Mock数据
 */
export const getSmartPaperConfig = (
  qbankId?: number,
  subjectId?: number,
  useMock: boolean = true
): Promise<SmartPaperConfigRespVO> => {
  if (useMock) {
    return Promise.resolve(getMockSmartPaperConfig(qbankId, subjectId))
  }
  return httpGet('SmartPaperConfig', '/member/exam/smart/config', {
    query: { qbankId, subjectId },
  })
}

/**
 * 生成智能试卷
 * @param data 组卷配置
 * @param useMock 是否使用Mock数据
 */
export const generateSmartPaper = (
  data: SmartPaperReqVO,
  useMock: boolean = true
): Promise<SmartPaperRespVO> => {
  if (useMock) {
    return Promise.resolve(generateMockSmartPaper(data))
  }
  return httpPost('GenerateSmartPaper', '/member/exam/smart/generate', data)
}

/**
 * 获取智能组卷历史列表
 * @param params 查询参数
 * @param useMock 是否使用Mock数据
 */
export const getSmartPaperHistory = (
  params?: SmartPaperHistoryReqVO,
  useMock: boolean = true
): Promise<{ list: SmartPaperHistoryVO[]; total: number }> => {
  if (useMock) {
    return Promise.resolve(getMockSmartPaperHistory(params))
  }
  return httpGet('SmartPaperHistory', '/member/exam/smart/history', { query: params })
}
