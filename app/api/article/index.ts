import {httpGet} from "~/composables/useHttp";
import type {ArticleListReqVO, ArticleListRespVO, ArticleDetailVO} from "~/types/article";

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
    return await httpGet('ArticleList', '/cms/article/page', { query: params })
  },

  /**
   * 获取资讯详情（带类型）
   * @param id 资讯ID
   */
  getArticleDetailById: async (id: number): Promise<ArticleDetailVO> => {
    return await httpGet('ArticleDetail', `/cms/article/detail`, { query: { id } })
  },
  /**
   * 增加资讯浏览量
   * @param id 资讯ID
   */
  incrementViewCount: async (id: number): Promise<void> => {
    await httpGet('IncrementView', `/cms/content/view`, { query: { id } })
  },
}

