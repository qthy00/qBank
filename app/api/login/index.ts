/**
 * 用户模块的接口定义和实现。
 * 提供用户登录、刷新令牌、获取租户信息、登出等功能。
 */

// 导入认证工具
import { httpGet, httpPost, postOriginal } from "~/composables/useHttp";
import type {RegisterVO, UserLoginVO, SmsCodeVO, SmsLoginVO, EmailCodeVO} from "~/types/auth"




// 登录
export const login = (data: UserLoginVO) => {
  return httpPost('login',  '/member/auth/login', data )
}

// 注册
export const register = (data: RegisterVO) => {
  return httpPost('register',  '/member/auth/register-no', data )
}

export const checkUsername = (name: any) => {
  return httpGet('checkUsername',  `/member/auth/check-username?username=${name}` )
}


/**
 * 刷新访问令牌接口。
 * 用于刷新即将过期的访问令牌。
 */
export const refreshToken = () => {
  return httpPost('refreshToken',  '/member/auth/refresh-token?refreshToken=' + useCookie('token').value )
}

// 登出
export const logout = () => {
  return httpPost('logout',  '/member/auth/logout' )
}

// 获取路由信息
export const getRouters = () => {
  return httpGet('getRouters',  '/member/auth/get-routers' )
}

//获取手机验证码
export const sendSmsCode = (data: SmsCodeVO) => {
  return httpPost('sendSmsCode',  '/member/auth/send-sms-code', data )
}
//获取邮箱验证码
export const sendEmailCode = (data: EmailCodeVO) => {
  return httpPost('sendEmailCode',  '/member/auth/send-email-code', data )
}

// 短信验证码登录
export const smsLogin = (data: SmsLoginVO) => {
  return httpPost('smsLogin',  '/member/auth/sms-login', data )
}

// 社交快捷登录，使用 code 授权码
export function socialLogin(type: number, code: string, state: string) {
  return httpPost('socialLogin','/member/auth/social-login',
      {data: {type, code, state}})
}


// 社交授权的跳转
export const socialAuthRedirect = (type: number, redirectUri: string) => {
  return httpGet('socialAuthRedirect',
      `/member/auth/social-auth-redirect?type=${type}&redirectUri=${redirectUri}`
  )
}

// 通过短信重置密码
export const smsResetPassword = (data: any) => {
  return httpPost('resetPassword',  '/member/user/reset-password', data )
}


// 短信验证码登录
export const addShareLog = (data: any) => {
  return httpPost('addShareLog',  '/swap/affiliate-user/bind', data )
}

// 获取验证图片以及 token
export const getCode = (data: any) => {
  return postOriginal('getCode',  '/system/captcha/get', data )
}

// 滑动或者点选验证
export const reqCheck = (data: any) => {
  return postOriginal('reqCheck',  '/system/captcha/check', data )
}

// // 登录
// export const myTest = () => {
//   return httpGet('',  '/cms/tools/test' )
// }
