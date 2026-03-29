import {defineStore} from 'pinia'
// @ts-expect-error - DictDataVO type import error
import type {DictDataVO} from '~/api/dict/dict.data'
import {useCache} from '~/composables/useCache.ts'
import {getSimpleDictDataList} from '~/api/dict/dict.data'

const {_wsCache} = useCache('sessionStorage')

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
    let isLoading = false
    let loadPromise: Promise<void> | null = null

    const setDictMap = async () => {
        if (isSetDict.value) return
        if (isLoading && loadPromise) {
            return loadPromise
        }
        isLoading = true
        loadPromise = (async () => {
            try {
                const server = import.meta.server
                const res = await getSimpleDictDataList(types, server)
                // 处理服务端/客户端数据结构差异
                let data: DictDataVO[] = res
                if (server) {
                    data = res.data?.value || []
                }
                // 清空原有数据（防止脏数据）
                for (const key of Object.keys(dictMap)) {
                  dictMap[key] = []
                }
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
            } catch {
                console.error('字典数据加载失败')
                // 错误处理：防止页面卡死
                isSetDict.value = false
            }
        })()
        await loadPromise
        isLoading = false
        loadPromise = null
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
