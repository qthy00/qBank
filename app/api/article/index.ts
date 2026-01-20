import {httpGet} from "~/composables/useHttp";

export const ArticleApi = {

  getContentInfo: async (query: any, server: boolean = false) => {
    return await httpGet( '', '/cms/content/get', {query}, server )
  },

  getContentList: async (query: any, server: boolean = false) => {
    return await httpGet( '', '/cms/content/list', {query}, server )
  },

  // 获取文章详情
  getArticleDetail: async (id: number, server: boolean = false) => {
    return await httpGet( '', `/cms/content/article`, {query: {id}}, server)
  },
}
