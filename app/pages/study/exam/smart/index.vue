<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面标题 -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">智能组卷</h1>
            <p class="mt-1 text-sm text-gray-500">基于薄弱知识点，自动生成针对性练习</p>
          </div>
          <div class="flex gap-3">
            <el-button @click="goBack">
              <Icon name="ep:arrow-left" class="mr-1" />
              返回
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧配置 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              <Icon name="ep:cpu" class="mr-2 text-primary" />
              智能配置
            </h2>

            <!-- 组卷模式 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">组卷模式</label>
              <el-radio-group v-model="paperConfig.mode" class="w-full">
                <el-radio-button label="auto" value="auto">
                  <Icon name="ep:magic-stick" class="mr-1" />
                  自动推荐
                </el-radio-button>
                <el-radio-button label="manual" value="manual">
                  <Icon name="ep:edit" class="mr-1" />
                  手动选择
                </el-radio-button>
              </el-radio-group>
            </div>

            <!-- 科目选择 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">选择科目</label>
              <el-select
                v-model="selectedSubjectId"
                placeholder="全部科目"
                class="w-full"
                clearable
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

            <!-- 题目数量 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                题目数量: {{ paperConfig.questionCount }}题
              </label>
              <el-slider
                v-model="paperConfig.questionCount"
                :min="10"
                :max="100"
                :step="5"
                show-stops
              />
            </div>

            <!-- 难度设置 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                难度: {{ difficultyLabels[paperConfig.difficulty - 1] }}
              </label>
              <el-slider
                v-model="paperConfig.difficulty"
                :min="1"
                :max="5"
                :step="1"
                show-stops
              />
            </div>

            <!-- 考试时长 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                考试时长: {{ paperConfig.durationMinutes }}分钟
              </label>
              <el-slider
                v-model="paperConfig.durationMinutes"
                :min="15"
                :max="180"
                :step="5"
                show-stops
              />
            </div>

            <!-- 优先策略（仅在自动模式下显示） -->
            <div v-if="paperConfig.mode === 'auto'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">优先策略</label>
              <el-select v-model="paperConfig.strategy" class="w-full">
                <el-option label="薄弱优先" value="weak" />
                <el-option label="随机抽题" value="random" />
                <el-option label="混合模式" value="mixed" />
              </el-select>
            </div>

            <!-- 统计信息 -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">选中知识点</span>
                <span class="font-medium">{{ selectedPoints.length }}个</span>
              </div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">预估总分</span>
                <span class="font-medium">{{ estimatedTotalScore }}分</span>
              </div>
            </div>

            <!-- 生成试卷按钮 -->
            <el-button
              type="primary"
              size="large"
              class="w-full mt-4"
              :disabled="selectedPoints.length === 0 && paperConfig.mode === 'manual'"
              :loading="generating"
              @click="generatePaper"
            >
              <Icon name="ep:magic-stick" class="mr-1" />
              {{ generating ? '生成中...' : '生成智能试卷' }}
            </el-button>
          </div>
        </div>

        <!-- 右侧薄弱知识点 -->
        <div class="lg:col-span-2">
          <!-- 自动模式：展示推荐信息 -->
          <div v-if="paperConfig.mode === 'auto'" class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                <Icon name="ep:data-analysis" class="mr-2 text-blue-500" />
                智能分析
              </h3>
              <el-tag type="primary" effect="light">
                基于 {{ weakPoints.length }} 个薄弱知识点
              </el-tag>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ recommendCount }}</div>
                <div class="text-sm text-gray-600 mt-1">推荐题目数</div>
              </div>
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ recommendDuration }}分钟</div>
                <div class="text-sm text-gray-600 mt-1">建议考试时长</div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-orange-600">{{ difficultyLabels[suggestDifficulty - 1] }}</div>
                <div class="text-sm text-gray-600 mt-1">建议难度</div>
              </div>
            </div>
          </div>

          <!-- 薄弱知识点列表 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                <Icon name="ep:warning" class="mr-2 text-red-500" />
                薄弱知识点
              </h3>
              <div class="flex gap-2">
                <el-checkbox
                  v-if="paperConfig.mode === 'manual'"
                  v-model="selectAll"
                  @change="handleSelectAll"
                >
                  全选
                </el-checkbox>
                <el-tag type="danger" effect="light">{{ weakPoints.length }}个</el-tag>
              </div>
            </div>

            <div v-if="loading" class="flex justify-center py-10">
              <el-loading />
            </div>

            <div v-else-if="weakPoints.length === 0" class="text-center py-10 text-gray-500">
              <Icon name="ep:check" class="text-4xl mb-2 text-green-500" />
              <p>太棒了！您暂无薄弱知识点</p>
              <p class="text-sm mt-2">继续保持良好的学习状态</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="point in weakPoints"
                :key="point.id"
                class="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
                :class="{ 'bg-blue-50 border-blue-300': isSelected(point.id) }"
              >
                <!-- 选择框（仅在手动模式下显示） -->
                <el-checkbox
                  v-if="paperConfig.mode === 'manual'"
                  :model-value="isSelected(point.id)"
                  @change="(val: boolean) => toggleSelection(point.id, val)"
                />

                <!-- 优先级标识 -->
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                  :class="getPriorityClass(point.priority)"
                >
                  {{ point.priority }}
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ point.name }}</h4>
                      <el-tag size="small" type="info" class="mt-1">{{ point.subjectName }}</el-tag>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <div class="text-lg font-bold" :class="getAccuracyColor(point.accuracy)">
                        {{ point.accuracy }}%
                      </div>
                      <div class="text-xs text-gray-500">正确率</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span>总题 {{ point.totalQuestions }}</span>
                    <span>已做 {{ point.completedQuestions }}</span>
                    <span class="text-red-500">错题 {{ point.wrongQuestions }}</span>
                  </div>

                  <!-- 进度条 -->
                  <div class="mt-2">
                    <el-progress
                      :percentage="point.accuracy"
                      :color="getProgressColor(point.accuracy)"
                      :show-text="false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 历史记录 -->
          <div class="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <Icon name="ep:clock" class="mr-2 text-gray-500" />
              智能组卷历史
            </h3>

            <div v-if="historyLoading" class="flex justify-center py-8">
              <el-loading />
            </div>

            <div v-else-if="historyList.length === 0" class="text-center py-8 text-gray-500">
              <Icon name="ep:document" class="text-3xl mb-2" />
              <p>暂无智能组卷记录</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="record in historyList"
                :key="record.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                @click="viewReport(record.paperId)"
              >
                <div>
                  <h4 class="font-medium text-gray-900">{{ record.title }}</h4>
                  <p class="text-sm text-gray-500">
                    {{ record.qbankName }} · {{ record.questionCount }}题 · {{ record.knowledgePointCount }}个知识点
                  </p>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <div class="text-lg font-bold" :class="getScoreClass(record.accuracy)">
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
import type { SmartPaperReqVO, WeakKnowledgePoint } from '~/types/exam/smart'
import { getWeakPoints, getSmartPaperConfig, generateSmartPaper, getSmartPaperHistory } from '~/api/exam/smart'
import type { SubjectVO } from '~/types/exam'

