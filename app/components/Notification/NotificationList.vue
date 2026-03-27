<template>
  <div class="notification-list">
    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 筛选 -->
      <div class="filter-section">
        <el-radio-group v-model="currentFilter" size="small" @change="handleFilterChange">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="unread">未读</el-radio-button>
          <el-radio-button label="system">系统</el-radio-button>
          <el-radio-button label="order">订单</el-radio-button>
          <el-radio-button label="activity">活动</el-radio-button>
          <el-radio-button label="study">学习</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 操作 -->
      <div class="action-section">
        <el-button
          v-if="hasUnread"
          type="primary"
          link
          size="small"
          @click="handleMarkAllAsRead"
        >
          <Icon name="ep:check" class="btn-icon" />
          全部已读
        </el-button>
        <el-divider v-if="hasUnread && hasReadItems" direction="vertical" />
        <el-button
          v-if="hasReadItems"
          type="danger"
          link
          size="small"
          @click="handleClearRead"
        >
          <Icon name="ep:delete" class="btn-icon" />
          清空已读
        </el-button>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="loading && notifications.length === 0" class="loading-state">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 空状态 -->
    <div v-else-if="notifications.length === 0" class="empty-state">
      <div class="empty-icon">
        <Icon name="ep:bell" />
      </div>
      <h3 class="empty-title">暂无消息</h3>
      <p class="empty-desc">当有新消息时会显示在这里</p>
    </div>

    <!-- 列表 -->
    <template v-else>
      <div class="notification-items">
        <div
          v-for="item in notifications"
          :key="item.id"
          class="notification-item"
          :class="{ 'is-unread': !item.isRead }"
          @click="handleItemClick(item)"
        >
          <div class="item-main">
            <!-- 类型图标 -->
            <div class="type-icon" :class="getTypeIconClass(item.type)">
              <Icon :name="getTypeIcon(item.type)" />
            </div>

            <!-- 内容区域 -->
            <div class="item-content">
              <!-- 标题行 -->
              <div class="content-header">
                <div class="header-left">
                  <el-tag :type="getTagType(item.type)" size="small" effect="light" class="type-tag">
                    {{ getTypeText(item.type) }}
                  </el-tag>
                  <h4 class="item-title" :class="{ 'is-read': item.isRead }">
                    {{ item.title }}
                  </h4>
                  <el-tag
                    v-if="item.priority === 'high'"
                    type="danger"
                    size="small"
                    effect="light"
                    class="priority-tag"
                  >
                    重要
                  </el-tag>
                </div>
                <div class="header-right">
                  <span class="item-time">{{ formatPast(item.createTime) }}</span>
                  <span v-if="!item.isRead" class="unread-dot" />
                </div>
              </div>

              <!-- 内容 -->
              <p class="item-desc" :class="{ 'is-read': item.isRead }">
                {{ item.content }}
              </p>

              <!-- 操作按钮 -->
              <div class="item-actions">
                <el-button
                  v-if="item.actionUrl"
                  type="primary"
                  link
                  size="small"
                  @click.stop="handleAction(item)"
                >
                  {{ item.actionText || '查看详情' }}
                  <Icon name="ep:arrow-right" class="action-icon" />
                </el-button>
                <el-button
                  v-if="!item.isRead"
                  type="info"
                  link
                  size="small"
                  @click.stop="handleMarkAsRead(item)"
                >
                  标记已读
                </el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click.stop="handleDelete(item)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="load-more">
        <el-button :loading="loading" size="default" @click="handleLoadMore">
          加载更多
        </el-button>
      </div>
    </template>

    <!-- 批量操作栏 -->
    <transition name="slide-up">
      <div v-if="selectedItems.length > 0" class="batch-bar">
        <span class="batch-text">已选择 {{ selectedItems.length }} 项</span>
        <div class="batch-actions">
          <el-button type="primary" size="small" @click="handleBatchRead">
            <Icon name="ep:check" />
            标记已读
          </el-button>
          <el-button type="danger" size="small" @click="handleBatchDelete">
            <Icon name="ep:delete" />
            删除
          </el-button>
          <el-divider direction="vertical" />
          <el-button type="info" size="small" text @click="selectedItems = []">
            取消
          </el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { NotificationVO, NotificationType } from '~/types/notification'
import { useNotificationStore } from '~/stores/notification'
import { formatPast } from '~/utils/formatTime'

const notificationStore = useNotificationStore()
const message = useMessage()

const {
  notifications,
  loading,
  hasMore,
  hasUnread,
} = storeToRefs(notificationStore)

const currentFilter = ref('all')
const selectedItems = ref<number[]>([])

/* ==================== 计算属性 ==================== */
const hasReadItems = computed(() =>
  notifications.value.some(item => item.isRead)
)

/* ==================== 类型映射 ==================== */
const typeIconMap: Record<NotificationType, string> = {
  system: 'ep:monitor',
  order: 'ep:shopping-bag',
  activity: 'ep:gift',
  study: 'ep:reading'
}

