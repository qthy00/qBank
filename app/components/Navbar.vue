<!-- 导航条 -->
<template>
  <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="[
      isScrolled ? 'bg-white/95 text-gray-800 shadow-sm' : 'bg-gray-600 text-white shadow-md',
      'px-4 py-1 flex justify-between items-center',
    ]"
  >
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <!-- Logo/公司名称 -->
        <!--        <NuxtLink  to="/" class="hidden md:block text-xl font-bold">-->
        <NuxtLink to="/" class="text-nowrap text-xl font-bold">
          {{ $t('navbar.company') }}
        </NuxtLink>

        <!-- 汉堡按钮 -->
        <!--        <button-->
        <!--          @click="toggleMenu"-->
        <!--          class="ml-2 h-8 w-8 flex items-center justify-center p-0 focus:outline-none"-->
        <!--          :class="isScrolled ? 'text-gray-800' : 'text-white'"-->
        <!--        >-->
        <!--          <svg-->
        <!--            width="24"-->
        <!--            height="24"-->
        <!--            viewBox="0 0 24 24"-->
        <!--            class="transition-transform duration-300"-->
        <!--            :class="showMenu ? 'rotate-180' : ''"-->
        <!--          >-->
        <!--            <line-->
        <!--              x1="4"-->
        <!--              y1="6"-->
        <!--              x2="20"-->
        <!--              y2="6"-->
        <!--              stroke="currentColor"-->
        <!--              stroke-width="2"-->
        <!--              stroke-linecap="round"-->
        <!--              class="transition-all duration-300"-->
        <!--              :class="showMenu ? 'opacity-0' : 'opacity-100'"-->
        <!--            />-->
        <!--            <line-->
        <!--              x1="4"-->
        <!--              y1="12"-->
        <!--              x2="20"-->
        <!--              y2="12"-->
        <!--              stroke="currentColor"-->
        <!--              stroke-width="2"-->
        <!--              stroke-linecap="round"-->
        <!--              class="transition-all duration-300 origin-center"-->
        <!--              :class="showMenu ? 'rotate-45' : 'rotate-0'"-->
        <!--            />-->
        <!--            <line-->
        <!--              x1="4"-->
        <!--              y1="12"-->
        <!--              x2="20"-->
        <!--              y2="12"-->
        <!--              stroke="currentColor"-->
        <!--              stroke-width="2"-->
        <!--              stroke-linecap="round"-->
        <!--              class="transition-all duration-300 origin-center"-->
        <!--              :class="showMenu ? 'rotate-135' : 'rotate-0'"-->
        <!--            />-->
        <!--            <line-->
        <!--              x1="4"-->
        <!--              y1="18"-->
        <!--              x2="20"-->
        <!--              y2="18"-->
        <!--              stroke="currentColor"-->
        <!--              stroke-width="2"-->
        <!--              stroke-linecap="round"-->
        <!--              class="transition-all duration-300"-->
        <!--              :class="showMenu ? 'opacity-0' : 'opacity-100'"-->
        <!--            />-->
        <!--          </svg>-->
        <!--        </button>-->

        <!-- 语言切换组件 -->
        <!--        <LanguageSelector :isScrolled="isScrolled" />-->
      </div>

      <!-- 已登录状态 -->
      <ClientOnly>
        <template v-if="!loading && authStore.isLogin">
          <div class="flex items-center gap-3">
            <!-- 消息通知铃铛 -->
            <NotificationBell :is-scrolled="isScrolled" />

            <el-dropdown trigger="click">
            <div
                class="flex items-center cursor-pointer pr-4 rounded-full transition-all duration-300"
                :class="[
                isScrolled
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-800 hover:bg-gray-100',
              ]"
            >
              <el-avatar
                  :src="user.avatar"
                  :size="30"
                  class="w-[calc(var(--logo-height)-25px)] rounded-full"
              />
              <span class="pl-1 text-sm text-gray-600 text-nowrap">{{ user.nickname }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToUserCenter">
                  <Icon name="ep:menu" class="mr-1"/>
                  用户中心
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                  <Icon name="ep:switch-button" class="mr-1"/>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          </div>
        </template>
        <!-- 未登录状态 -->
        <template v-else>
          <button
              class="flex items-center px-6 py-2 rounded-full transition-all duration-300"
              :class="[
              isScrolled
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-blue-600 hover:bg-gray-100',
              'md:mr-10',
            ]"
              @click="openModal('login')"
          >
            {{ $t('login.login') }}
          </button>
        </template>
        <template #fallback>
          <button
              class="flex items-center px-6 py-2 rounded-full transition-all duration-300 bg-white text-blue-600 hover:bg-gray-100 md:mr-10"
              disabled
          >
            {{ $t('login.login') }}
          </button>
        </template>
      </ClientOnly>
    </div>
  </nav>
  <!-- 透明遮罩层（覆盖整个页面） -->
  <div v-if="showMenu" class="fixed inset-0 z-30 bg-transparent" @click="showMenu = false"/>

  <!-- 产品菜单组件，临时使用返回首页的组件 -->
  <ProductMenu2 :show-menu="showMenu"/>
  <!-- 登录模态框 -->
  <LoginModal/>
  <!-- 注册模态框 -->
  <RegisterModal/>
  <!-- 分享模态框 -->
  <!--  <ShareModal/>-->
</template>

<script setup lang="ts">
import share from '~/utils/share.ts'
import {SocialApi} from '~/api/user/social.ts'
import {StatApi} from "~/api/stat"

const userStore = useUserStore()
const authStore = useAuthStore()
const message = useMessage()
const {openModal} = useModal()
const {t} = useI18n()
const {query, path, fullPath } = useRoute()

const {user} = storeToRefs(userStore)

const showMenu = ref(false)
const isScrolled = ref(false)
const loading = ref(true)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const {reloadPage} = useWindow()
const logout = async () => {
  try {
    await message.confirm(t('common.loginOutMessage'), t('common.reminder'))
    await authStore.logout()
    if (path.includes('/account')) {
      navigateTo('/')
    } else {
      reloadPage()
    }
  } catch {
  }
}

const goToUserCenter = () => {
  navigateTo('/account/profile')
}
// 监听滚动事件
const handleScroll = () => {
  if (import.meta.client) {
    isScrolled.value = window.scrollY > 10
  }
}

onMounted(async () => {
  const event = query.event
  const code = query.code as unknown as string
  const state = query.state as unknown as string
  const type = query.type as unknown as number
  const spm = query.spm as unknown as string
  // 解析分享信息
  if (spm) {
    await share.decryptSpm(spm)
  }
  if (code && state) {
    const {wxCode} = storeToRefs(authStore)
    if (!wxCode.value || wxCode.value != code) {
      // 标记该code正在处理
      wxCode.value = code
      if (event === 'login') {
        await authStore.socialLogin(type, code, state)
      } else if (event === 'bind') {
        await SocialApi.socialBind({type, code, state})
      }
    }
  }
  loading.value = false
  window.addEventListener('scroll', handleScroll)

  // 百度收录API推送
  if(process.env.NODE_ENV === 'production' && !(
      path.includes('/account') || path.includes('/order') || path.includes('/qb/')
  ) ){
    await StatApi.pushToBaidu({
      domain: 'https://www.gongjua.cn',
      path: fullPath,
      token: 'GYewsnuQfqRuHDZI'
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
