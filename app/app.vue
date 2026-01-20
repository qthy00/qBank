<script setup lang="ts">
const appStore = useAppStore()
onMounted(() => {
  appStore.init()
})


</script>


<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
/* 全局样式确保组件正确显示 */
#__nuxt {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 20px;
}
</style>

