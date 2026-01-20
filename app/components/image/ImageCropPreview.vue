<template>
  <el-card>
    <div>
      <h2 class="text-xl font-semibold mb-4">
        选择切割区域
        <el-tag size="small" class="ml-2">拖动调整选择框</el-tag>
      </h2>

      <!-- 带网格背景的裁剪容器 -->
      <div class="w-full h-[400px] border rounded-lg overflow-hidden relative">
        <!-- 透明网格背景 -->
        <div class="absolute inset-0 grid-bg"></div>

        <!-- 图片裁剪容器 -->
        <div class="w-full h-full">
          <img
            ref="imageRef"
            :src="imageUrl"
            class="w-full h-full object-contain"
            alt="原始图片"
            @load="handleImageLoad"
          />
        </div>
      </div>

      <!-- 裁剪控制按钮 - 增加了正方形裁剪按钮 -->
      <div class="mt-4 flex flex-wrap gap-2">
        <el-button type="primary" @click="initCropper">初始化裁剪</el-button>
        <el-button type="warning" @click="zoomIn">放大</el-button>
        <el-button type="warning" @click="zoomOut">缩小</el-button>
        <el-button type="info" @click="setSquareCrop">正方形裁剪</el-button>
        <el-button type="danger" @click="resetCropper">重置选择框</el-button>
      </div>

      <!-- 选中区域信息 -->
      <div
        v-if="selectedArea"
        class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm"
      >
        <p class="font-medium">选中区域信息:</p>
        <p>位置: ({{ Math.round(selectedArea.x) }}, {{ Math.round(selectedArea.y) }})</p>
        <p>
          尺寸: {{ Math.round(selectedArea.width) }} × {{ Math.round(selectedArea.height) }} 像素
          <template v-if="isSquare">
            <el-tag size="small" class="ml-2 bg-green-100 text-green-800 border-none">正方形</el-tag>
          </template>
        </p>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

// 手动定义Cropper配置选项类型
interface CropperOptions {
  viewMode?: number
  dragMode?: 'none' | 'move' | 'crop'
  scalable?: boolean
  zoomable?: boolean
  rotatable?: boolean
  aspectRatio?: number | null
  autoCrop?: boolean
  autoCropArea?: number
  minContainerWidth?: string | number
  minContainerHeight?: string | number
  checkImageOrigin?: boolean
  cropBoxMovable?: boolean
  cropBoxResizable?: boolean
  toggleDragModeOnDblclick?: boolean
  ready?: () => void
  crop?: () => void // 添加裁剪事件
}

const message = useMessage()

// 定义组件事件
const emit = defineEmits<{
  (e: 'area-updated', area: { x: number; y: number; width: number; height: number }): void
}>()

// 定义组件属性
const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  imageWidth: {
    type: Number,
    required: true,
  },
  imageHeight: {
    type: Number,
    required: true,
  },
})

// 状态管理
const imageRef = ref<HTMLImageElement | null>(null)
const cropper = ref<Cropper | null>(null)
const selectedArea = ref<{ x: number; y: number; width: number; height: number } | null>(null)
const isSquare = ref<boolean>(false) // 新增：标记是否为正方形裁剪

// 更新选中区域并通知父组件
const updateSelectedArea = () => {
  if (!cropper.value) return

  const rawCropData = cropper.value.getData(true) // true 表示返回相对于原始图片的坐标

  // 验证并修正区域（确保在原始图片范围内）
  const imgWidth = cropper.value.getImageData().naturalWidth
  const imgHeight = cropper.value.getImageData().naturalHeight

  const realArea = {
    x: Math.max(0, Math.min(rawCropData.x, imgWidth)),
    y: Math.max(0, Math.min(rawCropData.y, imgHeight)),
    width: Math.max(1, Math.min(rawCropData.width, imgWidth - rawCropData.x)),
    height: Math.max(1, Math.min(rawCropData.height, imgHeight - rawCropData.y)),
  }

  // 检查是否为正方形（考虑微小的浮点误差）
  isSquare.value = Math.abs(realArea.width - realArea.height) < 1

  selectedArea.value = realArea
  emit('area-updated', realArea)
}

