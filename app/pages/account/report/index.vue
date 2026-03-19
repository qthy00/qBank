<script setup lang="ts">
import { useStudyStatistics } from '~/composables/useStudyStatistics'
import OverallScoreCard from './components/OverallScoreCard.vue'
import KnowledgeRadarChart from './components/KnowledgeRadarChart.vue'
import ChapterAccuracyChart from './components/ChapterAccuracyChart.vue'
import WeakPointsList from './components/WeakPointsList.vue'
import StudySuggestions from './components/StudySuggestions.vue'

/**
 * 能力评估报告页面
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
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">能力评估报告</h1>
        <p class="page-desc">全面分析学习情况，发现薄弱环节，获取个性化学习建议</p>
      </div>
      <div class="header-right">
        <el-radio-group
          v-model="assessmentQuery.timeRange"
          size="small"
          @change="handleTimeRangeChange"
        >
          <el-radio-button
            v-for="option in timeRangeOptions"
            :key="option.value"
            :label="option.value"
          >
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
        <el-button
          :icon="Refresh"
          circle
          size="small"
          @click="handleRefresh"
          :loading="loading"
          class="refresh-btn"
        />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="pageLoading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <template v-else-if="abilityAssessment">
      <!-- 综合评分卡片 -->
      <OverallScoreCard
        :score="abilityAssessment.overallScore"
        :update-time="abilityAssessment.updateTime"
        class="section-card"
      />

      <!-- 图表区域 -->
      <div class="charts-grid">
        <!-- 知识点雷达图 -->
        <KnowledgeRadarChart
          :data="abilityAssessment.knowledgePoints"
          class="chart-card"
        />

        <!-- 章节正确率对比 -->
        <ChapterAccuracyChart
          :data="abilityAssessment.chapterAccuracy"
          class="chart-card"
        />
      </div>

      <!-- 薄弱知识点和建议 -->
      <div class="bottom-grid">
        <!-- 薄弱知识点列表 -->
        <WeakPointsList
          :data="abilityAssessment.weakPoints"
          :get-accuracy-color-class="getAccuracyColorClass"
          class="bottom-card"
        />

        <!-- 学习建议 -->
        <StudySuggestions
          :data="abilityAssessment.suggestions"
          class="bottom-card"
        />
      </div>
    </template>

    <!-- 空状态 -->
    <el-empty
      v-else
      description="暂无能力评估数据"
      :image-size="120"
    >
      <template #default>
        <p class="empty-tip">开始学习后，系统将自动生成您的能力评估报告</p>
        <el-button type="primary" @click="navigateTo('/qbank')">
          去练习
        </el-button>
      </template>
    </el-empty>
  </div>
</template>

<style scoped lang="scss">
.report-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  .header-left {
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
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .refresh-btn {
      margin-left: 8px;
    }
  }
}

.loading-container {
  padding: 24px;
  background: white;
  border-radius: 12px;
}

.section-card {
  margin-bottom: 24px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  .chart-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  .bottom-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.empty-tip {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}

@media (max-width: 1024px) {
  .charts-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .report-page {
    padding: 16px 12px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;

    .header-left {
      .page-title {
        font-size: 22px;
      }
    }
  }

  .charts-grid,
  .bottom-grid {
    gap: 16px;

    .chart-card,
    .bottom-card {
      padding: 16px;
    }
  }
}
</style>
