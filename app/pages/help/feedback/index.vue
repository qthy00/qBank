<template>
  <div class="feedback-page">
    <!-- 页面头部 -->
    <div class="page-header bg-gradient-to-r from-blue-500 to-blue-600 py-10">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-2 text-white/80 mb-2">
          <NuxtLink to="/help" class="hover:text-white">帮助中心</NuxtLink>
          <Icon name="ep:arrow-right" class="text-sm" />
          <span>问题反馈</span>
        </div>
        <h1 class="text-2xl font-bold text-white">问题反馈</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧表单 -->
        <div class="flex-1">
          <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-6">
            <h2 class="text-lg font-bold text-(--color-text-primary) mb-6">提交您的问题或建议</h2>

            <el-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              label-position="top"
            >
              <!-- 反馈类型 -->
              <el-form-item label="反馈类型" prop="type">
                <el-radio-group v-model="formData.type">
                  <el-radio-button
                    v-for="item in feedbackTypes"
                    :key="item.id"
                    :label="item.id"
                  >
                    {{ item.name }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <!-- 标题 -->
              <el-form-item label="标题" prop="title">
                <el-input
                  v-model="formData.title"
                  placeholder="请简要描述您的问题或建议"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>

              <!-- 内容 -->
              <el-form-item label="详细描述" prop="content">
                <el-input
                  v-model="formData.content"
                  type="textarea"
                  :rows="6"
                  placeholder="请详细描述您遇到的问题或建议，包括：
1. 问题发生的具体场景
2. 操作步骤
3. 期望的结果
4. 实际的结果"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>

              <!-- 联系方式 -->
              <el-form-item label="联系方式（选填）" prop="contact">
                <el-input
                  v-model="formData.contact"
                  placeholder="请输入您的手机号或邮箱，方便我们联系您"
                />
              </el-form-item>

              <!-- 提交按钮 -->
              <el-form-item>
                <el-button
                  type="primary"
                  size="large"
                  :loading="submitting"
                  @click="handleSubmit"
                >
                  <Icon name="ep:upload" class="mr-1" />
                  提交反馈
                </el-button>
                <el-button size="large" @click="handleReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 右侧信息 -->
        <div class="w-full lg:w-80 flex-shrink-0 space-y-6">
          <!-- 联系方式 -->
          <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4">
            <h3 class="font-bold text-(--color-text-primary) mb-4">其他联系方式</h3>
            <div class="space-y-4">
              <div class="contact-item flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon name="ep:service" class="text-blue-500" />
                </div>
                <div>
                  <p class="text-sm font-medium text-(--color-text-primary)">在线客服</p>
                  <p class="text-xs text-(--color-text-secondary)">工作日 9:00-18:00</p>
                </div>
              </div>
              <div class="contact-item flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="ep:message" class="text-green-500" />
                </div>
                <div>
                  <p class="text-sm font-medium text-(--color-text-primary)">客服邮箱</p>
                  <p class="text-xs text-(--color-text-secondary)">support@xueciyuan.com</p>
                </div>
              </div>
              <div class="contact-item flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Icon name="ep:phone" class="text-orange-500" />
                </div>
                <div>
                  <p class="text-sm font-medium text-(--color-text-primary)">客服电话</p>
                  <p class="text-xs text-(--color-text-secondary)">400-xxx-xxxx</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 反馈须知 -->
          <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4">
            <h3 class="font-bold text-(--color-text-primary) mb-4">反馈须知</h3>
            <ul class="text-sm text-(--color-text-secondary) space-y-2 list-disc pl-4">
              <li>请详细描述问题，便于我们快速定位</li>
              <li>提供联系方式，方便我们与您沟通</li>
              <li>我们会尽快处理您的反馈</li>
              <li>紧急问题建议直接联系客服</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeedbackTypeVO } from '~/types/help'
import { mockFeedbackTypes } from '~/api/help/mock'
import { submitFeedback } from '~/api/help'

definePageMeta({
  layout: 'default'
})

const message = useMessage()
const formRef = ref()
const submitting = ref(false)
const feedbackTypes = ref<FeedbackTypeVO[]>([])

const formData = reactive({
  type: 1,
  title: '',
  content: '',
  contact: ''
})

const formRules = {
  type: [{ required: true, message: '请选择反馈类型' }],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 5, max: 50, message: '标题长度应在 5-50 个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度应在 10-500 个字符之间', trigger: 'blur' }
  ]
}

/* 获取反馈类型 */
const fetchFeedbackTypes = async () => {
  /* 模拟API调用 */
  await new Promise(resolve => setTimeout(resolve, 200))
  feedbackTypes.value = mockFeedbackTypes
}

/* 提交反馈 */
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const selectedType = feedbackTypes.value.find(item => item.id === formData.type)
    await submitFeedback({
      type: formData.type,
      typeName: selectedType?.name || '',
      title: formData.title,
      content: formData.content,
      contact: formData.contact || undefined
    })
    message.success('反馈提交成功，我们会尽快处理！')
    handleReset()
  } catch (error) {
    message.error('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

/* 重置表单 */
const handleReset = () => {
  formRef.value?.resetFields()
  formData.type = 1
}

onMounted(() => {
  fetchFeedbackTypes()
})
</script>

<style scoped lang="scss">
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.contact-item {
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
}
</style>
