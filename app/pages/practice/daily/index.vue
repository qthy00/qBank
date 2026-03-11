<script setup lang="ts">
import {getDailyQuestions, savePracticeRecord} from '~/api/qbank/practiceMock'
import type {QuestionVO} from '~/types/qBank'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '每日练习'
})

const router = useRouter()
const message = useMessage()

/* 练习状态 */
const isStarted = ref(false)
const isFinished = ref(false)

/* 练习设置 */
const practiceSettings = reactive({
  questionCount: 10,
  dailyStreak: 5, /* 连续打卡天数 */
  todayCompleted: false,
})

/* 练习中数据 */
const questions = ref<QuestionVO[]>([])
const currentIndex = ref(0)
const userAnswers = ref<Record<number, string>>({})
const startTime = ref<number>(0)
const spendTime = ref(0)

/* 结果统计 */
const resultStats = reactive({
  correctCount: 0,
  wrongCount: 0,
  accuracy: 0,
})

/* 开始练习 */
const handleStartPractice = () => {
  questions.value = getDailyQuestions(practiceSettings.questionCount)

  if (questions.value.length === 0) {
    message.warning('获取题目失败，请重试')
    return
  }

  isStarted.value = true
  isFinished.value = false
  currentIndex.value = 0
  userAnswers.value = {}
  startTime.value = Date.now()

  startTimer()
}

