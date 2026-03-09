<template>
  <div v-if="!isSetting" class="flex flex-col justify-center items-center h-60">
    <div>试卷暂未载入</div>
    <el-button type="primary" class="mt-3" plain @click="settingRef.open()">载入试卷</el-button>
  </div>

  <template v-else>
    <el-card
      v-loading="loading"
      element-loading-text="加载试卷中..."
      class="bg-gray-50 flex flex-col text-slate-800"
    >
      <!-- 顶部主标题栏 -->
      <div
        ref="questionContainer"
        class="bg-white border-b border-slate-200 py-3 px-4 md:px-6 shadow-sm"
      >
        <div class="container mx-auto">
          <!-- 使用flex容器并根据屏幕尺寸调整对齐方式 -->
          <div class="flex items-center justify-center md:justify-start space-x-3">
            <div class="text-center md:text-left">
              <h1 class="text-lg font-bold text-slate-800">{{ paper.title }}</h1>
              <p class="text-xs text-slate-500">开始时间：{{ currentTime }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 考试状态导航栏 -->
      <div
        class="bg-white border-b border-slate-200 py-1 px-4 md:px-6 sticky top-[50px] z-20 shadow-sm bg-opacity-95 backdrop-blur-sm"
      >
        <div class="container mx-auto">
          <div class="flex items-center justify-between gap-2">
            <!-- 用户信息 -->
            <div class="flex items-center px-3 py-2 bg-blue-400 rounded-lg border border-slate-200">
              <el-image v-if="avatar" :src="avatar" fit="cover" class="w-5 h-5 rounded-full" />
              <div
                v-else
                class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium"
              >
                {{ userName.substring(0, 1) }}
              </div>
              <span class="ml-2 text-sm font-medium text-slate-700 text-white">{{ userName }}</span>
            </div>

            <!-- 中间状态信息 -->
            <div
              class="hidden md:flex items-center text-sm text-slate-600 space-x-7 whitespace-nowrap"
            >
              <div class="flex items-center text-gray-900">
                总题数：<span class="font-medium text-gray-900 ml-1">{{ totalQuestions }}</span>
              </div>
              <div class="flex items-center text-gray-900">
                已答题：
                <span class="font-medium text-green-600 ml-1">{{ answeredQuestions.length }}</span>
              </div>
              <div class="flex items-center text-gray-900">
                未答题：
                <span class="font-medium text-slate-500 ml-1">
                  {{ totalQuestions - answeredQuestions.length }}
                </span>
              </div>
              <div class="flex items-center text-gray-900">
                标记题：
                <span class="font-medium text-amber-600 ml-1">{{ markedQuestions.length }}</span>
              </div>
            </div>

            <!-- 右侧用户信息和交卷按钮 -->
            <div class="flex items-center space-x-5 whitespace-nowrap">
              <!-- 计时器 -->
              <TimerInstance v-if="taskTimerId" :timer-id="taskTimerId" :index="601" />
              <!-- 交卷按钮 -->
              <el-button
                type="danger"
                class="bg-red-500 hover:bg-red-700 font-medium"
                @click="handleSubmit"
              >
                交卷
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <main class="container mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <!-- 左侧题目区域 -->
          <div class="lg:col-span-3 py-5">
            <!-- 题目导航 - 双侧边框优化版 -->
            <div
              class="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 flex items-center justify-between relative overflow-hidden"
            >
              <!-- 装饰元素 - 左右侧主色条 -->
              <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
              <div class="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>

              <!-- 题型标签 -->
              <div
                class="bg-white/90 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-medium flex items-center z-10"
              >
                <span class="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2"></span>
                {{ currentQuestion.typeName || typeName }}
              </div>
              <!-- 分值标签 -->
              <div
                class="bg-white/90 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-medium flex items-center z-10"
              >
                <Icon name="solar:star-rings-linear" class="mr-1 text-red-400" />
                <span class="text-red-400"> 分值：{{ currentQuestion.score }}分</span>
              </div>
              <!-- 题目进度 -->
              <div class="text-sm font-medium text-blue-800 flex items-center z-10">
                <span class="hidden sm:inline mr-2 text-blue-600/80">题序</span>
                <span
                  class="bg-white/90 border border-blue-100 px-3 py-1 rounded-md min-w-[90px] text-center shadow-[0_1px_2px_rgba(59,130,246,0.1)]"
                >
                  第 {{ currentQuestion.sort }} / {{ paper.questions.length }} 题
                </span>
              </div>
            </div>

            <!-- 题目内容 -->
            <div class="p-6 bg-gray-50">
              <template v-if="[6, 8].includes(currentQuestion.type)">
                <div
                  class="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6 relative overflow-hidden"
                >
                  <!-- 装饰元素 -->
                  <div class="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                  <div class="ml-4">
                    <h3 class="font-medium text-blue-800 mb-3 flex items-center">
                      {{ currentQuestion.type == 6 ? '案例描述' : '通用题干/选项' }}
                    </h3>
                    <div
                      class="text-slate-700 leading-relaxed text-sm"
                      v-html="currentQuestion.parentQuestion"
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <!-- 题目标题区域 - 优化版 -->
                <div class="mb-8 pb-6 relative">
                  <h2
                    v-if="currentQuestion.type == 4"
                    class="text-lg md:text-xl font-semibold text-slate-800 leading-relaxed m-2 flex items-center"
                  >
                    <span class="leading-relaxed">请填写以下空格</span>
                  </h2>
                  <div
                    v-else
                    class="text-lg md:text-xl font-semibold text-slate-800 leading-relaxed m-2 flex items-center"
                    v-html="currentQuestion.content"
                  />
                  <!-- 底部分隔线 -->
                  <div
                    class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-200 via-blue-100 to-transparent"
                  />
                </div>
              </template>

              <!-- 不同题型的答题区域 -->
              <div>
                <!-- 选择题 - 优化版 -->
                <div v-if="[0, 1, 2].includes(currentQuestion.type)">
                  <div class="space-y-1">
                    <div
                      v-for="(value, key) in currentQuestion.options"
                      :key="key"
                      :class="[
                        'p-4.5 rounded-lg border transition-all duration-200 cursor-pointer relative overflow-hidden',
                        isOptionSelected(key)
                          ? 'border-blue-400 bg-blue-50 shadow-sm'
                          : 'border-slate-200 hover:border-blue-200 hover:bg-blue-50/30',
                      ]"
                      @click="handleOptionSelect(key)"
                    >
                      <div class="flex items-center justify-between">
                        <!-- 左侧固定选项标识 -->
                        <span
                          class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-2 flex-shrink-0"
                          :class="
                            isOptionSelected(key)
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-100 text-slate-700'
                          "
                        >
                          {{ isOptionSelected(key) ? '✓' : key }}
                        </span>

                        <!-- 选项内容 -->
                        <span class="text-slate-700 mx-3 flex-1 leading-relaxed">{{ value }}</span>

                        <!-- 右侧选中状态标识 (仅选中时显示) -->
                        <span
                          v-if="isOptionSelected(key)"
                          class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium bg-blue-600 text-white flex-shrink-0 transition-transform duration-300"
                        >
                          ✓
                        </span>

                        <!-- 选中状态背景装饰 (仅选中时显示) -->
                        <div
                          v-if="isOptionSelected(key)"
                          class="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-5 -z-10"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 判断题 - 优化版 -->
                <div v-if="currentQuestion.type === 3">
                  <div class="space-y-1">
                    <div
                      v-for="(item, index) in judgeOptions"
                      :key="index"
                      :class="[
                        'p-4.5 rounded-lg border transition-all duration-200 cursor-pointer relative overflow-hidden',
                        isOptionSelected(item.value)
                          ? 'border-blue-400 bg-blue-50 shadow-sm'
                          : 'border-slate-200 hover:border-blue-200 hover:bg-blue-50/30',
                      ]"
                      @click="handleOptionSelect(item.value)"
                    >
                      <div class="flex items-center justify-between">
                        <!-- 选项内容 -->
                        <span class="text-slate-700 mx-3 flex-1 leading-relaxed">
                          {{ item.label }}
                        </span>
                        <!-- 右侧选中状态标识 (仅选中时显示) -->
                        <span
                          v-if="isOptionSelected(item.value)"
                          class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium bg-blue-600 text-white flex-shrink-0 transition-transform duration-300"
                        >
                          ✓
                        </span>

                        <!-- 选中状态背景装饰 (仅选中时显示) -->
                        <div
                          v-if="isOptionSelected(item.value)"
                          class="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-5 -z-10"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 填空题（支持解析（　　）并自适应宽度） -->
                <div v-if="currentQuestion.type === 4">
                  <div class="space-y-5">
                    <p class="text-slate-700 leading-relaxed">
                      <!-- 处理带多个（　　）的填空题 -->
                      <template v-if="currentQuestion.content">
                        <!-- 拆分文本和填空位置（使用正则表达式匹配（　　）） -->
                        <span
                          v-for="(part, index) in parseFillContent(currentQuestion.content)"
                          :key="index"
                        >
                          <!-- 填空题输入框进一步优化部分 -->
                          <template v-if="part === '（　　）'">
                            <span class="mx-1 inline-block relative">
                              <input
                                v-model="fillAnswers[index]"
                                placeholder="请输入"
                                class="border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                @input="adjustInputWidth(index)"
                                :style="{ width: fillInputWidths[index] }"
                              />
                            </span>
                          </template>

                          <template v-else>{{ part }}</template>
                        </span>
                      </template>
                    </p>
                  </div>
                </div>

                <!-- 案例题 - 进一步优化版 -->
                <div v-if="[5, 6, 7].includes(currentQuestion.type)">
                  <!-- 问题显示区域 (添加红色装饰) -->
                  <div
                    v-if="currentQuestion.type === 6"
                    class="bg-red-50 p-5 rounded-lg border border-red-100 mb-6 relative overflow-hidden"
                  >
                    <!-- 红色装饰元素 -->
                    <div class="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                    <div class="ml-4">
                      <h3 class="font-medium text-red-800 mb-3 flex items-center">问题</h3>
                      <div
                        class="text-slate-700 leading-relaxed"
                        v-html="currentQuestion.content"
                      />
                    </div>
                  </div>

                  <!-- 答案输入区域 (标签分两侧显示) -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <label class="block text-sm font-medium text-slate-700"> 输入答案 </label>
                      <span class="text-xs text-slate-500 italic"> 案例题由AI进行解析和判分 </span>
                    </div>
                    <textarea
                      v-model="caseAnswer[currentQuestion.id]"
                      :rows="8"
                      placeholder="请在此输入您的答案..."
                      class="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-y"
                      @input="handleCaseInput(currentQuestion.id)"
                    />
                  </div>
                </div>

                <!-- 复合题（一题多问，使用数字序号） -->
                <div v-if="currentQuestion.type === 8">
                  <div class="space-y-8">
                    <!-- 子问题列表 -->
                    <div class="space-y-8">
                      <div
                        v-for="(subQuestion, subIndex) in currentQuestion.questionList"
                        :key="subIndex"
                        class="border-l-2 border-indigo-200 pl-4 py-1"
                      >
                        <div class="flex items-start justify-between mb-3">
                          <div class="flex items-start">
                            <span class="font-bold text-slate-800" v-html="subQuestion.content" />
                          </div>
                          <div
                            :class="getSubQuestionTypeClass(subQuestion.parentSonType)"
                            class="px-2.5 py-0.5 rounded-full text-xs font-medium mt-0.5 w-[60px]"
                          >
                            {{ typeNames[subQuestion.parentSonType] }}
                          </div>
                        </div>

                        <!-- 子问题选项（根据子问题类型显示） -->
                        <div v-if="[0, 1, 2].includes(subQuestion.parentSonType)">
                          <div class="space-y-2">
                            <div
                              v-for="(value, key) in subQuestion.options"
                              :key="key"
                              :class="[
                                'p-3 rounded-lg border transition-all duration-200 cursor-pointer',
                                isOptionSelected(key, subQuestion.id)
                                  ? 'border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-200'
                                  : 'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50',
                              ]"
                              @click="handleOptionSelect(key, subIndex)"
                            >
                              <div class="flex items-center">
                                <span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-2 flex-shrink-0"
                                  :class="
                                    isOptionSelected(key, subQuestion.id)
                                      ? 'bg-indigo-500 text-white'
                                      : 'bg-slate-100 text-slate-700'
                                  "
                                >
                                  {{ isOptionSelected(key, subQuestion.id) ? '✓' : key }}
                                </span>
                                <span class="text-slate-700">{{ value }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-if="[5, 7].includes(subQuestion.parentSonType)">
                          <div>
                            <div class="flex justify-between items-center mb-2">
                              <label class="block text-sm font-medium text-slate-700"> </label>
                              <span class="text-xs text-slate-500 italic">
                                案例题由AI进行解析和判分
                              </span>
                            </div>
                            <textarea
                              v-model="caseAnswer[subQuestion.id]"
                              :rows="8"
                              placeholder="请在此输入您的答案..."
                              @input="handleCaseInput(subQuestion.id, 'composite')"
                              class="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-y"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮区域 -->
              <div class="flex justify-between mt-12 pt-6 border-t border-slate-100">
                <el-button
                  type="info"
                  plain
                  @click="prevQuestion"
                  :disabled="currentQuestionIndex === 0"
                >
                  <Icon name="ep:back" class="mr-2" />
                  上一题
                </el-button>

                <!-- 标记按钮 -->
                <button
                  @click="toggleMark"
                  :class="[
                    'px-5 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isMarked
                      ? 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  ]"
                >
                  <span class="w-4 h-4 inline-block mr-1.5">
                    {{ isMarked ? '★' : '☆' }}
                  </span>
                  {{ isMarked ? '取消标记' : '标记题目' }}
                </button>

                <el-button
                  @click="nextQuestion"
                  :disabled="currentQuestionIndex === totalQuestions - 1"
                  :class="[
                    currentQuestionIndex === totalQuestions - 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
                  ]"
                >
                  下一题
                </el-button>
              </div>
            </div>
          </div>

          <!-- 右侧答题卡 -->
          <AnswerSheet
            :questions="paper.questions"
            :current-index="currentQuestionIndex"
            :total-count="totalQuestions"
            :marked="markedQuestions"
            :answered="answeredQuestions"
            :answerCache="answerCache"
            @redirect="goToQuestion"
          />
        </div>
      </main>
    </el-card>
  </template>

  <PaperSetting ref="settingRef" @success="loadPaperData" @cancel="handleCancelSet" />
  <AIGeneratingDialog
    v-model="showAIDialog"
    title="正在生成模考报告"
    description="正在分析您的试卷..."
  />
