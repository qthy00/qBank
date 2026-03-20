<script setup lang="ts">
import type { CheckinStatsVO, CheckinCalendarItem } from '~/types/checkin'
import {
  getTodayCheckinStatus,
  doCheckin,
  getCheckinCalendar
} from '~/api/checkin'
import { useMessage } from '~/composables/useMessage'

definePageMeta({
  layout: 'member'
})

useHead({
  title: '每日打卡'
})

const message = useMessage()

/* ==================== 状态管理 ==================== */
const stats = ref<CheckinStatsVO | null>(null)
const checkinLoading = ref(false)
const todayPoints = ref(0)
const calendarDate = ref(new Date())
const calendarData = ref<CheckinCalendarItem[]>([])

/* ==================== 方法 ==================== */

/**
 * 获取打卡状态
 */
const fetchCheckinStatus = async () => {
  try {
    const res = await getTodayCheckinStatus()
    stats.value = res
    if (res.todayCheckedIn && res.todayCheckinTime) {
      /* 已打卡，记录时间用于展示 */
    }
  } catch (error) {
    console.error('获取打卡状态失败:', error)
  }
}

/**
 * 执行打卡
 */
const handleCheckin = async () => {
  if (checkinLoading.value) return

  checkinLoading.value = true
  try {
    const res = await doCheckin()
    message.success(`打卡成功！连续打卡 ${res.continuousDays} 天`)
    todayPoints.value = res.earnedPoints
    stats.value = {
      ...stats.value,
      todayCheckedIn: true,
      continuousDays: res.continuousDays,
      totalDays: (stats.value?.totalDays || 0) + 1,
      monthDays: (stats.value?.monthDays || 0) + 1,
      yearDays: (stats.value?.yearDays || 0) + 1
    } as CheckinStatsVO
    /* 刷新日历数据 */
    await fetchCalendarData()
  } catch (error: any) {
    message.error(error?.message || '打卡失败，请稍后重试')
  } finally {
    checkinLoading.value = false
  }
}

/**
 * 获取日历数据
 */
const fetchCalendarData = async () => {
  try {
    const year = calendarDate.value.getFullYear()
    const month = calendarDate.value.getMonth() + 1
    const res = await getCheckinCalendar({ year, month })
    calendarData.value = res.calendarList || []
  } catch (error) {
    console.error('获取日历数据失败:', error)
  }
}

/**
 * 判断日期是否已打卡
 */
const isDateCheckedIn = (dateStr: string): boolean => {
  const item = calendarData.value.find(item => item.date === dateStr)
  return item?.checkedIn || false
}

/**
 * 判断是否是今天
 */
const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

/**
 * 获取打卡状态文本
 */
const getCheckinStatusText = computed(() => {
  if (stats.value?.todayCheckedIn) {
    return {
      title: '今日已打卡',
      subtitle: `已连续打卡 ${stats.value?.continuousDays || 0} 天，继续保持！`,
      icon: 'ep:check',
      type: 'success'
    }
  }
  return {
    title: '今日未打卡',
    subtitle: '点击按钮完成今日打卡',
    icon: 'ep:calendar',
    type: 'primary'
  }
})

/* ==================== 监听器 ==================== */
watch(calendarDate, () => {
  fetchCalendarData()
}, { immediate: true })

/* ==================== 生命周期 ==================== */
onMounted(() => {
  fetchCheckinStatus()
})
</script>

