<!-- 搜索组件 -->
<template>
  <!--  <div-->
  <!--    :class="`search-container w-full max-w-6xl mx-auto px-4 py-8 ${isMobile ? 'mb-2' : 'mb-12'}`"-->
  <!--    :style="{ 'padding-top': menuHeight }"-->
  <!--  >-->
  <div
      :class="[
      'search-container',
      'w-full',
      'max-w-6xl',
      'mx-auto',
      'px-4',
      'py-8',
      { 'mb-2': isMobile, 'mb-8': !isMobile },
      'relative',
      'transition-all',
      'duration-300',
    ]"
      :style="{ marginTop: menuHeight }"
  >
    <!-- 搜索引导文字 -->
    <div class="text-center mb-8">
      <h2 class="text-[clamp(1.8rem,4vw,3rem)] font-bold text-gray-900 mb-3">在线工具解决方案</h2>
      <p class="text-gray-600 max-w-2xl mx-auto text-lg">
        10000+ 精选工具，覆盖办公、设计、开发等100+场景，免费试用
      </p>
    </div>

    <!-- 搜索框 -->
    <div class="search-box relative mt-8">
      <div class="relative w-full max-w-4xl mx-auto">
        <!-- 搜索图标 -->
        <div class="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
          <Icon name="icon-park-outline:search" width="52" height="52"/>
        </div>

        <!-- 搜索输入框 -->
        <input
            v-model="keyword"
            type="text"
            placeholder="搜索工具..."
            class="w-full pl-12 pr-52 py-4 rounded-full bg-white border border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 text-lg font-medium"
            @focus="handleFocus()"
            @keydown.enter="handleSearch"
        />

        <!-- 清除按钮 -->
        <button
            v-if="keyword"
            @click="clearSearch"
            class="absolute right-36 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <Icon name="ep:close" :size="20"/>
        </button>

        <!-- 优化后的搜索按钮 -->
        <button
            @click="handleSearch"
            class="absolute right-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-8 rounded-r-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span :class="isMobile ? '' : 'text-xl'">搜　索</span>
        </button>
      </div>
    </div>

    <!-- 搜索建议/历史/结果 -->
    <div v-show="showSearchResults" class="search-results-container fixed inset-0 z-40">
      <!-- 半透明遮罩 -->
      <div class="search-overlay absolute inset-0 bg-black/5" @click="closeSearchResults"></div>

      <!-- 搜索结果内容 -->
      <div
          ref="resultsRef"
          class="search-results absolute max-w-4xl left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl overflow-y-auto transition-all duration-300 transform opacity-100 scale-100"
          :class="`${isMobile ? 'w-85%' : 'w-full'}`"
          :style="{
          top: searchBoxBottom + 'px',
          maxHeight: maxHeight,
        }"
          @click.stop
      >
        <!-- 搜索历史 -->
        <div v-if="showHotSearch" class="p-5">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-700">搜索历史</h3>
            <button
                @click="clearSearchHistory"
                class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <div class="flex items-center">
                <Icon name="ep:delete" class="mr-1"/>
                <div>清空历史</div>
              </div>
            </button>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
                v-for="(item, index) in historyList"
                :key="index"
                @click="selectHistory(item)"
                class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <!-- 热门搜索 -->
        <!--        <div v-if="showHotSearch" class="p-5 border-t border-gray-100">-->
        <!--          <h3 class="font-medium text-gray-700 mb-4">热门搜索</h3>-->

        <!--          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">-->
        <!--            <button-->
        <!--              v-for="(item, index) in hotSearchItems"-->
        <!--              :key="index"-->
        <!--              @click="selectHotSearch(item)"-->
        <!--              class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"-->
        <!--            >-->
        <!--              <span-->
        <!--                class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold mr-3"-->
        <!--              >-->
        <!--                {{ index + 1 }}-->
        <!--              </span>-->
        <!--              <span class="flex-1 text-left">{{ item.title }}</span>-->
        <!--              <span class="text-xs text-gray-500">{{ item.count }}人已搜索</span>-->
        <!--            </button>-->
        <!--          </div>-->
        <!--        </div>-->

        <!-- 搜索结果 -->
        <div v-if="!showHotSearch && searchResults.length" class="p-0">
          <div class="p-4 border-b border-gray-100">
            <h3 class="font-medium text-gray-700">搜索结果</h3>
          </div>

          <div
              class="p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              v-infinite-scroll="loadMoreTools"
              :infinite-scroll-disabled="loading || searchResults.length >= total"
              :infinite-scroll-distance="50"
          >
            <button
                v-for="(item, index) in searchResults"
                :key="index"
                @click="selectResult(item)"
                class="flex items-center p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all"
            >
              <!-- 图标 / Logo -->
              <div
                  class="w-12 h-12 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center mr-4 overflow-hidden"
              >
                <img
                    v-if="item.logo"
                    :src="item.logo"
                    alt="logo"
                    class="w-full h-full object-cover rounded-full"
                />
                <Icon v-else :name="item.icon" color="gray" class="text-xl"/>
              </div>

              <!-- 文字区域 -->
              <div class="flex flex-col text-left">
                <div
                    class="font-semibold text-gray-800 leading-snug"
                    v-html="highlightKeyword(item.name, keyword)"
                ></div>
                <p class="text-xs text-gray-500 mt-1">{{ item.categoryName }}</p>
              </div>
            </button>
          </div>
          <div class="text-center my-4 text-gray-500" v-if="loading">加载中...</div>
          <div class="text-center my-4 text-gray-400" v-else-if="searchResults.length >= total">
            没有更多结果了
          </div>
        </div>

        <!-- 无结果 -->
        <div v-if="!showHotSearch && searchResults.length === 0" class="p-8 text-center">
          <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Icon name="ep:search" :size="25" color="gray"/>
          </div>
          <h3 class="font-medium text-gray-700 mb-2">没有找到相关结果</h3>
          <p class="text-sm text-gray-500 mb-4">请尝试调整搜索关键词或检查拼写</p>
          <button
              @click="clearSearch"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
          >
            重新搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索标签 -->
    <!--    <div class="search-tags mt-6 text-center">-->
    <!--      <p class="text-sm text-gray-500 mb-3">热门搜索:</p>-->
    <!--      <div class="flex flex-wrap justify-center gap-3">-->
    <!--        <a href="#" class="text-sm text-gray-600 hover:text-blue-500 transition-colors">手机</a>-->
    <!--        <a href="#" class="text-sm text-gray-600 hover:text-blue-500 transition-colors"-->
    <!--          >笔记本电脑</a-->
    <!--        >-->
    <!--        <a href="#" class="text-sm text-gray-600 hover:text-blue-500 transition-colors">智能手表</a>-->
    <!--        <a href="#" class="text-sm text-gray-600 hover:text-blue-500 transition-colors">耳机</a>-->
    <!--        <a href="#" class="text-sm text-gray-600 hover:text-blue-500 transition-colors">相机</a>-->
    <!--        <a href="#" class="text-sm text-gray-600 hover:text-blue-500 transition-colors">家电</a>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import {debounce} from 'lodash-es'
