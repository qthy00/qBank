import {httpGet, httpPost} from "~/composables/useHttp";





export interface PasswordEntity {
  id: number
  password: string
  submitBy: string // 提交者信息
  status?: number // 密码状态  0-待验证，1-有效，2-无效
}



export const ArchiveApi = {

  checkPasswordExists: async (md5: any) => {
    return await httpGet( '', `/tools/zip-decrypt/query/${md5}` )
  },

  fetchPasswordFromDatabase: async (md5: string, toolId: number) => {
    return await httpGet( '', `/tools/zip-decrypt/list/${md5}`, {query: { toolId } })
  },

  submitPassword: async (data: any) => {
    return await httpPost( '', `/tools/zip-decrypt/submit`, data )
  },

  markPasswordStatus: async (id: number, type: boolean) => {
    return await httpPost( '', `/tools/zip-decrypt/mark`,  { id, type } )
  }
}
