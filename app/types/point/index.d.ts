/**
 * 积分系统类型定义
 *
 * 包含积分记录、积分规则等相关类型
 */

/**
 * 积分记录视图对象
 */
export interface PointRecordVO {
  /** 记录ID */
  id: number
  /** 积分变动标题 */
  title: string
  /** 积分变动描述 */
  description: string
  /** 变动积分（正数表示收入，负数表示支出） */
  point: number
  /** 记录创建时间 */
  createTime: string
}

/**
 * 积分记录分页响应
 */
export interface PointRecordPageRespVO {
  /** 数据列表 */
  list: PointRecordVO[]
  /** 总记录数 */
  total: number
}

/**
 * 积分记录查询参数
 */
export interface PointRecordPageReqVO {
  /** 页码，默认1 */
  pageNo?: number
  /** 每页数量，默认10 */
  pageSize?: number
  /** 筛选条件：true-收入，false-支出，null-全部 */
  addStatus?: boolean | null
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
}

/**
 * 积分规则
 */
export interface PointRuleVO {
  /** 获取方式 */
  name: string
  /** 积分值 */
  point: number
  /** 说明 */
  description: string
}

/**
 * 积分统计
 */
export interface PointStatisticsVO {
  /** 总积分收入 */
  totalIncome: number
  /** 总积分支出 */
  totalExpense: number
  /** 当前余额 */
  currentBalance: number
  /** 本月收入 */
  monthIncome: number
  /** 本月支出 */
  monthExpense: number
}
