<script setup lang="ts">
import { useMistakes } from '~/composables/useMistakes'
import MistakeStats from './components/MistakeStats.vue'
import MistakeFilter from './components/MistakeFilter.vue'
import MistakeList from './components/MistakeList.vue'
import MistakesExportDialog from '~/components/MistakesExportDialog/index.vue'

/**
 * 错题本主页面
 */
definePageMeta({
  layout: 'member',
  middleware: ['auth']
})

useHead({
  title: '我的错题本 - 学次元在线题库',
  meta: [
    {
      name: 'description',
      content: '智能错题本，自动收录错题，针对性复习薄弱环节，快速提升学习效果'
    }
  ]
})

const router = useRouter()

// 错题本逻辑
const {
  loading,
  mistakeList,
  total,
  stats,
  filter,
  page,
  limit,
  fetchMistakeList,
  fetchMistakeStats,
  markMastered,
  markUnMastered,
  removeMistakeItem,
  batchMaster,
  batchRemove,
} = useMistakes()

// 选中的错题
const selectedIds = ref<number[]>([])

// 导出弹窗
const exportDialogVisible = ref(false)

// 初始化获取数据
onMounted(() => {
  fetchMistakeStats()
  fetchMistakeList()
})

// 处理重做
const handleRetry = (questionId: number) => {
  router.push(`/mistakes/retry/${questionId}`)
}

// 处理全部重做
const handleRetryAll = () => {
  // 找到第一个未掌握的错题
  const firstUnmastered = mistakeList.value.find(m => !m.isMastered)
  if (firstUnmastered) {
    handleRetry(firstUnmastered.questionId)
  } else {
    useMessage().info('暂无待复习的错题')
  }
}

// 批量操作
const handleBatchMaster = async () => {
  if (selectedIds.value.length === 0) {
    useMessage().warning('请先选择题目')
    return
  }
  await batchMaster(selectedIds.value)
  selectedIds.value = []
}

const handleBatchRemove = async () => {
  if (selectedIds.value.length === 0) {
    useMessage().warning('请先选择题目')
    return
  }
  await batchRemove(selectedIds.value)
  selectedIds.value = []
}

// 导出错题
const handleExport = () => {
  exportDialogVisible.value = true
}

// 导出成功回调
const handleExportSuccess = () => {
  selectedIds.value = []
}
</script>

<template>
  <div class="mistake-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">我的错题本</h1>
      <p class="page-desc">自动收录错题，针对性复习，快速提升</p>
    </div>

    <!-- 统计卡片 -->
    <MistakeStats :stats="stats" class="stats-section" @retry-all="handleRetryAll" />

    <!-- 筛选栏 -->
    <MistakeFilter
      v-model="filter"
      class="filter-section"
    />

    <!-- 批量操作 -->
    <div v-if="selectedIds.length > 0" class="batch-actions">
      <span class="batch-hint">已选择 {{ selectedIds.length }} 道题目</span>
      <el-button type="primary" @click="handleBatchMaster">
        <Icon name="material-symbols:check-circle" class="btn-icon" />
        批量标记掌握
      </el-button>
      <el-button @click="handleExport">
        <Icon name="material-symbols:download" class="btn-icon" />
        导出错题
      </el-button>
      <el-button type="danger" @click="handleBatchRemove">
        <Icon name="material-symbols:delete" class="btn-icon" />
        批量移除
      </el-button>
    </div>

    <!-- 错题列表 -->
    <MistakeList
      :list="mistakeList"
      :loading="loading"
      :selected-ids="selectedIds"
      @update:selected-ids="selectedIds = $event"
      @retry="handleRetry"
      @master="markMastered"
      @unmaster="markUnMastered"
      @remove="removeMistakeItem"
      class="list-section"
    />

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="page"
        :page-size="limit"
        :total="total"
        layout="total, prev, pager, next"
      />
    </div>

    <!-- 导出弹窗 -->
    <MistakesExportDialog
      v-model:visible="exportDialogVisible"
      :selected-ids="selectedIds"
      @success="handleExportSuccess"
    />
  </div>
</template>

<style scoped lang="scss">
.mistake-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-header {
  margin-bottom: 24px;

  .page-title {
    font-size: 28px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }

  .page-desc {
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.stats-section {
  margin-bottom: 24px;
}

.filter-section {
  margin-bottom: 16px;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--el-color-primary-light-9);
  border-radius: 8px;
  margin-bottom: 16px;

  .batch-hint {
    font-size: 14px;
    color: var(--el-text-color-primary);
    margin-right: auto;
  }

  .btn-icon {
    margin-right: 4px;
    font-size: 16px;
  }
}

.list-section {
  margin-bottom: 24px;
}

.pagination-section {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .mistake-page {
    padding: 16px 12px;
  }

  .page-header {
    .page-title {
      font-size: 22px;
    }
  }

  .batch-actions {
    flex-wrap: wrap;

    .batch-hint {
      width: 100%;
      margin-bottom: 8px;
    }
  }
}
</style>
