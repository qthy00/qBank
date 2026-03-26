<script setup lang="ts">
/**
 * 题目搜索页面
 * 支持关键词搜索、多维度筛选、分页展示
 */
import { debounce } from 'lodash-es'
import { QuestionSearchApi } from '~/api/question'
import type {
  QuestionSearchReqVO,
  QuestionSearchResultItem,
  QuestionFilterVO,
  FilterOption
} from '~/types/question'

/* ==================== 页面元数据 ==================== */
useHead({
  title: '题目搜索 - 学次元在线题库',
  meta: [
    { name: 'description', content: '海量题库精准搜索，支持关键词、题型、难度、知识点等多维度筛选', tagPriority: 1 }
  ]
})

definePageMeta({
  layout: 'default'
})

/* ==================== 状态定义 ==================== */
const route = useRoute()
const router = useRouter()
const message = useMessage()

/* 搜索参数 */
const searchParams = reactive<QuestionSearchReqVO>({
  keyword: '',
  type: undefined,
  difficulty: undefined,
  pointId: undefined,
  qbankId: undefined,
  sort: 'newest',
  pageNo: 1,
  pageSize: 20
})

/* 搜索结果 */
const searchResults = ref<QuestionSearchResultItem[]>([])
const total = ref(0)
const loading = ref(false)

/* 筛选选项 */
const filterOptions = ref<QuestionFilterVO>({
  types: [],
  difficulties: [],
  points: [],
  qbanks: []
})
const filterLoading = ref(false)

/* 搜索历史 */
const searchHistory = ref<string[]>([])

/* 热门搜索 */
const hotKeywords = ref<{ keyword: string; searchCount: number }[]>([])

/* ==================== 计算属性 ==================== */
const hasActiveFilters = computed(() => {
  return searchParams.type !== undefined ||
    searchParams.difficulty !== undefined ||
    searchParams.pointId !== undefined ||
    searchParams.qbankId !== undefined
})

const activeFilterCount = computed(() => {
  let count = 0
  if (searchParams.type !== undefined) count++
  if (searchParams.difficulty !== undefined) count++
  if (searchParams.pointId !== undefined) count++
  if (searchParams.qbankId !== undefined) count++
  return count
})

/* ==================== 方法定义 ==================== */

/**
 * 加载筛选选项
 */
const loadFilterOptions = async () => {
  filterLoading.value = true
  try {
    const res = await QuestionSearchApi.getFilterOptions()
    filterOptions.value = res
  } catch (e) {
    console.error('加载筛选选项失败:', e)
  } finally {
    filterLoading.value = false
  }
}

/**
 * 搜索题目
 */
