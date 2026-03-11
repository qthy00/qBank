<script setup lang="ts">
import {getMockChapterList, getChapterQuestions, savePracticeRecord} from '~/api/qbank/practiceMock'
import type {ChapterVO, QuestionVO} from '~/types/qBank'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '章节练习'
})

const router = useRouter()
const message = useMessage()

/* 章节数据 */
const chapters = ref<ChapterVO[]>([])
const loading = ref(false)

/* 当前选中的章节/小节 */
const selectedChapter = ref<ChapterVO | null>(null)
const selectedSection = ref<any>(null)

/* 练习设置 */
const practiceSettings = reactive({
  questionCount: 10,
  questionTypes: [0, 1, 3], /* 单选、多选、判断 */
  isRandom: true,
})

/* 练习中状态 */
const isPracticing = ref(false)
const questions = ref<QuestionVO[]>([])
const currentIndex = ref(0)
const userAnswers = ref<Record<number, string>>({})
const startTime = ref<number>(0)
const spendTime = ref(0)

/* 获取章节列表 */
const fetchChapters = async () => {
  loading.value = true
  try {
    chapters.value = getMockChapterList()
  } catch (error) {
    console.error('获取章节列表失败:', error)
    message.error('获取章节列表失败')
  } finally {
    loading.value = false
  }
}

/* 选择章节 */
const handleSelectChapter = (chapter: ChapterVO) => {
  selectedChapter.value = chapter
  selectedSection.value = null
}

/* 选择小节 */
const handleSelectSection = (section: any) => {
  selectedSection.value = section
}

/* 开始练习 */
const handleStartPractice = () => {
  if (!selectedChapter.value) {
    message.warning('请先选择章节')
    return
  }

  /* 获取题目 */
  if (selectedSection.value) {
    questions.value = getChapterQuestions(selectedSection.value.id, practiceSettings.questionCount)
  } else {
    questions.value = getChapterQuestions(selectedChapter.value.id, practiceSettings.questionCount)
  }

  if (questions.value.length === 0) {
    message.warning('该章节暂无题目')
    return
  }

  /* 开始练习 */
  isPracticing.value = true
  currentIndex.value = 0
  userAnswers.value = {}
  startTime.value = Date.now()

  /* 启动计时器 */
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

    /* 按字母顺序排序 */
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
  /* 检查是否有未作答题目 */
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
  let correctCount = 0
  questions.value.forEach(q => {
    if (userAnswers.value[q.id] === q.answer) {
      correctCount++
    }
  })

  const accuracy = Math.round((correctCount / questions.value.length) * 100)

  /* 保存练习记录 */
  savePracticeRecord({
    chapterId: selectedChapter.value?.id,
    sectionId: selectedSection.value?.id,
    questionCount: questions.value.length,
    correctCount,
    spendTime: spendTime.value,
  })

  /* 设置结果数据 */
  resultStats.correctCount = correctCount
  resultStats.wrongCount = questions.value.length - correctCount
  resultStats.accuracy = accuracy
  isFinished.value = true
}

/* 重置练习 */
const resetPractice = () => {
  isPracticing.value = false
  isFinished.value = false
  showAnalysis.value = false
  questions.value = []
  currentIndex.value = 0
  userAnswers.value = {}
  spendTime.value = 0
  resultStats.correctCount = 0
  resultStats.wrongCount = 0
  resultStats.accuracy = 0
  selectedChapter.value = null
  selectedSection.value = null
  stopTimer()
}

/* 退出练习 */
const handleExit = () => {
  message.confirm(
    '确定要退出练习吗？当前进度将不会保存。',
    '退出确认'
  ).then(() => {
    resetPractice()
  }).catch(() => {})
}

/* 获取当前题目 */
const currentQuestion = computed(() => questions.value[currentIndex.value])

/* 获取答题进度 */
const progress = computed(() => {
  const answered = Object.keys(userAnswers.value).length
  return Math.round((answered / questions.value.length) * 100)
})

/* 结果统计 */
const isFinished = ref(false)
const resultStats = reactive({
  correctCount: 0,
  wrongCount: 0,
  accuracy: 0,
})
const showAnalysis = ref(false)
const getOptionClass = (question: QuestionVO, option: string): string => {
  const userAnswer = userAnswers.value[question.id]

  if (question.type === 0 || question.type === 3) {
    /* 单选/判断 */
    if (userAnswer === option) {
      return 'border-blue-500 bg-blue-50 text-blue-600'
    }
  } else if (question.type === 1) {
    /* 多选 */
    if (userAnswer?.includes(option)) {
      return 'border-blue-500 bg-blue-50 text-blue-600'
    }
  }

  return 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
}

