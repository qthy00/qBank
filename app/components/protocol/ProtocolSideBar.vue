<script setup lang="ts">
const appStore = useAppStore()
const {isMobile} = storeToRefs(appStore)

const {meta} = useRoute()
const activeMenu = ref(meta.name as string)
const drawerVisible = ref(false)


</script>

<template>
  <div class="container mx-auto flex my-8 px-4 relative">
    <!-- 移动端菜单按钮 -->
    <el-button
        class="!lg:hidden fixed top-15 left-5 z-50"
        circle
        size="large"
        @click="drawerVisible = true"
    >
      <Icon name="ep:menu" />
    </el-button>

    <!-- PC端菜单 -->
    <el-menu
        v-if="!isMobile"
        class="w-56 min-h-[600px] bg-white rounded-lg !p-4 !mt-8"
        :default-active="activeMenu"
        router
    >
      <ProtocolMenuContent />
    </el-menu>

    <!-- 移动端抽屉 -->
    <el-drawer
        v-model="drawerVisible"
        direction="ltr"
        size="240px"
        class="lg:hidden"
        :with-header="false"
    >
      <el-menu
          class="w-full"
          :default-active="activeMenu"
          router
          @select="drawerVisible = false"
      >
        <ProtocolMenuContent />
      </el-menu>
    </el-drawer>

    <!-- 主内容 -->
    <main class="w-full">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.el-menu {
  border-right: none;
}
.el-drawer__body {
  padding: 0;
}
</style>
