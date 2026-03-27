<script setup lang="ts">
import {SearchApi} from '~/api/search'
import type {SearchResultItem, SearchType} from '~/types/search'

/**
 * 搜索详情页
 * 展示完整搜索结果，支持筛选和分页
 */

/* ==================== 页面元数据 ==================== */
useHead({
  title: '搜索结果',
  meta: [
    {name: 'description', content: '题库、题目、文章搜索', tagPriority: 1}
  ]
})

/* ==================== 状态定义 ==================== */
const route = useRoute()
const router = useRouter()
const message = useMessage()

/* 搜索关键词 */
const keyword = ref((route.query.keyword as string) || '')
/* 搜索类型 */
const searchType = ref<SearchType>((route.query.type as SearchType) || 'all')
/* 搜索结果 */
const searchResults = ref<SearchResultItem[]>([])
/* 总数量 */
const total = ref(0)
/* 当前页 */
const pageNo = ref(1)
/* 每页数量 */
const pageSize = ref(20)
/* 加载状态 */
const loading = ref(false)
/* 搜索历史 */
const searchHistory = ref<string[]>([])

/* ==================== 计算属性 ==================== */
const resultTabs = computed(() => [
  {type: 'all' as SearchType, name: '全部', icon: 'ep:grid'},
  {type: 'qbank' as SearchType, name: '题库', icon: 'ep:collection'},
  {type: 'question' as SearchType, name: '题目', icon: 'ep:question-filled'},
  {type: 'article' as SearchType, name: '文章', icon: 'ep:document'}
])

const filteredResults = computed(() => {
  if (searchType.value === 'all') {
    return searchResults.value
  }
  return searchResults.value.filter(item => item.type === searchType.value)
})

const typeCount = computed(() => {
  const counts = {
    all: total.value,
    qbank: 0,
    question: 0,
    article: 0
  }
  searchResults.value.forEach(item => {
    if (counts[item.type] !== undefined) {
      counts[item.type]++
    }
  })
  return counts
})

