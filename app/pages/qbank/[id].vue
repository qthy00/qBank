<script setup lang="ts">
import {questionApi} from '~/api/qbank'
import type {QbankDetailVO, ChapterVO} from '~/types/qbank'

/**
 * 题库详情页
 * 使用 Nuxt 4 规范：
 * 1. definePageMeta 定义页面元数据
 * 2. useFetch/useAsyncData 进行数据获取（SSR 安全）
 * 3. 支持服务端预渲染 + 客户端水合
 */

/* ==================== 页面元数据 ==================== */

const route = useRoute()
const qbankId = computed(() => Number(route.params.id))

/* 使用 SEO 元数据 */
definePageMeta({
  title: '题库详情',
})

useHead({
  title: computed(() => qbankDetail.value?.name ? `${qbankDetail.value.name} - 题库详情` : '题库详情'),
  meta: [
    {
      name: 'description',
      content: computed(() => qbankDetail.value?.description || '题库详情页面')
    }
  ]
})

/* ==================== 数据获取（Nuxt 4 规范） ==================== */

/**
 * 使用 useAsyncData 获取题库详情
 * key: 'qbank-detail-${id}' 确保每个题库有独立缓存
 * server: true 允许服务端获取（SEO 友好）
 * watch: 监听 qbankId 变化自动刷新
 */
const { data: qbankDetail, pending: loading, error: detailError } = await useAsyncData(
  () => `qbank-detail-${qbankId.value}`,
  () => questionApi.getQbankDetail(qbankId.value, true),
  {
    server: true, /* 支持服务端获取，SEO 友好 */
    default: () => null,
    watch: [qbankId], /* 题库 ID 变化时自动刷新 */
    transform: (data) => {
      /* 数据转换：确保字段完整性 */
      if (!data) return null
      return {
        ...data,
        chapters: data.chapters || [],
        tags: data.tags || [],
      }
    }
  }
)

/**
 * 使用 useAsyncData 获取用户权限（客户端获取）
 * 权限信息通常需要登录态，在客户端获取
 */
const { data: accessData } = await useAsyncData(
  () => `qbank-access-${qbankId.value}`,
  () => questionApi.checkQbankAccess(qbankId.value),
  {
    server: false, /* 权限检查在客户端进行 */
    default: () => ({ qbankId: qbankId.value, hasAccess: false, accessType: 'free' }),
    watch: [qbankId],
  }
)

/* ==================== 状态定义 ==================== */

const router = useRouter()
const message = useMessage()

const activeTab = ref('chapters')

/* ==================== 计算属性 ==================== */

/**
 * 用户是否有权限访问题库
 */
const hasAccess = computed(() => {
  /* 免费题库直接有权限 */
  if (qbankDetail.value?.price === 0) return true
  /* 已购买 */
  if (qbankDetail.value?.isPurchased) return true
  /* 权限检查返回 */
  return accessData.value?.hasAccess || false
})

/**
 * 访问类型
 */
const accessType = computed(() => {
  if (qbankDetail.value?.price === 0) return 'free'
  if (qbankDetail.value?.isPurchased) return 'purchased'
  return accessData.value?.accessType || 'free'
})

/* ==================== 方法定义 ==================== */

/**
 * 返回列表
 */
const goBack = () => {
  router.push('/qbank')
}

/**
 * 购买题库
 */
const handleBuy = () => {
  if (!qbankDetail.value) return
  router.push(`/order/pay?qbankId=${qbankDetail.value.id}`)
}

/**
 * 开始练习
 */
const handlePractice = () => {
  if (!qbankDetail.value) return

  if (!hasAccess.value && qbankDetail.value.price > 0) {
    message.warning('请先购买题库')
    return
  }

  router.push(`/practice/${qbankDetail.value.id}`)
}

/**
 * 章节练习
 */
const handleChapterPractice = (chapter: ChapterVO) => {
  if (!qbankDetail.value) return

  if (!hasAccess.value && qbankDetail.value.price > 0) {
    message.warning('请先购买题库')
    return
  }

  router.push(`/practice/${qbankDetail.value.id}?chapterId=${chapter.id}`)
}

/**
 * 格式化价格
 */
const formatPrice = (price: number) => {
  return (price / 100).toFixed(2)
}

/**
 * 获取难度标签类型
 */
const getDifficultyType = (difficulty?: number) => {
  if (!difficulty) return 'info'
  if (difficulty === 1) return 'success'
  if (difficulty === 2) return 'warning'
  return 'danger'
}

/* ==================== 错误处理 ==================== */

if (detailError.value) {
  console.error('加载题库详情失败:', detailError.value)
  message.error('加载题库详情失败')
}

