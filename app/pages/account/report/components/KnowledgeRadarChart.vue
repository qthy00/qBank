<script setup lang="ts">
import { watch } from 'vue'
import type { KnowledgePointVO } from '~/types/statistics'

/**
 * 知识点掌握程度组件 - 清爽简洁风格
 */
interface Props {
  /* 知识点数据 */
  data: KnowledgePointVO[]
}

const props = defineProps<Props>()

/* 按科目分组的知识点 */
const groupedBySubject = computed(() => {
  const groups: Record<string, KnowledgePointVO[]> = {}
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
  return Object.keys(groupedBySubject.value)
})

/* 初始化默认选中的科目 */
watch(subjects, (list) => {
  if (list.length > 0 && !selectedSubject.value) {
    selectedSubject.value = list[0]
  }
}, { immediate: true })

/* 当前科目的知识点数据 */
const currentSubjectData = computed(() => {
  return groupedBySubject.value[selectedSubject.value] || []
})

/* 计算平均掌握度 */
const avgMastery = computed(() => {
  if (currentSubjectData.value.length === 0) return 0
  const sum = currentSubjectData.value.reduce((acc, item) => acc + item.mastery, 0)
  return Math.round(sum / currentSubjectData.value.length)
})

/* 获取掌握度颜色 */
const getMasteryColor = (mastery: number) => {
  if (mastery >= 80) return '#22c55e'
  if (mastery >= 60) return '#3b82f6'
  if (mastery >= 40) return '#f59e0b'
  return '#ef4444'
}

/* 获取掌握度等级标签 */
const getMasteryLabel = (mastery: number) => {
  if (mastery >= 80) return '精通'
  if (mastery >= 60) return '熟练'
  if (mastery >= 40) return '了解'
  return '薄弱'
}
</script>

<template>
  <div class="knowledge-chart">
    <!-- 标题区 -->
    <div class="chart-header">
      <div class="title-section">
        <div class="title-icon-wrapper">
          <Icon name="ep:pie-chart" class="title-icon" />
        </div>
        <div class="title-text">
          <h3 class="chart-title">知识点掌握</h3>
          <span class="chart-subtitle">各科目知识点掌握程度分析</span>
        </div>
      </div>

      <!-- 科目选择器 -->
      <div class="subject-tabs">
        <button
          v-for="subject in subjects.slice(0, 4)"
          :key="subject"
          class="subject-tab"
          :class="{ active: selectedSubject === subject }"
          @click="selectedSubject = subject"
        >
          {{ subject }}
        </button>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="chart-content">
      <!-- 知识点列表 -->
      <div class="knowledge-list">
        <div
          v-for="(item, index) in currentSubjectData.slice(0, 5)"
          :key="item.id"
          class="knowledge-item"
          :class="{ 'is-weak': item.mastery < 60 }"
        >
          <!-- 排名 -->
          <div class="item-rank">{{ index + 1 }}</div>

          <!-- 信息 -->
          <div class="item-info">
            <div class="info-header">
              <span class="item-name">{{ item.name }}</span>
              <div class="item-badges">
                <span
                  class="mastery-badge"
                  :style="{ backgroundColor: getMasteryColor(item.mastery) + '20', color: getMasteryColor(item.mastery) }"
                >
                  {{ getMasteryLabel(item.mastery) }}
                </span>
                <span class="mastery-value" :style="{ color: getMasteryColor(item.mastery) }">{{ item.mastery }}%</span>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="progress-wrapper">
              <div class="progress-track">
                <div
                  class="progress-fill"
                  :style="{
                    width: `${item.mastery}%`,
                    backgroundColor: getMasteryColor(item.mastery)
                  }"
                />
              </div>
              <div class="progress-stats">
                <span>{{ item.questionCount }}题</span>
                <span class="stats-divider">·</span>
                <span>正确 {{ item.correctCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计摘要 -->
      <div class="stats-summary">
        <div class="summary-card">
          <div class="summary-icon" style="background: #dbeafe; color: #3b82f6;">
            <Icon name="ep:data-analysis" />
          </div>
          <div class="summary-data">
            <span class="summary-value" :style="{ color: getMasteryColor(avgMastery) }">
              {{ avgMastery }}%
            </span>
            <span class="summary-label">平均掌握度</span>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon" style="background: #f3e8ff; color: #8b5cf6;">
            <Icon name="ep:collection-tag" />
          </div>
          <div class="summary-data">
            <span class="summary-value">{{ currentSubjectData.length }}</span>
            <span class="summary-label">知识点</span>
          </div>
        </div>

        <div class="summary-card weak-card">
          <div class="summary-icon" style="background: #fee2e2; color: #ef4444;">
            <Icon name="ep:warning" />
          </div>
          <div class="summary-data">
            <span class="summary-value" style="color: #ef4444;">
              {{ currentSubjectData.filter((i) => i.mastery < 60).length }}
            </span>
            <span class="summary-label">需加强</span>
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
  background: linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%);
  border-radius: 10px;
  font-size: 20px;
  color: #3b82f6;
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

/* 科目标签 */
.subject-tabs {
  display: flex;
  gap: 8px;
}

.subject-tab {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--el-fill-color);
    color: var(--el-text-color-primary);
  }

  &.active {
    background: var(--el-color-primary);
    color: white;
  }
}

/* 内容区 */
.chart-content {
  display: flex;
  gap: 20px;
}

/* 知识点列表 */
.knowledge-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.knowledge-item {
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
    border-left: 3px solid #ef4444;
    background: #fef2f2;
  }
}

.item-rank {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.item-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mastery-badge {
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}

.mastery-value {
  font-size: 14px;
  font-weight: 600;
}

.progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-track {
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

.progress-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stats-divider {
  opacity: 0.5;
}

/* 统计摘要 */
.stats-summary {
  width: 140px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: var(--el-fill-color-light);
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--el-fill-color);
  }
}

.summary-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
}

.summary-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.summary-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 16px;
  }

  .subject-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .chart-content {
    flex-direction: column;
  }

  .stats-summary {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }

  .summary-card {
    flex: 1;
    flex-direction: column;
    text-align: center;
    padding: 12px;
  }
}
</style>
