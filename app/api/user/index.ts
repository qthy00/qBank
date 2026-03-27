import type {FavoriteVO, FeedbackQuestionVO, UserProfileUpdateReqVO,PackageAccessVO } from '~/types/user'
import { httpGet, httpUpload, httpPost, httpPut } from "~/composables/useHttp";

import { getMockUser, getMockUserPermissions } from './mock'

/* 是否启用Mock数据 */
const ENABLE_MOCK = true

/* ==================== 请求类型定义 ==================== */

/**
 * 上传头像请求
 */
export interface UploadAvatarReqVO {
  file: File
}

/**
 * 收藏查询参数
 */
export interface FavoritesQueryVO {
  type?: string
  dataId?: number
}

/**
 * 文件上传请求
 */
export interface UploadFileReqVO {
  file: File
}

/**
 * 发送邮箱验证码请求
 */
export interface SendEmailCodeReqVO {
  email: string
  scene?: string
}

/**
 * 更新邮箱请求
 */
export interface UpdateEmailReqVO {
  email: string
  code: string
}

/**
 * 发送短信验证码请求
 */
export interface SendSmsCodeReqVO {
  mobile: string
  scene?: string
}

/**
 * 更新手机号请求
 */
export interface UpdatePhoneReqVO {
  mobile: string
  code: string
}

/**
 * 实名认证请求
 */
export interface VerifyRealNameReqVO {
  realName: string
  idCard: string
}

/**
 * 用户设置请求
 */
export interface UserSettingReqVO {
  key: string
  value: string | number | boolean
}

/**
 * 设备查询参数
 */
export interface DeviceQueryVO {
  page?: number
  pageSize?: number
}


// 获取用户权限信息
export const getInfo = () => {
  if (ENABLE_MOCK) {
    return getMockUserPermissions()
  }
  return httpGet('getInfo',  '/member/auth/get-permission-info' )
}

// 查询会员用户详情
export const getUser = async () => {
  if (ENABLE_MOCK) {
    return getMockUser()
  }
  return await httpGet('UserInfo', `/member/user/get`)
}

// 修改用户个人信息
export const updateUserProfile = (data: UserProfileUpdateReqVO) => {
  return httpPut('updateUser', '/member/user/update', data )
}

// 用户头像上传
export const uploadAvatar = (data: UploadAvatarReqVO) => {
  return httpUpload('uploadAvatar', '/member/user/update-avatar', data.file )
}

// 用户密码重置
export const updateUserPassword = (oldPassword: string, newPassword: string) => {
  return httpPut('updateUserPassword', '/member/user/update-password',
      {oldPassword: oldPassword, password: newPassword}
  )
}

// 获取快捷入口菜单
export const getHomeShortcuts = () => {
  return httpGet('UserHomeShortcuts', '/system/user/profile/shortcuts')
}


export const favorites = async (data: FavoriteVO) => {
  return await httpPost('UserFavorites', `/cms/member/favorites`, data )
}

export const favoritesStatus = async (query: FavoritesQueryVO) => {
  return await httpGet('UserFavoritesStatus', `/cms/member/favorites`, {query} )
}

export const getFavoriteToolsIds = async (server:boolean = true) => {
  return await httpGet('UserFavoritesToolsIds', `/cms/member/favorites/ids` ,
      {query: { contentType: 'tools' } }, server)
}

export const getFavoriteTools = async (query: { page?: number; pageSize?: number; contentType?: string }) => {
  return await httpGet('UserFavoritesTools', `/cms/member/favorites/list` , {query })
}

// 上传文件
export const updateFile = (data: UploadFileReqVO) => {
  return httpUpload('updateFile', '/infra/file/upload', data.file )
}
// 提交反馈
export const submitFeedback = async (data: FeedbackQuestionVO) => {
  return await httpPost('submitFeedback', `/member/faq-question/report`, data )
}

export const fetchSecurityScore = async () => {
  return await httpGet('fetchSecurityScore', `/member/security/score`)
}

// 发送邮箱验证码
export const sendEmailCode = async (data: SendEmailCodeReqVO) => {
  return await httpPost('sendEmailCode', `/member/auth/send-email-code`, data )
}

export const updateUserEmail = async (data: UpdateEmailReqVO) => {
  return await httpPost('updateUserEmail', `/member/user/bind-email`, data )
}

export const sendSmsCode = async (data: SendSmsCodeReqVO) => {
  return await httpPost('sendSmsCode', `/member/auth/send-sms-code`, data )
}

export const updateUserPhone = async (data: UpdatePhoneReqVO) => {
  return await httpPut( 'updateUserPhone',`/member/user/update-mobile`, data )
}

export const verifyRealName = async (data: VerifyRealNameReqVO) => {
  return await httpPost('verifyRealName', `/member/security/verify`, data )
}

export const updateUserSetting = async (data: UserSettingReqVO) => {
  return await httpPost('updateUserSetting', `/member/settings`, data )
}

// 获取当前登录设备
export const fetchCurrentDevice = async () => {
  return await httpGet('fetchCurrentDevice', `/member/device-manager/current` )
}
// 获取设备列表
export const fetchDevicePage = async (query: DeviceQueryVO) => {
  return await httpGet('fetchDevicePage', `/member/device-manager/current` , {query})
}

// 获取工具访问权限
export const getPackageAccess = async (toolId: number, server: boolean = true) => {
  return await httpGet('getPackageAccess', `/member/tools/access/${toolId}`, {}, server)
}

// 获取用户访问权限的题库列表
export const getPackageAccessList = async (toolId: number, server: boolean = true): Promise<PackageAccessVO[]> => {
  return await httpGet('getPackageAccessList', `/member/tools/access/list`, {}, server)
}

// 更新用户访问使用次数
export const updateToolAccess = async (toolId: number) => {
  return await httpGet('updateToolAccess', `/member/tools/access/update/${toolId}`)
}