</template>

<script setup lang="ts">
import PaperSetting from './components/PaperSetting.vue'
import AnswerSheet from './components/AnswerSheet.vue'
import AIGeneratingDialog from '@/components/AIGeneratingDialog.vue'
import type { AnswerCache, Paper, AnswerDetail } from '~/types/qBank'
import { judgeOptions, getSubQuestionTypeClass } from './func.ts'
import { questionApi, typeNames } from '~/api/qbank'
import { getCurrentDate } from '@/utils/formatTime'
import { isNumber } from '@/utils/is.ts'
import { stripHtmlTags } from '@/utils'
import { usePayWithPopup } from '@/utils/usePayRedirect.ts'

const { params } = useRoute()
const message = useMessage()

const { wsCache } = useCache()
const userStore = useUserStore()
const timerStore = useTimerStore()
const questionStore = useQBankStore()

const toolStore = useToolStore()
const {toolInfo} = storeToRefs(toolStore)

const authStore = useAuthStore()
const {isLogin} = storeToRefs(authStore)
const {openModal} = useModal()

const showAIDialog = ref(false)

const loading = ref(false)
const settingRef = ref()
const isSetting = ref(false)
const questionContainer = ref(null) // 题目容器引用
// 模拟数据
const avatar = computed(() => userStore.user?.avatar)
const userName = computed(() => userStore.user?.nickname || '新用户')
const currentTime = ref('')
const taskTimerId = ref('')
const spendTime = ref(0)
const answerTimer = ref()

