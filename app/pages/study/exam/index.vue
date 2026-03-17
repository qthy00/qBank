<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面标题 -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">模拟考试</h1>
            <p class="mt-1 text-sm text-gray-500">全真模拟考试环境，检验学习成果</p>
          </div>
          <el-button type="primary" @click="goBack">
            <Icon name="ep:arrow-left" class="mr-1" />
            返回题库
          </el-button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <!-- 选择题库 -->
      <div v-if="!qbankId" class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">选择题库</h2>
        <div v-if="loading" class="flex justify-center py-10">
          <el-loading />
        </div>
        <div v-else-if="qbankList.length === 0" class="text-center py-10 text-gray-500">
          <Icon name="ep:folder-opened" class="text-4xl mb-2" />
          <p>暂无可用题库</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="qbank in qbankList"
            :key="qbank.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            @click="selectQbank(qbank)"
          >
            <div class="flex items-start gap-3">
              <el-image
                :src="qbank.coverImage || '/images/default-qbank.png'"
                class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 truncate">{{ qbank.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ qbank.questionCount }}题</p>
                <div class="flex items-center gap-2 mt-2">
                  <el-tag v-if="qbank.price === 0" type="success" size="small">免费</el-tag>
                  <el-tag v-else type="warning" size="small">¥{{ (qbank.price / 100).toFixed(2) }}</el-tag>
                  <el-tag type="info" size="small">{{ qbank.difficultyName }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 考试配置 -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧配置 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">考试设置</h2>

            <!-- 选择科目 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">考试科目</label>
              <el-select
                v-model="examSetting.subjectId"
                placeholder="选择科目"
                class="w-full"
                @change="handleSubjectChange"
              >
                <el-option
                  v-for="subject in subjects"
                  :key="subject.id"
                  :label="subject.name"
                  :value="subject.id"
                />
              </el-select>
            </div>

            <!-- 考试时长 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                考试时长: {{ examSetting.durationMinutes }}分钟
              </label>
              <el-slider
                v-model="examSetting.durationMinutes"
                :min="30"
                :max="180"
                :step="10"
                show-stops
              />
            </div>

            <!-- 计时模式 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">计时模式</label>
              <el-radio-group v-model="examSetting.timeMode" class="w-full">
                <el-radio-button label="countdown" value="countdown">倒计时</el-radio-button>
                <el-radio-button label="countup" value="countup">正计时</el-radio-button>
              </el-radio-group>
            </div>

            <!-- 难度设置 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                难度: {{ difficultyLabels[examSetting.difficulty - 1] }}
              </label>
              <el-slider
                v-model="examSetting.difficulty"
                :min="1"
                :max="5"
                :step="1"
                show-stops
              />
            </div>

            <!-- 随机抽题 -->
            <div class="mb-4">
              <el-checkbox v-model="examSetting.randomQuestions">随机抽题</el-checkbox>
            </div>

            <!-- 题目配置 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">题目配置</label>
              <div class="space-y-2">
                <div
                  v-for="(item, index) in examSetting.questionInfo"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span class="text-sm">{{ item.displayName }}</span>
                  <div class="flex items-center gap-2">
                    <el-input-number
                      v-model="item.count"
                      :min="0"
                      :max="100"
                      size="small"
                      class="w-20"
                    />
                    <span class="text-xs text-gray-500">题</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 统计信息 -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">总题数</span>
                <span class="font-medium">{{ totalQuestions }}题</span>
              </div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">总分</span>
                <span class="font-medium">{{ totalScore }}分</span>
              </div>
            </div>

            <!-- 开始考试按钮 -->
            <el-button
              type="primary"
              size="large"
              class="w-full mt-4"
              :disabled="totalQuestions === 0"
              @click="startExam"
            >
              <Icon name="ep:video-play" class="mr-1" />
              开始考试
            </el-button>
          </div>
        </div>

        <!-- 右侧说明 -->
        <div class="lg:col-span-2">
          <!-- 考试须知 -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <Icon name="ep:warning-filled" class="text-amber-500 mr-2" />
              考试须知
            </h3>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-start gap-2">
                <Icon name="ep:check" class="text-green-500 mt-1" />
                <span>请在规定时间内完成所有题目</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="ep:check" class="text-green-500 mt-1" />
                <span>考试过程中可以标记不确定的题目</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="ep:check" class="text-green-500 mt-1" />
                <span>提交后将立即显示成绩和解析</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="ep:check" class="text-green-500 mt-1" />
                <span>考试记录将保存到个人中心</span>
              </li>
            </ul>
          </div>

          <!-- 历史记录 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">最近考试记录</h3>
            <div v-if="examHistory.length === 0" class="text-center py-8 text-gray-500">
              <Icon name="ep:document" class="text-4xl mb-2" />
              <p>暂无考试记录</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="record in examHistory"
                :key="record.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                @click="viewReport(record.paperId)"
              >
                <div>
                  <h4 class="font-medium text-gray-900">{{ record.paperTitle }}</h4>
                  <p class="text-sm text-gray-500">{{ record.submitTime }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <div class="text-lg font-bold" :class="getScoreClass(record.score / record.totalScore)">
                      {{ record.score }}分
                    </div>
                    <div class="text-xs text-gray-500">{{ record.accuracy }}%正确率</div>
                  </div>
                  <Icon name="ep:arrow-right" class="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExamSetting, ExamHistoryVO, SubjectVO } from '~/types/exam'
import { generateMockPaper, getExamHistoryList, getSubjectList, getSubjectPaperInfo } from '~/api/exam'
import { getMockQbankList } from '~/api/qbank/mock'
import type { QbankInfoVO } from '~/types/qBank'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const qbankId = computed(() => Number(route.query.qbankId) || 0)

/* ==================== 状态定义 ==================== */
const loading = ref(false)
const qbankList = ref<QbankInfoVO[]>([])
const subjects = ref<SubjectVO[]>([])
const examHistory = ref<ExamHistoryVO[]>([])

const difficultyLabels = ['简单', '较易', '中等', '较难', '困难']

/* 默认考试设置 */
const defaultSetting: ExamSetting = {
  subjectId: 0,
  durationMinutes: 120,
  timeMode: 'countdown',
  questionInfo: [
    { displayName: '单选题', type: 0, count: 40, score: 1, totalScore: 40 },
    { displayName: '多选题', type: 1, count: 20, score: 2, totalScore: 40 },
    { displayName: '判断题', type: 3, count: 20, score: 1, totalScore: 20 },
  ],
  randomQuestions: true,
  difficulty: 3,
  passScore: 60,
}

const examSetting = ref<ExamSetting>({ ...defaultSetting })

/* ==================== 计算属性 ==================== */
const totalQuestions = computed(() => {
  return examSetting.value.questionInfo.reduce((sum, item) => sum + item.count, 0)
})

const totalScore = computed(() => {
  return examSetting.value.questionInfo.reduce((sum, item) => sum + (item.count * item.score), 0)
})

/* ==================== 方法定义 ==================== */
const goBack = () => {
  if (qbankId.value) {
    navigateTo(`/qbank/${qbankId.value}`)
  } else {
    navigateTo('/qbank')
  }
}

const selectQbank = (qbank: QbankInfoVO) => {
  router.push({
    path: '/exam',
    query: { qbankId: qbank.id }
  })
}

const loadQbankList = async () => {
  try {
    loading.value = true
    /* 使用模拟数据 */
    const { list } = getMockQbankList()
    qbankList.value = list
  } finally {
    loading.value = false
  }
}

const loadSubjects = async () => {
  if (!qbankId.value) return
  try {
    subjects.value = await getSubjectList(qbankId.value)
    if (subjects.value.length > 0) {
      examSetting.value.subjectId = subjects.value[0].id
      await loadSubjectInfo()
    }
  } catch (err) {
    console.log('加载科目失败', err)
  }
}

const loadSubjectInfo = async () => {
  if (!examSetting.value.subjectId) return
  try {
    const data = await getSubjectPaperInfo(examSetting.value.subjectId)
    if (data.questionInfo) {
      examSetting.value.questionInfo = data.questionInfo
    }
    if (data.condition.pass) {
      examSetting.value.passScore = data.condition.pass
    }
    if (data.condition.time) {
      examSetting.value.durationMinutes = data.condition.time
    }
  } catch (err) {
    console.log('加载科目信息失败', err)
  }
}

const handleSubjectChange = async () => {
  await loadSubjectInfo()
}

const loadExamHistory = async () => {
  try {
    const { list } = await getExamHistoryList({
      page: 1,
      pageSize: 5,
    })
    examHistory.value = list
  } catch (err) {
    console.log('加载考试历史失败', err)
  }
}

const getScoreClass = (ratio: number) => {
  if (ratio >= 0.8) return 'text-green-600'
  if (ratio >= 0.6) return 'text-blue-600'
  return 'text-red-600'
}

const startExam = async () => {
  if (totalQuestions.value === 0) {
    message.warning('请至少配置一道题目')
    return
  }

  try {
    const data = await generateMockPaper({
      qbankId: qbankId.value,
      subjectId: examSetting.value.subjectId,
      durationMinutes: examSetting.value.durationMinutes,
      questionInfo: examSetting.value.questionInfo,
      randomQuestions: examSetting.value.randomQuestions,
      difficulty: examSetting.value.difficulty,
      passScore: examSetting.value.passScore,
    })

    /* 保存考试设置到 store */
    const examStore = useQBankStore()
    examStore.mockSetting = {
      durationMinutes: examSetting.value.durationMinutes,
      timeMode: examSetting.value.timeMode,
      questionInfo: examSetting.value.questionInfo,
      randomQuestions: examSetting.value.randomQuestions,
      difficulty: examSetting.value.difficulty,
      passScore: examSetting.value.passScore,
    }

    /* 跳转到考试页面 */
    navigateTo(`/exam/${data.paperId}`)
  } catch (err) {
    message.error('生成试卷失败')
    console.log(err)
  }
}

const viewReport = (paperId: number) => {
  navigateTo(`/exam/report/${paperId}`)
}

/* ==================== 初始化 ==================== */
onMounted(async () => {
  if (qbankId.value) {
    await loadSubjects()
  } else {
    await loadQbankList()
  }
  await loadExamHistory()
})
</script>
