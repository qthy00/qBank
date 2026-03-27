<template>
  <div class="messages-page">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="title-icon">
            <Icon name="ep:bell-filled" />
          </div>
          <div>
            <h1 class="page-title">消息中心</h1>
            <p class="page-desc">管理您的消息通知，及时了解系统动态、订单状态和活动信息</p>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <el-button
          v-if="stats?.unread"
          type="primary"
          plain
          class="mark-all-btn"
          :loading="markingAll"
          @click="handleMarkAllRead"
        >
          <Icon name="ep:check" class="btn-icon" />
          全部已读
        </el-button>
        <el-button
          class="refresh-btn"
          :loading="refreshing"
          circle
          @click="handleRefresh"
        >
          <Icon name="ep:refresh" />
        </el-button>
      </div>
    </div>

    <!-- 统计卡片区 -->
    <div class="stats-grid">
      <el-card class="stat-card" shadow="never">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">未读消息</p>
            <p class="stat-value" :class="{ 'has-unread': stats?.unread }">
              {{ stats?.unread || 0 }}
            </p>
          </div>
          <div class="stat-icon unread">
            <Icon name="ep:bell" />
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="never">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">系统消息</p>
            <p class="stat-value system">{{ stats?.system || 0 }}</p>
          </div>
          <div class="stat-icon system">
            <Icon name="ep:monitor" />
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="never">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">订单消息</p>
            <p class="stat-value order">{{ stats?.order || 0 }}</p>
          </div>
          <div class="stat-icon order">
            <Icon name="ep:shopping-bag" />
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="never">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">活动消息</p>
            <p class="stat-value activity">{{ stats?.activity || 0 }}</p>
          </div>
          <div class="stat-icon activity">
            <Icon name="ep:gift" />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 消息内容区 -->
    <el-card class="messages-card" shadow="never">
      <el-tabs v-model="activeTab" class="messages-tabs">
        <el-tab-pane name="list">
          <template #label>
            <span class="tab-label">
              <Icon name="ep:message" class="tab-icon" />
              消息列表
              <el-tag
                v-if="stats?.unread"
                type="danger"
                size="small"
                class="unread-tag"
                effect="light"
              >
                {{ stats.unread }}
              </el-tag>
            </span>
          </template>
          <NotificationList ref="notificationListRef" />
        </el-tab-pane>

        <el-tab-pane name="settings">
          <template #label>
            <span class="tab-label">
              <Icon name="ep:setting" class="tab-icon" />
              消息设置
            </span>
          </template>
          <NotificationSettings />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'
import { useMessage } from '~/composables/useMessage'

const notificationStore = useNotificationStore()
const message = useMessage()

const activeTab = ref('list')
const refreshing = ref(false)
const markingAll = ref(false)
const notificationListRef = ref()

const { stats } = storeToRefs(notificationStore)

/* ==================== 方法定义 ==================== */

/* 刷新数据 */
const handleRefresh = async () => {
  refreshing.value = true
  await notificationStore.fetchStats()
  if (activeTab.value === 'list' && notificationListRef.value?.refresh) {
    await notificationListRef.value.refresh()
  }
  refreshing.value = false
}

/* 标记全部已读 */
const handleMarkAllRead = async () => {
  markingAll.value = true
  try {
    await notificationStore.markAllAsRead()
    message.success('已将所有消息标记为已读')
    if (activeTab.value === 'list' && notificationListRef.value?.refresh) {
      await notificationListRef.value.refresh()
    }
  } finally {
    markingAll.value = false
  }
}

/* ==================== 页面Meta ==================== */
useHead({
  title: '消息中心 - 学次元'
})

definePageMeta({
  layout: 'member',
  name: 'messages',
  middleware: ['auth']
})

/* ==================== 初始化 ==================== */
onMounted(() => {
  notificationStore.fetchStats()
})
</script>

<style scoped lang="scss">
/* 页面容器 */
.messages-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* 页面标题区 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.header-content {
  flex: 1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.3);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 6px;
  line-height: 1.2;
}

.page-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

/* 头部操作 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.mark-all-btn {
  .btn-icon {
    margin-right: 4px;
  }
}

.refresh-btn {
  font-size: 16px;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1;
  transition: color 0.2s ease;

  &.has-unread {
    color: var(--el-color-danger);
  }

  &.system {
    color: var(--el-color-primary);
  }

  &.order {
    color: var(--el-color-warning);
  }

  &.activity {
    color: var(--el-color-success);
  }
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;

  &.unread {
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
  }

  &.system {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  &.order {
    background: var(--el-color-warning-light-9);
    color: var(--el-color-warning);
  }

  &.activity {
    background: var(--el-color-success-light-9);
    color: var(--el-color-success);
  }
}

/* 消息卡片 */
.messages-card {
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 0;
  }
}

/* 标签页样式 */
.messages-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 0;
    padding: 0 24px;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    height: 56px;
    line-height: 56px;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    padding: 0 20px;

    &:hover {
      color: var(--el-text-color-primary);
    }

    &.is-active {
      color: var(--el-color-primary);
    }
  }

  :deep(.el-tabs__active-bar) {
    height: 2px;
    border-radius: 1px;
  }

  :deep(.el-tabs__content) {
    padding: 24px;
  }
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-icon {
  font-size: 16px;
}

.unread-tag {
  margin-left: 4px;
  font-weight: 600;
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .messages-page {
    padding: 16px 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .page-title {
    font-size: 22px;
  }

  .title-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card :deep(.el-card__body) {
    padding: 16px;
  }

  .stat-value {
    font-size: 22px;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .messages-tabs :deep(.el-tabs__content) {
    padding: 16px;
  }

  .messages-tabs :deep(.el-tabs__header) {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
