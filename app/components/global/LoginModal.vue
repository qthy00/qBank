<!-- 登录模态窗口 -->
<template>
  <ClientOnly>
    <el-dialog
        v-model="modalStates.login"
        center
        :show-close="false"
        class="p-0! !rounded-2xl max-w-5xl"
        width="90%"
        header-class="!pb-0"
        append-to-body
        @close="closeModal('login')"
    >
      <div class="flex flex-col md:flex-row duration-300">
        <!-- 新增右上角关闭按钮 -->
        <div class="absolute top-4 right-4 z-12">
          <button
              class="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
              @click="closeModal('login')"
          >
            <Icon name="fa-times"/>
          </button>
        </div>

        <!-- 左侧品牌展示区域（保持原样式） -->
        <div
            class="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6
        md:p-8 relative overflow-hidden flex flex-col justify-between !rounded-lt-2xl  "
            :class="isMobile ? '!rounded-rt-2xl' : '!rounded-lb-2xl' "
        >
          <!-- 装饰元素 -->
          <div
              class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/4 -translate-y-1/4"
          />
          <div
              class="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4"
          />

          <!-- 品牌标志 -->
          <div class="relative z-10">
            <div class="flex items-center space-x-3 mb-5">
              <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <span class="text-blue-600 font-bold text-xl">hy</span>
              </div>
              <span class="text-xl font-bold">{{ $t('login.brand') }}</span>
            </div>

            <h2 class="text-2xl font-bold leading-tight mb-3">{{ $t('login.welcomeBack') }}</h2>
            <p class="mb-5 max-w-md text-sm text-wrap">
              {{ $t('login.description') }}
            </p>

            <!-- 特点列表 -->
            <div class="space-y-3 mb-5 md:mb-8 md:flex flex-col hidden">
              <div class="flex items-center">
                <div
                    class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0"
                >
                  <Icon name="fa-shield"/>
                </div>
                <div>
                  <h4 class="font-medium mb-1 text-sm">{{ $t('login.feature1.title') }}</h4>
                  <p class="text-white/70 text-xs">{{ $t('login.feature1.description') }}</p>
                </div>
              </div>

              <div class="flex items-center">
                <div
                    class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0"
                >
                  <Icon name="fa-bolt"/>
                </div>
                <div>
                  <h4 class="font-medium mb-1 text-sm">{{ $t('login.feature2.title') }}</h4>
                  <p class="text-white/70 text-xs">{{ $t('login.feature2.description') }}</p>
                </div>
              </div>

              <div class="flex items-center">
                <div
                    class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0"
                >
                  <Icon name="fa-headphones"/>
                </div>
                <div>
                  <h4 class="font-medium mb-1 text-sm">{{ $t('login.feature3.title') }}</h4>
                  <p class="text-white/70 text-xs">{{ $t('login.feature3.description') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部信息 -->
          <div class="relative z-10 text-white/60 text-xs">
            <p>{{ $t('login.copyright') }}</p>
          </div>
        </div>

        <!-- 右侧登录区域 -->
        <div class="w-full md:w-7/12 p-5 md:p-8 flex flex-col justify-between">
          <!-- 账号登录 -->
          <LoginForm />
          <!-- 二维码登录 -->
          <LoginQrCode />
          <!-- 忘记密码 -->
          <ForgetPasswordForm />
        </div>
      </div>
    </el-dialog>
  </ClientOnly>

</template>

<script setup lang="ts">

import ForgetPasswordForm from "~/components/login/ForgetPasswordForm.vue";

const appStore = useAppStore()
const {isMobile} = storeToRefs(appStore)
const { modalStates, closeModal } = useModal()

</script>

<style lang="scss">

:deep(.el-dialog__body) {
  width: 100%;
}

/* 动画效果（保留原样式） */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.slide-up {
  animation: slideUp 0.3s ease-in-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 修复图标垂直居中
.absolute.inset-y-0 .fa {
  height: 100%;
  display: flex;
  align-items: center;
}
 */
/* 错误提示位置调整 */
.absolute.top-full {
  top: calc(100% + 4px);
}

/* 复选框边框增强 */
input[type='checkbox'] {
  border-width: 1px;
}
</style>
