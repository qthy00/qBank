/**
 * 优惠券模块API接口（Mock版本）
 * @description 优惠券领取、查询、使用等接口 - 使用本地mock数据
 */

import type {
  CouponReceiveReqVO,
  CouponQueryReqVO,
  UserCouponQueryReqVO,
  OrderCouponQueryReqVO,
  CouponCheckReqVO,
  UseCouponReqVO
} from '@/types/coupon'

/**
 * 获取可领取优惠券列表（领券中心）
 * @param query 查询条件
 */
export const getAvailableCouponList = async (query?: CouponQueryReqVO) => {
  return await $fetch('/api/coupon/available-list', {
    method: 'GET',
    query
  })
}

/**
 * 获取优惠券详情
 * @param id 优惠券ID
 */
export const getCouponDetail = async (id: number) => {
  return await $fetch(`/api/coupon/get?id=${id}`)
}

/**
 * 领取优惠券
 * @param data 领取请求
 */
export const receiveCoupon = async (data: CouponReceiveReqVO) => {
  return await $fetch('/api/coupon/receive', {
    method: 'POST',
    body: data
  })
}

/**
 * 获取我的优惠券列表
 * @param query 查询条件
 */
export const getMyCouponList = async (query?: UserCouponQueryReqVO) => {
  return await $fetch('/api/coupon/my-list', {
    method: 'GET',
    query
  })
}

/**
 * 获取我的优惠券分页列表
 * @param query 查询条件
 */
export const getMyCouponPage = async (query?: UserCouponQueryReqVO) => {
  return await $fetch('/api/coupon/my-page', {
    method: 'GET',
    query
  })
}

/**
 * 获取订单可用优惠券列表
 * @param query 查询条件
 */
export const getOrderAvailableCoupons = async (query: OrderCouponQueryReqVO) => {
  return await $fetch('/api/coupon/order-available', {
    method: 'POST',
    body: query
  })
}

/**
 * 检查优惠券是否可用
 * @param data 检查请求
 */
export const checkCouponAvailable = async (data: CouponCheckReqVO) => {
  return await $fetch('/api/coupon/check', {
    method: 'POST',
    body: data
  })
}

/**
 * 使用优惠券（创建订单时调用）
 * @param data 使用请求
 */
export const useCoupon = async (data: UseCouponReqVO) => {
  return await $fetch('/api/coupon/use', {
    method: 'POST',
    body: data
  })
}

/**
 * 获取优惠券使用记录
 * @param query 查询条件
 */
export const getCouponUsageRecords = async (query?: { pageNo?: number; pageSize?: number }) => {
  return await $fetch('/api/coupon/usage-records', {
    method: 'GET',
    query
  })
}
