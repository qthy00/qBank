import { defineStore } from 'pinia'

interface AnswerState {
  sessionId?: number
  answers: Record<number, string>
  currentIndex: number
}


export const useTestStore = defineStore('test', () => {

  const sessionId = ref<number | undefined>(undefined)
  const answers = ref<Record<number, string>>({})
  const currentIndex = ref<number>(0)

  const setPaper = (paperId?: number) => {
    if (!paperId) return
    sessionId.value = paperId
    answers.value = {}
    currentIndex.value = 0
  }

  const reset = () => {
    this.$reset()
  }

  return {
    sessionId,
    answers,
    currentIndex,
    setPaper,
    reset,
  }

}, {persist: true})