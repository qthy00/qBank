import type {
  NotificationVO,
  NotificationPageVO,
  NotificationQueryVO,
  NotificationStatsVO,
  DeleteNotificationsReqVO,
  NotificationSettingVO
} from '~/types/notification'
import { httpGet, httpPost, httpPut, httpDelete } from '~/composables/useHttp'
import {
  mockGetNotificationPage,
  mockGetNotificationDetail,
  mockGetUnreadCount,
  mockGetNotificationStats,
  mockMarkAsRead,
  mockMarkAllAsRead,
  mockDeleteNotifications,
  mockClearReadNotifications,
  mockGetNotificationSettings,
  mockUpdateNotificationSettings
} from './mock'

/* Mock 数据开关 - 开发环境启用 */
const USE_MOCK = import.meta.dev || import.meta.client

/**
 * 获取消息分页列表
 * @param query 查询参数
 */
export const getNotificationPage = async (query: NotificationQueryVO): Promise<NotificationPageVO> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockGetNotificationPage(query)
  }
  return await httpGet<NotificationPageVO>('NotificationPage', '/member/notification/page', { query })
}

/**
 * 获取消息详情
 * @param id 消息ID
 */
export const getNotificationDetail = async (id: number): Promise<NotificationVO | null> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockGetNotificationDetail(id)
  }
  return await httpGet<NotificationVO>('NotificationDetail', `/member/notification/get/${id}`)
}

/**
 * 获取未读消息数量
 */
export const getUnreadCount = async (): Promise<number> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockGetUnreadCount()
  }
  return await httpGet<number>('NotificationUnreadCount', '/member/notification/unread-count')
}

/**
 * 获取消息统计信息
 */
export const getNotificationStats = async (): Promise<NotificationStatsVO> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockGetNotificationStats()
  }
  return await httpGet<NotificationStatsVO>('NotificationStats', '/member/notification/stats')
}

/**
 * 标记消息为已读
 * @param ids 消息ID列表
 */
export const markAsRead = async (ids: number[]): Promise<boolean> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockMarkAsRead(ids)
  }
  await httpPut('NotificationMarkRead', '/member/notification/mark-read', { ids })
  return true
}

/**
 * 标记所有消息为已读
 */
export const markAllAsRead = async (): Promise<boolean> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockMarkAllAsRead()
  }
  await httpPut('NotificationMarkAllRead', '/member/notification/mark-all-read', {})
  return true
}

/**
 * 删除消息
 * @param data 删除参数
 */
export const deleteNotifications = async (data: DeleteNotificationsReqVO): Promise<boolean> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockDeleteNotifications(data.ids)
  }
  await httpDelete('NotificationDelete', '/member/notification/delete', { body: data })
  return true
}

/**
 * 清空已读消息
 */
export const clearReadNotifications = async (): Promise<boolean> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockClearReadNotifications()
  }
  await httpDelete('NotificationClearRead', '/member/notification/clear-read')
  return true
}

/**
 * 获取消息设置
 */
export const getNotificationSettings = async (): Promise<NotificationSettingVO[]> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockGetNotificationSettings()
  }
  return await httpGet<NotificationSettingVO[]>('NotificationSettings', '/member/notification/settings')
}

/**
 * 更新消息设置
 * @param data 设置数据
 */
export const updateNotificationSettings = async (data: NotificationSettingVO[]): Promise<boolean> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockUpdateNotificationSettings(data)
  }
  await httpPut('NotificationUpdateSettings', '/member/notification/settings', data)
  return true
}

/**
 * 订阅消息推送（用于WebSocket）
 */
export const subscribeNotifications = async (): Promise<boolean> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return true
  }
  await httpPost('NotificationSubscribe', '/member/notification/subscribe', {})
  return true
}
