<script setup lang="ts">
/* 账户中心入口 - 自动重定向到个人资料页 */
definePageMeta({
  layout: 'member',
  middleware: ['auth']
})

onMounted(() => {
  navigateTo('/account/profile', { replace: true })
})
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <el-empty description="页面加载中..." />
  </div>
</template>
