<template>
  <!-- 工具头部占位组件 -->
  <div v-if="visible" class="bg-white border-b border-gray-200 py-3">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">工具标题</h2>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">工具描述信息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean
}

withDefaults(defineProps<Props>(), {
  visible: false
})
</script>
