<script setup lang="ts">
import { sendEmailCode, updateUserEmail } from '~/api/user'
import { isEmail } from '~/utils/is.ts'


const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false)
const message = useMessage()

const formData = ref({
  email: '',
  code: undefined,
})

const formRules = reactive({
  email: [
    { required: true, trigger: 'blur', message: '请输入您的邮箱' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '验证码不能为空', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码长度为4个字符', trigger: 'blur' },
    { pattern: /^[0-9]+$/, message: '验证码长度为4个字符', trigger: 'blur' },
  ],
})
const formRef = ref()
const width = ref('40%')
/** 打开弹窗 */
const open = async () => {
  resetForm()
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const smsCountdown = ref(0)
const timer = ref()
const getCode = async () => {
  const email = formData.value.email

  if (!email) {
    message.warning('请输入邮箱地址')
    return
  }
  if(!isEmail(email)){
    message.warning('请输入正确的邮箱地址')
    return
  }

  try {
    // 发送验证码请求
    await sendEmailCode({ email })
    message.notifySuccess('邮箱验证码发送成功，请登录您的邮箱查看。')
    // 启动倒计时（默认 60 秒）
    smsCountdown.value = 60
    timer.value = setInterval(() => {
      if (smsCountdown.value > 0) {
        smsCountdown.value--
      } else {
        clearInterval(timer.value)
      }
    }, 1000)
  } catch (err) {
    message.error((err as string) || '验证码发送失败')
  }
}
const emit = defineEmits(['success'])
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  formLoading.value = false
  try {
    await updateUserEmail(formData.value)
    message.notifySuccess('绑定邮箱成功')
    dialogVisible.value = false
    emit('success', formData.value.email)
  } catch (e) {
    message.error('绑定邮箱失败：' + e)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    email: '',
    code: undefined,
  }
  formRef.value?.resetFields()
}

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<template>
  <Dialog v-model="dialogVisible" title="绑定邮箱" width="40%" :scroll="false">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      class="my-10 mx-5"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="flex w-full gap-2">
          <el-input v-model="formData.code" placeholder="请输入邮箱验证码" class="flex-1" />
          <button
            type="button"
            :disabled="smsCountdown > 0"
            :class="[
              'px-4 py-2 rounded text-white font-medium transition-all',
              smsCountdown > 0
                ? 'bg-gradient-to-r from-[#b2d6ff] to-[#e0caff] opacity-80 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#b2d6ff] to-[#e0caff] hover:opacity-90',
            ]"
            @click.stop="getCode()"
          >
            {{ smsCountdown > 0 ? `${smsCountdown}秒后可获取` : '获取验证码' }}
          </button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :disabled="formLoading" @click="submitForm">提 交</el-button>
    </template>
  </Dialog>
</template>

<style scoped></style>
