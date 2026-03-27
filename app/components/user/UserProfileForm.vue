<script setup lang="ts">
import { defaultProps } from '~/utils/tree'
import * as AreaApi from '~/api/area'
import { updateUserProfile } from '~/api/user'
import type {UserProfileUpdateReqVO} from '~/types/user/user'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const userStore = useUserStore()
const {user} = storeToRefs(userStore)

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const areaList = ref([]) // 地区列表
const formData = ref({
  nickname: '',
  sex: 0,
  birthday: '',
  areaId: 0,
  slogan: ''
})
const formRules = reactive({
  nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  resetForm()
  formData.value = {...user.value}
  // 获得地区列表
  areaList.value = await AreaApi.getAreaTree()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
defineEmits(['ok']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const res = await updateUserProfile(formData.value as unknown as UserProfileUpdateReqVO)
    if(res){
      message.success(t('common.updateSuccess'))
      dialogVisible.value = false
      // 发送操作成功的事件
      user.value = {
        ...user.value,
        ...formData.value
      }
    }
  } catch (e){
    console.log('修改用户信息出错啦~~~', e)
  } finally {
    formLoading.value = false
  }
}


/** 重置表单 */
const resetForm = () => {
  formData.value = {
    nickname: '',
    sex: 0,
    birthday: '',
    areaId: 0,
    slogan: ''
  }
  formRef.value?.resetFields()
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="500px"
    class="!rounded-xl !shadow-xl bg-white dark:bg-gray-900"
    :show-close="false"
  >
    <!-- 美化标题 -->
    <template #header>
      <div class="flex items-center gap-3 px-6 pt-5 pb-2 border-b border-gray-200">
        <i class="i-mdi-account-cog text-2xl text-sky-500" />
        <h2 class="text-lg font-semibold text-gray-800">编辑账户信息</h2>
      </div>
    </template>

    <!-- 表单内容 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="90px"
      class="px-6 py-4 space-y-5 text-sm"
    >
      <!-- 昵称 -->
      <el-form-item label="昵称">
        <el-input
          v-model="formData.nickname"
          placeholder="请输入昵称"
          class="rounded-md focus:ring-2 ring-sky-400"
        />
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别">
        <el-radio-group v-model="formData.sex">
          <el-radio :value="1" class="text-gray-700 hover:text-sky-600">男</el-radio>
          <el-radio :value="2" class="text-gray-700 hover:text-pink-500">女</el-radio>
          <el-radio :value="0" class="text-gray-700 hover:text-sky-600">保密</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 出生日期 -->
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="formData.birthday"
          type="date"
          placeholder="选择日期"
          class="w-full rounded-md"
        />
      </el-form-item>

      <!-- 所在地区 -->
      <el-form-item label="地址" prop="areaId">
        <el-cascader
          v-model="formData.areaId"
          :options="areaList"
          :props="defaultProps"
          class="w-1/1"
          clearable
          filterable
          placeholder="请选择城市"
        />
      </el-form-item>

      <!-- 简介 -->
      <el-form-item label="个性签名">
        <el-input
          v-model="formData.slogan"
          type="textarea"
          :rows="3"
          placeholder="一句话介绍你自己"
          class="rounded-md"
        />
      </el-form-item>
    </el-form>

    <!-- 更高级的 footer -->
    <template #footer>
      <div class="flex justify-end gap-3 px-6 pb-5">
        <el-button
          class="rounded-full px-5 border-gray-300 hover:bg-gray-100 text-gray-600"
          @click="dialogVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          class="rounded-full px-6 text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md transition-all"
          @click="submitForm"
        >
          <i class="i-mdi-check-bold mr-2" />
          保存修改
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>

<style scoped>

</style>
