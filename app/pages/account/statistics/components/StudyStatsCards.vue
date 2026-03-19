<script setup lang="ts">
import type { StudyStatsOverviewVO } from '~/types/statistics'

/**
 * 学习统计卡片组件
 */
interface Props {
  overview: StudyStatsOverviewVO | null
  avgDailyDuration: number
  formatDuration: (minutes: number) => string
  formatNumber: (num: number) => string
}

const props = defineProps<Props>()

/**
 * 统计卡片数据配置
 */
const statCards = computed(() => [
  {
    key: 'duration',
    title: '今日学习',
    value: props.overview?.duration.today || 0,
    unit: '分钟',
    icon: 'material-symbols:timer',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    trend: '+12%',
    trendUp: true,
  },
  {
    key: 'questions',
    title: '今日做题',
    value: props.overview?.questionCount.today || 0,
    unit: '道',
    icon: 'material-symbols:assignment',
    color: '#22c55e',
    bgGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    trend: '+8%',
    trendUp: true,
  },
  {
    key: 'accuracy',
    title: '平均正确率',
    value: props.overview?.avgAccuracy || 0,
    unit: '%',
    icon: 'material-symbols:trending-up',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    trend: '+5%',
    trendUp: true,
    isPercentage: true,
  },
  {
    key: 'streak',
    title: '连续学习',
    value: props.overview?.streakDays || 0,
    unit: '天',
    icon: 'material-symbols:local-fire-department',
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    trend: props.overview?.studiedToday ? '今日已学' : '今日未学',
    trendUp: props.overview?.studiedToday,
  },
])

/**
 * 详细统计数据
 */
const detailStats = computed(() => [
  {
    label: '本周学习',
    value: props.formatDuration(props.overview?.duration.thisWeek || 0),
    icon: 'material-symbols:calendar-week',
  },
  {
    label: '本月学习',
    value: props.formatDuration(props.overview?.duration.thisMonth || 0),
    icon: 'material-symbols:calendar-month',
  },
  {
    label: '总学习时长',
    value: props.formatDuration(props.overview?.duration.total || 0),
    icon: 'material-symbols:schedule',
  },
  {
    label: '日均学习',
    value: props.formatDuration(props.avgDailyDuration),
    icon: 'material-symbols:avg-time',
  },
  {
    label: '总做题数',
    value: props.formatNumber(props.overview?.questionCount.total || 0) + '道',
    icon: 'material-symbols:quiz',
  },
  {
    label: '正确率',
    value: `${Math.round(
      ((props.overview?.questionCount.correct || 0) /
        Math.max(1, props.overview?.questionCount.total || 1)) *
        100
    )}%`,
    icon: 'material-symbols:check-circle',
  },
])
</script>

<template>
  <div class="stats-cards">
    <!-- 主要统计卡片 -->
    <div class="main-cards">
      <div
        v-for="card in statCards"
        :key="card.key"
        class="stat-card"
        :style="{ background: card.bgGradient }"
      >
        <div class="card-content">
          <div class="card-header">
            <Icon :name="card.icon" class="card-icon" />
            <div
              class="trend-badge"
              :class="{ 'trend-up': card.trendUp, 'trend-down': !card.trendUp }"
            >
              {{ card.trend }}
            </div>
          </div>
          <div class="card-body">
            <div class="card-value">
              {{ card.isPercentage ? card.value : formatNumber(card.value) }}
              <span class="card-unit">{{ card.unit }}</span>
            </div>
            <div class="card-title">{{ card.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细统计数据 -->
    <el-card class="detail-stats" shadow="never">
      <template #header>
        <div class="detail-header">
          <Icon name="material-symbols:bar-chart" class="header-icon" />
          <span>学习数据概览</span>
        </div>
      </template>
      <div class="detail-grid">
        <div v-for="item in detailStats" :key="item.label" class="detail-item">
          <Icon :name="item.icon" class="detail-icon" />
          <div class="detail-info">
            <div class="detail-value">{{ item.value }}</div>
            <div class="detail-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.stats-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  border-radius: 12px;
  padding: 20px;
  color: white;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-icon {
  font-size: 28px;
  opacity: 0.9;
}

.trend-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  &.trend-up {
    background: rgba(34, 197, 94, 0.3);
  }

  &.trend-down {
    background: rgba(239, 68, 68, 0.3);
  }
}

.card-body {
  margin-top: 8px;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 6px;

  .card-unit {
    font-size: 14px;
    font-weight: 400;
    opacity: 0.8;
    margin-left: 4px;
  }
}

.card-title {
  font-size: 14px;
  opacity: 0.9;
}

.detail-stats {
  border-radius: 12px;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--el-text-color-primary);

  .header-icon {
    font-size: 20px;
    color: var(--el-color-primary);
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: var(--el-fill-color);
  }
}

.detail-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.detail-info {
  flex: 1;
}

.detail-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.detail-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

@media (max-width: 1024px) {
  .main-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .main-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
  }

  .card-value {
    font-size: 24px;
  }

  .card-title {
    font-size: 12px;
  }

  .card-icon {
    font-size: 22px;
  }

  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .detail-item {
    padding: 12px;
  }

  .detail-icon {
    font-size: 20px;
  }

  .detail-value {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .main-cards {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