/* ==================== 方法定义 ==================== */
const handleSearch = async () => {
  if (!keyword.value.trim()) {
    message.warning('请输入搜索关键词')
    return
  }

  loading.value = true
  try {
    const res = await SearchApi.search({
      keyword: keyword.value,
      type: searchType.value,
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    searchResults.value = res.list || []
    total.value = res.total || 0

    /* 保存搜索历史 */
    SearchApi.saveSearchHistory({
      keyword: keyword.value,
      timestamp: Date.now(),
      type: searchType.value
    })

    /* 更新URL */
    router.replace({
      query: {
        keyword: keyword.value,
        type: searchType.value,
        page: pageNo.value.toString()
      }
    })
  } catch (e) {
    console.error('搜索失败:', e)
    message.error('搜索失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleTypeChange = (type: SearchType) => {
  searchType.value = type
  pageNo.value = 1
  handleSearch()
}

const handlePageChange = (page: number) => {
  pageNo.value = page
  handleSearch()
  /* 滚动到顶部 */
  window.scrollTo({top: 0, behavior: 'smooth'})
}

const goToResult = (item: SearchResultItem) => {
  const routes = {
    qbank: `/qbank/${item.id}`,
    question: `/question/${item.id}`,
    article: `/article/${item.id}`
  }
  navigateTo(routes[item.type] || '/')
}

const getTypeName = (type: string) => {
  const names = {
    qbank: '题库',
    question: '题目',
    article: '文章'
  }
  return names[type] || '其他'
}

const getTypeClass = (type: string) => {
  const classes = {
    qbank: 'bg-blue-100 text-blue-600',
    question: 'bg-green-100 text-green-600',
    article: 'bg-orange-100 text-orange-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const getResultIcon = (type: string) => {
  const icons = {
    qbank: 'ep:collection',
    question: 'ep:question-filled',
    article: 'ep:document'
  }
  return icons[type] || 'ep:search'
}

/* 加载搜索历史 */
const loadSearchHistory = () => {
  const history = SearchApi.getSearchHistory()
  searchHistory.value = history.map(h => h.keyword).slice(0, 10)
}

const selectHistory = (word: string) => {
  keyword.value = word
  handleSearch()
}

const clearHistory = () => {
  SearchApi.clearSearchHistory()
  searchHistory.value = []
}

/* ==================== 生命周期 ==================== */
onMounted(() => {
  loadSearchHistory()
  if (keyword.value) {
    handleSearch()
  }
})

/* 监听路由变化 */
watch(() => route.query.keyword, (newVal) => {
  if (newVal && newVal !== keyword.value) {
    keyword.value = newVal as string
    handleSearch()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 搜索头部 -->
      <div class="max-w-3xl mx-auto mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">搜索结果</h1>

        <!-- 搜索输入框 -->
        <div class="relative flex items-center">
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索题库、题目、文章..."
            class="w-full pl-12 pr-24 py-4 rounded-xl bg-white border border-gray-200 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-lg"
            @keydown.enter="handleSearch"
          >
          <Icon
            name="ep:search"
            class="absolute left-4 text-xl text-gray-400"
          />
          <button
            class="absolute right-2 top-2 bottom-2 bg-[var(--color-primary)] text-white px-6 rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
            @click="handleSearch"
          >
            搜索
          </button>
        </div>

        <!-- 搜索历史 -->
        <div v-if="searchHistory.length > 0" class="mt-4 flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gray-500">历史搜索:</span>
          <button
            v-for="word in searchHistory"
            :key="word"
            class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
            @click="selectHistory(word)"
          >
            {{ word }}
          </button>
          <button
            class="text-sm text-gray-400 hover:text-gray-600 ml-2"
            @click="clearHistory"
          >
            清空
          </button>
        </div>
      </div>

      <!-- 结果筛选Tab -->
      <div class="max-w-5xl mx-auto mb-6">
        <div class="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm">
          <button
            v-for="tab in resultTabs"
            :key="tab.type"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="searchType === tab.type
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-gray-600 hover:bg-gray-100'"
            @click="handleTypeChange(tab.type)"
          >
            <Icon :name="tab.icon"/>
            <span>{{ tab.name }}</span>
            <span
              v-if="typeCount[tab.type] > 0"
              class="ml-1 text-xs px-2 py-0.5 rounded-full"
              :class="searchType === tab.type ? 'bg-white/20' : 'bg-gray-100'"
            >
              {{ typeCount[tab.type] }}
            </span>
          </button>
        </div>
      </div>

      <!-- 搜索结果列表 -->
      <div class="max-w-5xl mx-auto">
        <div v-loading="loading" class="min-h-[400px]">
          <!-- 结果统计 -->
          <div v-if="!loading && keyword" class="mb-4 text-gray-500 text-sm">
            找到 <span class="text-[var(--color-primary)] font-medium">{{ total }}</span> 个与 "{{ keyword }}" 相关的结果
          </div>

          <!-- 结果列表 -->
          <div v-if="filteredResults.length > 0" class="space-y-4">
            <div
              v-for="item in filteredResults"
              :key="`${item.type}-${item.id}`"
              class="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 hover:border-[var(--color-primary)]/20"
              @click="goToResult(item)"
            >
              <div class="flex items-start gap-4">
                <!-- 类型图标 -->
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  :class="getTypeClass(item.type)"
                >
                  <Icon :name="getResultIcon(item.type)" class="text-xl"/>
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="getTypeClass(item.type)"
                    >
                      {{ getTypeName(item.type) }}
                    </span>
                    <span v-if="item.categoryName" class="text-xs text-gray-400">
                      {{ item.categoryName }}
                    </span>
                  </div>

                  <h3 class="text-lg font-medium text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {{ item.title || item.name }}
                  </h3>

                  <p v-if="item.summary" class="text-gray-500 text-sm mt-1 line-clamp-2">
                    {{ item.summary }}
                  </p>

                  <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span v-if="item.createTime">
                      <Icon name="ep:clock" class="mr-1"/>
                      {{ formatDate(item.createTime, 'YYYY-MM-DD HH:mm') }}
                    </span>
                  </div>
                </div>

                <!-- 箭头 -->
                <Icon
                  name="ep:arrow-right"
                  class="text-gray-300 group-hover:text-[var(--color-primary)] transition-colors self-center"
                />
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="!loading && keyword" class="text-center py-16">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ep:search" class="text-3xl text-gray-400"/>
            </div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">未找到相关结果</h3>
            <p class="text-gray-500 mb-6">换个关键词试试，或者浏览热门内容</p>
            <div class="flex justify-center gap-4">
              <NuxtLink
                to="/qbank"
                class="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
              >
                浏览题库
              </NuxtLink>
              <NuxtLink
                to="/article"
                class="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                浏览文章
              </NuxtLink>
            </div>
          </div>

          <!-- 初始状态 -->
          <div v-else-if="!loading && !keyword" class="text-center py-16">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ep:search" class="text-3xl text-gray-400"/>
            </div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">输入关键词开始搜索</h3>
            <p class="text-gray-500">支持搜索题库、题目、文章</p>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="total > pageSize" class="mt-8 flex justify-center">
          <el-pagination
            v-model:current-page="pageNo"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            background
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