const paper = ref<Paper>({
  paperId: undefined,
  title: '',
  durationMinutes: 120,
  totalScore: 100,
  questions: [],
})
// 计算属性
const totalQuestions = computed(() => paper.value.questions.length)
// 状态管理
const currentQuestionIndex = ref(0)
const answeredQuestions = ref<number[]>([]) // 已答题目的索引数组
const markedQuestions = ref<number[]>([]) // 已标记题目的索引数组
const answerCache = ref<AnswerCache>({
  timer: taskTimerId.value,
  currentIndex: currentQuestionIndex.value,
  paperId: undefined,
})
const currentQuestion = computed(() => paper.value.questions[currentQuestionIndex.value] || {})

const typeName = computed(() => {
  if (!currentQuestion.value) return ''
  return typeNames[currentQuestion.value.type] || '单选题'
})

const currentAnswer = ref<string[]>([])
const compositeAnswer = ref<{ [questionId: number]: string[] }>({})
const fillAnswers = ref<string[]>([]) // 填空题当前答案（支持多空）
const fillInputWidths = ref<string[]>([])
const caseAnswer = ref<{ [questionId: number]: string }>({})
// 选项是否被选中
const isOptionSelected = (key: string, questionId?: number) => {
  if ([0, 1, 2, 3].includes(currentQuestion.value.type)) {
    return currentAnswer.value && currentAnswer.value.includes(key)
  }
  if (questionId != undefined) {
    return compositeAnswer.value && compositeAnswer.value[questionId].includes(key)
  }
  return false
}

