import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDate,
  formatTime,
  formatPast,
  formatAxis,
  formatPast2,
  getWeek,
  beginOfDay,
  endOfDay,
  betweenDay,
  isSameDay,
  getCurrentDate,
  calculateCountdownDays,
  defaultShortcuts
} from '~/utils/formatTime'

describe('formatTime 工具函数', () => {
  describe('formatDate', () => {
    it('应该正确格式化日期', () => {
      const date = new Date('2024-03-27 14:30:00')
      expect(formatDate(date)).toBe('2024-03-27 14:30:00')
    })

    it('应该支持自定义格式', () => {
      const date = new Date('2024-03-27 14:30:00')
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-03-27')
      expect(formatDate(date, 'HH:mm:ss')).toBe('14:30:00')
    })

    it('空值应该返回空字符串', () => {
      expect(formatDate(undefined)).toBe('')
      expect(formatDate(null as any)).toBe('')
    })

    it('应该支持时间戳', () => {
      const timestamp = new Date('2024-03-27 14:30:00').getTime()
      expect(formatDate(timestamp)).toBe('2024-03-27 14:30:00')
    })
  })

  describe('formatTime', () => {
    it('应该格式化为HH:mm:ss格式', () => {
      const date = new Date('2024-03-27 14:30:45')
      expect(formatTime(date)).toMatch(/14:30:45/)
    })
  })

  describe('formatPast', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('10秒内应该返回"刚刚"', () => {
      const now = new Date('2024-03-27 14:30:00')
      vi.setSystemTime(now)
      const past = new Date('2024-03-27 14:29:55')
      expect(formatPast(past)).toBe('刚刚')
    })

    it('1分钟内应该返回秒数', () => {
      const now = new Date('2024-03-27 14:30:00')
      vi.setSystemTime(now)
      const past = new Date('2024-03-27 14:29:30')
      expect(formatPast(past)).toBe('30秒前')
    })

    it('1小时内应该返回分钟数', () => {
      const now = new Date('2024-03-27 14:30:00')
      vi.setSystemTime(now)
      const past = new Date('2024-03-27 13:45:00')
      expect(formatPast(past)).toBe('45分钟前')
    })

    it('24小时内应该返回小时数', () => {
      const now = new Date('2024-03-27 14:30:00')
      vi.setSystemTime(now)
      const past = new Date('2024-03-27 10:30:00')
      expect(formatPast(past)).toBe('4小时前')
    })

    it('3天内应该返回天数', () => {
      const now = new Date('2024-03-27 14:30:00')
      vi.setSystemTime(now)
      const past = new Date('2024-03-25 14:30:00')
      expect(formatPast(past)).toBe('2天前')
    })

    it('超过3天应该返回格式化日期', () => {
      const now = new Date('2024-03-27 14:30:00')
      vi.setSystemTime(now)
      const past = new Date('2024-03-20 10:00:00')
      expect(formatPast(past)).toBe('2024-03-20 10:00:00')
    })
  })

  describe('formatAxis', () => {
    it('应该根据小时返回正确问候语', () => {
      expect(formatAxis(new Date('2024-03-27 04:00:00'))).toBe('凌晨好')
      expect(formatAxis(new Date('2024-03-27 07:00:00'))).toBe('早上好')
      expect(formatAxis(new Date('2024-03-27 10:00:00'))).toBe('上午好')
      expect(formatAxis(new Date('2024-03-27 12:00:00'))).toBe('中午好')
      expect(formatAxis(new Date('2024-03-27 15:00:00'))).toBe('下午好')
      expect(formatAxis(new Date('2024-03-27 18:00:00'))).toBe('傍晚好')
      expect(formatAxis(new Date('2024-03-27 20:00:00'))).toBe('晚上好')
      expect(formatAxis(new Date('2024-03-27 23:00:00'))).toBe('夜里好')
    })
  })

  describe('formatPast2', () => {
    it('应该正确格式化毫秒为可读时间', () => {
      expect(formatPast2(1000)).toBe('1 秒')
      expect(formatPast2(60000)).toBe('1 分钟')
      expect(formatPast2(3600000)).toBe('1 小时 0 分钟')
      expect(formatPast2(86400000)).toBe('1 天0 小时 0 分钟')
    })

    it('应该处理0毫秒', () => {
      expect(formatPast2(0)).toBe('0 秒')
    })
  })

  describe('getWeek', () => {
    it('应该返回正确的周数', () => {
      const date = new Date('2024-03-27')
      const week = getWeek(date)
      expect(week).toBeGreaterThan(0)
      expect(week).toBeLessThanOrEqual(53)
    })
  })

  describe('beginOfDay', () => {
    it('应该返回当天开始时间', () => {
      const date = new Date('2024-03-27 14:30:00')
      const start = beginOfDay(date)
      expect(start.getHours()).toBe(0)
      expect(start.getMinutes()).toBe(0)
      expect(start.getSeconds()).toBe(0)
    })
  })

  describe('endOfDay', () => {
    it('应该返回当天结束时间', () => {
      const date = new Date('2024-03-27 14:30:00')
      const end = endOfDay(date)
      expect(end.getHours()).toBe(23)
      expect(end.getMinutes()).toBe(59)
      expect(end.getSeconds()).toBe(59)
    })
  })

  describe('betweenDay', () => {
    it('应该计算正确的天数差', () => {
      const date1 = new Date('2024-03-20')
      const date2 = new Date('2024-03-27')
      expect(betweenDay(date1, date2)).toBe(7)
    })

    it('同一天应该返回0', () => {
      const date = new Date('2024-03-27')
      expect(betweenDay(date, date)).toBe(0)
    })
  })

  describe('isSameDay', () => {
    it('同一天应该返回true', () => {
      const date1 = new Date('2024-03-27 10:00:00')
      const date2 = new Date('2024-03-27 20:00:00')
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('不同天应该返回false', () => {
      const date1 = new Date('2024-03-27')
      const date2 = new Date('2024-03-28')
      expect(isSameDay(date1, date2)).toBe(false)
    })

    it('空值应该返回false', () => {
      expect(isSameDay(null as any, new Date())).toBe(false)
      expect(isSameDay(new Date(), null as any)).toBe(false)
    })
  })

  describe('getCurrentDate', () => {
    it('应该返回当前日期字符串', () => {
      const result = getCurrentDate()
      expect(result).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    })

    it('应该支持自定义格式', () => {
      const result = getCurrentDate('YYYY-MM-DD')
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/)
    })
  })

  describe('calculateCountdownDays', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-03-27'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('应该计算正确的倒计时天数', () => {
      expect(calculateCountdownDays('2024-03-30')).toBe(3)
    })

    it('过去日期应该加一年计算', () => {
      expect(calculateCountdownDays('2024-01-01')).toBe(280) // 到2025-01-01
    })

    it('无效日期应该抛出错误', () => {
      expect(() => calculateCountdownDays('invalid')).toThrow('无效的日期格式')
    })
  })

  describe('defaultShortcuts', () => {
    it('应该包含6个快捷选项', () => {
      expect(defaultShortcuts).toHaveLength(6)
      expect(defaultShortcuts[0].text).toBe('今天')
      expect(defaultShortcuts[1].text).toBe('昨天')
      expect(defaultShortcuts[2].text).toBe('最近七天')
      expect(defaultShortcuts[3].text).toBe('最近 30 天')
      expect(defaultShortcuts[4].text).toBe('本月')
      expect(defaultShortcuts[5].text).toBe('今年')
    })

    it('快捷选项值应该是函数', () => {
      defaultShortcuts.forEach(shortcut => {
        expect(typeof shortcut.value).toBe('function')
      })
    })
  })
})