const searchQuestions = async () => {
  loading.value = true
  try {
    const res = await QuestionSearchApi.search(searchParams)
    searchResults.value = res.list
    total.value = res.total

    /* 保存搜索历史 */
    if (searchParams.keyword) {
      QuestionSearchApi.saveSearchHistory(searchParams.keyword)
      loadSearchHistory()
    }
  } catch (e) {
    console.error('搜索失败:', e)
    message.error('搜索失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 防抖搜索
 */
const debouncedSearch = debounce(searchQuestions, 300)

/**
 * 处理搜索
 */
const handleSearch = () => {
  searchParams.pageNo = 1
  searchQuestions()
}

/**
 * 处理筛选变化
 */
const handleFilterChange = () => {
  searchParams.pageNo = 1
  debouncedSearch()
}

/**
 * 处理排序变化
 */
const handleSortChange = (sort: string) => {
  searchParams.sort = sort as any
  searchParams.pageNo = 1
  searchQuestions()
}

/**
 * 处理分页变化
 */
const handlePageChange = (page: number) => {
  searchParams.pageNo = page
  searchQuestions()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * 清空筛选条件
 */
const clearFilters = () => {
  searchParams.type = undefined
  searchParams.difficulty = undefined
  searchParams.pointId = undefined
  searchParams.qbankId = undefined
  searchParams.pageNo = 1
  searchQuestions()
}

/**
 * 清除单个筛选条件
 */
const removeFilter = (key: keyof QuestionSearchReqVO) => {
  searchParams[key] = undefined
  searchParams.pageNo = 1
  searchQuestions()
}

/**
 * 加载搜索历史
 */
const loadSearchHistory = () => {
  searchHistory.value = QuestionSearchApi.getSearchHistory()
}

/**
 * 选择历史关键词
 */
const selectHistory = (keyword: string) => {
  searchParams.keyword = keyword
  handleSearch()
}

/**
 * 清空搜索历史
 */
const clearHistory = () => {
  QuestionSearchApi.clearSearchHistory()
  searchHistory.value = []
}

/**
 * 加载热门搜索
 */
const loadHotKeywords = async () => {
  try {
    const res = await QuestionSearchApi.getHotKeywords(8)
    hotKeywords.value = res
  } catch (e) {
    console.error('加载热门搜索失败:', e)
  }
}

/**
 * 收藏/取消收藏题目
 */
const toggleFavorite = async (item: QuestionSearchResultItem) => {
  try {
    const newStatus = !item.isFavorited
    await QuestionSearchApi.toggleFavorite({
      questionId: item.id,
      isFavorited: newStatus
    })
    item.isFavorited = newStatus
    message.success(newStatus ? '收藏成功' : '已取消收藏')
  } catch (e) {
    message.error('操作失败，请稍后重试')
  }
}

/**
 * 进入题目详情
 */
const goToQuestion = (item: QuestionSearchResultItem) => {
  navigateTo(`/study/question/${item.id}`)
}

/**
 * 进入题库
 */
const goToQbank = (qbankId: number) => {
  navigateTo(`/qbank/${qbankId}`)
}

/**
 * 获取题型标签样式
 */
const getTypeTagClass = (type: number) => {
  const classes: Record<number, string> = {
    1: 'bg-blue-100 text-blue-600',
    2: 'bg-purple-100 text-purple-600',
    3: 'bg-green-100 text-green-600',
    4: 'bg-orange-100 text-orange-600',
    5: 'bg-gray-100 text-gray-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

/**
 * 获取难度标签样式
 */
const getDifficultyTagClass = (difficulty: number) => {
  const classes: Record<number, string> = {
    1: 'bg-green-100 text-green-600',
    2: 'bg-yellow-100 text-yellow-600',
    3: 'bg-red-100 text-red-600'
  }
  return classes[difficulty] || 'bg-gray-100 text-gray-600'
}

/**
 * 获取筛选条件显示文本
 */
const getFilterLabel = (key: keyof QuestionSearchReqVO, value: number) => {
  if (key === 'type') {
    return filterOptions.value.types.find(t => t.value === value)?.label || ''
  }
  if (key === 'difficulty') {
    return filterOptions.value.difficulties.find(d => d.value === value)?.label || ''
  }
  if (key === 'pointId') {
    return filterOptions.value.points.find(p => p.value === value)?.label || ''
  }
  if (key === 'qbankId') {
    return filterOptions.value.qbanks.find(q => q.value === value)?.label || ''
  }
  return String(value)
}

/* ==================== 生命周期 ==================== */
onMounted(() => {
  /* 初始化搜索参数 */
  const query = route.query
  if (query.keyword) searchParams.keyword = query.keyword as string
  if (query.type) searchParams.type = Number(query.type)
  if (query.difficulty) searchParams.difficulty = Number(query.difficulty)
  if (query.pointId) searchParams.pointId = Number(query.pointId)
  if (query.qbankId) searchParams.qbankId = Number(query.qbankId)

  /* 加载数据 */
  loadFilterOptions()
  loadSearchHistory()
  loadHotKeywords()

  /* 如果有搜索条件，立即搜索 */
  if (searchParams.keyword || hasActiveFilters.value) {
    searchQuestions()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 搜索头部 -->
      <div class="max-w-4xl mx-auto mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">题目搜索</h1>

        <!-- 搜索输入框 -->
        <div class="relative flex items-center mb-4">
          <input
            v-model="searchParams.keyword"
            type="text"
            placeholder="输入关键词搜索题目..."
            class="w-full pl-12 pr-24 py-4 rounded-xl bg-white border border-gray-200 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-lg"
            @keydown.enter="handleSearch"
          />
          <Icon
            name="ep:search"
            class="absolute left-4 text-xl text-gray-400"
          />
          <button
            @click="handleSearch"
            class="absolute right-2 top-2 bottom-2 bg-[var(--color-primary)] text-white px-6 rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
          >
            搜索
          </button>
        </div>

        <!-- 热门搜索 -->
        <div v-if="hotKeywords.length > 0 && !searchParams.keyword && !searchResults.length" class="flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gray-500">热门搜索:</span>
          <button
            v-for="item in hotKeywords.slice(0, 6)"
            :key="item.keyword"
            @click="selectHistory(item.keyword)"
            class="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-600 transition-colors"
          >
            {{ item.keyword }}
          </button>
        </div>

        <!-- 搜索历史 -->
        <div v-if="searchHistory.length > 0 && !searchParams.keyword && !searchResults.length" class="mt-4 flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gray-500">历史搜索:</span>
          <button
            v-for="keyword in searchHistory.slice(0, 8)"
            :key="keyword"
            @click="selectHistory(keyword)"
            class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
          >
            {{ keyword }}
          </button>
          <button
            @click="clearHistory"
            class="text-sm text-gray-400 hover:text-gray-600 ml-2"
          >
            清空
          </button>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="max-w-6xl mx-auto">
        <div class="flex gap-6">
          <!-- 左侧筛选栏 -->
          <div class="w-64 flex-shrink-0">
            <div class="bg-white rounded-xl shadow-sm p-4 sticky top-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900">筛选条件</h3>
                <button
                  v-if="hasActiveFilters"
                  @click="clearFilters"
                  class="text-sm text-[var(--color-primary)] hover:underline"
                >
                  清空筛选
                </button>
              </div>

              <!-- 题型筛选 -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 mb-3">题型</h4>
                <div class="space-y-2">
                  <label
                    v-for="type in filterOptions.types"
                    :key="type.value"
                    class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="radio"
                      :value="type.value"
                      v-model="searchParams.type"
                      class="text-[var(--color-primary)]"
                      @change="handleFilterChange"
                    />
                    <span class="text-sm text-gray-600 flex-1">{{ type.label }}</span>
                    <span class="text-xs text-gray-400">({{ type.count }})</span>
                  </label>
                </div>
              </div>

              <!-- 难度筛选 -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 mb-3">难度</h4>
                <div class="space-y-2">
                  <label
                    v-for="difficulty in filterOptions.difficulties"
                    :key="difficulty.value"
                    class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="radio"
                      :value="difficulty.value"
                      v-model="searchParams.difficulty"
                      class="text-[var(--color-primary)]"
                      @change="handleFilterChange"
                    />
                    <span class="text-sm text-gray-600 flex-1">{{ difficulty.label }}</span>
                    <span class="text-xs text-gray-400">({{ difficulty.count }})</span>
                  </label>
                </div>
              </div>

              <!-- 知识点筛选 -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 mb-3">知识点</h4>
                <div class="space-y-2">
                  <label
                    v-for="point in filterOptions.points"
                    :key="point.value"
                    class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="radio"
                      :value="point.value"
                      v-model="searchParams.pointId"
                      class="text-[var(--color-primary)]"
                      @change="handleFilterChange"
                    />
                    <span class="text-sm text-gray-600 flex-1">{{ point.label }}</span>
                    <span class="text-xs text-gray-400">({{ point.count }})</span>
                  </label>
                </div>
              </div>

              <!-- 题库筛选 -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-3">题库</h4>
                <div class="space-y-2">
                  <label
                    v-for="qbank in filterOptions.qbanks"
                    :key="qbank.value"
                    class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="radio"
                      :value="qbank.value"
                      v-model="searchParams.qbankId"
                      class="text-[var(--color-primary)]"
                      @change="handleFilterChange"
                    />
                    <span class="text-sm text-gray-600 flex-1 truncate">{{ qbank.label }}</span>
                    <span class="text-xs text-gray-400">({{ qbank.count }})</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧结果区 -->
          <div class="flex-1">
            <!-- 结果头部 -->
            <div v-if="searchResults.length > 0 || loading" class="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div class="flex items-center justify-between">
                <div class="text-gray-600">
                  找到 <span class="text-[var(--color-primary)] font-semibold">{{ total }}</span> 道相关题目
                </div>

                <!-- 排序选项 -->
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">排序:</span>
                  <select
                    v-model="searchParams.sort"
                    class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:border-[var(--color-primary)] focus:outline-none"
                    @change="handleSortChange(searchParams.sort!)"
                  >
                    <option value="newest">最新</option>
                    <option value="hot">热门</option>
                    <option value="difficulty_asc">难度升序</option>
                    <option value="difficulty_desc">难度降序</option>
                  </select>
                </div>
              </div>

              <!-- 已选筛选条件 -->
              <div v-if="hasActiveFilters" class="flex items-center gap-2 mt-3 flex-wrap">
                <span class="text-sm text-gray-500">已选筛选:</span>
                <template v-if="searchParams.type !== undefined">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm">
                    题型: {{ getFilterLabel('type', searchParams.type) }}
                    <button @click="removeFilter('type')" class="hover:text-blue-800">
                      <Icon name="ep:close" class="text-xs"/>
                    </button>
                  </span>
                </template>
                <template v-if="searchParams.difficulty !== undefined">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-sm">
                    难度: {{ getFilterLabel('difficulty', searchParams.difficulty) }}
                    <button @click="removeFilter('difficulty')" class="hover:text-green-800">
                      <Icon name="ep:close" class="text-xs"/>
                    </button>
                  </span>
                </template>
                <template v-if="searchParams.pointId !== undefined">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm">
                    知识点: {{ getFilterLabel('pointId', searchParams.pointId) }}
                    <button @click="removeFilter('pointId')" class="hover:text-purple-800">
                      <Icon name="ep:close" class="text-xs"/>
                    </button>
                  </span>
                </template>
                <template v-if="searchParams.qbankId !== undefined">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-sm">
                    题库: {{ getFilterLabel('qbankId', searchParams.qbankId) }}
                    <button @click="removeFilter('qbankId')" class="hover:text-orange-800">
                      <Icon name="ep:close" class="text-xs"/>
                    </button>
                  </span>
                </template>
              </div>
            </div>

            <!-- 结果列表 -->
            <div v-loading="loading" class="min-h-[400px]">
              <!-- 题目列表 -->
              <div v-if="searchResults.length > 0" class="space-y-4">
                <div
                  v-for="item in searchResults"
                  :key="item.id"
                  class="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  @click="goToQuestion(item)"
                >
                  <div class="flex items-start gap-4">
                    <!-- 题目信息 -->
                    <div class="flex-1">
                      <!-- 标签 -->
                      <div class="flex items-center gap-2 mb-2">
                        <span
                          class="text-xs px-2 py-0.5 rounded-full"
                          :class="getTypeTagClass(item.type)"
                        >
                          {{ item.typeName }}
                        </span>
                        <span
                          class="text-xs px-2 py-0.5 rounded-full"
                          :class="getDifficultyTagClass(item.difficulty)"
                        >
                          {{ item.difficultyName }}
                        </span>
                        <button
                          @click.stop="goToQbank(item.qbankId)"
                          class="text-xs text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                        >
                          {{ item.qbankName }}
                        </button>
                      </div>

                      <!-- 题目内容 -->
                      <h3 class="text-base text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                        {{ item.content }}
                      </h3>

                      <!-- 统计信息 -->
                      <div class="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span class="flex items-center gap-1">
                          <Icon name="ep:view" class="text-xs"/>
                          {{ item.viewCount }} 浏览
                        </span>
                        <span class="flex items-center gap-1">
                          <Icon name="ep:check" class="text-xs"/>
                          {{ item.practiceCount }} 练习
                        </span>
                        <span class="flex items-center gap-1">
                          <Icon name="ep:success-filled" class="text-xs"/>
                          正确率 {{ item.accuracyRate }}%
                        </span>
                        <span v-if="item.pointList?.length" class="flex items-center gap-1">
                          <Icon name="ep:folder" class="text-xs"/>
                          {{ item.pointList.map(p => p.name).join(', ') }}
                        </span>
                      </div>
                    </div>

                    <!-- 收藏按钮 -->
                    <button
                      @click.stop="toggleFavorite(item)"
                      class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon
                        :name="item.isFavorited ? 'ep:star-filled' : 'ep:star'"
                        class="text-xl"
                        :class="item.isFavorited ? 'text-yellow-400' : 'text-gray-300'"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- 空状态 -->
              <div v-else-if="!loading && (searchParams.keyword || hasActiveFilters)" class="text-center py-16 bg-white rounded-xl">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="ep:search" class="text-3xl text-gray-400"/>
                </div>
                <h3 class="text-lg font-medium text-gray-700 mb-2">未找到相关题目</h3>
                <p class="text-gray-500 mb-6">换个关键词或调整筛选条件试试</p>
                <button
                  @click="clearFilters"
                  class="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
                >
                  清空筛选
                </button>
              </div>

              <!-- 初始状态 -->
              <div v-else-if="!loading && !searchParams.keyword && !hasActiveFilters" class="text-center py-16 bg-white rounded-xl">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="ep:search" class="text-3xl text-gray-400"/>
                </div>
                <h3 class="text-lg font-medium text-gray-700 mb-2">开始搜索题目</h3>
                <p class="text-gray-500">输入关键词或选择筛选条件开始搜索</p>
              </div>
            </div>

            <!-- 分页 -->
            <div v-if="total > searchParams.pageSize!" class="mt-6 flex justify-center">
              <el-pagination
                v-model:current-page="searchParams.pageNo"
                :page-size="searchParams.pageSize"
                :total="total"
                layout="prev, pager, next"
                background
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