const _router = useRouter()
const message = useMessage()

/* ==================== 状态定义 ==================== */
const loading = ref(false)
const generating = ref(false)
const historyLoading = ref(false)
const weakPoints = ref<WeakKnowledgePoint[]>([])
const subjects = ref<SubjectVO[]>([
  { id: 1, name: '高等数学' },
  { id: 2, name: '线性代数' },
  { id: 3, name: '概率论' },
])
const selectedSubjectId = ref<number>()
const historyList = ref<any[]>([])

const difficultyLabels = ['简单', '较易', '中等', '较难', '困难']

/* 智能分析推荐参数 */
const recommendCount = ref(30)
const recommendDuration = ref(60)
const suggestDifficulty = ref(3)

/* 组卷配置 */
const paperConfig = ref<SmartPaperReqVO>({
  mode: 'auto',
  questionCount: 30,
  difficulty: 3,
  durationMinutes: 60,
  strategy: 'weak',
})

/* 手动模式下选中的知识点 */
const selectedPoints = ref<number[]>([])
const selectAll = ref(false)

/* 预估总分 */
const estimatedTotalScore = computed(() => {
  /* 简单计算：单选题占60%，多选题占40%，单选1分，多选2分 */
  const singleCount = Math.floor(paperConfig.value.questionCount * 0.6)
  const multiCount = paperConfig.value.questionCount - singleCount
  return singleCount * 1 + multiCount * 2
})

/* ==================== 方法定义 ==================== */
const goBack = () => {
  navigateTo('/study/exam')
}