// 图片加载完成处理
const handleImageLoad = () => {
  // 确保DOM已更新
  nextTick(() => {
    initCropper()
  })
}

// 初始化裁剪器 - 确保正确设置初始选择框
const initCropper = () => {
  // 确保图片元素存在
  const imgElement = imageRef.value
  if (!imgElement || !(imgElement instanceof HTMLImageElement)) {
    message.error('图片元素加载失败，请重试')
    return
  }

  // 销毁已有实例
  if (cropper.value) {
    cropper.value.destroy()
  }

  // 定义裁剪器配置
  const cropperOptions: CropperOptions = {
    viewMode: 1,
    dragMode: 'crop', // 默认使用裁剪模式
    scalable: true,
    zoomable: true,
    rotatable: false,
    aspectRatio: null, // 默认不限制比例
    autoCrop: true, // 自动创建裁剪框
    autoCropArea: 1, // 初始裁剪区域占比（1为100%）
    minContainerWidth: '100%',
    minContainerHeight: '100%',
    checkImageOrigin: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
    ready: () => {
      adjustInitialZoom()
      // 初始化完成后立即更新选择区域
      updateSelectedArea()
      message.success('已自动选择整个图片区域，您可以拖动调整')
    },
    crop: updateSelectedArea, // 每次裁剪框变化时更新区域
  }

  // 实例化Cropper
  cropper.value = new Cropper(imgElement, cropperOptions as any)
}

// 新增：将裁剪框设置为正方形
const setSquareCrop = () => {
  if (!cropper.value) {
    message.warning('请先初始化裁剪器')
    return
  }

  // 获取当前裁剪框数据
  const cropData = cropper.value.getData()

  // 计算正方形的边长（取当前宽高中的最小值）
  const squareSize = Math.min(cropData.width, cropData.height)

  // 如果当前已经是正方形，则取消比例锁定
  if (Math.abs(cropData.width - cropData.height) < 1) {
    cropper.value.setAspectRatio(null)
    isSquare.value = false
    message.info('已取消正方形比例锁定')
    return
  }

  // 设置裁剪框为正方形
  cropper.value.setAspectRatio(1) // 锁定1:1比例

  // 调整裁剪框大小为正方形
  cropper.value.setData({
    width: squareSize,
    height: squareSize
  })

  isSquare.value = true
  message.success('已将裁剪框设置为正方形')
}

// 调整初始缩放
const adjustInitialZoom = () => {
  if (!cropper.value || !imageRef.value) return

  const containerHeight = 400
  const heightRatio = containerHeight / props.imageHeight
  cropper.value.zoomTo(Math.min(heightRatio, 1))
}

// 放大图片
const zoomIn = () => {
  if (cropper.value) {
    cropper.value.zoom(0.1)
  } else {
    message.warning('请先初始化裁剪器')
  }
}

// 缩小图片
const zoomOut = () => {
  if (cropper.value) {
    cropper.value.zoom(-0.1)
  } else {
    message.warning('请先初始化裁剪器')
  }
}

// 重置视图和选择框
const resetCropper = () => {
  if (cropper.value) {
    cropper.value.reset()
    // 重置后重新选择整个图片
    cropper.value.setCropBoxData({
      left: 0,
      top: 0,
      width: props.imageWidth,
      height: props.imageHeight,
    })
    // 重置时取消正方形比例锁定
    cropper.value.setAspectRatio(null)
    isSquare.value = false
    adjustInitialZoom()
    updateSelectedArea() // 通知父组件区域已重置
  } else {
    message.warning('请先初始化裁剪器')
  }
}

// 清理函数
const cleanup = () => {
  if (cropper.value) {
    cropper.value.destroy()
    cropper.value = null
  }
}

// 组件生命周期
onMounted(() => {
  // 检查图片是否已缓存
  if (imageRef.value && imageRef.value.complete) {
    handleImageLoad()
  }
})

onUnmounted(cleanup)

// 暴露方法给父组件
defineExpose({
  initCropper,
  resetCropper,
  setSquareCrop, // 暴露正方形裁剪方法
  cleanup,
})
</script>

<style scoped>
/* 可以添加网格背景样式 */
.grid-bg {
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
}
</style>
