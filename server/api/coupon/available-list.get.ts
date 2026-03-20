/**
 * Mock 优惠券列表
 */

import { defineEventHandler, getQuery } from 'h3'

// Mock 优惠券数据
const mockCoupons = [
  {
    id: 1,
    name: '新用户专享券',
    code: 'NEWUSER2024',
    type: 3, // 无门槛
    discountAmount: 500, // 5元
    discountPercent: 0,
    minAmount: 0,
    limitPerUser: 1,
    totalCount: 1000,
    usedCount: 356,
    status: 1, // 进行中
    startTime: Date.now() - 86400000 * 30,
    endTime: Date.now() + 86400000 * 30,
    description: '新用户注册即可领取，全场通用',
    applyType: 1, // 全部商品
    applyCategoryIds: [],
    applyGoodsIds: [],
    createTime: Date.now() - 86400000 * 30,
    statusName: '进行中',
    typeName: '无门槛券',
    canReceive: true,
    remainCount: 644,
    countdown: 86400 * 30
  },
  {
    id: 2,
    name: '满100减20',
    code: 'FULL10020',
    type: 1, // 满减券
    discountAmount: 2000, // 20元
    discountPercent: 0,
    minAmount: 10000, // 100元
    limitPerUser: 3,
    totalCount: 500,
    usedCount: 423,
    status: 1,
    startTime: Date.now() - 86400000 * 10,
    endTime: Date.now() + 86400000 * 20,
    description: '满100元可用，限题库类商品',
    applyType: 1,
    applyCategoryIds: [],
    applyGoodsIds: [],
    createTime: Date.now() - 86400000 * 10,
    statusName: '进行中',
    typeName: '满减券',
    canReceive: true,
    remainCount: 77,
    countdown: 86400 * 20
  },
  {
    id: 3,
    name: '8折优惠券',
    code: 'DISCOUNT80',
    type: 2, // 折扣券
    discountAmount: 0,
    discountPercent: 80, // 8折
    minAmount: 0,
    limitPerUser: 2,
    totalCount: 200,
    usedCount: 198,
    status: 1,
    startTime: Date.now() - 86400000 * 5,
    endTime: Date.now() + 86400000 * 10,
    description: '全场商品8折优惠，最高抵扣50元',
    applyType: 1,
    applyCategoryIds: [],
    applyGoodsIds: [],
    createTime: Date.now() - 86400000 * 5,
    statusName: '进行中',
    typeName: '折扣券',
    canReceive: true,
    remainCount: 2,
    countdown: 86400 * 10
  },
  {
    id: 4,
    name: '满200减50',
    code: 'FULL20050',
    type: 1, // 满减券
    discountAmount: 5000, // 50元
    discountPercent: 0,
    minAmount: 20000, // 200元
    limitPerUser: 1,
    totalCount: 100,
    usedCount: 100,
    status: 1,
    startTime: Date.now() - 86400000 * 15,
    endTime: Date.now() + 86400000 * 15,
    description: '满200元可用，限量发放',
    applyType: 1,
    applyCategoryIds: [],
    applyGoodsIds: [],
    createTime: Date.now() - 86400000 * 15,
    statusName: '进行中',
    typeName: '满减券',
    canReceive: false,
    remainCount: 0,
    countdown: 86400 * 15
  },
  {
    id: 5,
    name: '开学季特惠券',
    code: 'SCHOOL2024',
    type: 3, // 无门槛
    discountAmount: 1000, // 10元
    discountPercent: 0,
    minAmount: 0,
    limitPerUser: 2,
    totalCount: 2000,
    usedCount: 892,
    status: 1,
    startTime: Date.now() - 86400000 * 5,
    endTime: Date.now() + 86400000 * 25,
    description: '开学季专属优惠，所有商品可用',
    applyType: 1,
    applyCategoryIds: [],
    applyGoodsIds: [],
    createTime: Date.now() - 86400000 * 5,
    statusName: '进行中',
    typeName: '无门槛券',
    canReceive: true,
    remainCount: 1108,
    countdown: 86400 * 25
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status ? Number(query.status) : undefined

  // 根据状态筛选
  let result = mockCoupons
  if (status !== undefined) {
    result = mockCoupons.filter(c => c.status === status)
  }

  return result
})
