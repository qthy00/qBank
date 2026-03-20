<template>
  <div class="ranking-list">
    <!-- 榜单头部 -->
    <div
      v-if="showHeader"
      class="list-header flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-lg border-b border-(--color-border)"
    >
      <div class="flex items-center gap-2">
        <Icon :name="icon" class="text-(--color-btn-primary)" />
        <span class="font-bold text-(--color-text-primary)">{{ title }}</span>
        <el-tag size="small" type="info" effect="plain">
          {{ dimensionName }}
        </el-tag>
      </div>
      <div class="text-xs text-(--color-text-secondary)">
        共 {{ total }} 人参与
      </div>
    </div>

    <!-- 榜单列表 -->
    <div class="list-body">
      <!-- TOP3 特殊展示 -->
      <div v-if="showTopThree && topThree.length > 0" class="top-three-section mb-4">
        <div class="flex items-end justify-center gap-4 py-4">
          <!-- 第二名 -->
          <div v-if="topThree[1]" class="top-item second-place flex flex-col items-center">
            <div class="relative">
              <img
                :src="topThree[1].avatar || '/images/default-avatar.png'"
                class="w-14 h-14 rounded-full object-cover border-4 border-gray-300"
                alt="avatar"
              >
              <div class="rank-medal absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
            </div>
            <span class="nickname mt-2 text-sm text-(--color-text-primary) truncate max-w-20">{{ topThree[1].nickname }}</span>
            <span class="value-text text-xs text-(--color-btn-primary) font-medium">{{ topThree[1].valueText }}</span>
          </div>

          <!-- 第一名 -->
          <div v-if="topThree[0]" class="top-item first-place flex flex-col items-center -mt-4">
            <Icon name="ep:trophy" class="text-3xl text-yellow-500 mb-1" />
            <div class="relative">
              <img
                :src="topThree[0].avatar || '/images/default-avatar.png'"
                class="w-16 h-16 rounded-full object-cover border-4 border-yellow-400 shadow-lg shadow-yellow-200"
                alt="avatar"
              >
              <div class="rank-medal absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                1
              </div>
            </div>
            <span class="nickname mt-2 font-bold text-(--color-text-primary) truncate max-w-24">{{ topThree[0].nickname }}</span>
            <span class="value-text text-sm text-(--color-btn-primary) font-bold">{{ topThree[0].valueText }}</span>
          </div>

          <!-- 第三名 -->
          <div v-if="topThree[2]" class="top-item third-place flex flex-col items-center">
            <div class="relative">
              <img
                :src="topThree[2].avatar || '/images/default-avatar.png'"
                class="w-14 h-14 rounded-full object-cover border-4 border-orange-400"
                alt="avatar"
              >
              <div class="rank-medal absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
            </div>
            <span class="nickname mt-2 text-sm text-(--color-text-primary) truncate max-w-20">{{ topThree[2].nickname }}</span>
            <span class="value-text text-xs text-(--color-btn-primary) font-medium">{{ topThree[2].valueText }}</span>
          </div>
        </div>
      </div>

      <!-- 4-10名列表 -->
      <div class="ranking-items">
        <RankingItem
          v-for="item in remainingList"
          :key="item.userId"
          :rank="item.rank"
          :nickname="item.nickname"
          :avatar="item.avatar"
          :value="item.value"
          :value-text="item.valueText"
          :trend="item.trend"
          :trend-value="item.trendValue"
          :is-current-user="item.isCurrentUser"
          :show-trend="showTrend"
        />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state py-8 text-center">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && list.length === 0" class="empty-state py-12 text-center">
      <Icon name="ep:medal" class="text-5xl text-gray-300 mb-4" />
      <p class="text-(--color-text-secondary)">暂无榜单数据</p>
      <p class="text-xs text-(--color-text-secondary) mt-2">快去刷题上榜吧！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RankingItemVO, TimeDimension } from '~/types/ranking'
import RankingItem from './RankingItem.vue'

interface Props {
  /** 榜单数据 */
  list: RankingItemVO[]
  /** 榜单标题 */
  title: string
  /** 榜单图标 */
  icon: string
  /** 时间维度 */
  dimension: TimeDimension
  /** 是否显示头部 */
  showHeader?: boolean
  /** 是否显示TOP3特殊样式 */
  showTopThree?: boolean
  /** 是否显示趋势 */
  showTrend?: boolean
  /** 加载状态 */
  loading?: boolean
  /** 总人数 */
  total?: number
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showTopThree: true,
  showTrend: true,
  loading: false,
  total: 0
})

/* TOP3数据 */
const topThree = computed(() => props.list.slice(0, 3))

/* 剩余列表（4-10名） */
const remainingList = computed(() => props.list.slice(3))

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
</script>

<style scoped lang="scss">
.ranking-list {
  background: var(--color-bg-container);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.list-header {
  border-bottom: 1px solid var(--color-border);
}

.top-three-section {
  background: linear-gradient(180deg, rgba(255, 215, 0, 0.05) 0%, transparent 100%);
  border-bottom: 1px dashed var(--color-border);
}

.top-item {
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &.first-place {
    z-index: 10;
  }
}

.ranking-items {
  padding: 8px;
}

.loading-state {
  padding: 32px;
}

.empty-state {
  padding: 48px;
}

@media (max-width: 640px) {
  .top-three-section {
    .top-item {
      &.second-place,
      &.third-place {
        img {
          width: 48px;
          height: 48px;
        }
      }

      &.first-place {
        img {
          width: 56px;
          height: 56px;
        }
      }
    }

    .nickname {
      font-size: 12px;
      max-width: 60px;
    }

    .value-text {
      font-size: 11px;
    }
  }
}
</style>
