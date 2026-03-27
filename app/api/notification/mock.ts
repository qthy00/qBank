/**
 * 消息通知 Mock 数据
 * 用于开发和演示环境
 */
import type {
  NotificationVO,
  NotificationStatsVO,
  NotificationSettingVO,
  NotificationPageVO,
  NotificationQueryVO
} from '~/types/notification'

/* ==================== Mock 数据 ==================== */

export const mockNotifications: NotificationVO[] = [
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

export const mockStats: NotificationStatsVO = {
  total: 10,
  unread: 5,
  system: 3,
  order: 2,
  activity: 2,
  study: 3
}

export const mockSettings: NotificationSettingVO[] = [
  { type: 'system', enabled: true, pushEnabled: true },
  { type: 'order', enabled: true, pushEnabled: true },
  { type: 'activity', enabled: true, pushEnabled: false },
  { type: 'study', enabled: true, pushEnabled: true }
]

/* ==================== Mock 数据查询函数 ==================== */

/**
 * 获取消息分页列表 Mock
 */
export const mockGetNotificationPage = (query: NotificationQueryVO): NotificationPageVO => {
  let result = [...mockNotifications]

  /* 应用筛选 */
  if (query.type) {
    result = result.filter(item => item.type === query.type)
  }
  if (query.isRead !== undefined) {
    result = result.filter(item => item.isRead === query.isRead)
  }

  /* 分页 */
  const page = query.page || 1
  const pageSize = query.pageSize || 20
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    list: result.slice(start, end),
    total: result.length
  }
}

/**
 * 获取消息详情 Mock
 */
export const mockGetNotificationDetail = (id: number): NotificationVO | null => {
  return mockNotifications.find(item => item.id === id) || null
}

/**
 * 获取未读消息数量 Mock
 */
export const mockGetUnreadCount = (): number => {
  return mockNotifications.filter(item => !item.isRead).length
}

/**
 * 获取消息统计信息 Mock
 */
export const mockGetNotificationStats = (): NotificationStatsVO => {
  const stats: NotificationStatsVO = {
    total: mockNotifications.length,
    unread: 0,
    system: 0,
    order: 0,
    activity: 0,
    study: 0
  }

  mockNotifications.forEach(item => {
    if (!item.isRead) {
      stats.unread++
    }
    stats[item.type]++
  })

  return stats
}

/**
 * 标记消息为已读 Mock
 */
export const mockMarkAsRead = (ids: number[]): boolean => {
  mockNotifications.forEach(item => {
    if (ids.includes(item.id)) {
      item.isRead = true
      item.readTime = Date.now()
    }
  })
  return true
}

/**
 * 标记所有消息为已读 Mock
 */
export const mockMarkAllAsRead = (): boolean => {
  mockNotifications.forEach(item => {
    if (!item.isRead) {
      item.isRead = true
      item.readTime = Date.now()
    }
  })
  return true
}

/**
 * 删除消息 Mock
 */
export const mockDeleteNotifications = (ids: number[]): boolean => {
  const indexList = mockNotifications.map((item, index) => ({ id: item.id, index }))
  const indicesToRemove = indexList
    .filter(item => ids.includes(item.id))
    .map(item => item.index)
    .sort((a, b) => b - a)

  indicesToRemove.forEach(index => {
    mockNotifications.splice(index, 1)
  })

  return true
}

/**
 * 清空已读消息 Mock
 */
export const mockClearReadNotifications = (): boolean => {
  for (let i = mockNotifications.length - 1; i >= 0; i--) {
    if (mockNotifications[i].isRead) {
      mockNotifications.splice(i, 1)
    }
  }
  return true
}

/**
 * 获取消息设置 Mock
 */
export const mockGetNotificationSettings = (): NotificationSettingVO[] => {
  return [...mockSettings]
}

/**
 * 更新消息设置 Mock
 */
export const mockUpdateNotificationSettings = (settings: NotificationSettingVO[]): boolean => {
  mockSettings.length = 0
  mockSettings.push(...settings)
  return true
}
