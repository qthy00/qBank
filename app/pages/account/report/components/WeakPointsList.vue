<script setup lang="ts">
import type { WeakPointVO } from '~/types/statistics'

/**
 * 薄弱知识点列表组件
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
  if (priority >= 3) return '#eab308'
  if (priority >= 2) return '#3b82f6'
  return '#6b7280'
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
    <div class="section-header">
      <h3 class="section-title">
        <Icon name="ep:warning" class="title-icon" />
        薄弱知识点
        <el-tag size="small" type="danger" class="count-tag">
          {{ data.length }}个
        </el-tag>
      </h3>
    </div>

    <div class="points-list">
      <div
        v-for="(point, index) in data"
        :key="point.id"
        class="point-item"
        :class="{ 'high-priority': point.priority >= 4 }"
      >
        <div class="point-rank">{{ index + 1 }}</div>
        <div class="point-content">
          <div class="point-header">
            <div class="point-info">
              <span class="point-name">{{ point.name }}</span>
              <span class="point-subject">{{ point.subjectName }}</span>
            </div>
            <div class="point-badges">
              <el-tag
                size="small"
                :style="{ backgroundColor: getPriorityColor(point.priority) + '20', color: getPriorityColor(point.priority), borderColor: getPriorityColor(point.priority) + '40' }"
              >
                {{ getPriorityLabel(point.priority) }}
              </el-tag>
              <span :class="['accuracy-text', getAccuracyColorClass(point.accuracy)]">
                {{ point.accuracy }}%
              </span>
            </div>
          </div>
          <p class="point-reason">{{ point.reason }}</p>
          <div class="point-action">
            <span class="recommend-count">
              推荐练习 {{ point.recommendCount }} 题
            </span>
            <el-button
              type="primary"
              size="small"
              @click="goPractice(point)"
            >
              <Icon name="ep:edit" class="btn-icon" />
              去练习
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="data.length === 0"
      description="暂无薄弱知识点"
      :image-size="80"
    >
      <p class="empty-tip">您的知识点掌握情况良好，继续保持！</p>
    </el-empty>
  </div>
</template>

<style scoped lang="scss">
.weak-points {
  .section-header {
    margin-bottom: 20px;

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      display: flex;
      align-items: center;
      gap: 8px;

      .title-icon {
        color: #ef4444;
      }

      .count-tag {
        margin-left: 8px;
      }
    }
  }

  .points-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;

    .point-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      background: var(--el-fill-color-light);
      transition: all 0.3s;

      &.high-priority {
        background: #fef2f2;
        border: 1px solid #fecaca;
      }

      &:hover {
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .point-rank {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--el-color-primary);
        color: white;
        font-size: 14px;
        font-weight: 600;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .point-content {
        flex: 1;
        min-width: 0;

        .point-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;

          .point-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .point-name {
              font-size: 15px;
              font-weight: 500;
              color: var(--el-text-color-primary);
            }

            .point-subject {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }

          .point-badges {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;

            .accuracy-text {
              font-size: 16px;
              font-weight: 600;
            }
          }
        }

        .point-reason {
          font-size: 13px;
          color: var(--el-text-color-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .point-action {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .recommend-count {
            font-size: 13px;
            color: var(--el-text-color-secondary);
          }

          .btn-icon {
            margin-right: 4px;
          }
        }
      }
    }
  }

  .empty-tip {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    text-align: center;
    margin-top: 8px;
  }
}

@media (max-width: 768px) {
  .weak-points {
    .points-list {
      max-height: 300px;

      .point-item {
        .point-content {
          .point-header {
            flex-direction: column;

            .point-badges {
              align-self: flex-start;
            }
          }

          .point-action {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }
      }
    }
  }
}
</style>
