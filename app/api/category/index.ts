import {httpGet} from "~/composables/useHttp";

/**
 * 栏目管理的API接口，提供查询、增删改等操作。
 */
export const CmsCategoryApi = {

  /**
   * 查询栏目管理列表。
   * @param query 查询参数，包含分页、过滤条件等。
   * @returns 返回栏目列表的数据。
   */
  getCategoryList: async (query?: any) => {
    return await httpGet('CategoryList',`/cms/category/tree`, {query}, true)
  },

  /**
   * 查询栏目管理列表。
   * @param query 查询参数，包含分页、过滤条件等。
   * @returns 返回栏目列表的数据。
   */
  getCategoryListCustom: async (query: any) => {
    return await httpGet('CategoryListCustom',`/cms/category/custom_list`, {query})
  },

  /**
   * 根据ID查询栏目管理的详细信息。
   * @param id 查询参数,栏目ID。
   * @returns 返回指定栏目的详细信息。
   */
  getCategory: async (id: number) => {
    return await httpGet('CategoryInfo', `/cms/category/get?id=${id}`)
  },


}
