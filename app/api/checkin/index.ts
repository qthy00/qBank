import type {
  CheckinRecordVO,
  CheckinStatsVO,
  CheckinCalendarVO,
  CheckinReqVO,
  CheckinRespVO,
  GetCalendarReqVO,
  MakeupCheckinReqVO,
  CheckinRuleVO
} from '~/types/checkin'
import { httpGet, httpPost } from '~/composables/useHttp'
import {
  mockCheckinStats,
  mockCheckinRecordList,
  generateMockCalendar,
  mockDoCheckin,
  mockCheckinRules
} from './mock'

/**
 * 是否启用Mock数据
 * 可通过环境变量或手动切换
 */
const ENABLE_MOCK = true

/**
 * 延迟模拟，模拟网络请求延迟
 */
const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取今日打卡状态
 * @description 查询用户今日是否已打卡及连续打卡天数
 */
export const getTodayCheckinStatus = async () => {
  if (ENABLE_MOCK) {
    await mockDelay()
    return { ...mockCheckinStats }
  }
  return await httpGet<CheckinStatsVO>('TodayCheckinStatus', '/member/checkin/status')
}

/**
 * 执行打卡
 * @param data 打卡请求数据
 * @description 用户进行每日打卡
 */
export const doCheckin = async (data?: CheckinReqVO) => {
  if (ENABLE_MOCK) {
    await mockDelay(500)
    /* 更新今日状态 */
    mockCheckinStats.todayCheckedIn = true
    mockCheckinStats.todayCheckinTime = Date.now()
    mockCheckinStats.continuousDays++
    mockCheckinStats.totalDays++
    mockCheckinStats.monthDays++
    mockCheckinStats.yearDays++
    return mockDoCheckin()
  }
  return await httpPost<CheckinRespVO>('DoCheckin', '/member/checkin/do', data)
}

/**
 * 获取打卡日历
 * @param params 查询参数（年份、月份）
 * @description 获取指定月份的打卡日历数据
 */
export const getCheckinCalendar = async (params: GetCalendarReqVO) => {
  if (ENABLE_MOCK) {
    await mockDelay()
    return generateMockCalendar(params.year, params.month)
  }
  return await httpGet<CheckinCalendarVO>('CheckinCalendar', '/member/checkin/calendar', {
    query: params
  })
}

/**
 * 获取打卡记录列表
 * @param params 分页参数
 * @description 分页查询历史打卡记录
 */
export const getCheckinRecordList = async (params?: { pageNo?: number; pageSize?: number }) => {
  if (ENABLE_MOCK) {
    await mockDelay()
    const pageNo = params?.pageNo || 1
    const pageSize = params?.pageSize || 10
    const start = (pageNo - 1) * pageSize
    return mockCheckinRecordList.slice(start, start + pageSize)
  }
  return await httpGet<CheckinRecordVO[]>('CheckinRecordList', '/member/checkin/list', {
    query: params
  })
}

/**
 * 获取打卡统计
 * @description 获取用户累计打卡统计数据
 */
export const getCheckinStats = async () => {
  if (ENABLE_MOCK) {
    await mockDelay()
    return { ...mockCheckinStats }
  }
  return await httpGet<CheckinStatsVO>('CheckinStats', '/member/checkin/stats')
}

/**
 * 申请补卡
 * @param data 补卡请求数据
 * @description 对漏打卡日期申请补卡
 */
export const applyMakeupCheckin = async (data: MakeupCheckinReqVO) => {
  if (ENABLE_MOCK) {
    await mockDelay(500)
    const record: CheckinRecordVO = {
      id: Date.now(),
      userId: 1,
      checkinDate: data.date,
      checkinTime: Date.now(),
      status: 2, /* 补卡状态 */
      continuousDays: mockCheckinStats.continuousDays,
      points: 5, /* 补卡积分减半 */
      remark: data.reason || '补卡'
    }
    return record
  }
  return await httpPost<CheckinRecordVO>('MakeupCheckin', '/member/checkin/makeup', data)
}

/**
 * 获取打卡规则
 * @description 获取系统配置的打卡规则
 */
export const getCheckinRules = async () => {
  if (ENABLE_MOCK) {
    await mockDelay()
    return { ...mockCheckinRules }
  }
  return await httpGet<CheckinRuleVO>('CheckinRules', '/member/checkin/rules')
}
