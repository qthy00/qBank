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
function getSmsCode(event, mobile) {
  // const modalStore = $store('modal');
  // const lastSendTimer = modalStore.lastTimer[event];
  // if (typeof lastSendTimer === 'undefined') {
  //   $helper.toast('短信发送事件错误');
  //   return;
  // }
  //
  // const duration = dayjs().unix() - lastSendTimer;
  // const canSend = duration >= 60;
  // if (!canSend) {
  //   $helper.toast('请稍后再试');
  //   return;
  // }
  // // 只有 mobile 非空时才校验。因为部分场景（修改密码），不需要输入手机
  // if (mobile && !test.mobile(mobile)) {
  //   $helper.toast('手机号码格式不正确');
  //   return;
  // }
  //
  // // 发送验证码 + 更新上次发送验证码时间
  // let scene = -1;
  // switch (event) {
  //   case 'resetPassword':
  //     scene = 4;
  //     break;
  //   case 'changePassword':
  //     scene = 3;
  //     break;
  //   case 'changeMobile':
  //     scene = 2;
  //     break;
  //   case 'smsLogin':
  //     scene = 1;
  //     break;
  // }
  // AuthUtil.sendSmsCode(mobile, scene).then((res) => {
  //   if (res.code === 0) {
  //     modalStore.$patch((state) => {
  //       state.lastTimer[event] = dayjs().unix();
  //     });
  //   }
  // });
}

// 获取短信验证码倒计时 -- 60秒
function getSmsTimer(event, mobile = '') {
  // const modalStore = $store('modal');
  // const lastSendTimer = modalStore.lastTimer[event];
  //
  // if (typeof lastSendTimer === 'undefined') {
  //   $helper.toast('短信发送事件错误');
  //   return;
  // }
  //
  // const duration = ref(dayjs().unix() - lastSendTimer - 60);
  // const canSend = duration.value >= 0;
  //
  // if (canSend) {
  //   return '获取验证码';
  // }
  //
  // if (!canSend) {
  //   setTimeout(() => {
  //     duration.value++;
  //   }, 1000);
  //   return -duration.value.toString() + ' 秒';
  // }
}
