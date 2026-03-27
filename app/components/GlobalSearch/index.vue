<template>
  <div ref="searchContainer" class="relative w-full">
    <!-- 搜索输入框 -->
    <div
      class="search-input-wrapper flex items-center gap-2 p-4 rounded-full transition-all duration-300"
      :class="[
        inMainMenu
          ? 'bg-gray-100 hover:bg-gray-200'
          : isScrolled
            ? 'bg-gray-100 hover:bg-gray-200'
            : 'bg-white/20 hover:bg-white/30'
      ]"
    >
      <Icon
        name="ep:search"
        class="text-lg"
        :class="inMainMenu || isScrolled ? 'text-gray-500' : 'text-white/80'"
      />
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索题库、题目、文章..."
        class="w-full bg-transparent border-none outline-none text-sm"
        :class="inMainMenu || isScrolled ? 'text-gray-700 placeholder-gray-400' : 'text-white placeholder-white/70'"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleSearch"
        @input="handleInput"
      >
      <button
        v-if="keyword"
        class="p-1 rounded-full hover:bg-gray-200/50 transition-colors"
        @click="clearSearch"
      >
        <Icon
          name="ep:close"
          class="text-xs"
          :class="inMainMenu || isScrolled ? 'text-gray-400' : 'text-white/70'"
        />
      </button>
    </div>

    <!-- 搜索下拉面板 - 使用 Teleport 移动到 body，仅客户端渲染避免水合问题 -->
    <ClientOnly>
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-2"
        >
          <div
            v-if="showDropdown"
            ref="dropdownRef"
            class="fixed bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[9999] right-0 left-0"
            :style="dropdownStyle"
            @click.stop
          >
          <!-- 搜索建议 -->
        <div v-if="showSuggestions && suggestions.length > 0" class="p-4">
          <div class="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Icon name="ep:lightning" class="text-[var(--color-primary)]"/>
            搜索建议
          </div>
          <div class="space-y-1">
            <button
              v-for="item in suggestions"
              :key="item.text"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
              @click="selectSuggestion(item)"
            >
              <Icon
                name="ep:search"
                class="text-gray-400 text-sm"
              />
              <span class="text-gray-700 flex-1">{{ item.text }}</span>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="getTypeClass(item.type)"
              >
                {{ getTypeName(item.type) }}
              </span>
            </button>
          </div>
        </div>

    <!-- 搜索历史 -->
        <div v-else-if="showHistory && searchHistory.length > 0" class="p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs text-gray-400 flex items-center gap-1">
              <Icon name="ep:clock"/>
              搜索历史
            </div>
            <button
              class="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              @click="clearHistory"
            >
              <Icon name="ep:delete"/>
              清空
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in searchHistory"
              :key="item.keyword"
              class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
              @click="selectHistory(item)"
            >
              <span>{{ item.keyword }}</span>
              <Icon
                name="ep:close"
                class="text-xs hover:text-gray-800"
                @click.stop="removeHistory(item.keyword)"
              />
            </button>
          </div>
        </div>

    <!-- 热门搜索 -->
        <div
          v-if="showHotSearch && hotSearch.length > 0"
          class="p-4 border-t border-gray-100"
        >
          <div class="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Icon name="mdi:fire" class="text-red-500"/>
            热门搜索
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(item, index) in hotSearch"
              :key="item.keyword"
              class="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded-full text-sm transition-colors"
              :class="index < 3 ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'text-gray-600'"
              @click="selectHotSearch(item)"
            >
              <span
                v-if="index < 3"
                class="w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center"
              >
                {{ index + 1 }}
              </span>
              <span>{{ item.keyword }}</span>
            </button>
          </div>
        </div>

    <!-- 搜索结果 -->
        <div v-if="showResults" class="max-h-[400px] overflow-y-auto">
          <!-- 结果分类Tab -->
          <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
            <button
              v-for="tab in resultTabs"
              :key="tab.type"
              class="px-3 py-1 rounded-full text-sm transition-colors"
              :class="activeTab === tab.type
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-gray-600 hover:bg-gray-100'"
              @click="activeTab = tab.type"
            >
              {{ tab.name }}
              <span v-if="tab.count > 0" class="ml-1 text-xs opacity-80">
                ({{ tab.count }})
              </span>
            </button>
          </div>

          <!-- 结果列表 -->
          <div class="p-2">
            <template v-if="searchResults.length > 0">
              <div
                v-for="item in filteredResults"
                :key="`${item.type}-${item.id}`"
                class="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                @click="goToResult(item)"
              >
                <!-- 图标 -->
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  :class="getResultIconClass(item.type)"
                >
                  <Icon :name="getResultIcon(item.type)" class="text-lg"/>
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {{ item.title || item.name }}
                  </div>
                  <div v-if="item.summary" class="text-sm text-gray-500 line-clamp-1 mt-0.5">
                    {{ item.summary }}
                  </div>
                  <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span v-if="item.categoryName">{{ item.categoryName }}</span>
                    <span v-if="item.createTime">{{ formatDate(item.createTime, 'MM-DD') }}</span>
                  </div>
                </div>

                <!-- 箭头 -->
                <Icon
                  name="ep:arrow-right"
                  class="text-gray-300 group-hover:text-[var(--color-primary)] transition-colors"
                />
              </div>
            </template>

            <!-- 空状态 -->
            <div v-else class="py-8 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="ep:search" class="text-2xl text-gray-400"/>
              </div>
              <p class="text-gray-500">未找到相关结果</p>
              <p class="text-sm text-gray-400 mt-1">换个关键词试试</p>
            </div>
          </div>

          <!-- 查看更多 -->
          <div
            v-if="hasMoreResults"
            class="p-3 text-center border-t border-gray-100"
          >
            <button
              class="text-sm text-[var(--color-primary)] hover:underline"
              @click="goToSearchPage"
            >
              查看更多结果
              <Icon name="ep:arrow-right" class="inline-block ml-1"/>
            </button>
          </div>
        </div>
        </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { debounce } from 'lodash-es'
