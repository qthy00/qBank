<script setup lang="ts">
import type { PracticeRecordVO } from '~/types/practice'
import { getPracticeRecords } from '~/api/practice'

/**
 * 练习详情页面
 */
definePageMeta({
  layout: 'user',
})

/* 路由参数 */
const route = useRoute()
const router = useRouter()
const recordId = computed(() => Number(route.params.id))

/* 加载状态 */
const loading = ref(false)

/* 练习记录详情 */
const record = ref<PracticeRecordVO | null>(null)

/* ==================== 方法 ==================== */

/**
 * 获取练习记录详情
 */
const fetchRecordDetail = async () => {
  if (!recordId.value) return

  loading.value = true
  try {
    /* 通过列表API获取详情（实际项目中应该有单独的详情API） */
    const res = await getPracticeRecords({
      page: 1,
      limit: 100,
    })
    const found = res.list.find(item => item.id === recordId.value)
    if (found) {
      record.value = found
    } else {
      useMessage().error('练习记录不存在')
      router.back()
    }
  } catch (error) {
    console.error('获取练习详情失败:', error)
    useMessage().error('获取练习详情失败')
  } finally {
    loading.value = false
  }
}

/**
 * 返回列表
 */
const handleBack = () => {
  router.back()
}

/**
 * 继续练习
 */
const handleContinue = () => {
  if (!record.value) return

  /* 根据练习类型跳转到对应页面 */
  const { type, qbankId, id } = record.value
  let path = ''

  switch (type) {
    case 'chapter':
      path = `/study/chapter?qbankId=${qbankId}&recordId=${id}`
      break
    case 'sequence':
      path = `/study/sequence?qbankId=${qbankId}&recordId=${id}`
      break
    case 'random':
      path = `/study/random?qbankId=${qbankId}&recordId=${id}`
      break
    case 'daily':
      path = `/study/practice/daily?recordId=${id}`
      break
    case 'exam':
      path = `/study/exam/${id}`
      break
    default:
      path = `/study?qbankId=${qbankId}&recordId=${id}`
  }

  router.push(path)
}

/**
 * 重新开始练习
 */
const handleRestart = () => {
  if (!record.value) return

  const { qbankId } = record.value
  router.push(`/study?qbankId=${qbankId}`)
}

/* ==================== 格式化方法 ==================== */

/**
 * 格式化时长
 */
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

/**
 * 格式化日期
 */
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
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
 * 获取状态标签样式
 */
const getStatusType = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'in_progress':
      return 'primary'
    case 'abandoned':
      return 'info'
    default:
      return 'info'
  }
}

/* ==================== 初始化 ==================== */

onMounted(() => {
  fetchRecordDetail()
})
</script>

