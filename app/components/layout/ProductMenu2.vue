<template>
  <div
    class="fixed inset-0 top-[40px] bg-white/98 shadow-2xl z-40 transition-all duration-300 transform"
    :class="{ 'opacity-0 translate-y-[-10px] pointer-events-none': !showMenu }"
  >
    <div class="container mx-auto px-4 py-4 md:py-6 h-full flex flex-col">
      <!-- 菜单标题 -->
      <div class="mb-4 md:mb-6 flex items-center justify-between">
        <h2 class="text-lg md:text-xl font-bold text-gray-900">所有产品与服务</h2>
        <button
          @click="handleCloseMenu"
          class="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <i class="el-icon-close text-lg"></i>
        </button>
      </div>

      <!-- 分类导航 -->
      <div class="flex overflow-x-auto pb-2 mb-4 md:mb-6 gap-2 md:gap-3 hide-scrollbar">
        <button
          v-for="(category, index) in categories"
          :key="index"
          @click="activeCategory = index"
          class="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all"
          :class="
            activeCategory === index
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
        >
          {{ category.name }}
        </button>
      </div>

      <!-- 产品列表 - 占满可用空间 -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 flex-1 overflow-y-auto pb-4"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-0.5"
          @click="navigateToProduct(product.path)"
        >
          <div class="p-3 md:p-4">
            <div class="flex items-start">
              <div
                class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 flex-shrink-0"
              >
                <i :class="product.iconClass + ' text-base md:text-lg'"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 truncate">
                  {{ product.name }}
                </h3>
                <p class="text-gray-500 text-xs md:text-sm mt-1 line-clamp-2">
                  {{ product.description }}
                </p>

                <div class="mt-2 md:mt-3 flex items-center justify-between">
                  <span
                    class="text-xs font-medium px-2 py-0.5 rounded-full"
                    :class="product.tagClass"
                  >
                    {{ product.tag }}
                  </span>
                  <i
                    class="el-icon-arrow-right text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-xs"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 回到首页按钮 -->
      <div class="mt-4 md:mt-6 pb-4 md:pb-0">
        <button
          @click="navigateToHome()"
          class="w-full inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          <i class="el-icon-home mr-2"></i>
          回到首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 接收显示状态props
defineProps({
  showMenu: {
    type: Boolean,
    required: true,
    default: false
  },
})

// 关闭菜单事件
const emit = defineEmits(['closeMenu'])
const handleCloseMenu = () => {
  emit('closeMenu')
}

// 分类数据
const categories = [
  { id: 'all', name: '全部产品' },
  { id: 'development', name: '开发工具' },
  { id: 'cloud', name: '云服务' },
  { id: 'ai', name: '人工智能' },
  { id: 'data', name: '数据服务' },
  { id: 'security', name: '安全服务' },
]

// 产品数据 - 固定示例
const products = [
  {
    id: 1,
    name: 'Web 应用开发套件',
    description: '一站式Web应用开发解决方案，包含前端框架和后端API',
    category: 'development',
    path: '/products/web-dev-kit',
    iconClass: 'el-icon-laptop',
    tag: '热门',
    tagClass: 'bg-red-100 text-red-700',
  },
  {
    id: 2,
    name: '云服务器托管',
    description: '高性能云服务器，弹性扩展，稳定可靠',
    category: 'cloud',
    path: '/products/cloud-hosting',
    iconClass: 'el-icon-cloud-server',
    tag: '推荐',
    tagClass: 'bg-green-100 text-green-700',
  },
  {
    id: 3,
    name: '智能数据分析平台',
    description: 'AI驱动的数据分析工具，自动识别趋势和异常',
    category: 'ai',
    path: '/products/ai-analytics',
    iconClass: 'el-icon-data-analysis',
    tag: '新品',
    tagClass: 'bg-blue-100 text-blue-700',
  },
  {
    id: 4,
    name: '数据库管理系统',
    description: '高性能分布式数据库解决方案，支持多种数据模型',
    category: 'data',
    path: '/products/db-management',
    iconClass: 'el-icon-database',
    tag: '基础',
    tagClass: 'bg-gray-100 text-gray-700',
  },
  {
    id: 5,
    name: '网络安全防护',
    description: '全方位网络安全解决方案，保护您的系统和数据',
    category: 'security',
    path: '/products/security-suite',
    iconClass: 'el-icon-shield',
    tag: '必备',
    tagClass: 'bg-purple-100 text-purple-700',
  },
  {
    id: 6,
    name: '移动应用开发框架',
    description: '跨平台移动应用开发工具，一次编写多端运行',
    category: 'development',
    path: '/products/mobile-framework',
    iconClass: 'el-icon-mobile',
    tag: '热门',
    tagClass: 'bg-red-100 text-red-700',
  },
]

// 分类切换
const activeCategory = ref(0)

// 根据选中的分类筛选产品
const filteredProducts = computed(() => {
  const activeCatId = categories[activeCategory.value].id
  if (activeCatId === 'all') {
    return products
  }
  return products.filter((product) => product.category === activeCatId)
})

// 跳转到产品页面
const navigateToProduct = (path: string) => {
  // 实际项目中使用路由跳转
  console.log('导航到:', path)
  window.location.href = path
  handleCloseMenu()
}

// 回到首页
const navigateToHome = () => {
  console.log('回到首页')
  window.location.href = '/'
  handleCloseMenu()
}
</script>

<style scoped>
/* 隐藏滚动条但保留功能 */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 移动端适配优化 */
@media (max-width: 767px) {
  .fixed {
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* 小屏幕下增加点击区域 */
  .grid > div {
    min-height: 90px;
  }
}

/* 平板及以上设备样式 */
@media (min-width: 768px) {
  .grid > div {
    min-height: 100px;
  }
}
</style>
