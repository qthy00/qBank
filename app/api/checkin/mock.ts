import type {
  CheckinStatsVO,
  CheckinCalendarVO,
  CheckinRecordVO,
  CheckinRespVO,
  CheckinRuleVO
} from '~/types/checkin'

/**
 * Mock打卡统计数据
 */
export const mockCheckinStats: CheckinStatsVO = {
  userId: 1,
  continuousDays: 7,
  totalDays: 45,
  monthDays: 15,
  yearDays: 45,
  todayCheckedIn: false,
  todayCheckinTime: undefined
}

/**
 * Mock打卡记录列表
 */
export const mockCheckinRecordList: CheckinRecordVO[] = [
  {
    id: 1,
    userId: 1,
    checkinDate: '2026-03-19',
    checkinTime: 1742371200000,
    status: 1,
    continuousDays: 6,
    points: 10,
    remark: '正常打卡'
  },
  {
    id: 2,
    userId: 1,
    checkinDate: '2026-03-18',
    checkinTime: 1742284800000,
    status: 1,
    continuousDays: 5,
    points: 10,
    remark: '正常打卡'
  },
  {
    id: 3,
    userId: 1,
    checkinDate: '2026-03-17',
    checkinTime: 1742198400000,
    status: 1,
    continuousDays: 4,
    points: 10,
    remark: '正常打卡'
  },
  {
    id: 4,
    userId: 1,
    checkinDate: '2026-03-16',
    checkinTime: 1742112000000,
    status: 1,
    continuousDays: 3,
    points: 10,
    remark: '正常打卡'
  },
  {
    id: 5,
    userId: 1,
    checkinDate: '2026-03-15',
    checkinTime: 1742025600000,
    status: 1,
    continuousDays: 2,
    points: 10,
    remark: '正常打卡'
  },
  {
    id: 6,
    userId: 1,
    checkinDate: '2026-03-14',
    checkinTime: 1741939200000,
    status: 1,
    continuousDays: 1,
    points: 10,
    remark: '正常打卡'
  },
  {
    id: 7,
    userId: 1,
    checkinDate: '2026-03-13',
    checkinTime: 1741852800000,
    status: 1,
    continuousDays: 1,
    points: 10,
    remark: '正常打卡'
  }
]

/**
 * 生成指定月份的日历数据
 * @param year 年份
 * @param month 月份
 */
export const generateMockCalendar = (year: number, month: number): CheckinCalendarVO => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const calendarList = []
  let monthCheckinDays = 0

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isToday = dateStr === new Date().toISOString().split('T')[0]

    /* 模拟打卡数据：最近7天有打卡记录（除今天外） */
    const today = new Date()
    const currentDate = new Date(year, month - 1, day)
    const diffDays = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
    const checkedIn = diffDays > 0 && diffDays <= 7

    if (checkedIn) {
      monthCheckinDays++
    }

    calendarList.push({
      date: dateStr,
      checkedIn,
      isToday,
      points: checkedIn ? 10 : 0
    })
  }

  return {
    year,
    month,
    calendarList,
    monthCheckinDays
  }
}

/**
 * Mock打卡响应
 */
export const mockDoCheckin = (): CheckinRespVO => {
  const today = new Date().toISOString().split('T')[0]
  return {
    record: {
      id: Date.now(),
      userId: 1,
      checkinDate: today,
      checkinTime: Date.now(),
      status: 1,
      continuousDays: 8,
      points: 15,
      remark: '正常打卡'
    },
    continuousDays: 8,
    earnedPoints: 15,
    isFirstCheckin: false
  }
}

/**
 * Mock打卡规则
 */
export const mockCheckinRules: CheckinRuleVO = {
  basePoints: 10,
  continuousBonusRate: 0.1,
  maxBonusDays: 7,
  allowMakeup: true,
  maxMakeupPerMonth: 3
}
