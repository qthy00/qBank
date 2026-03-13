/**
 * 错题本组合式函数
 */
import type {
  MistakeQueryReqVO,
  MistakeListRespVO,
  MistakeStatsVO,
  MistakeFilterVO,
} from "~/types/mistake"
import {
  getMistakeList,
  getMistakeStats,
  markMistakeMastered,
  removeMistake,
  batchMarkMastered,
  batchRemoveMistake,
} from "~/api/mistake"

/**
 * 错题本管理
 */
export function useMistakes() {
  // 状态
  const loading = ref(false)
  const mistakeList = ref<MistakeListRespVO['list']>([])
  const total = ref(0)
  const stats = ref<MistakeStatsVO | null>(null)

  // 筛选条件 - 默认显示未掌握的错题
  const filter = reactive<MistakeFilterVO>({
    categoryId: undefined,
    subjectId: undefined,
    chapterId: undefined,
    questionType: undefined,
    difficulty: undefined,
    isMastered: false, // 默认显示未掌握的错题
  })

  // 分页
  const page = ref(1)
  const limit = ref(20)

  // 获取错题列表
  const fetchMistakeList = async () => {
    loading.value = true
    try {
      const params: MistakeQueryReqVO = {
        ...filter,
        isMastered: filter.isMastered === null ? undefined : filter.isMastered,
        page: page.value,
        limit: limit.value,
      }
      const res = await getMistakeList(params)
      mistakeList.value = res.list
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  // 获取错题统计
  const fetchMistakeStats = async (categoryId?: number) => {
    try {
      stats.value = await getMistakeStats(categoryId)
    } catch (error) {
      console.error('获取错题统计失败:', error)
    }
  }

  // 标记掌握
  const markMastered = async (questionId: number) => {
    const message = useMessage()
    try {
      await markMistakeMastered({ questionId, isMastered: true })
      // 更新本地状态
      const item = mistakeList.value.find(m => m.questionId === questionId)
      if (item) {
        item.isMastered = true
        item.masteredTime = Date.now().toString()
      }
      // 重新获取统计
      await fetchMistakeStats(filter.categoryId)
      message.success('标记成功')
      return true
    } catch (error) {
      message.error('标记失败')
      return false
    }
  }

  // 标记未掌握
  const markUnMastered = async (questionId: number) => {
    const message = useMessage()
    try {
      await markMistakeMastered({ questionId, isMastered: false })
      const item = mistakeList.value.find(m => m.questionId === questionId)
      if (item) {
        item.isMastered = false
        item.masteredTime = undefined
      }
      await fetchMistakeStats(filter.categoryId)
      message.success('取消掌握标记')
      return true
    } catch (error) {
      message.error('操作失败')
      return false
    }
  }

  // 移除错题
  const removeMistakeItem = async (questionId: number) => {
    const message = useMessage()
    try {
      await removeMistake({ questionId })
      // 从列表中移除
      mistakeList.value = mistakeList.value.filter(m => m.questionId !== questionId)
      total.value--
      await fetchMistakeStats(filter.categoryId)
      message.success('移除成功')
      return true
    } catch (error) {
      message.error('移除失败')
      return false
    }
  }

  // 批量标记掌握
  const batchMaster = async (questionIds: number[]) => {
    const message = useMessage()
    try {
      await batchMarkMastered(questionIds)
      // 更新本地状态
      mistakeList.value.forEach(item => {
        if (questionIds.includes(item.questionId)) {
          item.isMastered = true
        }
      })
      await fetchMistakeStats(filter.categoryId)
      message.success(`成功标记 ${questionIds.length} 道题目`)
      return true
    } catch (error) {
      message.error('批量标记失败')
      return false
    }
  }

  // 批量移除
  const batchRemove = async (questionIds: number[]) => {
    const message = useMessage()
    try {
      await batchRemoveMistake(questionIds)
      mistakeList.value = mistakeList.value.filter(
        m => !questionIds.includes(m.questionId)
      )
      total.value -= questionIds.length
      await fetchMistakeStats(filter.categoryId)
      message.success(`成功移除 ${questionIds.length} 道题目`)
      return true
    } catch (error) {
      message.error('批量移除失败')
      return false
    }
  }

  // 重置筛选
  const resetFilter = () => {
    filter.categoryId = undefined
    filter.subjectId = undefined
    filter.chapterId = undefined
    filter.questionType = undefined
    filter.difficulty = undefined
    filter.isMastered = null
    page.value = 1
  }

  // 监听筛选变化自动刷新
  watch(
    () => [filter.categoryId, filter.subjectId, filter.chapterId, filter.questionType, filter.difficulty, filter.isMastered],
    () => {
      page.value = 1
      fetchMistakeList()
    },
    { deep: true }
  )

  // 监听分页变化
  watch(page, fetchMistakeList)

  return {
    // 状态
    loading,
    mistakeList,
    total,
    stats,
    filter,
    page,
    limit,
    // 方法
    fetchMistakeList,
    fetchMistakeStats,
    markMastered,
    markUnMastered,
    removeMistakeItem,
    batchMaster,
    batchRemove,
    resetFilter,
  }
}