import {SearchApi} from '~/api/search'
import type {
  SearchSuggestItem,
  SearchResultItem,
  HotSearchItem,
  SearchHistoryItem,
  SearchType,
  SearchResultType
} from '~/types/search'

/* ==================== Props ==================== */
interface Props {
  isScrolled?: boolean
  inMainMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isScrolled: false,
  inMainMenu: false
})

/* ==================== State ==================== */
const keyword = ref('')
const isFocused = ref(false)
const showDropdown = ref(false)
const showSuggestions = ref(false)
const showHistory = ref(false)
const showHotSearch = ref(false)
const showResults = ref(false)
const suggestions = ref<SearchSuggestItem[]>([])
const searchHistory = ref<SearchHistoryItem[]>([])
const hotSearch = ref<HotSearchItem[]>([])
const searchResults = ref<SearchResultItem[]>([])
const activeTab = ref<SearchType>('all')
const loading = ref(false)
const total = ref(0)
const dropdownRef = ref<HTMLElement | null>(null)
const searchContainer = ref<HTMLElement | null>(null)
const dropdownPosition = ref({top: 0, left: 0, width: 0})

/* ==================== Computed ==================== */
const dropdownStyle = computed(() => ({
  top: `${dropdownPosition.value.top}px`,
  left: `${dropdownPosition.value.left}px`,
  width: `${dropdownPosition.value.width}px`
}))

const resultTabs = computed(() => [
  {type: 'all' as SearchType, name: '全部', count: total.value},
  {type: 'qbank' as SearchType, name: '题库', count: getTypeCount('qbank')},
  {type: 'question' as SearchType, name: '题目', count: getTypeCount('question')},
  {type: 'article' as SearchType, name: '文章', count: getTypeCount('article')}
])

const filteredResults = computed(() => {
  if (activeTab.value === 'all') {
    return searchResults.value
  }
  return searchResults.value.filter(item => item.type === activeTab.value)
})

const hasMoreResults = computed(() => {
  return total.value > searchResults.value.length
})

/* ==================== Methods ==================== */
const getTypeCount = (type: SearchType) => {
  if (type === 'all') return total.value
  return searchResults.value.filter(item => item.type === type).length
}

const getTypeName = (type: SearchResultType) => {
  const names = {
    qbank: '题库',
    question: '题目',
    article: '文章'
  }
  return names[type] || '其他'
}

