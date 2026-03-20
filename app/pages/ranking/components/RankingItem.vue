<template>
  <div
    class="ranking-item flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300"
    :class="[
      isTopThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'hover:bg-gray-50',
      isCurrentUser ? 'ring-2 ring-(--color-btn-primary)' : ''
    ]"
  >
    <!-- 排名数字 -->
    <div
      class="rank-badge w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shrink-0"
      :class="rankBadgeClass"
    >
      <template v-if="isTopThree">
        {{ rank }}
      </template>
      <template v-else>
        {{ rank }}
      </template>
    </div>

    <!-- 用户头像 -->
    <div class="avatar-wrapper w-12 h-12 rounded-full overflow-hidden shrink-0">
      <img
        :src="avatar || '/images/default-avatar.png'"
        class="w-full h-full object-cover"
        alt="avatar"
      >
    </div>

    <!-- 用户信息 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span
          class="nickname font-medium text-(--color-text-primary) truncate"
          :class="{ 'text-(--color-btn-primary)': isCurrentUser }"
        >
          {{ nickname }}
        </span>
        <el-tag
          v-if="isCurrentUser"
          size="small"
          type="primary"
          effect="plain"
        >
          我
        </el-tag>
      </div>
      <div
        v-if="showTrend && trend !== 'same'"
        class="trend-text text-xs mt-1"
        :class="trendClass"
      >
        <Icon :name="trendIcon" class="text-xs" />
        {{ trendText }}
      </div>
    </div>

    <!-- 数值展示 -->
    <div class="value-section text-right shrink-0">
      <div class="value-text font-bold text-lg" :class="valueClass">
        {{ valueText }}
      </div>
      <div v-if="showUnit" class="unit-text text-xs text-(--color-text-secondary)">
        {{ unit }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 排名 */
  rank: number
  /** 用户昵称 */
  nickname: string
  /** 用户头像 */
  avatar?: string
  /** 数值 */
  value: number
  /** 格式化后的值 */
  valueText: string
  /** 单位 */
  unit?: string
  /** 趋势 */
  trend?: 'up' | 'down' | 'same'
  /** 趋势值 */
  trendValue?: number
  /** 是否当前用户 */
  isCurrentUser?: boolean
  /** 是否显示趋势 */
  showTrend?: boolean
  /** 是否显示单位 */
  showUnit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
  trend: 'same',
  trendValue: 0,
  isCurrentUser: false,
  showTrend: true,
  showUnit: false
})

/* 是否前三名 */
const isTopThree = computed(() => props.rank <= 3)

/* 排名徽章样式 */
const rankBadgeClass = computed(() => {
  if (props.rank === 1) {
    return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-200'
  }
  if (props.rank === 2) {
    return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-200'
  }
  if (props.rank === 3) {
    return 'bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-lg shadow-orange-200'
  }
  return 'bg-gray-100 text-(--color-text-secondary)'
})

/* 趋势样式 */
const trendClass = computed(() => {
  if (props.trend === 'up') {
    return 'text-green-500'
  }
  if (props.trend === 'down') {
    return 'text-red-500'
  }
  return 'text-(--color-text-secondary)'
})

/* 趋势图标 */
const trendIcon = computed(() => {
  if (props.trend === 'up') {
    return 'ep:arrow-up'
  }
  if (props.trend === 'down') {
    return 'ep:arrow-down'
  }
  return 'ep:minus'
})

/* 趋势文本 */
const trendText = computed(() => {
  if (props.trend === 'up') {
    return `上升 ${props.trendValue} 名`
  }
  if (props.trend === 'down') {
    return `下降 ${props.trendValue} 名`
  }
  return '排名不变'
})

/* 数值样式 */
const valueClass = computed(() => {
  if (isTopThree.value) {
    return 'text-(--color-btn-primary)'
  }
  return 'text-(--color-text-primary)'
})
</script>

<style scoped lang="scss">
.ranking-item {
  &:hover {
    transform: translateX(4px);
  }
}

.rank-badge {
  transition: all 0.3s ease;
}

.avatar-wrapper {
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-btn-primary);
    transform: scale(1.05);
  }
}

.nickname {
  max-width: 120px;
}

@media (max-width: 640px) {
  .ranking-item {
    gap: 8px;
    padding: 8px 12px;
  }

  .rank-badge {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .avatar-wrapper {
    width: 40px;
    height: 40px;
  }

  .nickname {
    max-width: 80px;
  }

  .value-text {
    font-size: 14px;
  }
}
</style>
