/**
 * 打卡记录状态枚举
 */
export enum CheckinStatusEnum {
  /** 未打卡 */
  NOT_CHECKED_IN = 0,
  /** 已打卡 */
  CHECKED_IN = 1,
  /** 补卡 */
  MAKEUP_CHECKIN = 2,
}

/**
 * 打卡记录视图对象
 */
export interface CheckinRecordVO {
  /** 记录ID */
  id: number
  /** 用户ID */
  userId: number
  /** 打卡日期 (YYYY-MM-DD格式) */
  checkinDate: string
  /** 打卡时间戳 */
  checkinTime: number
  /** 打卡状态 */
  status: number
  /** 连续打卡天数 */
  continuousDays: number
  /** 获得的积分 */
  points: number
  /** 备注 */
  remark?: string
}

/**
 * 打卡统计视图对象
 */
export interface CheckinStatsVO {
  /** 用户ID */
  userId: number
  /** 连续打卡天数 */
  continuousDays: number
  /** 总打卡天数 */
  totalDays: number
  /** 本月打卡天数 */
  monthDays: number
  /** 本年打卡天数 */
  yearDays: number
  /** 今日是否已打卡 */
  todayCheckedIn: boolean
  /** 今日打卡时间 */
  todayCheckinTime?: number
}

/**
 * 打卡日历项
 */
export interface CheckinCalendarItem {
  /** 日期 (YYYY-MM-DD格式) */
  date: string
  /** 是否已打卡 */
  checkedIn: boolean
  /** 是否是今天 */
  isToday: boolean
  /** 打卡获得的积分 */
  points: number
}

/**
 * 打卡日历响应
 */
export interface CheckinCalendarVO {
  /** 年份 */
  year: number
  /** 月份 */
  month: number
  /** 日历数据 */
  calendarList: CheckinCalendarItem[]
  /** 该月打卡天数 */
  monthCheckinDays: number
}

/**
 * 打卡请求对象
 */
export interface CheckinReqVO {
  /** 打卡备注 */
  remark?: string
}

/**
 * 打卡响应对象
 */
export interface CheckinRespVO {
  /** 打卡记录 */
  record: CheckinRecordVO
  /** 当前连续天数 */
  continuousDays: number
  /** 获得积分 */
  earnedPoints: number
  /** 是否是首次打卡 */
  isFirstCheckin: boolean
}

/**
 * 获取日历请求
 */
export interface GetCalendarReqVO {
  /** 年份 */
  year: number
  /** 月份 */
  month: number
}

/**
 * 补卡请求
 */
export interface MakeupCheckinReqVO {
  /** 补卡日期 (YYYY-MM-DD格式) */
  date: string
  /** 补卡原因 */
  reason?: string
}

/**
 * 打卡规则
 */
export interface CheckinRuleVO {
  /** 每日打卡基础积分 */
  basePoints: number
  /** 连续打卡加成比例 (例如 0.1 表示10%) */
  continuousBonusRate: number
  /** 最大连续加成天数 */
  maxBonusDays: number
  /** 是否允许补卡 */
  allowMakeup: boolean
  /** 每月补卡次数限制 */
  maxMakeupPerMonth: number
}
