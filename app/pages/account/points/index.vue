<script setup lang="ts">
import { usePointStore } from '~/stores/point'
import { useUserStore } from '~/stores/user'

/**
 * 积分中心页面
 */
definePageMeta({
  layout: 'member',
  middleware: ['auth']
})

useHead({
  title: '积分中心 - 学次元在线题库'
})

const pointStore = usePointStore()
const _userStore = useUserStore()

/* 筛选状态：''-全部, 'income'-收入, 'expense'-支出 */
const filterStatus = ref<'all' | 'income' | 'expense'>('all')

/* 分页 */
const currentPage = ref(1)
const pageSize = ref(10)

/* 初始化 */
onMounted(async () => {
  await pointStore.fetchPointStatistics()
  await pointStore.fetchPointRules()
  await fetchRecords()
})

/* 获取记录 */
const fetchRecords = async () => {
  const params: PointRecordPageReqVO = {
    pageNo: currentPage.value,
    pageSize: pageSize.value
  }

  if (filterStatus.value === 'income') {
    params.addStatus = true
  } else if (filterStatus.value === 'expense') {
    params.addStatus = false
  }

  await pointStore.fetchPointRecords(params)
}

/* 筛选切换 */
const handleFilterChange = async (status: 'all' | 'income' | 'expense') => {
  filterStatus.value = status
  currentPage.value = 1
  await fetchRecords()
}

/* 加载更多 */
const loadMore = async () => {
  currentPage.value++
  const params: PointRecordPageReqVO = {
    pageNo: currentPage.value,
    pageSize: pageSize.value
  }

  if (filterStatus.value === 'income') {
    params.addStatus = true
  } else if (filterStatus.value === 'expense') {
    params.addStatus = false
  }

  await pointStore.loadMorePointRecords(params)
}

/* 获取积分图标 */
const getPointIcon = (point: number): string => {
  if (point > 0) {
    return 'material-symbols:add-circle'
  } else if (point < 0) {
    return 'material-symbols:remove-circle'
  }
  return 'material-symbols:radio-button-unchecked'
}

/* 获取积分颜色 */
const getPointColor = (point: number): string => {
  if (point > 0) {
    return 'var(--el-color-success)'
  } else if (point < 0) {
    return 'var(--el-color-danger)'
  }
  return 'var(--el-text-color-secondary)'
}

/* 获取积分显示文本 */
const getPointText = (point: number): string => {
  if (point > 0) {
    return `+${point}`
  } else if (point < 0) {
    return `${point}`
  }
  return '0'
}
</script>

<template>
  <div class="points-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">积分中心</h1>
      <p class="page-desc">积分可用于兑换优惠券、会员权益等</p>
    </div>

    <!-- 积分余额卡片 -->
    <div class="points-balance-card">
      <div class="balance-info">
        <div class="balance-label">当前积分</div>
        <div class="balance-value">{{ pointStore.currentBalance }}</div>
        <div class="balance-hint">
          累计获得 {{ pointStore.totalIncome }}，累计使用 {{ pointStore.totalExpense }}
        </div>
      </div>
      <div class="balance-actions">
        <el-button type="primary" size="large" @click="navigateTo('/coupon')">
          <Icon name="material-symbols:redeem" class="btn-icon" />
          去兑换
        </el-button>
      </div>
    </div>

    <!-- 筛选标签 -->
    <div class="filter-section">
      <el-radio-group v-model="filterStatus" @change="handleFilterChange">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="income">收入</el-radio-button>
        <el-radio-button label="expense">支出</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 积分明细列表 -->
    <div class="points-list-section">
      <div v-if="pointStore.pointRecords.length === 0" class="empty-state">
        <el-empty :description="filterStatus === 'all' ? '暂无积分记录' : '暂无相关记录'" />
      </div>
      <div v-else class="points-list">
        <div
          v-for="record in pointStore.pointRecords"
          :key="record.id"
          class="points-item"
        >
          <div class="points-icon" :style="{ background: getPointColor(record.point) + '1a' }">
            <Icon
              :name="getPointIcon(record.point)"
              class="icon"
              :style="{ color: getPointColor(record.point) }"
            />
          </div>
          <div class="points-content">
            <div class="points-title">{{ record.title }}</div>
            <div class="points-desc">{{ record.description }}</div>
          </div>
          <div class="points-meta">
            <div
              class="points-value"
              :style="{ color: getPointColor(record.point) }"
            >
              {{ getPointText(record.point) }}
            </div>
            <div class="points-time">{{ record.createTime }}</div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div
        v-if="pointStore.pointRecords.length < pointStore.pointTotal"
        class="load-more"
      >
        <el-button :loading="pointStore.loading" @click="loadMore">
          加载更多
        </el-button>
      </div>
    </div>

    <!-- 积分获取规则 -->
    <div class="points-rules-section">
      <h3 class="section-title">积分规则</h3>
      <div class="rules-list">
        <div
          v-for="rule in pointStore.pointRules"
          :key="rule.name"
          class="rule-item"
        >
          <div class="rule-icon">
            <Icon name="material-symbols:stars" class="icon" />
          </div>
          <div class="rule-content">
            <div class="rule-name">{{ rule.name }}</div>
            <div class="rule-desc">{{ rule.description }}</div>
          </div>
          <div class="rule-value">
            {{ rule.point > 0 ? `+${rule.point}` : '按订单' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.points-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }

  .page-desc {
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.points-balance-card {
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px rgba(var(--el-color-primary-rgb), 0.3);

  .balance-info {
    .balance-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .balance-value {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 8px;
      line-height: 1;
    }

    .balance-hint {
      font-size: 13px;
      opacity: 0.8;
    }
  }

  .balance-actions {
    .btn-icon {
      margin-right: 4px;
      font-size: 18px;
    }
  }
}

.filter-section {
  margin-bottom: 16px;
}

.points-list-section {
  margin-bottom: 24px;

  .empty-state {
    padding: 48px 0;
  }

  .points-list {
    background: var(--el-bg-color);
    border-radius: 12px;
    border: 1px solid var(--el-border-color-light);

    .points-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--el-border-color-light);

      &:last-child {
        border-bottom: none;
      }

      .points-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
          font-size: 20px;
        }
      }

      .points-content {
        flex: 1;

        .points-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .points-desc {
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
      }

      .points-meta {
        text-align: right;

        .points-value {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .points-time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }

  .load-more {
    text-align: center;
    padding: 24px 0;
  }
}

.points-rules-section {
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 16px;
  }

  .rules-list {
    background: var(--el-bg-color);
    border-radius: 12px;
    border: 1px solid var(--el-border-color-light);

    .rule-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--el-border-color-light);

      &:last-child {
        border-bottom: none;
      }

      .rule-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--el-color-primary-light-9);
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
          font-size: 18px;
          color: var(--el-color-primary);
        }
      }

      .rule-content {
        flex: 1;

        .rule-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .rule-desc {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }

      .rule-value {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-color-primary);
      }
    }
  }
}

@media (max-width: 768px) {
  .points-page {
    padding: 16px;
  }

  .points-balance-card {
    flex-direction: column;
    text-align: center;
    padding: 24px;

    .balance-info {
      margin-bottom: 20px;

      .balance-value {
        font-size: 36px;
      }
    }
  }
}
</style>
