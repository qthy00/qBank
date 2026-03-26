import { defineStore } from 'pinia'
import type {
  PointRecordVO,
  PointRuleVO,
  PointStatisticsVO,
  PointRecordPageReqVO
} from '~/types/point'
import { getPointRecord, getPointRules, getPointStatistics } from '~/api/point'

/**
 * 积分系统 Store
 *
 * 管理积分余额、积分记录、积分规则
 */
export const usePointStore = defineStore('point', () => {
  /* ==================== 状态 ==================== */

  /* 积分记录列表 */
  const pointRecords = ref<PointRecordVO[]>([])

  /* 积分记录总数 */
  const pointTotal = ref(0)

  /* 积分规则列表 */
  const pointRules = ref<PointRuleVO[]>([])

  /* 积分统计 */
  const pointStatistics = ref<PointStatisticsVO | null>(null)

  /* 加载状态 */
  const loading = ref(false)

  /* ==================== Getters ==================== */

  /**
   * 收入记录
   */
  const incomeRecords = computed(() => {
    return pointRecords.value.filter(r => r.point > 0)
  })

  /**
   * 支出记录
   */
  const expenseRecords = computed(() => {
    return pointRecords.value.filter(r => r.point < 0)
  })

  /**
   * 总收入
   */
  const totalIncome = computed(() => {
    return pointStatistics.value?.totalIncome || 0
  })

  /**
   * 总支出
   */
  const totalExpense = computed(() => {
    return pointStatistics.value?.totalExpense || 0
  })

  /**
   * 当前余额
   */
  const currentBalance = computed(() => {
    return pointStatistics.value?.currentBalance || 0
  })

  /* ==================== Actions ==================== */

  /**
   * 获取积分明细
   * @param params 查询参数
   */
  const fetchPointRecords = async (params: PointRecordPageReqVO = {}) => {
    loading.value = true
    try {
      const res = await getPointRecord(params)
      pointRecords.value = res.list
      pointTotal.value = res.total
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载更多积分记录
   * @param params 查询参数
   */
  const loadMorePointRecords = async (params: PointRecordPageReqVO = {}) => {
    loading.value = true
    try {
      const res = await getPointRecord(params)
      pointRecords.value.push(...res.list)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取积分规则
   */
  const fetchPointRules = async () => {
    loading.value = true
    try {
      const list = await getPointRules()
      pointRules.value = list
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取积分统计
   */
  const fetchPointStatistics = async () => {
    loading.value = true
    try {
      const stats = await getPointStatistics()
      pointStatistics.value = stats
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置状态
   */
  const resetState = () => {
    pointRecords.value = []
    pointTotal.value = 0
    pointRules.value = []
    pointStatistics.value = null
  }

  /* ==================== 返回暴露内容 ==================== */

  return {
    /* 状态 */
    pointRecords,
    pointTotal,
    pointRules,
    pointStatistics,
    loading,
    /* Getters */
    incomeRecords,
    expenseRecords,
    totalIncome,
    totalExpense,
    currentBalance,
    /* Actions */
    fetchPointRecords,
    loadMorePointRecords,
    fetchPointRules,
    fetchPointStatistics,
    resetState
  }
})
