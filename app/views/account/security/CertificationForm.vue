<script setup lang="ts">
import { verifyRealName } from '~/api/user'
import { Avatar } from '@element-plus/icons-vue'

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false)
const message = useMessage()
const agreeTerm = ref(false)
const formData = ref({
  name: '',
  idCard: '',
})

const formRules = reactive({
  name: [
    { required: true, trigger: 'blur', message: '请输入您的姓名' },
  ],
  idCard: [
    { required: true, message: '身份证号不能为空', trigger: 'blur' },
  ],
})
const formRef = ref()


/** 打开弹窗 */
const open = async () => {
  resetForm()
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const emit = defineEmits(['success'])
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  if(!agreeTerm.value){
    message.error('请同意条款')
    return
  }

  formLoading.value = false
  try {
    await verifyRealName(formData.value)
    message.notifySuccess('认证成功')
    dialogVisible.value = false
    emit('success')
  } catch (e) {
    message.error('认证失败：' + e)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    name: '',
    idCard: '',
  }
  formRef.value?.resetFields()
}

const openTerms = () => {
  // window.open('https://www.baidu.com')
}
</script>

<template>
  <Dialog v-model="dialogVisible" title="实名认证" width="40%" :scroll="false">
    <div class="text-gray-500 mt-2 text-center">请输入真实姓名和身份证号码完成实名认证</div>
    <el-form
      class="my-10 mx-5"
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      label-position="top"
      v-loading="formLoading"
    >
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入您的姓名" :prefix-icon="Avatar" />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input
          v-model="formData.idCard"
          placeholder="请输入18位身份证号码"
          class="flex-1"
        >
          <template #prefix>
            <Icon name="mage:id-card" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="agreeTerm">
          我已阅读并同意
          <el-button link type="primary" @click="openTerms">《实名认证服务条款》</el-button>
        </el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">提 交</el-button>
    </template>
  </Dialog>
</template>

<style scoped></style>
