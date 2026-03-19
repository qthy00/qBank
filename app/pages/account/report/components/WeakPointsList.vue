<script setup lang="ts">
import type { WeakPointVO } from '~/types/statistics'

/**
 * 薄弱知识点列表组件 - 清爽简洁风格
 */
interface Props {
  /* 薄弱知识点数据 */
  data: WeakPointVO[]
  /* 获取正确率颜色类 */
  getAccuracyColorClass: (accuracy: number) => string
}

const props = defineProps<Props>()

/* 获取优先级标签 */
const getPriorityLabel = (priority: number) => {
  const labels: Record<number, string> = {
    5: '紧急',
    4: '重要',
    3: '建议',
    2: '可选',
    1: '参考',
  }
  return labels[priority] || '建议'
}

/* 获取优先级颜色 */
const getPriorityColor = (priority: number) => {
  if (priority >= 5) return '#ef4444'
  if (priority >= 4) return '#f97316'
  if (priority >= 3) return '#f59e0b'
  if (priority >= 2) return '#3b82f6'
  return '#6b7280'
}

/* 获取优先级背景色 */
const getPriorityBgColor = (priority: number) => {
  if (priority >= 5) return '#fee2e2'
  if (priority >= 4) return '#ffedd5'
  if (priority >= 3) return '#fef3c7'
  if (priority >= 2) return '#dbeafe'
  return '#f3f4f6'
}

/* 去练习 */
const goPractice = (point: WeakPointVO) => {
  navigateTo({
    path: '/qbank',
    query: { weakPoint: point.id },
  })
}
</script>

<template>
  <div class="weak-points">
    <!-- 标题区 -->
    <div class="section-header">
      <div class="title-section">
        <div class="title-icon-wrapper">
          <Icon name="ep:warning" class="title-icon" />
        </div>
        <div class="title-text">
          <h3 class="section-title">薄弱环节</h3>
          <span class="section-subtitle">优先攻克这些知识点</span>
        </div>
      </div>
      <el-tag type="danger" effect="light">{{ data.length }}个</el-tag>
    </div>

    <!-- 列表 -->
    <div v-if="data.length > 0" class="points-list">
      <div
        v-for="(point, index) in data.slice(0, 4)"
        :key="point.id"
        class="point-item"
        :class="{ 'high-priority': point.priority >= 4 }"
      >
        <!-- 内容 -->
        <div class="point-content">
          <div class="point-header">
            <div class="point-info">
              <span class="point-name">{{ point.name }}</span>
              <el-tag size="small" type="info" effect="light">{{ point.subjectName }}</el-tag>
            </div>
            <div class="point-badges">
              <span
                class="priority-badge"
                :style="{ backgroundColor: getPriorityBgColor(point.priority), color: getPriorityColor(point.priority) }"
              >
                {{ getPriorityLabel(point.priority) }}
              </span>
              <span
                class="accuracy-badge"
                :style="{ color: getPriorityColor(point.priority) }"
              >
                {{ point.accuracy }}%
              </span>
            </div>
          </div>

          <p class="point-reason">{{ point.reason }}</p>

          <div class="point-action">
            <el-tag size="small" type="primary" effect="plain">
              <Icon name="ep:edit-pen" style="margin-right: 4px;" />
              推荐 {{ point.recommendCount }} 题
            </el-tag>
            <el-button type="primary" size="small" @click="goPractice(point)">
              去练习
              <Icon name="ep:arrow-right" class="btn-icon" />
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <Icon name="ep:check-circle" />
      </div>
      <h4 class="empty-title">太棒了！</h4>
      <p class="empty-desc">您的知识点掌握情况良好，暂无薄弱环节</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 标题区 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  background: #fef2f2;
  border-radius: 10px;
  font-size: 20px;
  color: #ef4444;
}

.title-text {
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
  }

  .section-subtitle {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

/* 列表 */
.points-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.point-item {
  display: flex;
  background: var(--el-fill-color-light);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    background: var(--el-fill-color);
  }

  &.high-priority {
    border-left: 3px solid #ef4444;
  }
}

.point-content {
  flex: 1;
  padding: 16px;
}

.point-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.point-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.point-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.point-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.priority-badge {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}

.accuracy-badge {
  font-size: 16px;
  font-weight: 700;
}

.point-reason {
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
  margin-bottom: 14px;
}

.point-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-icon {
  font-size: 12px;
  margin-left: 4px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.empty-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  border-radius: 50%;
  font-size: 28px;
  color: #22c55e;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .point-header {
    flex-direction: column;
  }

  .point-badges {
    align-self: flex-start;
  }

  .point-action {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}
</style>
