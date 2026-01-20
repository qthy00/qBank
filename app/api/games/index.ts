/**
 * 导入请求配置，用于后续的API调用。
 * @module CmsContentApi
 */
import {httpGet, httpPost} from "~/composables/useHttp";


export interface GamesFormulaRespVO {
    id: number
    propaId: number
    propbId: number
    resultId: number
    percentage: number
    author: string
}

/**
 * 软件类资讯的API对象，包含各种操作方法。
 */
export const gamesApi = {

    /**
     * 分页查询软件类资讯。
     * @param query 查询参数对象。
     * @returns 返回资讯的分页查询结果。
     */
    loadImageOptions: async (query: any) => {
        return await httpGet('ImageOptions', `/tools/games-props/page`, {query})
    },

    getGamesFormulaResult: async (query: any): Promise<GamesFormulaRespVO[]> => {
        return await httpGet('GamesFormulaResult', `/tools/games-formula/query`, {query})
    },

    getGamesFormulaListByResultId: async (query: any): Promise<GamesFormulaRespVO[]> => {
        return await httpGet('GamesFormulaListByResultId', `/tools/games-formula/list`, {query})
    },

    addRecipe: async (data: any) => {
        return await httpPost('addRecipe', `/tools/games-formula/create`, data)
    },

}
