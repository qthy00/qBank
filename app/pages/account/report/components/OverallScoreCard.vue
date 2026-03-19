<script setup lang="ts">
/**
 * 综合评分卡片组件 - 清爽简洁风格
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
  if (score >= 90) return { level: '卓越', color: '#22c55e', bgColor: '#dcfce7', icon: 'ep:trophy', desc: '您的学习表现堪称典范' }
  if (score >= 80) return { level: '优秀', color: '#3b82f6', bgColor: '#dbeafe', icon: 'ep:medal', desc: '扎实的学习基础，继续保持' }
  if (score >= 60) return { level: '良好', color: '#f59e0b', bgColor: '#fef3c7', icon: 'ep:star', desc: '有进步空间，加油努力' }
  return { level: '待提升', color: '#ef4444', bgColor: '#fee2e2', icon: 'ep:trend-charts', desc: '建议加强基础知识学习' }
}

/* 计算圆周长 */
const circumference = 2 * Math.PI * 90
const strokeDashoffset = computed(() => {
  return circumference - (props.score / 100) * circumference
})

const scoreInfo = computed(() => getScoreLevel(props.score))
</script>

<template>
  <el-card class="score-card" shadow="never">
    <div class="score-content">
      <!-- 左侧：环形进度 -->
      <div class="score-visual">
        <div class="score-ring-container">
          <!-- SVG 环形进度 -->
          <svg class="score-ring" viewBox="0 0 200 200">
            <!-- 背景圆环 -->
            <circle
              class="ring-track"
              cx="100"
              cy="100"
              r="90"
              fill="none"
            />
            <!-- 进度圆环 -->
            <circle
              class="ring-progress"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              :style="{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                stroke: scoreInfo.color
              }"
            />
          </svg>

          <!-- 中心内容 -->
          <div class="ring-center">
            <span class="score-number" :style="{ color: scoreInfo.color }">{{ score }}</span>
            <span class="score-unit">分</span>
          </div>
        </div>

        <!-- 等级标签 -->
        <div class="level-badge" :style="{ backgroundColor: scoreInfo.bgColor, color: scoreInfo.color }">
          <Icon :name="scoreInfo.icon" class="badge-icon" />
          <span class="badge-text">{{ scoreInfo.level }}</span>
        </div>
      </div>

      <!-- 右侧：详细信息 -->
      <div class="score-details">
        <div class="detail-header">
          <h3 class="detail-title">综合评估得分</h3>
          <div class="update-badge">
            <Icon name="ep:clock" class="update-icon" />
            <span>{{ formatTime(updateTime) }}</span>
          </div>
        </div>

        <p class="detail-desc">{{ scoreInfo.desc }}</p>

        <!-- 评分维度 -->
        <div class="score-dimensions">
          <div class="dimension-item">
            <div class="dim-icon-wrapper" style="background: #dbeafe;">
              <Icon name="ep:document-checked" style="color: #3b82f6;" />
            </div>
            <div class="dim-info">
              <span class="dim-label">做题数量</span>
              <span class="dim-value">1,248<span class="dim-unit">题</span></span>
            </div>
          </div>

          <div class="dimension-item">
            <div class="dim-icon-wrapper" style="background: #f3e8ff;">
              <Icon name="ep:circle-check" style="color: #8b5cf6;" />
            </div>
            <div class="dim-info">
              <span class="dim-label">平均正确率</span>
              <span class="dim-value">76.5<span class="dim-unit">%</span></span>
            </div>
          </div>

          <div class="dimension-item">
            <div class="dim-icon-wrapper" style="background: #fef3c7;">
              <Icon name="ep:timer" style="color: #f59e0b;" />
            </div>
            <div class="dim-info">
              <span class="dim-label">学习时长</span>
              <span class="dim-value">42.5<span class="dim-unit">小时</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.score-card {
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 32px;
  }
}

/* 主内容 */
.score-content {
  display: flex;
  align-items: center;
  gap: 48px;
}

/* 左侧视觉区 */
.score-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.score-ring-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.score-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-track {
  stroke: var(--el-fill-color-darker);
  stroke-width: 12;
}

.ring-progress {
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-number {
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
}

.score-unit {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin-left: 4px;
}

.level-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
}

.badge-icon {
  font-size: 16px;
}

/* 右侧详情区 */
.score-details {
  flex: 1;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.detail-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.update-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--el-fill-color-light);
  border-radius: 20px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.update-icon {
  font-size: 12px;
}

.detail-desc {
  font-size: 15px;
  color: var(--el-text-color-regular);
  margin-bottom: 32px;
}

/* 评分维度 */
.score-dimensions {
  display: flex;
  gap: 32px;
}

.dimension-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dim-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 22px;
}

.dim-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dim-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.dim-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.dim-unit {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-left: 2px;
}

/* 响应式 */
@media (max-width: 768px) {
  .score-card {
    :deep(.el-card__body) {
      padding: 24px;
    }
  }

  .score-content {
    flex-direction: column;
    gap: 24px;
  }

  .score-ring-container {
    width: 160px;
    height: 160px;
  }

  .score-number {
    font-size: 42px;
  }

  .detail-title {
    font-size: 20px;
  }

  .score-dimensions {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
