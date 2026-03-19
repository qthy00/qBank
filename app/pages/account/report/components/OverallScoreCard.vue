<script setup lang="ts">
/**
 * 综合评分卡片组件
 */
interface Props {
  /* 综合评分（0-100）*/
  score: number
  /* 数据更新时间 */
  updateTime: string
}

const props = defineProps<Props>()

/* 格式化时间 */
const formatTime = (time: string) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* 获取评分等级 */
const getScoreLevel = (score: number) => {
  if (score >= 90) return { level: '优秀', color: '#22c55e', icon: 'Trophy' }
  if (score >= 80) return { level: '良好', color: '#3b82f6', icon: 'Medal' }
  if (score >= 60) return { level: '及格', color: '#eab308', icon: 'Star' }
  return { level: '需努力', color: '#ef4444', icon: 'Warning' }
}

/* 获取进度条颜色 */
const getProgressColor = (score: number) => {
  if (score >= 90) return '#22c55e'
  if (score >= 80) return '#3b82f6'
  if (score >= 60) return '#eab308'
  return '#ef4444'
}

const scoreInfo = computed(() => getScoreLevel(props.score))
</script>

<template>
  <div class="score-card">
    <div class="score-main">
      <div class="score-circle">
        <el-progress
          type="dashboard"
          :percentage="score"
          :color="getProgressColor(score)"
          :stroke-width="12"
          :width="160"
        />
        <div class="score-value">
          <span class="score-number">{{ score }}</span>
          <span class="score-unit">分</span>
        </div>
      </div>
      <div class="score-info">
        <div class="score-level" :style="{ color: scoreInfo.color }">
          <Icon :name="`ep:${scoreInfo.icon.toLowerCase()}`" class="level-icon" />
          <span>{{ scoreInfo.level }}</span>
        </div>
        <p class="score-desc">
          综合评分基于您的做题数量、正确率、学习时长等多维度数据计算得出
        </p>
        <p class="update-time">
          <Icon name="ep:clock" class="time-icon" />
          数据更新于：{{ formatTime(updateTime) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.score-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.score-main {
  display: flex;
  align-items: center;
  gap: 48px;
}

.score-circle {
  position: relative;
  flex-shrink: 0;

  .score-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .score-number {
      font-size: 48px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      line-height: 1;
    }

    .score-unit {
      font-size: 16px;
      color: var(--el-text-color-secondary);
      margin-left: 4px;
    }
  }
}

.score-info {
  flex: 1;

  .score-level {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;

    .level-icon {
      font-size: 28px;
    }
  }

  .score-desc {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .update-time {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--el-text-color-placeholder);

    .time-icon {
      font-size: 14px;
    }
  }
}

@media (max-width: 768px) {
  .score-card {
    padding: 24px;
  }

  .score-main {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .score-circle {
    .score-value {
      .score-number {
        font-size: 36px;
      }
    }
  }

  .score-info {
    .score-level {
      justify-content: center;
      font-size: 20px;

      .level-icon {
        font-size: 24px;
      }
    }
  }
}
</style>
