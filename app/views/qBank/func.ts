// 题型数据
import type { BaseType } from '@/types/question'

export const questionTypes = [
  { type: 0, name: '单选题', color: '#3b82f6' },
  { type: 1, name: '多选题', color: '#8b5cf6' },
  { type: 2, name: '不定项选择题', color: '#10b981' },
  { type: 3, name: '判断题', color: '#f59e0b' },
  { type: 4, name: '填空题', color: '#ef4444' },
  { type: 5, name: '简答题', color: '#6366f1' },
  { type: 6, name: '案例题', color: '#14b8a6' },
  { type: 7, name: '论述题', color: '#f43f5e' },
  { type: 8, name: '复合题', color: '#94a3b8' },
]

export interface QuestionType extends BaseType{
  color: string
  icon: string
}

export const typeMap: QuestionType[] = [
  { type: '单选题', value: 0, color: 'blue', icon: 'cuida:single-select-outline' },
  { type: '多选题', value: 1, color: 'green', icon: 'mingcute:choice-line' },
  { type: '不定项选择题', value: 2 , color: 'purple', icon: 'mingcute:choice-line'},
  { type: '判断题', value: 3, color: 'amber', icon: 'pajamas:false-positive' },
  { type: '填空题', value: 4, color: 'indigo', icon: 'mage:edit-pen' },
  { type: '简答题', value: 5, color: 'teal', icon: 'ri:question-answer-line' },
  { type: '案例题', value: 6, color: 'rose', icon: 'material-symbols:quiz-outline' },
  { type: '论述题', value: 7, color: 'slate', icon: 'uil:file-question-alt' },
  { type: '复合题/综合题', value: 8, color: 'cyan', icon: 'mage:file-question-mark' },
]

export const judgeOptions = [
  { label: '正确', value: '1' },
  { label: '错误', value: '0' },
]


export const getTypeName = (type: number) => {
  const category = questionTypes.find((i) => i.type === type)
  if (category) {
    return category.name
  }
  return '未知'
}

export const getSubQuestionTypeClass = (type: number) => {
  switch (type) {
    case 0:
      return 'bg-blue-100 text-blue-800'
    case 1:
    case 2:
      return 'bg-green-100 text-green-800'
    case 3:
      return 'bg-purple-100 text-purple-800'
    case 4:
      return 'bg-teal-100 text-teal-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}

/**
 * 跳转到考试练习页面
 * @param toolId 工具ID
 */
export const goBackIndex = async (toolId: number) => {
  await navigateTo({
    name: 'ExamExercise',
    params: { toolId }
  })
}
