


export interface AffiliateRecordVO {
  id: number
  bizId: string
  title: string
  price: number
  status: number
  createTime: number
  finishTime: number
}

export const getAffiliateRecordPage = (params: any) => {
  if (params.status === undefined) {
    delete params.status
  }
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    // 自动处理编码，无需手动 encodeURIComponent
    query.append(key, params[key])
  })
  // const queryString = Object.keys(params)
  //   .map((key) => encodeURIComponent(key) + '=' + params[key])
  //   .join('&');
  return httpGet( 'getAffiliateRecordPage', `/swap/affiliate-record/page`, {query})
}


export interface AffiliateRecordSummaryVO {
  yesterdayPrice?: number
  withdrawPrice?: number
  brokeragePrice?: number
  totalBrokeragePrice?: number
  frozenPrice?: number
  firstBrokerageUserCount?: number
  secondBrokerageUserCount?: number
  monthIncrease?: number
  monthWithdrawCount?: number
  userCount?: number
  monthUserCount?: number
}
export const getAffiliateUserSummary = () => {
  return httpGet( 'getAffiliateUserSummary', `/swap/affiliate-user/get-summary` )
}

export const getAffiliateSummary = () => {
  return httpGet( 'getAffiliateSummary', `/swap/affiliate-user/summary` )
}


export interface AffiliateUserChildSummaryVO {
  id: number
  nickname: string
  avatar: string
  brokeragePrice: number
  brokerageOrderCount: number
  brokerageUserCount: number
  brokerageTime: number
}
// 获得下级分销统计分页
export const getAffiliateUserChildSummaryPage = (query: any) => {
  return httpGet( 'getAffiliateUserChildSummaryPage',
      `/swap/affiliate-user/child-summary-page`, { query })
}

export interface AffiliateWithdrawReqVO {
  price?: number
  type?: number
  userAccount?: string
  qrCodeUrl: string[]
  userName?: string
  bankName?: string
  bankAddress?: string
  transferChannelCode?: string
}

// 创建分销提现
export const createAffiliateWithdraw = (data: any) => {
  return httpPost( 'createAffiliateWithdraw', `/swap/affiliate-withdraw/create`, data )
}

export interface AffiliateUserInfoVO {
  brokerageEnabled: boolean
  brokeragePrice: number
  frozenPrice: number
}
// 获得个人分销信息
export const getAffiliateUserInfo = () => {
  return httpGet( '', `/swap/affiliate-user/get`)
}

export interface AffiliateToolVO {
  contentId: number
  series: number
  name: string
  description: string
  icon: string
  logo: string
  enabled: boolean
  brokeragePrice: number
  price: number
  originalPrice: number
  background: string
}
// 获得分销工具信息
export const getAffiliateTool = (query: any) => {
  return httpGet( '', `/swap/affiliate-record/products`, {query})
}


// 获得分销用户排行分页（基于用户量）
export const getAffiliateUserRankPageByUserCount = (query: any) => {
  return httpGet( 'getAffiliateUserRankPageByUserCount',
      `/swap/affiliate-user/rank-page-by-user-count`, {query})
}

// 获得分销用户排行分页（基于佣金）
export const getBrokerageUserChildSummaryPageByPrice = (query:any) => {
  return httpGet( 'getBrokerageUserChildSummaryPageByPrice',
      `/swap/affiliate-user/rank-page-by-price`,{ query })
}