const typeIconClassMap: Record<NotificationType, string> = {
  system: 'system',
  order: 'order',
  activity: 'activity',
  study: 'study'
}

const typeTextMap: Record<NotificationType, string> = {
  system: '系统',
  order: '订单',
  activity: '活动',
  study: '学习'
}

const tagTypeMap: Record<NotificationType, '' | 'success' | 'warning' | 'danger' | 'info'> = {
  system: 'primary',
  order: 'warning',
  activity: 'danger',
  study: 'success'
}

const getTypeIcon = (type: NotificationType) => typeIconMap[type] || 'ep:bell'
const getTypeIconClass = (type: NotificationType) => typeIconClassMap[type] || 'default'
const getTypeText = (type: NotificationType) => typeTextMap[type] || '其他'
const getTagType = (type: NotificationType) => tagTypeMap[type] || 'info'

/* ==================== 方法定义 ==================== */
const refresh = async () => {
  await notificationStore.fetchNotifications(1, true)
}

defineExpose({ refresh })

/* ==================== 事件处理 ==================== */
const handleFilterChange = (value: string) => {
  let type: NotificationType | 'all' = 'all'
  let isRead: boolean | null = null

  if (value === 'unread') {
    isRead = false
  } else if (value === 'system' || value === 'order' || value === 'activity' || value === 'study') {
    type = value as NotificationType
  }

  notificationStore.setFilter({ type, isRead })
  selectedItems.value = []
}

const handleItemClick = async (item: NotificationVO) => {
  /* 标记为已读 */
  if (!item.isRead) {
    await notificationStore.markOneAsRead(item.id)
  }
}

const handleAction = (item: NotificationVO) => {
  if (item.actionUrl) {
    navigateTo(item.actionUrl)
  }
}

const handleMarkAsRead = async (item: NotificationVO) => {
  await notificationStore.markOneAsRead(item.id)
  message.success('已标记为已读')
}

const handleMarkAllAsRead = async () => {
  await notificationStore.markAllAsRead()
  message.success('全部消息已标记为已读')
  selectedItems.value = []
}

const handleDelete = async (item: NotificationVO) => {
  try {
    await message.confirm('确定删除这条消息吗？', '确认删除')
    await notificationStore.deleteNotifications([item.id])
    message.success('删除成功')
  } catch {
    /* 用户取消 */
  }
}

const handleClearRead = async () => {
  try {
    await message.confirm('确定清空所有已读消息吗？', '确认清空')
    await notificationStore.clearRead()
    message.success('已清空已读消息')
    selectedItems.value = []
  } catch {
    /* 用户取消 */
  }
}

const handleBatchRead = async () => {
  await notificationStore.markAsRead(selectedItems.value)
  message.success('批量标记已读成功')
  selectedItems.value = []
}

const handleBatchDelete = async () => {
  try {
    await message.confirm(`确定删除选中的 ${selectedItems.value.length} 条消息吗？`, '确认删除')
    await notificationStore.deleteNotifications(selectedItems.value)
    message.success('批量删除成功')
    selectedItems.value = []
  } catch {
    /* 用户取消 */
  }
}

const handleLoadMore = () => {
  notificationStore.loadMore()
}

/* ==================== 初始化 ==================== */
onMounted(() => {
  notificationStore.fetchNotifications(1, true)
})
</script>

<style scoped lang="scss">
/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.filter-section {
  flex: 1;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  margin-right: 4px;
  font-size: 14px;
}

/* 加载状态 */
.loading-state {
  padding: 24px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--el-fill-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: var(--el-color-primary);
  margin-bottom: 24px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* 消息列表 */
.notification-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--el-border-color);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  &.is-unread {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-7);
  }
}

.item-main {
  display: flex;
  gap: 16px;
}

.type-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;

  &.system {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  &.order {
    background: var(--el-color-warning-light-9);
    color: var(--el-color-warning);
  }

  &.activity {
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
  }

  &.study {
    background: var(--el-color-success-light-9);
    color: var(--el-color-success);
  }

  &.default {
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
  }
}

.item-content {
  flex: 1;
  min-width: 0;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.type-tag {
  flex-shrink: 0;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.is-read {
    font-weight: 400;
    color: var(--el-text-color-regular);
  }
}

.priority-tag {
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.item-time {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--el-color-danger);
  flex-shrink: 0;
}

.item-desc {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &.is-read {
    color: var(--el-text-color-secondary);
  }
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-icon {
  margin-left: 4px;
  font-size: 12px;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 24px 0 8px;
}

/* 批量操作栏 */
.batch-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 50px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  border: 1px solid var(--el-border-color-lighter);
}

.batch-text {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-section {
    width: 100%;
    justify-content: flex-end;
  }

  .content-header {
    flex-wrap: wrap;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .item-main {
    gap: 12px;
  }

  .type-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .batch-bar {
    left: 12px;
    right: 12px;
    transform: none;
    flex-direction: column;
    gap: 12px;
    border-radius: 16px;
    padding: 16px;
  }

  .batch-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
