import type {FavoriteVO, FeedbackQuestionVO, UserProfileUpdateReqVO } from '~/types/user/user'
import { httpGet, httpUpload, httpPost, httpPut } from "~/composables/useHttp";
import request from "~/config";
import type {PackageAccessVO} from "~/types/user";


// 获取用户权限信息
export const getInfo = () => {
  return httpGet('getInfo',  '/member/auth/get-permission-info' )
}

// 查询会员用户详情
export const getUser = async () => {
  return await httpGet('UserInfo', `/member/user/get`)
}

// 修改用户个人信息
export const updateUserProfile = (data: UserProfileUpdateReqVO) => {
  return httpPut('updateUser', '/member/user/update', data )
}

// 用户头像上传
export const uploadAvatar = (data) => {
  return httpUpload('uploadAvatar', '/member/user/update-avatar', data )
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

export const favoritesStatus = async (query: any) => {
  return await httpGet('UserFavoritesStatus', `/cms/member/favorites`, {query} )
}

export const getFavoriteToolsIds = async (server:boolean = true) => {
  return await httpGet('UserFavoritesToolsIds', `/cms/member/favorites/ids` ,
      {query: { contentType: 'tools' } }, server)
}

export const getFavoriteTools = async (query: any) => {
  return await httpGet('UserFavoritesTools', `/cms/member/favorites/list` , {query })
}

// 上传文件
export const updateFile = (data: any) => {
  return httpUpload('updateFile', '/infra/file/upload', data )
}
// 提交反馈
export const submitFeedback = async (data: FeedbackQuestionVO) => {
  return await httpPost('submitFeedback', `/member/faq-question/report`, data )
}

export const fetchSecurityScore = async () => {
  return await httpGet('fetchSecurityScore', `/member/security/score`)
}

// 发送邮箱验证码
export const sendEmailCode = async (data: any) => {
  return await httpPost('sendEmailCode', `/member/auth/send-email-code`, data )
}

export const updateUserEmail = async (data: any) => {
  return await httpPost('updateUserEmail', `/member/user/bind-email`, data )
}

export const sendSmsCode = async (data: any) => {
  return await httpPost('sendSmsCode', `/member/auth/send-sms-code`, data )
}

export const updateUserPhone = async (data: any) => {
  return await httpPut( 'updateUserPhone',`/member/user/update-mobile`, data )
}

export const verifyRealName = async (data: any) => {
  return await httpPost('verifyRealName', `/member/security/verify`, data )
}

export const updateUserSetting = async (data: any) => {
  return await httpPost('updateUserSetting', `/member/settings`, data )
}

// 获取当前登录设备
export const fetchCurrentDevice = async () => {
  return await httpGet('fetchCurrentDevice', `/member/device-manager/current` )
}
// 获取设备列表
export const fetchDevicePage = async (query: any) => {
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
