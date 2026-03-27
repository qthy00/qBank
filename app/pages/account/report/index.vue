<script setup lang="ts">
import { useStudyStatistics } from '~/composables/useStudyStatistics'
import OverallScoreCard from './components/OverallScoreCard.vue'
import KnowledgeRadarChart from './components/KnowledgeRadarChart.vue'
import ChapterAccuracyChart from './components/ChapterAccuracyChart.vue'
import WeakPointsList from './components/WeakPointsList.vue'
import StudySuggestions from './components/StudySuggestions.vue'

/**
 * 能力评估报告页面 - 清爽简洁风格
 * 采用浅色主题，Element Plus 卡片风格
 */
definePageMeta({
  layout: 'member',
  middleware: ['auth'],
})

useHead({
  title: '能力评估报告 - 学次元在线题库',
  meta: [
    {
      name: 'description',
      content: '查看您的能力评估报告，了解知识点掌握程度、薄弱环节，获取个性化学习建议',
    },
  ],
})

/* ==================== 状态定义 ==================== */

const {
  loading,
  abilityAssessment,
  assessmentQuery,
  fetchAbilityAssessment,
  switchAssessmentTimeRange,
  getAccuracyColorClass,
} = useStudyStatistics()

/* 页面加载状态 */
const pageLoading = ref(true)

/* 时间范围选项 */
const timeRangeOptions = [
  { label: '全部', value: 'all' },
  { label: '近7天', value: 'week' },
  { label: '近30天', value: 'month' },
]

/* ==================== 方法定义 ==================== */

/* 初始化加载数据 */
const initData = async () => {
  pageLoading.value = true
  await fetchAbilityAssessment()
  pageLoading.value = false
}

/* 处理时间范围切换 */
const handleTimeRangeChange = (range: 'week' | 'month' | 'all') => {
  switchAssessmentTimeRange(range)
}

/* 处理刷新 */
const handleRefresh = () => {
  initData()
}

/* ==================== 初始化 ==================== */

onMounted(() => {
  initData()
})
</script>

<template>
  <div class="report-page">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">能力评估报告</h1>
        <p class="page-desc">基于您的学习数据深度分析，发现薄弱环节，获取个性化提升建议</p>
      </div>

      <div class="header-controls">
        <div class="time-selector">
          <button
            v-for="option in timeRangeOptions"
            :key="option.value"
            class="time-btn"
            :class="{ active: assessmentQuery.timeRange === option.value }"
            @click="handleTimeRangeChange(option.value as 'week' | 'month' | 'all')"
          >
            {{ option.label }}
          </button>
        </div>
        <el-button
          class="refresh-btn"
          :loading="loading"
          circle
          @click="handleRefresh"
        >
          <Icon name="ep:refresh" />
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="pageLoading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 主要内容 -->
    <template v-else-if="abilityAssessment">
      <div class="report-content">
        <!-- 综合评分卡片 -->
        <OverallScoreCard
          :score="abilityAssessment.overallScore"
          :update-time="abilityAssessment.updateTime"
        />

        <!-- 数据洞察区 -->
        <div class="insights-grid">
          <el-card class="insight-card" shadow="never">
            <KnowledgeRadarChart
              :data="abilityAssessment.knowledgePoints"
            />
          </el-card>
          <el-card class="insight-card" shadow="never">
            <ChapterAccuracyChart
              :data="abilityAssessment.chapterAccuracy"
            />
          </el-card>
        </div>

        <!-- 行动建议区 -->
        <div class="action-grid">
          <el-card class="action-card" shadow="never">
            <WeakPointsList
              :data="abilityAssessment.weakPoints"
              :get-accuracy-color-class="getAccuracyColorClass"
            />
          </el-card>
          <el-card class="action-card" shadow="never">
            <StudySuggestions
              :data="abilityAssessment.suggestions"
            />
          </el-card>
        </div>
      </div>
    </template>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-empty description="暂无评估数据">
        <template #image>
          <div class="empty-icon">
            <Icon name="ep:document" />
          </div>
        </template>
        <template #description>
          <div class="empty-text">
            <h3>暂无评估数据</h3>
            <p>开始学习后，系统将基于您的做题记录和正确率<br>自动生成个性化的能力评估报告</p>
          </div>
        </template>
        <el-button type="primary" @click="navigateTo('/qbank')">
          开始练习
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 页面容器 */
.report-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* 页面标题区 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.page-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* 控制区 */
.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.time-selector {
  display: flex;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 4px;
}

.time-btn {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--el-text-color-primary);
  }

  &.active {
    color: var(--el-color-primary);
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.refresh-btn {
  font-size: 16px;
}

/* 加载状态 */
.loading-container {
  padding: 24px;
  background: white;
  border-radius: 12px;
}

/* 报告内容区 */
.report-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 数据洞察网格 */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.insight-card {
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 24px;
  }
}

/* 行动建议网格 */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.action-card {
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 24px;
  }
}

/* 空状态 */
.empty-state {
  padding: 60px 0;

  .empty-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--el-fill-color-light);
    border-radius: 50%;
    font-size: 36px;
    color: var(--el-color-primary);
    margin: 0 auto 24px;
  }

  .empty-text {
    text-align: center;
    margin-bottom: 24px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      line-height: 1.6;
    }
  }
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .insights-grid,
  .action-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .report-page {
    padding: 16px 12px;
  }

  .page-title {
    font-size: 22px;
  }

  .header-controls {
    width: 100%;
  }

  .time-selector {
    flex: 1;
  }

  .time-btn {
    flex: 1;
    padding: 8px 12px;
    font-size: 12px;
  }

  .insight-card,
  .action-card {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }
}
</style>
