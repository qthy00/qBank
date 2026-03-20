/**
 * Mock 我的优惠券列表
 */

import { defineEventHandler, getQuery } from 'h3'

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
    status: 1, // 未使用
    validStartTime: Date.now() - 86400000,
    validEndTime: Date.now() + 86400000 * 29,
    useTime: null,
    orderId: null,
    createTime: Date.now() - 86400000,
    statusName: '未使用',
    typeName: '无门槛券',
    isExpiringSoon: false,
    expireCountdown: 86400 * 29
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
    validEndTime: Date.now() + 86400000 * 2, // 即将过期
    useTime: null,
    orderId: null,
    createTime: Date.now() - 86400000 * 5,
    statusName: '未使用',
    typeName: '满减券',
    isExpiringSoon: true,
    expireCountdown: 86400 * 2
  },
  {
    id: 3,
    couponId: 3,
    couponName: '8折优惠券',
    type: 2,
    discountAmount: 0,
    discountPercent: 80,
    minAmount: 0,
    status: 2, // 已使用
    validStartTime: Date.now() - 86400000 * 10,
    validEndTime: Date.now() + 86400000 * 20,
    useTime: Date.now() - 86400000 * 2,
    orderId: 10001,
    createTime: Date.now() - 86400000 * 10,
    statusName: '已使用',
    typeName: '折扣券',
    isExpiringSoon: false,
    expireCountdown: 0
  },
  {
    id: 4,
    couponId: 5,
    couponName: '开学季特惠券',
    type: 3,
    discountAmount: 1000,
    discountPercent: 0,
    minAmount: 0,
    status: 3, // 已过期
    validStartTime: Date.now() - 86400000 * 40,
    validEndTime: Date.now() - 86400000 * 10,
    useTime: null,
    orderId: null,
    createTime: Date.now() - 86400000 * 40,
    statusName: '已过期',
    typeName: '无门槛券',
    isExpiringSoon: false,
    expireCountdown: 0
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status ? Number(query.status) : undefined

  // 根据状态筛选
  let result = mockUserCoupons
  if (status !== undefined) {
    result = mockUserCoupons.filter(c => c.status === status)
  }

  return result
})
