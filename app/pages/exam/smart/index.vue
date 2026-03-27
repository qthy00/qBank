<template>
  <div class="smart-exam-page">
    <div class="page-header">
      <h1 class="page-title">
        <Icon name="ep:magic-stick" class="title-icon" />
        智能组卷
      </h1>
      <p class="page-desc">根据您的薄弱知识点，自动生成针对性练习</p>
    </div>

    <div class="page-content">
      <el-row :gutter="24">
        <!-- 左侧：薄弱知识点 -->
        <el-col :lg="16" :md="24" class="mb-4">
          <el-card>
            <template #header>
              <div class="card-header">
                <span class="header-title">
                  <Icon name="ep:warning-filled" class="header-icon" />
                  薄弱知识点分析
                </span>
                <div class="header-actions">
                  <el-button
                    type="primary"
                    link
                    @click="selectAll"
                  >
                    全选
                  </el-button>
                  <el-button
                    link
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
          <el-card>
            <template #header>
              <div class="card-header">
                <span class="header-title">
                  <Icon name="ep:setting" class="header-icon" />
                  组卷配置
                </span>
              </div>
            </template>

            <ConfigPanel
              :loading="generating"
              @generate="handleGenerate"
              @reset="handleReset"
            />
          </el-card>

          <!-- 历史记录入口 -->
          <el-card class="mt-4" shadow="hover">
            <div class="history-entry" @click="goToHistory">
              <Icon name="ep:history" class="history-icon" />
              <div class="history-info">
                <div class="history-title">智能练习记录</div>
                <div class="history-desc">查看历史练习记录和错题分析</div>
              </div>
              <Icon name="ep:arrow-right" class="history-arrow" />
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
    >
      <div v-if="examResult" class="exam-result">
        <div class="result-title">{{ examResult.examName }}</div>

        <!-- 统计信息 -->
        <div class="result-stats">
          <div class="stat-row">
            <div class="stat-item">
              <div class="stat-value">{{ examResult.stats.totalCount }}</div>
              <div class="stat-label">总题数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ examResult.stats.weakPointCount }}</div>
              <div class="stat-label">覆盖知识点</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ examResult.stats.estimatedTime }}</div>
              <div class="stat-label">预计用时(分钟)</div>
            </div>
          </div>

          <div class="stat-detail">
            <div class="detail-item">
              <span class="detail-label">题型分布：</span>
              <span class="detail-value">
                单选{{ examResult.stats.singleCount }} /
                多选{{ examResult.stats.multiCount }} /
                判断{{ examResult.stats.judgeCount }} /
                填空{{ examResult.stats.fillCount }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">难度分布：</span>
              <span class="detail-value">
                简单{{ examResult.stats.easyCount }} /
                中等{{ examResult.stats.mediumCount }} /
                困难{{ examResult.stats.hardCount }}
              </span>
            </div>
          </div>
        </div>

        <!-- 知识点预览 -->
        <div class="knowledge-preview">
          <div class="preview-title">涉及薄弱知识点</div>
          <div class="preview-list">
            <el-tag
              v-for="q in examResult.questions.slice(0, 5)"
              :key="q.knowledgePointId"
              size="small"
              class="preview-tag"
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
        <el-button type="primary" @click="startExam">
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
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: 32px;

  .page-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .title-icon {
      color: var(--el-color-primary);
    }
  }

  .page-desc {
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-title {
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;

    .header-icon {
      color: var(--el-color-warning);
    }
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

/* 历史记录入口 */
.history-entry {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: var(--el-fill-color-light);

    .history-arrow {
      transform: translateX(4px);
    }
  }

  .history-icon {
    font-size: 32px;
    color: var(--el-color-primary);
  }

  .history-info {
    flex: 1;

    .history-title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .history-desc {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .history-arrow {
    font-size: 20px;
    color: var(--el-text-color-secondary);
    transition: transform 0.3s;
  }
}

/* 组卷结果 */
.exam-result {
  .result-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 24px;
  }

  .result-stats {
    background: var(--el-fill-color-light);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;

    .stat-row {
      display: flex;
      justify-content: space-around;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      .stat-item {
        text-align: center;

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: var(--el-color-primary);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .stat-detail {
      .detail-item {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          color: var(--el-text-color-secondary);
        }

        .detail-value {
          color: var(--el-text-color-primary);
        }
      }
    }
  }

  .knowledge-preview {
    .preview-title {
      font-weight: 500;
      margin-bottom: 12px;
    }

    .preview-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .preview-tag {
        margin-right: 0;
      }
    }
  }
}
</style>
