<script setup lang="ts">
import type { StudyRecordVO } from '~/types/statistics'

/**
 * 学习记录列表组件
 */
interface Props {
  records: StudyRecordVO[]
  total: number
  page: number
  limit: number
  loading: boolean
}

const _props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
}>()

/**
 * 格式化日期
 */
const _formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * 格式化时长
 */
const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}小时`
  return `${hours}小时${mins}分钟`
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
 * 获取正确率标签
 */
const getAccuracyLabel = (accuracy: number): string => {
  if (accuracy >= 80) return '优秀'
  if (accuracy >= 60) return '良好'
  if (accuracy >= 40) return '一般'
  return '需加强'
}

/**
 * 处理页码变化
 */
const handlePageChange = (page: number) => {
  emit('pageChange', page)
}
</script>

<template>
  <div class="study-records">
    <!-- 头部 -->
    <div class="records-header">
      <h3 class="records-title">
        <Icon name="material-symbols:history" class="title-icon" />
        学习记录
      </h3>
      <span class="records-count">共 {{ total }} 条记录</span>
    </div>

    <!-- 记录列表 -->
    <div v-loading="loading" class="records-list">
      <el-empty v-if="records.length === 0" description="暂无学习记录" />

      <div v-else class="record-items">
        <div
          v-for="record in records"
          :key="record.id"
          class="record-item"
        >
          <!-- 日期标识 -->
          <div class="record-date">
            <div class="date-day">{{ new Date(record.date).getDate() }}</div>
            <div class="date-month">
              {{ new Date(record.date).getMonth() + 1 }}月
            </div>
          </div>

          <!-- 记录内容 -->
          <div class="record-content">
            <div class="content-main">
              <div class="content-title">{{ record.content }}</div>
              <div class="content-subjects">
                <el-tag
                  v-for="subject in record.subjects"
                  :key="subject"
                  size="small"
                  type="info"
                  class="subject-tag"
                >
                  {{ subject }}
                </el-tag>
              </div>
            </div>

            <div class="content-stats">
              <div class="stat-item">
                <Icon name="material-symbols:timer" class="stat-icon" />
                <span>{{ formatDuration(record.duration) }}</span>
              </div>
              <div class="stat-item">
                <Icon name="material-symbols:quiz" class="stat-icon" />
                <span>{{ record.questionCount }}题</span>
              </div>
              <div class="stat-item">
                <Icon name="material-symbols:check-circle" class="stat-icon" />
                <span>{{ record.correctCount }}对</span>
              </div>
            </div>
          </div>

          <!-- 正确率 -->
          <div class="record-accuracy">
            <div
              class="accuracy-ring"
              :style="{
                background: `conic-gradient(${getAccuracyColor(record.accuracy)} ${record.accuracy * 3.6}deg, #e5e7eb ${record.accuracy * 3.6}deg)`,
              }"
            >
              <div class="accuracy-inner">
                <span class="accuracy-value">{{ record.accuracy }}%</span>
              </div>
            </div>
            <span
              class="accuracy-label"
              :style="{ color: getAccuracyColor(record.accuracy) }"
            >
              {{ getAccuracyLabel(record.accuracy) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="total > 0" class="records-pagination">
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        layout="prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.study-records {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.records-title {
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

.records-count {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.records-list {
  min-height: 200px;
}

.record-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: var(--el-fill-color);
    transform: translateX(4px);
  }
}

.record-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--el-color-primary);
  border-radius: 8px;
  color: white;

  .date-day {
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
  }

  .date-month {
    font-size: 11px;
    margin-top: 2px;
    opacity: 0.9;
  }
}

.record-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.content-main {
  flex: 1;
}

.content-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.content-subjects {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.subject-tag {
  font-size: 11px;
}

.content-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);

  .stat-icon {
    font-size: 16px;
  }
}

.record-accuracy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.accuracy-ring {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accuracy-inner {
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accuracy-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.accuracy-label {
  font-size: 11px;
  font-weight: 500;
}

.records-pagination {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
}

@media (max-width: 768px) {
  .record-item {
    flex-wrap: wrap;
    gap: 12px;
  }

  .record-content {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    order: 2;
  }

  .content-stats {
    width: 100%;
    justify-content: space-between;
  }

  .record-accuracy {
    order: 1;
    margin-left: auto;
  }

  .record-date {
    width: 48px;
    height: 48px;

    .date-day {
      font-size: 16px;
    }
  }
}

@media (max-width: 480px) {
  .stat-item {
    font-size: 12px;
  }
}
</style>
