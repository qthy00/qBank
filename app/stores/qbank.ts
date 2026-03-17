import {defineStore} from "pinia";


export const useQBankStore = defineStore('qBank', () => {
    // 1. 定义响应式状态
    const path = ref<string>()
    const packageId = ref<number>()
    const categoryId = ref<number>()
    const subjectId = ref<number>()
    const chapterId = ref<number>()
    const sectionId = ref<number>()
    const userSetting = ref({
        type: -1,
        status: 12,
        amount: 30,
    })
    const random = ref<boolean>(true)
    const title = ref<string>('')
    const subtitle = ref<string>('')
    const totalCount = ref<number>(0)
    const showAnswerSetting = ref<number>(1)
    const pageTimes = ref<number>(0)
    const correctRate = ref<number>(0)
    const typeCounts = ref({})
    const pointStatistics = ref([])
    const mockSetting = ref({})


    const setUserSetting = (selectedValues: number[]) => {
        userSetting.value = {
            type: selectedValues[0],
            status: selectedValues[1],
            amount: selectedValues[2],
        }
    }

    const setChapter = (packageId: number, subject: number, chapter: number, chapterName: string) => {
        packageId.value = packageId
        chapterId.value = chapter
        subjectId.value = subject
        subtitle.value = chapterName
    }

    // 保存页面停留时间和正确率
    const saveTimeRate = (time: number, rate:number) => {
        pageTimes.value = time
        correctRate.value = rate
    }

    // 4. 返回需要暴露的状态和方法
    return {
        // 状态
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
        // Actions
        setUserSetting,
        saveTimeRate,
        setChapter
    }
}, {
    persist: true
})
