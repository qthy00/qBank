<template>
  <div class="flex flex-col">
    <div class="upload-box">
      <ul
        v-for="(item, index) in fileList"
        :key="index"
        class="el-upload-list el-upload-list--picture-card"
      >
        <li class="el-upload-list__item is-success animated">
          <el-image class="originalImg" :src="item.url" :preview-src-list="[item.url as string]" />
          <span class="el-upload-list__item-actions">
          <!-- 预览    -->
          <span
            class="el-upload-list__item-preview handle-icon"
            @click="imagePreview(item.url as string)"
          >
            <Icon name="ep:zoom-in" />
            <span>查看</span>
          </span>
            <!-- 删除    -->
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete handle-icon"
            @click="handleRemove(item.url)"
          >
            <Icon name="ep:delete" />
            <span>删除</span>
          </span>
        </span>
        </li>
      </ul>
      <template v-if="fileList.length < limit">
        <el-upload
          v-model:file-list="fileList"
          :accept="fileType.join(',')"
          :action="uploadUrl"
          :before-upload="beforeUpload"
          :class="['upload', drag ? 'no-border' : '']"
          :disabled="disabled"
          :drag="drag"
          :limit="limit"
          :http-request="httpRequest"
          :multiple="multiple"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          :on-exceed="handleExceed"
          :show-file-list="false"
          list-type="picture-card"
        >
          <div class="upload-empty">
            <slot name="empty">
              <Icon name="ep:plus" />
              <!-- <span>请上传图片</span> -->
            </slot>
          </div>
        </el-upload>
      </template>
    </div>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
  </div>

</template>

<script lang="ts" setup>
import type { UploadProps, UploadUserFile } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useUpload } from '~/components/Upload/src/useUpload'
import { createImageViewer } from '@/components/ImageViewer'
import {ElNotification} from 'element-plus'

defineOptions({ name: 'UploadImg' })

type FileTypes =
  | 'image/apng'
  | 'image/bmp'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/pjpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/webp'
  | 'image/x-icon'

const fileList = ref<UploadUserFile[]>([])
const uploadNumber = ref<number>(0)
const uploadList = ref<UploadUserFile[]>([])

// 接受父组件参数
const props = defineProps({
  modelValue: propTypes.oneOfType<string | string[]>([String, Array<String>]).isRequired,
  drag: propTypes.bool.def(true), // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled: propTypes.bool.def(false), // 是否禁用上传组件 ==> 非必传（默认为 false）
  limit: propTypes.number.def(20), // 最大图片上传数 ==> 非必传（默认为 5张）
  fileSize: propTypes.number.def(5), // 图片大小限制 ==> 非必传（默认为 5M）
  fileType: propTypes.array.def(['image/jpeg', 'image/png', 'image/gif']), // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height: propTypes.string.def('150px'), // 组件高度 ==> 非必传（默认为 150px）
  width: propTypes.string.def('150px'), // 组件宽度 ==> 非必传（默认为 150px）
  borderradius: propTypes.string.def('8px'), // 组件边框圆角 ==> 非必传（默认为 8px）
  showDelete: propTypes.bool.def(true), // 是否显示删除按钮
  showBtnText: propTypes.bool.def(true), // 是否显示按钮文字
  //是否支持多选文件
  multiple: {
    type: Boolean,
    default: true,
  },
})
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
// 查看图片
const imagePreview = (imgUrl: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [imgUrl],
  })
}

// 监听模型绑定值变动
watch(
  () => props.modelValue,
  (val: string | string[]) => {
    if (!val) {
      fileList.value = [] // fix：处理掉缓存，表单重置后上传组件的内容并没有重置
      return
    }

    fileList.value = [] // 保障数据为空
    if(Array.isArray( val)){
      fileList.value.push(
        ...(val).map((url) => ({ name: url.substring(url.lastIndexOf('/') + 1), url })),
      )
    }

  },
  { immediate: true, deep: true },
)

const emit = defineEmits(['update:modelValue'])

const { uploadUrl, httpRequest } = useUpload()

const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType

  if (!imgType.includes(rawFile.type as FileTypes))
    ElNotification({
      title: '温馨提示',
      message: '上传图片不符合所需的格式！',
      type: 'warning'
    })
  if (!imgSize)
    ElNotification({
      title: '温馨提示',
      message: `上传图片大小不能超过 ${props.fileSize}M！`,
      type: 'warning'
    })
  uploadNumber.value++
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}
// 上传成功
const uploadSuccess: UploadProps['onSuccess'] = (res: any): void => {
  message.success('上传成功')
// 删除自身
  const index = fileList.value.findIndex((item) => item.response?.data === res.data)
  fileList.value.splice(index, 1)
  uploadList.value.push({name: res.data.substring(res.data.lastIndexOf('/') + 1), url: res.data})
  if (uploadList.value.length == uploadNumber.value) {
    fileList.value.push(...uploadList.value)
    uploadList.value = []
    uploadNumber.value = 0
    emitUpdateModelValue()
  }
}

// 发送图片链接列表更新
const emitUpdateModelValue = () => {
  let result: string[] = fileList.value.map((file) => file.url!)
  emit('update:modelValue', result)
}

// 图片上传错误提示
const uploadError = () => {
  message.notifyError('图片上传失败，请您重新上传！')
}

// 删除图片
const handleRemove = (url?: string) => {
  if (!url) return
  fileList.value = fileList.value.filter((item) => item.url !== url)
  emit(
    'update:modelValue',
    fileList.value.map((file) => file.url!),
  )
}

// 文件数超出提示
const handleExceed = () => {
  ElNotification({
    title: '温馨提示',
    message: `当前最多只能上传 ${props.limit} 张图片，请移除后上传！`,
    type: 'warning'
  })
}
</script>
<style lang="scss" scoped>
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;

    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  display: flex;
  flex-wrap: wrap;
  vertical-align: middle;

  .originalImg {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .el-upload-list__item-actions {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: rgb(0 0 0 / 60%);
    opacity: 0;
    box-sizing: border-box;
    transition: var(--el-transition-duration-fast);
    align-items: center;
    justify-content: center;

    .handle-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 6%;
      color: aliceblue;

      .el-icon {
        margin-bottom: 15%;
        font-size: 140%;
      }

      span {
        font-size: 14px;
      }
    }
  }

  .el-upload-list__item {
    &:hover {
      .el-upload-list__item-actions {
        opacity: 1;
      }
    }
  }

  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      border: 2px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderradius);

      &:hover {
        border: 2px dashed var(--el-color-primary);
        background-color: #eff6ff;
      }
    }

    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border-radius: v-bind(borderradius);
    }

    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-info);

      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .el-upload-list__item,
  .el-upload--picture-card {
    width: v-bind(width);
    height: v-bind(height);
    background-color: transparent;
    border-radius: v-bind(borderradius);
  }

  ul:nth-child(6n + 6) {
    li {
      margin-right: 0;
    }
  }

  .el-upload__tip {
    display: block;
    line-height: 15px;
    text-align: center;
  }
}
</style>
