import type { VipPackageVO, VipBenefitVO, UserVipInfoVO, CreateVipOrderReqVO, VipOrderVO, PayParamsVO } from '~/types/vip'
import { httpGet, httpPost } from '~/composables/useHttp'

/* 是否启用Mock数据 */
const ENABLE_MOCK = true

/* ==================== Mock数据 ==================== */

/**
 * VIP套餐Mock数据 - 参考图片样式
 */
const mockVipPackages: VipPackageVO[] = [
  {
    id: 1,
    name: '月度会员',
    subtitle: '适合短期备考需求',
    duration: 1,
    durationUnit: 'month',
    originalPrice: 30,
    salePrice: 19.9,
    tag: '首月特惠',
    isRecommended: false,
    description: '适合个人用户短期使用',
    features: [
      '无限题库练习',
      '基础学习报告',
      '每日签到奖励',
      '专属客服支持',
      '移动端同步'
    ]
  },
  {
    id: 2,
    name: '季度会员',
    subtitle: '开发团队 < 10人',
    duration: 3,
    durationUnit: 'quarter',
    originalPrice: 90,
    salePrice: 49.9,
    tag: '热门',
    isRecommended: true,
    description: '性价比之选，季度备考无忧',
    features: [
      '无限题库练习',
      '智能学习分析',
      '文档下载权益',
      '去除广告打扰',
      '专属客服支持',
      '错题本功能',
      '模拟考试权限'
    ]
  },
  {
    id: 3,
    name: '年度会员',
    subtitle: '开发团队 10~30人',
    duration: 12,
    durationUnit: 'year',
    originalPrice: 360,
    salePrice: 168,
    tag: '超值',
    isRecommended: false,
    description: '全年畅享，低至4.6折',
    features: [
      '无限题库练习',
      '智能学习分析',
      '文档免费下载',
      '去除广告打扰',
      '专属客服支持',
      '错题本功能',
      '模拟考试权限',
      '考前预测题库',
      'VIP专属社群'
    ]
  }
]

/**
 * VIP权益Mock数据
 */
const mockVipBenefits: VipBenefitVO[] = [
  {
    id: 1,
    icon: 'material-symbols:library-books',
    title: '无限题库',
    description: '畅享全部题库资源，无限制刷题练习'
  },
  {
    id: 2,
    icon: 'material-symbols:download',
    title: '文档下载',
    description: '免费下载各类学习资料和真题文档'
  },
  {
    id: 3,
    icon: 'material-symbols:analytics',
    title: '智能分析',
    description: '专属学习报告，智能分析薄弱知识点'
  },
  {
    id: 4,
    icon: 'material-symbols:block',
    title: '无广告',
    description: '纯净学习环境，告别广告打扰'
  },
  {
    id: 5,
    icon: 'material-symbols:headset-mic',
    title: '专属客服',
    description: 'VIP专属客服通道，优先处理问题'
  },
  {
    id: 6,
    icon: 'material-symbols:local-fire-department',
    title: '热门预测',
    description: '考前热点预测题，抢先掌握考点'
  }
]

/**
 * 用户VIP信息Mock数据
 */
const mockUserVipInfo: UserVipInfoVO = {
  isVip: false,
  level: 0,
  levelName: '普通用户',
  expireTime: undefined,
  benefits: []
}

/**
 * 模拟订单数据
 */
let mockOrderId = 100001

/* ==================== API接口 ==================== */

/**
 * 获取VIP套餐列表
 * @returns VIP套餐列表
 */
export const getVipPackages = async (): Promise<VipPackageVO[]> => {
  if (ENABLE_MOCK) {
    /* 模拟网络延迟 */
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockVipPackages]
  }
  return await httpGet('VipPackages', '/member/vip/packages')
}

/**
 * 获取VIP权益列表
 * @returns VIP权益列表
 */
export const getVipBenefits = async (): Promise<VipBenefitVO[]> => {
  if (ENABLE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...mockVipBenefits]
  }
  return await httpGet('VipBenefits', '/member/vip/benefits')
}

/**
 * 获取用户VIP信息
 * @returns 用户VIP信息
 */
export const getUserVipInfo = async (): Promise<UserVipInfoVO> => {
  if (ENABLE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return { ...mockUserVipInfo }
  }
  return await httpGet('UserVipInfo', '/member/vip/info')
}

/**
 * 创建VIP订单
 * @param data 创建订单请求参数
 * @returns 订单信息
 */
export const createVipOrder = async (data: CreateVipOrderReqVO): Promise<VipOrderVO> => {
  if (ENABLE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const packageInfo = mockVipPackages.find(p => p.id === data.packageId)
    if (!packageInfo) {
      throw new Error('套餐不存在')
    }
    const order: VipOrderVO = {
      orderId: `VIP${Date.now()}${mockOrderId++}`,
      packageName: packageInfo.name,
      amount: packageInfo.salePrice,
      status: 'pending',
      createTime: new Date().toISOString()
    }
    return order
  }
  return await httpPost('CreateVipOrder', '/member/vip/order/create', data)
}

/**
 * 获取支付参数
 * @param orderId 订单ID
 * @returns 支付参数
 */
export const getPayParams = async (orderId: string): Promise<PayParamsVO> => {
  if (ENABLE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      orderId,
      payUrl: `https://mock.alipay.com/pay?orderId=${orderId}`,
      payData: {
        orderId,
        mock: true
      }
    }
  }
  return await httpGet('PayParams', `/member/vip/pay/params`, { query: { orderId } })
}

/**
 * 查询订单状态
 * @param orderId 订单ID
 * @returns 订单信息
 */
export const queryOrderStatus = async (orderId: string): Promise<VipOrderVO> => {
  if (ENABLE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return {
      orderId,
      packageName: '季度会员',
      amount: 49.9,
      status: 'paid',
      createTime: new Date().toISOString(),
      payTime: new Date().toISOString()
    }
  }
  return await httpGet('OrderStatus', `/member/vip/order/status`, { query: { orderId } })
}
