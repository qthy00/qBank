<template>
  <div v-if="getShow" class="login-form mx-[-10px]">
    <!-- 登录标题 -->
    <div class="mb-5">
      <h2 class="text-xl font-bold text-gray-900 mb-1">微信扫码登录</h2>
      <p class="text-gray-500 text-xs">请使用微信扫描下方二维码</p>
    </div>
    <!-- 登录容器 -->
    <div class="login-wrapper mx-auto flex flex-col items-center justify-center min-h-[300px] p-4">
      <!-- 二维码卡片 -->
      <el-card class="mb-10px text-center">
        <!-- 微信登录二维码 - 实际项目中替换为真实的微信登录二维码 -->
        <div v-loading="isLoading" class="relative">
          <iframe
            ref="wechatIframe"
            :src="wechatQrCodeUrl"
            scrolling="no"
            class="w-full border-0 overflow-hidden"
            :style="{ height: iframeHeight }"
          />
        </div>
      </el-card>
      <!-- 返回按钮 -->
      <el-button
        class="w-50% bg-gradient-to-r from-blue-500 to-indigo-300 hover:from-blue-600 hover:to-indigo-400 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6 shadow-lg shadow-blue-500/20"
        @click="handleBackLogin"
      >
        返 回
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as LoginApi from '~/api/login'

defineOptions({ name: 'LoginQrCode' })

const { handleBackLogin, currentState } = useLoginState()
const { path } = useRoute()
const getShow = computed(() => unref(currentState) === LoginStateEnum.QR_CODE)
const wechatIframe = ref<HTMLIFrameElement | null>(null)
const iframeHeight = ref('330px') // 可根据微信页面实际高度调整

// 状态管理
const isLoading = ref(true)
const wechatQrCodeUrl = ref('')

const getWechatQrCodeUrl = async () => {
  isLoading.value = true
  try{
    const redirectUri = 'https://gongjua.cn' + path + '?event=login&type=32'
    // const redirectUri = 'https://www.gongjua.cn?event=login&type=32'
    const data = await LoginApi.socialAuthRedirect(32, encodeURIComponent(redirectUri))
    const url = data.split('&redirect_uri')[0]
    wechatQrCodeUrl.value = url + '&redirect_uri=' + encodeURIComponent(redirectUri)
  }finally {
    isLoading.value = false
  }
}

// 二维码加载
onMounted(() => {
  watch(getShow, (isShow) => {
    if(isShow) {
      getWechatQrCodeUrl()
    }
    if (isShow && wechatIframe.value) {
      // 微信官方二维码页面加载完成后，可尝试自动调整高度
      wechatIframe.value.onload = () => {
        try {
          // 注意：由于跨域限制，可能无法获取iframe内部高度，需手动适配
          const contentHeight = wechatIframe.value?.contentWindow?.document?.body?.scrollHeight || 500
          iframeHeight.value = `${contentHeight}px`
        } catch (e) {
          console.log('跨域限制，无法获取iframe高度，使用默认值')
        }
      }
    }
  })
})

</script>

<style scoped>
.login-wrapper {
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.qr-code-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .login-title h2 {
    font-size: 1.25rem;
  }

  .qr-code-container {
    padding: 4px;
  }
}
</style>