<template>
  <div class="checkin-page">
    <el-card shadow="never" class="checkin-card">
      <template #header>
        <div class="flex items-center justify-between">
          <CardTitle title="学习打卡" />
        </div>
      </template>

      <!-- 打卡状态区域 -->
      <div class="checkin-status-wrapper" :class="{ 'is-checked': stats?.todayCheckedIn }">
        <div class="status-main">
          <div class="status-icon-wrapper">
            <div class="status-icon" :class="{ 'checked': stats?.todayCheckedIn }">
              <Icon :name="getCheckinStatusText.icon" size="32" />
            </div>
          </div>
          <div class="status-content">
            <h2 class="status-title">{{ getCheckinStatusText.title }}</h2>
            <p class="status-desc">{{ getCheckinStatusText.subtitle }}</p>
          </div>
        </div>

        <!-- 打卡按钮 -->
        <div class="checkin-action">
          <el-button
            v-if="!stats?.todayCheckedIn"
            type="primary"
            size="large"
            :loading="checkinLoading"
            class="checkin-btn"
            @click="handleCheckin"
          >
            <Icon name="ep:check" class="mr-1" />
            立即打卡
          </el-button>
          <div v-else class="checked-in-tag">
            <Icon name="ep:success-filled" class="success-icon" />
            <span>打卡成功</span>
            <span v-if="todayPoints > 0" class="points-badge">+{{ todayPoints }} 积分</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 统计数据 -->
    <el-card shadow="never" class="mt-4 stats-card">
      <template #header>
        <CardTitle title="打卡统计" />
      </template>

      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon bg-blue-100 text-blue-500">
            <Icon name="ep:medal" size="20" />
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.continuousDays || 0 }}</div>
            <div class="stat-label">连续打卡(天)</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon bg-green-100 text-green-500">
            <Icon name="ep:trophy" size="20" />
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.totalDays || 0 }}</div>
            <div class="stat-label">累计打卡(天)</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon bg-orange-100 text-orange-500">
            <Icon name="ep:calendar" size="20" />
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.monthDays || 0 }}</div>
            <div class="stat-label">本月打卡(天)</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon bg-purple-100 text-purple-500">
            <Icon name="ep:star" size="20" />
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.yearDays || 0 }}</div>
            <div class="stat-label">本年打卡(天)</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 日历区域 -->
    <el-card shadow="never" class="mt-4 calendar-card">
      <template #header>
        <div class="flex items-center justify-between">
          <CardTitle title="打卡日历" />
          <div class="calendar-legend">
            <span class="legend-item">
              <span class="legend-dot checked"></span>
              <span>已打卡</span>
            </span>
            <span class="legend-item">
              <span class="legend-dot today"></span>
              <span>今天</span>
            </span>
            <span class="legend-item">
              <span class="legend-dot"></span>
              <span>未打卡</span>
            </span>
          </div>
        </div>
      </template>

      <el-calendar v-model="calendarDate" class="checkin-calendar">
        <template #date-cell="{ data }">
          <div
            class="calendar-cell"
            :class="{
              'is-checked': isDateCheckedIn(data.day),
              'is-today': isToday(data.day)
            }"
          >
            <span class="day-number">{{ data.day.split('-')[2] }}</span>
            <Icon
              v-if="isDateCheckedIn(data.day)"
              name="ep:check"
              class="check-icon"
              size="12"
            />
          </div>
        </template>
      </el-calendar>
    </el-card>

    <!-- 打卡规则 -->
    <el-card shadow="never" class="mt-4 rules-card">
      <template #header>
        <CardTitle title="打卡规则" />
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item>
          <template #label>
            <div class="flex items-center gap-2">
              <Icon name="ep:coin" class="text-yellow-500" />
              <span>基础积分</span>
            </div>
          </template>
          每日打卡可获得基础积分
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="flex items-center gap-2">
              <Icon name="ep:medal" class="text-orange-500" />
              <span>连续加成</span>
            </div>
          </template>
          连续打卡有额外积分加成
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="flex items-center gap-2">
              <Icon name="ep:document-checked" class="text-green-500" />
              <span>打卡记录</span>
            </div>
          </template>
          打卡记录以实际学习为准
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="flex items-center gap-2">
              <Icon name="ep:refresh" class="text-blue-500" />
              <span>补卡功能</span>
            </div>
          </template>
          支持补卡功能（每月限3次）
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.checkin-page {
  padding: 0;
}

/* 打卡状态区域 */
.checkin-status-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 32px;
  color: #fff;
  transition: all 0.3s ease;

  &.is-checked {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }
}

.status-main {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.status-icon-wrapper {
  .status-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &.checked {
      background: rgba(255, 255, 255, 0.9);
      color: #11998e;
    }
  }
}

.status-content {
  flex: 1;

  .status-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px;
  }

  .status-desc {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
  }
}

/* 打卡按钮 */
.checkin-action {
  text-align: center;

  .checkin-btn {
    min-width: 140px;
    height: 44px;
    font-size: 15px;
    border-radius: 22px;
    background: #fff;
    color: #667eea;
    border: none;

    &:hover {
      background: #f5f5f5;
      color: #667eea;
    }
  }

  .checked-in-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 22px;

    .success-icon {
      color: #fff;
      font-size: 18px;
    }

    .points-badge {
      background: rgba(255, 255, 255, 0.3);
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 13px;
    }
  }
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: var(--el-fill-color-light);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-info {
      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        line-height: 1.2;
      }

      .stat-label {
        font-size: 13px;
        color: var(--el-text-color-secondary);
        margin-top: 4px;
      }
    }
  }
}

/* 日历图例 */
.calendar-legend {
  display: flex;
  gap: 16px;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--el-text-color-secondary);

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--el-border-color);

      &.checked {
        background: #67c23a;
      }

      &.today {
        background: #409eff;
      }
    }
  }
}

/* 日历样式 */
.checkin-calendar {
  :deep(.el-calendar__header) {
    padding: 12px 0;
  }

  :deep(.el-calendar__body) {
    padding: 12px 0 0;
  }

  :deep(.el-calendar-day) {
    height: 56px;
    padding: 4px;

    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}

.calendar-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  .day-number {
    font-size: 14px;
    color: var(--el-text-color-primary);
  }

  .check-icon {
    margin-top: 2px;
    color: #67c23a;
  }

  &.is-checked {
    background: #f0f9ff;

    .day-number {
      color: #67c23a;
      font-weight: 600;
    }
  }

  &.is-today {
    border: 2px solid #409eff;

    .day-number {
      color: #409eff;
      font-weight: 600;
    }
  }

  &.is-checked.is-today {
    background: #e6f7ff;
    border-color: #409eff;
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .checkin-status-wrapper {
    padding: 24px;
  }

  .status-main {
    flex-direction: column;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);

    .stat-item {
      padding: 16px;

      .stat-icon {
        width: 40px;
        height: 40px;
      }

      .stat-info {
        .stat-value {
          font-size: 20px;
        }
      }
    }
  }

  .calendar-legend {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
