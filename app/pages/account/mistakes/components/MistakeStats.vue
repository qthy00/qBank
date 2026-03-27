<script setup lang="ts">
import type { MistakeStatsVO } from '~/types/mistake'

/**
 * 错题统计卡片组件
 */
interface Props {
  stats: MistakeStatsVO | null
}

const _props = defineProps<Props>()

// 声明emits
const _emit = defineEmits<{
  (e: 'retry-all'): void
}>()

// 计算掌握率
const masteryRate = computed(() => {
  if (!_props.stats || _props.stats.totalCount === 0) return 0
  return Math.round((_props.stats.masteredCount / _props.stats.totalCount) * 100)
})
</script>

<template>
  <div class="mistake-stats">
    <!-- 主统计卡片 -->
    <div class="stats-grid">
      <!-- 总错题数 -->
      <div class="stat-card total">
        <div class="stat-icon">
          <Icon name="material-symbols:book-2" class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ _props.stats?.totalCount || 0 }}</div>
          <div class="stat-label">总错题数</div>
        </div>
      </div>

      <!-- 未掌握 -->
      <div class="stat-card unmastered">
        <div class="stat-icon">
          <Icon name="material-symbols:warning" class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ _props.stats?.unMasteredCount || 0 }}</div>
          <div class="stat-label">待复习</div>
        </div>
      </div>

      <!-- 已掌握 -->
      <div class="stat-card mastered">
        <div class="stat-icon">
          <Icon name="material-symbols:check-circle" class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ _props.stats?.masteredCount || 0 }}</div>
          <div class="stat-label">已掌握</div>
        </div>
      </div>

      <!-- 掌握率 -->
      <div class="stat-card rate">
        <div class="stat-icon">
          <Icon name="material-symbols:trending-up" class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ masteryRate }}%</div>
          <div class="stat-label">掌握率</div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <el-button
        type="primary"
        size="large"
        :disabled="!_props.stats || _props.stats.unMasteredCount === 0"
        @click="$emit('retry-all')"
      >
        <Icon name="material-symbols:refresh" class="btn-icon" />
        开始复习错题
      </el-button>

      <el-tag
        v-if="_props.stats?.todayCount"
        type="warning"
        effect="dark"
        class="today-tag"
      >
        今日新增 {{ _props.stats.todayCount }} 道错题
      </el-tag>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mistake-stats {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 24px;
    }
  }

  .stat-content {
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
  }
}

.quick-actions {
  display: flex;
  align-items: center;
  gap: 12px;

  .btn-icon {
    margin-right: 4px;
    font-size: 18px;
  }

  .today-tag {
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 20px;
  }
}

@media (max-width: 768px) {
  .mistake-stats {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 12px;

    .stat-icon {
      width: 40px;
      height: 40px;

      .icon {
        font-size: 20px;
      }
    }

    .stat-content {
      .stat-value {
        font-size: 22px;
      }

      .stat-label {
        font-size: 12px;
      }
    }
  }

  .quick-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
