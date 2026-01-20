
import {httpGet, httpPost} from "~/composables/useHttp";

export const StatApi = {
    /**
     * 网站访问统计。
     * @param query 查询参数对象。
     */
    pushVisited: async (query: any) => {
        return await httpGet('pushVisited', `/cms/stat/visit`, {query})
    },

    /**
     * 工具使用统计。
     * @param id 资讯ID。
     */
    pushToolUsage: async (id: number) => {
        return await httpGet('pushToolUsage', `/cms/stat/usage?id=${id}`)
    },

    pushToBaidu: async (data: any) => {
        return await httpPost('pushToBaidu', `/cms/seo/baidu_push`, data)
    }

}

