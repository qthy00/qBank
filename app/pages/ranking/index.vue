<template>
  <div class="ranking-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 页面头部 - 蓝色渐变 -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
      <!-- 装饰图案 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
        <div class="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>
      </div>

      <div class="relative container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
              <Icon name="ep:trophy" class="text-yellow-300 text-2xl" />
              学习排行榜
            </h1>
            <p class="text-white/80 mt-2">
              与学友们一起PK，看看谁是最强学习者！
            </p>
          </div>

          <!-- 统计信息 -->
          <div class="flex items-center gap-6 text-white">
            <div class="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <div class="text-2xl font-bold">{{ stats.totalParticipants }}</div>
              <div class="text-xs text-white/70">总参与人数</div>
            </div>
            <div class="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <div class="text-2xl font-bold text-green-300">{{ stats.todayActiveUsers }}</div>
              <div class="text-xs text-white/70">今日活跃</div>
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
          <el-card shadow="never" class="type-selector border border-blue-100">
            <div class="flex flex-wrap gap-3">
              <button
                v-for="type in rankingTypes"
                :key="type.type"
                class="type-btn flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300"
                :class="currentType === type.type
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg shadow-blue-500/30'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
                "
                @click="handleTypeChange(type.type)"
              >
                <Icon :name="type.icon" />
                <span>{{ type.name }}</span>
              </button>
            </div>
          </el-card>

          <!-- 时间维度选择 -->
          <el-card shadow="never" class="dimension-selector border border-blue-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon name="ep:calendar" class="text-blue-500" />
                <span class="text-slate-700 font-medium">时间维度</span>
              </div>
              <el-radio-group v-model="currentDimension" size="default" @change="handleDimensionChange">
                <el-radio-button
                  v-for="dim in timeDimensions"
                  :key="dim.dimension"
                  :value="dim.dimension"
                  class="dimension-btn"
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
          <el-card shadow="never" class="ranking-rules border border-blue-100">
            <template #header>
              <div class="flex items-center gap-2">
                <Icon name="ep:info-filled" class="text-blue-500" />
                <span class="font-bold text-slate-800">榜单说明</span>
              </div>
            </template>

            <div class="space-y-4">
              <div class="rule-item">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ep:document" class="text-blue-500" />
                  <span class="font-medium text-slate-700">做题数榜</span>
                </div>
                <p class="text-sm text-slate-500 pl-6">
                  统计用户在选定时间内完成的题目数量，做题越多排名越高。
                </p>
              </div>

              <el-divider class="my-3" />

              <div class="rule-item">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ep:check" class="text-emerald-500" />
                  <span class="font-medium text-slate-700">正确率榜</span>
                </div>
                <p class="text-sm text-slate-500 pl-6">
                  统计用户答题的正确率，需完成至少100道题方可上榜。
                </p>
              </div>

              <el-divider class="my-3" />

              <div class="rule-item">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ep:timer" class="text-orange-500" />
                  <span class="font-medium text-slate-700">学习时长榜</span>
                </div>
                <p class="text-sm text-slate-500 pl-6">
                  统计用户在题库中实际学习的时间，停留时间计入统计。
                </p>
              </div>
            </div>
          </el-card>

          <!-- 更新提示 -->
          <el-card shadow="never" class="update-info border border-blue-100">
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">榜单更新时间</span>
              <span class="text-slate-700 font-medium">{{ updateTimeText }}</span>
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
import { RankingApi } from '~/api/ranking'
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
    const data = await RankingApi.getRankingList(
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
  const data = await RankingApi.getRankingStats()
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
.type-selector,
.dimension-selector,
.ranking-rules,
.update-info {
  border-radius: 12px;
  overflow: hidden;
}

.type-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }
}

.dimension-selector {
  :deep(.el-radio-button__inner) {
    transition: all 0.3s ease;
  }
}

.ranking-rules {
  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
}

.rule-item {
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
  margin: -8px;

  &:hover {
    background: #f8fafc;
  }
}

/* 时间维度按钮样式 */
:deep(.dimension-selector .el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

:deep(.dimension-selector .el-radio-button__inner:hover) {
  color: #3b82f6;
}

@media (max-width: 768px) {
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
