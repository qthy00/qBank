---
name: file-oss-management
description: |
  文件上传与OSS管理开发指南。当用户需要实现文件上传、图片上传、OSS存储对接、MinIO、本地存储等功能时使用此技能。
  适用于 Nuxt 4 + Vue 3 前端项目。
  触发词：文件上传、图片上传、OSS、MinIO、云存储、头像上传、批量上传、分片上传
---

# 文件上传与OSS管理开发指南

## 何时使用

**适用场景**
- 单文件/多文件上传
- 图片上传（头像、封面等）
- 大文件分片上传
- OSS云存储对接（阿里云、腾讯云、AWS等）
- MinIO 私有云存储
- 本地上传存储
- 文件管理、预览、删除

**不适用场景**
- 后端文件存储服务开发
- 纯前端的文件系统操作
- 非Web环境的文件处理

---

## 上传方式选择

| 方式 | 适用场景 | 优点 | 缺点 |
|-----|---------|------|------|
| 直传后端 | 小文件、低频上传 | 简单、安全可控 | 占用后端带宽 |
| 直传OSS | 大文件、高频上传 | 快速、减轻后端压力 | 需处理签名、权限 |
| 分片上传 | 大文件（>100MB） | 断点续传、进度可控 | 实现复杂 |
| Base64 | 小图片、预览 | 无需二次请求 | 体积增大33% |

---

## 基础文件上传

### 1. 封装 useUpload

```typescript
// composables/useUpload.ts
import { httpUpload } from '~/composables/useHttp'

export interface UploadOptions {
  multiple?: boolean           // 是否多选
  accept?: string             // 文件类型限制
  maxSize?: number           // 最大文件大小（MB）
  maxCount?: number          // 最大文件数
  onProgress?: (percent: number) => void
}

export function useUpload() {
  const uploading = ref(false)
  const progress = ref(0)

  // 验证文件
  const validateFile = (file: File, options: UploadOptions): string | null => {
    // 文件类型检查
    if (options.accept && !file.type.match(options.accept)) {
      return `不支持该文件类型，请上传 ${options.accept} 格式的文件`
    }

    // 文件大小检查
    if (options.maxSize && file.size > options.maxSize * 1024 * 1024) {
      return `文件大小不能超过 ${options.maxSize}MB`
    }

    return null
  }

  // 单文件上传
  const uploadSingle = async (file: File, options: UploadOptions = {}): Promise<string> => {
    const error = validateFile(file, options)
    if (error) throw new Error(error)

    uploading.value = true
    progress.value = 0

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await httpUpload('uploadFile', '/infra/file/upload', formData)
      return res.url // 返回文件URL
    } finally {
      uploading.value = false
      progress.value = 100
    }
  }

  // 多文件上传
  const uploadMultiple = async (files: File[], options: UploadOptions = {}): Promise<string[]> => {
    if (options.maxCount && files.length > options.maxCount) {
      throw new Error(`最多只能上传 ${options.maxCount} 个文件`)
    }

    const urls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const url = await uploadSingle(files[i], options)
      urls.push(url)
      if (options.onProgress) {
        options.onProgress(Math.round(((i + 1) / files.length) * 100))
      }
    }
    return urls
  }

  return {
    uploading,
    progress,
    uploadSingle,
    uploadMultiple
  }
}
```

### 2. 基础上传组件

```vue
<template>
  <el-upload
    v-model:file-list="fileList"
    :action="uploadUrl"
    :headers="uploadHeaders"
    :before-upload="handleBeforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :accept="accept"
    :multiple="multiple"
    :limit="maxCount"
    :show-file-list="showFileList"
    class="upload-component"
  >
    <el-button type="primary" :loading="uploading">
      <Icon name="ep:upload" /> {{ buttonText }}
    </el-button>
    <template #tip>
      <div class="el-upload__tip text-(--color-text-secondary)">
        {{ tipText }}
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import type { UploadProps } from 'element-plus'

interface Props {
  accept?: string           // 文件类型，如 '.jpg,.png'
  multiple?: boolean        // 是否多选
  maxSize?: number         // 最大文件大小（MB）
  maxCount?: number        // 最大文件数
  buttonText?: string      // 按钮文字
  showFileList?: boolean   // 是否显示文件列表
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*',
  multiple: false,
  maxSize: 10,
  maxCount: 1,
  buttonText: '点击上传',
  showFileList: true
})

const emit = defineEmits<{
  success: [urls: string[]]
  error: [error: string]
}>()

const message = useMessage()
const token = useToken()
const fileList = ref([])
const uploading = ref(false)

const uploadUrl = '/app-api/infra/file/upload'
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${token.value}`
}))

const tipText = computed(() => {
  const sizeText = `大小不超过 ${props.maxSize}MB`
  const countText = props.multiple ? `，最多 ${props.maxCount} 个文件` : ''
  return sizeText + countText
})

