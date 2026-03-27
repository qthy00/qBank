<script setup lang="ts">
import type { StudySuggestionVO } from '~/types/statistics'

/**
 * 学习建议组件 - 清爽简洁风格
 */
interface Props {
  /* 学习建议数据 */
  data: StudySuggestionVO[]
}

const props = defineProps<Props>()

/* 获取建议类型配置 */
const getTypeConfig = (type: string) => {
  const configs: Record<string, { label: string; icon: string; color: string; bgColor: string }> = {
    strength: {
      label: '优势',
      icon: 'ep:trophy',
      color: '#22c55e',
      bgColor: '#dcfce7'
    },
    weakness: {
      label: '提升',
      icon: 'ep:warning',
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    habit: {
      label: '习惯',
      icon: 'ep:calendar',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    goal: {
      label: '目标',
      icon: 'ep:flag',
      color: '#8b5cf6',
      bgColor: '#f3e8ff'
    },
  }
  return configs[type] || configs.habit
}

/* 按优先级排序 */
const sortedSuggestions = computed(() => {
  return [...props.data].sort((a, b) => b.priority - a.priority)
})
</script>

<template>
  <div class="study-suggestions">
    <!-- 标题区 -->
    <div class="section-header">
      <div class="title-section">
        <div class="title-icon-wrapper">
          <Icon name="ep:lightbulb" class="title-icon" />
        </div>
        <div class="title-text">
          <h3 class="section-title">学习建议</h3>
          <span class="section-subtitle">AI智能分析个性化建议</span>
        </div>
      </div>
      <el-tag type="warning" effect="light">{{ data.length }}条</el-tag>
    </div>

    <!-- 建议列表 -->
    <div v-if="data.length > 0" class="suggestions-list">
      <div
        v-for="(suggestion, index) in sortedSuggestions"
        :key="suggestion.title"
        class="suggestion-item"
        :style="{ borderLeftColor: getTypeConfig(suggestion.type).color }"
      >
        <!-- 类型图标 -->
        <div
          class="type-icon"
          :style="{ background: getTypeConfig(suggestion.type).bgColor, color: getTypeConfig(suggestion.type).color }"
        >
          <Icon :name="getTypeConfig(suggestion.type).icon" />
        </div>

        <!-- 内容 -->
        <div class="suggestion-content">
          <div class="content-header">
            <h4 class="suggestion-title">{{ suggestion.title }}</h4>
            <el-tag
              size="small"
              effect="light"
              :style="{ color: getTypeConfig(suggestion.type).color, backgroundColor: getTypeConfig(suggestion.type).bgColor, border: 'none' }"
            >
              {{ getTypeConfig(suggestion.type).label }}
            </el-tag>
          </div>

          <p class="suggestion-text">{{ suggestion.content }}</p>

          <div v-if="suggestion.data" class="data-pill">
            <Icon name="ep:data-analysis" />
            <span>{{ suggestion.data }}</span>
          </div>
        </div>

        <!-- 优先级 -->
        <div class="priority-dots">
          <span
            v-for="n in 5"
            :key="n"
            class="dot"
            :class="{ active: n <= suggestion.priority }"
            :style="{ backgroundColor: n <= suggestion.priority ? getTypeConfig(suggestion.type).color : '#e5e7eb' }"
          />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <Icon name="ep:loading" />
      </div>
      <h4 class="empty-title">分析中...</h4>
      <p class="empty-desc">系统正在根据您的学习数据生成建议</p>
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
  background: #fef3c7;
  border-radius: 10px;
  font-size: 20px;
  color: #f59e0b;
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

/* 建议列表 */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-left: 3px solid;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--el-fill-color);
  }
}

.type-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 18px;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.suggestion-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.suggestion-text {
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 12px;
}

.data-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--el-color-primary-light-9);
  border-radius: 20px;
  font-size: 12px;
  color: var(--el-color-primary);

  svg {
    font-size: 14px;
  }
}

/* 优先级点 */
.priority-dots {
  display: flex;
  gap: 4px;
  padding-top: 4px;
  flex-shrink: 0;
}

.dot {
  width: 6px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 50%;
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
  background: #dbeafe;
  border-radius: 50%;
  font-size: 28px;
  color: #3b82f6;
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
  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .priority-dots {
    display: none;
  }
}
</style>