// 处理选项选择
const handleOptionSelect = (key: string, questionId?: number) => {
  if (!currentAnswer.value) {
    currentAnswer.value = []
  }

  let targetQuestion: any
  let targetAnswer: any[]

  if (questionId !== undefined) {
    targetQuestion = currentQuestion.value.questionList.find((item: any) => item.id === questionId)
    targetAnswer = compositeAnswer.value[questionId] || []
  } else {
    targetQuestion = currentQuestion.value
    targetAnswer = currentAnswer.value
  }

  // 判断是否为单选题/判断题
  const questionType =
    questionId !== undefined ? targetQuestion?.parentSonType : targetQuestion.type

  const isSingleChoice = [0, 3].includes(questionType ?? -1)

  // 查找当前key是否已存在
  const keyIndex = targetAnswer.indexOf(key)
  const isKeyExists = keyIndex !== -1

  // 计算新答案（逻辑简化）
  let newAnswer: string[]
  if (isKeyExists) {
    // 移除已存在的key
    newAnswer = [...targetAnswer.slice(0, keyIndex), ...targetAnswer.slice(keyIndex + 1)]
  } else {
    // 添加新key，单选题直接替换
    newAnswer = isSingleChoice ? [key] : [...targetAnswer, key]
  }

  // 更新答案（避免重复查找）
  if (questionId !== undefined) {
    compositeAnswer.value[questionId] = newAnswer.sort()
  } else {
    currentAnswer.value = newAnswer.sort()
  }
}

