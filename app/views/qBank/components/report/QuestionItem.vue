<template>
  <div
    class="question-item border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 bg-white hover:shadow-sm"
  >
    <!-- 题目头部信息 -->
    <div
      class="question-header bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 border-b border-slate-200 flex justify-between items-center"
    >
      <div class="question-status flex items-center">
        <span class="text-xs sm:text-sm text-slate-500 mr-2">第{{ sort }}题</span>
        <span class="text-xs sm:text-sm flex items-center p-1 rounded-md" :class="getStatusClass">
          <Icon :name="getStatusIcon" class="mr-1" :size="14" />
          {{ getStatusText }}
        </span>
      </div>
      <span
        class="score-badge text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full"
        :class="getScoreClass"
      >
        得分: {{ question.userScore || 0 }}/{{ singleScore }}
      </span>
    </div>

    <!-- 题目内容区 -->
    <div class="question-content p-2 sm:p-3">
      <!-- 题目描述 -->
      <div
        v-if="type !== 4"
        class="question-desc text-slate-800 mb-2 sm:mb-3 text-sm sm:text-base leading-tight"
        v-html="question.content"
      />
      <!-- 选择题 -->
      <div
        v-if="[0, 1, 2].includes(type)"
        class="options-container flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-3"
      >
        <OptionItem
          v-for="(value, key) in question.options"
          :key="key"
          :option-key="key"
          :option-value="value"
          :show-key="true"
          :is-correct="isOptionCorrect(key)"
          :is-wrong="isOptionWrong(key)"
        />
      </div>
      <!-- 判断题 -->
      <div
        v-else-if="type === 3"
        class="options-container flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-3"
      >
        <OptionItem
          v-for="(item, index) in judgeOptions"
          :key="index"
          :option-key="item.value"
          :option-value="item.label"
          :show-key="false"
          :is-correct="isOptionCorrect(item.value)"
          :is-wrong="isOptionWrong(item.value)"
        />
      </div>
      <!-- 填空 -->
      <div v-else-if="type === 4" class="text-lg">
        <span v-for="(part, index) in parseFillContent(question.content)" :key="index">
          <!-- 填空题输入框进一步优化部分 -->
          <template v-if="part.type === 'fill'">
            <div class="inline-block border-b-solid border-gray-800 border-b-2">
              <span v-if="!part.isCorrect" class="text-error line-through ml-2 mr-1">{{
                part.userAnswer
              }}</span>
              <span class="mx-1 inline-block relative text-green-600 mx-2">
                {{ part.correctAnswer }}
              </span>
            </div>
          </template>
          <template v-else>{{ part.content }}</template>
        </span>
      </div>
      <!-- 简答题 -->
      <div v-else-if="[5, 6, 7].includes(type)" class="mb-4 sm:mb-5">
        <div class="flex flex-wrap items-start gap-2 mb-2">
          <span class="text-sm text-slate-600 whitespace-nowrap pt-1">你的解答：</span>
          <div
            class="flex-1 p-3 sm:p-3.5 rounded-lg border-2 border-success bg-success/5 min-h-[100px]"
          >
            <div class="text-sm text-slate-800 leading-relaxed" v-html="question.userAnswer" />
          </div>
        </div>

        <div class="flex flex-wrap items-start gap-2" v-if="question.answer">
          <span class="text-sm text-slate-600 whitespace-nowrap pt-1">参考答案：</span>
          <div
            class="flex-1 p-3 sm:p-3.5 rounded-lg border border-success bg-success/5 min-h-[100px]"
          >
            <div class="text-sm text-slate-800 leading-relaxed" v-html="question.answer" />
          </div>
        </div>
      </div>

      <!-- 解析区域 -->
      <AnalysisSection
        :user-answer="userAnswer"
        :correct-answer="correctAnswer"
        :analysis="question.analysis"
        :show="show"
        :point="question.point"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import OptionItem from './OptionItem.vue'
import AnalysisSection from './AnalysisSection.vue'
import { judgeOptions } from '~/views/qBank/func.ts'
import { stripHtmlTags } from '@/utils'
import type { FillIn, QuestionItem } from '~/types/qBank'


const props = defineProps({
  question: {
    type: Object as PropType<QuestionItem>,
    required: true,
  },
  singleScore: {
    type: Number,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  sort: {
    type: Number,
    default: 0,
    required: false,
  },
})

const userAnswer = computed(() => {
  if (props.type === 3) {
    return props.question.userAnswer == '1' ? '正确' : '错误'
  }else if(props.type === 4){
    return props.question.userAnswer?.split('###').join('；')
  }
  return props.question.userAnswer
})

const correctAnswer = computed(() => {
  if (props.type === 3) {
    return props.question.answer == '1' ? '正确' : '错误'
  }else if(props.type === 4){
    return props.question.answer.split('###').join('；')
  }
  return props.question.answer
})
// 状态计算
const getStatusClass = computed(() => {
  return props.question.isCorrect === 1 ? 'text-success'
    : props.question.isCorrect === 2 ? 'text-warning' : 'text-error'
})

const getScoreClass = computed(() => {
  return props.question.isCorrect === 1 ? 'text-success bg-success/10'
    : props.question.isCorrect === 2 ? 'text-warning bg-warning/10' : 'text-gray-800'
})

const getStatusIcon = computed(() => {
  return props.question.isCorrect === 1 ? 'ep:circle-check-filled'
    : props.question.isCorrect === 2 ? 'ep:warning-filled' : 'ep:circle-close-filled'
})

const getStatusText = computed(() => {
  return props.question.isCorrect === 1 ? '回答正确'
    : props.question.isCorrect === 2 ? '部分正确' : '回答错误'
})

const show = computed(() => [0,1,2,3,4].includes(props.type) )
// 选项状态判断
const isOptionCorrect = (key: string) => {
  if(!props.question.answer) return false
  return props.question.answer.includes(key)
}

const isOptionWrong = (key: string) => {
  // 错误选项：用户选了但不正确
  if(!props.question.userAnswer || !props.question.answer) return false
  return props.question.userAnswer.includes(key) && !props.question.answer.includes(key)
}

// 解析填空题内容，分离文本和填空位置
const parseFillContent = (content: string) => {
  content = stripHtmlTags(content)
  if (!content) return []
  // 拆分内容并关联答案
  const parts = content.split(/（　　）/g)
  const result: FillIn[] = []
  const userAnswers = props.question.userAnswer?.split('###')
  const correctAnswers = props.question.answer.split('###')
  let answerIndex = 0
  // 处理每个拆分部分
  parts.forEach((textPart, i) => {
    // 添加文本部分（非空才添加）
    if (textPart) {
      result.push({
        type: 'text',
        content: textPart
      })
    }

    // 处理填空位置（最后一部分后面没有填空）
    if (i < parts.length - 1) {
      const userAnswer = userAnswers[answerIndex] || ''
      const correctAnswer = correctAnswers[answerIndex] || ''
      const isCorrect = userAnswer === correctAnswer && userAnswer !== ''

      result.push({
        type: 'fill',
        userAnswer,
        correctAnswer,
        isCorrect,
        index: answerIndex
      })
      answerIndex++
    }
  })

  return result
}
</script>

<style scoped>
.question-item {
  transition: all 0.3s ease;
}

.question-item:hover {
  border-color: #e2e8f0;
}
</style>
