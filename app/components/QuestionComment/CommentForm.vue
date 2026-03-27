<template>
  <div class="comment-form bg-(--color-bg-container) rounded-lg p-4">
    <!-- 输入框 -->
    <div class="relative">
      <el-input
        v-model="formData.content"
        type="textarea"
        :rows="3"
        :placeholder="placeholder"
        :maxlength="maxLength"
        show-word-limit
        resize="none"
        class="w-full"
      />
    </div>

    <!-- 图片预览 -->
    <div v-if="formData.media.length > 0" class="flex gap-2 mt-3">
      <div
        v-for="(url, index) in formData.media"
        :key="index"
        class="relative w-20 h-20 rounded-lg overflow-hidden group"
      >
        <img :src="url" class="w-full h-full object-cover" />
        <button
          class="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          @click="removeImage(index)"
        >
          <Icon name="ep:close" class="text-xs" />
        </button>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="flex items-center justify-between mt-3">
      <div class="flex items-center gap-4">
        <!-- 上传图片按钮 -->
        <el-upload
          v-model:file-list="fileList"
          action="/app-api/infra/file/upload"
          :limit="3"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          accept="image/*"
          :show-file-list="false"
          class="upload-btn"
        >
          <button
            class="flex items-center gap-1 text-sm text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
            :disabled="formData.media.length >= 3"
          >
            <Icon name="ep:picture" class="text-base" />
            <span>图片 {{ formData.media.length }}/3</span>
          </button>
        </el-upload>
      </div>

      <!-- 提交按钮 -->
      <div class="flex items-center gap-3">
        <span v-if="replyToUser" class="text-xs text-(--color-text-secondary)">
          回复 <span class="text-(--color-text-primary)">{{ replyToUser }}</span>
        </span>
        <el-button
          type="primary"
          :disabled="!canSubmit || loading"
          :loading="loading"
          size="small"
          @click="handleSubmit"
        >
          {{ submitText }}
        </el-button>
        <el-button
          v-if="showCancel"
          size="small"
          @click="handleCancel"
        >
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UploadFile } from 'element-plus'

interface Props {
  questionId: number
  commentId?: number /* 回复时使用 */
  toUid?: number /* 回复时使用 */
  replyToUser?: string /* 回复对象昵称 */
  placeholder?: string
  submitText?: string
  showCancel?: boolean
  maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '发表你的评论...',
  submitText: '发表评论',
  showCancel: false,
  maxLength: 500,
})

const emit = defineEmits<{
  submit: [content: string, media: string[]]
  cancel: []
}>()

const message = useMessage()

const loading = ref(false)
const fileList = ref<UploadFile[]>([])

const formData = reactive({
  content: '',
  media: [] as string[],
})

/* 是否可以提交 */
const canSubmit = computed(() => {
  return formData.content.trim().length > 0
})

/* 上传前校验 */
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    message.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    message.error('图片大小不能超过5MB')
    return false
  }
  if (formData.media.length >= 3) {
    message.error('最多只能上传3张图片')
    return false
  }

  return true
}

/* 上传成功 */
const handleUploadSuccess = (response: any, uploadFile: UploadFile) => {
  if (response.code === 0 && response.data) {
    formData.media.push(response.data)
    message.success('图片上传成功')
  } else {
    message.error(response.msg || '图片上传失败')
  }
}

/* 上传失败 */
const handleUploadError = () => {
  message.error('图片上传失败')
}

/* 移除图片 */
const removeImage = (index: number) => {
  formData.media.splice(index, 1)
}

/* 提交 */
const handleSubmit = () => {
  if (!canSubmit.value) {
    message.warning('请输入评论内容')
    return
  }

  if (formData.content.length > props.maxLength) {
    message.warning(`评论内容最多${props.maxLength}字`)
    return
  }

  emit('submit', formData.content.trim(), formData.media)

  /* 重置表单 */
  formData.content = ''
  formData.media = []
  fileList.value = []
}

/* 取消 */
const handleCancel = () => {
  emit('cancel')
}

/* 暴露方法 */
defineExpose({
  reset: () => {
    formData.content = ''
    formData.media = []
    fileList.value = []
  },
})
</script>

<style scoped lang="scss">
/* 隐藏上传组件的默认样式 */
.upload-btn :deep(.el-upload) {
  display: inline-block;
}
</style>