// 解析填空题内容，分离文本和填空位置
const parseFillContent = (content: string) => {
  content = stripHtmlTags(content)
  if (!content) return []
  // 正则表达式匹配（　　）并拆分内容
  return content.split(/（　　）/g).flatMap((part, i, arr) => {
    // 除了最后一个元素外，每个拆分后的部分后面都添加一个（　　）标记
    if (i < arr.length - 1) {
      return [part, '（　　）']
    }
    return [part]
  })
}

// 调整输入框宽度的方法 - 优化版逻辑
const adjustInputWidth = (index: number) => {
  const userInput = fillAnswers.value.filter((item) => item !== null)
  currentAnswer.value = [userInput.join('###')]

  const text: string = fillAnswers.value[index] || ''
  const charWidth = 8 // 每个字符宽度
  const baseChars = 10 // 初始基础字符数
  const minExpandChars = 6 // 开始扩展的最小字符数
  const extraChars = 4 // 额外留白字符数
  const padding = 30 // 左右内边距总和

  // 计算宽度的核心逻辑
  let totalChars: number
  if (text.length >= minExpandChars) {
    // 当输入长度≥6时，宽度 = 实际长度 + 额外留白
    totalChars = text.length + extraChars
  } else {
    // 否则保持初始固定宽度（10个字符）
    totalChars = baseChars
  }

  // 计算最终宽度（字符数×单个宽度 + 内边距）
  fillInputWidths.value[index] = totalChars * charWidth + padding + 'px'
}