import {isNumber} from '~/utils/is'
import {highlightKeyword} from '~/utils'
// TODO: 需要替换为项目实际的搜索API
// import type {ToolVO} from '~/types/tools'
// import {ToolsApi} from '~/api/tools'

// 临时类型定义，避免构建失败
interface ToolVO {
  id: number
  name: string
  logo?: string
  icon?: string
  categoryName?: string
  series?: string
}

// 临时API，避免构建失败
const ToolsApi = {
  getToolsPage: async (params: any) => {
    return { list: [], total: 0 }
  }
}

const appStore = useAppStore()
const {isMobile} = storeToRefs(appStore)

// 搜索状态
const historyList = useState<string[]>('search_history', () => [])
const keyword = ref<string>('')
const total = ref<number>(0)
const showSearchResults = ref(false)
const searchResults = ref<ToolVO[]>([])
const showHotSearch = ref(false)
const searchBoxBottom = ref(0)
const resultsRef = ref(null)
const loading = ref(false)
// 热门搜索数据
// const hotSearchItems = ref([
//   {title: 'iPhone 14 Pro', count: 12536},
//   {title: '华为 MateBook', count: 8754},
//   {title: '小米手环 8', count: 7621},
//   {title: '三星 Galaxy S23', count: 6489},
//   {title: 'Apple Watch Series 8', count: 5923},
//   {title: 'AirPods Pro', count: 4872},
// ])

watch(showSearchResults, (visible) => {
  document.body.style.overflow = visible ? 'hidden' : ''
})

const baseMenuHeight = ref(0)
const menuHeight = ref('0px')

