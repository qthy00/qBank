<script setup lang="ts">
import { updateUserPassword } from '@/api/user'

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false)
const { t } = useI18n()
const message = useMessage()

const formData = ref({
  oldPassword: '',
  password: '',
  confirmPassword: '',
})
// 表单校验
const equalToPassword = (_rule, value, callback) => {
  if (formData.value.password !== value) {
    console.log(formData.value.password)
    console.log(formData.value.confirmPassword)
    callback(new Error(t('user.password.diffPwd')))
  } else {
    callback()
  }
}
const formRules = reactive({
  oldPassword: [
    { required: true, message: t('user.password.oldPwdMsg'), trigger: 'blur' },
    { min: 8, max: 16, message: t('user.password.pwdRules'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('user.password.newPwdMsg'), trigger: 'blur' },
    { min: 8, max: 16, message:  t('user.password.pwdRules'), trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: t('user.password.cfPwdMsg'), trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' },
  ],
})
const formRef = ref()
/** 打开弹窗 */
const open = async () => {
  resetForm()
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  formLoading.value = false
  try {
    const { oldPassword, password } = formData.value
    await updateUserPassword(oldPassword, password)
    message.notifySuccess('修改密码成功')
    dialogVisible.value = false
  } catch (e) {
    message.error('修改密码失败：' + e)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  }
  formRef.value?.resetFields()
}
</script>

<template>
  <Dialog v-model="dialogVisible" title="修改密码" width="40%" :scroll="false">
    <el-form
      class="my-10 mx-5"
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      v-loading="formLoading"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="formData.oldPassword" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          type="password"
          v-model="formData.password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          type="password"
          v-model="formData.confirmPassword"
          placeholder="请输入确认密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">提 交</el-button>
    </template>
  </Dialog>
</template>

<style scoped></style>
