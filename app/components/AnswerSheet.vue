<script setup lang="ts">
import { typeNames } from '@/api/qbank'
import type { AnswerCache, PaperQuestion, QuestionVO } from '@/types/qBank'

const appStore = useAppStore()
const {isMobile} = storeToRefs(appStore)

const questionStore = useQBankStore()
const {typeCounts} = storeToRefs(questionStore)

const showMobileAnswerCard = ref(false) // 控制移动端答题卡显示

const props = defineProps({
  answered: {
    type: Array as PropType<number[]>,
    required: true,
  },
  marked: {
    type: Array as PropType<number[]>,
    required: false,
    default: () => [],
  },
  totalCount: {
    type: Number,
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
  questions: {
    type: Array as PropType<PaperQuestion[] | QuestionVO[]>,
    required: true,
  },
  answerCache: {
    type: Object as PropType<AnswerCache>,
    required: true,
  },
  mode: {
    type: String as PropType<'mock' | 'review' | 'practice'>,
    required: false,
    default: 'mock',
  },
})

interface Group {
  type: number
  typeName?: string
  list: any[]
}

// 将题目按题型分组（用于答题卡）
const questionsByType = computed(() => {
  // 使用对象临时存储分组，避免创建固定数量的空数组
  const groupMap: Record<number, Group> = {}

  const tCounts: Record<number, number> = {}
  props.questions.forEach((question: PaperQuestion | QuestionVO, index: number) => {
    const type: number = question.type
    const typeName = question.typeName

    // 如果该类型分组不存在，则创建
    if (!groupMap[type]) {
      groupMap[type] = {
        type,
        typeName,
        list: []
      }
      tCounts[type] = 0
    }

    // 添加到对应分组，并添加globalIndex
    groupMap[type].list.push({
      ...question,
      index,
    })

    tCounts[type]++
  })
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  typeCounts.value = tCounts
  // 将对象转换为数组，保持类型顺序
  return Object.values(groupMap)
})

const emits = defineEmits(['redirect'])
// 跳转到指定题目
const goToQuestion = (index: number) => {
  emits('redirect', index)
  if(isMobile.value){
    showMobileAnswerCard.value = false
  }
}

// 获取题型指示器样式（用于答题卡分组标题）
const getQuestionTypeIndicatorClass = (type: number) => {
  switch (type) {
    case 0:
      return 'bg-blue-100 border border-blue-200'
    case 1:
    case 2:
      return 'bg-green-100 border border-green-200'
    case 3:
      return 'bg-purple-100 border border-purple-200'
    case 4:
      return 'bg-teal-100 border border-teal-200'
    case 8:
      return 'bg-rose-100 border border-rose-200'
    default:
      return 'bg-orange-100 border border-orange-200'
  }
}

// 获取题目状态样式
const getQuestionStatusClass = (index: number, id: number) => {
  const cache = props.answerCache[id]
  const result = cache?.isCorrect
  const isCurrent = index === props.currentIndex

  if (isCurrent) {
    return 'bg-indigo-600 text-white shadow-sm ring-indigo-200 ring-2 border-indigo-300'
  } else if (result === true) {
    return 'bg-green-500 text-white border-green-300'
  } else if (result === false) {
    return 'bg-red-500 text-white border-red-300'
  } else if (props.answered.includes(id)) {
    return 'bg-blue-100 border-blue-400'
  } else {
    return 'bg-slate-100 text-gray-800 border-slate-300'
  }
}
</script>

<template>
  <!-- 右侧边栏 - 答题卡（按题型分组） -->
  <div class="hidden lg:block lg:col-span-1">
    <div class="py-5">
      <div class="bg-blue-50 border-b border-gray-200 px-6 py-3 relative overflow-hidden">
        <div class="flex justify-between items-center">
          <div class="flex items-center font-bold text-slate-800 px-2 py-1.5">
            <Icon name="bi:card-list" class="mr-1 text-gray-500" />
            <span> 答题卡 </span>
          </div>
          <div class="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            已答: {{ answered.length }} / 未答: {{ totalCount - answered.length }}
          </div>
        </div>
      </div>

      <div class="p-5 overflow-y-auto bg-gray-50">
        <template v-for="(item, index) in questionsByType" :key="index">
          <!-- 按题型分组显示题目 -->
          <template v-if="item.list && item.list.length > 0">
            <!-- 题型标题 -->
            <div class="flex items-center my-3">
              <div
                :class="getQuestionTypeIndicatorClass(item.type)"
                class="w-3 h-3 rounded-full mr-2"
              />
              <h4 class="text-sm font-medium text-slate-700">
                {{ item.typeName || typeNames[item.type] }} （{{ item.list.length }}）
              </h4>
            </div>
            <!-- 题目按钮 -->
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="question in item.list"
                :key="question.id"
                class="w-8 h-8 rounded-md flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 relative font-medium border border-solid"
                :class="getQuestionStatusClass(question.index, question.id)"
                :title="
                  `第${question.index + 1}题` + (marked.includes(question.index) ? ' (已标记)' : '')
                "
                @click="goToQuestion(question.index)"
              >
                {{ question.index + 1 }}
                <!-- 标记指示器 -->
                <span
                  v-if="marked.includes(question.index)"
                  class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full text-white text-[8px] flex items-center justify-center shadow-sm"
                  >★</span
                >
              </button>
            </div>
          </template>
        </template>
        <!-- 图例说明 -->
        <div class="flex flex-wrap gap-3 mt-5 pt-4 border-t border-slate-100">
          <div class="flex items-center">
            <div
              class="w-4 h-4 rounded-md bg-blue-200 border border-solid border-blue-400 mr-1.5"
            />
            <span class="text-xs text-slate-600">已答题</span>
          </div>
          <div class="flex items-center">
            <div
              class="w-4 h-4 rounded-md bg-slate-100 border border-solid border-slate-300 mr-1.5"
            />
            <span class="text-xs text-slate-600">未答题</span>
          </div>
          <template v-if="mode === 'mock'">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-md bg-indigo-600 mr-1.5"/>
              <span class="text-xs text-slate-600">当前题</span>
            </div>
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded-md bg-amber-500 mr-1.5 flex items-center justify-center text-white text-[10px]"
              >
                ★
              </div>
              <span class="text-xs text-slate-600">已标记</span>
            </div>
          </template>
          <template v-if="mode === 'practice'">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-md bg-green-500 mr-1.5"/>
              <span class="text-xs text-slate-600">正确题</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-md bg-red-500 mr-1.5"/>
              <span class="text-xs text-slate-600">错误题</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- 移动端答题卡按钮 -->
  <button
    v-if="isMobile"
    class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-20 lg:hidden hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
    aria-label="打开答题卡"
    @click="showMobileAnswerCard = true"
  >
    <Icon name="mingcute:grid-2-line" :size="25" />
  </button>

  <el-drawer
    v-model="showMobileAnswerCard"
    direction="btt"
    size="75%"
    class="rounded-t-2xl"
    header-class="!mb-0"
  >
    <template #header>
      <div class="flex flex-col">
        <div class="text-lg font-semibold text-gray-800 mb-3">答题卡</div>
        <!-- 移动端图例 -->
        <div class="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
          <div class="flex items-center">
            <div class="w-4 h-4 rounded-md bg-blue-500 mr-1.5"/>
            <span class="text-xs text-slate-600">已答题</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 rounded-md bg-slate-200 mr-1.5"/>
            <span class="text-xs text-slate-600">未答题</span>
          </div>
          <template v-if="mode === 'mock'">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-md bg-indigo-600 mr-1.5"/>
              <span class="text-xs text-slate-600">当前题</span>
            </div>
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded-md bg-amber-500 mr-1.5 flex items-center justify-center text-white text-[10px]"
              >
                ★
              </div>
              <span class="text-xs text-slate-600">已标记</span>
            </div>
          </template>
          <template v-if="mode === 'practice'">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-md bg-green-500 mr-1.5"/>
              <span class="text-xs text-slate-600">正确题</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 rounded-md bg-red-500 mr-1.5"/>
              <span class="text-xs text-slate-600">错误题</span>
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- 动态遍历所有题型 -->
    <div v-for="(item, index) in questionsByType" :key="index">
      <template v-if="item.list && item.list.length > 0">
        <div class="flex items-center my-3">
          <span
            class="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-200"
          >
            {{ item.typeName || typeNames[item.type] }} （{{ item.list.length }}）
          </span>
        </div>
        <div class="grid grid-cols-6 gap-2">
          <button
            v-for="question in item.list"
            :key="question.id"
            class="w-10 h-10 rounded-md text-sm font-medium transition-all hover:shadow-md flex items-center justify-center border border-solid relative"
            :class="getQuestionStatusClass(question.index, question.id)"
            @click="goToQuestion(question.index)"
          >
            {{ question.index + 1 }}
            <!-- 标记指示器 -->
            <span
              v-if="marked.includes(question.index)"
              class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full text-white text-[8px] flex items-center justify-center shadow-sm"
            >★</span
            >
          </button>
        </div>
      </template>
    </div>

    <!-- 移动端答题卡底部操作区 -->
    <template #footer>
      <div class="mt-2 pt-2 border-t border-gray-100 flex justify-between">
        <div class="text-sm text-gray-500">
          <span>总题数: {{ totalCount }}</span> /
          <span>已完成: {{ answered.length }}</span>
        </div>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          @click="showMobileAnswerCard = false"
        >
          继续答题
        </button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
