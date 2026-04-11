/**
 * VIP套餐类型
 */
export interface VipPackageVO {
  id: number
  name: string
  subtitle: string
  duration: number
  durationUnit: 'month' | 'quarter' | 'year'
  originalPrice: number
  salePrice: number
  tag?: string
  isRecommended?: boolean
  description?: string
  features: string[]
}

/**
 * VIP权益项
 */
export interface VipBenefitVO {
  id: number
  icon: string
  title: string
  description: string
}

/**
 * 用户VIP信息
 */
export interface UserVipInfoVO {
  isVip: boolean
  level: number
  levelName: string
  expireTime?: string
  benefits: string[]
}

/**
 * 创建VIP订单请求
 */
export interface CreateVipOrderReqVO {
  packageId: number
  payChannel: 'alipay' | 'wechat' | 'balance'
}

/**
 * VIP订单响应
 */
export interface VipOrderVO {
  orderId: string
  packageName: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled'
  createTime: string
  payTime?: string
}

/**
 * 支付参数（用于调起支付）
 */
export interface PayParamsVO {
  orderId: string
  payUrl?: string
  payData?: Record<string, any>
}
