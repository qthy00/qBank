import { computed } from 'vue'
import { useModalStore } from '~/stores/modal.ts'
import { useUserStore } from '~/stores/user.ts'

export const useModalFunction = () => {
  return {
    showAuthModal,
    closeAuthModal,
    showRegisterModal,
    closeRegisterModal,
    showShareModal,
    closeShareModal,
    showFeedbackModal,
    closeFeedbackModal,
    getSmsCode
  }
}

// 打开授权弹框
function showAuthModal() {
  const modal = useModalStore()
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.isLogin)

  if (!isLogin.value) {
    modal.auth = true
    return true
  }
  return false
}

// 关闭授权弹框
function closeAuthModal() {
  const modal = useModalStore()
  modal.auth = false
}


// 打开授权弹框
function showRegisterModal() {
  const modal = useModalStore()
    modal.register = true

}

// 关闭授权弹框
function closeRegisterModal() {
  const modal = useModalStore()
  modal.register = false
}

// 打开分享弹框
function showShareModal() {
  const modal = useModalStore()
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.isLogin)

  if (!isLogin.value) {
    modal.auth = true
    return
  }
  modal.share = true
}

// 关闭分享弹框
function closeShareModal() {
  const modal = useModalStore()
  modal.share = false
}

// 打开反馈弹框
function showFeedbackModal() {
  const modal = useModalStore()
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.isLogin)

  if (!isLogin.value) {
    modal.auth = true
    return
  }
  modal.feedback = true
}

// 关闭反馈弹框
function closeFeedbackModal() {
  const modal = useModalStore()
  modal.feedback = false
}


// 发送短信验证码  60秒
function getSmsCode(_event, _mobile) {
}

// 获取短信验证码倒计时 -- 60秒
function _getSmsTimer(_event: string, _mobile = '') {
}
