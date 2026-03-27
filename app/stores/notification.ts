import { defineStore } from 'pinia'
import type {
  NotificationVO,
  NotificationStatsVO,
  NotificationType,
  NotificationSettingVO
} from '~/types/notification'
import * as NotificationApi from '~/api/notification'

/**
 * 通知筛选条件
 */
interface FilterState {
  type: NotificationType | 'all'
  isRead: boolean | null
}

/**
 * 通知Store状态
 */
interface _NotificationState {
  notifications: NotificationVO[]
  stats: NotificationStatsVO | null
  settings: NotificationSettingVO[]
  loading: boolean
  currentPage: number
  pageSize: number
  total: number
  filter: FilterState
  hasMore: boolean
  wsConnected: boolean
  wsInstance: WebSocket | null
}

export const useNotificationStore = defineStore('notification', () => {
  /* ==================== State ==================== */
  const notifications = ref<NotificationVO[]>([])
  const stats = ref<NotificationStatsVO | null>(null)
  const settings = ref<NotificationSettingVO[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  const filter = ref<FilterState>({
    type: 'all',
    isRead: null
  })
  const hasMore = ref(true)
  const wsConnected = ref(false)
  const wsInstance = ref<WebSocket | null>(null)

  /* ==================== Getters ==================== */
  /**
   * 未读消息数量
   */
  const unreadCount = computed(() => stats.value?.unread ?? 0)

  /**
   * 是否有未读消息
   */
  const hasUnread = computed(() => unreadCount.value > 0)

  /**
   * 按类型筛选后的消息
   */
  const filteredNotifications = computed(() => {
    let result = notifications.value
    if (filter.value.type !== 'all') {
      result = result.filter(item => item.type === filter.value.type)
    }
    if (filter.value.isRead !== null) {
      result = result.filter(item => item.isRead === filter.value.isRead)
    }
    return result
  })

  /**
   * 未读消息列表
   */
  const unreadNotifications = computed(() =>
    notifications.value.filter(item => !item.isRead)
  )

  /* ==================== Actions ==================== */

  /**
   * 获取消息统计
   */
  const fetchStats = async () => {
    try {
      const res = await NotificationApi.getNotificationStats()
      stats.value = res
      return res
    } catch (error) {
      console.error('获取消息统计失败:', error)
      throw error
    }
  }

  /**
   * 获取未读数量
   */
  const fetchUnreadCount = async () => {
    try {
      const count = await NotificationApi.getUnreadCount()
      if (stats.value) {
        stats.value.unread = count
      }
      return count
    } catch (error) {
      console.error('获取未读数量失败:', error)
      throw error
    }
  }

  /**
   * 获取消息列表
   * @param page 页码
   * @param reset 是否重置列表
   */
  const fetchNotifications = async (page: number = 1, reset: boolean = false) => {
    if (loading.value) return

    loading.value = true
    try {
      const query = {
        page,
        pageSize: pageSize.value,
        type: filter.value.type === 'all' ? undefined : filter.value.type,
        isRead: filter.value.isRead
      }

      const res = await NotificationApi.getNotificationPage(query)

      if (reset) {
        notifications.value = res.list
      } else {
        notifications.value = [...notifications.value, ...res.list]
      }

      total.value = res.total
      currentPage.value = page
      hasMore.value = notifications.value.length < res.total

      return res
    } catch (error) {
      console.error('获取消息列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载更多消息
   */
  const loadMore = async () => {
    if (!hasMore.value || loading.value) return
    await fetchNotifications(currentPage.value + 1)
  }

  /**
   * 标记消息已读
   * @param ids 消息ID列表
   */
  const markAsRead = async (ids: number[]) => {
    try {
      await NotificationApi.markAsRead(ids)
      /* 更新本地状态 */
      notifications.value.forEach(item => {
        if (ids.includes(item.id)) {
          item.isRead = true
          item.readTime = Date.now()
        }
      })
      /* 更新统计 */
      await fetchStats()
      return true
    } catch (error) {
      console.error('标记已读失败:', error)
      return false
    }
  }

  /**
   * 标记单条消息已读
   * @param id 消息ID
   */
  const markOneAsRead = async (id: number) => {
    return await markAsRead([id])
  }

  /**
   * 标记所有已读
   */
  const markAllAsRead = async () => {
    try {
      await NotificationApi.markAllAsRead()
      /* 更新本地状态 */
      notifications.value.forEach(item => {
        if (!item.isRead) {
          item.isRead = true
          item.readTime = Date.now()
        }
      })
      /* 更新统计 */
      if (stats.value) {
        stats.value.unread = 0
      }
      return true
    } catch (error) {
      console.error('标记全部已读失败:', error)
      return false
    }
  }

  /**
   * 删除消息
   * @param ids 消息ID列表
   */
  const deleteNotifications = async (ids: number[]) => {
    try {
      await NotificationApi.deleteNotifications({ ids })
      /* 从本地列表移除 */
      notifications.value = notifications.value.filter(item => !ids.includes(item.id))
      /* 更新统计 */
      await fetchStats()
      return true
    } catch (error) {
      console.error('删除消息失败:', error)
      return false
    }
  }

  /**
   * 清空已读消息
   */
  const clearRead = async () => {
    try {
      await NotificationApi.clearReadNotifications()
      /* 从本地列表移除已读消息 */
      notifications.value = notifications.value.filter(item => !item.isRead)
      /* 更新统计 */
      await fetchStats()
      return true
    } catch (error) {
      console.error('清空已读消息失败:', error)
      return false
    }
  }

  /**
   * 设置筛选条件
   */
  const setFilter = (newFilter: Partial<FilterState>) => {
    filter.value = { ...filter.value, ...newFilter }
    /* 重置分页并重新加载 */
    fetchNotifications(1, true)
  }

  /**
   * 重置筛选
   */
  const resetFilter = () => {
    filter.value = {
      type: 'all',
      isRead: null
    }
    fetchNotifications(1, true)
  }

  /**
   * 添加新消息（用于WebSocket接收）
   * @param notification 消息对象
   */
  const addNotification = (notification: NotificationVO) => {
    /* 插入到列表开头 */
    notifications.value.unshift(notification)
    /* 更新统计 */
    if (stats.value) {
      stats.value.unread++
      stats.value.total++
      const typeKey = notification.type as keyof NotificationStatsVO
      if (typeof stats.value[typeKey] === 'number') {
        (stats.value[typeKey] as number)++
      }
    }
  }

  /**
   * 获取消息设置
   */
  const fetchSettings = async () => {
    try {
      const res = await NotificationApi.getNotificationSettings()
      settings.value = res
      return res
    } catch (error) {
      console.error('获取消息设置失败:', error)
      throw error
    }
  }

  /**
   * 更新消息设置
   */
  const updateSettings = async (newSettings: NotificationSettingVO[]) => {
    try {
      await NotificationApi.updateNotificationSettings(newSettings)
      settings.value = newSettings
      return true
    } catch (error) {
      console.error('更新消息设置失败:', error)
      throw error
    }
  }

  /**
   * 初始化WebSocket连接
   */
  const initWebSocket = () => {
    if (!import.meta.client) return
    if (wsInstance.value) return

    try {
      /* 获取当前用户的token */
      const { accessToken } = useToken()
      if (!accessToken.value) return

      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/app-api/member/notification/ws?token=${accessToken.value}`

      wsInstance.value = new WebSocket(wsUrl)

      wsInstance.value.onopen = () => {
        wsConnected.value = true
        console.log('消息WebSocket连接成功')
      }

      wsInstance.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'notification' && data.data) {
            addNotification(data.data)
            /* 显示新消息提示 */
            const message = useMessage()
            message.info(`收到新消息: ${data.data.title}`)
          }
        } catch (error) {
          console.error('WebSocket消息解析失败:', error)
        }
      }

      wsInstance.value.onerror = (error) => {
        console.error('WebSocket错误:', error)
        wsConnected.value = false
      }

      wsInstance.value.onclose = () => {
        wsConnected.value = false
        wsInstance.value = null
        /* 5秒后尝试重连 */
        setTimeout(() => {
          if (!wsInstance.value) {
            initWebSocket()
          }
        }, 5000)
      }
    } catch (error) {
      console.error('初始化WebSocket失败:', error)
    }
  }

  /**
   * 关闭WebSocket连接
   */
  const closeWebSocket = () => {
    if (wsInstance.value) {
      wsInstance.value.close()
      wsInstance.value = null
      wsConnected.value = false
    }
  }

  /**
   * 重置状态
   */
  const resetState = () => {
    notifications.value = []
    stats.value = null
    settings.value = []
    loading.value = false
    currentPage.value = 1
    total.value = 0
    filter.value = {
      type: 'all',
      isRead: null
    }
    hasMore.value = true
    closeWebSocket()
  }

  return {
    /* State */
    notifications,
    stats,
    settings,
    loading,
    currentPage,
    pageSize,
    total,
    filter,
    hasMore,
    wsConnected,
    /* Getters */
    unreadCount,
    hasUnread,
    filteredNotifications,
    unreadNotifications,
    /* Actions */
    fetchStats,
    fetchUnreadCount,
    fetchNotifications,
    loadMore,
    markAsRead,
    markOneAsRead,
    markAllAsRead,
    deleteNotifications,
    clearRead,
    setFilter,
    resetFilter,
    addNotification,
    fetchSettings,
    updateSettings,
    initWebSocket,
    closeWebSocket,
    resetState
  }
})
