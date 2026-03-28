<template>
  <template v-if="getShow">
    <!-- 登录标题 -->
    <div class="mb-5">
      <h2 class="text-xl font-bold text-gray-900 mb-1">{{ $t('login.loginTitle') }}</h2>
      <p class="text-gray-500 text-xs">{{ $t('login.loginDescription') }}</p>
    </div>
    <el-form
        ref="formLoginRef"
        :model="loginData.loginForm"
        :rules="loginRules"
        class="login-form"
        label-position="top"
        label-width="120px"
        size="large"
    >
      <el-form-item prop="account" label="用户名" class="!mt-3">
        <el-input
            v-model="loginData.loginForm.account"
            :placeholder="$t('login.usernamePlaceholder')"
            :prefix-icon="Avatar"
        />
      </el-form-item>
      <el-form-item prop="password" label="密码" class="!mb-2">
        <el-input
            v-model="loginData.loginForm.password"
            :placeholder="$t('login.password')"
            :prefix-icon="Lock"
            show-password
            type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-row justify="space-between" style="width: 100%">
          <el-col :span="6">
            <el-checkbox v-model="loginData.loginForm.rememberMe">
              {{ $t('login.rememberMe') }}
            </el-checkbox>
          </el-col>
          <el-col :offset="6" :span="12">
            <el-link
                style="float: right"
                type="primary"
                @click="setLoginState(LoginStateEnum.RESET_PASSWORD)"
            >
              {{ $t('login.forgotPassword') }}
            </el-link>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- 登录按钮 -->
    <button
        :disabled="loginLoading"
        class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6 md:mt-0 shadow-lg shadow-blue-500/20"
        @click="handleLogin"
    >
      <div class="flex items-center justify-center space-x-2">
        <span>{{ loginLoading ? $t('login.loggingIn') : $t('login.loginButton') }}</span>
        <div
            v-if="loginLoading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
        />
      </div>
    </button>
    <!-- 其他登录方式 -->
    <div v-if="!isMobile" class="mt-5 text-center">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"/>
        </div>
        <div class="relative z-10">
          <span class="bg-white px-3 text-gray-400 text-xs">{{ $t('login.otherMethods') }}</span>
        </div>
      </div>
      <div class="flex justify-center space-x-3 mt-3">
        <button
            v-for="item in socialList"
            :key="item.icon"
            :style="{
              backgroundColor: item.color,
              '--hover-bg': item.color
            }"
            class="w-8 h-8 rounded-full text-white hover:text-white transition-all duration-300 transform hover:scale-110"
            @click.stop="doSocialLogin(item.type)"
        >
          <Icon :name="item.icon" :size="20" color="white"/>
        </button>
      </div>
    </div>
    <!-- 注册链接 -->
    <div class="mt-6 text-center text-sm">
      <span class="text-gray-600">{{ $t('login.noAccount') }}</span>
      <button
          link
          class="text-blue-600 font-medium hover:underline"
          @click="handleOpenRegisterModal"
      >
        {{ $t('login.registerNow') }}
      </button>
    </div>
  </template>
</template>
<script lang="ts" setup>
import {ElLoading} from 'element-plus'
import {Avatar, Lock} from '@element-plus/icons-vue'
import type {RouteLocationNormalizedLoaded} from 'vue-router'

defineOptions({name: 'LoginForm'})

const message = useMessage()
const {currentRoute} = useRouter()
const {closeModal, openModal} = useModal()
const { setLoginState, currentState} = useLoginState()
const config = useRuntimeConfig()

const appStore = useAppStore()
const authStore = useAuthStore()

const formLoginRef = ref()
const redirect = ref<string>('')
const loginLoading = ref(false)

const {isMobile} = storeToRefs(appStore)
const getShow = computed(() => unref(currentState) === LoginStateEnum.LOGIN)

const loginRules = reactive({
  account: [{required: true, message: '请输入手机号/用户名/邮箱', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}],
})

const loginData = reactive({
  isShowPassword: false,
  captchaEnable: config.public.captcha_enable,
  loginForm: {
    account: '',
    password: '',
    captchaVerification: false,
    rememberMe: true, // 默认记录我。如果不需要，可手动修改
  },
})

const socialList = [
  {icon: 'mdi:wechat', type: 32, color: '#07C160'},
]

// 记住我
const getLoginFormCache = () => {
  const loginForm = authStore.decryptedLoginForm
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      account: loginForm.account ? loginForm.account : loginData.loginForm.account,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe,
    }
  }
}

const loading = ref() // ElLoading.service 返回的实例
// 登录
const handleLogin = async (params: any) => {
  await formLoginRef.value.validate()

  loginLoading.value = true
  try {
    const loginDataLoginForm = {
      ...loginData.loginForm,
      captchaVerification: params.captchaVerification
    }
    await authStore.login(loginDataLoginForm)

    loading.value = ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    if (loginDataLoginForm.rememberMe) {
      authStore.setLoginForm(loginDataLoginForm)
    } else {
      authStore.removeLoginForm()
    }
    closeModal('login')
  } catch (e){
    console.log(e)
  } finally {
    loginLoading.value = false
    loading.value?.close()
  }
}

// 社交登录
const doSocialLogin = async (type: number) => {
  if (type === 0) {
    message.error('此方式未配置')
  } else {
    setLoginState(LoginStateEnum.QR_CODE)
  }
}
watch(
    () => currentRoute.value,
    (route: RouteLocationNormalizedLoaded) => {
      redirect.value = route?.query?.redirect as string
    },
    {
      immediate: true,
    },
)
const handleOpenRegisterModal = () => {
  closeModal('login')
  openModal('register')
}

onMounted(() => {
  getLoginFormCache()
})
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.login-code {
  float: right;
  width: 100%;
  height: 38px;

  img {
    width: 100%;
    height: auto;
    max-width: 100px;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
