/**
 * Mock 获取订单可用优惠券
 */

import { defineEventHandler, readBody } from 'h3'

// Mock 用户优惠券数据
const mockUserCoupons = [
  {
    id: 1,
    couponId: 1,
    couponName: '新用户专享券',
    type: 3,
    discountAmount: 500,
    discountPercent: 0,
    minAmount: 0,
    status: 1,
    validStartTime: Date.now() - 86400000,
    validEndTime: Date.now() + 86400000 * 29,
    statusName: '未使用',
    typeName: '无门槛券',
    isExpiringSoon: false,
    expireCountdown: 86400 * 29,
    isSatisfied: true,
    unsatisfiedReason: undefined,
    actualDiscountAmount: 500
  },
  {
    id: 2,
    couponId: 2,
    couponName: '满100减20',
    type: 1,
    discountAmount: 2000,
    discountPercent: 0,
    minAmount: 10000,
    status: 1,
    validStartTime: Date.now() - 86400000 * 5,
    validEndTime: Date.now() + 86400000 * 25,
    statusName: '未使用',
    typeName: '满减券',
    isExpiringSoon: false,
    expireCountdown: 86400 * 25,
    isSatisfied: false,
    unsatisfiedReason: '订单金额未满100元',
    actualDiscountAmount: 0
  },
  {
    id: 5,
    couponId: 5,
    couponName: '开学季特惠券',
    type: 3,
    discountAmount: 1000,
    discountPercent: 0,
    minAmount: 0,
    status: 1,
    validStartTime: Date.now() - 86400000 * 5,
    validEndTime: Date.now() + 86400000 * 20,
    statusName: '未使用',
    typeName: '无门槛券',
    isExpiringSoon: false,
    expireCountdown: 86400 * 20,
    isSatisfied: true,
    unsatisfiedReason: undefined,
    actualDiscountAmount: 1000
  }
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { orderAmount } = body

  // 根据订单金额判断是否满足条件
  return mockUserCoupons.map(coupon => {
    const isSatisfied = coupon.minAmount === 0 || (orderAmount && orderAmount >= coupon.minAmount)
    return {
      ...coupon,
      isSatisfied,
      unsatisfiedReason: isSatisfied ? undefined : `订单金额未满${coupon.minAmount / 100}元`,
      actualDiscountAmount: isSatisfied ? coupon.discountAmount : 0
    }
  })
})
