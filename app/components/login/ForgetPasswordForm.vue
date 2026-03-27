<template>
  <template v-if="getShow">
    <!-- 标题 -->
    <div class="mb-5">
      <h2 class="text-xl font-bold text-gray-900 mb-1">{{ $t('login.forgetFormTitle') }}</h2>
      <p class="text-gray-500 text-xs">{{ $t('login.forgetFormDesc') }}</p>
    </div>
  <el-form
    ref="formSmsResetPassword"
    :model="resetPasswordData"
    :rules="rules"
    class="login-form"
    label-position="top"
    label-width="120px"
    size="large"
  >
    <el-form-item prop="account" :label="$t('login.forgetPlaceholder')" class="!mt-3">
      <el-input
          v-model="resetPasswordData.account"
          :placeholder="$t('login.forgetPlaceholder')"
          :prefix-icon="iconCellphone"
      />
    </el-form-item>
    <Verify
        ref="verify"
        :captcha-type="captchaType"
        :img-size="{ width: '400px', height: '200px' }"
        mode="pop"
        @success="getSmsCode"
    />
    <el-form-item prop="code" :label="$t('login.getVerifyCode')" >
      <el-row :gutter="5" justify="space-between" style="width: 100%">
        <el-col :span="24">
          <el-input
              v-model="resetPasswordData.code"
              :placeholder="t('login.codePlaceholder')"
              :prefix-icon="iconCircleCheck"
          >
            <template #append>
                  <span
                      v-if="mobileCodeTimer <= 0"
                      class="getMobileCode"
                      style="cursor: pointer"
                      @click="getCode"
                  >
                    {{ t('login.getVerifyCode') }}
                  </span>
              <span v-if="mobileCodeTimer > 0" class="getMobileCode" style="cursor: pointer">
                    {{ mobileCodeTimer }}秒后可重新获取
                  </span>
            </template>
          </el-input>
          <!-- </el-button> -->
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item prop="password" :label="$t('login.password')" >
      <el-input
          v-model="resetPasswordData.password"
          :placeholder="$t('login.passwordPlaceholder')"
          :prefix-icon="Lock"
          show-password
          type="password"
      />
    </el-form-item>
    <el-form-item prop="check_password" :label="$t('login.checkPassword')">
      <el-input
          v-model="resetPasswordData.check_password"
          :placeholder="t('login.checkPassword')"
          :prefix-icon="Lock"
          show-password
          type="password"
      />
    </el-form-item>
  </el-form>
    <!-- 登录按钮 -->
    <button
        :disabled="loginLoading"
        class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6 md:mt-0 shadow-lg shadow-blue-500/20"
        @click="resetPassword()"
    >
      <div class="flex items-center justify-center space-x-2">
        <span>{{ loginLoading ? $t('login.passwordResetting') : $t('login.forgetFormTitle') }}</span>
        <div
            v-if="loginLoading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
        />
      </div>
    </button>
    <!-- 返回登录 -->
    <div class="mt-6 text-center text-sm">
      <button
          link
          class="text-blue-600 font-medium hover:underline"
          @click="handleBackLogin()"
      >
        {{ $t('login.backLogin') }}
      </button>
    </div>
  </template>
</template>
<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import {sendEmailCode, sendSmsCode, smsResetPassword} from '@/api/login'
import { ElLoading } from 'element-plus'
import { Lock } from "@element-plus/icons-vue"
import {isEmail, isMobileNumber} from "~/utils/is";

defineOptions({ name: 'ForgetPasswordForm' })

const verify = ref()
const { t } = useI18n()
const message = useMessage()
const { currentRoute } = useRouter()

const formSmsResetPassword = ref()
const loginLoading = ref(false)
const iconCellphone = useIcon({ name: 'ep:cellphone' })
const iconCircleCheck = useIcon({ name: 'ep:circle-check' })

const { handleBackLogin, currentState, setLoginState } = useLoginState()
const getShow = computed(() => unref(currentState) === LoginStateEnum.RESET_PASSWORD)
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字

const resetPasswordData = reactive({
  captchaEnable: import.meta.env.NUXT_CAPTCHA_ENABLE,
  password: '',
  check_password: '',
  account: '',
  code: ''
})

const validatePass2 = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== resetPasswordData.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const validateAccount = (_rule, value, callback) => {
  const isMobile = isMobileNumber(value)
  const email = isEmail(value)

  console.log('===', isMobile, email)
  if (value.trim() === '') {
    callback(new Error('请输入邮箱'))
  // } else if (!isMobileNumber(value) && !isEmail(value)) {
  } else if (!isEmail(value)) {
    callback(new Error('请输入正确的邮箱号'))
  } else {
    callback()
  }
}


const rules = {
  account: [{ required: true, validator: validateAccount, trigger: 'blur'}],
  password: [
    {
      required: true,
      min: 4,
      max: 16,
      validator: validatePass2,
      trigger: 'blur',
      message: '密码长度为4到16位'
    }
  ],
  check_password: [{ required: true, validator: validatePass2, trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur'}]
}


const mobileCodeTimer = ref(0)
const redirect = ref<string>('')

// 获取验证码
const getCode = async () => {
  if(!isEmail(resetPasswordData.account)){
    message.error('请输入正确的邮箱地址')
    return
  }
  // 情况一，未开启：则直接发送验证码
  if (resetPasswordData.captchaEnable === 'false') {
    await getSmsCode({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行发送验证码
    // 弹出验证码
    verify.value.show()
  }
}

const getSmsCode = async (params) => {
  const vo = {
    captchaVerification: params.captchaVerification,
    scene: 4,
    email: resetPasswordData.account
  }
  try{
    // if(isMobileNumber(resetPasswordData.account)){
    //   vo.mobile = resetPasswordData.account
    //   await sendSmsCode(vo)
    // }else
    if(isEmail(resetPasswordData.account)){
      vo.email = resetPasswordData.account
      await sendEmailCode(vo)
    }else{
      message.error('请输入正确的邮箱号')
      return
    }
    message.success(t('login.SmsSendMsg'))
    // 设置倒计时
    mobileCodeTimer.value = 60
    const msgTimer = setInterval(() => {
      mobileCodeTimer.value = mobileCodeTimer.value - 1
      if (mobileCodeTimer.value <= 0) {
        clearInterval(msgTimer)
      }
    }, 1000)
  }catch (e){
    console.log(e)
  }


}

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 重置密码
const resetPassword = async () => {
  const valid = await formSmsResetPassword.value?.validate()
  if (!valid) return
  try{
    loginLoading.value = true
    const data = {
      username: resetPasswordData.username,
      password: resetPasswordData.password,
      code: resetPasswordData.code,
      email: resetPasswordData.account
    }
    // if(isMobileNumber(resetPasswordData.account)){
    //   data.mobile = resetPasswordData.account
    // }else if(isEmail(resetPasswordData.account)){
    //   data.email = resetPasswordData.account
    // }
    await smsResetPassword(data)
    message.success(t('login.resetPasswordSuccess'))
    setLoginState(LoginStateEnum.LOGIN)
    resetForm()
  }catch (e){
    console.log(e)
  }finally {
    loginLoading.value = false
    setTimeout(() => {
      const loadingInstance = ElLoading.service()
      loadingInstance.close()
    }, 400)
  }
}

const resetForm = () => {
  resetPasswordData.password = ''
  resetPasswordData.check_password = ''
  resetPasswordData.account = ''
  resetPasswordData.code = ''
}
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.smsbtn {
  margin-top: 33px;
}
</style>
