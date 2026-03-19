<template>
  <div class="notification-bell relative">
    <!-- 铃铛图标 -->
    <el-badge
      :value="unreadCount"
      :hidden="unreadCount === 0"
      :max="99"
      class="cursor-pointer"
      @click="handleClick"
    >
      <div
        class="bell-icon w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        :class="[
          isScrolled
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            : 'bg-white/20 hover:bg-white/30 text-white'
        ]"
      >
        <Icon
          name="ep:bell"
          :size="20"
          class="transition-transform duration-300"
          :class="{ 'animate-swing': hasUnread }"
        />
      </div>
    </el-badge>

    <!-- 消息下拉面板 -->
    <el-popover
      v-model:visible="popoverVisible"
      :width="360"
      trigger="click"
      placement="bottom-end"
      popper-class="notification-popover"
    >
      <template #reference>
        <span class="hidden">trigger</span>
      </template>

      <div class="notification-panel">
        <!-- 头部 -->
        <div class="flex items-center justify-between p-3 border-b border-gray-100">
          <h3 class="font-semibold text-gray-800">消息通知</h3>
          <div class="flex items-center gap-2">
            <el-button
              v-if="hasUnread"
              type="primary"
              link
              size="small"
              @click="markAllAsRead"
            >
              全部已读
            </el-button>
            <el-button
              type="info"
              link
              size="small"
              @click="goToMessageCenter"
            >
              查看全部
            </el-button>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="notification-list max-h-[400px] overflow-y-auto">
          <!-- 加载状态 -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <el-loading-spinner />
          </div>

          <!-- 空状态 -->
          <div
            v-else-if="notifications.length === 0"
            class="flex flex-col items-center justify-center py-8 text-gray-400"
          >
            <Icon name="ep:bell" :size="48" class="mb-2 opacity-50" />
            <p>暂无消息</p>
          </div>

          <!-- 消息项 -->
          <template v-else>
            <div
              v-for="item in notifications.slice(0, 5)"
              :key="item.id"
              class="notification-item p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'bg-blue-50/50': !item.isRead }"
              @click="handleMessageClick(item)"
            >
              <div class="flex gap-3">
                <!-- 类型图标 -->
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getTypeIconClass(item.type)"
                >
                  <Icon :name="getTypeIcon(item.type)" :size="18" />
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <h4
                      class="font-medium text-sm truncate"
                      :class="{ 'text-gray-800': !item.isRead, 'text-gray-600': item.isRead }"
                    >
                      {{ item.title }}
                    </h4>
                    <span class="text-xs text-gray-400 ml-2">{{ formatPast(item.createTime) }}</span>
                  </div>
                  <p class="text-xs text-gray-500 line-clamp-2">{{ item.content }}</p>
                </div>

                <!-- 未读标记 -->
                <div v-if="!item.isRead" class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-red-500" />
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 底部 -->
        <div class="p-3 border-t border-gray-100 bg-gray-50/50">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>共 {{ stats?.total || 0 }} 条消息</span>
            <span>{{ stats?.unread || 0 }} 条未读</span>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import type { NotificationVO, NotificationType } from '~/types/notification'
import { useNotificationStore } from '~/stores/notification'
import { formatPast } from '~/utils/formatTime'

interface Props {
  isScrolled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isScrolled: false
})

const notificationStore = useNotificationStore()
const router = useRouter()
const message = useMessage()

const popoverVisible = ref(false)

const { notifications, stats, loading, unreadCount, hasUnread } = storeToRefs(notificationStore)

/* ==================== 图标映射 ==================== */
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

const getTypeIcon = (type: NotificationType) => typeIconMap[type] || 'ep:bell'
const getTypeIconClass = (type: NotificationType) => typeIconClassMap[type] || 'bg-gray-100 text-gray-600'

/* ==================== 事件处理 ==================== */
const handleClick = () => {
  popoverVisible.value = true
  /* 加载消息列表 */
  notificationStore.fetchNotifications(1, true)
}

const handleMessageClick = async (item: NotificationVO) => {
  /* 标记为已读 */
  if (!item.isRead) {
    await notificationStore.markOneAsRead(item.id)
  }

  /* 如果有跳转链接 */
  if (item.actionUrl) {
    router.push(item.actionUrl)
    popoverVisible.value = false
  } else {
    /* 显示消息详情 */
    message.info(item.content)
  }
}

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
  message.success('全部消息已标记为已读')
}

const goToMessageCenter = () => {
  router.push('/account/messages')
  popoverVisible.value = false
}

/* ==================== 生命周期 ==================== */
onMounted(() => {
  /* 初始化时获取未读数量 */
  notificationStore.fetchUnreadCount()
  /* 初始化WebSocket（可选） */
  // notificationStore.initWebSocket()
})

onUnmounted(() => {
  notificationStore.closeWebSocket()
})
</script>

<style scoped>
.bell-icon {
  position: relative;
}

.animate-swing {
  animation: swing 2s ease-in-out infinite;
}

@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(15deg); }
  20% { transform: rotate(-10deg); }
  30% { transform: rotate(5deg); }
  40% { transform: rotate(-5deg); }
  50% { transform: rotate(0deg); }
}

.notification-item {
  border-bottom: 1px solid #f3f4f6;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f9fafb;
}
</style>
