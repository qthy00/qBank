/**
 * 数据字典工具类
 */
import { useDictStore } from '~/stores/dict'
import type { ElementPlusInfoType } from '@/types/elementPlus'
import { ref } from 'vue'



/**
 * 获取 dictType 对应的数据字典数组
 *
 * @param dictType 数据类型
 * @returns {*|Array} 数据字典数组
 */
export interface DictDataType {
  dictType: string
  label: string
  value: string | number | boolean
  colorType: ElementPlusInfoType | ''
  cssClass: string
}

export interface NumberDictDataType extends DictDataType {
  value: number
}

export interface StringDictDataType extends DictDataType {
  value: string
}

export const getDictOptions = (dictType: string) => {
  const dictStore = useDictStore()
  const data = dictStore.getDictByType(dictType)
  return  data || []
}

// 获取 dictType 对应的数据字典数组【int】
export const getIntDictOptions = (dictType: string): NumberDictDataType[] => {
  // 获得通用的 DictDataType 列表
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  // 转换成 number 类型的 NumberDictDataType 类型
  // why 需要特殊转换：避免 IDEA 在 v-for="dict in getIntDictOptions(...)" 时，el-option 的 key 会告警
  const dictOption: NumberDictDataType[] = []
  if(dictOptions && dictOptions.length > 0) {
    dictOptions.forEach((dict: DictDataType) => {
      dictOption.push({
        ...dict,
        value: parseInt(dict.value + '')
      })
    })
  }

  console.log('dictOption===', dictOption)
  return dictOption
}

// 获取 dictType 对应的数据字典数组【string】
export const getStrDictOptions = (dictType: string) => {
  // 获得通用的 DictDataType 列表
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  // 转换成 string 类型的 StringDictDataType 类型
  // why 需要特殊转换：避免 IDEA 在 v-for="dict in getStrDictOptions(...)" 时，el-option 的 key 会告警
  const dictOption: StringDictDataType[] = []
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: dict.value + ''
    })
  })
  return dictOption
}

// 获取 dictType 对应的数据字典数组【boolean】
export const getBoolDictOptions = (dictType: string) => {
  const dictOption: DictDataType[] = []
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: dict.value + '' === 'true'
    })
  })
  return dictOption
}

/**
 * 获取指定字典类型的指定值对应的字典对象【object】
 * @param dictType 字典类型
 * @param value 字典值
 * @return DictDataType 字典对象
 */
export const getDictObj = (dictType: string, value: any): DictDataType | undefined => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  for (const dict of dictOptions) {
    if (dict.value === value + '') {
      return dict
    }
  }
}

/**
 * 获得字典数据的文本展示
 *
 * @param dictType 字典类型
 * @param value 字典数据的值
 * @return 字典名称
 */
export const getDictLabel = (dictType: string, value: any): string => {

  const dictOptions: DictDataType[] = getDictOptions(dictType)
  const dictLabel = ref('')
  if( dictOptions && dictOptions.length > 0){
    dictOptions.forEach((dict: DictDataType) => {
      if (dict.value === value + '') {
        dictLabel.value = dict.label
      }
    })
  }
  return dictLabel.value
}

/**
 * 根据文本获得字典数据的值
 *
 * @param dictType 字典类型
 * @param label 字典数据的文本
 * @return 字典数据的值
 */
export const getDictValue= (dictType: string, label: string): number => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  let dictValue = 0;
  dictOptions.forEach((dict: DictDataType) => {
    if (dict.label === label) {
      dictValue = Number(dict.value)
    }
  })
  return dictValue
}

export enum DICT_TYPE {
  COMMON_STATUS = 'common_status',
  DATE_INTERVAL = 'date_interval', // 数据间隔
  INFRA_BOOLEAN_STRING = 'infra_boolean_string',
  // ========== TOOLS GAMES 模块 ==========
  // 工具类
  TOOLS_GAMES_PROPS_BG_COLOR = 'tools_games_props_bg_color',
  TOOLS_GAMES_PROPS_TYPE = 'tools_games_props_type',
  ORDER_STATUS = 'trade_order_status'
}
