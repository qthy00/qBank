<script setup lang="ts">
import type { PracticeRecordVO, PracticeRecordQueryReqVO } from '~/types/practice'
import { getPracticeRecords, getPracticeStatistics, continuePractice } from '~/api/practice'

/**
 * 练习记录页面
 */
definePageMeta({
  layout: 'member',
})

/* 加载状态 */
const loading = ref(false)
const continueLoading = ref<number | null>(null)

/* 练习记录列表 */
const records = ref<PracticeRecordVO[]>([])
const total = ref(0)

/* 练习统计 */
const statistics = ref({
  totalCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  avgAccuracy: 0,
})

/* 路由 */
const router = useRouter()

/* 查询参数 */
const query = reactive<PracticeRecordQueryReqVO>({
  page: 1,
  limit: 10,
  type: undefined,
  status: undefined,
})

/* 筛选选项 */
const typeOptions = [
  { value: 'chapter', label: '章节练习' },
  { value: 'sequence', label: '顺序练习' },
  { value: 'random', label: '随机练习' },
  { value: 'daily', label: '每日练习' },
  { value: 'exam', label: '模拟考试' },
]

const statusOptions = [
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'abandoned', label: '已放弃' },
]

/* ==================== 方法 ==================== */

/**
 * 获取练习记录列表
 */
const fetchRecords = async () => {
  loading.value = true
  try {
    const res = await getPracticeRecords(query)
    records.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取练习记录失败:', error)
    useMessage().error('获取练习记录失败')
  } finally {
    loading.value = false
  }
}

/**
 * 获取练习统计
 */
const fetchStatistics = async () => {
  try {
    const res = await getPracticeStatistics()
    statistics.value = res
  } catch (error) {
    console.error('获取练习统计失败:', error)
  }
}

/**
 * 处理筛选变化
 */
const handleFilterChange = () => {
  query.page = 1
  fetchRecords()
}

/**
 * 重置筛选
 */
const resetFilter = () => {
  query.type = undefined
  query.status = undefined
  query.page = 1
  fetchRecords()
}

/**
 * 处理分页变化
 */
const handlePageChange = (page: number) => {
  query.page = page
  fetchRecords()
}

/**
 * 格式化日期
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes === 0 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  }
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * 格式化时长
 */
