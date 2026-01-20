import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    auth: false,
    register: false, //注册弹窗
    share: false, // 分享弹框
    feedback: false, // 反馈弹框
    advHistory: [], // 广告弹框记录
    lastTimer: {
      // 短信验证码计时器，为了防止刷新请求做了持久化
      smsLogin: 0,
      changeMobile: 0,
      resetPassword: 0,
      changePassword: 0,
    }
  }),
  persist: {
    paths: ['advHistory', 'lastTimer'],
    // 自定义序列化方法，确保不保存弹窗状态
    serializer: {
      serialize: (state) => {
        // 复制状态并删除弹窗相关字段
        const { auth, share, feedback, ...rest } = state
        return JSON.stringify(rest)
      },
      deserialize: (value) => JSON.parse(value)
    }// 只持久化广告记录和计时器
  }
})


