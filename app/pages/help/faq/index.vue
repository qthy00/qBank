<template>
  <div class="faq-page">
    <!-- 页面头部 -->
    <div class="page-header bg-gradient-to-r from-blue-500 to-blue-600 py-10">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-2 text-white/80 mb-2">
          <NuxtLink to="/help" class="hover:text-white">帮助中心</NuxtLink>
          <Icon name="ep:arrow-right" class="text-sm" />
          <span>常见问题</span>
        </div>
        <h1 class="text-2xl font-bold text-white">常见问题</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧分类 -->
        <div class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4 sticky top-4">
            <h3 class="font-bold text-(--color-text-primary) mb-4">问题分类</h3>
            <el-skeleton v-if="categoryLoading" :rows="6" animated />
            <div v-else class="space-y-2">
              <div
                v-for="category in categories"
                :key="category.id"
                class="category-item p-3 rounded-lg cursor-pointer transition-all duration-200"
                :class="{ 'bg-blue-50 text-blue-600': selectedCategory === category.id, 'hover:bg-gray-50': selectedCategory !== category.id }"
                @click="selectCategory(category.id)"
              >
                <div class="flex items-center gap-3">
                  <Icon :name="category.icon || 'ep:folder'" class="text-lg" />
                  <span class="flex-1">{{ category.name }}</span>
                  <span class="text-xs text-(--color-text-secondary)">{{ category.questionCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="flex-1">
          <!-- 搜索栏 -->
          <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4 mb-6">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索常见问题..."
              clearable
              @keyup.enter="handleSearch"
            >
              <template #suffix>
                <el-button type="primary" @click="handleSearch">
                  <Icon name="ep:search" />
                </el-button>
              </template>
            </el-input>
          </div>

          <!-- FAQ列表 -->
          <el-skeleton v-if="loading" :rows="6" animated />

          <div v-else-if="faqList.length === 0" class="empty-state py-16 text-center">
            <Icon name="ep:document" class="text-6xl text-gray-300 mb-4" />
            <p class="text-(--color-text-secondary)">暂无相关问题</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="faq in faqList"
              :key="faq.id"
              class="faq-item bg-(--color-bg-container) rounded-lg border border-(--color-border) overflow-hidden"
            >
              <div
                class="faq-question p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                @click="toggleFaq(faq.id)"
              >
                <div class="flex items-center gap-3 flex-1">
                  <el-tag v-if="faq.isHot" type="danger" size="small">热门</el-tag>
                  <span class="text-(--color-text-primary) font-medium">{{ faq.question }}</span>
                </div>
                <Icon
                  name="ep:arrow-down"
                  class="transition-transform duration-300 text-(--color-text-secondary)"
                  :class="{ 'rotate-180': expandedFaqId === faq.id }"
                />
              </div>
              <div
                v-show="expandedFaqId === faq.id"
                class="faq-answer px-4 pb-4 text-(--color-text-secondary) leading-relaxed"
                v-html="faq.answer"
              />
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="total > pageSize" class="mt-6 flex justify-center">
            <el-pagination
              v-model:current-page="page"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next"
              @change="fetchFAQList"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FAQCategoryVO, FAQVO } from '~/types/help'
import { getMockFAQList, mockFAQCategories  } from '~/api/help/mock'


definePageMeta({
  layout: 'default'
})

const loading = ref(true)
const categoryLoading = ref(true)
const searchKeyword = ref('')
const selectedCategory = ref<number | undefined>(undefined)
const expandedFaqId = ref<number | null>(null)
const categories = ref<FAQCategoryVO[]>([])
const faqList = ref<FAQVO[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

/* 获取分类列表 */
const fetchCategories = async () => {
  categoryLoading.value = true
  try {
    /* 模拟API调用 */
    await new Promise(resolve => setTimeout(resolve, 300))
    categories.value = mockFAQCategories
  } finally {
    categoryLoading.value = false
  }
}

/* 获取FAQ列表 */
const fetchFAQList = async () => {
  loading.value = true
  try {
    const res = await getMockFAQList({
      page: page.value,
      pageSize: pageSize.value,
      categoryId: selectedCategory.value,
      keyword: searchKeyword.value || undefined
    })
    faqList.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

/* 选择分类 */
const selectCategory = (id: number) => {
  if (selectedCategory.value === id) {
    selectedCategory.value = undefined
  } else {
    selectedCategory.value = id
  }
  page.value = 1
  fetchFAQList()
}

/* 切换FAQ展开状态 */
const toggleFaq = (id: number) => {
  expandedFaqId.value = expandedFaqId.value === id ? null : id
}

/* 搜索 */
const handleSearch = () => {
  page.value = 1
  fetchFAQList()
}

onMounted(() => {
  fetchCategories()
  fetchFAQList()
})
</script>

<style scoped lang="scss">
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.category-item {
  &.bg-blue-50 {
    background-color: #eff6ff;
    color: #2563eb;
  }
}

.faq-item {
  .faq-question {
    &:hover {
      background-color: #f9fafb;
    }
  }

  .faq-answer {
    border-top: 1px dashed #e5e7eb;
    padding-top: 12px;
    margin-top: 0;
    margin-left: 16px;
    margin-right: 16px;

    :deep(h2) {
      font-size: 16px;
      font-weight: bold;
      margin: 16px 0 8px;
    }

    :deep(h3) {
      font-size: 14px;
      font-weight: bold;
      margin: 12px 0 6px;
    }

    :deep(p) {
      margin: 8px 0;
    }

    :deep(ul) {
      margin: 8px 0;
      padding-left: 20px;
    }

    :deep(li) {
      margin: 4px 0;
    }
  }
}

.empty-state {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
</style>
