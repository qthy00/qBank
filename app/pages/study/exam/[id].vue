<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex flex-col justify-center items-center h-screen">
      <el-loading />
      <p class="mt-4 text-gray-500">正在加载试卷...</p>
    </div>

    <!-- 试卷未配置状态 -->
    <div v-else-if="!isSetting" class="flex flex-col justify-center items-center h-screen">
      <div class="text-center">
        <Icon name="ep:document" class="text-6xl text-gray-300 mb-4" />
        <h2 class="text-xl font-semibold text-gray-700 mb-2">试卷暂未载入</h2>
        <p class="text-gray-500 mb-6">请配置考试参数后开始考试</p>
        <el-button type="primary" size="large" @click="showSetting">
          <Icon name="ep:setting" class="mr-2" />
          配置试卷
        </el-button>
      </div>
    </div>

    <!-- 考试主体 -->
    <template v-else>
      <!-- 顶部导航栏 -->
      <div class="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <!-- 左侧：返回和标题 -->
            <div class="flex items-center gap-4">
              <el-button type="info" plain circle @click="handleExit">
                <Icon name="ep:arrow-left" />
              </el-button>
              <div>
                <h1 class="text-lg font-semibold text-gray-900">{{ paper.title }}</h1>
                <p class="text-xs text-gray-500">开始时间：{{ startTime }}</p>
              </div>
            </div>

            <!-- 中间：考试信息 -->
            <div class="hidden md:flex items-center gap-6 text-sm">
              <div class="flex items-center gap-1">
                <span class="text-gray-600">总题数：</span>
                <span class="font-medium">{{ totalQuestions }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-gray-600">已答题：</span>
                <span class="font-medium text-green-600">{{ answeredCount }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-gray-600">未答题：</span>
                <span class="font-medium text-gray-400">{{ totalQuestions - answeredCount }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-gray-600">标记：</span>
                <span class="font-medium text-amber-600">{{ markedCount }}</span>
              </div>
            </div>

            <!-- 右侧：计时器和交卷 -->
            <div class="flex items-center gap-4">
              <div v-if="taskTimerId" class="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <Icon name="ep:timer" class="text-blue-600" />
                <TimerInstance :timer-id="taskTimerId" :index="601" />
              </div>
              <el-button type="danger" @click="handleSubmit">
                <Icon name="ep:check" class="mr-1" />
                交卷
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- 左侧题目区域 -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-lg shadow-sm">
              <!-- 题目导航栏 -->
              <div class="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100">
                <!-- 题型标签 -->
                <div class="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-blue-100">
                  <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span class="text-sm font-medium">{{ currentQuestion.typeName || '单选题' }}</span>
                </div>
                <!-- 分值 -->
                <div class="flex items-center gap-1 px-4 py-1.5 bg-white rounded-full border border-blue-100">
                  <Icon name="solar:star-rings-linear" class="text-red-400" />
                  <span class="text-sm text-red-400">分值：{{ currentQuestion.score }}分</span>
                </div>
                <!-- 进度 -->
                <div class="text-sm font-medium text-blue-800">
                  第 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }} 题
                </div>
              </div>

              <!-- 题目内容 -->
              <div class="p-6">
                <!-- 案例/材料题 -->
                <template v-if="[6, 8].includes(currentQuestion.type)">
                  <div class="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                    <div class="ml-4">
                      <h3 class="font-medium text-blue-800 mb-3">
                        {{ currentQuestion.type === 6 ? '案例描述' : '通用题干/选项' }}
                      </h3>
                      <div class="text-slate-700 leading-relaxed text-sm" v-html="currentQuestion.parentQuestion" />
                    </div>
                  </div>
                </template>

                <!-- 普通题干 -->
                <template v-else>
                  <div class="mb-6 pb-4 border-b border-gray-100">
                    <h2 v-if="currentQuestion.type === 4" class="text-lg font-semibold text-gray-800">
                      请填写以下空格
                    </h2>
                    <div v-else class="text-lg font-semibold text-gray-800 leading-relaxed" v-html="currentQuestion.content" />
                  </div>
                </template>

                <!-- 答题区域 -->
                <div class="space-y-4">
                  <!-- 单选题/多选题 -->
                  <div v-if="[0, 1, 2].includes(currentQuestion.type)">
                    <div class="space-y-2">
                      <div
                        v-for="(value, key) in currentQuestion.options"
                        :key="key"
                        :class="[
                          'p-4 rounded-lg border-2 cursor-pointer transition-all',
                          isOptionSelected(key)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        ]"
                        @click="handleOptionSelect(key)"
                      >
                        <div class="flex items-center gap-3">
                          <span
                            :class="[
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                              isOptionSelected(key)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                            ]"
                          >
                            {{ key }}
                          </span>
                          <span class="flex-1 text-gray-700">{{ value }}</span>
                          <Icon
                            v-if="isOptionSelected(key)"
                            name="ep:check"
                            class="text-blue-500 text-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 判断题 -->
                  <div v-else-if="currentQuestion.type === 3">
                    <div class="space-y-2">
                      <div
                        v-for="item in judgeOptions"
                        :key="item.value"
                        :class="[
                          'p-4 rounded-lg border-2 cursor-pointer transition-all',
                          isOptionSelected(item.value)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        ]"
                        @click="handleOptionSelect(item.value)"
                      >
                        <div class="flex items-center gap-3">
                          <span
                            :class="[
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                              isOptionSelected(item.value)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                            ]"
                          >
                            {{ item.label === '正确' ? '✓' : '✗' }}
                          </span>
                          <span class="flex-1 text-gray-700">{{ item.label }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 填空题 -->
                  <div v-else-if="currentQuestion.type === 4">
                    <div class="space-y-4">
                      <p class="text-gray-700 leading-relaxed">
                        <template v-for="(part, index) in parseFillContent(currentQuestion.content)" :key="index">
                          <template v-if="part === '（　　）'">
                            <input
                              v-model="fillAnswers[index]"
                              placeholder="请输入"
                              class="mx-1 border border-gray-300 rounded px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              style="width: 120px"
                              @input="handleFillInput"
                            />
                          </template>
                          <template v-else>{{ part }}</template>
                        </template>
                      </p>
                    </div>
                  </div>

                  <!-- 案例/简答题 -->
                  <div v-else-if="[5, 6, 7].includes(currentQuestion.type)">
                    <div v-if="currentQuestion.type === 6" class="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
                      <h3 class="font-medium text-red-800 mb-2">问题</h3>
                      <div class="text-gray-700" v-html="currentQuestion.content" />
                    </div>
                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <label class="text-sm font-medium text-gray-700">输入答案</label>
                        <span class="text-xs text-gray-500 italic">案例题由AI进行解析和判分</span>
                      </div>
                      <textarea
                        v-model="caseAnswer"
                        rows="6"
                        placeholder="请在此输入您的答案..."
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                      />
                    </div>
                  </div>

                  <!-- 复合题 -->
                  <div v-else-if="currentQuestion.type === 8">
                    <div class="space-y-6">
                      <div
                        v-for="(subQuestion, subIndex) in currentQuestion.questionList"
                        :key="subIndex"
                        class="border-l-2 border-indigo-200 pl-4 py-2"
                      >
                        <div class="flex items-start justify-between mb-3">
                          <div class="font-medium text-gray-800" v-html="subQuestion.content" />
                          <span
                            :class="[
                              'px-2 py-0.5 rounded-full text-xs font-medium',
                              getSubQuestionTypeClass(subQuestion.parentSonType)
                            ]"
                          >
                            {{ typeNames[subQuestion.parentSonType] }}
                          </span>
                        </div>

                        <!-- 子问题选项 -->
                        <div v-if="[0, 1, 2].includes(subQuestion.parentSonType)" class="space-y-2">
                          <div
                            v-for="(value, key) in subQuestion.options"
                            :key="key"
                            :class="[
                              'p-3 rounded-lg border cursor-pointer transition-all',
                              isSubOptionSelected(key, subQuestion.id)
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'
                            ]"
                            @click="handleSubOptionSelect(key, subQuestion.id, subQuestion.parentSonType)"
                          >
                            <div class="flex items-center gap-2">
                              <span
                                :class="[
                                  'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                                  isSubOptionSelected(key, subQuestion.id)
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 text-gray-700'
                                ]"
                              >
                                {{ key }}
                              </span>
                              <span class="text-gray-700">{{ value }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- 子问题简答 -->
                        <div v-else-if="[5, 7].includes(subQuestion.parentSonType)">
                          <textarea
                            v-model="subCaseAnswers[subQuestion.id]"
                            rows="4"
                            placeholder="请输入答案..."
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            @input="handleSubCaseInput(subQuestion.id)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <el-button
                    type="info"
                    plain
                    :disabled="currentQuestionIndex === 0"
                    @click="prevQuestion"
                  >
                    <Icon name="ep:arrow-left" class="mr-2" />
                    上一题
                  </el-button>

                  <el-button
                    :type="isMarked ? 'warning' : 'default'"
                    :plain="!isMarked"
                    @click="toggleMark"
                  >
                    <Icon :name="isMarked ? 'ep:star-filled' : 'ep:star'" class="mr-2" />
                    {{ isMarked ? '取消标记' : '标记题目' }}
                  </el-button>

                  <el-button
                    v-if="currentQuestionIndex < totalQuestions - 1"
                    type="primary"
                    @click="nextQuestion"
                  >
                    下一题
                    <Icon name="ep:arrow-right" class="ml-2" />
                  </el-button>
                  <el-button
                    v-else
                    type="success"
                    @click="handleSubmit"
                  >
                    <Icon name="ep:check" class="mr-2" />
                    提交试卷
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧答题卡 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="ep:grid" />
                答题卡
              </h3>
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="(question, index) in paper.questions"
                  :key="question.id"
                  :class="[
                    'w-10 h-10 rounded-lg text-sm font-medium transition-all',
                    currentQuestionIndex === index
                      ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                      : markedQuestions.includes(index)
                        ? 'bg-amber-100 text-amber-700 border border-amber-300'
                        : answeredQuestions.includes(question.id)
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                  @click="goToQuestion(index)"
                >
                  {{ index + 1 }}
                </button>
              </div>

              <!-- 图例 -->
              <div class="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded bg-green-100 border border-green-300"></span>
                  <span class="text-gray-600">已答题</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded bg-amber-100 border border-amber-300"></span>
                  <span class="text-gray-600">已标记</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded bg-blue-500"></span>
                  <span class="text-gray-600">当前题</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded bg-gray-100 border border-gray-200"></span>
                  <span class="text-gray-600">未答题</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 试卷设置弹窗 -->
    <PaperSetting
      v-if="showSettingDialog"
      ref="settingRef"
      :qbank-id="qbankId"
      @success="handleSettingSuccess"
      @cancel="handleSettingCancel"
    />

    <!-- AI生成报告弹窗 -->
    <AIGeneratingDialog
      v-model="showAIDialog"
      title="正在生成模考报告"
      description="正在分析您的试卷..."
    />
  </div>
</template>

<script setup lang="ts">
import type { QuestionVO, Paper, AnswerCache, AnswerDetail } from '~/types/qBank'
import type { SubmitPaperReqVO, PaperAnswerVO } from '~/types/exam'
import { submitMockPaper, generateMockPaper } from '~/api/exam'
import { getMockQbankDetail } from '~/api/qbank/mock'
import PaperSetting from '~/views/qBank/components/PaperSetting.vue'
import AIGeneratingDialog from '~/components/AIGeneratingDialog.vue'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const paperId = computed(() => Number(route.params.id))
const qbankId = computed(() => Number(route.query.qbankId) || 0)

/* ==================== 状态定义 ==================== */
const loading = ref(false)
const isSetting = ref(false)
const showSettingDialog = ref(false)
const showAIDialog = ref(false)
const settingRef = ref()

const paper = ref<Paper>({
  paperId: undefined,
  title: '',
  durationMinutes: 120,
  totalScore: 100,
  questions: [],
})

const startTime = ref('')
const taskTimerId = ref('')
const currentQuestionIndex = ref(0)
const answeredQuestions = ref<number[]>([])
const markedQuestions = ref<number[]>([])
const answerCache = ref<AnswerCache>({})

/* 当前答案 */
const currentAnswer = ref<string[]>([])
const fillAnswers = ref<string[]>([])
const caseAnswer = ref('')
const subCaseAnswers = ref<Record<number, string>>({})
const compositeAnswers = ref<Record<number, string[]>>({})

/* ==================== 题型配置 ==================== */
const judgeOptions = [
  { label: '正确', value: 'A' },
  { label: '错误', value: 'B' },
]

const typeNames: Record<number, string> = {
  0: '单选题',
  1: '多选题',
  2: '不定项',
  3: '判断题',
  4: '填空题',
  5: '简答题',
  6: '案例题',
  7: '论述题',
  8: '复合题',
}

const getSubQuestionTypeClass = (type: number) => {
  const classes: Record<number, string> = {
    0: 'bg-blue-100 text-blue-700',
    1: 'bg-indigo-100 text-indigo-700',
    2: 'bg-purple-100 text-purple-700',
    3: 'bg-green-100 text-green-700',
    5: 'bg-orange-100 text-orange-700',
    7: 'bg-red-100 text-red-700',
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
}

/* ==================== 计算属性 ==================== */
const totalQuestions = computed(() => paper.value.questions.length)
const answeredCount = computed(() => answeredQuestions.value.length)
const markedCount = computed(() => markedQuestions.value.length)

const currentQuestion = computed(() => {
  return paper.value.questions[currentQuestionIndex.value] || {} as QuestionVO
})

const isMarked = computed(() => markedQuestions.value.includes(currentQuestionIndex.value))

/* ==================== 方法定义 ==================== */
const showSetting = () => {
  showSettingDialog.value = true
  nextTick(() => {
    settingRef.value?.open()
  })
}

const handleSettingSuccess = (data: Paper) => {
  paper.value = data
  isSetting.value = true
  startTime.value = new Date().toLocaleString('zh-CN')
  initExam()
}

const handleSettingCancel = () => {
  if (!isSetting.value) {
    router.back()
  }
}

const initExam = () => {
  /* 初始化答题状态 */
  answeredQuestions.value = []
  markedQuestions.value = []
  currentQuestionIndex.value = 0
  answerCache.value = {}

  /* 为每道题初始化缓存 */
  paper.value.questions.forEach((question) => {
    answerCache.value[question.id] = {
      userAnswer: {},
      spendTime: 0,
      isSubmitted: false,
    }
  })

  /* 创建计时器 */
  createTimer()
}

const createTimer = () => {
  const timerStore = useTimerStore()
  taskTimerId.value = timerStore.createTimer({
    name: '模拟考试计时器',
    durationMinutes: paper.value.durationMinutes,
    timeMode: 'countdown',
  })
  timerStore.startTimer(taskTimerId.value)
}

const isOptionSelected = (key: string) => {
  return currentAnswer.value.includes(key)
}

const isSubOptionSelected = (key: string, questionId: number) => {
  const answers = compositeAnswers.value[questionId] || []
  return answers.includes(key)
}

const handleOptionSelect = (key: string) => {
  const question = currentQuestion.value
  const isSingleChoice = [0, 3].includes(question.type)

  if (isSingleChoice) {
    currentAnswer.value = [key]
  } else {
    const index = currentAnswer.value.indexOf(key)
    if (index > -1) {
      currentAnswer.value.splice(index, 1)
    } else {
      currentAnswer.value.push(key)
    }
  }

  /* 自动保存答案 */
  saveCurrentAnswer()
}

const handleSubOptionSelect = (key: string, questionId: number, sonType: number) => {
  const isSingleChoice = [0, 3].includes(sonType)

  if (!compositeAnswers.value[questionId]) {
    compositeAnswers.value[questionId] = []
  }

  if (isSingleChoice) {
    compositeAnswers.value[questionId] = [key]
  } else {
    const answers = compositeAnswers.value[questionId]
    const index = answers.indexOf(key)
    if (index > -1) {
      answers.splice(index, 1)
    } else {
      answers.push(key)
    }
  }

  saveCurrentAnswer()
}

const handleFillInput = () => {
  const answer = fillAnswers.value.filter(item => item && item.trim()).join('###')
  currentAnswer.value = answer ? [answer] : []
  saveCurrentAnswer()
}

const handleSubCaseInput = (questionId: number) => {
  compositeAnswers.value[questionId] = [subCaseAnswers.value[questionId] || '']
  saveCurrentAnswer()
}

const saveCurrentAnswer = () => {
  const question = currentQuestion.value
  if (!question) return

  const cache: AnswerDetail = {
    userAnswer: {},
    spendTime: 0,
    isSubmitted: false,
    score: question.score,
    typeName: question.typeName || typeNames[question.type],
    contentId: question.contentId,
  }

  if (question.type === 8) {
    /* 复合题 */
    question.questionList.forEach((sub) => {
      const subAnswer = compositeAnswers.value[sub.id]
      cache.userAnswer[sub.id] = subAnswer ? subAnswer.join(',') : ''
    })
    cache.isSubmitted = question.questionList.every((sub) => {
      const ans = compositeAnswers.value[sub.id]
      return ans && ans.length > 0 && ans[0] !== ''
    })
  } else {
    let answer: string[] = []
    if (question.type === 4) {
      answer = [fillAnswers.value.join('###')]
    } else if ([5, 6, 7].includes(question.type)) {
      answer = [caseAnswer.value]
    } else {
      answer = currentAnswer.value
    }
    cache.userAnswer[question.id] = answer.join(',')
    cache.isSubmitted = answer.length > 0 && answer[0] !== ''
  }

  answerCache.value[question.id] = cache

  /* 更新已答题列表 */
  if (cache.isSubmitted && !answeredQuestions.value.includes(question.id)) {
    answeredQuestions.value.push(question.id)
  }
}

const toggleMark = () => {
  const index = currentQuestionIndex.value
  const markIndex = markedQuestions.value.indexOf(index)
  if (markIndex > -1) {
    markedQuestions.value.splice(markIndex, 1)
  } else {
    markedQuestions.value.push(index)
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    saveCurrentAnswer()
    currentQuestionIndex.value--
    restoreQuestionState()
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    saveCurrentAnswer()
    currentQuestionIndex.value++
    restoreQuestionState()
  } else {
    message.confirm('已经是最后一题了，是否提交试卷？', '提示').then(() => {
      handleSubmit()
    }).catch(() => {})
  }
}

const goToQuestion = (index: number) => {
  saveCurrentAnswer()
  currentQuestionIndex.value = index
  restoreQuestionState()
}

const restoreQuestionState = () => {
  const question = currentQuestion.value
  if (!question) return

  /* 清空当前答案 */
  currentAnswer.value = []
  fillAnswers.value = []
  caseAnswer.value = ''

  const cache = answerCache.value[question.id]
  if (!cache) return

  if (question.type === 8) {
    /* 恢复复合题答案 */
    question.questionList.forEach((sub) => {
      const answer = cache.userAnswer[sub.id] || ''
      if ([5, 6, 7].includes(sub.parentSonType)) {
        subCaseAnswers.value[sub.id] = answer
      } else {
        compositeAnswers.value[sub.id] = answer ? answer.split(',') : []
      }
    })
  } else {
    const answer = cache.userAnswer[question.id] || ''
    if (question.type === 4) {
      fillAnswers.value = answer.split('###')
    } else if ([5, 6, 7].includes(question.type)) {
      caseAnswer.value = answer
    } else {
      currentAnswer.value = answer ? answer.split(',') : []
    }
  }
}

const parseFillContent = (content: string) => {
  if (!content) return []
  return content.split(/（\s*）/g).flatMap((part, i, arr) => {
    if (i < arr.length - 1) {
      return [part, '（　　）']
    }
    return [part]
  })
}

const handleSubmit = async () => {
  saveCurrentAnswer()

  /* 检查是否有未答题目 */
  const unanswered = totalQuestions.value - answeredCount.value
  if (unanswered > 0) {
    try {
      await message.confirm(`还有 ${unanswered} 道题目未完成，是否提交试卷？`, '确认提交')
    } catch {
      return
    }
  }

  /* 准备提交数据 */
  const answers: PaperAnswerVO[] = []
  Object.keys(answerCache.value).forEach((key) => {
    const questionId = Number(key)
    if (isNaN(questionId)) return

    const cache = answerCache.value[questionId]
    Object.entries(cache.userAnswer).forEach(([id, answer]) => {
      if (answer && answer !== '') {
        answers.push({
          questionId: Number(id),
          answer,
          typeName: cache.typeName || '',
          spendTime: cache.spendTime || 0,
          score: cache.score || 0,
        })
      }
    })
  })

  const data: SubmitPaperReqVO = {
    paperId: paper.value.paperId || paperId.value,
    answers,
    submitTime: new Date().getTime(),
    startTime: answerCache.value.startTime,
  }

  showAIDialog.value = true

  try {
    const res = await submitMockPaper(data)
    if (res.status === 'SUCCESS') {
      message.success('提交成功')
      /* 停止计时器 */
      const timerStore = useTimerStore()
      timerStore.stopTimer(taskTimerId.value)
      /* 跳转到报告页面 */
      navigateTo(`/exam/report/${res.paperId}?userPaperId=${res.userPaperId}`)
    } else {
      message.error('提交失败')
    }
  } catch (err) {
    message.error('提交失败')
    console.log(err)
  } finally {
    showAIDialog.value = false
  }
}

const handleExit = async () => {
  try {
    await message.confirm('退出后当前答题进度将保存，确定要退出吗？', '提示')
    router.back()
  } catch {
    /* 用户取消 */
  }
}

/* ==================== 加载试卷 ==================== */
const loadPaper = async () => {
  loading.value = true
  try {
    /* 如果有缓存的未完成的试卷，尝试恢复 */
    const cache = useCache().wsCache.get('unfinishedPaper')
    if (cache && cache.paperId === paperId.value) {
      /* 恢复试卷 */
      paper.value = await generateMockPaper({
        qbankId: qbankId.value,
        paperId: paperId.value,
      })
      isSetting.value = true
      startTime.value = new Date(cache.startTime).toLocaleString('zh-CN')
      /* 恢复答案缓存 */
      answerCache.value = cache
      answeredQuestions.value = Object.keys(cache)
        .filter((k) => cache[k].isSubmitted)
        .map((k) => Number(k))
      currentQuestionIndex.value = cache.currentIndex || 0
      restoreQuestionState()
    } else {
      /* 显示配置弹窗 */
      showSetting()
    }
  } finally {
    loading.value = false
  }
}

/* ==================== 初始化 ==================== */
onMounted(() => {
  loadPaper()
})

onBeforeUnmount(() => {
  /* 清理计时器 */
  if (taskTimerId.value) {
    const timerStore = useTimerStore()
    timerStore.deleteTimer(taskTimerId.value)
  }
})

useHead({
  title: computed(() => paper.value.title ? `${paper.value.title} - 模拟考试` : '模拟考试'),
})
</script>
