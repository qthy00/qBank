/**
 * Mock 领取优惠券
 */

import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { couponId } = body

  if (!couponId) {
    return {
      code: 400,
      message: '参数错误'
    }
  }

  // 模拟领取成功
  return {
    id: couponId,
    name: '测试优惠券',
    code: 'TEST2024',
    type: 1,
    discountAmount: 1000,
    discountPercent: 0,
    minAmount: 5000,
    status: 1,
    startTime: Date.now(),
    endTime: Date.now() + 86400000 * 30,
    description: '测试优惠券',
    applyType: 1,
    createTime: Date.now()
  }
})
