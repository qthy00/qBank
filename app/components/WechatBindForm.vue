<script setup lang="ts">
import * as LoginApi from '@/api/login'
import { isWxBrowser } from '@/utils/is.ts'

const dialogVisible = ref(false)
const isLoading = ref(true)
const wechatQrCodeUrl = ref('')
let { path, query } = useRoute()

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  await getWechatQrCodeUrl()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getWechatQrCodeUrl = async () => {
  isLoading.value = true
  try {
    const socialType = isWxBrowser() ? 31 : 32
    let redirectUri = `https://www.gongjua.cn${path}?event=bind&type=${socialType}`
    for (const key in query) {
      // 推荐添加类型检查，避免遍历到原型链上的属性
      if (query.hasOwnProperty(key)) {
        redirectUri += '&' + key + '=' + query[key]
      }
    }
    const data = await LoginApi.socialAuthRedirect(32, encodeURIComponent(redirectUri))
    let url = data.split('&redirect_uri')[0]
    wechatQrCodeUrl.value = url + '&redirect_uri=' + encodeURIComponent(redirectUri)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Dialog v-model="dialogVisible" title="绑定微信账号" width="500px" :max-height="550">
    <div class="p-4 flex flex-col items-center">
      <p class="text-center mb-1">请使用微信扫描下方二维码，完成绑定操作</p>
      <p class="text-center mb-3">注意：只有绑定微信后才可用微信进行支付</p>
      <!-- 二维码容器 -->
      <!-- 登录容器 -->
      <div
        class="login-wrapper mx-auto flex flex-col items-center justify-center min-h-[350px] p-4"
      >
        <!-- 二维码卡片 -->
        <el-card class="mb-10px text-center">
          <!-- 微信登录二维码 - 实际项目中替换为真实的微信登录二维码 -->
          <div v-loading="isLoading" class="relative">
            <iframe
              ref="wechatIframe"
              :src="wechatQrCodeUrl"
              scrolling="no"
              class="w-full border-0 overflow-hidden"
              :style="{ height: '330px' }"
            ></iframe>
          </div>
        </el-card>
        <!-- 返回按钮 -->
        <el-button
          class="w-50% bg-gradient-to-r from-blue-500 to-indigo-300 hover:from-blue-600 hover:to-indigo-400 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6 shadow-lg shadow-blue-500/20"
          @click="dialogVisible = false"
        >
          返 回
        </el-button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
/* 动画效果 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