/* ==================== SEO 结构化数据 ==================== */

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        if (!qbankDetail.value) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: qbankDetail.value.name,
          description: qbankDetail.value.description,
          image: qbankDetail.value.coverImage,
          offers: {
            '@type': 'Offer',
            price: formatPrice(qbankDetail.value.price),
            priceCurrency: 'CNY',
            availability: qbankDetail.value.status === 1 ? 'InStock' : 'OutOfStock',
          },
          aggregateRating: qbankDetail.value.rating ? {
            '@type': 'AggregateRating',
            ratingValue: qbankDetail.value.rating,
            reviewCount: qbankDetail.value.salesCount || 0,
          } : undefined,
        })
      }),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg)]">
    <!-- 顶部导航 -->
    <Navbar/>

    <!-- 页面内容 -->
    <div v-loading="loading" class="container mx-auto px-4 py-6">
      <!-- 返回按钮 -->
      <div class="mb-4">
        <el-button link @click="goBack">
          <Icon name="ep:arrow-left" class="mr-1"/>
          返回题库列表
        </el-button>
      </div>

      <template v-if="qbankDetail">
        <!-- 题库信息卡片 -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex gap-6">
            <!-- 封面图 -->
            <div class="w-64 h-48 shrink-0 rounded-lg overflow-hidden bg-gray-200">
              <img
                  :src="qbankDetail.coverImage || '/images/default-qbank.jpg'"
                  :alt="qbankDetail.name"
                  class="w-full h-full object-cover"
              >
            </div>

            <!-- 信息区域 -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h1 class="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                    {{ qbankDetail.name }}
                  </h1>
                  <div class="flex items-center gap-3">
                    <el-tag v-if="qbankDetail.categoryName" size="small">{{ qbankDetail.categoryName }}</el-tag>
                    <el-tag :type="getDifficultyType(qbankDetail.difficulty)" size="small">
                      {{ qbankDetail.difficultyName || '未知难度' }}
                    </el-tag>
                    <span v-if="qbankDetail.questionCount" class="text-[var(--color-text-secondary)] text-sm">
                      <Icon name="ep:document" class="mr-1"/>
                      {{ qbankDetail.questionCount }} 题
                    </span>
                  </div>
                </div>

                <!-- 价格区域 -->
                <div class="text-right">
                  <div v-if="qbankDetail.price > 0" class="mb-2">
                    <span class="text-3xl font-bold text-[var(--color-danger)]">
                      ¥{{ formatPrice(qbankDetail.price) }}
                    </span>
                    <span v-if="qbankDetail.originalPrice && qbankDetail.originalPrice > qbankDetail.price"
                          class="text-[var(--color-text-disabled)] line-through ml-2">
                      ¥{{ formatPrice(qbankDetail.originalPrice) }}
                    </span>
                  </div>
                  <div v-else class="text-3xl font-bold text-[var(--color-success)] mb-2">
                    免费
                  </div>
                  <div v-if="qbankDetail.salesCount" class="text-[var(--color-text-secondary)] text-sm">
                    已有 {{ qbankDetail.salesCount }} 人购买
                  </div>
                </div>
              </div>

              <!-- 描述 -->
              <p class="text-[var(--color-text-secondary)] mb-6 line-clamp-3">
                {{ qbankDetail.description || '暂无描述' }}
              </p>

              <!-- 操作按钮 -->
              <div class="flex gap-4">
                <template v-if="hasAccess || qbankDetail.price === 0">
                  <el-button type="primary" size="large" @click="handlePractice">
                    <Icon name="ep:edit" class="mr-1"/>
                    开始练习
                  </el-button>
                </template>
                <template v-else>
                  <el-button type="primary" size="large" @click="handleBuy">
                    <Icon name="ep:shopping-cart" class="mr-1"/>
                    立即购买
                  </el-button>
                  <el-button size="large" @click="handlePractice">
                    <Icon name="ep:view" class="mr-1"/>
                    试看
                  </el-button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 标签页内容 -->
        <el-tabs v-model="activeTab" class="bg-white rounded-lg shadow p-6">
          <!-- 章节列表 -->
          <el-tab-pane label="章节列表" name="chapters">
            <div v-if="qbankDetail.chapters && qbankDetail.chapters.length > 0">
              <el-collapse>
                <el-collapse-item
                    v-for="chapter in qbankDetail.chapters"
                    :key="chapter.id"
                    :title="chapter.name"
                >
                  <div class="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded">
                    <div class="flex items-center gap-4">
                      <span class="text-[var(--color-text-primary)]">{{ chapter.name }}</span>
                      <span class="text-[var(--color-text-secondary)] text-sm">
                        {{ chapter.total || 0 }} 题
                      </span>
                    </div>
                    <el-button
                        type="primary"
                        link
                        @click="handleChapterPractice(chapter)"
                    >
                      开始练习
                    </el-button>
                  </div>

                  <!-- 小节列表 -->
                  <div v-if="chapter.sectionList && chapter.sectionList.length > 0" class="ml-6 mt-2">
                    <div
                        v-for="section in chapter.sectionList"
                        :key="section.id"
                        class="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded"
                    >
                      <div class="flex items-center gap-4">
                        <span class="text-[var(--color-text-secondary)]">{{ section.name }}</span>
                        <span class="text-[var(--color-text-secondary)] text-sm">
                          {{ section.total || 0 }} 题
                        </span>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <el-empty v-else description="暂无章节数据"/>
          </el-tab-pane>

          <!-- 题库介绍 -->
          <el-tab-pane label="题库介绍" name="intro">
            <div class="prose max-w-none">
              <p class="text-[var(--color-text-primary)] leading-relaxed">
                {{ qbankDetail.description || '暂无介绍' }}
              </p>
            </div>
          </el-tab-pane>

          <!-- 评价 -->
          <el-tab-pane label="用户评价" name="reviews">
            <el-empty description="暂无评价"/>
          </el-tab-pane>
        </el-tabs>
      </template>

      <!-- 错误状态 -->
      <el-empty v-else-if="!loading" description="题库不存在或已下架">
        <el-button type="primary" @click="goBack">返回列表</el-button>
      </el-empty>
    </div>

    <!-- 底部 -->
    <Footer/>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
