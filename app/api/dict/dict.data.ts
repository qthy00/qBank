import {httpGet} from "~/composables/useHttp";

export type DictDataVO = {
    id: number | undefined
    sort: number | undefined
    label: string
    value: string
    dictType: string
    status: number
    colorType: string
    cssClass: string
    remark: string
    createTime: Date
}
// 查询字典数据（精简)列表
export const getSimpleDictDataList = (types: string[], server: boolean = true) => {
    return httpGet('DictDataList', '/system/dict-data/simple-list',
        {query: {types: types.join(',')}}, server)
}

export const getDictDataListByType = (type: string, server: boolean = true) => {
    return httpGet('DictDataListByType', '/system/dict-data/type',
        {query: {types: types.join(',')}}, server)
}

