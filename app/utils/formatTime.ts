import dayjs from 'dayjs'
import type { TableColumnCtx } from 'element-plus'

/**
 * 日期快捷选项适用于 el-date-picker
 */
export const defaultShortcuts = [
  {
    text: '今天',
    value: () => {
      return new Date()
    }
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return [date, date]
    }
  },
  {
    text: '最近七天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return [date, new Date()]
    }
  },
  {
    text: '最近 30 天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
      return [date, new Date()]
    }
  },
  {
    text: '本月',
    value: () => {
      const date = new Date()
      date.setDate(1) // 设置为当前月的第一天
      return [date, new Date()]
    }
  },
  {
    text: '今年',
    value: () => {
      const date = new Date()
      return [new Date(`${date.getFullYear()}-01-01`), date]
    }
  }
]

/**
 * 时间日期转换
 * @param date 当前时间，new Date() 格式
 * @param format 需要转换的时间格式字符串
 * @description format 字符串随意，如 `YYYY-MM、YYYY-MM-DD`
 * @description format 季度："YYYY-MM-DD HH:mm:ss QQQQ"
 * @description format 星期："YYYY-MM-DD HH:mm:ss WWW"
 * @description format 几周："YYYY-MM-DD HH:mm:ss ZZZ"
 * @description format 季度 + 星期 + 几周："YYYY-MM-DD HH:mm:ss WWW QQQQ ZZZ"
 * @returns 返回拼接后的时间字符串
 */
export function formatDate(date: Date | number | undefined, format?: string): string {
  // 日期不存在，则返回空
  if (!date) {
    return ''
  }
  // 日期存在，则进行格式化
  return date ? dayjs(date).format(format ?? 'YYYY-MM-DD HH:mm:ss') : ''
}

/**
 * 格式化时间为 HH:mm:ss 格式
 * @param date 日期对象
 * @param timeZone 可选时区
 * @returns 格式化的时间字符串
 */
export function formatTime(date: Date, timeZone?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }

  if (timeZone) {
    options.timeZone = timeZone
  }

  return new Intl.DateTimeFormat('zh-CN', options).format(date)
}

/**
 * 获取指定时区的当前时间
 * @param date 基准日期
 * @param timeZone 目标时区
 * @returns 指定时区的日期对象
 */
export function getTimeInTimeZone(date: Date, timeZone: string): Date {
  // 注意：这是一个简化的实现，在实际应用中应该使用更精确的时区库如date-fns-tz或moment-timezone
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000
  const options = { timeZone }
  const formatted = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...options,
  }).format(date)

  // 解析格式化后的字符串
  const [datePart, timePart] = formatted.split(', ')
  const [month, day, year] = datePart.split('/').map(Number)
  const [hour, minute, second] = timePart.split(':').map(Number)

  return new Date(year, month - 1, day, hour, minute, second)
}

/**
 * 格式化时区偏移量为 ±HH:mm 格式
 * @param offset 时区偏移量（小时）
 * @returns 格式化的偏移量字符串
 */