/* 计时器 */
let timerInterval: number | null = null
const startTimer = () => {
  timerInterval = setInterval(() => {
    spendTime.value = Math.floor((Date.now() - startTime.value) / 1000)
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

/* 格式化时间 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/* 选择答案 */
const handleSelectAnswer = (questionId: number, answer: string) => {
  const question = questions.value[currentIndex.value]

  if (question.type === 0 || question.type === 3) {
    /* 单选/判断直接设置 */
    userAnswers.value[questionId] = answer
  } else if (question.type === 1) {
    /* 多选处理 */
    const currentAnswers = (userAnswers.value[questionId] || '').split('').filter(Boolean)
    const index = currentAnswers.indexOf(answer)

    if (index > -1) {
      currentAnswers.splice(index, 1)
    } else {
      currentAnswers.push(answer)
    }

    currentAnswers.sort()
    userAnswers.value[questionId] = currentAnswers.join('')
  }
}

/* 上一题 */
const handlePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

/* 下一题 */
const handleNext = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

/* 跳转到指定题目 */
const handleJumpTo = (index: number) => {
  currentIndex.value = index
}

/* 提交练习 */
const handleSubmit = () => {
  const unanswered = questions.value.filter(q => !userAnswers.value[q.id])
  if (unanswered.length > 0) {
    message.confirm(
      `还有 ${unanswered.length} 道题目未作答，确定要提交吗？`,
      '提交确认'
    ).then(() => {
      submitPractice()
    }).catch(() => {})
  } else {
    submitPractice()
  }
}

/* 提交练习结果 */
const submitPractice = () => {
  stopTimer()

  /* 计算正确率 */
  let correct = 0
  questions.value.forEach(q => {
    if (userAnswers.value[q.id] === q.answer) {
      correct++
    }
  })

  resultStats.correctCount = correct
  resultStats.wrongCount = questions.value.length - correct
  resultStats.accuracy = Math.round((correct / questions.value.length) * 100)

  /* 保存练习记录 */
  savePracticeRecord({
    questionCount: questions.value.length,
    correctCount: resultStats.correctCount,
    spendTime: spendTime.value,
  })

  isFinished.value = true
}

/* 重新开始 */
const handleRestart = () => {
  isStarted.value = false
  isFinished.value = false
  questions.value = []
  currentIndex.value = 0
  userAnswers.value = {}
  spendTime.value = 0
  resultStats.correctCount = 0
  resultStats.wrongCount = 0
  resultStats.accuracy = 0
}

/* 查看解析 */
const showAnalysis = ref(false)

/* 获取当前题目 */
const currentQuestion = computed(() => questions.value[currentIndex.value])

/* 获取答题进度 */
const progress = computed(() => {
  const answered = Object.keys(userAnswers.value).length
  return Math.round((answered / questions.value.length) * 100)
})

/* 获取选项样式 */
const getOptionClass = (question: QuestionVO, option: string, isResult: boolean = false): string => {
  const userAnswer = userAnswers.value[question.id]

  if (isResult) {
    /* 结果显示模式 */
    if (option === question.answer) {
      return 'border-green-500 bg-green-50'
    }
    if (userAnswer === option && userAnswer !== question.answer) {
      return 'border-red-500 bg-red-50'
    }
    return 'border-gray-200 opacity-50'
  }

  /* 答题模式 */
  if (question.type === 0 || question.type === 3) {
    if (userAnswer === option) {
      return 'border-blue-500 bg-blue-50 text-blue-600'
    }
  } else if (question.type === 1) {
    if (userAnswer?.includes(option)) {
      return 'border-blue-500 bg-blue-50 text-blue-600'
    }
  }

  return 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
}

/* 获取选项状态图标 */
const getOptionIcon = (question: QuestionVO, option: string): string => {
  const userAnswer = userAnswers.value[question.id]

  if (option === question.answer) {
    return 'ep:circle-check-filled' /* 正确答案 */
  }
  if (userAnswer === option && userAnswer !== question.answer) {
    return 'ep:circle-close-filled' /* 错误答案 */
  }
  return ''
}

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面标题区 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">每日练习</h1>
            <p class="text-sm text-gray-500 mt-2">每日一练，保持学习状态，积少成多</p>
          </div>
          <div v-if="isStarted && !isFinished" class="flex items-center gap-4">
            <span class="text-sm text-gray-500">用时：{{ formatTime(spendTime) }}</span>
            <button
              class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              @click="handleRestart"
            >
              退出
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- 欢迎界面 -->
      <div v-if="!isStarted && !isFinished" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧打卡卡片 -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
              <Icon name="ep:sunrise" class="text-4xl text-orange-500" />
            </div>
            <h2 class="text-xl font-bold text-gray-800">每日打卡</h2>
            <p class="text-sm text-gray-500 mt-2">已连续打卡 <span class="text-orange-500 font-bold text-lg">{{ practiceSettings.dailyStreak }}</span> 天</p>
          </div>

          <!-- 打卡日历 -->
          <div class="grid grid-cols-7 gap-2 mb-6">
            <div v-for="day in 7" :key="day" class="text-center">
              <div
                class="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm"
                :class="day <= practiceSettings.dailyStreak ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'"
              >
                <Icon v-if="day <= practiceSettings.dailyStreak" name="ep:check" />
                <span v-else>{{ day }}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1">{{ ['一', '二', '三', '四', '五', '六', '日'][day - 1] }}</div>
            </div>
          </div>

          <!-- 今日状态 -->
          <div v-if="practiceSettings.todayCompleted" class="text-center p-4 bg-green-50 rounded-lg">
            <Icon name="ep:success-filled" class="text-3xl text-green-500 mb-2" />
            <p class="text-green-700 font-medium">今日已完成练习</p>
            <p class="text-sm text-green-600 mt-1">明天再来继续打卡吧！</p>
          </div>
        </div>

        <!-- 右侧设置 -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-6">练习设置</h2>

          <!-- 题目数量 -->
          <div class="mb-6">
            <label class="text-sm font-medium text-gray-700 mb-3 block">题目数量</label>
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="count in [5, 10, 15, 20]"
                :key="count"
                class="py-3 rounded-lg border-2 text-center transition-colors"
                :class="practiceSettings.questionCount === count ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300'"
                @click="practiceSettings.questionCount = count"
              >
                {{ count }}题
              </button>
            </div>
          </div>

          <!-- 功能说明 -->
          <div class="space-y-3 mb-6">
            <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon name="ep:random" class="text-blue-500 mt-0.5" />
              <div>
                <h4 class="text-sm font-medium text-gray-700">随机抽题</h4>
                <p class="text-xs text-gray-500">系统从题库中随机抽取题目，覆盖各章节知识点</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon name="ep:timer" class="text-blue-500 mt-0.5" />
              <div>
                <h4 class="text-sm font-medium text-gray-700">计时练习</h4>
                <p class="text-xs text-gray-500">记录答题用时，帮助你提高答题速度</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon name="ep:data-analysis" class="text-blue-500 mt-0.5" />
              <div>
                <h4 class="text-sm font-medium text-gray-700">智能分析</h4>
                <p class="text-xs text-gray-500">练习结束后查看正确率和详细解析</p>
              </div>
            </div>
          </div>

          <!-- 开始按钮 -->
          <button
            class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            @click="handleStartPractice"
          >
            <Icon name="ep:edit-pen" />
            <span>开始每日练习</span>
          </button>
        </div>
      </div>

      <!-- 练习界面 -->
      <div v-else-if="isStarted && !isFinished" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧答题卡 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-4">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">答题卡</h2>

            <!-- 进度条 -->
            <div class="mb-4">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-500">答题进度</span>
                <span class="text-gray-700">{{ Object.keys(userAnswers).length }}/{{ questions.length }}</span>
              </div>
              <el-progress :percentage="progress" :stroke-width="8" />
            </div>

            <!-- 题号列表 -->
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="(q, index) in questions"
                :key="q.id"
                class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
                :class="[
                  currentIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  userAnswers[q.id] ? 'ring-2 ring-blue-500' : ''
                ]"
                @click="handleJumpTo(index)"
              >
                {{ index + 1 }}
              </button>
            </div>

            <!-- 提交按钮 -->
            <button
              class="w-full mt-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              @click="handleSubmit"
            >
              提交练习
            </button>
          </div>
        </div>

        <!-- 右侧题目区域 -->
        <div class="lg:col-span-2">
          <div v-if="currentQuestion" class="bg-white rounded-xl shadow-sm p-6">
            <!-- 题号与类型 -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  {{ currentIndex + 1 }}/{{ questions.length }}
                </span>
                <span class="text-sm text-gray-500">{{ currentQuestion.typeName }}</span>
              </div>
              <span class="text-sm text-gray-400">{{ formatTime(spendTime) }}</span>
            </div>

            <!-- 题目内容 -->
            <div class="mb-6">
              <p class="text-base text-gray-800 leading-relaxed">{{ currentQuestion.content }}</p>
            </div>

            <!-- 选项 -->
            <div class="space-y-3 mb-6">
              <button
                v-for="(value, key) in currentQuestion.options"
                :key="key"
                class="w-full p-4 text-left rounded-lg border-2 transition-all"
                :class="getOptionClass(currentQuestion, key)"
                @click="handleSelectAnswer(currentQuestion.id, key)"
              >
                <div class="flex items-start gap-3">
                  <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border font-medium text-sm"
                    :class="userAnswers[currentQuestion.id]?.includes(key) ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-600'"
                  >
                    {{ key }}
                  </span>
                  <span class="text-sm text-gray-700 pt-1">{{ value }}</span>
                </div>
              </button>
            </div>

            <!-- 导航按钮 -->
            <div class="flex items-center justify-between">
              <button
                class="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                :disabled="currentIndex === 0"
                @click="handlePrev"
              >
                <Icon name="ep:arrow-left" class="mr-1" />
                上一题
              </button>

              <button
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                :disabled="currentIndex === questions.length - 1"
                @click="handleNext"
              >
                下一题
                <Icon name="ep:arrow-right" class="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 结果界面 -->
      <div v-else-if="isFinished" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-sm p-8">
          <!-- 结果概览 -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
              :class="resultStats.accuracy >= 80 ? 'bg-green-100' : resultStats.accuracy >= 60 ? 'bg-yellow-100' : 'bg-red-100'"
            >
              <span class="text-3xl font-bold"
                :class="resultStats.accuracy >= 80 ? 'text-green-600' : resultStats.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'"
              >
                {{ resultStats.accuracy }}%
              </span>
            </div>
            <h2 class="text-xl font-bold text-gray-800">练习完成！</h2>
            <p class="text-gray-500 mt-2">
              {{ resultStats.accuracy >= 80 ? '太棒了！继续保持！' : resultStats.accuracy >= 60 ? '还不错，再接再厉！' : '还需努力，加油！' }}
            </p>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ resultStats.correctCount }}</div>
              <div class="text-sm text-green-700">正确</div>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <div class="text-2xl font-bold text-red-600">{{ resultStats.wrongCount }}</div>
              <div class="text-sm text-red-700">错误</div>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ formatTime(spendTime) }}</div>
              <div class="text-sm text-blue-700">用时</div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="space-y-3">
            <button
              class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              @click="showAnalysis = !showAnalysis"
            >
              {{ showAnalysis ? '隐藏解析' : '查看解析' }}
            </button>
            <button
              class="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              @click="handleRestart"
            >
              再来一组
            </button>
          </div>
        </div>

        <!-- 详细解析 -->
        <div v-if="showAnalysis" class="mt-6 space-y-4">
          <div
            v-for="(q, index) in questions"
            :key="q.id"
            class="bg-white rounded-xl shadow-sm p-6"
          >
            <div class="flex items-start gap-3 mb-4">
              <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium"
                :class="userAnswers[q.id] === q.answer ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
              >
                {{ index + 1 }}
              </span>
              <div class="flex-1">
                <p class="text-gray-800">{{ q.content }}</p>
              </div>
            </div>

            <!-- 选项 -->
            <div class="space-y-2 mb-4 ml-11">
              <div
                v-for="(value, key) in q.options"
                :key="key"
                class="p-3 rounded-lg border"
                :class="getOptionClass(q, key, true)"
              >
                <div class="flex items-center gap-2">
                  <Icon v-if="getOptionIcon(q, key)" :name="getOptionIcon(q, key)" class="text-lg"
                    :class="key === q.answer ? 'text-green-500' : 'text-red-500'"
                  />
                  <span class="font-medium" :class="key === q.answer ? 'text-green-700' : ''">{{ key }}.</span>
                  <span :class="key === q.answer ? 'text-green-700' : ''">{{ value }}</span>
                </div>
              </div>
            </div>

            <!-- 解析 -->
            <div class="ml-11 p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500 mb-1">正确答案：{{ q.answer }}</div>
              <div class="text-sm text-gray-500 mb-2">你的答案：{{ userAnswers[q.id] || '未作答' }}</div>
              <div class="text-sm text-gray-700">
                <span class="font-medium">解析：</span>{{ q.analysis }}
              </div>
              <div class="text-sm text-blue-600 mt-2">
                <span class="font-medium">考点：</span>{{ q.point }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
