/**
 * 错题本API封装
 */
import { httpGet, httpPost } from "~/composables/useHttp"
import type {
  MistakeQueryReqVO,
  MistakeListRespVO,
  MistakeStatsVO,
  MarkMasteredReqVO,
  RemoveMistakeReqVO,
} from "~/types/mistake"
import {
  getMockMistakeList,
  getMockMistakeStats,
  mockMarkMastered,
  mockRemoveMistake,
} from "./mock"

/* 是否使用模拟数据 */
const USE_MOCK = true

/**
 * 获取错题列表
 * @param params 查询参数
 */
export const getMistakeList = async (params: MistakeQueryReqVO): Promise<MistakeListRespVO> => {
  if (USE_MOCK) {
    return getMockMistakeList(params)
  }
  return await httpPost('MistakeList', '/member/mistakes/page', params)
}

/**
 * 获取错题统计
 * @param categoryId 分类ID（可选）
 */
export const getMistakeStats = async (categoryId?: number): Promise<MistakeStatsVO> => {
  if (USE_MOCK) {
    return getMockMistakeStats()
  }
  return await httpGet('MistakeStats', '/member/mistakes/stats', {
    query: categoryId ? { categoryId } : undefined,
  })
}

/**
 * 标记错题掌握状态
 * @param data 请求参数
 */
export const markMistakeMastered = async (data: MarkMasteredReqVO): Promise<boolean> => {
  if (USE_MOCK) {
    return mockMarkMastered(data.questionId, data.isMastered)
  }
  return await httpPost('MarkMistakeMastered', '/member/mistakes/mark-mastered', data)
}

/**
 * 批量标记掌握
 * @param questionIds 题目ID列表
 */
export const batchMarkMastered = async (questionIds: number[]): Promise<boolean> => {
  if (USE_MOCK) {
    questionIds.forEach(id => mockMarkMastered(id, true))
    return true
  }
  return await httpPost('BatchMarkMastered', '/member/mistakes/batch-mastered', {
    questionIds,
  })
}

/**
 * 移除错题
 * @param data 请求参数
 */
export const removeMistake = async (data: RemoveMistakeReqVO): Promise<boolean> => {
  if (USE_MOCK) {
    return mockRemoveMistake(data.questionId)
  }
  return await httpPost('RemoveMistake', '/member/mistakes/remove', data)
}

/**
 * 批量移除错题
 * @param questionIds 题目ID列表
 */
export const batchRemoveMistake = async (questionIds: number[]): Promise<boolean> => {
  if (USE_MOCK) {
    questionIds.forEach(id => mockRemoveMistake(id))
    return true
  }
  return await httpPost('BatchRemoveMistake', '/member/mistakes/batch-remove', {
    questionIds,
  })
}

/**
 * 获取错题详情
 * @param questionId 题目ID
 */
export const getMistakeDetail = async (questionId: number) => {
  if (USE_MOCK) {
    const { getMockMistakeDetail } = await import('./mock')
    return getMockMistakeDetail(questionId)
  }
  return await httpGet('MistakeDetail', '/member/mistakes/detail', {
    query: { questionId },
  })
}
