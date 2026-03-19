<script setup lang="ts">
import { useStudyStatistics } from '~/composables/useStudyStatistics'

/**
 * 学习热力图组件
 */
const { heatmap } = useStudyStatistics()

/**
 * 获取最近53周的数据（用于展示一年的热力图）
 */
const heatmapData = computed(() => {
  if (!heatmap.value || heatmap.value.length === 0) {
    return generateEmptyHeatmap()
  }
  return heatmap.value.slice(-371) /* 最多371天（53周）的数据 */
})

/**
 * 生成空的热力图数据
 */
const generateEmptyHeatmap = () => {
  const data = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      duration: 0,
      questionCount: 0,
    })
  }
  return data
}

/**
 * 按周分组数据
 */
const weeksData = computed(() => {
  const weeks: Array<Array<{ date: string; duration: number; questionCount: number }>> = []
  const data = heatmapData.value

  /* 计算从哪个星期开始 */
  const firstDate = new Date(data[0]?.date || new Date())
  const firstDayOfWeek = firstDate.getDay()

  /* 补齐第一周前面的空白天数 */
  const firstWeek: Array<{ date: string; duration: number; questionCount: number } | null> = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    firstWeek.push(null)
  }

  /* 填充数据 */
  let currentWeek: Array<{ date: string; duration: number; questionCount: number } | null> = [...firstWeek]

  data.forEach((item) => {
    const date = new Date(item.date)
    const dayOfWeek = date.getDay()

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek as Array<{ date: string; duration: number; questionCount: number }>)
      currentWeek = []
    }

    currentWeek.push(item)
  })

  /* 添加最后一周 */
  if (currentWeek.length > 0) {
    /* 补齐最后一周后面的空白天数 */
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek as Array<{ date: string; duration: number; questionCount: number }>)
  }

  return weeks
})

/**
 * 星期标签
 */
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

/**
 * 月份标签
 */
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

/**
 * 获取月份标记
 */
