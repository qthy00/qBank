<script setup lang="ts">
import type { ChapterAccuracyVO } from '~/types/statistics'

/**
 * 章节正确率对比组件
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
  if (accuracy >= 40) return '#eab308'
  return '#ef4444'
}

/* 排序：按正确率从低到高 */
const sortedData = computed(() => {
  return [...currentSubjectData.value].sort((a, b) => a.accuracy - b.accuracy)
})
</script>

<template>
  <div class="chapter-chart">
    <div class="chart-header">
      <h3 class="chart-title">
        <Icon name="ep:data-analysis" class="title-icon" />
        章节正确率对比
      </h3>
      <el-select
        v-model="selectedSubject"
        size="small"
        placeholder="选择科目"
        class="subject-select"
      >
        <el-option
          v-for="subject in subjects"
          :key="subject"
          :label="subject"
          :value="subject"
        />
      </el-select>
    </div>

    <div class="chapter-content">
      <!-- 章节列表 -->
      <div class="chapter-list">
        <div
          v-for="(item, index) in sortedData"
          :key="item.chapterId"
          class="chapter-item"
          :class="{ 'weak': item.accuracy < 60 }"
        >
          <div class="chapter-info">
            <div class="chapter-rank">{{ index + 1 }}</div>
            <div class="chapter-detail">
              <span class="chapter-name">{{ item.chapterName }}</span>
              <div class="chapter-meta">
                <span class="accuracy-badge" :style="{ backgroundColor: getAccuracyColor(item.accuracy) + '20', color: getAccuracyColor(item.accuracy) }">
                  {{ item.accuracy }}%
                </span>
                <span class="progress-text">进度 {{ item.progress }}%</span>
              </div>
            </div>
          </div>
          <el-progress
            :percentage="item.accuracy"
            :color="getAccuracyColor(item.accuracy)"
            :show-text="false"
            :stroke-width="6"
            class="chapter-progress"
          />
          <div class="chapter-stats">
            <span>{{ item.totalCount }}题</span>
            <span>正确 {{ item.correctCount }}</span>
          </div>
        </div>
      </div>

      <!-- 统计摘要 -->
      <div class="chapter-summary">
        <div class="summary-item">
          <span class="summary-label">平均正确率</span>
          <span class="summary-value" :style="{ color: getAccuracyColor(avgAccuracy) }">
            {{ avgAccuracy }}%
          </span>
        </div>
        <div class="summary-item">
          <span class="summary-label">章节数</span>
          <span class="summary-value">{{ currentSubjectData.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">需加强</span>
          <span class="summary-value text-red-500">
            {{ currentSubjectData.filter((i) => i.accuracy < 60).length }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chapter-chart {
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

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

    .subject-select {
      width: 140px;
    }
  }

  .chapter-content {
    display: flex;
    gap: 24px;
  }

  .chapter-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 300px;
    overflow-y: auto;

    .chapter-item {
      padding: 12px;
      border-radius: 8px;
      background: var(--el-fill-color-light);
      transition: all 0.3s;

      &.weak {
        background: #fef2f2;
        border: 1px solid #fecaca;
      }

      &:hover {
        background: var(--el-fill-color);
      }

      .chapter-info {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;

        .chapter-rank {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--el-color-primary);
          color: white;
          font-size: 12px;
          font-weight: 600;
          border-radius: 50%;
        }

        .chapter-detail {
          flex: 1;

          .chapter-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--el-text-color-primary);
            display: block;
            margin-bottom: 4px;
          }

          .chapter-meta {
            display: flex;
            align-items: center;
            gap: 8px;

            .accuracy-badge {
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
            }

            .progress-text {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }
        }
      }

      .chapter-progress {
        margin-bottom: 4px;
      }

      .chapter-stats {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .chapter-summary {
    width: 120px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-left: 16px;
    border-left: 1px solid var(--el-border-color-light);

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .summary-label {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }

      .summary-value {
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }
}

@media (max-width: 768px) {
  .chapter-chart {
    .chapter-content {
      flex-direction: column;
    }

    .chapter-list {
      max-height: 250px;
    }

    .chapter-summary {
      width: 100%;
      flex-direction: row;
      justify-content: space-around;
      padding-left: 0;
      padding-top: 16px;
      border-left: none;
      border-top: 1px solid var(--el-border-color-light);

      .summary-item {
        text-align: center;
      }
    }
  }
}
</style>
