<script setup lang="ts">
import type { StudySuggestionVO } from '~/types/statistics'

/**
 * 学习建议组件
 */
interface Props {
  /* 学习建议数据 */
  data: StudySuggestionVO[]
}

const props = defineProps<Props>()

/* 获取建议类型标签 */
const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    strength: '优势',
    weakness: '薄弱',
    habit: '习惯',
    goal: '目标',
  }
  return labels[type] || '建议'
}

/* 获取建议类型颜色 */
const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    strength: '#22c55e',
    weakness: '#ef4444',
    habit: '#3b82f6',
    goal: '#8b5cf6',
  }
  return colors[type] || '#6b7280'
}

/* 获取建议图标 */
const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    strength: 'ep:trophy',
    weakness: 'ep:warning',
    habit: 'ep:calendar',
    goal: 'ep:flag',
  }
  return icons[type] || 'ep:info'
}

/* 按优先级排序 */
const sortedSuggestions = computed(() => {
  return [...props.data].sort((a, b) => b.priority - a.priority)
})
</script>

<template>
  <div class="study-suggestions">
    <div class="section-header">
      <h3 class="section-title">
        <Icon name="ep:lightbulb" class="title-icon" />
        学习建议
        <el-tag size="small" type="warning" class="count-tag">
          {{ data.length }}条
        </el-tag>
      </h3>
    </div>

    <div class="suggestions-list">
      <div
        v-for="suggestion in sortedSuggestions"
        :key="suggestion.title"
        class="suggestion-item"
        :class="suggestion.type"
      >
        <div class="suggestion-icon" :style="{ backgroundColor: getTypeColor(suggestion.type) + '20' }">
          <Icon
            :name="getTypeIcon(suggestion.type)"
            :style="{ color: getTypeColor(suggestion.type) }"
          />
        </div>
        <div class="suggestion-content">
          <div class="suggestion-header">
            <span class="suggestion-title">{{ suggestion.title }}</span>
            <el-tag
              size="small"
              :style="{ backgroundColor: getTypeColor(suggestion.type) + '20', color: getTypeColor(suggestion.type), borderColor: getTypeColor(suggestion.type) + '40' }"
            >
              {{ getTypeLabel(suggestion.type) }}
            </el-tag>
          </div>
          <p class="suggestion-text">{{ suggestion.content }}</p>
          <p v-if="suggestion.data" class="suggestion-data">
            <Icon name="ep:data-analysis" class="data-icon" />
            {{ suggestion.data }}
          </p>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="data.length === 0"
      description="暂无学习建议"
      :image-size="80"
    >
      <p class="empty-tip">继续学习后，系统将为您生成个性化建议</p>
    </el-empty>
  </div>
</template>

<style scoped lang="scss">
.study-suggestions {
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
        color: #eab308;
      }

      .count-tag {
        margin-left: 8px;
      }
    }
  }

  .suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 400px;
    overflow-y: auto;

    .suggestion-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      background: var(--el-fill-color-light);
      transition: all 0.3s;

      &:hover {
        background: var(--el-fill-color);
        transform: translateX(4px);
      }

      &.strength {
        border-left: 3px solid #22c55e;
      }

      &.weakness {
        border-left: 3px solid #ef4444;
      }

      &.habit {
        border-left: 3px solid #3b82f6;
      }

      &.goal {
        border-left: 3px solid #8b5cf6;
      }

      .suggestion-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        flex-shrink: 0;

        svg {
          width: 20px;
          height: 20px;
        }
      }

      .suggestion-content {
        flex: 1;
        min-width: 0;

        .suggestion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;

          .suggestion-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }
        }

        .suggestion-text {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .suggestion-data {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          padding: 6px 10px;
          border-radius: 4px;

          .data-icon {
            font-size: 14px;
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
  .study-suggestions {
    .suggestions-list {
      max-height: 300px;
    }
  }
}
</style>
