/**
 * 优惠券模块类型定义
 * @description 优惠券、用户优惠券、领取记录等类型
 */

/**
 * 优惠券类型枚举
 */
export enum CouponTypeEnum {
  /** 满减券 */
  FULL_REDUCTION = 1,
  /** 折扣券 */
  DISCOUNT = 2,
  /** 无门槛券 */
  NO_THRESHOLD = 3
}

/**
 * 优惠券状态枚举
 */
export enum CouponStatusEnum {
  /** 未开始 */
  NOT_STARTED = 0,
  /** 进行中 */
  IN_PROGRESS = 1,
  /** 已结束 */
  ENDED = 2,
  /** 已停用 */
  DISABLED = 3
}

/**
 * 用户优惠券状态枚举
 */
export enum UserCouponStatusEnum {
  /** 未使用 */
  UNUSED = 1,
  /** 已使用 */
  USED = 2,
  /** 已过期 */
  EXPIRED = 3
}

/**
 * 优惠券适用类型枚举
 */
export enum CouponApplyTypeEnum {
  /** 全部商品 */
  ALL = 1,
  /** 指定分类 */
  CATEGORY = 2,
  /** 指定商品 */
  GOODS = 3
}

/**
 * 优惠券基础信息
 */
export interface Coupon {
  /** 优惠券ID */
  id: number
  /** 优惠券名称 */
  name: string
  /** 优惠券编码 */
  code: string
  /** 优惠券类型：1满减券 2折扣券 3无门槛券 */
  type: number
  /** 优惠金额（分） */
  discountAmount: number
  /** 折扣比例（如80表示8折） */
  discountPercent: number
  /** 使用门槛（分），0表示无门槛 */
  minAmount: number
  /** 每人限领数量 */
  limitPerUser: number
  /** 总发放数量，-1表示不限 */
  totalCount: number
  /** 已领取数量 */
  usedCount: number
  /** 优惠券状态：0未开始 1进行中 2已结束 3已停用 */
  status: number
  /** 开始时间 */
  startTime: number
  /** 结束时间 */
  endTime: number
  /** 优惠券描述 */
  description: string
  /** 适用类型：1全部 2指定分类 3指定商品 */
  applyType: number
  /** 适用分类ID列表（当applyType=2时） */
  applyCategoryIds: number[]
  /** 适用商品ID列表（当applyType=3时） */
  applyGoodsIds: number[]
  /** 创建时间 */
  createTime: number
}

/**
 * 优惠券VO（视图对象）
 */
export interface CouponVO extends Coupon {
  /** 优惠券状态名称 */
  statusName: string
  /** 优惠券类型名称 */
  typeName: string
  /** 是否可领取 */
  canReceive: boolean
  /** 剩余数量 */
  remainCount: number
  /** 距离结束时间（秒） */
  countdown: number
}

/**
 * 用户优惠券信息
 */
export interface UserCoupon {
  /** 用户优惠券ID */
  id: number
  /** 优惠券ID */
  couponId: number
  /** 优惠券名称 */
  couponName: string
  /** 优惠券类型 */
  type: number
  /** 优惠金额（分） */
  discountAmount: number
  /** 折扣比例 */
  discountPercent: number
  /** 使用门槛（分） */
  minAmount: number
  /** 状态：1未使用 2已使用 3已过期 */
  status: number
  /** 生效时间 */
  validStartTime: number
  /** 过期时间 */
  validEndTime: number
  /** 使用时间 */
  useTime: number | null
  /** 关联订单ID */
  orderId: number | null
  /** 创建时间 */
  createTime: number
}

/**
 * 用户优惠券VO
 */
export interface UserCouponVO extends UserCoupon {
  /** 状态名称 */
  statusName: string
  /** 类型名称 */
  typeName: string
  /** 是否即将过期（3天内） */
  isExpiringSoon: boolean
  /** 过期倒计时（秒） */
  expireCountdown: number
}

/**
 * 优惠券使用记录
 */
export interface CouponUsageRecord {
  /** 记录ID */
  id: number
  /** 优惠券ID */
  couponId: number
  /** 优惠券名称 */
  couponName: string
  /** 用户ID */
  userId: number
  /** 订单ID */
  orderId: number
  /** 订单编号 */
  orderNo: string
  /** 优惠金额（分） */
  discountAmount: number
  /** 使用时间 */
  useTime: number
}

/**
 * 领取优惠券请求
 */
export interface CouponReceiveReqVO {
  /** 优惠券ID */
  couponId: number
}

/**
 * 优惠券查询请求
 */
export interface CouponQueryReqVO {
  /** 优惠券类型 */
  type?: number
  /** 优惠券状态 */
  status?: number
  /** 页码 */
  pageNo?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 用户优惠券查询请求
 */
export interface UserCouponQueryReqVO {
  /** 状态：1未使用 2已使用 3已过期 */
  status?: number
  /** 页码 */
  pageNo?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 优惠券适用性检查请求
 */
export interface CouponCheckReqVO {
  /** 优惠券ID */
  couponId: number
  /** 商品ID */
  goodsId: number
  /** 订单金额（分） */
  orderAmount: number
}

/**
 * 优惠券适用性检查结果
 */
export interface CouponCheckResult {
  /** 是否可用 */
  available: boolean
  /** 不可用原因 */
  reason?: string
  /** 实际优惠金额（分） */
  actualDiscountAmount: number
}

/**
 * 订单可用优惠券查询请求
 */
export interface OrderCouponQueryReqVO {
  /** 商品ID */
  goodsId: number
  /** 订单金额（分） */
  orderAmount: number
}

/**
 * 订单可用优惠券
 */
export interface OrderAvailableCoupon extends UserCouponVO {
  /** 是否满足使用条件 */
  isSatisfied: boolean
  /** 不满足原因 */
  unsatisfiedReason?: string
  /** 实际优惠金额（分） */
  actualDiscountAmount: number
}

/**
 * 使用优惠券请求
 */
export interface UseCouponReqVO {
  /** 用户优惠券ID */
  userCouponId: number
  /** 订单ID */
  orderId: number
}
