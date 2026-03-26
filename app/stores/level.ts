import { defineStore } from 'pinia'
import type {
  MemberLevelVO,
  UserLevelVO,
  ExperienceRecordVO,
  LevelProgressVO,
  ExperienceRecordPageReqVO
} from '~/types/level'
import { getLevelList, getExperienceRecord } from '~/api/level'

/**
 * 会员等级 Store
 *
 * 管理会员等级列表、经验记录、等级进度计算
 */
export const useLevelStore = defineStore('level', () => {
  /* ==================== 状态 ==================== */

  /* 等级列表 */
  const levelList = ref<MemberLevelVO[]>([])

  /* 经验记录列表 */
  const experienceRecords = ref<ExperienceRecordVO[]>([])

  /* 经验记录总数 */
  const experienceTotal = ref(0)

  /* 加载状态 */
  const loading = ref(false)

  /* ==================== Getters ==================== */

  /**
   * 根据经验值查找对应等级
   * @param exp 经验值
   * @returns 对应的等级信息
   */
  const getLevelByExp = (exp: number): MemberLevelVO => {
    if (levelList.value.length === 0) {
      return {
        name: '普通会员',
        level: 1,
        experience: 0,
        discountPercent: 100,
        icon: '',
        backgroundUrl: ''
      }
    }

    /* 从高级到低级查找 */
    for (let i = levelList.value.length - 1; i >= 0; i--) {
      if (exp >= levelList.value[i].experience) {
        return levelList.value[i]
      }
    }

    return levelList.value[0]
  }

  /**
   * 计算等级进度
   * @param currentExp 当前经验值
   * @param currentLevel 当前等级
   * @returns 等级进度信息
   */
  const calculateProgress = (
    currentExp: number,
    currentLevel: UserLevelVO | null
  ): LevelProgressVO => {
    /* 默认返回值 */
    const defaultResult: LevelProgressVO = {
      currentLevel,
      nextLevel: null,
      progress: 100,
      currentExp,
      needExp: 0,
      isMaxLevel: true
    }

    if (levelList.value.length === 0 || !currentLevel) {
      return defaultResult
    }

    /* 找到当前等级在列表中的位置 */
    const currentIndex = levelList.value.findIndex(
      l => l.level === currentLevel.level
    )

    if (currentIndex === -1 || currentIndex === levelList.value.length - 1) {
      /* 已满级 */
      return {
        currentLevel,
        nextLevel: null,
        progress: 100,
        currentExp,
        needExp: 0,
        isMaxLevel: true
      }
    }

    const currentLevelInfo = levelList.value[currentIndex]
    const nextLevel = levelList.value[currentIndex + 1]
    const currentLevelExp = currentLevelInfo.experience
    const nextLevelExp = nextLevel.experience

    const needExp = nextLevelExp - currentExp
    const levelGap = nextLevelExp - currentLevelExp
    const progress = ((currentExp - currentLevelExp) / levelGap) * 100

    return {
      currentLevel,
      nextLevel,
      progress: Math.min(Math.max(progress, 0), 100),
      currentExp,
      needExp,
      isMaxLevel: false
    }
  }

  /**
   * 获取等级折扣显示文本
   * @param discountPercent 折扣百分比
   * @returns 折扣文本（如"95折"）
   */
  const getDiscountText = (discountPercent: number): string => {
    if (discountPercent >= 100) {
      return '无折扣'
    }
    const discount = discountPercent / 10
    return `${discount.toFixed(1)}折`
  }

  /* ==================== Actions ==================== */

  /**
   * 获取等级列表
   */
  const fetchLevelList = async () => {
    loading.value = true
    try {
      const list = await getLevelList()
      levelList.value = list
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取经验记录
   * @param params 查询参数
   */
  const fetchExperienceRecords = async (params: ExperienceRecordPageReqVO = {}) => {
    loading.value = true
    try {
      const res = await getExperienceRecord(params)
      experienceRecords.value = res.list
      experienceTotal.value = res.total
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载更多经验记录
   * @param params 查询参数
   */
  const loadMoreExperienceRecords = async (params: ExperienceRecordPageReqVO = {}) => {
    loading.value = true
    try {
      const res = await getExperienceRecord(params)
      experienceRecords.value.push(...res.list)
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置状态
   */
  const resetState = () => {
    levelList.value = []
    experienceRecords.value = []
    experienceTotal.value = 0
  }

  /* ==================== 返回暴露内容 ==================== */

  return {
    /* 状态 */
    levelList,
    experienceRecords,
    experienceTotal,
    loading,
    /* Getters */
    getLevelByExp,
    calculateProgress,
    getDiscountText,
    /* Actions */
    fetchLevelList,
    fetchExperienceRecords,
    loadMoreExperienceRecords,
    resetState
  }
})
