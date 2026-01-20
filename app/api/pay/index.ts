import {httpGet, httpPost} from "~/composables/useHttp";


export interface OrderInfoVO {
  id: number
  createTime: number
  merchantOrderId: number
  subject: string
  body: string
  price: number
  status: number
  no: string
}


// 查询订单详情
export const getEnableChannelCodeList = async (appId: number) => {
  return await httpGet('getEnableChannelCodeList',  `/pay/channel/get-enable-code-list?appId=${appId}`)
}


// 查询订单详情
export const fetchOrderInfo = async (query: any):Promise<OrderInfoVO> => {
  return await httpGet('fetchOrderInfo', `/pay/order/get`, {query} )
}


export const submitOrder = async (data: any) => {
  return await httpPost('submitOrder',`/pay/order/submit `, data )
}
