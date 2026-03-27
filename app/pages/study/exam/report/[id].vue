<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 页面头部 -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <el-button type="info" plain circle @click="goBack">
              <Icon name="ep:arrow-left" />
            </el-button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">考试报告</h1>
              <p class="text-sm text-gray-500 mt-1">{{ report?.paperTitle }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <el-button type="primary" plain @click="retryExam">
              <Icon name="ep:refresh-right" class="mr-1" />
              再次练习
            </el-button>
            <el-button type="success" @click="goToAnalysis">
              <Icon name="ep:data-analysis" class="mr-1" />
              错题分析
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-96">
      <el-loading />
    </div>

    <template v-else-if="report">
      <!-- 成绩概览 -->
      <div class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- 总分 -->
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-sm text-gray-500 mb-2">最终得分</div>
            <div
              class="text-4xl font-bold"
              :class="scoreClass"
            >
              {{ report.score }}
            </div>
            <div class="text-sm text-gray-400 mt-1">满分 {{ report.totalScore }} 分</div>
            <el-tag
              :type="isPass ? 'success' : 'danger'"
              class="mt-2"
            >
              {{ isPass ? '及格' : '未及格' }}
            </el-tag>
          </div>

          <!-- 正确率 -->
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-sm text-gray-500 mb-2">正确率</div>
            <div class="text-4xl font-bold text-blue-600">
              {{ report.accuracy }}%
            </div>
            <div class="text-sm text-gray-400 mt-1">
              {{ report.totalAmount - report.incorrectAmount }} / {{ report.totalAmount }} 题
            </div>
          </div>

          <!-- 用时 -->
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-sm text-gray-500 mb-2">用时</div>
            <div class="text-4xl font-bold text-purple-600">
              {{ formatTime(report.spendTime) }}
            </div>
            <div class="text-sm text-gray-400 mt-1">
              平均 {{ formatAvgTime(report.spendTime, report.totalAmount) }} / 题
            </div>
          </div>

          <!-- 排名 -->
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-sm text-gray-500 mb-2">排名</div>
            <div class="text-4xl font-bold text-amber-600">
              {{ report.rank || '--' }}
            </div>
            <div class="text-sm text-gray-400 mt-1">超过 {{ report.relativeScore }}% 的考生</div>
          </div>
        </div>

        <!-- 详细分析 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧：能力分布 -->
          <div class="lg:col-span-2 space-y-6">
            <!-- 各题型得分分布 -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="ep:pie-chart" class="text-blue-500" />
                各题型得分分布
              </h3>
              <div class="space-y-3">
                <div
                  v-for="item in report.distribution"
                  :key="item.type"
                  class="flex items-center gap-4"
                >
                  <div class="w-20 text-sm text-gray-600">{{ item.displayName }}</div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all"
                          :class="getDistributionColor(item.accuracy)"
                          :style="{ width: `${item.accuracy}%` }"
                        />
                      </div>
                      <span class="text-sm font-medium w-16 text-right">
                        {{ item.obtainScore }}/{{ item.totalScore }}分
                      </span>
                    </div>
                  </div>
                  <div class="w-16 text-sm text-gray-500 text-right">
                    {{ item.accuracy }}%
                  </div>
                </div>
              </div>
            </div>

            <!-- 章节错误分析 -->
            <div v-if="report.chapterErrorList?.length" class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="ep:warning" class="text-red-500" />
                薄弱环节分析
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="chapter in report.chapterErrorList"
                  :key="chapter.chapterId"
                  class="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <Icon name="ep:document" class="text-red-400" />
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800 truncate">
                      {{ chapter.chapterName }}
                    </div>
                    <div class="text-xs text-red-600 mt-1">
                      {{ chapter.errorCount }} 道错题
                    </div>
                  </div>
                  <el-button type="danger" plain size="small" @click="retryChapter(chapter.chapterId)">
                    强化
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 答题详情 -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="ep:list" class="text-green-500" />
                答题详情
              </h3>
              <div class="space-y-2">
                <div
                  v-for="(item, index) in report.questionAnswers"
                  :key="item.id"
                  class="flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm"
                  :class="item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
                  @click="showQuestionDetail(item)"
                >
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                    :class="item.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm text-gray-800 line-clamp-1" v-html="item.content" />
                    <div class="text-xs text-gray-500 mt-1">
                      {{ item.typeName }} · {{ item.score }}分
                    </div>
                  </div>
                  <div class="text-right">
                    <div
                      class="text-sm font-medium"
                      :class="item.isCorrect ? 'text-green-600' : 'text-red-600'"
                    >
                      {{ item.isCorrect ? '+' : '' }}{{ item.userScore }}分
                    </div>
                    <Icon
                      :name="item.isCorrect ? 'ep:check' : 'ep:close'"
                      :class="item.isCorrect ? 'text-green-500' : 'text-red-500'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：统计和建议 -->
          <div class="space-y-6">
            <!-- 完成度 -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">完成度</h3>
              <div class="relative w-40 h-40 mx-auto">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-gray-900">
                      {{ report.completionRate }}%
                    </div>
                    <div class="text-xs text-gray-500">完成率</div>
                  </div>
                </div>
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    stroke-width="8"
                    stroke-linecap="round"
                    :stroke-dasharray="`${report.completionRate * 2.83} 283`"
                  />
                </svg>
              </div>
              <div class="mt-4 text-center text-sm text-gray-600">
                已完成 {{ report.totalAmount }} / {{ report.totalAmount }} 题
              </div>
            </div>

            <!-- 学习建议 -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="ep:idea" class="text-amber-500" />
                学习建议
              </h3>
              <ul class="space-y-3 text-sm text-gray-600">
                <li class="flex items-start gap-2">
                  <Icon name="ep:check" class="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>加强对薄弱章节的练习，特别是错题率较高的部分</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ep:check" class="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>建议每天保持至少30分钟的学习时间</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ep:check" class="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>定期进行模拟考试，检验学习效果</span>
                </li>
              </ul>
            </div>

            <!-- 考试信息 -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">考试信息</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">开始时间</span>
                  <span class="text-gray-900">{{ formatDateTime(report.startTime) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">提交时间</span>
                  <span class="text-gray-900">{{ formatDateTime(report.submitTime) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">考试时长</span>
                  <span class="text-gray-900">{{ formatTime(report.spendTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 题目详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="题目解析"
      width="800px"
      destroy-on-close
    >
      <div v-if="selectedQuestion" class="space-y-4">
        <!-- 题目内容 -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500 mb-2">{{ selectedQuestion.typeName }}</div>
          <div class="text-base text-gray-900" v-html="selectedQuestion.content" />
        </div>

        <!-- 选项 -->
        <div v-if="selectedQuestion.options" class="space-y-2">
          <div
            v-for="(value, key) in selectedQuestion.options"
            :key="key"
            class="p-3 rounded-lg border"
            :class="{
              'bg-green-50 border-green-300': selectedQuestion.answer?.includes(key),
              'bg-red-50 border-red-300': selectedQuestion.userAnswer?.includes(key) && !selectedQuestion.answer?.includes(key),
              'border-gray-200': !selectedQuestion.answer?.includes(key) && !selectedQuestion.userAnswer?.includes(key)
            }"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                :class="{
                  'bg-green-500 text-white': selectedQuestion.answer?.includes(key),
                  'bg-red-500 text-white': selectedQuestion.userAnswer?.includes(key) && !selectedQuestion.answer?.includes(key),
                  'bg-gray-100 text-gray-600': !selectedQuestion.answer?.includes(key) && !selectedQuestion.userAnswer?.includes(key)
                }"
              >
                {{ key }}
              </span>
              <span class="flex-1">{{ value }}</span>
              <Icon
                v-if="selectedQuestion.answer?.includes(key)"
                name="ep:check"
                class="text-green-500"
              />
              <Icon
                v-else-if="selectedQuestion.userAnswer?.includes(key)"
                name="ep:close"
                class="text-red-500"
              />
            </div>
          </div>
        </div>

        <!-- 答案解析 -->
        <div class="border-t border-gray-200 pt-4">
          <div class="flex items-center gap-4 mb-3">
            <span class="text-sm text-gray-600">正确答案：</span>
            <span class="font-medium text-green-600">{{ selectedQuestion.answer }}</span>
          </div>
          <div class="flex items-center gap-4 mb-3">
            <span class="text-sm text-gray-600">你的答案：</span>
            <span
              class="font-medium"
              :class="selectedQuestion.isCorrect ? 'text-green-600' : 'text-red-600'"
            >
              {{ selectedQuestion.userAnswer || '未作答' }}
            </span>
          </div>
          <div v-if="selectedQuestion.analysis" class="bg-blue-50 p-4 rounded-lg">
            <div class="text-sm font-medium text-blue-800 mb-2">答案解析</div>
            <div class="text-sm text-blue-700" v-html="selectedQuestion.analysis" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { ExamReportVO, QuestionAnswerVO } from '~/types/exam'
import { getExamReport } from '~/api/exam'

const route = useRoute()
const _router = useRouter()

const paperId = computed(() => Number(route.params.id))
const userPaperId = computed(() => Number(route.query.userPaperId) || 0)

/* ==================== 状态定义 ==================== */
const loading = ref(false)
const report = ref<ExamReportVO | null>(null)
const detailVisible = ref(false)
const selectedQuestion = ref<QuestionAnswerVO | null>(null)

/* ==================== 计算属性 ==================== */
const scoreRatio = computed(() => {
  if (!report.value) return 0
  return report.value.score / report.value.totalScore
})

const scoreClass = computed(() => {
  const ratio = scoreRatio.value
  if (ratio >= 0.8) return 'text-green-600'
  if (ratio >= 0.6) return 'text-blue-600'
  return 'text-red-600'
})

const isPass = computed(() => {
  if (!report.value) return false
  /* 假设及格线为60% */
  return scoreRatio.value >= 0.6
})

/* ==================== 方法定义 ==================== */
const loadReport = async () => {
  if (!paperId.value) return

  loading.value = true
  try {
    report.value = await getExamReport(paperId.value, userPaperId.value)
  } catch (err) {
    console.log('加载报告失败', err)
  } finally {
    loading.value = false
  }
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}小时${minutes}分${secs}秒`
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`
  }
  return `${secs}秒`
}

const formatAvgTime = (totalSeconds: number, totalQuestions: number) => {
  if (!totalQuestions) return '0秒'
  const avg = Math.floor(totalSeconds / totalQuestions)
  return `${avg}秒`
}

const formatDateTime = (timestamp: number) => {
  if (!timestamp) return '--'
  return new Date(timestamp).toLocaleString('zh-CN')
}

const getDistributionColor = (accuracy: number) => {
  if (accuracy >= 80) return 'bg-green-500'
  if (accuracy >= 60) return 'bg-blue-500'
  if (accuracy >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const showQuestionDetail = (question: QuestionAnswerVO) => {
  selectedQuestion.value = question
  detailVisible.value = true
}

const goBack = () => {
  navigateTo('/exam')
}

const retryExam = () => {
  if (report.value?.qbankId) {
    navigateTo(`/exam?qbankId=${report.value.qbankId}`)
  } else {
    navigateTo('/exam')
  }
}

const goToAnalysis = () => {
  /* 跳转到错题分析页面 */
  navigateTo('/mistakes')
}

const retryChapter = (chapterId: number) => {
  navigateTo(`/practice/chapter?chapterId=${chapterId}`)
}

/* ==================== 初始化 ==================== */
onMounted(() => {
  loadReport()
})

useHead({
  title: computed(() => report.value?.paperTitle ? `${report.value.paperTitle} - 考试报告` : '考试报告'),
})
</script>
