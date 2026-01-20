<template>
  <div class="category-header flex items-center p-2 bg-blue-50 rounded-lg mt-4">
    <div class="category-number w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
      {{ numberToChinese(index + 1) }}
    </div>
    <h3 class="category-title text-sm sm:text-base font-semibold text-blue-700">
      {{ typeName }}（共{{ total }}题，每题{{ score }}分）
    </h3>
  </div>
</template>

<script setup lang="ts">
import { numberToChinese } from '@/utils'

// 接收props
defineProps<{
  index: number
  type: number
  total: number
  score: number
  typeName: string
}>()
</script>

<style scoped>
.category-header {
  transition: all 0.2s ease;
}

.category-header:hover {
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  transform: translateX(2px);
}
</style>