function updateBaseMenuHeight() {
  const menu = document.querySelector('nav')
  baseMenuHeight.value = menu?.offsetHeight || 0
}

function updateMenuHeight() {
  const extra = isMobile.value ? 33 : 88
  menuHeight.value = `${baseMenuHeight.value + extra}px`
}

watch(isMobile, updateMenuHeight, {immediate: true})

// 计算搜索框位置
const calculateSearchBoxPosition = () => {
  const searchBox = document.querySelector('.search-box')
  if (searchBox) {
    searchBoxBottom.value = searchBox.getBoundingClientRect().bottom
  }
}
const margin = 16 // 你想留的底部边距
const maxHeight = computed(() => {
  return `calc(100vh - ${searchBoxBottom.value + margin}px)`
})

// 窗口大小变化时重新计算位置
const handleResize = debounce(() => {
  updateBaseMenuHeight()
  updateMenuHeight()
  calculateSearchBoxPosition()
}, 100)

// 处理输入框聚焦
const handleFocus = () => {
  calculateSearchBoxPosition()
  showSearchResults.value = true
  showHotSearch.value = true
}

interface PageParams extends PageParam {
  name?: string
  series?: string
  queryType: string
}

// 处理搜索
const queryParams = reactive<PageParams>({
  pageNo: 1,
  pageSize: 18,
  name: undefined,
  series: undefined,
  queryType: 'search',
})
const searching = ref(false)

const {openNewWindow} = useWindow()
const handleSearch = async (type?: string) => {
  showSearchResults.value = true
  const word = keyword.value.trim()
  if (!word) return
  if (type !== 'more') {
    searchResults.value = []
    queryParams.pageNo = 1
  }
  try {
    if (isNumber(word)) {
      queryParams.series = word
      queryParams.name = undefined
    } else {
      queryParams.name = word
      queryParams.series = undefined
    }
    const data = await ToolsApi.getToolsPage(queryParams, false)
    if (data.list.length === 1 && queryParams.pageNo === 1) {
      const item = data.list[0].series
      openNewWindow(`/t/${item}`)
    }
    searchResults.value.push(...data.list)
    total.value = data.total
    searching.value = true
    showHotSearch.value = false
  } catch (e) {
    console.log(e)
  }
  // 添加到搜索历史
  saveSearchHistory(word)
}
const loadMoreTools = async () => {
  if (loading.value || searchResults.value.length >= total.value) return
  loading.value = true
  queryParams.pageNo++
  await handleSearch('more')
  loading.value = false
}

// 从历史记录中选择
const selectHistory = (query) => {
  keyword.value = query
  handleSearch()
}
// 从热门搜索中选择
// const selectHotSearch = (item) => {
//   keyword.value = item.title
//   handleSearch()
// }
// 从搜索结果中选择
const selectResult = (item) => {
  keyword.value = item.title
  handleSearch()
}
// 清除搜索
const clearSearch = () => {
  keyword.value = ''
  searchResults.value = []
  showHotSearch.value = true
}
// 关闭搜索结果
const closeSearchResults = () => {
  showSearchResults.value = false
  showHotSearch.value = false
  total.value = 0
  searchResults.value = []
  queryParams.pageNo = 1
  searching.value = false
}

// 添加到搜索历史
const saveSearchHistory = (word: string) => {
  // 如果已存在，移除原位置
  const currentList = historyList.value || []
  const index = currentList.indexOf(word)
  if (index > -1) {
    currentList.splice(index, 1)
  }
  // 添加到历史记录开头
  currentList.unshift(word)
  // 限制历史记录数量
  if (currentList.length > 10) {
    currentList.pop()
  }
  historyList.value = currentList
}
// 清除搜索历史
const clearSearchHistory = () => {
  historyList.value = []
}
// 初始化
onMounted(() => {
  updateMenuHeight()
// 从本地存储加载搜索历史（增加客户端判断，避免服务端报错）
  if (import.meta.client) {
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    // 监听滚动事件
    window.addEventListener('scroll', handleResize)
  }
})
// 组件卸载时移除事件监听
onUnmounted(() => {
// 确保在客户端执行，避免服务端警告
  if (import.meta.client) {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleResize)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
:deep(mark) {
  background-color: transparent;
  color: darkred;
  font-weight: bold;
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.slide-up {
  animation: slideUp 0.3s ease-in-out;
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 绝对定位的搜索结果容器 */
.search-results {
  z-index: 50;
}
</style>
