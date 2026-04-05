import type { CategoryVO } from '~/types/category'

/**
 * 用户行业/考试偏好 Store
 * @description 管理用户选择的行业和考试，用于筛选内容
 */
export const useIndustryStore = defineStore('industry', () => {
  const message = useMessage()

  /* ==================== 状态 ==================== */

  /* 当前选中的行业 */
  const currentIndustry = ref<CategoryVO | null>(null)
  /* 当前选中的考试 */
  const currentExam = ref<CategoryVO | null>(null)
  /* 是否显示引导弹窗 */
  const showGuide = ref(false)

  /* ==================== Getters ==================== */

  /* 是否已选择过考试 */
  const hasSelected = computed(() => {
    return currentIndustry.value !== null && currentExam.value !== null
  })

  /* 当前显示名称 */
  const displayName = computed(() => {
    if (currentIndustry.value && currentExam.value) {
      return `${currentIndustry.value.name} / ${currentExam.value.name}`
    }
    return '请选择考试'
  })

  /* ==================== Actions ==================== */

  /**
   * 初始化用户偏好
   * @returns 是否已选择过
   */
  const initPreference = (): boolean => {
        /* 如果已有选择，验证是否有效 */
    if (currentIndustry.value && currentExam.value) {
      return true
      // const foundIndustry = categories.find(c => c.id === currentIndustry.value?.id)
      // const foundExam = foundIndustry?.children?.find(e => e.id === currentExam.value?.id)
      // if (foundIndustry && foundExam) {
      //   return true
      // }
    }
    /* 未选择或选择失效，显示引导 */
    showGuide.value = true
    return false
  }

  /**
   * 选择考试
   */
  const selectExam = (industry: CategoryVO, exam: CategoryVO) => {
    currentIndustry.value = industry
    currentExam.value = exam
    showGuide.value = false
    message.success(`已选择【${exam.name}】，为您展示相关内容`)
  }

  /**
   * 跳过选择
   */
  const skipSelection = () => {
    showGuide.value = false
  }

  /**
   * 手动打开引导
   */
  const openGuide = () => {
    showGuide.value = true
  }

  /**
   * 清除选择
   */
  const clearPreference = () => {
    currentIndustry.value = null
    currentExam.value = null
  }

  return {
    /* 状态 */
    currentIndustry,
    currentExam,
    showGuide,
    /* Getters */
    hasSelected,
    displayName,
    /* Actions */
    initPreference,
    selectExam,
    skipSelection,
    openGuide,
    clearPreference
  }
}, {
  /* 持久化配置 */
  persist: {
    paths: ['currentIndustry', 'currentExam']
  }
})
