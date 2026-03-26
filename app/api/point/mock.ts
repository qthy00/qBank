import type {
  PointRecordVO,
  PointRecordPageRespVO,
  PointRecordPageReqVO,
  PointRuleVO,
  PointStatisticsVO
} from '~/types/point'

/**
 * 积分系统 Mock 数据
 */

/* ==================== 积分记录数据 ==================== */

/**
 * Mock 积分记录列表
 */
export const mockPointRecords: PointRecordVO[] = [
  {
    id: 1001,
    title: '每日签到',
    description: '连续签到7天奖励',
    point: 20,
    createTime: '2026-03-26 09:00:00'
  },
  {
    id: 1002,
    title: '积分兑换',
    description: '兑换优惠券',
    point: -100,
    createTime: '2026-03-25 14:30:00'
  },
  {
    id: 1003,
    title: '完善资料',
    description: '首次完善个人信息',
    point: 50,
    createTime: '2026-03-25 10:15:00'
  },
  {
    id: 1004,
    title: '每日签到',
    description: '连续签到6天',
    point: 15,
    createTime: '2026-03-25 09:00:00'
  },
  {
    id: 1005,
    title: '消费返积分',
    description: '订单消费返积分（订单金额99元）',
    point: 99,
    createTime: '2026-03-24 16:20:00'
  },
  {
    id: 1006,
    title: '绑定手机',
    description: '首次绑定手机号',
    point: 30,
    createTime: '2026-03-24 11:00:00'
  },
  {
    id: 1007,
    title: '每日签到',
    description: '连续签到5天',
    point: 12,
    createTime: '2026-03-24 09:00:00'
  },
  {
    id: 1008,
    title: '积分兑换',
    description: '兑换会员体验卡',
    point: -200,
    createTime: '2026-03-23 15:45:00'
  },
  {
    id: 1009,
    title: '每日签到',
    description: '连续签到4天',
    point: 10,
    createTime: '2026-03-23 09:00:00'
  },
  {
    id: 1010,
    title: '邀请好友',
    description: '好友注册并完成首单',
    point: 100,
    createTime: '2026-03-22 18:30:00'
  },
  {
    id: 1011,
    title: '每日签到',
    description: '连续签到3天',
    point: 8,
    createTime: '2026-03-22 09:00:00'
  },
  {
    id: 1012,
    title: '完成练习',
    description: '完成一次章节练习',
    point: 10,
    createTime: '2026-03-21 14:20:00'
  },
  {
    id: 1013,
    title: '每日签到',
    description: '连续签到2天',
    point: 6,
    createTime: '2026-03-21 09:00:00'
  },
  {
    id: 1014,
    title: '错题重做',
    description: '完成错题重做并获得满分',
    point: 15,
    createTime: '2026-03-20 16:45:00'
  },
  {
    id: 1015,
    title: '每日签到',
    description: '连续签到1天',
    point: 5,
    createTime: '2026-03-20 09:00:00'
  },
  {
    id: 1016,
    title: '模拟考试',
    description: '完成一次模拟考试',
    point: 50,
    createTime: '2026-03-19 10:30:00'
  },
  {
    id: 1017,
    title: '消费返积分',
    description: '订单消费返积分（订单金额199元）',
    point: 199,
    createTime: '2026-03-18 14:15:00'
  },
  {
    id: 1018,
    title: '积分兑换',
    description: '兑换题库优惠券',
    point: -50,
    createTime: '2026-03-17 11:20:00'
  }
]

/* ==================== 积分规则数据 ==================== */

/**
 * Mock 积分规则
 */
export const mockPointRules: PointRuleVO[] = [
  {
    name: '每日签到',
    point: 5,
    description: '基础5分，连续签到递增（最多20分）'
  },
  {
    name: '完善资料',
    point: 50,
    description: '首次完善个人信息'
  },
  {
    name: '绑定手机',
    point: 30,
    description: '首次绑定手机号'
  },
  {
    name: '消费返积分',
    point: 0,
    description: '每消费1元返1积分'
  },
  {
    name: '邀请好友',
    point: 100,
    description: '好友注册并完成首单'
  },
  {
    name: '完成练习',
    point: 10,
    description: '完成一次章节练习'
  },
  {
    name: '错题重做',
    point: 15,
    description: '完成错题重做并获得满分'
  },
  {
    name: '模拟考试',
    point: 50,
    description: '完成一次模拟考试'
  }
]

/* ==================== 查询函数 ==================== */

/**
 * 获取 Mock 积分记录分页数据
 * @param params 查询参数
 * @returns 积分记录分页数据
 */
export const getMockPointRecordPage = (
  params: PointRecordPageReqVO = {}
): Promise<PointRecordPageRespVO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { pageNo = 1, pageSize = 10, addStatus, startTime, endTime } = params
      let list = [...mockPointRecords]

      /* 按收入/支出筛选 */
      if (addStatus !== undefined && addStatus !== null) {
        list = list.filter(item => {
          if (addStatus) {
            return item.point > 0
          } else {
            return item.point < 0
          }
        })
      }

      /* 按时间范围筛选 */
      if (startTime && endTime) {
        const start = new Date(startTime).getTime()
        const end = new Date(endTime).getTime()
        list = list.filter(item => {
          const itemTime = new Date(item.createTime).getTime()
          return itemTime >= start && itemTime <= end
        })
      }

      /* 按时间倒序排序 */
      list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

      /* 分页 */
      const total = list.length
      const start = (pageNo - 1) * pageSize
      const end = start + pageSize
      const paginatedList = list.slice(start, end)

      resolve({
        list: paginatedList,
        total
      })
    }, 300)
  })
}

/**
 * 获取 Mock 积分规则
 * @returns 积分规则列表
 */
export const getMockPointRules = (): Promise<PointRuleVO[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockPointRules])
    }, 300)
  })
}

/**
 * 获取 Mock 积分统计
 * @returns 积分统计数据
 */
export const getMockPointStatistics = (): Promise<PointStatisticsVO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalIncome = mockPointRecords
        .filter(r => r.point > 0)
        .reduce((sum, r) => sum + r.point, 0)
      const totalExpense = Math.abs(mockPointRecords
        .filter(r => r.point < 0)
        .reduce((sum, r) => sum + r.point, 0))
      const currentBalance = totalIncome - totalExpense

      /* 本月数据 */
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthRecords = mockPointRecords.filter(r => {
        return new Date(r.createTime) >= monthStart
      })
      const monthIncome = monthRecords
        .filter(r => r.point > 0)
        .reduce((sum, r) => sum + r.point, 0)
      const monthExpense = Math.abs(monthRecords
        .filter(r => r.point < 0)
        .reduce((sum, r) => sum + r.point, 0))

      resolve({
        totalIncome,
        totalExpense,
        currentBalance,
        monthIncome,
        monthExpense
      })
    }, 300)
  })
}
