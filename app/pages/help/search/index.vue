<template>
  <div class="help-search-page">
    <!-- 页面头部 -->
    <div class="page-header bg-gradient-to-r from-blue-500 to-blue-600 py-10">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-2 text-white/80 mb-2">
          <NuxtLink to="/help" class="hover:text-white">帮助中心</NuxtLink>
          <Icon name="ep:arrow-right" class="text-sm" />
          <span>搜索结果</span>
        </div>
        <h1 class="text-2xl font-bold text-white">搜索"{{ keyword }}"</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- 搜索栏 -->
      <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4 mb-6">
        <el-input
          v-model="searchInput"
          placeholder="搜索问题、指南..."
          clearable
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #suffix>
            <el-button type="primary" size="default" @click="handleSearch">
              <Icon name="ep:search" />
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 筛选标签 -->
      <div class="flex items-center gap-3 mb-6">
        <span class="text-(--color-text-secondary)">筛选：</span>
        <el-radio-group v-model="selectedType" @change="handleTypeChange">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="faq">常见问题</el-radio-button>
          <el-radio-button label="guide">使用指南</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 搜索结果 -->
      <el-skeleton v-if="loading" :rows="6" animated />

      <div v-else-if="searchResults.length === 0" class="empty-state py-16 text-center bg-(--color-bg-container) rounded-lg border border-(--color-border)">
        <Icon name="ep:search" class="text-6xl text-gray-300 mb-4" />
        <p class="text-(--color-text-secondary) mb-2">未找到相关内容</p>
        <p class="text-sm text-(--color-text-secondary)">请尝试使用其他关键词搜索</p>
      </div>

      <div v-else>
        <p class="text-(--color-text-secondary) mb-4">
          共找到 <span class="text-blue-500 font-bold">{{ total }}</span> 个相关结果
        </p>

        <div class="space-y-4">
          <NuxtLink
            v-for="item in searchResults"
            :key="`${item.type}-${item.id}`"
            :to="item.url"
            class="search-result-item block bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4 hover:shadow-md transition-all duration-200"
          >
            <div class="flex items-start gap-4">
              <div class="icon-wrapper w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                   :class="item.type === 'faq' ? 'bg-blue-50' : 'bg-green-50'">
                <Icon :name="item.type === 'faq' ? 'ep:question-filled' : 'ep:notebook'"
                      class="text-2xl"
                      :class="item.type === 'faq' ? 'text-blue-500' : 'text-green-500'" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <el-tag :type="item.type === 'faq' ? 'primary' : 'success'" size="small">
                    {{ item.type === 'faq' ? '常见问题' : '使用指南' }}
                  </el-tag>
                  <span class="text-xs text-(--color-text-secondary)">{{ item.categoryName }}</span>
                </div>
                <h3 class="font-bold text-(--color-text-primary) mb-2 hover:text-blue-500 transition-colors"
                    v-html="highlightKeyword(item.title)" />
                <p class="text-sm text-(--color-text-secondary) line-clamp-2"
                   v-html="highlightKeyword(item.summary || '')" />
              </div>
              <Icon name="ep:arrow-right" class="text-(--color-text-secondary) flex-shrink-0" />
            </div>
          </NuxtLink>
        </div>

        <!-- 分页 -->
        <div v-if="total > pageSize" class="mt-6 flex justify-center">
          <el-pagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            @change="handleSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HelpSearchItemVO } from '~/types/help'
import { mockSearchHelp } from '~/api/help/mock'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const loading = ref(true)
const searchInput = ref('')
const keyword = ref('')
const selectedType = ref<'all' | 'faq' | 'guide'>('all')
const searchResults = ref<HelpSearchItemVO[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

/* 获取搜索结果 */
const fetchSearchResults = async () => {
  if (!keyword.value) return

  loading.value = true
  try {
    const res = await mockSearchHelp({
      keyword: keyword.value,
      type: selectedType.value,
      page: page.value,
      pageSize: pageSize.value
    })
    searchResults.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

/* 搜索 */
const handleSearch = () => {
  if (!searchInput.value.trim()) return
  keyword.value = searchInput.value
  page.value = 1
  navigateTo(`/help/search?keyword=${encodeURIComponent(keyword.value)}&type=${selectedType.value}`)
  fetchSearchResults()
}

/* 切换类型 */
const handleTypeChange = () => {
  page.value = 1
  navigateTo(`/help/search?keyword=${encodeURIComponent(keyword.value)}&type=${selectedType.value}`)
  fetchSearchResults()
}

/* 高亮关键词 */
const highlightKeyword = (text: string) => {
  if (!keyword.value || !text) return text
  const regex = new RegExp(`(${keyword.value})`, 'gi')
  return text.replace(regex, '<span class="text-blue-500 font-bold bg-blue-50 px-1 rounded">$1</span>')
}

/* 初始化 */
onMounted(() => {
  const queryKeyword = route.query.keyword as string
  const queryType = route.query.type as 'all' | 'faq' | 'guide'

  if (queryKeyword) {
    keyword.value = queryKeyword
    searchInput.value = queryKeyword
  }

  if (queryType && ['all', 'faq', 'guide'].includes(queryType)) {
    selectedType.value = queryType
  }

  if (keyword.value) {
    fetchSearchResults()
  } else {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.search-result-item {
  text-decoration: none;

  &:hover {
    border-color: #3b82f6;
  }
}

.empty-state {
  background: white;
}
</style>
