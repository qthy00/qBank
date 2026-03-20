<template>
  <div class="user-rank-card bg-gradient-to-br from-(--color-btn-primary) to-blue-600 rounded-xl p-5 text-white shadow-lg">
    <!-- 卡片头部 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Icon name="ep:user" class="text-xl" />
        <span class="font-medium">我的排名</span>
      </div>
      <el-tag size="small" effect="dark" class="bg-white/20 border-0 text-white">
        {{ dimensionName }}
      </el-tag>
    </div>

    <!-- 排名信息 -->
    <div v-if="userRank" class="rank-info">
      <div class="flex items-center gap-4 mb-4">
        <div class="rank-number text-5xl font-bold">
          {{ userRank.rank }}
        </div>
        <div class="rank-detail">
          <div class="text-white/80 text-sm">当前排名</div>
          <div class="trend-info flex items-center gap-1 mt-1">
            <template v-if="userRank.trend && userRank.trend !== 'same'">
              <Icon :name="trendIcon" :class="trendColorClass" />
              <span :class="trendColorClass" class="text-sm">
                {{ trendText }}
              </span>
            </template>
            <template v-else>
              <span class="text-white/60 text-sm">排名持平</span>
            </template>
          </div>
        </div>
      </div>

      <div class="value-display bg-white/10 rounded-lg p-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon :name="typeIcon" class="text-xl" />
          <span class="text-white/80">{{ typeName }}</span>
        </div>
        <span class="text-2xl font-bold">{{ userRank.valueText }}</span>
      </div>
    </div>

    <!-- 未上榜状态 -->
    <div v-else class="no-rank text-center py-4">
      <Icon name="ep:info-filled" class="text-3xl mb-2 opacity-60" />
      <p class="text-white/80">暂无排名数据</p>
      <p class="text-white/60 text-sm mt-1">快去刷题提升排名吧！</p>
    </div>

    <!-- 综合排名 -->
    <div v-if="comprehensiveRank" class="comprehensive-rank mt-4 pt-4 border-t border-white/20">
      <div class="flex items-center justify-between">
        <span class="text-white/80 text-sm">综合排名</span>
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold">第 {{ comprehensiveRank }} 名</span>
          <el-tag size="small" effect="dark" class="bg-white/20 border-0 text-white">
            {{ comprehensiveLevel }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RankingItemVO, RankingType, TimeDimension } from '~/types/ranking'

interface Props {
  /** 用户排名信息 */
  userRank?: RankingItemVO
  /** 榜单类型 */
  type: RankingType
  /** 时间维度 */
  dimension: TimeDimension
  /** 综合排名 */
  comprehensiveRank?: number
}

const props = defineProps<Props>()

/* 时间维度名称 */
const dimensionName = computed(() => {
  const dimensionMap: Record<TimeDimension, string> = {
    day: '今日',
    week: '本周',
    month: '本月',
    total: '总榜'
  }
  return dimensionMap[props.dimension]
})

/* 榜单类型名称 */
const typeName = computed(() => {
  const typeMap: Record<RankingType, string> = {
    question_count: '做题数',
    accuracy_rate: '正确率',
    study_duration: '学习时长'
  }
  return typeMap[props.type]
})

/* 榜单类型图标 */
const typeIcon = computed(() => {
  const iconMap: Record<RankingType, string> = {
    question_count: 'ep:document',
    accuracy_rate: 'ep:check',
    study_duration: 'ep:timer'
  }
  return iconMap[props.type]
})

/* 趋势图标 */
const trendIcon = computed(() => {
  if (props.userRank?.trend === 'up') {
    return 'ep:arrow-up'
  }
  if (props.userRank?.trend === 'down') {
    return 'ep:arrow-down'
  }
  return 'ep:minus'
})

/* 趋势颜色 */
const trendColorClass = computed(() => {
  if (props.userRank?.trend === 'up') {
    return 'text-green-300'
  }
  if (props.userRank?.trend === 'down') {
    return 'text-red-300'
  }
  return 'text-white/60'
})

/* 趋势文本 */
const trendText = computed(() => {
  if (props.userRank?.trend === 'up') {
    return `上升 ${props.userRank.trendValue || 0} 名`
  }
  if (props.userRank?.trend === 'down') {
    return `下降 ${props.userRank.trendValue || 0} 名`
  }
  return '排名持平'
})

/* 综合排名等级 */
const comprehensiveLevel = computed(() => {
  if (!props.comprehensiveRank) {
    return '暂无'
  }
  if (props.comprehensiveRank <= 10) {
    return '顶尖学霸'
  }
  if (props.comprehensiveRank <= 100) {
    return '学习达人'
  }
  if (props.comprehensiveRank <= 1000) {
    return '积极学习者'
  }
  return '潜力无限'
})
</script>

<style scoped lang="scss">
.user-rank-card {
  background: linear-gradient(135deg, var(--color-btn-primary) 0%, #4f46e5 100%);
}

.rank-number {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.trend-info {
  animation: fadeIn 0.5s ease;
}

.value-display {
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
