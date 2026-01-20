import {httpGet, httpPost, httpPut, httpDelete, httpDownload} from "~/composables/useHttp";

export type DictTypeVO = {
  id: number | undefined
  name: string
  type: string
  status: number
  remark: string
  createTime: Date
}

// 查询字典（精简)列表
export const getSimpleDictTypeList = () => {
  return httpGet( 'getSimpleDictTypeList', '/system/dict-type/list-all-simple' )
}

// 查询字典列表
export const getDictTypePage = (query: PageParam) => {
  return httpGet( 'getDictTypePage', '/system/dict-type/page', {query} )
}

// 查询字典详情
export const getDictType = (id: number) => {
  return httpGet( 'getDictType', `/system/dict-type/get?id=${id}` )
}

// 新增字典
export const createDictType = (data: DictTypeVO) => {
  return httpPost( 'createDictType', '/system/dict-type/create', data )
}

// 修改字典
export const updateDictType = (data: DictTypeVO) => {
  return httpPut( 'updateDictType', '/system/dict-type/update', data )
}

// 删除字典
export const deleteDictType = (id: number) => {
  return httpDelete( 'deleteDictType', `/system/dict-type/delete?id=${id}`)
}
// 导出字典类型
export const exportDictType = (query) => {
  return httpDownload( 'exportDictType', '/system/dict-type/export', {query}  )
}
