/**
 * 消息通知类型
 */
export type NotificationType = 'system' | 'order' | 'activity' | 'study'

/**
 * 消息状态
 */
export type NotificationStatus = 'read' | 'unread'

/**
 * 消息优先级
 */
export type NotificationPriority = 'low' | 'normal' | 'high'

/**
 * 消息VO (View Object)
 */
export interface NotificationVO {
  id: number
  type: NotificationType
  title: string
  content: string
  priority: NotificationPriority
  isRead: boolean
  readTime?: number
  createTime: number
  sender?: string
  senderAvatar?: string
  actionUrl?: string
  actionText?: string
  extraData?: Record<string, any>
}

/**
 * 消息分页查询结果
 */
export interface NotificationPageVO {
  list: NotificationVO[]
  total: number
}

/**
 * 消息查询参数
 */
export interface NotificationQueryVO {
  type?: NotificationType
  isRead?: boolean
  page?: number
  pageSize?: number
}

/**
 * 消息统计信息
 */
export interface NotificationStatsVO {
  total: number
  unread: number
  system: number
  order: number
  activity: number
  study: number
}

/**
 * 消息设置
 */
export interface NotificationSettingVO {
  id?: number
  type: NotificationType
  enabled: boolean
  pushEnabled: boolean
  soundEnabled: boolean
}

/**
 * 更新消息状态请求
 */
export interface UpdateNotificationStatusReqVO {
  ids: number[]
  isRead: boolean
}

/**
 * 批量删除消息请求
 */
export interface DeleteNotificationsReqVO {
  ids: number[]
}

/**
 * WebSocket消息推送
 */
export interface WebSocketNotificationVO {
  type: 'notification'
  data: NotificationVO
  timestamp: number
}
