<script setup lang="ts">

const showSearch = ref(false)

const handleSearchToggle = () => {
  showSearch.value = !showSearch.value
}

const handleSearch = () => {
  console.log('搜索')
}

</script>

<template>
  <div class="bg-white shadow-xs p-1 mt-12">
    <div class="container mx-auto flex items-center justify-between">
      <!-- 左侧 Logo -->
      <div class="flex items-center space-x-2 w-3/12 min-w-[100px]">
        <a href="#">
          <img src="https://dd.qthy.cc/102/hyserver/cms/image/082504/b7e6afaaa16e3b5073c8d88924a2f480.png" alt="logo">
        </a>
      </div>
      <!-- 中间菜单栏 -->
      <div class="middle-container flex-1 relative overflow-hidden">
        <div
            v-if="!showSearch"
            class="flex justify-start space-x-6 whitespace-nowrap transition-all duration-300 ease-in-out">
          <div class="w-[38px] flex-shrink-0"/>
          <div
              class="group relative flex flex-col items-center text-sm text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer px-2 flex-shrink-0">
            <a
                href="#"
                class="group flex flex-col items-center text-(--color-text) hover:text-(--color-text-hover)">
              <i class="hy-ico-shouye ic-20"/>
              <span class="mt-2 relative leading-5">
                    首页
                    <span
                        class="absolute left-0 -bottom-0 w-full h-0.5 bg-(--color-text-hover) scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"/>
                  </span>
            </a>
          </div>
          <div
              class="group relative flex flex-col items-center text-sm text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer px-2 flex-shrink-0">
            <a
                href="/qBank" target="_blank"
                class="group flex flex-col items-center text-(--color-text) hover:text-(--color-text-hover)">
              <i class="hy-ico-tiku ic-20"/>
              <span class="mt-2 relative leading-5">
                    智慧题库
                    <span
                        class="absolute left-0 -bottom-0 w-full h-0.5 bg-(--color-text-hover) scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"/>
                  </span>
            </a>
            <a href="" class=""/>
          </div>
          <div
              class="group relative flex flex-col items-center text-sm text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer px-2 flex-shrink-0">
            <a
                href="/document" target="_blank"
                class="group flex flex-col items-center text-(--color-text) hover:text-(--color-text-hover)">
              <i class="hy-ico-wd ic-20"/>
              <span class="mt-2 relative leading-5">
                    文档下载
                    <span
                        class="absolute left-0 -bottom-0 w-full h-0.5 bg-(--color-text-hover) scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"/>
                  </span>
            </a>
          </div>

          <!-- <div
            class="group relative flex flex-col items-center text-sm text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer px-2 flex-shrink-0">
            <a href="#"
              class="group flex flex-col items-center text-(--color-text) hover:text-(--color-text-hover)">
              <i class="hy-ico-gmjc ic-20"></i>
              <span class="mt-2 relative leading-5">
                教材书籍
                <span
                  class="absolute left-0 -bottom-0 w-full h-0.5 bg-(--color-text-hover) scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </span>
            </a>
          </div> -->

          <div
              class="group relative flex flex-col items-center text-sm text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer px-2 flex-shrink-0">
            <a
                href="./16-app下载" target="_blank"
                class="group flex flex-col items-center text-(--color-text) hover:text-(--color-text-hover)">
              <i class="hy-ico-app ic-20"/>
              <span class="mt-2 relative leading-5">
                    APP下载
                    <span
                        class="absolute left-0 -bottom-0 w-full h-0.5 bg-(--color-text-hover) scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"/>
                  </span>
            </a>
          </div>
        </div>

        <!-- 搜索框 + 搜索按钮 -->
        <div v-else class="relative">
          <GlobalSearch in-main-menu/>
        </div>
      </div>
      <div class="flex items-center justify-end w-1/12 min-w-[50px] relative">
        <el-button link type="primary" class="mr-5" @click="handleSearchToggle()"><i class="hy-ico-ss ic-20"/></el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

:deep(.search-box .el-input__wrapper) {
  border-radius: 1rem 0 0 1rem;
}

:deep(.search-box .el-button) {
  border-radius: 0 1rem 1rem 0;
}
</style>