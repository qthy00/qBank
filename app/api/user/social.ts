import {httpGet, httpPost, httpDelete } from "~/composables/useHttp";


export const SocialApi = {
  // 获取社交用户信息
  getSocialUser: async (socialType: number) => {
    return await httpGet( 'getSocialUser', `/member/social-user/get?type=${socialType}`)
  },
  // 获取社交用户信息
  getSocialUserList: async () => {
    return await httpGet( 'getSocialUserList', '/member/social-user/list' )
  },
  // 社交绑定
  socialBind: async (data: any ) => {
    return await httpPost( 'socialBind', '/member/social-user/bind', data )
  },
  // 社交解绑
  socialUnbind: async (data: any) => {
    return await httpDelete( 'socialUnbind', '/member/social-user/unbind', {body: data} )
  },
}
