<script setup lang="ts">
import type { ChapterAccuracyVO } from '~/types/statistics'

/**
 * 章节正确率对比组件 - 清爽简洁风格
 */
interface Props {
  /* 章节正确率数据 */
  data: ChapterAccuracyVO[]
}

const props = defineProps<Props>()

/* 按科目分组 */
const groupedBySubject = computed(() => {
  const groups: Record<string, ChapterAccuracyVO[]> = {}
  props.data.forEach((item) => {
    if (!groups[item.subjectName]) {
      groups[item.subjectName] = []
    }
    groups[item.subjectName].push(item)
  })
  return groups
})

/* 当前选中的科目 */
const selectedSubject = ref<string>('')

/* 科目列表 */
const subjects = computed(() => {
  const list = Object.keys(groupedBySubject.value)
  if (list.length > 0 && !selectedSubject.value) {
    selectedSubject.value = list[0]
  }
  return list
})

/* 当前科目的章节数据 */
const currentSubjectData = computed(() => {
  return groupedBySubject.value[selectedSubject.value] || []
})

/* 计算平均正确率 */
const avgAccuracy = computed(() => {
  if (currentSubjectData.value.length === 0) return 0
  const sum = currentSubjectData.value.reduce((acc, item) => acc + item.accuracy, 0)
  return Math.round(sum / currentSubjectData.value.length)
})

/* 获取正确率颜色 */
const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 80) return '#22c55e'
  if (accuracy >= 60) return '#3b82f6'
  if (accuracy >= 40) return '#f59e0b'
  return '#ef4444'
}

/* 排序：按正确率从低到高 */
const sortedData = computed(() => {
  return [...currentSubjectData.value].sort((a, b) => a.accuracy - b.accuracy)
})
</script>

<template>
  <div class="chapter-chart">
    <!-- 标题区 -->
    <div class="chart-header">
      <div class="title-section">
        <div class="title-icon-wrapper">
          <Icon name="ep:data-analysis" class="title-icon" />
        </div>
        <div class="title-text">
          <h3 class="chart-title">章节正确率</h3>
          <span class="chart-subtitle">各章节学习进度与正确率统计</span>
        </div>
      </div>

      <!-- 科目选择 -->
      <el-select v-model="selectedSubject" class="subject-select" size="small">
        <el-option
          v-for="subject in subjects"
          :key="subject"
          :label="subject"
          :value="subject"
        />
      </el-select>
    </div>

    <!-- 内容区 -->
    <div class="chart-content">
      <!-- 章节列表 -->
      <div class="chapter-list">
        <div
          v-for="(item, index) in sortedData"
          :key="item.chapterId"
          class="chapter-item"
          :class="{ 'is-weak': item.accuracy < 60, 'top-3': index < 3 }"
        >
          <!-- 排名 -->
          <div class="chapter-rank">
            {{ index + 1 }}
          </div>

          <!-- 内容 -->
          <div class="chapter-content">
            <div class="chapter-header">
              <span class="chapter-name">{{ item.chapterName }}</span>
              <div class="chapter-badges">
                <div
                  class="accuracy-ring"
                  :style="{ borderColor: getAccuracyColor(item.accuracy) }"
                >
                  <span class="accuracy-value" :style="{ color: getAccuracyColor(item.accuracy) }">
                    {{ item.accuracy }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="chapter-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{
                    width: `${item.accuracy}%`,
                    background: `linear-gradient(90deg, ${getAccuracyColor(item.accuracy)}80 0%, ${getAccuracyColor(item.accuracy)} 100%)`
                  }"
                />
              </div>
              <div class="progress-info">
                <span class="progress-stat">
                  <Icon name="ep:document" />
                  {{ item.totalCount }}题
                </span>
                <span class="progress-stat">
                  <Icon name="ep:check" />
                  {{ item.correctCount }}正确
                </span>
                <span class="progress-stat progress">
                  <Icon name="ep:timer" />
                  {{ item.progress }}%进度
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计面板 -->
      <div class="stats-panel">
        <div class="stat-card avg-card">
          <div class="stat-ring" :style="{ borderColor: getAccuracyColor(avgAccuracy) + '40' }">
            <span class="stat-value" :style="{ color: getAccuracyColor(avgAccuracy) }">
              {{ avgAccuracy }}%
            </span>
          </div>
          <span class="stat-label">平均正确率</span>
        </div>

        <div class="stat-stats">
          <div class="mini-stat">
            <span class="mini-value">{{ currentSubjectData.length }}</span>
            <span class="mini-label">章节数</span>
          </div>
          <div class="mini-stat">
            <span class="mini-value" style="color: #ef4444;">
              {{ currentSubjectData.filter((i) => i.accuracy < 60).length }}
            </span>
            <span class="mini-label">需加强</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 标题区 */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3e8ff 0%, #dbeafe 100%);
  border-radius: 10px;
  font-size: 20px;
  color: #8b5cf6;
}

.title-text {
  .chart-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
  }

  .chart-subtitle {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.subject-select {
  width: 120px;
}

/* 内容区 */
.chart-content {
  display: flex;
  gap: 20px;
}

/* 章节列表 */
.chapter-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--el-fill-color-light);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--el-color-primary-light-5);
    border-radius: 2px;
  }
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--el-fill-color-light);
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--el-fill-color);
  }

  &.is-weak {
    background: #fef2f2;
    border-left: 3px solid #ef4444;
  }

  &.top-3 {
    .chapter-rank {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
    }
  }
}

.chapter-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-darker);
  color: var(--el-text-color-regular);
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
}

.chapter-content {
  flex: 1;
  min-width: 0;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.chapter-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.accuracy-ring {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  border-radius: 50%;
}

.accuracy-value {
  font-size: 12px;
  font-weight: 700;
}

.chapter-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  height: 6px;
  background: var(--el-fill-color-darker);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-info {
  display: flex;
  gap: 16px;
}

.progress-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);

  svg {
    font-size: 13px;
  }

  &.progress {
    margin-left: auto;
    color: var(--el-color-primary);
  }
}

/* 统计面板 */
.stats-panel {
  width: 120px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: var(--el-fill-color-light);
  border-radius: 12px;
}

.stat-ring {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid;
  border-radius: 50%;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stat-stats {
  display: flex;
  gap: 8px;
}

.mini-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 10px;
}

.mini-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.mini-label {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 16px;
  }

  .subject-select {
    width: 100%;
  }

  .chart-content {
    flex-direction: column;
  }

  .chapter-list {
    max-height: 280px;
  }

  .stats-panel {
    width: 100%;
    flex-direction: row;
  }

  .stat-card {
    flex: 1;
  }

  .stat-stats {
    flex: 1;
  }
}
</style>
