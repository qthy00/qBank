/**
 * Mock 使用优惠券
 */

import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userCouponId, orderId } = body

  if (!userCouponId || !orderId) {
    return {
      code: 400,
      message: '参数错误'
    }
  }

  // 模拟使用成功
  return true
})