const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}小时`
  return `${hours}小时${mins}分钟`
}

/**
 * 获取进度百分比
 */
const getProgressPercent = (record: PracticeRecordVO): number => {
  return Math.round((record.completedCount / record.totalQuestionCount) * 100)
}

/**
 * 获取状态标签类型
 */
const getStatusType = (status: string): string => {
  const map: Record<string, string> = {
    in_progress: 'primary',
    completed: 'success',
    abandoned: 'info',
  }
  return map[status] || 'info'
}

/**
 * 获取正确率颜色
 */
const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 80) return '#22c55e'
  if (accuracy >= 60) return '#3b82f6'
  if (accuracy >= 40) return '#f59e0b'
  return '#ef4444'
}

/**
 * 继续练习
 */
const handleContinue = async (record: PracticeRecordVO) => {
  if (record.status !== 'in_progress') {
    useMessage().warning('该练习已结束')
    return
  }

  continueLoading.value = record.id
  try {
    const res = await continuePractice({ recordId: record.id })
    if (res.canContinue && res.redirectUrl) {
      useMessage().success('正在进入练习...')
      navigateTo(res.redirectUrl)
    } else {
      useMessage().warning(res.message || '无法继续练习')
    }
  } catch (error) {
    console.error('继续练习失败:', error)
    useMessage().error('继续练习失败')
  } finally {
    continueLoading.value = null
  }
}

/**
 * 查看详情
 */
const handleViewDetail = (record: PracticeRecordVO) => {
  router.push(`/account/history/detail/${record.id}`)
}

/* ==================== 初始化 ==================== */

onMounted(() => {
  fetchRecords()
  fetchStatistics()
})
</script>

<template>
  <div class="page-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-title">
        <Icon name="ep:document" class="title-icon" />
        <h1>练习记录</h1>
      </div>
      <p class="header-desc">查看您的练习历史，继续未完成的练习</p>
    </div>

    <!-- 统计卡片 -->
    <div class="statistics-cards">
      <div class="stat-card">
        <div class="stat-value">{{ statistics.totalCount }}</div>
        <div class="stat-label">总练习次数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #3b82f6;">{{ statistics.inProgressCount }}</div>
        <div class="stat-label">进行中</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #22c55e;">{{ statistics.completedCount }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" :style="{ color: getAccuracyColor(statistics.avgAccuracy) }">
          {{ statistics.avgAccuracy }}%
        </div>
        <div class="stat-label">平均正确率</div>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-select
        v-model="query.type"
        placeholder="练习类型"
        clearable
        @change="handleFilterChange"
      >
        <el-option
          v-for="option in typeOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-select
        v-model="query.status"
        placeholder="练习状态"
        clearable
        @change="handleFilterChange"
      >
        <el-option
          v-for="option in statusOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-button @click="resetFilter">
        <Icon name="ep:refresh" />
        重置
      </el-button>
    </div>

    <!-- 记录列表 -->
    <div v-loading="loading" class="records-list">
      <el-empty v-if="records.length === 0" description="暂无练习记录" />

      <template v-else>
        <div
          v-for="record in records"
          :key="record.id"
          class="record-card"
        >
          <!-- 题库封面 -->
          <div class="record-cover">
            <img :src="record.qbankCover || '/images/default-qbank.jpg'" :alt="record.qbankName">
            <div class="cover-badge">
              <el-tag size="small" :type="getStatusType(record.status)">
                {{ record.statusName }}
              </el-tag>
            </div>
          </div>

          <!-- 记录信息 -->
          <div class="record-info">
            <div class="info-header">
              <h3 class="qbank-name">{{ record.qbankName }}</h3>
              <span class="practice-type">{{ record.typeName }}</span>
            </div>

            <p v-if="record.chapterName" class="chapter-name">
              <Icon name="ep:folder" />
              {{ record.chapterName }}
            </p>

            <p class="practice-desc">{{ record.modeDescription }}</p>

            <div class="info-stats">
              <span class="stat-item">
                <Icon name="ep:timer" />
                {{ formatDuration(record.duration) }}
              </span>
              <span class="stat-item">
                <Icon name="ep:document" />
                {{ record.completedCount }}/{{ record.totalQuestionCount }}题
              </span>
              <span class="stat-item">
                <Icon name="ep:check" />
                正确率 {{ record.accuracy }}%
              </span>
            </div>

            <div class="info-progress">
              <el-progress
                :percentage="getProgressPercent(record)"
                :color="getAccuracyColor(record.accuracy)"
                :show-text="false"
              />
              <span class="progress-text">{{ getProgressPercent(record) }}%</span>
            </div>
          </div>

          <!-- 操作区域 -->
          <div class="record-actions">
            <div class="action-time">{{ formatDate(record.startTime) }}</div>
            <div class="action-buttons">
              <el-button
                v-if="record.status === 'in_progress'"
                type="primary"
                :loading="continueLoading === record.id"
                @click="handleContinue(record)"
              >
                <Icon name="ep:play" />
                继续练习
              </el-button>
              <el-button
                v-else
                type="default"
                @click="handleViewDetail(record)"
              >
                <Icon name="ep:view" />
                查看详情
              </el-button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="query.page"
            :page-size="query.limit"
            :total="total"
            layout="prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  padding: 0 16px 16px;
}

.page-header {
  margin-bottom: 20px;
  padding-top: 8px;

  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;

    .title-icon {
      font-size: 22px;
      color: var(--el-color-primary);
    }

    h1 {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .header-desc {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 16px 12px;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.filter-section {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  .el-select {
    width: 130px;
  }
}

.records-list {
  min-height: 200px;
}

.record-card {
  display: flex;
  gap: 14px;
  padding: 14px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.record-cover {
  position: relative;
  width: 120px;
  height: 90px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cover-badge {
    position: absolute;
    top: 4px;
    right: 4px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 160px;
  }
}

.record-info {
  flex: 1;
  min-width: 0;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .qbank-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    line-height: 1.4;
  }

  .practice-type {
    font-size: 12px;
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    padding: 2px 8px;
    border-radius: 4px;
  }
}

.chapter-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.practice-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
}

.info-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--el-text-color-secondary);

    .icon {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 8px;
  }
}

.info-progress {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-progress {
    flex: 1;
  }

  .progress-text {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    min-width: 40px;
  }
}

.record-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 120px;

  .action-time {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  .action-buttons {
    .el-button {
      padding: 8px 16px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    min-width: auto;
    width: 100%;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-light);
  margin-top: 20px;
}
</style>
