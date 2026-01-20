/**
 * 导入请求配置，用于后续的API调用。
 * @module CmsContentApi
 */
import { httpGet } from "~/composables/useHttp";


/**
 * 软件类资讯的API对象，包含各种操作方法。
 */
export const ToolsApi = {
  /**
   * 分页查询软件类资讯。
   * @param query 查询参数对象。
   * @param server 是否使用服务器端渲染。
   * @returns 返回资讯的分页查询结果。
   */
  getToolsPage: async (query: any, server: boolean = true) => {
    return await httpGet('',  `/cms/tools/page`, {query}, server )
  },


  /**
   * 根据ID查询软件类资讯的详细信息。
   * @param id 查询参数对象，包含资讯ID。
   * @param server
   * @returns 返回指定资讯的详细信息。
   */
  getTool: async (id: number, server: boolean = false) => {
    return await httpGet('', `/cms/tools/get`, {query: {id}}, server)
  },

  /**
   * 根据ID查询软件类资讯的详细信息。
   * @param series 查询参数对象，包含资讯ID。
   * @param server 是否使用服务器端渲染。
   * @returns 返回指定资讯的详细信息。
   */
  getToolsBySeries: async (series: number, server: boolean = false) => {
    return await httpGet('getToolsBySeries',  `/cms/tools/series`, {query: {series}}, server)
  },
}
