import { httpGet, httpPost } from '~/composables/useHttp'
import type {
  QuestionSearchReqVO,
  QuestionSearchRespVO,
  QuestionFilterVO,
  QuestionHotSearchItem,
  QuestionFavoriteToggleReqVO
} from '~/types/question'
import {
  mockQuestionSearch,
  mockGetQuestionFilterOptions,
  mockGetHotSearchKeywords,
  mockToggleFavorite
} from './mock'

/* Mock 数据开关 - 开发环境启用 */
const USE_MOCK = import.meta.dev || import.meta.client

/**
 * 题目搜索相关API
 */
export const QuestionSearchApi = {
  /**
   * 搜索题目
   * @param params 搜索参数
   */
  search: async (params: QuestionSearchReqVO): Promise<QuestionSearchRespVO> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockQuestionSearch(params)
    }
    return await httpGet<QuestionSearchRespVO>('QuestionSearch', '/member/question/search', { query: params })
  },

  /**
   * 获取筛选选项
   */
  getFilterOptions: async (): Promise<QuestionFilterVO> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 100))
      return mockGetQuestionFilterOptions()
    }
    return await httpGet<QuestionFilterVO>('QuestionFilterOptions', '/member/question/filter-options')
  },

  /**
   * 获取热门搜索关键词
   * @param limit 数量限制
   */
  getHotKeywords: async (limit: number = 10): Promise<QuestionHotSearchItem[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 100))
      return mockGetHotSearchKeywords(limit)
    }
    return await httpGet<QuestionHotSearchItem[]>('QuestionHotKeywords', '/member/question/hot-keywords', {
      query: { limit }
    })
  },

  /**
   * 收藏/取消收藏题目
   * @param data 收藏请求
   */
  toggleFavorite: async (data: QuestionFavoriteToggleReqVO): Promise<boolean> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockToggleFavorite(data.questionId, data.isFavorited)
    }
    return await httpPost('ToggleQuestionFavorite', '/member/question/favorite/toggle', data)
  },

  /**
   * 获取搜索历史
   * @returns 搜索历史列表
   */
  getSearchHistory: (): string[] => {
    if (!import.meta.client) return []
    const stored = localStorage.getItem('question_search_history')
    if (!stored) return []
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  },

  /**
   * 保存搜索历史
   * @param keyword 关键词
   */
  saveSearchHistory: (keyword: string): void => {
    if (!import.meta.client) return
    const history = QuestionSearchApi.getSearchHistory()
    /* 去重并添加到开头 */
    const filtered = history.filter(h => h !== keyword)
    filtered.unshift(keyword)
    /* 限制数量 */
    const limited = filtered.slice(0, 10)
    localStorage.setItem('question_search_history', JSON.stringify(limited))
  },

  /**
   * 清除搜索历史
   */
  clearSearchHistory: (): void => {
    if (!import.meta.client) return
    localStorage.removeItem('question_search_history')
  }
}
