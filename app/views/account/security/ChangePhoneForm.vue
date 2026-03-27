<script setup lang="ts">
import { sendSmsCode, updateUserPhone } from '~/api/user'
import { isMobileNumber } from '~/utils/is.ts'


const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false)
const message = useMessage()

const formData = ref({
  mobile: undefined,
  code: undefined,
})

const formRules = reactive({
  mobile: [
    { required: true, trigger: 'blur', message: '请输入您的手机号' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'},
  ],
  code: [
    { required: true, message: '验证码不能为空', trigger: 'blur' },
    { pattern: /^\d{4,6}$/, message: '验证码长度为4~6个字符', trigger: 'blur' },
    { pattern: /^[0-9]+$/, message: '验证码长度为4个字符', trigger: 'blur' },
  ],
})
const formRef = ref()


/** 打开弹窗 */
const open = async () => {
  resetForm()
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const smsCountdown = ref(0)
const timer = ref()
const getCode = async () => {
  const mobile = formData.value.mobile

  if (!mobile) {
    message.warning('请输入手机号')
    return
  }
  if(!isMobileNumber(mobile)){
    message.warning('请输入正确的手机号')
    return
  }

  try {
    // 发送验证码请求
    await sendSmsCode({ mobile, scene: 2 })
    message.notifySuccess('验证码发送成功，请查收。')
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
    await updateUserPhone(formData.value)
    message.notifySuccess('绑定手机成功')
    dialogVisible.value = false
    emit('success', formData.value.mobile)
  } catch (e) {
    message.error('绑定手机失败：' + e)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    mobile: undefined,
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
  <Dialog v-model="dialogVisible" title="绑定手机号" width="40%" :scroll="false">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      class="my-10 mx-5"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="flex w-full gap-2">
          <el-input v-model="formData.code" placeholder="请输入手机验证码" class="flex-1" />
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
