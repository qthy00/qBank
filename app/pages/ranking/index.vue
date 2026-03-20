<template>
  <div class="ranking-page min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="page-header bg-(--color-bg-container) shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-(--color-text-primary) flex items-center gap-2">
              <Icon name="ep:trophy" class="text-(--color-btn-primary)" />
              学习排行榜
            </h1>
            <p class="text-(--color-text-secondary) mt-1">
              与学友们一起PK，看看谁是最强学习者！
            </p>
          </div>

          <!-- 统计信息 -->
          <div class="flex items-center gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-(--color-btn-primary)">{{ stats.totalParticipants }}</div>
              <div class="text-xs text-(--color-text-secondary)">总参与人数</div>
            </div>
            <div class="w-px h-10 bg-(--color-border)" />
            <div class="text-center">
              <div class="text-2xl font-bold text-green-500">{{ stats.todayActiveUsers }}</div>
              <div class="text-xs text-(--color-text-secondary)">今日活跃</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：榜单切换和时间选择 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 榜单类型切换 -->
          <el-card shadow="never" class="type-selector">
            <div class="flex flex-wrap gap-3">
              <button
                v-for="type in rankingTypes"
                :key="type.type"
                class="type-btn flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300"
                :class="currentType === type.type
                  ? 'bg-(--color-btn-primary) text-white border-(--color-btn-primary)'
                  : 'bg-white text-(--color-text-primary) border-(--color-border) hover:border-(--color-btn-primary)'
                "
                @click="handleTypeChange(type.type)"
              >
                <Icon :name="type.icon" />
                <span>{{ type.name }}</span>
              </button>
            </div>
          </el-card>

          <!-- 时间维度选择 -->
          <el-card shadow="never" class="dimension-selector">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon name="ep:calendar" class="text-(--color-text-secondary)" />
                <span class="text-(--color-text-primary)">时间维度</span>
              </div>
              <el-radio-group v-model="currentDimension" size="default" @change="handleDimensionChange">
                <el-radio-button
                  v-for="dim in timeDimensions"
                  :key="dim.dimension"
                  :value="dim.dimension"
                >
                  {{ dim.name }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </el-card>

          <!-- 榜单列表 -->
          <RankingList
            :list="rankingList"
            :title="currentTypeConfig.name"
            :icon="currentTypeConfig.icon"
            :dimension="currentDimension"
            :loading="loading"
            :total="stats.totalParticipants"
            show-header
            show-top-three
          />
        </div>

        <!-- 右侧：我的排名和说明 -->
        <div class="space-y-6">
          <!-- 我的排名卡片 -->
          <UserRankCard
            :user-rank="userRank"
            :type="currentType"
            :dimension="currentDimension"
            :comprehensive-rank="comprehensiveRank"
          />

          <!-- 榜单说明 -->
          <el-card shadow="never" class="ranking-rules">
            <template #header>
              <div class="flex items-center gap-2">
                <Icon name="ep:info-filled" class="text-(--color-btn-primary)" />
                <span class="font-bold">榜单说明</span>
              </div>
            </template>

            <div class="space-y-4">
              <div class="rule-item">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ep:document" class="text-(--color-btn-primary)" />
                  <span class="font-medium text-(--color-text-primary)">做题数榜</span>
                </div>
                <p class="text-sm text-(--color-text-secondary) pl-6">
                  统计用户在选定时间内完成的题目数量，做题越多排名越高。
                </p>
              </div>

              <el-divider class="my-3" />

              <div class="rule-item">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ep:check" class="text-green-500" />
                  <span class="font-medium text-(--color-text-primary)">正确率榜</span>
                </div>
                <p class="text-sm text-(--color-text-secondary) pl-6">
                  统计用户答题的正确率，需完成至少100道题方可上榜。
                </p>
              </div>

              <el-divider class="my-3" />

              <div class="rule-item">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ep:timer" class="text-orange-500" />
                  <span class="font-medium text-(--color-text-primary)">学习时长榜</span>
                </div>
                <p class="text-sm text-(--color-text-secondary) pl-6">
                  统计用户在题库中实际学习的时间，停留时间计入统计。
                </p>
              </div>
            </div>
          </el-card>

          <!-- 更新提示 -->
          <el-card shadow="never" class="update-info">
            <div class="flex items-center justify-between text-sm">
              <span class="text-(--color-text-secondary)">榜单更新时间</span>
              <span class="text-(--color-text-primary)">{{ updateTimeText }}</span>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { RankingType, TimeDimension, RankingItemVO, RankingStatsVO } from '~/types/ranking'
import { getMockRankingList, getMockRankingStats } from '~/api/ranking/mock'
import RankingList from './components/RankingList.vue'
import UserRankCard from './components/UserRankCard.vue'

/* ==================== 状态定义 ==================== */

const currentType = ref<RankingType>('question_count')
const currentDimension = ref<TimeDimension>('day')
const loading = ref(false)
const rankingList = ref<RankingItemVO[]>([])
const userRank = ref<RankingItemVO>()
const comprehensiveRank = ref<number>(0)
const stats = ref<RankingStatsVO>({
  totalParticipants: 0,
  todayActiveUsers: 0,
  updateTime: ''
})

/* ==================== 配置数据 ==================== */

const rankingTypes = [
  { type: 'question_count' as RankingType, name: '做题数榜', icon: 'ep:document' },
  { type: 'accuracy_rate' as RankingType, name: '正确率榜', icon: 'ep:check' },
  { type: 'study_duration' as RankingType, name: '学习时长榜', icon: 'ep:timer' }
]

const timeDimensions = [
  { dimension: 'day' as TimeDimension, name: '今日' },
  { dimension: 'week' as TimeDimension, name: '本周' },
  { dimension: 'month' as TimeDimension, name: '本月' },
  { dimension: 'total' as TimeDimension, name: '总榜' }
]

/* ==================== 计算属性 ==================== */

const currentTypeConfig = computed(() => {
  return rankingTypes.find(t => t.type === currentType.value) || rankingTypes[0]
})

const updateTimeText = computed(() => {
  if (!stats.value.updateTime) {
    return '--'
  }
  const date = new Date(stats.value.updateTime)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

/* ==================== 方法 ==================== */

const fetchRankingData = async () => {
  loading.value = true
  try {
    const data = await getMockRankingList(
      currentType.value,
      currentDimension.value,
      10
    )
    rankingList.value = data.list
    userRank.value = data.userRank
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  const data = await getMockRankingStats()
  stats.value = data
}

const handleTypeChange = (type: RankingType) => {
  currentType.value = type
  fetchRankingData()
}

const handleDimensionChange = () => {
  fetchRankingData()
}

/* ==================== 生命周期 ==================== */

onMounted(() => {
  fetchRankingData()
  fetchStats()
  /* 模拟综合排名 */
  comprehensiveRank.value = 42
})

/* ==================== 页面元信息 ==================== */

definePageMeta({
  layout: 'default'
})

useHead({
  title: '学习排行榜 - 学次元在线题库'
})
</script>

<style scoped lang="scss">
.page-header {
  border-bottom: 1px solid var(--color-border);
}

.type-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.ranking-rules {
  :deep(.el-card__header) {
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border);
  }
}

.rule-item {
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-bg-container-hover);
    border-radius: 8px;
    padding: 8px;
    margin: -8px;
  }
}

@media (max-width: 768px) {
  .page-header {
    .container {
      padding-top: 16px;
      padding-bottom: 16px;
    }
  }

  .dimension-selector {
    :deep(.el-radio-group) {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    :deep(.el-radio-button) {
      margin: 0;
    }
  }
}
</style>
