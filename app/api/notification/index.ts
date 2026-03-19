import type {
  NotificationVO,
  NotificationPageVO,
  NotificationQueryVO,
  NotificationStatsVO,
  UpdateNotificationStatusReqVO,
  DeleteNotificationsReqVO,
  NotificationSettingVO
} from '~/types/notification'
import { httpGet, httpPost, httpPut, httpDelete } from '~/composables/useHttp'

/**
 * 获取消息分页列表
 * @param query 查询参数
 */
export const getNotificationPage = async (query: NotificationQueryVO) => {
  return await httpGet<NotificationPageVO>('NotificationPage', '/member/notification/page', { query })
}

/**
 * 获取消息详情
 * @param id 消息ID
 */
export const getNotificationDetail = async (id: number) => {
  return await httpGet<NotificationVO>('NotificationDetail', `/member/notification/get/${id}`)
}

/**
 * 获取未读消息数量
 */
export const getUnreadCount = async () => {
  return await httpGet<number>('NotificationUnreadCount', '/member/notification/unread-count')
}

/**
 * 获取消息统计信息
 */
export const getNotificationStats = async () => {
  return await httpGet<NotificationStatsVO>('NotificationStats', '/member/notification/stats')
}

/**
 * 标记消息为已读
 * @param ids 消息ID列表
 */
export const markAsRead = async (ids: number[]) => {
  return await httpPut('NotificationMarkRead', '/member/notification/mark-read', { ids })
}

/**
 * 标记所有消息为已读
 */
export const markAllAsRead = async () => {
  return await httpPut('NotificationMarkAllRead', '/member/notification/mark-all-read', {})
}

/**
 * 删除消息
 * @param data 删除参数
 */
export const deleteNotifications = async (data: DeleteNotificationsReqVO) => {
  return await httpDelete('NotificationDelete', '/member/notification/delete', { body: data })
}

/**
 * 清空已读消息
 */
export const clearReadNotifications = async () => {
  return await httpDelete('NotificationClearRead', '/member/notification/clear-read')
}

/**
 * 获取消息设置
 */
export const getNotificationSettings = async () => {
  return await httpGet<NotificationSettingVO[]>('NotificationSettings', '/member/notification/settings')
}

/**
 * 更新消息设置
 * @param data 设置数据
 */
export const updateNotificationSettings = async (data: NotificationSettingVO[]) => {
  return await httpPut('NotificationUpdateSettings', '/member/notification/settings', data)
}

/**
 * 订阅消息推送（用于WebSocket）
 */
export const subscribeNotifications = async () => {
  return await httpPost('NotificationSubscribe', '/member/notification/subscribe', {})
}
