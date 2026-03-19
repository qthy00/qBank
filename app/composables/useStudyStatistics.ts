/**
 * 学习统计组合式函数
 */
import type {
  StudyStatisticsVO,
  StudyStatsOverviewVO,
  AccuracyTrendVO,
  SubjectAccuracyVO,
  StudyHeatmapItemVO,
  StudyRecordQueryReqVO,
  StudyRecordListRespVO,
  AbilityAssessmentVO,
  AbilityAssessmentQueryReqVO,
} from '~/types/statistics'
import {
  getStudyStatistics,
  getStudyStatsOverview,
  getAccuracyTrend,
  getSubjectAccuracy,
  getStudyHeatmap,
  getStudyRecords,
  getAbilityAssessment,
} from '~/api/statistics'

/**
 * 学习统计数据管理
 */
export function useStudyStatistics() {
  /* ==================== 状态定义 ==================== */

  /* 加载状态 */
  const loading = ref(false)

  /* 完整统计数据 */
  const statistics = ref<StudyStatisticsVO | null>(null)

  /* 概览数据 */
  const overview = ref<StudyStatsOverviewVO | null>(null)

  /* 正确率趋势 */
  const accuracyTrend = ref<AccuracyTrendVO | null>(null)

  /* 科目正确率分布 */
  const subjectAccuracy = ref<SubjectAccuracyVO[]>([])

  /* 学习热力图 */
  const heatmap = ref<StudyHeatmapItemVO[]>([])

  /* 学习记录列表 */
  const records = ref<StudyRecordListRespVO['list']>([])
  const recordsTotal = ref(0)

  /* 能力评估报告 */
  const abilityAssessment = ref<AbilityAssessmentVO | null>(null)

  /* 趋势类型：week-近7天，month-近30天 */
  const trendType = ref<'week' | 'month'>('week')

  /* 记录查询参数 */
  const recordQuery = reactive<StudyRecordQueryReqVO>({
    page: 1,
    limit: 10,
  })

  /* 能力评估查询参数 */
  const assessmentQuery = reactive<AbilityAssessmentQueryReqVO>({
    timeRange: 'all',
  })

  /* ==================== 计算属性 ==================== */

  /* 当前趋势数据 */
  const currentTrendData = computed(() => {
    if (!accuracyTrend.value) return []
    return trendType.value === 'week'
      ? accuracyTrend.value.week
      : accuracyTrend.value.month
  })

  /* 平均学习时长（分钟/天） */
  const avgDailyDuration = computed(() => {
    if (!overview.value) return 0
    const total = overview.value.duration.total
    /* 假设学习天数为总时长除以每天平均60分钟 */
    const days = Math.max(1, Math.floor(total / 60))
    return Math.round(total / days)
  })

  /* 学习总天数估算 */
  const totalStudyDays = computed(() => {
    if (!overview.value) return 0
    return Math.max(1, Math.floor(overview.value.duration.total / 60))
  })

  /* ==================== 方法定义 ==================== */

  /**
   * 获取完整统计数据
   */
  const fetchStatistics = async () => {
    loading.value = true
    try {
      statistics.value = await getStudyStatistics()
      /* 同步更新各子数据 */
      overview.value = statistics.value.overview
      accuracyTrend.value = statistics.value.accuracyTrend
      subjectAccuracy.value = statistics.value.subjectAccuracy
      heatmap.value = statistics.value.heatmap
    } catch (error) {
      console.error('获取学习统计数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取概览数据
   */
  const fetchOverview = async () => {
    try {
      overview.value = await getStudyStatsOverview()
    } catch (error) {
      console.error('获取学习统计概览失败:', error)
    }
  }

  /**
   * 获取正确率趋势
   */
  const fetchAccuracyTrend = async (type: 'week' | 'month' = 'week') => {
    try {
      accuracyTrend.value = await getAccuracyTrend(type)
    } catch (error) {
      console.error('获取正确率趋势失败:', error)
    }
  }

  /**
   * 获取科目正确率分布
   */
  const fetchSubjectAccuracy = async () => {
    try {
      subjectAccuracy.value = await getSubjectAccuracy()
    } catch (error) {
      console.error('获取科目正确率分布失败:', error)
    }
  }

  /**
   * 获取学习热力图数据
   */
  const fetchHeatmap = async () => {
    try {
      heatmap.value = await getStudyHeatmap()
    } catch (error) {
      console.error('获取学习热力图失败:', error)
    }
  }

  /**
   * 获取学习记录列表
   */
  const fetchRecords = async () => {
    loading.value = true
    try {
      const res = await getStudyRecords(recordQuery)
      records.value = res.list
      recordsTotal.value = res.total
    } catch (error) {
      console.error('获取学习记录失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取能力评估报告
   */
  const fetchAbilityAssessment = async () => {
    loading.value = true
    try {
      abilityAssessment.value = await getAbilityAssessment(assessmentQuery)
    } catch (error) {
      console.error('获取能力评估报告失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 切换评估时间范围
   */
  const switchAssessmentTimeRange = (range: 'week' | 'month' | 'all') => {
    assessmentQuery.timeRange = range
    fetchAbilityAssessment()
  }

  /**
   * 切换趋势类型
   */
  const switchTrendType = (type: 'week' | 'month') => {
    trendType.value = type
  }

  /**
   * 格式化时长显示
   */
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分钟`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (mins === 0) {
      return `${hours}小时`
    }
    return `${hours}小时${mins}分钟`
  }

  /**
   * 格式化数字（大于10000显示为x.x万）
   */
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num.toString()
  }

  /**
   * 获取正确率颜色类
   */
  const getAccuracyColorClass = (accuracy: number): string => {
    if (accuracy >= 80) return 'text-green-500'
    if (accuracy >= 60) return 'text-blue-500'
    if (accuracy >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  /**
   * 获取正确率进度条颜色
   */
  const getAccuracyProgressColor = (accuracy: number): string => {
    if (accuracy >= 80) return '#22c55e'
    if (accuracy >= 60) return '#3b82f6'
    if (accuracy >= 40) return '#eab308'
    return '#ef4444'
  }

  /* ==================== 监听 ==================== */

  /* 监听分页变化自动刷新记录 */
  watch(
    () => [recordQuery.page, recordQuery.limit],
    () => {
      fetchRecords()
    },
    { immediate: false }
  )

  return {
    /* 状态 */
    loading,
    statistics,
    overview,
    accuracyTrend,
    subjectAccuracy,
    heatmap,
    records,
    recordsTotal,
    trendType,
    recordQuery,
    abilityAssessment,
    assessmentQuery,
    /* 计算属性 */
    currentTrendData,
    avgDailyDuration,
    totalStudyDays,
    /* 方法 */
    fetchStatistics,
    fetchOverview,
    fetchAccuracyTrend,
    fetchSubjectAccuracy,
    fetchHeatmap,
    fetchRecords,
    fetchAbilityAssessment,
    switchTrendType,
    switchAssessmentTimeRange,
    formatDuration,
    formatNumber,
    getAccuracyColorClass,
    getAccuracyProgressColor,
  }
}
