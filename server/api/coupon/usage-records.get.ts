/**
 * Mock 优惠券使用记录
 */

import { defineEventHandler, getQuery } from 'h3'

const mockUsageRecords = [
  {
    id: 1,
    couponId: 3,
    couponName: '8折优惠券',
    userId: 1,
    orderId: 10001,
    orderNo: 'ORDER202403200001',
    discountAmount: 1500,
    useTime: Date.now() - 86400000 * 2
  },
  {
    id: 2,
    couponId: 2,
    couponName: '满100减20',
    userId: 1,
    orderId: 10002,
    orderNo: 'ORDER202403150002',
    discountAmount: 2000,
    useTime: Date.now() - 86400000 * 5
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const _pageNo = query.pageNo ? Number(query.pageNo) : 1
  const _pageSize = query.pageSize ? Number(query.pageSize) : 10

  return {
    list: mockUsageRecords,
    total: mockUsageRecords.length
  }
})