onMounted(() => {
  fetchChapters()
})

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
            <h1 class="text-2xl font-bold text-gray-800">章节练习</h1>
            <p class="text-sm text-gray-500 mt-2">按章节系统学习，循序渐进掌握知识点</p>
          </div>
          <div v-if="isPracticing" class="flex items-center gap-4">
            <span class="text-sm text-gray-500">用时：{{ formatTime(spendTime) }}</span>
            <button
              class="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              @click="handleExit"
            >
              退出练习
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- 章节选择界面 -->
      <div v-if="!isPracticing" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧章节列表 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-4">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">选择章节</h2>
            <div v-loading="loading" class="space-y-2 max-h-[600px] overflow-y-auto">
              <div
                v-for="chapter in chapters"
                :key="chapter.id"
                class="p-3 rounded-lg cursor-pointer transition-colors"
                :class="selectedChapter?.id === chapter.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'"
                @click="handleSelectChapter(chapter)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-800 line-clamp-1">{{ chapter.name }}</h3>
                    <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>共{{ chapter.total }}题</span>
                      <span v-if="chapter.completedCount > 0">已做{{ chapter.completedCount }}题</span>
                      <span v-if="chapter.accuracyRate > 0" :class="chapter.accuracyRate >= 60 ? 'text-green-600' : 'text-red-600'">
                        正确率{{ chapter.accuracyRate }}%
                      </span>
                    </div>
                  </div>
                  <Icon
                    name="ep:arrow-right"
                    class="text-gray-400"
                    :class="selectedChapter?.id === chapter.id ? 'text-blue-500' : ''"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧小节选择和设置 -->
        <div class="lg:col-span-2">
          <div v-if="selectedChapter" class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ selectedChapter.name }}</h2>

            <!-- 小节列表 -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-600 mb-3">选择小节（可选）</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  class="p-3 text-left rounded-lg border transition-colors"
                  :class="!selectedSection ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
                  @click="selectedSection = null"
                >
                  <div class="font-medium text-sm text-gray-800">全章练习</div>
                  <div class="text-xs text-gray-500 mt-1">共{{ selectedChapter.total }}题</div>
                </button>
                <button
                  v-for="section in selectedChapter.sectionList"
                  :key="section.id"
                  class="p-3 text-left rounded-lg border transition-colors"
                  :class="selectedSection?.id === section.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
                  @click="handleSelectSection(section)"
                >
                  <div class="font-medium text-sm text-gray-800 line-clamp-1">{{ section.name }}</div>
                  <div class="text-xs text-gray-500 mt-1">共{{ section.total }}题</div>
                </button>
              </div>
            </div>

            <!-- 练习设置 -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-600 mb-3">练习设置</h3>
              <div class="space-y-4">
                <div>
                  <label class="text-sm text-gray-600 mb-2 block">题目数量</label>
                  <el-slider v-model="practiceSettings.questionCount" :min="5" :max="50" :step="5" show-stops />
                  <div class="text-center text-sm text-gray-600 mt-1">{{ practiceSettings.questionCount }}题</div>
                </div>
              </div>
            </div>

            <!-- 开始按钮 -->
            <button
              class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              @click="handleStartPractice"
            >
              <Icon name="ep:video-play" />
              <span>开始练习</span>
            </button>
          </div>

          <!-- 未选择章节提示 -->
          <div v-else class="bg-white rounded-xl shadow-sm p-12 text-center">
            <Icon name="ep:reading" class="text-6xl text-gray-300 mb-4" />
            <h3 class="text-lg font-medium text-gray-600 mb-2">请先选择章节</h3>
            <p class="text-sm text-gray-400">从左侧列表选择一个章节开始练习</p>
          </div>
        </div>
      </div>

      <!-- 练习界面 -->
      <div v-else-if="isPracticing && !isFinished" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <!-- 图例 -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <div class="w-4 h-4 rounded bg-blue-600"></div>
                  <span>当前</span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-4 h-4 rounded bg-gray-100 ring-2 ring-blue-500"></div>
                  <span>已答</span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-4 h-4 rounded bg-gray-100"></div>
                  <span>未答</span>
                </div>
              </div>
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

              <span class="text-sm text-gray-400">
                {{ userAnswers[currentQuestion.id] ? '已作答' : '未作答' }}
              </span>

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
      <div v-else class="max-w-2xl mx-auto">
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
              @click="resetPractice"
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
                :class="[
                  key === q.answer ? 'border-green-500 bg-green-50' : '',
                  userAnswers[q.id] === key && userAnswers[q.id] !== q.answer ? 'border-red-500 bg-red-50' : '',
                  key !== q.answer && userAnswers[q.id] !== key ? 'border-gray-200 opacity-50' : ''
                ]"
              >
                <div class="flex items-center gap-2">
                  <Icon
                    v-if="key === q.answer"
                    name="ep:circle-check-filled"
                    class="text-lg text-green-500"
                  />
                  <Icon
                    v-else-if="userAnswers[q.id] === key && userAnswers[q.id] !== q.answer"
                    name="ep:circle-close-filled"
                    class="text-lg text-red-500"
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
