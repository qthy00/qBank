import {httpGet, httpPost} from '~/composables/useHttp'
import type {
  SearchReqVO,
  SearchRespVO,
  SearchSuggestRespVO,
  HotSearchItem,
  SearchHistoryItem,
  AdvancedSearchReqVO,
  SearchType
} from '~/types/search'
import {
  mockSearch,
  mockGetSuggestions,
  mockGetHotSearch,
  mockSearchQbank,
  mockSearchQuestion,
  mockSearchArticle
} from './mock'

/* Mock 数据开关 - 开发环境启用 */
const USE_MOCK = import.meta.dev || import.meta.client

/**
 * 搜索相关API
 */
export const SearchApi = {
  /**
   * 全局搜索
   * @param params 搜索参数
   */
  search: async (params: SearchReqVO): Promise<SearchRespVO> => {
    console.log('USE_MOCK', USE_MOCK)
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockSearch(params.keyword, params.type, params.pageNo, params.pageSize)
    }
    return await httpGet('GlobalSearch', '/cms/search', {query: params})
  },

  /**
   * 获取搜索建议
   * @param keyword 关键词
   * @param type 搜索类型
   */
  getSuggestions: async (keyword: string, type?: SearchType): Promise<SearchSuggestRespVO> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 100))
      return mockGetSuggestions(keyword)
    }
    return await httpGet('SearchSuggestions', '/cms/search/suggest', {
      query: {keyword, type}
    })
  },

  /**
   * 获取热门搜索
   * @param limit 数量限制
   */
  getHotSearch: async (limit: number = 10): Promise<HotSearchItem[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 100))
      return mockGetHotSearch(limit)
    }
    return await httpGet('HotSearch', '/cms/search/hot', {query: {limit}})
  },

  /**
   * 高级搜索
   * @param params 高级搜索参数
   */
  advancedSearch: async (params: AdvancedSearchReqVO): Promise<SearchRespVO> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockSearch(params.keyword, params.type, params.pageNo, params.pageSize)
    }
    return await httpPost('AdvancedSearch', '/cms/search/advanced', params)
  },

  /**
   * 保存搜索历史（本地存储）
   * @param item 搜索历史项
   */
  saveSearchHistory: (item: SearchHistoryItem): void => {
    if (!import.meta.client) return

    const key = 'search_history'
    const history = SearchApi.getSearchHistory()

    /* 去重并添加到开头 */
    const filtered = history.filter(h => h.keyword !== item.keyword)
    filtered.unshift(item)

    /* 限制数量 */
    const limited = filtered.slice(0, 10)

    localStorage.setItem(key, JSON.stringify(limited))
  },

  /**
   * 获取搜索历史
   */
  getSearchHistory: (): SearchHistoryItem[] => {
    if (!import.meta.client) return []

    const key = 'search_history'
    const stored = localStorage.getItem(key)
    if (!stored) return []

    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  },

  /**
   * 清除搜索历史
   */
  clearSearchHistory: (): void => {
    if (!import.meta.client) return

    const key = 'search_history'
    localStorage.removeItem(key)
  },

  /**
   * 删除单条搜索历史
   * @param keyword 关键词
   */
  removeSearchHistory: (keyword: string): void => {
    if (!import.meta.client) return

    const history = SearchApi.getSearchHistory()
    const filtered = history.filter(h => h.keyword !== keyword)
    localStorage.setItem('search_history', JSON.stringify(filtered))
  }
}

/**
 * 题库搜索API（专用接口）
 */
export const QbankSearchApi = {
  /**
   * 搜索题库
   * @param keyword 关键词
   * @param pageNo 页码
   * @param pageSize 每页数量
   */
  searchQbank: async (keyword: string, pageNo: number = 1, pageSize: number = 10) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockSearchQbank(keyword, pageNo, pageSize)
    }
    return await httpGet('SearchQbank', '/cms/search/qbank', {
      query: {keyword, pageNo, pageSize}
    })
  },

  /**
   * 搜索题目
   * @param keyword 关键词
   * @param pageNo 页码
   * @param pageSize 每页数量
   */
  searchQuestion: async (keyword: string, pageNo: number = 1, pageSize: number = 10) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockSearchQuestion(keyword, pageNo, pageSize)
    }
    return await httpGet('SearchQuestion', '/cms/search/question', {
      query: {keyword, pageNo, pageSize}
    })
  }
}

/**
 * 文章搜索API（专用接口）
 */
export const ArticleSearchApi = {
  /**
   * 搜索文章
   * @param keyword 关键词
   * @param pageNo 页码
   * @param pageSize 每页数量
   */
  searchArticle: async (keyword: string, pageNo: number = 1, pageSize: number = 10) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockSearchArticle(keyword, pageNo, pageSize)
    }
    return await httpGet('SearchArticle', '/cms/search/article', {
      query: {keyword, pageNo, pageSize}
    })
  }
}