export function formatOffset(offset: number): string {
  const sign = offset >= 0 ? '+' : '-'
  const absOffset = Math.abs(offset)
  const hours = Math.floor(absOffset)
  const minutes = Math.round((absOffset - hours) * 60)

  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

/**
 * 从时区名称获取时区偏移量
 * @param timeZone 时区名称
 * @returns 时区偏移量（小时）
 */
export function getOffsetFromTimeZone(timeZone: string): number {
  // 这是一个简化的实现，仅适用于示例中的固定时区
  // 在实际应用中应该使用完整的时区数据库
  const cityData = [
    { timeZone: 'Asia/Shanghai', offset: 8 },
    { timeZone: 'Asia/Hong_Kong', offset: 8 },
    { timeZone: 'Asia/Taipei', offset: 8 },
    { timeZone: 'Asia/Tokyo', offset: 9 },
    { timeZone: 'Asia/Seoul', offset: 9 },
    { timeZone: 'Asia/Singapore', offset: 8 },
    { timeZone: 'Asia/Bangkok', offset: 7 },
    { timeZone: 'Australia/Sydney', offset: 10 },
    { timeZone: 'Australia/Melbourne', offset: 10 },
    { timeZone: 'Europe/London', offset: 0 },
    { timeZone: 'Europe/Paris', offset: 1 },
    { timeZone: 'Europe/Berlin', offset: 1 },
    { timeZone: 'Europe/Rome', offset: 1 },
    { timeZone: 'Europe/Moscow', offset: 3 },
    { timeZone: 'America/New_York', offset: -5 },
    { timeZone: 'America/Los_Angeles', offset: -8 },
    { timeZone: 'America/Chicago', offset: -6 },
    { timeZone: 'America/Toronto', offset: -5 },
    { timeZone: 'America/Vancouver', offset: -8 },
    { timeZone: 'America/Mexico_City', offset: -6 },
    { timeZone: 'America/Sao_Paulo', offset: -3 },
    { timeZone: 'Africa/Cairo', offset: 2 },
    { timeZone: 'Africa/Johannesburg', offset: 2 },
    { timeZone: 'Asia/Dubai', offset: 4 },
    { timeZone: 'Europe/Istanbul', offset: 3 },
    { timeZone: 'Asia/Kuala_Lumpur', offset: 8 },
    { timeZone: 'Asia/Jakarta', offset: 7 },
    { timeZone: 'Asia/Kolkata', offset: 5.5 },
  ]

  const city = cityData.find((c) => c.timeZone === timeZone)
  return city ? city.offset : 0
}



// 工具函数：格式化文件日期 返回 `2023年11月11日 11:11`
export function formatFileDate(timestamp: number): string {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * 获取当前的日期+时间
 */
export function getNowDateTime() {
  return dayjs()
}

/**
 * 获取当前日期是第几周
 * @param dateTime 当前传入的日期值
 * @returns 返回第几周数字值
 */
export function getWeek(dateTime: Date): number {
  const temptTime = new Date(dateTime.getTime())
  // 周几
  const weekday = temptTime.getDay() || 7
  // 周1+5天=周六
  temptTime.setDate(temptTime.getDate() - weekday + 1 + 5)
  let firstDay = new Date(temptTime.getFullYear(), 0, 1)
  const dayOfWeek = firstDay.getDay()
  let spendDay = 1
  if (dayOfWeek != 0) spendDay = 7 - dayOfWeek + 1
  firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay)
  const d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000)
  return Math.ceil(d / 7)
}

/**
 * 将时间转换为 `几秒前`、`几分钟前`、`几小时前`、`几天前`
 * @param param 当前时间，new Date() 格式或者字符串时间格式
 * @param format 需要转换的时间格式字符串
 * @description param 10秒：  10 * 1000
 * @description param 1分：   60 * 1000
 * @description param 1小时： 60 * 60 * 1000
 * @description param 24小时：60 * 60 * 24 * 1000
 * @description param 3天：   60 * 60* 24 * 1000 * 3
 * @returns 返回拼接后的时间字符串
 */
export function formatPast(param: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  // 传入格式处理、存储转换值
  let t: any, s: number
  // 获取js 时间戳
  let time: number = new Date().getTime()
  // 是否是对象
  typeof param === 'string' || 'object' ? (t = new Date(param).getTime()) : (t = param)
  // 当前时间戳 - 传入时间戳
  time = Number.parseInt(`${time - t}`)
  if (time < 10000) {
    // 10秒内
    return '刚刚'
  } else if (time < 60000 && time >= 10000) {
    // 超过10秒少于1分钟内
    s = Math.floor(time / 1000)
    return `${s}秒前`
  } else if (time < 3600000 && time >= 60000) {
    // 超过1分钟少于1小时
    s = Math.floor(time / 60000)
    return `${s}分钟前`
  } else if (time < 86400000 && time >= 3600000) {
    // 超过1小时少于24小时
    s = Math.floor(time / 3600000)
    return `${s}小时前`
  } else if (time < 259200000 && time >= 86400000) {
    // 超过1天少于3天内
    s = Math.floor(time / 86400000)
    return `${s}天前`
  } else {
    // 超过3天
    const date = typeof param === 'string' || 'object' ? new Date(param) : param
    return formatDate(date, format)
  }
}

/**
 * 时间问候语
 * @param param 当前时间，new Date() 格式
 * @description param 调用 `formatAxis(new Date())` 输出 `上午好`
 * @returns 返回拼接后的时间字符串
 */
export function formatAxis(param: Date): string {
  const hour: number = new Date(param).getHours()
  if (hour < 6) return '凌晨好'
  else if (hour < 9) return '早上好'
  else if (hour < 12) return '上午好'
  else if (hour < 14) return '中午好'
  else if (hour < 17) return '下午好'
  else if (hour < 19) return '傍晚好'
  else if (hour < 22) return '晚上好'
  else return '夜里好'
}

/**
 * 将毫秒，转换成时间字符串。例如说，xx 分钟
 *
 * @param ms 毫秒
 * @returns {string} 字符串
 */
