<template>
  <div class="help-home">
    <!-- 搜索区域 -->
    <div class="search-section bg-gradient-to-r from-blue-500 to-blue-600 py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">帮助中心</h1>
        <p class="text-white/80 mb-8">常见问题解答、使用指南、操作教程</p>
        <div class="max-w-2xl mx-auto">
          <el-input
            v-model="searchKeyword"
            size="large"
            placeholder="搜索问题、指南..."
            class="help-search-input"
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-button type="primary" size="small" @click="handleSearch">
                <Icon name="ep:search" />
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-links py-12 bg-(--color-bg-container)">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- FAQ入口 -->
          <NuxtLink to="/help/faq" class="link-card group">
            <div class="card-content p-6 rounded-lg border border-(--color-border) hover:shadow-lg transition-all duration-300">
              <div class="flex items-center gap-4">
                <div class="icon-wrapper w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon name="ep:question-filled" class="text-2xl text-blue-500" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-(--color-text-primary)">常见问题</h3>
                  <p class="text-sm text-(--color-text-secondary)">账号、题库、支付等常见问题</p>
                </div>
              </div>
            </div>
          </NuxtLink>

          <!-- 使用指南入口 -->
          <NuxtLink to="/help/guide" class="link-card group">
            <div class="card-content p-6 rounded-lg border border-(--color-border) hover:shadow-lg transition-all duration-300">
              <div class="flex items-center gap-4">
                <div class="icon-wrapper w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="ep:notebook" class="text-2xl text-green-500" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-(--color-text-primary)">使用指南</h3>
                  <p class="text-sm text-(--color-text-secondary)">功能介绍、操作教程</p>
                </div>
              </div>
            </div>
          </NuxtLink>

          <!-- 问题反馈入口 -->
          <NuxtLink to="/help/feedback" class="link-card group">
            <div class="card-content p-6 rounded-lg border border-(--color-border) hover:shadow-lg transition-all duration-300">
              <div class="flex items-center gap-4">
                <div class="icon-wrapper w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                  <Icon name="ep:chat-dot-round" class="text-2xl text-orange-500" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-(--color-text-primary)">问题反馈</h3>
                  <p class="text-sm text-(--color-text-secondary)">遇到问题？向我们反馈</p>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 热门问题 -->
    <div class="hot-faqs py-12">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-(--color-text-primary)">热门问题</h2>
          <NuxtLink to="/help/faq" class="text-blue-500 hover:text-blue-600 flex items-center gap-1">
            查看全部
            <Icon name="ep:arrow-right" />
          </NuxtLink>
        </div>

        <el-skeleton v-if="loading" :rows="6" animated />

        <div v-else class="space-y-4">
          <div
            v-for="faq in hotFAQs"
            :key="faq.id"
            class="faq-item bg-(--color-bg-container) rounded-lg border border-(--color-border) overflow-hidden"
          >
            <div
              class="faq-question p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              @click="toggleFaq(faq.id)"
            >
              <div class="flex items-center gap-3">
                <el-tag v-if="faq.isHot" type="danger" size="small">热门</el-tag>
                <span class="text-(--color-text-primary)">{{ faq.question }}</span>
              </div>
              <Icon
                name="ep:arrow-down"
                class="transition-transform duration-300"
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
      </div>
    </div>

    <!-- 最新指南 -->
    <div class="recent-guides py-12 bg-(--color-bg-container)">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-(--color-text-primary)">最新指南</h2>
          <NuxtLink to="/help/guide" class="text-blue-500 hover:text-blue-600 flex items-center gap-1">
            查看全部
            <Icon name="ep:arrow-right" />
          </NuxtLink>
        </div>

        <el-skeleton v-if="loading" :rows="4" animated />

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="guide in recentGuides"
            :key="guide.id"
            :to="`/help/guide/${guide.id}`"
            class="guide-card group"
          >
            <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) overflow-hidden hover:shadow-lg transition-all duration-300">
              <div class="h-40 overflow-hidden">
                <img
                  :src="guide.coverImage || '/images/default-guide.jpg'"
                  :alt="guide.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
              </div>
              <div class="p-4">
                <el-tag v-if="guide.isTop" type="success" size="small" class="mb-2">置顶</el-tag>
                <h3 class="font-bold text-(--color-text-primary) mb-2 line-clamp-1">{{ guide.title }}</h3>
                <p class="text-sm text-(--color-text-secondary) line-clamp-2 mb-3">{{ guide.summary }}</p>
                <div class="flex items-center justify-between text-xs text-(--color-text-secondary)">
                  <span class="flex items-center gap-1">
                    <Icon name="ep:view" />
                    {{ formatNumber(guide.viewCount) }}
                  </span>
                  <span>{{ formatDate(guide.publishTime) }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 联系客服 -->
    <div class="contact-section py-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-xl font-bold text-(--color-text-primary) mb-4">还有其他问题？</h2>
        <p class="text-(--color-text-secondary) mb-6">我们的客服团队随时为您解答</p>
        <div class="flex items-center justify-center gap-6">
          <div class="contact-item">
            <Icon name="ep:service" class="text-3xl text-blue-500 mb-2" />
            <p class="text-sm text-(--color-text-secondary)">在线客服</p>
            <p class="text-xs text-(--color-text-secondary)">工作日 9:00-18:00</p>
          </div>
          <div class="contact-item">
            <Icon name="ep:message" class="text-3xl text-green-500 mb-2" />
            <p class="text-sm text-(--color-text-secondary)">客服邮箱</p>
            <p class="text-xs text-(--color-text-secondary)">support@xueciyuan.com</p>
          </div>
          <div class="contact-item">
            <Icon name="ep:phone" class="text-3xl text-orange-500 mb-2" />
            <p class="text-sm text-(--color-text-secondary)">客服电话</p>
            <p class="text-xs text-(--color-text-secondary)">400-xxx-xxxx</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FAQVO, GuideVO } from '~/types/help'
import { getMockHelpHomeData } from '~/api/help/mock'

definePageMeta({
  layout: 'default'
})

const loading = ref(true)
const searchKeyword = ref('')
const expandedFaqId = ref<number | null>(null)
const hotFAQs = ref<FAQVO[]>([])
const recentGuides = ref<GuideVO[]>([])

/* 获取首页数据 */
const fetchHomeData = async () => {
  loading.value = true
  try {
    const data = await getMockHelpHomeData()
    hotFAQs.value = data.hotFAQs
    recentGuides.value = data.recentGuides
  } finally {
    loading.value = false
  }
}

/* 切换FAQ展开状态 */
const toggleFaq = (id: number) => {
  expandedFaqId.value = expandedFaqId.value === id ? null : id
}

/* 搜索 */
const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  navigateTo(`/help/search?keyword=${encodeURIComponent(searchKeyword.value)}`)
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
  fetchHomeData()
})
</script>

<style scoped lang="scss">
.help-home {
  min-height: 100vh;
}

.search-section {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.help-search-input {
  :deep(.el-input__wrapper) {
    border-radius: 8px;
    padding-right: 8px;
  }

  :deep(.el-input__inner) {
    height: 48px;
    font-size: 16px;
  }
}

.link-card {
  text-decoration: none;

  .card-content {
    background: white;

    &:hover {
      border-color: #3b82f6;
    }
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
  }
}

.guide-card {
  text-decoration: none;
}

.contact-item {
  padding: 20px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  min-width: 140px;
}
</style>
