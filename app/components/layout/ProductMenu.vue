<!-- 产品菜单，导航条下拉展示内容 -->
<template>
  <div
    class="fixed top-[40px] left-0 right-0 bg-white/98 shadow-2xl z-40 transition-all duration-300 transform"
    :class="{ 'opacity-0 translate-y-[-10px] pointer-events-none': !showMenu }"
  >
    <div class="container mx-auto px-4 py-4 md:py-6">
      <!-- 移动端使用单列滚动布局 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <!-- 产品类别 1 -->
        <div
          class="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden group"
        >
          <div class="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-b border-blue-100">
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4"
              >
                <i class="el-icon-laptop text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-900 truncate">
                  {{ $t('products.category1') }}
                </h3>
                <p class="text-blue-600 text-sm font-medium truncate">
                  {{ $t('products.category1Tag') }}
                </p>
              </div>
            </div>
          </div>
          <div class="p-4">
            <ul class="space-y-1">
              <li v-for="product in productsByCategory('category1')" :key="product.id">
                <a
                  href="#"
                  class="flex items-center py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3"
                  >
                    <Icon name="ep:document" class="text-xs" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="text-gray-800 font-medium block truncate">
                      {{ product.name }}
                    </span>
                    <p class="text-gray-500 text-xs mt-0.5 block truncate">
                      {{ $t(`products.Desc${product.id}`) }}
                    </p>
                  </div>
                  <i
                    class="el-icon-arrow-right text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  ></i>
                </a>
              </li>
            </ul>
          </div>
          <div class="px-4 pb-4">
            <a
              href="#"
              class="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center"
            >
              {{ $t('products.seeAll') }}
              <i class="el-icon-arrow-right ml-1.5 text-xs"></i>
            </a>
          </div>
        </div>

        <!-- 其他类别保持相同结构 -->
        <!-- 产品类别 2 -->
        <div
          class="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden group"
        >
          <div class="p-5 bg-gradient-to-br from-green-50 to-green-100 border-b border-green-100">
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4"
              >
                <i class="el-icon-cpu text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-900 truncate">
                  {{ $t('products.category2') }}
                </h3>
                <p class="text-green-600 text-sm font-medium truncate">
                  {{ $t('products.category2Tag') }}
                </p>
              </div>
            </div>
          </div>
          <div class="p-4">
            <ul class="space-y-1">
              <li v-for="product in productsByCategory('category2')" :key="product.id">
                <a
                  href="#"
                  class="flex items-center py-3 px-4 rounded-lg hover:bg-green-50 transition-all duration-200"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 mr-3"
                  >
                    <Icon name="ep:document" class="text-xs" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="text-gray-800 font-medium block truncate">
                      {{ product.name }}
                    </span>
                    <p class="text-gray-500 text-xs mt-0.5 block truncate">
                      {{ $t(`products.Desc${product.id}`) }}
                    </p>
                  </div>
                  <i
                    class="el-icon-arrow-right text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  ></i>
                </a>
              </li>
            </ul>
          </div>
          <div class="px-4 pb-4">
            <a
              href="#"
              class="text-green-600 text-sm font-medium hover:text-green-700 transition-colors flex items-center"
            >
              {{ $t('products.seeAll') }}
              <i class="el-icon-arrow-right ml-1.5 text-xs"></i>
            </a>
          </div>
        </div>

        <!-- 产品类别 3 -->
        <div
          class="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden group"
        >
          <div
            class="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-b border-purple-100"
          >
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4"
              >
                <i class="el-icon-cloud-server text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-900 truncate">
                  {{ $t('products.category3') }}
                </h3>
                <p class="text-purple-600 text-sm font-medium truncate">
                  {{ $t('products.category3Tag') }}
                </p>
              </div>
            </div>
          </div>
          <div class="p-4">
            <ul class="space-y-1">
              <li v-for="product in productsByCategory('category3')" :key="product.id">
                <a
                  href="#"
                  class="flex items-center py-3 px-4 rounded-lg hover:bg-purple-50 transition-all duration-200"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mr-3"
                  >
                    <Icon name="ep:document" class="text-xs" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="text-gray-800 font-medium block truncate">
                      {{ product.name }}
                    </span>
                    <p class="text-gray-500 text-xs mt-0.5 block truncate">
                      {{ $t(`products.Desc${product.id}`) }}
                    </p>
                  </div>
                  <i
                    class="el-icon-arrow-right text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  ></i>
                </a>
              </li>
            </ul>
          </div>
          <div class="px-4 pb-4">
            <a
              href="#"
              class="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors flex items-center"
            >
              {{ $t('products.seeAll') }}
              <i class="el-icon-arrow-right ml-1.5 text-xs"></i>
            </a>
          </div>
        </div>

        <!-- 产品类别 4 -->
        <div
          class="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden group"
        >
          <div
            class="p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-100"
          >
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-4"
              >
                <Icon name="icon-park-outline:analysis" class="text-xl" />
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-900 truncate">
                  {{ $t('products.category4') }}
                </h3>
                <p class="text-orange-600 text-sm font-medium truncate">
                  {{ $t('products.category4Tag') }}
                </p>
              </div>
            </div>
          </div>
          <div class="p-4">
            <ul class="space-y-1">
              <li v-for="product in productsByCategory('category4')" :key="product.id">
                <a
                  href="#"
                  class="flex items-center py-3 px-4 rounded-lg hover:bg-orange-50 transition-all duration-200"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mr-3"
                  >
                    <Icon name="ep:document" class="text-xs" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="text-gray-800 font-medium block truncate">
                      {{ product.name }}
                    </span>
                    <p class="text-gray-500 text-xs mt-0.5 block truncate">
                      {{ $t(`products.Desc${product.id}`) }}
                    </p>
                  </div>
                  <i
                    class="el-icon-arrow-right text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  ></i>
                </a>
              </li>
            </ul>
          </div>
          <div class="px-4 pb-4">
            <a
              href="#"
              class="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors flex items-center"
            >
              {{ $t('products.seeAll') }}
              <i class="el-icon-arrow-right ml-1.5 text-xs"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  showMenu: {
    type: Boolean,
    required: true,
  },
})