// 上传前验证
const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 文件大小验证
  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    message.error(`文件大小不能超过 ${props.maxSize}MB`)
    return false
  }

  // 文件类型验证
  if (props.accept !== '*' && props.accept) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    const acceptExts = props.accept.split(',').map(s => s.replace('.', '').trim())
    if (ext && !acceptExts.includes(ext)) {
      message.error(`仅支持 ${props.accept} 格式的文件`)
      return false
    }
  }

  uploading.value = true
  return true
}

// 上传成功
const handleSuccess: UploadProps['onSuccess'] = (res) => {
  uploading.value = false
  if (res.code === 0) {
    emit('success', [res.data.url])
    message.success('上传成功')
  } else {
    emit('error', res.msg || '上传失败')
    message.error(res.msg || '上传失败')
  }
}

// 上传失败
const handleError: UploadProps['onError'] = () => {
  uploading.value = false
  emit('error', '上传失败')
  message.error('上传失败')
}
</script>
```

---

## 图片上传组件

### 1. 图片裁剪上传

```vue
<template>
  <div class="image-uploader">
    <!-- 单图上传 -->
    <div v-if="!multiple" class="single-uploader">
      <el-upload
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="customUpload"
        accept="image/*"
      >
        <div v-if="imageUrl" class="preview-wrapper">
          <img :src="imageUrl" class="preview-image" />
          <div class="preview-mask">
            <Icon name="ep:zoom-in" @click.stop="previewImage" />
            <Icon name="ep:delete" @click.stop="removeImage" />
          </div>
        </div>
        <div v-else class="upload-placeholder">
          <Icon name="ep:plus" class="text-2xl mb-2" />
          <span>点击上传</span>
        </div>
      </el-upload>
    </div>

    <!-- 多图上传 -->
    <div v-else class="multiple-uploader">
      <div v-for="(url, index) in imageList" :key="index" class="image-item">
        <img :src="url" />
        <div class="image-actions">
          <Icon name="ep:zoom-in" @click="previewImage(url)" />
          <Icon name="ep:delete" @click="removeImage(index)" />
        </div>
      </div>
      <el-upload
        v-if="imageList.length < maxCount"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="customUpload"
        accept="image/*"
        class="upload-add"
      >
        <div class="upload-placeholder">
          <Icon name="ep:plus" class="text-xl" />
        </div>
      </el-upload>
    </div>

    <!-- 预览弹窗 -->
    <el-image-viewer
      v-if="previewVisible"
      :url-list="[previewUrl]"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus'

interface Props {
  modelValue?: string | string[]
  multiple?: boolean
  maxCount?: number
  maxSize?: number    // MB
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 9,
  maxSize: 5
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const message = useMessage()
const { uploadSingle } = useUpload()

const imageUrl = computed({
  get: () => props.modelValue as string || '',
  set: (val) => emit('update:modelValue', val)
})

const imageList = computed({
  get: () => (props.modelValue as string[]) || [],
  set: (val) => emit('update:modelValue', val)
})

const previewVisible = ref(false)
const previewUrl = ref('')

// 上传前验证
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('请上传图片文件')
    return false
  }

  if (file.size > props.maxSize * 1024 * 1024) {
    message.error(`图片大小不能超过 ${props.maxSize}MB`)
    return false
  }

  return true
}

// 自定义上传
const customUpload = async (options: UploadRequestOptions) => {
  try {
    const url = await uploadSingle(options.file, { maxSize: props.maxSize })

    if (props.multiple) {
      imageList.value = [...imageList.value, url]
    } else {
      imageUrl.value = url
    }

    return url
  } catch (error: any) {
    message.error(error.message || '上传失败')
    throw error
  }
}

// 预览图片
const previewImage = (url?: string) => {
  previewUrl.value = url || imageUrl.value
  previewVisible.value = true
}

// 删除图片
const removeImage = (index?: number) => {
  if (props.multiple && typeof index === 'number') {
    const list = [...imageList.value]
    list.splice(index, 1)
    imageList.value = list
  } else {
    imageUrl.value = ''
  }
}
</script>

<style scoped lang="scss">
.upload-placeholder {
  width: 120px;
  height: 120px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }
}

.preview-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;

  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .preview-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    opacity: 0;
    transition: opacity 0.3s;
    color: #fff;

    .icon {
      cursor: pointer;
      font-size: 20px;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  &:hover .preview-mask {
    opacity: 1;
  }
}

