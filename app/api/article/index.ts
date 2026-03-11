import {httpGet} from "~/composables/useHttp";
import type {ArticleListReqVO, ArticleListRespVO, ArticleDetailVO, ArticleCategoryVO} from "~/types/article";
import {
  getMockArticleList,
  getMockArticleDetail,
  getMockArticleCategories,
  incrementMockViewCount,
} from "./mock";

/**
 * 判断是否使用 Mock 数据
 */
const useMock = () => import.meta.dev

/**
 * 资讯相关API
 */
export const ArticleApi = {

  /**
   * 获取资讯详情
   */
  getContentInfo: async (query: any, server: boolean = false) => {
    return await httpGet( '', '/cms/content/get', {query}, server )
  },

  /**
   * 获取资讯列表
   */
  getContentList: async (query: any, server: boolean = false) => {
    return await httpGet( '', '/cms/content/list', {query}, server )
  },

  /**
   * 获取文章详情
   */
  getArticleDetail: async (id: number, server: boolean = false) => {
    return await httpGet( '', `/cms/content/article`, {query: {id}}, server)
  },

  /**
   * 获取资讯列表（带类型）
   * @param params 查询参数
   */
  getArticleList: async (params: ArticleListReqVO): Promise<ArticleListRespVO> => {
    /* 开发环境使用 Mock 数据 */
    if (useMock()) {
      return getMockArticleList(params)
    }
    return await httpGet('ArticleList', '/cms/content/list', { query: params })
  },

  /**
   * 获取资讯详情（带类型）
   * @param id 资讯ID
   */
  getArticleDetailById: async (id: number): Promise<ArticleDetailVO> => {
    /* 开发环境使用 Mock 数据 */
    if (useMock()) {
      const detail = getMockArticleDetail(id)
      if (!detail) {
        throw new Error('资讯不存在')
      }
      return detail
    }
    return await httpGet('ArticleDetail', `/cms/content/get`, { query: { id } })
  },

  /**
   * 获取资讯分类列表
   */
  getArticleCategories: async (): Promise<ArticleCategoryVO[]> => {
    /* 开发环境使用 Mock 数据 */
    if (useMock()) {
      return getMockArticleCategories()
    }
    return await httpGet('ArticleCategories', '/cms/category/list', { query: { type: 'article' } })
  },

  /**
   * 增加资讯浏览量
   * @param id 资讯ID
   */
  incrementViewCount: async (id: number): Promise<void> => {
    /* 开发环境使用 Mock 数据 */
    if (useMock()) {
      incrementMockViewCount(id)
      return
    }
    await httpGet('IncrementView', `/cms/content/view`, { query: { id } })
  },
}