// 初始化输入框宽度（固定为10个字符宽度）
const initInputWidths = () => {
  if (currentQuestion.value.type !== 4 || !currentQuestion.value.content) return
  const parts = parseFillContent(currentQuestion.value.content)
  const blankCount = parts.length
  const charWidth = 8
  const baseChars = 10
  const padding = 30
  const initialWidth = baseChars * charWidth + padding + 'px'

  // 为每个输入框设置初始宽度
  for (let i = 0; i < blankCount; i++) {
    // 如果已有内容且长度≥6，按内容计算宽度
    if (fillAnswers.value[i] && fillAnswers.value[i].length >= 6) {
      adjustInputWidth(i)
    } else {
      // 否则使用初始固定宽度
      fillInputWidths.value[i] = initialWidth
    }
  }
}

// 处理简答题输入
const handleCaseInput = (id: number, type?: string) => {
  if (type !== undefined) {
    compositeAnswer.value[id] = [caseAnswer.value[id]]
  } else {
    currentAnswer.value = [caseAnswer.value[id]]
  }
}

// 标记/取消标记题目
const toggleMark = () => {
  const currentIndex = currentQuestionIndex.value
  if (markedQuestions.value.includes(currentIndex)) {
    // 取消标记
    markedQuestions.value = markedQuestions.value.filter((index) => index !== currentIndex)
  } else {
    // 添加标记
    markedQuestions.value.push(currentIndex)
  }
}
const isMarked = computed(() => markedQuestions.value.includes(currentQuestionIndex.value))

const saveAnswerCache = () => {
  stopTimer()
  let userAnswer: Record<number, string> = {}
  const { type, questionList, contentId, id, score, typeName } = currentQuestion.value

  let isSubmitted = false

  if (type === 8) {
    let submitCount = 0
    questionList.forEach((sub) => {
      const subAnswer = compositeAnswer.value[sub.id]
      userAnswer[sub.id] = subAnswer ? subAnswer.join(',') : ''
      if (subAnswer.length > 0 && subAnswer[0] !== '') {
        submitCount++
      }
    })
    isSubmitted = submitCount === questionList.length
  } else {
    isSubmitted = currentAnswer.value.length > 0
    userAnswer[id] = isSubmitted ? currentAnswer.value.join(',') : ''
  }

  if (isSubmitted) {
    answeredQuestions.value.push(id)
  }
  // 先更新本地缓存（优化用户体验，避免等待后端响应）
  answerCache.value[id] = {
    score,
    typeName,
    contentId,
    userAnswer,
    isSubmitted,
    spendTime: spendTime.value,
  }
  currentAnswer.value = []
  compositeAnswer.value = {}
  wsCache.set(`unfinishedPaper`, answerCache.value)
}