.multiple-uploader {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .image-item {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 6px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-actions {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;

      .icon {
        cursor: pointer;
        font-size: 20px;

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }

    &:hover .image-actions {
      opacity: 1;
    }
  }
}
</style>
```

---

## 大文件分片上传

```vue
<template>
  <div class="chunk-uploader">
    <el-upload
      drag
      :auto-upload="false"
      :on-change="handleFileChange"
      :show-file-list="false"
      accept="video/*"
    >
      <Icon name="ep:upload" class="text-4xl text-(--color-text-secondary)" />
      <div class="el-upload__text">
        将文件拖到此处，或 <em>点击上传</em>
      </div>
    </el-upload>

    <!-- 上传进度 -->
    <div v-if="uploading" class="mt-4">
      <div class="flex justify-between mb-2">
        <span>{{ fileName }}</span>
        <span>{{ progress }}%</span>
      </div>
      <el-progress :percentage="progress" :status="progress === 100 ? 'success' : ''" />
      <div class="flex justify-center gap-4 mt-4">
        <el-button v-if="paused" type="primary" @click="resumeUpload">继续</el-button>
        <el-button v-else @click="pauseUpload">暂停</el-button>
        <el-button type="danger" @click="cancelUpload">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UploadFile } from 'element-plus'
import { httpPost } from '~/composables/useHttp'

const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB 分片

const message = useMessage()
const uploading = ref(false)
const paused = ref(false)
const progress = ref(0)
const fileName = ref('')
const currentChunk = ref(0)
const totalChunks = ref(0)
const fileHash = ref('')
const uploadFile = ref<File | null>(null)

// 计算文件hash
const calculateHash = async (file: File): Promise<string> => {
  // 使用文件前1MB内容计算简单hash
  const chunk = file.slice(0, Math.min(1024 * 1024, file.size))
  const buffer = await chunk.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 选择文件
const handleFileChange = async (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return

  uploading.value = true
  paused.value = false
  progress.value = 0
  fileName.value = file.name
  currentChunk.value = 0
  totalChunks.value = Math.ceil(file.size / CHUNK_SIZE)

  // 计算文件hash作为唯一标识
  fileHash.value = await calculateHash(file)

  // 检查是否已存在上传任务（断点续传）
  try {
    const checkRes = await httpPost('checkChunk', '/infra/file/check', {
      fileHash: fileHash.value,
      fileName: file.name,
      totalChunks: totalChunks.value
    })

    if (checkRes.uploaded) {
      message.success('文件已上传')
      progress.value = 100
      uploading.value = false
      return
    }

    // 从已上传的分片继续
    currentChunk.value = checkRes.uploadedChunks?.length || 0
    await uploadChunks(file)
  } catch (error) {
    message.error('上传初始化失败')
    uploading.value = false
  }
}

// 上传分片
const uploadChunks = async (file: File) => {
  uploadFile.value = file

  for (let i = currentChunk.value; i < totalChunks.value; i++) {
    if (paused.value) break

    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append('file', chunk)
    formData.append('chunkNumber', String(i))
    formData.append('totalChunks', String(totalChunks.value))
    formData.append('fileHash', fileHash.value)
    formData.append('fileName', file.name)

    try {
      await httpPost(`uploadChunk-${i}`, '/infra/file/chunk', formData)
      currentChunk.value = i + 1
      progress.value = Math.round((currentChunk.value / totalChunks.value) * 100)
    } catch (error) {
      message.error(`第 ${i + 1} 分片上传失败`)
      paused.value = true
      return
    }
  }

  // 所有分片上传完成，合并文件
  if (currentChunk.value === totalChunks.value) {
    try {
      const result = await httpPost('mergeChunks', '/infra/file/merge', {
        fileHash: fileHash.value,
        fileName: file.name,
        totalChunks: totalChunks.value
      })
      message.success('上传成功')
      progress.value = 100
    } catch (error) {
      message.error('文件合并失败')
    }
  }

  uploading.value = false
}

// 暂停上传
const pauseUpload = () => {
  paused.value = true
}

// 继续上传
const resumeUpload = () => {
  paused.value = false
  if (uploadFile.value) {
    uploadChunks(uploadFile.value)
  }
}

// 取消上传
const cancelUpload = () => {
  paused.value = true
  uploading.value = false
  progress.value = 0
  uploadFile.value = null
}
</script>
```

---

## 最佳实践

1. **文件验证**
   - 前端验证文件类型和大小
   - 后端进行二次验证
   - 限制上传频率防止滥用

2. **图片处理**
   - 上传前压缩图片减少带宽
   - 生成缩略图用于列表展示
   - 支持图片预览和裁剪

3. **大文件处理**
   - 使用分片上传支持断点续传
   - 显示上传进度和速度
   - 支持暂停/继续功能

4. **安全性**
   - 验证文件真实类型（不只是扩展名）
   - 限制上传目录防止目录遍历
   - 病毒扫描（后端处理）
   - 设置文件访问权限

5. **用户体验**
   - 上传中显示 loading 状态
   - 上传失败提供重试机制
   - 支持拖拽上传
   - 显示上传进度条

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-21
