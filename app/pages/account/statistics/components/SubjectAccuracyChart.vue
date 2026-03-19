<script setup lang="ts">
import type { SubjectAccuracyVO } from '~/types/statistics'

/**
 * 科目正确率分布组件
 */
interface Props {
  data: SubjectAccuracyVO[]
}

const props = defineProps<Props>()

/**
 * 排序后的数据（按正确率降序）
 */
const sortedData = computed(() => {
  return [...props.data].sort((a, b) => b.accuracy - a.accuracy)
})

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
 * 获取正确率标签
 */
const getAccuracyLabel = (accuracy: number): string => {
  if (accuracy >= 80) return '优秀'
  if (accuracy >= 60) return '良好'
  if (accuracy >= 40) return '一般'
  return '需加强'
}

/**
 * 获取正确率颜色类
 */
const getAccuracyClass = (accuracy: number): string => {
  if (accuracy >= 80) return 'excellent'
  if (accuracy >= 60) return 'good'
  if (accuracy >= 40) return 'average'
  return 'weak'
}
</script>

<template>
  <div class="subject-accuracy">
    <!-- 头部 -->
    <div class="chart-header">
      <h3 class="chart-title">
        <Icon name="material-symbols:pie-chart" class="title-icon" />
        科目正确率分布
      </h3>
    </div>

    <!-- 科目列表 -->
    <div class="subject-list">
      <div v-if="sortedData.length === 0" class="empty-state">
        <Icon name="material-symbols:school" class="empty-icon" />
        <p>暂无科目数据</p>
      </div>
      <div
        v-for="item in sortedData"
        :key="item.subjectId"
        class="subject-item"
      >
        <div class="subject-info">
          <div class="subject-name">{{ item.subjectName }}</div>
          <div class="subject-meta">
            <span class="meta-item">
              <Icon name="material-symbols:quiz" class="meta-icon" />
              {{ item.totalCount }}题
            </span>
            <span class="meta-item">
              <Icon name="material-symbols:check-circle" class="meta-icon" />
              {{ item.correctCount }}对
            </span>
          </div>
        </div>

        <div class="accuracy-section">
          <div class="accuracy-bar-wrapper">
            <div class="accuracy-bar-bg">
              <div
                class="accuracy-bar"
                :style="{
                  width: `${item.accuracy}%`,
                  backgroundColor: getAccuracyColor(item.accuracy),
                }"
              ></div>
            </div>
            <div class="accuracy-value-wrapper">
              <span
                class="accuracy-label"
                :class="getAccuracyClass(item.accuracy)"
              >
                {{ getAccuracyLabel(item.accuracy) }}
              </span>
              <span class="accuracy-value">{{ item.accuracy }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部统计 -->
    <div class="stats-footer">
      <div class="footer-stat">
        <span class="stat-label">科目数量</span>
        <span class="stat-value">{{ sortedData.length }}</span>
      </div>
      <div class="footer-stat">
        <span class="stat-label">平均正确率</span>
        <span class="stat-value">
          {{
            sortedData.length
              ? Math.round(
                  sortedData.reduce((sum, item) => sum + item.accuracy, 0) /
                    sortedData.length
                )
              : 0
          }}%
        </span>
      </div>
      <div class="footer-stat">
        <span class="stat-label">最高正确率</span>
        <span class="stat-value">
          {{ sortedData.length ? Math.max(...sortedData.map((i) => i.accuracy)) : 0 }}%
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.subject-accuracy {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;

  .title-icon {
    color: var(--el-color-primary);
  }
}

.subject-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 8px;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color);
    border-radius: 2px;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--el-text-color-secondary);

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
}

.subject-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: var(--el-fill-color);
  }
}

.subject-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subject-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.subject-meta {
  display: flex;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);

  .meta-icon {
    font-size: 14px;
  }
}

.accuracy-section {
  width: 100%;
}

.accuracy-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.accuracy-bar-bg {
  flex: 1;
  height: 8px;
  background: var(--el-border-color-lighter);
  border-radius: 4px;
  overflow: hidden;
}

.accuracy-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.accuracy-value-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  justify-content: flex-end;
}

.accuracy-label {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;

  &.excellent {
    background: #dcfce7;
    color: #166534;
  }

  &.good {
    background: #dbeafe;
    color: #1e40af;
  }

  &.average {
    background: #fef3c7;
    color: #92400e;
  }

  &.weak {
    background: #fee2e2;
    color: #991b1b;
  }
}

.accuracy-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  min-width: 40px;
  text-align: right;
}

.stats-footer {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
}

.footer-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .stat-label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  .stat-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

@media (max-width: 768px) {
  .subject-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .accuracy-value-wrapper {
    min-width: auto;
  }

  .accuracy-label {
    display: none;
  }

  .stats-footer {
    gap: 16px;
  }

  .footer-stat {
    .stat-value {
      font-size: 16px;
    }
  }
}
</style>