const { t } = useI18n()

// 响应式处理
const appStore = useAppStore()
const {isMobile} = storeToRefs(appStore)
const menuHeight = ref(isMobile.value ? 'calc(100vh - 120px)' : '')

watch(isMobile, (newValue) => {
  menuHeight.value = newValue ? 'calc(100vh - 120px)' : ''
})

// 产品数据保持不变
const products = [
  { id: 1, name: 'Web 应用套件', category: 'category1' },
  { id: 2, name: '移动开发框架', category: 'category1' },
  { id: 3, name: 'UI 设计系统', category: 'category1' },
  { id: 4, name: '云服务平台', category: 'category2' },
  { id: 5, name: '数据存储解决方案', category: 'category2' },
  { id: 6, name: '安全防护系统', category: 'category2' },
  { id: 7, name: 'AI 智能助手', category: 'category3' },
  { id: 8, name: '机器学习平台', category: 'category3' },
  { id: 9, name: '自然语言处理', category: 'category3' },
  { id: 10, name: '数据分析工具', category: 'category4' },
  { id: 11, name: '商业智能套件', category: 'category4' },
  { id: 12, name: '可视化报表系统', category: 'category4' },
]

// 按类别筛选产品
const productsByCategory = (category: string) => {
  return products.filter((product) => product.category === category)
}
</script>

<style scoped>
/* 移动端菜单容器样式 */
@media (max-width: 767px) {
  .fixed {
    max-height: v-bind(menuHeight);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* 增强 iOS 滚动体验 */
  }
}
</style>
