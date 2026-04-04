<template>
  <div class="smart-exam-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 页面头部 - 蓝色渐变 -->
    <div class="relative overflow-hidden py-12">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
      <!-- 装饰图案 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
        <div class="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>
      </div>

      <div class="relative container mx-auto px-4 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
          <Icon name="ep:magic-stick" class="text-white text-lg"/>
          <span class="text-white/90 text-sm font-medium">AI 智能推荐</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">智能组卷</h1>
        <p class="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
          根据您的薄弱知识点，自动生成针对性练习，高效提升学习效果
        </p>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="container mx-auto px-4 py-8 -mt-4">
      <el-row :gutter="24">
        <!-- 左侧：薄弱知识点 -->
        <el-col :lg="16" :md="24" class="mb-6">
          <el-card class="border border-blue-100 shadow-lg shadow-blue-100/30" :body-style="{ padding: '20px' }">
            <template #header>
              <div class="flex items-center justify-between py-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Icon name="ep:warning-filled" class="text-white text-sm"/>
                  </div>
                  <span class="font-bold text-slate-800 text-lg">薄弱知识点分析</span>
                </div>
                <div class="flex items-center gap-2">
                  <el-button
                    type="primary"
                    link
                    class="text-blue-600"
                    @click="selectAll"
                  >
                    全选
                  </el-button>
                  <el-button
                    link
                    class="text-slate-500"
                    @click="deselectAll"
                  >
                    取消全选
                  </el-button>
                </div>
              </div>
            </template>

            <WeakPointsCard
              :weak-points="weakPoints"
              :high-count="highCount"
              :medium-count="mediumCount"
              :low-count="lowCount"
              :selected-ids="selectedKnowledgePointIds"
              @toggle="toggleKnowledgePoint"
            />
          </el-card>
        </el-col>

        <!-- 右侧：组卷配置 -->
        <el-col :lg="8" :md="24">
          <el-card class="border border-blue-100 shadow-lg shadow-blue-100/30" :body-style="{ padding: '20px' }">
            <template #header>
              <div class="flex items-center gap-2 py-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Icon name="ep:setting" class="text-white text-sm"/>
                </div>
                <span class="font-bold text-slate-800 text-lg">组卷配置</span>
              </div>
            </template>

            <ConfigPanel
              :loading="generating"
              @generate="handleGenerate"
              @reset="handleReset"
            />
          </el-card>

          <!-- 历史记录入口 -->
          <el-card class="mt-4 border border-blue-100 shadow-lg shadow-blue-100/30 cursor-pointer hover:shadow-xl transition-shadow" :body-style="{ padding: '16px' }" @click="goToHistory">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <Icon name="ep:history" class="text-2xl text-blue-600"/>
              </div>
              <div class="flex-1">
                <div class="font-medium text-slate-800">智能练习记录</div>
                <div class="text-sm text-slate-500">查看历史练习记录和错题分析</div>
              </div>
              <Icon name="ep:arrow-right" class="text-xl text-slate-400"/>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 组卷结果弹窗 -->
    <el-dialog
      v-model="resultDialogVisible"
      title="智能组卷成功"
      width="600px"
      destroy-on-close
      class="smart-exam-dialog"
    >
      <div v-if="examResult" class="exam-result">
        <div class="text-xl font-bold text-slate-800 text-center mb-6">{{ examResult.examName }}</div>

        <!-- 统计信息 -->
        <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 mb-6">
          <div class="flex justify-around mb-4 pb-4 border-b border-blue-100">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ examResult.stats.totalCount }}</div>
              <div class="text-sm text-slate-500">总题数</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-cyan-600">{{ examResult.stats.weakPointCount }}</div>
              <div class="text-sm text-slate-500">覆盖知识点</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-indigo-600">{{ examResult.stats.estimatedTime }}</div>
              <div class="text-sm text-slate-500">预计用时(分钟)</div>
            </div>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-slate-500">题型分布：</span>
              <span class="text-slate-700">
                单选{{ examResult.stats.singleCount }} /
                多选{{ examResult.stats.multiCount }} /
                判断{{ examResult.stats.judgeCount }} /
                填空{{ examResult.stats.fillCount }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-slate-500">难度分布：</span>
              <span class="text-slate-700">
                简单{{ examResult.stats.easyCount }} /
                中等{{ examResult.stats.mediumCount }} /
                困难{{ examResult.stats.hardCount }}
              </span>
            </div>
          </div>
        </div>

        <!-- 知识点预览 -->
        <div class="mb-4">
          <div class="font-medium text-slate-700 mb-3">涉及薄弱知识点</div>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="q in examResult.questions.slice(0, 5)"
              :key="q.knowledgePointId"
              size="small"
              class="bg-blue-50 text-blue-700 border-blue-200"
            >
              {{ q.knowledgePointName }}
            </el-tag>
            <el-tag v-if="examResult.questions.length > 5" size="small" type="info">
              +{{ examResult.questions.length - 5 }}个
            </el-tag>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="resultDialogVisible = false">取消</el-button>
        <el-button type="primary" class="bg-gradient-to-r from-blue-500 to-cyan-500 border-0" @click="startExam">
          开始练习
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { WeakPoint, SmartExamParams, SmartExamResult } from '~/types/smart-exam'
import { getMockWeakPointList, generateMockSmartExam } from '~/api/smart-exam/mock'
import WeakPointsCard from './components/WeakPointsCard.vue'
import ConfigPanel from './components/ConfigPanel.vue'

const message = useMessage()
const router = useRouter()

/* 页面标题 */
useHead({
  title: '智能组卷 - 学次元'
})

/* 薄弱知识点数据 */
const weakPoints = ref<WeakPoint[]>([])
const highCount = ref(0)
const mediumCount = ref(0)
const lowCount = ref(0)
const loading = ref(false)

/* 选中的知识点ID */
const selectedKnowledgePointIds = ref<number[]>([])

/* 组卷状态 */
const generating = ref(false)
const resultDialogVisible = ref(false)
const examResult = ref<SmartExamResult | null>(null)

/* 获取薄弱知识点列表 */
const fetchWeakPoints = async () => {
  loading.value = true
  try {
    /* 先使用Mock数据 */
    const res = getMockWeakPointList()
    weakPoints.value = res.list
    highCount.value = res.highCount
    mediumCount.value = res.mediumCount
    lowCount.value = res.lowCount

    /* 默认选中高危和中度薄弱 */
    selectedKnowledgePointIds.value = res.list
      .filter(item => item.weakLevel === 'high' || item.weakLevel === 'medium')
      .map(item => item.knowledgePointId)
  } catch {
    message.error('获取薄弱知识点失败')
  } finally {
    loading.value = false
  }
}

/* 切换知识点选择 */
const toggleKnowledgePoint = (id: number) => {
  const index = selectedKnowledgePointIds.value.indexOf(id)
  if (index > -1) {
    selectedKnowledgePointIds.value.splice(index, 1)
  } else {
    selectedKnowledgePointIds.value.push(id)
  }
}

/* 全选 */
const selectAll = () => {
  selectedKnowledgePointIds.value = weakPoints.value.map(item => item.knowledgePointId)
}

/* 取消全选 */
const deselectAll = () => {
  selectedKnowledgePointIds.value = []
}

/* 生成试卷 */
const handleGenerate = async (config: SmartExamParams) => {
  if (selectedKnowledgePointIds.value.length === 0) {
    message.warning('请至少选择一个薄弱知识点')
    return
  }

  generating.value = true
  try {
    const params: SmartExamParams = {
      ...config,
      knowledgePointIds: selectedKnowledgePointIds.value
    }

    /* 使用Mock数据 */
    const res = generateMockSmartExam(params)
    examResult.value = res
    resultDialogVisible.value = true

    message.success('智能组卷成功！')
  } catch {
    message.error('组卷失败，请重试')
  } finally {
    generating.value = false
  }
}

/* 重置配置 */
const handleReset = () => {
  /* 恢复默认选中高危和中度薄弱 */
  selectedKnowledgePointIds.value = weakPoints.value
    .filter(item => item.weakLevel === 'high' || item.weakLevel === 'medium')
    .map(item => item.knowledgePointId)
}

/* 开始练习 */
const startExam = () => {
  if (!examResult.value) return
  resultDialogVisible.value = false
  /* 跳转到练习页面（复用模拟考试页面） */
  router.push(`/exam/${examResult.value.examId}`)
}

/* 跳转到历史记录 */
const goToHistory = () => {
  router.push('/account/history')
}

/* 初始化 */
onMounted(() => {
  fetchWeakPoints()
})
</script>

<style scoped lang="scss">
.smart-exam-page {
  padding-bottom: 32px;
}

/* 卡片头部 */
:deep(.el-card__header) {
  padding: 0;
  border-bottom: 1px solid #e2e8f0;
}

/* 历史记录入口 */
.history-entry {
  display: flex;
  align-items: center;
  gap: 16px;

  &:hover {
    .history-arrow {
      transform: translateX(4px);
      color: #3b82f6;
    }
  }
}

.history-arrow {
  transition: all 0.3s;
}

/* 弹窗样式 */
:deep(.smart-exam-dialog .el-dialog__header) {
  margin-right: 0;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.smart-exam-dialog .el-dialog__title) {
  font-weight: bold;
  color: #1f2937;
}

:deep(.smart-exam-dialog .el-dialog__body) {
  padding: 20px;
}

:deep(.smart-exam-dialog .el-dialog__footer) {
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
}
</style>
