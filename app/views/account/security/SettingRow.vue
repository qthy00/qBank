<!-- 设置项复用组件 -->
<script setup lang="ts">
defineProps({
  icon: String,
  title: String,
  desc: String,
  size: {
    type: Number,
    default: 25,
    required: false,
  },
  color: {
    type: String,
    default: '#409EFF',
    required: false,
  },
})
</script>

<template>
  <div class="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
    <div class="flex items-center gap-3 text-sm text-gray-700">
      <Icon :name="icon" :size="size" :color="color" class="text-2xl" />
      <div>
        <div class="font-medium">{{ title }}</div>
        <div class="text-xs text-gray-500">{{ desc }}</div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped></style>
