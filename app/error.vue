<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 导航栏 -->
    <Navbar/>

    <!-- 404内容区 -->
    <div class="flex-1 flex items-center justify-center py-16 px-4 mt-16">
      <div class="max-w-2xl w-full text-center">
        <!-- 404图标区域 -->
        <div class="mb-8">
          <div class="relative inline-block">
            <!-- 试卷图标 -->
            <div class="w-40 h-40 mx-auto relative">
              <!-- 试卷背景 -->
              <div class="absolute inset-0 bg-(--color-bg-container) rounded-xl shadow-lg border border-(--color-border) transform rotate-3"></div>
              <div class="absolute inset-0 bg-(--color-bg-container) rounded-xl shadow-lg border border-(--color-border) transform -rotate-2"></div>
              <!-- 主试卷 -->
              <div class="absolute inset-0 bg-(--color-bg-container) rounded-xl shadow-xl border border-(--color-border) flex flex-col items-center justify-center p-4">
                <!-- 试卷内容模拟 -->
                <div class="w-full space-y-2">
                  <div class="h-2 bg-(--color-border) rounded w-3/4 mx-auto"></div>
                  <div class="h-2 bg-(--color-border) rounded w-full"></div>
                  <div class="h-2 bg-(--color-border) rounded w-5/6 mx-auto"></div>
                  <div class="h-2 bg-(--color-border) rounded w-full"></div>
                  <div class="flex justify-center gap-2 mt-4">
                    <div class="w-6 h-6 rounded-full border-2 border-(--color-border)"></div>
                    <div class="w-6 h-6 rounded-full border-2 border-(--color-border)"></div>
                    <div class="w-6 h-6 rounded-full bg-(--color-btn-primary)"></div>
                    <div class="w-6 h-6 rounded-full border-2 border-(--color-border)"></div>
                  </div>
                </div>
                <!-- 问号图标 -->
                <div class="absolute -top-3 -right-3 w-12 h-12 bg-(--color-danger) rounded-full flex items-center justify-center shadow-lg">
                  <span class="text-white text-2xl font-bold">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误代码 -->
        <div class="mb-6">
          <span class="text-7xl font-bold text-(--color-text-primary)">4</span>
          <span class="text-7xl font-bold text-(--color-btn-primary)">0</span>
          <span class="text-7xl font-bold text-(--color-text-primary)">4</span>
        </div>

        <!-- 错误标题 -->
        <h1 class="text-2xl font-bold text-(--color-text-primary) mb-4">
          哎呀，这道"页面"题走丢了
        </h1>

        <!-- 错误描述 -->
        <p class="text-(--color-text-secondary) mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。就像考试中找不到答案一样，让我们帮您回到正确的轨道。
        </p>

        <!-- 操作按钮 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <!-- 返回首页 -->
          <a
            href="/"
            class="inline-flex items-center gap-2 bg-(--color-btn-primary) text-(--color-btn-text) px-8 py-3 rounded-lg hover:bg-(--color-btn-hover) transition-all duration-300 shadow hover:shadow-lg"
          >
            <Icon name="ep:home-filled" class="text-lg"/>
            <span>返回首页</span>
          </a>

          <!-- 返回上一页 -->
          <button
            @click="handleGoBack"
            class="inline-flex items-center gap-2 bg-(--color-bg-container) text-(--color-text-primary) px-8 py-3 rounded-lg border border-(--color-border) hover:bg-(--color-bg-container-hover) hover:text-(--color-text-hover) transition-all duration-300"
          >
            <Icon name="ep:arrow-left" class="text-lg"/>
            <span>返回上一页</span>
          </button>
        </div>

        <!-- 快捷链接 -->
        <div class="mt-12 pt-8 border-t border-(--color-border)">
          <p class="text-sm text-(--color-text-secondary) mb-4">或者您可能想访问：</p>
          <div class="flex flex-wrap justify-center gap-3">
            <a
              v-for="link in quickLinks"
              :key="link.path"
              :href="link.path"
              class="px-4 py-2 bg-(--color-bg-container) border border-(--color-border) rounded-full text-sm text-(--color-text-secondary) hover:text-(--color-text-hover) hover:border-(--color-text-hover) transition-all duration-300"
            >
              {{ link.name }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <Footer/>
  </div>
</template>

<script setup lang="ts">
/* 404错误页面 - 题库风格设计 */
defineOptions({
  name: 'ErrorPage'
})

// 页面元信息
useHead({
  title: '页面未找到 - 404'
})

// 快捷链接
const quickLinks = [
  { name: '考试题库', path: '/qbank' },
  { name: '考试动态', path: '/article' },
  { name: '考试日历', path: '/exam-calendar' },
  { name: '个人中心', path: '/account/profile' },
]

// 返回上一页
const handleGoBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}
</script>

<style scoped>
/* 试卷悬浮动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(-2deg);
  }
  50% {
    transform: translateY(-10px) rotate(-2deg);
  }
}

.w-40 > div:last-child {
  animation: float 3s ease-in-out infinite;
}
</style>