// 上一题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    saveAnswerCache()
    currentQuestionIndex.value--
  }
}

// 下一题
const nextQuestion = async () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    saveAnswerCache()
    currentQuestionIndex.value++
  } else {
    try {
      await message.confirm('已经是最后一题了，是否提交试卷？', '提示')
      await handleSubmit()
    } catch (err) {
      console.log(err)
    }
  }
}

// 跳转到指定题目
const goToQuestion = (index: number) => {
  saveAnswerCache()
  currentQuestionIndex.value = index
}

const handleSubmit = async () => {
  saveAnswerCache()
  timerStore.stopTimer(taskTimerId.value)
  try {
    if (answeredQuestions.value.length !== totalQuestions.value) {
      await message.confirm('还有题目未完成，是否提交试卷？')
    }
  } catch (e) {
    timerStore.startTimer(taskTimerId.value)
    return
  }
  const answers: any[] = []
  Object.keys(answerCache.value).forEach((key) => {
    if (!isNumber(key)) return
    const cache = answerCache.value[key]

    for (const [id, answer] of Object.entries(cache.userAnswer)) {
      const questionId = Number(id)
      if (isNaN(questionId)) continue

      if (answer && answer != '') {
        answers.push({
          questionId,
          answer,
          typeName: cache.typeName,
          spendTime: cache?.spendTime ?? 0,
          score: cache?.score ?? 0,
        })
      }
    }
  })

  const data = {
    answers,
    paperId: paper.value.paperId,
    submitTime: new Date().getTime(),
    startTime: answerCache.value.startTime,
  }
  showAIDialog.value = true // 弹窗展示
  try {
    const res = await questionApi.submitPaper(data)
    if (res.status === 'SUCCESS') {
      wsCache.delete(`unfinishedPaper`)
      message.success('提交成功')
      await navigateTo({
        name: 'PaperReport',
        params: { toolId: params.toolId },
        query: { p: res.paperId, up: res.userPaperId },
      })
    } else {
      message.error('检测到您尚未答题，请先答题后再提交')
    }
  } catch (e) {
    message.error('提交失败')
  } finally {
    showAIDialog.value = false
  }
  timerStore.deleteTimer(taskTimerId.value)
}

// 初始化答案缓存（如果之前答过这批题，恢复数据）
const initAnswerCache = () => {
  const cache = wsCache.get(`unfinishedPaper`)
  const hasCache = !!cache
  currentQuestionIndex.value = hasCache && cache.currentIndex ? cache.currentIndex + 1 : 0

  paper.value.questions.forEach((question) => {
    if (hasCache && cache[question.id]) {
      answerCache.value[question.id] = cache[question.id]
      if (cache[question.id].isSubmitted) {
        answeredQuestions.value.push(question.id)
      }
    } else {
      answerCache.value[question.id] = {
        userAnswer: {},
        spendTime: 0,
        isSubmitted: false,
      }
    }
  })
  console.log('answerCache', answerCache.value)
  // 恢复当前题目的缓存数据
  restoreCurrentQuestionCache()

  spendTime.value = hasCache && cache.spendTime ? cache.spendTime : 0
  answerCache.value.startTime = hasCache && cache.startTime ? cache.startTime : new Date().getTime()
}

const initTimer = () => {
  const cache = wsCache.get(`unfinishedPaper`)
  if (!cache?.timer) {
    createTimer()
    return
  }
  try {
    taskTimerId.value = cache.timer
    const existingTimer = timerStore.getTimer(cache.timer)
    if (existingTimer) {
      timerStore.startTimer(cache.timer)
    } else {
      createTimer()
    }
  } catch (e) {
    createTimer()
  }
}

const createTimer = () => {
  const setting = questionStore.mockSetting
  taskTimerId.value = timerStore.createTimer({
    name: '默认任务计时器',
    durationMinutes: setting.durationMinutes,
    timeMode: setting.timeMode,
  })
  answerCache.value.timer = taskTimerId.value
}