export function formatPast2(ms: number): string {
  const day = Math.floor(ms / (24 * 60 * 60 * 1000))
  const hour = Math.floor(ms / (60 * 60 * 1000) - day * 24)
  const minute = Math.floor(ms / (60 * 1000) - day * 24 * 60 - hour * 60)
  const second = Math.floor(ms / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60)
  if (day > 0) {
    return day + ' 天' + hour + ' 小时 ' + minute + ' 分钟'
  }
  if (hour > 0) {
    return hour + ' 小时 ' + minute + ' 分钟'
  }
  if (minute > 0) {
    return minute + ' 分钟'
  }
  if (second > 0) {
    return second + ' 秒'
  } else {
    return 0 + ' 秒'
  }
}

/**
 * element plus 的时间 Formatter 实现，使用 YYYY-MM-DD HH:mm:ss 格式
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
export function dateFormatter(_row: any, _column: TableColumnCtx<any>, cellValue: any): string {
  return cellValue ? formatDate(cellValue) : ''
}

/**
 * element plus 的时间 Formatter 实现，使用 YYYY-MM-DD 格式
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
export function dateFormatter2(_row: any, _column: TableColumnCtx<any>, cellValue: any): string {
  return cellValue ? formatDate(cellValue, 'YYYY-MM-DD') : ''
}

/**
 * 设置起始日期，时间为00:00:00
 * @param param 传入日期
 * @returns 带时间00:00:00的日期
 */
export function beginOfDay(param: Date): Date {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 0, 0, 0)
}

/**
 * 设置结束日期，时间为23:59:59
 * @param param 传入日期
 * @returns 带时间23:59:59的日期
 */
export function endOfDay(param: Date): Date {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 23, 59, 59)
}

/**
 * 计算两个日期间隔天数
 * @param param1 日期1
 * @param param2 日期2
 */
export function betweenDay(param1: Date, param2: Date): number {
  param1 = convertDate(param1)
  param2 = convertDate(param2)
  // 计算差值
  return Math.floor((param2.getTime() - param1.getTime()) / (24 * 3600 * 1000))
}

/**
 * 日期计算
 * @param param1 日期
 * @param param2 添加的时间
 */
export function addTime(param1: Date, param2: number): Date {
  param1 = convertDate(param1)
  return new Date(param1.getTime() + param2)
}

/**
 * 日期转换
 * @param param 日期
 */
export function convertDate(param: Date | string): Date {
  if (typeof param === 'string') {
    return new Date(param)
  }
  return param
}

/**
 * 指定的两个日期, 是否为同一天
 * @param a 日期 A
 * @param b 日期 B
 */
export function isSameDay(a: dayjs.ConfigType, b: dayjs.ConfigType): boolean {
  if (!a || !b) return false

  const aa = dayjs(a)
  const bb = dayjs(b)
  return aa.year() == bb.year() && aa.month() == bb.month() && aa.day() == bb.day()
}

/**
 * 获取一天的开始时间、截止时间
 * @param date 日期
 * @param days 天数
 */
export function getDayRange(
  date: dayjs.ConfigType,
  days: number
): [dayjs.ConfigType, dayjs.ConfigType] {
  const day = dayjs(date).add(days, 'd')
  return getDateRange(day, day)
}

/**
 * 获取最近7天的开始时间、截止时间
 */
export function getLast7Days(): [dayjs.ConfigType, dayjs.ConfigType] {
  const lastWeekDay = dayjs().subtract(7, 'd')
  const yesterday = dayjs().subtract(1, 'd')
  return getDateRange(lastWeekDay, yesterday)
}

/**
 * 获取最近30天的开始时间、截止时间
 */
export function getLast30Days(): [dayjs.ConfigType, dayjs.ConfigType] {
  const lastMonthDay = dayjs().subtract(30, 'd')
  const yesterday = dayjs().subtract(1, 'd')
  return getDateRange(lastMonthDay, yesterday)
}

/**
 * 获取最近1年的开始时间、截止时间
 */
export function getLast1Year(): [dayjs.ConfigType, dayjs.ConfigType] {
  const lastYearDay = dayjs().subtract(1, 'y')
  const yesterday = dayjs().subtract(1, 'd')
  return getDateRange(lastYearDay, yesterday)
}

/**
 * 获取指定日期的开始时间、截止时间
 * @param beginDate 开始日期
 * @param endDate 截止日期
 */
export function getDateRange(
  beginDate: dayjs.ConfigType,
  endDate: dayjs.ConfigType
): [string, string] {
  return [
    dayjs(beginDate).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
    dayjs(endDate).endOf('d').format('YYYY-MM-DD HH:mm:ss')
  ]
}


export function getTomorrowZeroTimestamp(): number {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return tomorrow.getTime();
}


/**
 * 获取当前时间，格式为 YYYY-MM-DD HH:mm:ss
 * @param format
 */
export function getCurrentDate(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return  dayjs().format(format)
}

