import {defineStore} from 'pinia'
// @ts-ignore
import type {DictDataVO} from '~/api/dict/dict.data'
import {CACHE_KEY, useCache} from '~/composables/useCache.ts'
import {getSimpleDictDataList} from '~/api/dict/dict.data'

const {wsCache} = useCache('sessionStorage')


export interface DictItem {
    value: any
    label: string
    clorType?: string
    cssClass?: string
}

export interface DictTypeType {
    dictType: string
    dictValue: DictItem[]
}

const types = [
    'common_status',
    'date_interval',
    'infra_boolean_string',
    'tools_games_props_bg_color',
    'tools_games_props_type',
    'trade_order_status'
]

export const useDictStore = defineStore('dict', () => {

    const dictMap = reactive<Record<string, DictItem[]>>({})
    const isSetDict = ref(false)

    const setDictMap = async () => {

        if (Object.keys(dictMap).length > 0) {
            isSetDict.value = true;
            return; // 已有数据直接返回，避免重复处理
        }
        try {
            const server = import.meta.server
            const res = await getSimpleDictDataList(types, server)
            // 处理服务端/客户端数据结构差异
            let data: DictDataVO[] = res
            if (server) {
                data = res.data?.value || []
            }
            // 清空原有数据（防止脏数据）
            Object.keys(dictMap).forEach(key => delete dictMap[key])
            data.forEach((dictData: DictDataVO) => {
                if (!dictMap[dictData.dictType]) {
                    dictMap[dictData.dictType] = [] // 初始化空数组
                }
                // 追加字典项
                dictMap[dictData.dictType].push({
                    value: dictData.value,
                    label: dictData.label,
                    colorType: dictData.colorType,
                    cssClass: dictData.cssClass
                })
            })

            isSetDict.value = true
            // console.log('最终字典Map：', dictMap)
        }catch (e){
            console.error('字典数据加载失败：', error)
            // 错误处理：防止页面卡死
            isSetDict.value = false;
        }
    }
    const getDictByType = (type: string) => {
        if (!isSetDict.value) {
            setDictMap()
        }
        return dictMap[type] || []
    }

    return {
        dictMap,
        isSetDict,
        setDictMap,
        getDictByType
    }
}, {persist: true})
