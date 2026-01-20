import {httpGet, httpPost, httpDelete} from "~/composables/useHttp";


export interface Order {
  id: number
  no: string
  itemName: string
  itemDescription: string
  itemLogo: string
  payPrice: number
  status: number
  createTime: number
  payOrderId: number
  buttons: string[]

}

export interface OrderDetail extends Order{
  itemId: number
  discountPrice: number
  adjustPrice: number
  finishTime: number
  cancelTime: number
  payChannelCode: string
  payChannelName: string
  payStatus: boolean
  payTime: number
  pointPrice: number
  quantity: number
  receiverMobile: string
  refundPrice: number
  refundStatus: number
  totalPrice: number
  type: number
  userRemark: string
  vipPrice: number
  afterSaleId: number
  afterSaleStatus: number
  payExpireTime: number
}


// 创建订单
export const createOrder = async (data: any) => {
  return await httpPost( 'createOrder', `/swap/order/create`, data )
}

export const getSwapOrderPage = async (query: any) => {
  return await httpGet( 'getSwapOrderPage', `/swap/order/page`, {query} )
}


export const getSwapOrderDetail = async (id: number) => {
  return await httpGet( 'getSwapOrderDetail', `/swap/order/get-detail?id=${id}`)
}

export const getSwapOrderInfo = async (data: any) => {
  return await httpPost( 'getSwapOrderInfo', `/swap/order/get-info`, data )
}

export const asyncSwapOrder = async (data: any) => {
  return await httpPost( 'asyncSwapOrder', `/swap/order/update-paid`, data )
}


export const cancelOrder = async (id: number) => {
  return await httpDelete( 'cancelOrder', `/swap/order/cancel?id=${id}`)
}

export const deleteOrder = async (id: number) => {
  return await httpDelete( 'deleteOrder', `/swap/order/delete?id=${id}`)
}

// 创建售后申请
export const createAfterSale = async (data: any) => {
  return await httpPost( 'createAfterSale', `/swap/after-sale/create`, data )
}

export interface AfterSale {
  id: number
  no: string
  type: number
  status: number
  itemName: string
  refundPrice: number
  createTime: number
  itemLogo: string
  itemDescription: string
  applyReason: string
  applyDescription: string
}
export const getAfterSalePage = async (query: any) => {
  return await httpGet( 'getAfterSalePage', `/swap/after-sale/page`, {query})
}

export const getAfterSaleDetail = async (id: number) => {
  return await httpGet( 'getAfterSaleDetail', `/swap/after-sale/get?id=${id}`)
}


export interface SwapConfig {
  brokeragePosterUrls: string[]
  brokerageFrozenDays: number
  brokerageWithdrawMinPrice: number
  brokerageWithdrawTypes: number[]
}

export const getSwapConfig = async () => {
  return await httpGet( 'getSwapConfig', `/swap/config/get` )
}