const getMonthLabels = computed(() => {
  const labels: Array<{ index: number; month: string }> = []
  const data = heatmapData.value

  if (data.length === 0) return labels

  let currentMonth = -1
  data.forEach((item, index) => {
    const date = new Date(item.date)
    const month = date.getMonth()
    if (month !== currentMonth) {
      currentMonth = month
      /* 计算周索引 */
      const firstDate = new Date(data[0].date)
      const daysDiff = Math.floor((date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
      const weekIndex = Math.floor((daysDiff + firstDate.getDay()) / 7)
      labels.push({ index: weekIndex, month: months[month] })
    }
  })

  return labels
})

/**
 * 获取单元格颜色
 */
const getCellColor = (duration: number): string => {
  if (duration === 0) return '#ebedf0'
  if (duration < 30) return '#9be9a8'
  if (duration < 60) return '#40c463'
  if (duration < 120) return '#30a14e'
  return '#216e39'
}

/**
 * 获取单元格提示信息
 */
const getCellTooltip = (item: { date: string; duration: number; questionCount: number } | null): string => {
  if (!item) return ''
  const date = new Date(item.date)
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  if (item.duration === 0) return `${dateStr}\n未学习`
  return `${dateStr}\n学习时长: ${Math.floor(item.duration / 60)}小时${item.duration % 60}分钟\n做题数量: ${item.questionCount}道`
}

/**
 * 统计数据
 */
const statistics = computed(() => {
  const data = heatmapData.value
  const totalDays = data.length
  const studyDays = data.filter((item) => item.duration > 0).length
  const totalDuration = data.reduce((sum, item) => sum + item.duration, 0)
  const totalQuestions = data.reduce((sum, item) => sum + item.questionCount, 0)

  return {
    totalDays,
    studyDays,
    totalDuration,
    totalQuestions,
    studyRate: totalDays > 0 ? Math.round((studyDays / totalDays) * 100) : 0,
  }
})
</script>

<template>
  <el-card class="study-heatmap" shadow="never">
    <template #header>
      <div class="heatmap-header">
        <h3 class="chart-title">
          <Icon name="material-symbols:calendar-heatmap" class="title-icon" />
          学习热力图
        </h3>
        <div class="heatmap-stats">
          <span class="stat-item">
            学习天数：<strong>{{ statistics.studyDays }}</strong>
          </span>
          <span class="stat-item">
            学习率：<strong>{{ statistics.studyRate }}%</strong>
          </span>
        </div>
      </div>
    </template>

    <div class="heatmap-content">
      <!-- 月份标签 -->
      <div class="month-labels">
        <div
          v-for="label in getMonthLabels"
          :key="label.index"
          class="month-label"
          :style="{ left: `${(label.index / weeksData.length) * 100}%` }"
        >
          {{ label.month }}
        </div>
      </div>

      <!-- 热力图主体 -->
      <div class="heatmap-body">
        <!-- 星期标签 -->
        <div class="weekday-labels">
          <div v-for="day in weekDays" :key="day" class="weekday-label">
            {{ day }}
          </div>
        </div>

        <!-- 热力图网格 -->
        <div class="heatmap-grid">
          <div
            v-for="(week, weekIndex) in weeksData"
            :key="weekIndex"
            class="heatmap-week"
          >
            <div
              v-for="(day, dayIndex) in week"
              :key="`${weekIndex}-${dayIndex}`"
              class="heatmap-cell"
              :class="{ 'has-data': day && day.duration > 0 }"
              :style="{
                backgroundColor: day ? getCellColor(day.duration) : '#ebedf0',
              }"
              :title="getCellTooltip(day)"
            ></div>
          </div>
        </div>
      </div>

      <!-- 图例 -->
      <div class="heatmap-legend">
        <span class="legend-label">少</span>
        <div class="legend-cells">
          <div class="legend-cell" style="background-color: #ebedf0" title="未学习"></div>
          <div class="legend-cell" style="background-color: #9be9a8" title="1-30分钟"></div>
          <div class="legend-cell" style="background-color: #40c463" title="30-60分钟"></div>
          <div class="legend-cell" style="background-color: #30a14e" title="60-120分钟"></div>
          <div class="legend-cell" style="background-color: #216e39" title="120分钟以上"></div>
        </div>
        <span class="legend-label">多</span>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.study-heatmap {
  border-radius: 12px;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-title {
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

.heatmap-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  font-size: 13px;
  color: var(--el-text-color-secondary);

  strong {
    color: var(--el-text-color-primary);
    font-weight: 600;
  }
}

.heatmap-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.month-labels {
  position: relative;
  height: 20px;
  margin-left: 32px;
}

.month-label {
  position: absolute;
  font-size: 11px;
  color: var(--el-text-color-secondary);
  transform: translateX(-50%);
}

.heatmap-body {
  display: flex;
  gap: 8px;
}

.weekday-labels {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.weekday-label {
  width: 24px;
  height: 12px;
  font-size: 10px;
  color: var(--el-text-color-secondary);
  text-align: center;
  line-height: 12px;
}

.heatmap-grid {
  display: flex;
  gap: 4px;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color);
    border-radius: 2px;
  }
}

.heatmap-week {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.3);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.legend-label {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.legend-cells {
  display: flex;
  gap: 4px;
}

.legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .study-heatmap {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .heatmap-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .heatmap-cell {
    width: 10px;
    height: 10px;
  }

  .weekday-label {
    width: 20px;
    font-size: 9px;
  }

  .month-labels {
    margin-left: 28px;
  }

  .legend-cell {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 480px) {
  .heatmap-cell {
    width: 8px;
    height: 8px;
  }

  .heatmap-grid {
    gap: 2px;
  }

  .heatmap-week {
    gap: 2px;
  }

  .legend-cell {
    width: 8px;
    height: 8px;
  }
}
</style>