const loadWeakPoints = async () => {
  try {
    loading.value = true
    const { list } = await getWeakPoints({
      subjectId: selectedSubjectId.value,
      limit: 10,
    })
    weakPoints.value = list

    /* 自动模式下默认选中所有薄弱知识点 */
    if (paperConfig.value.mode === 'auto') {
      selectedPoints.value = list.map(p => p.id)
    }
  } finally {
    loading.value = false
  }
}

const loadSmartConfig = async () => {
  try {
    const config = await getSmartPaperConfig(undefined, selectedSubjectId.value)
    recommendCount.value = config.recommendCount
    recommendDuration.value = config.recommendDuration
    suggestDifficulty.value = config.suggestDifficulty

    /* 应用推荐参数 */
    paperConfig.value.questionCount = config.recommendCount
    paperConfig.value.durationMinutes = config.recommendDuration
    paperConfig.value.difficulty = config.suggestDifficulty
  } catch (err) {
    console.log('加载智能配置失败', err)
  }
}

const handleSubjectChange = () => {
  loadWeakPoints()
  loadSmartConfig()
}

const isSelected = (id: number) => {
  return selectedPoints.value.includes(id)
}

const toggleSelection = (id: number, selected: boolean) => {
  if (selected) {
    if (!selectedPoints.value.includes(id)) {
      selectedPoints.value.push(id)
    }
  } else {
    const index = selectedPoints.value.indexOf(id)
    if (index > -1) {
      selectedPoints.value.splice(index, 1)
    }
  }
}

const handleSelectAll = (val: boolean) => {
  if (val) {
    selectedPoints.value = weakPoints.value.map(p => p.id)
  } else {
    selectedPoints.value = []
  }
}

const getPriorityClass = (priority: number) => {
  if (priority >= 5) return 'bg-red-100 text-red-600'
  if (priority >= 4) return 'bg-orange-100 text-orange-600'
  if (priority >= 3) return 'bg-yellow-100 text-yellow-600'
  return 'bg-blue-100 text-blue-600'
}

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 80) return 'text-green-600'
  if (accuracy >= 60) return 'text-blue-600'
  if (accuracy >= 40) return 'text-orange-600'
  return 'text-red-600'
}

const getProgressColor = (accuracy: number) => {
  if (accuracy >= 80) return '#22c55e'
  if (accuracy >= 60) return '#3b82f6'
  if (accuracy >= 40) return '#f97316'
  return '#ef4444'
}

const getScoreClass = (accuracy: number) => {
  if (accuracy >= 80) return 'text-green-600'
  if (accuracy >= 60) return 'text-blue-600'
  return 'text-red-600'
}

const loadHistory = async () => {
  try {
    historyLoading.value = true
    const { list } = await getSmartPaperHistory({ page: 1, pageSize: 5 })
    historyList.value = list
  } finally {
    historyLoading.value = false
  }
}

const generatePaper = async () => {
  if (paperConfig.value.mode === 'manual' && selectedPoints.value.length === 0) {
    message.warning('请至少选择一个知识点')
    return
  }

  try {
    generating.value = true
    const data = await generateSmartPaper({
      ...paperConfig.value,
      knowledgePointIds: selectedPoints.value,
    })

    message.success('试卷生成成功')

    /* 保存智能组卷配置到 store */
    const examStore = useQBankStore()
    examStore.mockSetting = {
      durationMinutes: paperConfig.value.durationMinutes,
      timeMode: 'countdown',
      questionInfo: [
        { displayName: '单选题', type: 0, count: Math.floor(paperConfig.value.questionCount * 0.6), score: 1, totalScore: Math.floor(paperConfig.value.questionCount * 0.6) },
        { displayName: '多选题', type: 1, count: Math.ceil(paperConfig.value.questionCount * 0.4), score: 2, totalScore: Math.ceil(paperConfig.value.questionCount * 0.4) * 2 },
      ],
      randomQuestions: true,
      difficulty: paperConfig.value.difficulty,
      passScore: 60,
    }

    /* 跳转到考试页面 */
    navigateTo(`/study/exam/${data.paperId}?type=smart`)
  } catch (err) {
    message.error('生成试卷失败')
    console.log(err)
  } finally {
    generating.value = false
  }
}

const viewReport = (paperId: number) => {
  navigateTo(`/study/exam/report/${paperId}`)
}

/* ==================== 初始化 ==================== */
onMounted(() => {
  loadWeakPoints()
  loadSmartConfig()
  loadHistory()
})
</script>

<style scoped lang="scss">
.text-primary {
  color: var(--el-color-primary);
}
</style>