const getTypeClass = (type: SearchResultType) => {
  const classes = {
    qbank: 'bg-blue-100 text-blue-600',
    question: 'bg-green-100 text-green-600',
    article: 'bg-orange-100 text-orange-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const getResultIcon = (type: SearchResultType) => {
  const icons = {
    qbank: 'ep:collection',
    question: 'ep:question-filled',
    article: 'ep:document'
  }
  return icons[type] || 'ep:search'
}

const getResultIconClass = (type: SearchResultType) => {
  const classes = {
    qbank: 'bg-blue-100 text-blue-600',
    question: 'bg-green-100 text-green-600',
    article: 'bg-orange-100 text-orange-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

/* ==================== Event Handlers ==================== */
const updateDropdownPosition = () => {
  if (!searchContainer.value) return
  const rect = searchContainer.value.getBoundingClientRect()
  dropdownPosition.value = {
    top: rect.bottom + 8, // 8px margin
    left: rect.left,
    width: rect.width
  }
}

const handleFocus = () => {
  isFocused.value = true

  /* 仅在客户端显示下拉面板，避免SSR水合问题 */
  if (import.meta.client) {
    showDropdown.value = true
    /* 计算下拉面板位置 */
    nextTick(() => {
      updateDropdownPosition()
    })

    if (keyword.value) {
      showSuggestions.value = true
      showResults.value = true
    } else {
      loadHistory()
      showHistory.value = true
      showHotSearch.value = true
      loadHotSearch()
    }
  }
}

const handleBlur = () => {
  isFocused.value = false
  /* 延迟关闭，避免点击下拉内容时立即关闭 */
  setTimeout(() => {
    if (!dropdownRef.value?.contains(document.activeElement)) {
      showDropdown.value = false
    }
  }, 200)
}

const handleInput = debounce(async () => {
  const word = keyword.value.trim()
  if (!word) {
    showSuggestions.value = false
    showResults.value = false
    loadHistory()
    showHistory.value = true
    return
  }

  /* 获取搜索建议 */
  try {
    const res = await SearchApi.getSuggestions(word)
    suggestions.value = res.list || []
    showSuggestions.value = suggestions.value.length > 0
  } catch {
    suggestions.value = []
  }
}, 300)

const handleSearch = async () => {
  const word = keyword.value.trim()

  if (!word) return
  console.log('word=',word)
  loading.value = true
  showSuggestions.value = false
  showHistory.value = false
  showHotSearch.value = false
  showResults.value = true

  try {
    const res = await SearchApi.search({
      keyword: word,
      type: activeTab.value,
      pageNo: 1,
      pageSize: 10
    })

    searchResults.value = res.list || []
    total.value = res.total || 0



    /* 保存搜索历史 */
    SearchApi.saveSearchHistory({
      keyword: word,
      timestamp: Date.now(),
      type: activeTab.value
    })
  } catch (e) {
    console.error('搜索失败:', e)
    searchResults.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const selectSuggestion = (item: SearchSuggestItem) => {
  keyword.value = item.text
  handleSearch()
}

const selectHistory = (item: SearchHistoryItem) => {
  keyword.value = item.keyword
  activeTab.value = item.type || 'all'
  handleSearch()
}

const selectHotSearch = (item: HotSearchItem) => {
  keyword.value = item.keyword
  handleSearch()
}

const clearSearch = () => {
  keyword.value = ''
  showResults.value = false
  showSuggestions.value = false
  loadHistory()
  showHistory.value = true
}

const loadHistory = () => {
  searchHistory.value = SearchApi.getSearchHistory()
}

const loadHotSearch = async () => {
  try {
    const res = await SearchApi.getHotSearch(8)
    hotSearch.value = res || []
  } catch {
    hotSearch.value = []
  }
}

const clearHistory = () => {
  SearchApi.clearSearchHistory()
  searchHistory.value = []
}

const removeHistory = (keyword: string) => {
  SearchApi.removeSearchHistory(keyword)
  loadHistory()
}

const goToResult = (item: SearchResultItem) => {
  showDropdown.value = false

  const routes = {
    qbank: `/qbank/${item.id}`,
    question: `/question/${item.id}`,
    article: `/article/${item.id}`
  }

  navigateTo(routes[item.type] || '/')
}

const goToSearchPage = () => {
  showDropdown.value = false
  navigateTo({
    path: '/search',
    query: {
      keyword: keyword.value,
      type: activeTab.value
    }
  })
}

/* ==================== Lifecycle ==================== */
/* 点击外部关闭下拉 */
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.search-input-wrapper') && !dropdownRef.value?.contains(target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', updateDropdownPosition)
    window.addEventListener('scroll', updateDropdownPosition, true)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', updateDropdownPosition)
    window.removeEventListener('scroll', updateDropdownPosition, true)
  }
})

/* 初始化加载历史记录 */
loadHistory()
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


</style>
