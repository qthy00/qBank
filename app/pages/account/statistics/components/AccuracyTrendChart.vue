<script setup lang="ts">
import type { AccuracyTrendItemVO } from '~/types/statistics'

/**
 * 正确率趋势图表组件
 */
interface Props {
  data: AccuracyTrendItemVO[]
  trendType: 'week' | 'month'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'typeChange', type: 'week' | 'month'): void
}>()

/**
 * 计算平均正确率
 */
const avgAccuracy = computed(() => {
  if (!props.data.length) return 0
  const sum = props.data.reduce((acc, item) => acc + item.accuracy, 0)
  return Math.round(sum / props.data.length)
})

/**
 * 计算最高正确率
 */
const maxAccuracy = computed(() => {
  if (!props.data.length) return 0
  return Math.max(...props.data.map((item) => item.accuracy))
})

/**
 * 计算总做题数
 */
const totalQuestions = computed(() => {
  return props.data.reduce((acc, item) => acc + item.questionCount, 0)
})

/**
 * 格式化日期显示
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

/**
 * 计算柱状图高度（最大值为100px）
 */
const getBarHeight = (accuracy: number): number => {
  return Math.max(20, (accuracy / 100) * 100)
}

/**
 * 获取正确率颜色
 */
const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 80) return '#22c55e'
  if (accuracy >= 60) return '#3b82f6'
  if (accuracy >= 40) return '#f59e0b'
  return '#ef4444'
}

/**
 * 切换趋势类型
 */
const handleTypeChange = (type: 'week' | 'month') => {
  emit('typeChange', type)
}
</script>

<template>
  <div class="accuracy-trend">
    <!-- 头部 -->
    <div class="trend-header">
      <div class="header-left">
        <h3 class="chart-title">
          <Icon name="material-symbols:trending-up" class="title-icon" />
          正确率趋势
        </h3>
        <div class="header-stats">
          <span class="stat-item">
            平均正确率：<strong>{{ avgAccuracy }}%</strong>
          </span>
          <span class="stat-item">
            最高正确率：<strong>{{ maxAccuracy }}%</strong>
          </span>
          <span class="stat-item">
            做题总数：<strong>{{ totalQuestions }}道</strong>
          </span>
        </div>
      </div>
      <div class="header-right">
        <el-radio-group
          :model-value="trendType"
          size="small"
          @change="handleTypeChange"
        >
          <el-radio-button label="week">近7天</el-radio-button>
          <el-radio-button label="month">近30天</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-container">
      <div v-if="data.length === 0" class="empty-state">
        <Icon name="material-symbols:bar-chart" class="empty-icon" />
        <p>暂无数据</p>
      </div>
      <div v-else class="bar-chart">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="bar-item"
          :title="`${formatDate(item.date)}: ${item.accuracy}% (${item.correctCount}/${item.questionCount})`"
        >
          <div class="bar-wrapper">
            <div
              class="bar"
              :style="{
                height: `${getBarHeight(item.accuracy)}px`,
                backgroundColor: getAccuracyColor(item.accuracy),
              }"
            >
              <span v-if="item.accuracy >= 60" class="bar-value">
                {{ item.accuracy }}%
              </span>
            </div>
            <span v-if="item.accuracy < 60" class="bar-value-outside">
              {{ item.accuracy }}%
            </span>
          </div>
          <div class="bar-label">{{ formatDate(item.date) }}</div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-dot" style="background-color: #22c55e"></span>
        <span>优秀 (80%+)</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" style="background-color: #3b82f6"></span>
        <span>良好 (60-79%)</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" style="background-color: #f59e0b"></span>
        <span>一般 (40-59%)</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" style="background-color: #ef4444"></span>
        <span>需加强 (&lt;40%)</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.accuracy-trend {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  flex: 1;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  .title-icon {
    color: var(--el-color-primary);
  }
}

.header-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 13px;
  color: var(--el-text-color-secondary);

  strong {
    color: var(--el-text-color-primary);
    font-weight: 600;
  }
}

.chart-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--el-text-color-secondary);

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 20px 0;
  min-height: 180px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-height: 120px;
}

.bar {
  width: 100%;
  max-width: 40px;
  min-width: 16px;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  &:hover {
    opacity: 0.8;
    transform: scaleX(1.1);
  }
}

.bar-value {
  font-size: 11px;
  font-weight: 600;
  color: white;
  padding-top: 4px;
}

.bar-value-outside {
  font-size: 11px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.bar-label {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .trend-header {
    flex-direction: column;
  }

  .header-stats {
    gap: 12px;
  }

  .bar-chart {
    gap: 4px;
  }

  .bar-label {
    font-size: 10px;
    transform: rotate(-45deg);
    transform-origin: center top;
    margin-top: 8px;
  }

  .chart-legend {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
