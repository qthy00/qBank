/**
 * 排行榜模块类型定义
 */

/**
 * 榜单类型
 */
export type RankingType = 'question_count' | 'accuracy_rate' | 'study_duration'

/**
 * 时间维度
 */
export type TimeDimension = 'day' | 'week' | 'month' | 'total'

/**
 * 榜单项视图对象
 */
export interface RankingItemVO {
  /** 排名 */
  rank: number
  /** 用户ID */
  userId: number
  /** 用户昵称 */
  nickname: string
  /** 用户头像 */
  avatar?: string
  /** 数据值（根据榜单类型不同） */
  value: number
  /** 格式化后的值 */
  valueText: string
  /** 趋势：up-上升 down-下降 same-持平 */
  trend?: 'up' | 'down' | 'same'
  /** 趋势值（排名变化） */
  trendValue?: number
  /** 是否当前用户 */
  isCurrentUser?: boolean
}

/**
 * 排行榜列表响应
 */
export interface RankingListRespVO {
  /** 榜单列表 */
  list: RankingItemVO[]
  /** 当前用户排名信息（如果上榜） */
  userRank?: RankingItemVO
  /** 更新时间 */
  updateTime: string
  /** 榜单类型 */
  rankingType: RankingType
  /** 时间维度 */
  timeDimension: TimeDimension
}

/**
 * 排行榜请求参数
 */
export interface RankingListReqVO {
  /** 榜单类型 */
  type: RankingType
  /** 时间维度 */
  dimension: TimeDimension
  /** 榜单数量（默认10） */
  limit?: number
}

/**
 * 用户排名详情
 */
export interface UserRankingDetailVO {
  /** 做题数排名 */
  questionCountRank?: RankingItemVO
  /** 正确率排名 */
  accuracyRateRank?: RankingItemVO
  /** 学习时长排名 */
  studyDurationRank?: RankingItemVO
  /** 综合排名 */
  comprehensiveRank?: number
}

/**
 * 榜单统计信息
 */
export interface RankingStatsVO {
  /** 总参与人数 */
  totalParticipants: number
  /** 今日活跃人数 */
  todayActiveUsers: number
  /** 榜单更新时间 */
  updateTime: string
}

/**
 * 排行榜类型配置
 */
export interface RankingTypeConfig {
  /** 类型标识 */
  type: RankingType
  /** 类型名称 */
  name: string
  /** 类型图标 */
  icon: string
  /** 单位 */
  unit: string
  /** 值格式化函数 */
  formatValue: (value: number) => string
}

/**
 * 时间维度配置
 */
export interface TimeDimensionConfig {
  /** 维度标识 */
  dimension: TimeDimension
  /** 维度名称 */
  name: string
}
