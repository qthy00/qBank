<template>
  <div class="guide-list-page">
    <!-- 页面头部 -->
    <div class="page-header bg-gradient-to-r from-blue-500 to-blue-600 py-10">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-2 text-white/80 mb-2">
          <NuxtLink to="/help" class="hover:text-white">帮助中心</NuxtLink>
          <Icon name="ep:arrow-right" class="text-sm" />
          <span>使用指南</span>
        </div>
        <h1 class="text-2xl font-bold text-white">使用指南</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- 分类标签 -->
      <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4 mb-6">
        <el-skeleton v-if="categoryLoading" :rows="2" animated />
        <div v-else class="flex flex-wrap gap-3">
          <el-button
            :type="selectedCategory === undefined ? 'primary' : 'default'"
            size="default"
            @click="selectCategory(undefined)"
          >
            全部
          </el-button>
          <el-button
            v-for="category in categories"
            :key="category.id"
            :type="selectedCategory === category.id ? 'primary' : 'default'"
            size="default"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </el-button>
        </div>
      </div>

      <!-- 搜索栏 -->
      <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4 mb-6">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索使用指南..."
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

      <!-- 指南列表 -->
      <el-skeleton v-if="loading" :rows="6" animated />

      <div v-else-if="guideList.length === 0" class="empty-state py-16 text-center bg-(--color-bg-container) rounded-lg border border-(--color-border)">
        <Icon name="ep:document" class="text-6xl text-gray-300 mb-4" />
        <p class="text-(--color-text-secondary)">暂无相关指南</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="guide in guideList"
          :key="guide.id"
          :to="`/help/guide/${guide.id}`"
          class="guide-card group"
        >
          <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <div class="h-48 overflow-hidden">
              <img
                :src="guide.coverImage || '/images/default-guide.jpg'"
                :alt="guide.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <div class="flex items-center gap-2 mb-2">
                <el-tag v-if="guide.isTop" type="success" size="small">置顶</el-tag>
                <el-tag type="info" size="small">{{ guide.categoryName }}</el-tag>
              </div>
              <h3 class="font-bold text-(--color-text-primary) mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors">{{ guide.title }}</h3>
              <p class="text-sm text-(--color-text-secondary) line-clamp-2 mb-4 flex-1">{{ guide.summary }}</p>
              <div class="flex items-center justify-between text-xs text-(--color-text-secondary) pt-3 border-t border-(--color-border)">
                <span class="flex items-center gap-1">
                  <Icon name="ep:view" />
                  {{ formatNumber(guide.viewCount) }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="ep:calendar" />
                  {{ formatDate(guide.publishTime) }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="mt-6 flex justify-center">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[9, 18, 36]"
          layout="total, sizes, prev, pager, next"
          @change="fetchGuideList"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GuideCategoryVO, GuideVO } from '~/types/help'
import { getMockGuideList } from '~/api/help/mock'
import { mockGuideCategories } from '~/api/help/mock'

definePageMeta({
  layout: 'default'
})

const loading = ref(true)
const categoryLoading = ref(true)
const searchKeyword = ref('')
const selectedCategory = ref<number | undefined>(undefined)
const categories = ref<GuideCategoryVO[]>([])
const guideList = ref<GuideVO[]>([])
const page = ref(1)
const pageSize = ref(9)
const total = ref(0)

/* 获取分类列表 */
const fetchCategories = async () => {
  categoryLoading.value = true
  try {
    /* 模拟API调用 */
    await new Promise(resolve => setTimeout(resolve, 300))
    categories.value = mockGuideCategories
  } finally {
    categoryLoading.value = false
  }
}

/* 获取指南列表 */
const fetchGuideList = async () => {
  loading.value = true
  try {
    const res = await getMockGuideList({
      page: page.value,
      pageSize: pageSize.value,
      categoryId: selectedCategory.value,
      keyword: searchKeyword.value || undefined
    })
    guideList.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

/* 选择分类 */
const selectCategory = (id: number | undefined) => {
  selectedCategory.value = id
  page.value = 1
  fetchGuideList()
}

/* 搜索 */
const handleSearch = () => {
  page.value = 1
  fetchGuideList()
}

/* 格式化数字 */
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

/* 格式化日期 */
const formatDate = (date: string) => {
  return date.split(' ')[0]
}

onMounted(() => {
  fetchCategories()
  fetchGuideList()
})
</script>

<style scoped lang="scss">
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.guide-card {
  text-decoration: none;
}
</style>
