<template>
  <div class="weak-points-card">
    <!-- 薄弱知识点统计 -->
    <div class="stats-overview mb-4">
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="stat-item high-risk">
            <div class="stat-value">{{ highCount }}</div>
            <div class="stat-label">高危薄弱</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item medium-risk">
            <div class="stat-value">{{ mediumCount }}</div>
            <div class="stat-label">中度薄弱</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item low-risk">
            <div class="stat-value">{{ lowCount }}</div>
            <div class="stat-label">轻度薄弱</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 薄弱知识点列表 -->
    <div class="weak-points-list">
      <div
        v-for="point in weakPoints"
        :key="point.knowledgePointId"
        class="weak-point-item"
        :class="{ selected: isSelected(point.knowledgePointId) }"
        @click="toggleSelect(point.knowledgePointId)"
      >
        <div class="point-header">
          <el-checkbox
            :model-value="isSelected(point.knowledgePointId)"
            @click.stop
            @change="toggleSelect(point.knowledgePointId)"
          />
          <span class="point-name">{{ point.knowledgePointName }}</span>
          <el-tag
            :type="getWeakLevelType(point.weakLevel)"
            size="small"
            class="level-tag"
          >
            {{ getWeakLevelText(point.weakLevel) }}
          </el-tag>
        </div>
        <div class="point-stats">
          <span class="parent-name">{{ point.parentName }}</span>
          <div class="accuracy-bar">
            <el-progress
              :percentage="point.accuracy"
              :color="getAccuracyColor(point.accuracy)"
              :stroke-width="8"
              :show-text="false"
            />
            <span class="accuracy-text">{{ point.accuracy.toFixed(1) }}%</span>
          </div>
          <span class="wrong-count">错 {{ point.wrongCount }}/{{ point.totalCount }} 题</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="weakPoints.length === 0"
      description="暂无薄弱知识点，继续保持！"
    />
  </div>
</template>

<script setup lang="ts">
import type { WeakPoint } from '~/types/smart-exam'

interface Props {
  /* 薄弱知识点列表 */
  weakPoints: WeakPoint[]
  /* 高危薄弱数量 */
  highCount: number
  /* 中度薄弱数量 */
  mediumCount: number
  /* 轻度薄弱数量 */
  lowCount: number
  /* 选中的知识点ID列表 */
  selectedIds: number[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  /* 选择/取消选择 */
  toggle: [knowledgePointId: number]
  /* 全选 */
  selectAll: []
  /* 取消全选 */
  deselectAll: []
}>()

/* 是否选中 */
const isSelected = (id: number) => {
  return props.selectedIds.includes(id)
}

/* 切换选择状态 */
const toggleSelect = (id: number) => {
  emit('toggle', id)
}

/* 获取薄弱程度样式 */
const getWeakLevelType = (level: string): 'danger' | 'warning' | 'info' => {
  const typeMap: Record<string, 'danger' | 'warning' | 'info'> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return typeMap[level] || 'info'
}

/* 获取薄弱程度文本 */
const getWeakLevelText = (level: string): string => {
  const textMap: Record<string, string> = {
    high: '高危',
    medium: '中度',
    low: '轻度'
  }
  return textMap[level] || level
}

/* 获取正确率颜色 */
const getAccuracyColor = (accuracy: number): string => {
  if (accuracy < 50) return '#f56c6c'
  if (accuracy < 70) return '#e6a23c'
  return '#67c23a'
}
</script>

<style scoped lang="scss">
.weak-points-card {
  padding: 16px;
}

/* 统计概览 */
.stats-overview {
  .stat-item {
    text-align: center;
    padding: 16px;
    border-radius: 8px;
    background: var(--el-fill-color-light);

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    &.high-risk .stat-value {
      color: var(--el-color-danger);
    }

    &.medium-risk .stat-value {
      color: var(--el-color-warning);
    }

    &.low-risk .stat-value {
      color: var(--el-color-success);
    }
  }
}

/* 薄弱知识点列表 */
.weak-points-list {
  max-height: 400px;
  overflow-y: auto;
}

.weak-point-item {
  padding: 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
    background: var(--el-fill-color-light);
  }

  &.selected {
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }
}

.point-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .point-name {
    flex: 1;
    font-weight: 500;
    font-size: 14px;
  }

  .level-tag {
    flex-shrink: 0;
  }
}

.point-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 24px;

  .parent-name {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    flex-shrink: 0;
    min-width: 80px;
  }

  .accuracy-bar {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;

    :deep(.el-progress) {
      flex: 1;
    }

    .accuracy-text {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      min-width: 45px;
      text-align: right;
    }
  }

  .wrong-count {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    flex-shrink: 0;
  }
}
</style>