// 切换题目时恢复缓存
const restoreCurrentQuestionCache = () => {
  const question = currentQuestion.value
  if (!question) return

  compositeAnswer.value = {}
  currentAnswer.value = []

  const cache = answerCache.value[question.id] as AnswerDetail
  // 恢复答案
  let userAnswer = cache.userAnswer[question.id]

  if (question.type === 8) {
    question.questionList.forEach((sub) => {
      userAnswer = answerCache.value[question.id]?.userAnswer[sub.id] || ''
      compositeAnswer.value[sub.id] = [userAnswer]
      if ([5, 6, 7].includes(sub.parentSonType)) {
        caseAnswer.value[sub.id] = userAnswer
      }
    })
  } else {
    currentAnswer.value = userAnswer ? userAnswer.split(',') : []
    if ([5, 6, 7].includes(question.type)) {
      caseAnswer.value[question.id] = userAnswer
    }
    if (question.type === 4) {
      fillAnswers.value = currentAnswer.value
    }
  }

  answerCache.value.currentIndex = currentQuestionIndex.value
  spendTime.value = cache?.spendTime ?? 0
  startTimer()
}

// 计时器控制
const startTimer = () => {
  answerTimer.value = setInterval(() => {
    spendTime.value++
  }, 1000)
}

const stopTimer = () => {
  clearInterval(answerTimer.value)
}

const { redirectToPay } = usePayWithPopup()
const loadPaperData = async (paperId?: number) => {
  if(!isLogin.value){
    openModal('login')
    return
  }

  isSetting.value = true
  loading.value = true
  try {
    const setting = questionStore.mockSetting
    const data = {
      ...setting,
      paperId,
      toolId: toolInfo.value.id,
    }
    paper.value = await questionApi.generatePaper(data)
    currentTime.value = getCurrentDate('YYYY-MM-DD HH:mm')
    answerCache.value.paperId = paper.value.paperId
    initTimer()
    initAnswerCache()
    loading.value = false
  } catch (e: string | any) {
    console.log('错误==',e)
    if(e?.includes('购买')){
      setTimeout(()=> {
        redirectToPay(toolInfo.value, `/t/${toolInfo.value.series}`)
      }, 500)
    }
  }
}
const handleCancelSet = async () => {
  try {
    await message.confirmWith('检测到您未设置模拟考试参数，继续确定将使用默认设置。', '提示', {
      confirmButtonText: '开始考试',
      cancelButtonText: '继续设置',
      type: 'warning',
    })
    await loadPaperData()
  } catch (e) {
    settingRef.value.open()
  }
}

// 监听当前题目变化，恢复保存的答案
watch(currentQuestionIndex, () => {
  stopTimer()
  restoreCurrentQuestionCache()
  scrollToContainer()
  initInputWidths()
})

useHead({
  title: `模拟考试-${toolInfo.value.title}`,
})


// 初始化时设置宽度
onMounted(() => {

  const cache = wsCache.get(`unfinishedPaper`)
  if (cache) {
    message.confirm('检测到您有未完成的试卷，是否继续？', '提示').then(
      () => {
        loadPaperData(cache.paperId)
        scrollToContainer()
        initInputWidths()
      },
      () => {
        wsCache.delete(`unfinishedPaper`)
        settingRef.value.open()
      },
    )
  } else {
    settingRef.value.open()
  }
})

onUnmounted(() => {
  stopTimer()
})

// 定位到指定容器
const scrollToContainer = () => {
  // 确保DOM更新后执行滚动
  nextTick(() => {
    if (questionContainer.value) {
      // 滚动到容器顶部
      questionContainer.value.scrollIntoView({
        behavior: 'smooth', // 平滑滚动，可选
        block: 'start', // 对齐容器顶部
      })
    }
  })
}
</script>

<style scoped></style>