<template>
  <div class="page-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="handleBack">
          <Icon name="ep:arrow-left" />
          返回
        </el-button>
        <div class="header-title">
          <Icon name="ep:document" class="title-icon" />
          <h1>练习详情</h1>
        </div>
      </div>
      <div class="header-actions">
        <el-button
          v-if="record?.status === 'in_progress'"
          type="primary"
          @click="handleContinue"
        >
          <Icon name="ep:play" />
          继续练习
        </el-button>
        <el-button v-else type="primary" @click="handleRestart">
          <Icon name="ep:refresh" />
          重新练习
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 详情内容 -->
    <div v-else-if="record" class="detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card" shadow="never">
        <div class="info-header">
          <img
            :src="record.qbankCover || '/images/default-qbank.jpg'"
            class="qbank-cover"
            alt="题库封面"
          >
          <div class="info-main">
            <h2 class="qbank-name">{{ record.qbankName }}</h2>
            <div class="info-tags">
              <el-tag :type="getStatusType(record.status)" size="small">
                {{ record.statusName }}
              </el-tag>
              <el-tag type="info" size="small">{{ record.typeName }}</el-tag>
              <el-tag v-if="record.chapterName" type="warning" size="small">
                {{ record.chapterName }}
              </el-tag>
            </div>
            <p class="mode-desc">{{ record.modeDescription }}</p>
          </div>
        </div>
      </el-card>

      <!-- 统计数据卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" :style="{ color: getAccuracyColor(record.accuracy) }">
            {{ record.accuracy }}%
          </div>
          <div class="stat-label">正确率</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ record.completedCount }}/{{ record.totalQuestionCount }}</div>
          <div class="stat-label">完成进度</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color: #22c55e;">{{ record.correctCount }}</div>
          <div class="stat-label">正确数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color: #ef4444;">{{ record.incorrectCount }}</div>
          <div class="stat-label">错误数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ formatDuration(record.duration) }}</div>
          <div class="stat-label">练习时长</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ record.currentQuestionIndex }}</div>
          <div class="stat-label">当前题号</div>
        </div>
      </div>

      <!-- 时间信息 -->
      <el-card class="time-card" shadow="never">
        <h3 class="card-title">
          <Icon name="ep:clock" />
          时间信息
        </h3>
        <div class="time-list">
          <div class="time-item">
            <span class="time-label">开始时间：</span>
            <span class="time-value">{{ formatDate(record.startTime) }}</span>
          </div>
          <div class="time-item">
            <span class="time-label">最后更新：</span>
            <span class="time-value">{{ formatDate(record.updateTime) }}</span>
          </div>
          <div v-if="record.completeTime" class="time-item">
            <span class="time-label">完成时间：</span>
            <span class="time-value">{{ formatDate(record.completeTime) }}</span>
          </div>
        </div>
      </el-card>

      <!-- 练习分析 -->
      <el-card v-if="record.status === 'completed'" class="analysis-card" shadow="never">
        <h3 class="card-title">
          <Icon name="ep:data-analysis" />
          练习分析
        </h3>
        <div class="analysis-content">
          <div class="progress-bar">
            <div class="progress-header">
              <span>完成度</span>
              <span>{{ Math.round((record.completedCount / record.totalQuestionCount) * 100) }}%</span>
            </div>
            <el-progress
              :percentage="Math.round((record.completedCount / record.totalQuestionCount) * 100)"
              :status="record.completedCount === record.totalQuestionCount ? 'success' : ''"
            />
          </div>
          <div class="accuracy-bar">
            <div class="progress-header">
              <span>正确率</span>
              <span :style="{ color: getAccuracyColor(record.accuracy) }">{{ record.accuracy }}%</span>
            </div>
            <el-progress
              :percentage="record.accuracy"
              :color="getAccuracyColor(record.accuracy)"
            />
          </div>
          <div class="analysis-summary">
            <p v-if="record.accuracy >= 80">
              <Icon name="ep:success-filled" style="color: #22c55e;" />
              表现优秀！正确率达到{{ record.accuracy }}%，继续保持！
            </p>
            <p v-else-if="record.accuracy >= 60">
              <Icon name="ep:info-filled" style="color: #3b82f6;" />
              表现良好，正确率{{ record.accuracy }}%，还有提升空间。
            </p>
            <p v-else>
              <Icon name="ep:warning-filled" style="color: #f59e0b;" />
              需要加强练习，建议复习错题，提高正确率。
            </p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="练习记录不存在或已删除" />
  </div>
</template>

<style scoped lang="scss">
.page-container {
  padding: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;

    .title-icon {
      font-size: 20px;
      color: var(--el-color-primary);
    }

    h1 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
  }
}

.loading-container {
  padding: 20px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 信息卡片 */
.info-card {
  .info-header {
    display: flex;
    gap: 16px;

    .qbank-cover {
      width: 120px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
    }

    .info-main {
      flex: 1;

      .qbank-name {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 12px 0;
      }

      .info-tags {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }

      .mode-desc {
        color: var(--el-text-color-secondary);
        font-size: 14px;
        margin: 0;
      }
    }
  }
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card {
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    padding: 20px;
    text-align: center;

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
}

/* 卡片标题 */
.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

/* 时间信息 */
.time-card {
  .time-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .time-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .time-label {
        color: var(--el-text-color-secondary);
      }

      .time-value {
        font-weight: 500;
      }
    }
  }
}

/* 练习分析 */
.analysis-card {
  .analysis-content {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .analysis-summary {
      padding: 16px;
      background: var(--el-fill-color-light);
      border-radius: 8px;

      p {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 14px;
      }
    }
  }
}
</style>
