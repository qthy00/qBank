import {defineStore} from "pinia";
import type {UserSetting, TypeCount, PointStatistic, MockSetting} from "~/types/qBank/index";

/**
 * 题目类型常量
 */
export const QuestionType = {
  ALL: -1,
  SINGLE: 0,
  MULTIPLE: 1,
  INDEFINITE: 2,
  JUDGE: 3,
  FILL: 4,
  SHORT: 5,
  CASE: 6,
  DISCUSS: 7,
  COMPOSITE: 8,
} as const

/**
 * 题目状态常量
 */
export const QuestionStatus = {
  ALL: 12,
  UNANSWERED: 0,
  ANSWERED: 1,
  CORRECT: 2,
  WRONG: 3,
} as const

/**
 * 默认用户设置常量
 */
export const DEFAULT_USER_SETTING: UserSetting = {
  type: QuestionType.ALL,
  status: QuestionStatus.ALL,
  amount: 30,
}

export const useQBankStore = defineStore('qBank', () => {
  /* 定义响应式状态 */
  const path = ref<string>()
  const packageId = ref<number>()
  const categoryId = ref<number>()
  const subjectId = ref<number>()
  const chapterId = ref<number>()
  const sectionId = ref<number>()
  const userSetting = ref<UserSetting>({...DEFAULT_USER_SETTING})
  const random = ref<boolean>(true)
  const title = ref<string>('')
  const subtitle = ref<string>('')
  const totalCount = ref<number>(0)
  const showAnswerSetting = ref<number>(1)
  const pageTimes = ref<number>(0)
  const correctRate = ref<number>(0)
  const typeCounts = ref<TypeCount>({})
  const pointStatistics = ref<PointStatistic[]>([])
  const mockSetting = ref<MockSetting>({})


  const setUserSetting = (selectedValues: number[]) => {
    userSetting.value = {
      type: selectedValues[0],
      status: selectedValues[1],
      amount: selectedValues[2],
    }
  }

  const setChapter = (pkgId: number, subject: number, chapter: number, chapterName: string) => {
    packageId.value = pkgId
    chapterId.value = chapter
    subjectId.value = subject
    subtitle.value = chapterName
  }

  /**
   * 保存页面停留时间和正确率
   */
  const saveTimeRate = (time: number, rate:number) => {
    pageTimes.value = time
    correctRate.value = rate
  }

  /* 返回需要暴露的状态和方法 */
  return {
    /* 状态 */
    path,
    packageId,
    categoryId,
    subjectId,
    chapterId,
    sectionId,
    userSetting,
    random,
    title,
    subtitle,
    totalCount,
    showAnswerSetting,
    pageTimes,
    correctRate,
    typeCounts,
    pointStatistics,
    mockSetting,
    /* Actions */
    setUserSetting,
    saveTimeRate,
    setChapter
  }
}, {
  persist: {
    paths: ['userSetting', 'random', 'showAnswerSetting', 'mockSetting']
  }
})
