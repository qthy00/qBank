<template>
  <el-button
    :type="type"
    plain
    class="px-2 sm:px-6 py-1 sm:py-3 text-sm sm:text-base h-auto whitespace-nowrap"
    :disabled="isExporting || disabled"
    @click="handleExport"
  >
    <Icon name="uiw:file-pdf" />
    <span v-if="isExporting" class="loading">
      <Icon name="la:spinner" class="mr-1"/>导出中...
    </span>
    <span v-else >{{ buttonText }}</span>
  </el-button>

</template>

<script setup lang="ts">
import { exportToPdf, type HeaderInfo, type PdfExportOptions } from './pdf-export-util';

// 定义组件属性
const props = defineProps<{
  // 目标元素的ref
  targetRef: HTMLElement | null;
  // 页头信息
  headerInfo: HeaderInfo;
  // 导出的文件名
  filename: string;
  // 按钮文本
  buttonText?: string;
  // 页面方向 'p'纵向 'l'横向
  orientation?: 'p' | 'l';
  // 页面格式
  format?: 'a4' | 'letter' | 'legal';
  // 是否禁用按钮
  disabled?: boolean;
  // 缩放比例
  scale?: number;
  type?: string
}>();

// 定义组件事件
const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'error', error: Error): void;
  (e: 'start'): void;
  (e: 'end'): void;
}>();

// 导出状态
const isExporting = ref(false);

// 处理导出逻辑
const handleExport = async () => {
  if (!props.targetRef) {
    emit('error', new Error('未找到需要导出的元素，请检查targetRef是否正确'));
    return;
  }

  isExporting.value = true;
  emit('start');

  try {
    const exportOptions: PdfExportOptions = {
      targetRef: props.targetRef,
      headerInfo: props.headerInfo,
      filename: props.filename,
      orientation: props.orientation,
      format: props.format,
      scale: props.scale
    };

    await exportToPdf(exportOptions);
    emit('success');
  } catch (error) {
    emit('error', error as Error);
  } finally {
    isExporting.value = false;
    emit('end');
  }
};
</script>

<style scoped>

.loading {
  margin-left: 8px;
  font-size: 12px;
}
</style>
