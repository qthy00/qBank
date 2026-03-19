<script setup lang="ts">
import type { KnowledgePointVO } from '~/types/statistics'

/**
 * 知识点雷达图组件
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
  const list = Object.keys(groupedBySubject.value)
  if (list.length > 0 && !selectedSubject.value) {
    selectedSubject.value = list[0]
  }
  return list
})

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
  if (mastery >= 40) return '#eab308'
  return '#ef4444'
}
</script>

<template>
  <div class="radar-chart">
    <div class="chart-header">
      <h3 class="chart-title">
        <Icon name="ep:pie-chart" class="title-icon" />
        知识点掌握程度
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

    <div class="radar-content">
      <!-- 雷达图区域（使用进度条模拟） -->
      <div class="radar-bars">
        <div
          v-for="item in currentSubjectData.slice(0, 6)"
          :key="item.id"
          class="radar-item"
        >
          <div class="radar-label">
            <span class="label-name">{{ item.name }}</span>
            <span class="label-value" :style="{ color: getMasteryColor(item.mastery) }">
              {{ item.mastery }}%
            </span>
          </div>
          <el-progress
            :percentage="item.mastery"
            :color="getMasteryColor(item.mastery)"
            :show-text="false"
            :stroke-width="8"
          />
          <div class="radar-detail">
            <span>{{ item.questionCount }}题</span>
            <span>正确 {{ item.correctCount }}</span>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="radar-summary">
        <div class="summary-item">
          <span class="summary-label">平均掌握度</span>
          <span class="summary-value" :style="{ color: getMasteryColor(avgMastery) }">
            {{ avgMastery }}%
          </span>
        </div>
        <div class="summary-item">
          <span class="summary-label">知识点数</span>
          <span class="summary-value">{{ currentSubjectData.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">薄弱项</span>
          <span class="summary-value text-red-500">
            {{ currentSubjectData.filter((i) => i.mastery < 60).length }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.radar-chart {
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

  .radar-content {
    display: flex;
    gap: 24px;
  }

  .radar-bars {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .radar-item {
      .radar-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;

        .label-name {
          font-size: 14px;
          color: var(--el-text-color-primary);
        }

        .label-value {
          font-size: 14px;
          font-weight: 600;
        }
      }

      .radar-detail {
        display: flex;
        gap: 16px;
        margin-top: 4px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .radar-summary {
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
  .radar-chart {
    .radar-content {
      flex-direction: column;
    }

    .radar-summary {
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
