import { defineStore } from 'pinia'
import type {
  NotificationVO,
  NotificationStatsVO,
  NotificationType,
  NotificationSettingVO
} from '~/types/notification'
import * as NotificationApi from '~/api/notification'

/* ==================== Mock 数据 ==================== */

const mockNotifications: NotificationVO[] = [
  {
    id: 1,
    type: 'system',
    title: '欢迎使用学次元在线题库',
    content: '感谢您注册学次元，开始您的学习之旅吧！这里提供丰富的题库资源和智能学习工具。',
    priority: 'normal',
    isRead: false,
    createTime: Date.now() - 1000 * 60 * 5, /* 5分钟前 */
    sender: '系统管理员',
    senderAvatar: '',
    actionUrl: '/',
    actionText: '立即体验'
  },
  {
    id: 2,
    type: 'order',
    title: '订单支付成功',
    content: '您购买的《2024年考研数学真题详解》订单已支付成功，祝您学习愉快！',
    priority: 'high',
    isRead: false,
    createTime: Date.now() - 1000 * 60 * 60 * 2, /* 2小时前 */
    actionUrl: '/account/orders',
    actionText: '查看订单'
  },
  {
    id: 3,
    type: 'activity',
    title: '限时优惠活动开始',
    content: '全场题库8折优惠，活动仅剩3天，抓住机会提升成绩！',
    priority: 'high',
    isRead: false,
    createTime: Date.now() - 1000 * 60 * 60 * 5, /* 5小时前 */
    actionUrl: '/qbank',
    actionText: '去抢购'
  },
  {
    id: 4,
    type: 'study',
    title: '学习提醒',
    content: '您已连续学习3天，继续保持！今日还有每日练习待完成。',
    priority: 'normal',
    isRead: true,
    readTime: Date.now() - 1000 * 60 * 30,
    createTime: Date.now() - 1000 * 60 * 60 * 24, /* 1天前 */
    actionUrl: '/study/practice/daily',
    actionText: '去做题'
  },
  {
    id: 5,
    type: 'system',
    title: '账户安全提醒',
    content: '检测到您的账户在新设备登录，如非本人操作，请及时修改密码。',
    priority: 'high',
    isRead: true,
    readTime: Date.now() - 1000 * 60 * 60 * 2,
    createTime: Date.now() - 1000 * 60 * 60 * 26, /* 26小时前 */
    actionUrl: '/account/security',
    actionText: '查看安全'
  },
  {
    id: 6,
    type: 'order',
    title: '订单发货通知',
    content: '您购买的《英语六级词汇书》已发货，快递单号：SF1234567890',
    priority: 'normal',
    isRead: true,
    readTime: Date.now() - 1000 * 60 * 60 * 4,
    createTime: Date.now() - 1000 * 60 * 60 * 28 /* 28小时前 */
  },
  {
    id: 7,
    type: 'activity',
    title: '新功能上线',
    content: '错题本功能全新升级，支持智能分类和薄弱点分析，快来看看吧！',
    priority: 'normal',
    isRead: true,
    readTime: Date.now() - 1000 * 60 * 60 * 12,
    createTime: Date.now() - 1000 * 60 * 60 * 48 /* 2天前 */
  },
  {
    id: 8,
    type: 'study',
    title: '模拟考试成绩出炉',
    content: '您刚完成的《2024年考研数学模拟卷》成绩为85分，击败了78%的考生！',
    priority: 'high',
    isRead: false,
    createTime: Date.now() - 1000 * 60 * 60 * 3, /* 3小时前 */
    actionUrl: '/exam/report/123',
    actionText: '查看报告'
  },
  {
    id: 9,
    type: 'system',
    title: '系统维护通知',
    content: '系统将于本周日凌晨2:00-4:00进行维护，届时可能影响正常使用。',
    priority: 'normal',
    isRead: true,
    readTime: Date.now() - 1000 * 60 * 60 * 24,
    createTime: Date.now() - 1000 * 60 * 60 * 72 /* 3天前 */
  },
  {
    id: 10,
    type: 'study',
    title: '连续打卡7天',
    content: '恭喜您连续打卡7天，获得"学习达人"称号！继续保持！',
    priority: 'normal',
    isRead: false,
    createTime: Date.now() - 1000 * 60 * 60 * 6, /* 6小时前 */
    actionUrl: '/account/statistics',
    actionText: '查看成就'
  }
]

const mockStats: NotificationStatsVO = {
  total: 10,
  unread: 5,
  system: 3,
  order: 2,
  activity: 2,
  study: 3
}

const mockSettings: NotificationSettingVO[] = [
  { type: 'system', enabled: true, pushEnabled: true },
  { type: 'order', enabled: true, pushEnabled: true },
  { type: 'activity', enabled: true, pushEnabled: false },
  { type: 'study', enabled: true, pushEnabled: true }
]

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
interface NotificationState {
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
      console.warn('获取消息统计失败，使用 mock 数据:', error)
      /* 使用 mock 数据 */
      stats.value = { ...mockStats }
      return stats.value
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
      } else {
        stats.value = { ...mockStats, unread: count }
      }
      return count
    } catch (error) {
      console.warn('获取未读数量失败，使用 mock 数据:', error)
      /* 使用 mock 数据 */
      if (!stats.value) {
        stats.value = { ...mockStats }
      }
      return stats.value.unread
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
      /* 模拟 API 调用延迟 */
      await new Promise(resolve => setTimeout(resolve, 300))

      let result = [...mockNotifications]

      /* 应用筛选 */
      if (filter.value.type !== 'all') {
        result = result.filter(item => item.type === filter.value.type)
      }
      if (filter.value.isRead !== null) {
        result = result.filter(item => item.isRead === filter.value.isRead)
      }

      /* 分页 */
      const start = (page - 1) * pageSize.value
      const end = start + pageSize.value
      const paginatedList = result.slice(start, end)

      if (reset) {
        notifications.value = paginatedList
      } else {
        notifications.value = [...notifications.value, ...paginatedList]
      }

      total.value = result.length
      currentPage.value = page
      hasMore.value = notifications.value.length < result.length

      return { list: paginatedList, total: result.length }
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
      console.warn('获取消息设置失败，使用 mock 数据:', error)
      /* 使用 mock 数据 */
      settings.value = [...mockSettings]
      return settings.value
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
      console.warn('更新消息设置失败，仅更新本地状态:', error)
      /* 仅更新本地状态 */
      settings.value = [...newSettings]
      return true
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
