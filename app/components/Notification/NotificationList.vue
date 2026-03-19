<template>
  <div class="notification-list">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm">
      <!-- 筛选 -->
      <div class="flex items-center gap-3">
        <el-radio-group v-model="currentFilter" @change="handleFilterChange">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="unread">未读</el-radio-button>
          <el-radio-button label="system">系统</el-radio-button>
          <el-radio-button label="order">订单</el-radio-button>
          <el-radio-button label="activity">活动</el-radio-button>
          <el-radio-button label="study">学习</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 操作 -->
      <div class="flex items-center gap-2">
        <el-button
          v-if="hasUnread"
          type="primary"
          plain
          :icon="Check"
          @click="handleMarkAllAsRead"
        >
          全部已读
        </el-button>
        <el-button
          v-if="hasReadItems"
          type="danger"
          plain
          :icon="Delete"
          @click="handleClearRead"
        >
          清空已读
        </el-button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="bg-white rounded-lg shadow-sm">
      <!-- 加载中 -->
      <div v-if="loading && notifications.length === 0" class="flex justify-center items-center py-12">
        <el-loading-spinner />
      </div>

      <!-- 空状态 -->
      <div
        v-else-if="notifications.length === 0"
        class="flex flex-col items-center justify-center py-16 text-gray-400"
      >
        <Icon name="ep:bell" :size="64" class="mb-4 opacity-30" />
        <p class="text-lg">暂无消息</p>
        <p class="text-sm mt-2">当有新消息时会显示在这里</p>
      </div>

      <!-- 列表 -->
      <template v-else>
        <div
          v-for="item in notifications"
          :key="item.id"
          class="notification-item p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-blue-50/30': !item.isRead }"
        >
          <div class="flex gap-4">
            <!-- 选择框 -->
            <el-checkbox v-model="selectedItems" :label="item.id" class="mt-1" />

            <!-- 类型图标 -->
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="getTypeIconClass(item.type)"
            >
              <Icon :name="getTypeIcon(item.type)" :size="24" />
            </div>

            <!-- 内容区域 -->
            <div class="flex-1 min-w-0 cursor-pointer" @click="handleItemClick(item)">
              <!-- 标题行 -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <el-tag
                    :type="getTagType(item.type)"
                    size="small"
                    effect="light"
                  >
                    {{ getTypeText(item.type) }}
                  </el-tag>
                  <h4
                    class="font-semibold text-base"
                    :class="{ 'text-gray-800': !item.isRead, 'text-gray-600': item.isRead }"
                  >
                    {{ item.title }}
                  </h4>
                  <el-tag
                    v-if="item.priority === 'high'"
                    type="danger"
                    size="small"
                    effect="dark"
                  >
                    重要
                  </el-tag>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">{{ formatPast(item.createTime) }}</span>
                  <span v-if="!item.isRead" class="w-2 h-2 rounded-full bg-red-500" />
                </div>
              </div>

              <!-- 内容 -->
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ item.content }}</p>

              <!-- 操作按钮 -->
              <div class="flex items-center gap-2">
                <el-button
                  v-if="item.actionUrl"
                  type="primary"
                  link
                  size="small"
                  @click.stop="handleAction(item)"
                >
                  {{ item.actionText || '查看详情' }}
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

        <!-- 加载更多 -->
        <div v-if="hasMore" class="p-4 text-center">
          <el-button :loading="loading" @click="handleLoadMore">
            加载更多
          </el-button>
        </div>
      </template>
    </div>

    <!-- 批量操作栏 -->
    <div
      v-if="selectedItems.length > 0"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full px-6 py-3 flex items-center gap-4 z-50"
    >
      <span class="text-sm text-gray-600">已选择 {{ selectedItems.length }} 项</span>
      <el-button type="primary" size="small" @click="handleBatchRead">
        标记已读
      </el-button>
      <el-button type="danger" size="small" @click="handleBatchDelete">
        批量删除
      </el-button>
      <el-button type="info" size="small" @click="selectedItems = []">
        取消选择
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Delete } from '@element-plus/icons-vue'
import type { NotificationVO, NotificationType } from '~/types/notification'
import { useNotificationStore } from '~/stores/notification'
import { formatPast } from '~/utils/formatTime'

const notificationStore = useNotificationStore()
const router = useRouter()
const message = useMessage()

const {
  notifications,
  loading,
  hasMore,
  hasUnread,
  stats
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
  system: 'bg-blue-100 text-blue-600',
  order: 'bg-amber-100 text-amber-600',
  activity: 'bg-purple-100 text-purple-600',
  study: 'bg-green-100 text-green-600'
}

const typeTextMap: Record<NotificationType, string> = {
  system: '系统',
  order: '订单',
  activity: '活动',
  study: '学习'
}

const tagTypeMap: Record<NotificationType, '' | 'success' | 'warning' | 'danger' | 'info'> = {
  system: 'info',
  order: 'warning',
  activity: 'danger',
  study: 'success'
}

const getTypeIcon = (type: NotificationType) => typeIconMap[type] || 'ep:bell'
const getTypeIconClass = (type: NotificationType) => typeIconClassMap[type] || 'bg-gray-100 text-gray-600'
const getTypeText = (type: NotificationType) => typeTextMap[type] || '其他'
const getTagType = (type: NotificationType) => tagTypeMap[type] || ''

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
    router.push(item.actionUrl)
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

<style scoped>
.notification-item {
  transition: background-color 0.2s ease;
}

.notification-item:last-child {
  border-bottom: none;
}
</style>
