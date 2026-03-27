<script setup lang="ts">
import { useStudyStatistics } from '~/composables/useStudyStatistics'
import StudyStatsCards from './components/StudyStatsCards.vue'
import AccuracyTrendChart from './components/AccuracyTrendChart.vue'
import SubjectAccuracyChart from './components/SubjectAccuracyChart.vue'
import StudyHeatmap from './components/StudyHeatmap.vue'
import StudyRecordList from './components/StudyRecordList.vue'

/**
 * 学习数据统计看板页面
 */
definePageMeta({
  layout: 'member',
  middleware: ['auth'],
})

useHead({
  title: '学习数据统计 - 学次元在线题库',
  meta: [
    {
      name: 'description',
      content: '查看您的学习数据统计，包括学习时长、正确率趋势、做题数量等',
    },
  ],
})

/* ==================== 状态定义 ==================== */

const {
  loading,
  overview,
  subjectAccuracy,
  trendType,
  currentTrendData,
  records,
  recordsTotal,
  recordQuery,
  avgDailyDuration,
  formatDuration,
  formatNumber,
  fetchStatistics,
  fetchRecords,
  switchTrendType,
} = useStudyStatistics()

/* 页面加载状态 */
const pageLoading = ref(true)

/* ==================== 方法定义 ==================== */

/* 初始化加载数据 */
const initData = async () => {
  pageLoading.value = true
  await fetchStatistics()
  await fetchRecords()
  pageLoading.value = false
}

/* 处理趋势类型切换 */
const handleTrendTypeChange = (type: 'week' | 'month') => {
  switchTrendType(type)
}

/* 处理分页变化 */
const handlePageChange = (page: number) => {
  recordQuery.page = page
}

/* ==================== 初始化 ==================== */

onMounted(() => {
  initData()
})
</script>

<template>
  <div class="statistics-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">学习数据统计</h1>
      <p class="page-desc">追踪学习进度，分析薄弱环节，提升学习效果</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="pageLoading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <template v-else>
      <!-- 统计卡片区域 -->
      <StudyStatsCards
        :overview="overview"
        :avg-daily-duration="avgDailyDuration"
        :format-duration="formatDuration"
        :format-number="formatNumber"
        class="stats-section"
      />

      <!-- 图表区域 -->
      <div class="charts-grid">
        <!-- 正确率趋势 -->
        <AccuracyTrendChart
          :data="currentTrendData"
          :trend-type="trendType"
          class="chart-card"
          @type-change="handleTrendTypeChange"
        />

        <!-- 科目正确率分布 -->
        <SubjectAccuracyChart
          :data="subjectAccuracy"
          class="chart-card"
        />
      </div>

      <!-- 学习热力图 -->
      <StudyHeatmap
        class="heatmap-section"
      />

      <!-- 学习记录列表 -->
      <StudyRecordList
        :records="records"
        :total="recordsTotal"
        :page="recordQuery.page"
        :limit="recordQuery.limit"
        :loading="loading"
        class="records-section"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.statistics-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-header {
  margin-bottom: 24px;

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

.loading-container {
  padding: 24px;
  background: white;
  border-radius: 12px;
}

.stats-section {
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

.heatmap-section {
  margin-bottom: 24px;
}

.records-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .statistics-page {
    padding: 16px 12px;
  }

  .page-header {
    .page-title {
      font-size: 22px;
    }
  }

  .charts-grid {
    gap: 16px;

    .chart-card {
      padding: 16px;
    }
  }

  .records-section {
    padding: 16px;
  }
}
</style>
