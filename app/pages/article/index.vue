<script setup lang="ts">
import {ArticleApi} from '~/api/article'
import type {ArticleVO} from '~/types/article'

import {DocumentApi} from "~/api/document";
import IndustryGuide from '~/components/IndustryGuide.vue'
import {formatCount} from "~/utils";
import {useIndustryStore} from "~/stores/industry";

definePageMeta({
  layout: 'default'
})

useHead({
  title: '资讯中心'
})

const route = useRoute()
const authStore = useAuthStore()
const userStore = useUserStore()
const {user} = storeToRefs(userStore)

/* ==================== 行业偏好管理（使用 Pinia Store）==================== */
const industryStore = useIndustryStore()
const {currentIndustry, currentExam, showGuide} = storeToRefs(industryStore)
const {initPreference, selectExam, openGuide} = industryStore
const tagId = Number(route.query.tag) || 0
const categoryId = Number(route.query.category) || 0

/* 获取排名样式 */
const getRankStyle = (index: number) => {
  if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
  if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
  if (index === 2) return 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
  return 'bg-gray-100 text-gray-500'
}

/* 考试类型筛选 */
const activeTag = ref<number>(tagId)

const {data: tags} = await useAsyncData(
    async () => {
      const data = await DocumentApi.getInfoTags("news")
      return [{id: 0, word: '全部'}, ...data]
    }
)
/* 列表数据 */
const loading = ref(false)
const articleList = ref<ArticleVO[]>([])
const total = ref(0)


/* 查询参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  catalogId: categoryId === 0 ? undefined : categoryId,
  tags: tagId === 0 ? [] : [tagId],
  keyword: undefined as string | undefined
})

/* 获取热门资讯 */
const {data: hotArticles} = await useAsyncData(
    async () => {
      const data = await ArticleApi.getArticleList({
        ...queryParams,
        pageSize: 5,
        hasAttr: ['推荐'],
      })
      return data.list?.slice(0, 5) || []
    }
)
const getHotsArticleList = async () => {
  const data = await ArticleApi.getArticleList({
    ...queryParams,
    pageSize: 5,
    hasAttr: ['推荐'],
  })
  hotArticles.value = data.list?.slice(0, 5) || []
}
/* 获取资讯列表 */
const fetchArticleList = async () => {
  loading.value = true
  try {
    const data = await ArticleApi.getArticleList(queryParams)
    articleList.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('获取资讯列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleTagChange = (tagId: number) => {
  activeTag.value = tagId
  queryParams.tags = tagId === 0 ? [] : [tagId]
  queryParams.pageNo = 1
  fetchArticleList()
}

/* 搜索 */
const handleSearch = () => {
  queryParams.pageNo = 1
  fetchArticleList()
}

/* 分页 */
const handlePageChange = (page: number) => {
  queryParams.pageNo = page
  fetchArticleList()
}

/* 查看详情 */
const handleViewDetail = (id: number) => {
  navigateTo(`/article/${id}`)
}

/* 获取当前考试名称 */
const currentExamName = computed(() => {
  return currentExam.value?.name || '请选择考试'
})

/* 处理考试选择 */
const handleExamSelect = (industry: any, exam: any) => {
  selectExam(industry, exam)
  queryParams.catalogId = exam.id
  queryParams.pageNo = 1
  fetchArticleList()
}


const isClientReady = ref(false)

/* 初始化 */
onMounted(() => {
  isClientReady.value = true

  /* 初始化考试偏好 */
  const hasPreference = initPreference()

  if (hasPreference && currentIndustry.value && currentExam.value) {
    /* 已选择过考试，使用该考试 */
    queryParams.catalogId = currentExam.value.id
    fetchArticleList()
  } else {
    openGuide()
  }
  getHotsArticleList()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 页面标题区 - 活泼渐变背景 -->
    <div class="relative overflow-hidden">
      <!-- 动态渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
      <!-- 装饰图案 - 几何图形 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
        <div class="absolute bottom-10 left-1/3 w-24 h-24 bg-indigo-300/20 rounded-full blur-2xl"/>
        <div class="absolute top-1/2 right-10 w-16 h-16 bg-pink-300/20 rounded-full blur-xl"/>
        <!-- 装饰线条 -->
        <div class="absolute top-0 left-0 w-full h-full">
          <div
              class="absolute top-20 left-20 w-20 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-45"/>
          <div
              class="absolute top-40 right-40 w-32 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -rotate-12"/>
        </div>
      </div>
      <!-- 内容 -->
      <div class="relative container mx-auto px-4 py-12 md:py-16">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <Icon name="mdi:newspaper-variant-multiple-outline" class="text-white text-lg"/>
            <span class="text-white/90 text-sm font-medium">实时更新</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">资讯中心</h1>
          <p class="text-white/80 text-base md:text-lg max-w-2xl mx-auto">获取最新考试资讯、政策解读和备考指南，掌握第一手考试动态</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- 行业选择引导弹窗 -->
      <IndustryGuide
        v-model="showGuide"
        @select="handleExamSelect"
      />

      <!-- 搜索和筛选区域 - 彩色卡片 -->
      <div class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 overflow-hidden mb-8 border border-blue-100">
        <!-- 分类标签栏 - 多彩标签 -->
        <div class="px-4 md:px-6 py-5 border-b border-slate-100 space-y-4">
          <!-- 当前选择 - 显示行业和考试 + 切换按钮 -->
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-slate-500 shrink-0">当前选择</span>
            <div class="flex items-center gap-2">
              <span class="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                <template v-if="isClientReady">
                  {{ currentIndustry?.name }} / {{ currentExamName }}
                </template>
                <template v-else>
                  加载中...
                </template>
              </span>
              <button
                class="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200 flex items-center gap-1"
                @click="openGuide"
              >
                <Icon name="ep:arrow-right" class="text-xs"/>
                切换考试
              </button>
            </div>
          </div>

          <!-- 分类 -->
          <div class="flex items-start gap-3">
            <span class="text-sm font-medium text-slate-500 pt-1.5 shrink-0 w-12">分类</span>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                  v-for="tag in tags"
                  :key="tag.id"
                  :class="activeTag === tag.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    "
                  class="px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200"
                  @click="handleTagChange(tag.id)"
              >
                {{ tag.word }}
              </button>
            </div>
          </div>
        </div>

        <!-- 搜索框 - 彩色装饰 -->
        <div class="px-4 md:px-6 py-4 bg-gradient-to-r from-blue-50/50 via-cyan-50/50 to-blue-50/50">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <div
                  class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Icon name="ep:document" class="text-white text-sm"/>
              </div>
              <span>共 <span class="text-blue-600 font-bold text-lg">{{ total }}</span> 篇资讯</span>
            </div>
            <div class="flex items-center gap-3">
              <el-input
                  v-model="queryParams.keyword"
                  placeholder="搜索资讯关键词..."
                  class="w-full md:w-72"
                  clearable
                  @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <Icon name="ep:search" class="text-slate-400"/>
                </template>
              </el-input>
              <button
                  class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
                  @click="handleSearch"
              >
                <Icon name="ep:search" class="text-sm"/>
                <span class="w-10">搜索</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 左右分栏布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧主要内容区 - 资讯列表 -->
        <div class="lg:col-span-3">
          <div v-loading="loading" class="space-y-5">
            <!-- 空状态 -->
            <div v-if="articleList.length === 0 && !loading"
                 class="py-16 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
              <div class="w-32 h-32 mb-4 text-slate-300">
                <Icon name="ep:document" class="w-full h-full"/>
              </div>
              <p class="text-slate-500 text-base">暂无资讯</p>
            </div>

            <!-- 资讯卡片列表 -->
            <div class="space-y-5">
              <div
                  v-for="(article, index) in articleList"
                  :key="article.id"
                  class="group bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 border-2 border-transparent hover:border-blue-200 hover:bg-gradient-to-br from-blue-50 to-cyan-50"
                  :style="{ animationDelay: `${index * 50}ms` }"
                  @click="handleViewDetail(article.id)"
              >
                <!-- 桌面端布局：横向 -->
                <div class="hidden lg:flex">
                  <!-- 封面图片 - 彩色遮罩 -->
                  <div class="flex-shrink-0 w-52 h-36 relative overflow-hidden">
                    <img
                        v-if="article.logo"
                        :src="article.logo"
                        :alt="article.title"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    >
                    <div
                        v-else
                         class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <Icon name="ep:picture" class="text-4xl text-slate-300"/>
                    </div>
                    <!-- 彩色分类标签 -->
<!--                    <div v-if="article.catalogName" class="absolute top-3 left-3">-->
<!--                    <span-->
<!--                        class="bg-gradient-to-r from-violet-500 to-purple-400 text-white backdrop-blur-sm px-3 py-1.5 text-xs font-medium rounded-full shadow-lg">-->
<!--                      {{ article.catalogName }}-->
<!--                    </span>-->
<!--                    </div>-->
                    <!-- 装饰角标 -->
                    <div class="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-white/20 to-transparent"/>
                  </div>

                  <!-- 内容区 -->
                  <div class="flex-1 p-5 flex flex-col">
                    <h3 class="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                      {{ article.title }}
                    </h3>
                    <p class="text-sm text-slate-500 mb-4 line-clamp-2 flex-1 leading-relaxed">
                      {{ article.summary || '暂无摘要' }}
                    </p>
                    <div class="flex items-center justify-between">
                      <!-- 彩色标签 -->
                      <div class="flex items-center gap-2">
                        <template v-if="article.tags">
                        <span
                            v-for="(tag, tagIndex) in article.tags.slice(0, 2)"
                            :key="tag.id"
                            class="px-2.5 py-1 text-xs rounded-md font-medium"
                            :class="[
                            tagIndex === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          ]"
                        >
                          {{ tag.word }}
                        </span>
                        </template>
                      </div>

                      <!-- 浏览量和时间 -->
                      <div class="flex items-center gap-4 text-xs text-slate-400">
                      <span class="flex items-center gap-1.5">
                        <Icon name="ep:view" class="text-blue-400"/>
                        {{ formatCount(article.viewCount || 0) }}
                      </span>
                        <span class="flex items-center gap-1.5">
                        <Icon name="ep:clock" class="text-cyan-400"/>
                        {{ article.publishDate ? formatDate(article.publishDate) : '--' }}
                      </span>
                      </div>
                    </div>
                  </div>

                  <!-- 右侧箭头 - 彩色 -->
                  <div
                      class="w-14 flex items-center justify-center border-l border-slate-100 bg-gradient-to-b from-transparent via-slate-50 to-transparent">
                    <div
                        class="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-500 flex items-center justify-center transition-all duration-300">
                      <Icon name="ep:arrow-right"
                            class="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300"/>
                    </div>
                  </div>
                </div>

                <!-- 移动端/平板布局：纵向 -->
                <div class="flex lg:hidden flex-col">
                  <!-- 封面图片 -->
                  <div class="w-full h-44 relative overflow-hidden">
                    <img
                        v-if="article.logo"
                        :src="article.logo"
                        :alt="article.title"
                        class="w-full h-full object-cover"
                    >
                    <div v-else
                         class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <Icon name="ep:picture" class="text-5xl text-slate-300"/>
                    </div>
                    <!-- 彩色分类标签 -->
<!--                    <div v-if="article.catalogName" class="absolute top-3 left-3">-->
<!--                    <span-->
<!--                        :class="`${getCategoryColor(article.categoryId || 0)?.bg} text-white backdrop-blur-sm px-3 py-1.5 text-xs font-medium rounded-full shadow-lg`">-->
<!--                      {{ article.catalogName }}-->
<!--                    </span>-->
<!--                    </div>-->
                  </div>

                  <!-- 内容区 -->
                  <div class="p-4">
                    <h3 class="text-base font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {{ article.title }}
                    </h3>
                    <p class="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                      {{ article.summary || '暂无摘要' }}
                    </p>
                    <div class="flex items-center gap-2 mb-3">
                      <template v-if="article.tags">
                      <span
                          v-for="(tag, tagIndex) in article.tags.slice(0, 2)"
                          :key="tag.id"
                          class="px-2 py-0.5 text-xs rounded-md font-medium"
                          :class="[
                          tagIndex === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        ]"
                      >
                        {{ tag.word }}
                      </span>
                      </template>
                    </div>
                    <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div class="flex items-center gap-3 text-xs text-slate-400">
                      <span class="flex items-center gap-1">
                        <Icon name="ep:view" class="text-blue-400"/>
                        {{ formatCount(article.viewCount || 0) }}
                      </span>
                        <span class="flex items-center gap-1">
                        <Icon name="ep:clock" class="text-cyan-400"/>
                        {{ article.publishDate ? formatDate(article.publishDate) : '' }}
                      </span>
                      </div>
                      <div class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon name="ep:arrow-right" class="text-blue-500 text-xs"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 - 彩色 -->
          <div v-if="total > 0" class="flex items-center justify-center mt-10">
            <el-pagination
                v-model:current-page="queryParams.pageNo"
                :page-size="queryParams.pageSize"
                :total="total"
                layout="prev, pager, next"
                prev-text="上一页"
                next-text="下一页"
                class="custom-pagination"
                @change="handlePageChange"
            />
          </div>
        </div>

        <!-- 右侧侧边栏 - PC端显示，H5隐藏 -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
          <!-- 用户信息卡片 -->
          <ClientOnly>
            <div v-if="authStore.isLogin"
                 class="bg-white rounded-xl shadow-lg shadow-blue-100/50 border border-blue-100 overflow-hidden">
              <!-- 头部渐变 -->
              <div class="h-20 bg-gradient-to-r from-blue-500 to-cyan-500 relative">
                <div class="absolute -bottom-8 left-4">
                  <el-avatar :size="64" :src="user?.avatar" class="border-4 border-white shadow-md"/>
                </div>
              </div>
              <!-- 用户信息 -->
              <div class="pt-10 pb-4 px-4">
                <div class="text-center mb-4">
                  <h3 class="font-bold text-slate-800 text-lg">{{ user?.nickname || '用户' }}</h3>
                  <p class="text-sm text-slate-500 mt-1">{{ user?.level?.name || '普通会员' }}</p>
                </div>
                <!-- 统计数据 -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 text-center">
                    <div class="text-xl font-bold text-blue-600">{{ user?.point || 0 }}</div>
                    <div class="text-xs text-slate-500 mt-0.5">我的积分</div>
                  </div>
                  <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 text-center">
                    <div class="text-xl font-bold text-orange-500">{{ user?.experience || 0 }}</div>
                    <div class="text-xs text-slate-500 mt-0.5">我的经验</div>
                  </div>
                </div>
                <!-- 快捷入口 -->
                <div class="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                  <a href="/account/profile"
                     class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon name="ep:user-filled" class="text-xl text-blue-500"/>
                    </div>
                    <span class="text-xs text-slate-600">个人中心</span>
                  </a>
                  <a href="/account/favorites"
                     class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-yellow-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Icon name="ep:star-filled" class="text-xl text-yellow-500"/>
                    </div>
                    <span class="text-xs text-slate-600">我的收藏</span>
                  </a>
                  <a href="/study/practice/daily"
                     class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-green-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Icon name="ep:calendar" class="text-xl text-green-500"/>
                    </div>
                    <span class="text-xs text-slate-600">每日一练</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- 未登录状态 -->
            <div v-else class="bg-white rounded-xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Icon name="ep:user" class="text-3xl text-blue-500"/>
                </div>
                <h3 class="font-bold text-slate-800 mb-2">欢迎来到学次元</h3>
                <p class="text-sm text-slate-500 mb-4">登录后解锁更多学习功能</p>
                <button
                    class="w-full py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/30"
                    @click="useModal().openModal('login')"
                >
                  立即登录
                </button>
              </div>
              <div class="mt-4 pt-4 border-t border-slate-100">
                <div class="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div class="text-lg font-bold text-blue-600">1000+</div>
                    <div class="text-xs text-slate-500">精品题库</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-cyan-600">500+</div>
                    <div class="text-xs text-slate-500">学习资料</div>
                  </div>
                </div>
              </div>
            </div>
          </ClientOnly>

          <!-- 每日一练卡片 -->
          <div class="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-200 overflow-hidden text-white">
            <div class="p-5">
              <div class="flex items-center gap-2 mb-3">
                <Icon name="ep:calendar" class="text-xl"/>
                <h3 class="font-bold text-lg">每日一练</h3>
              </div>
              <p class="text-white/90 text-sm mb-4">坚持每天练习，提升考试通过率</p>
              <div class="flex items-center justify-between mb-4">
                <div class="text-center">
                  <div class="text-2xl font-bold">{{ new Date().getDate() }}</div>
                  <div class="text-xs text-white/80">{{ new Date().getMonth() + 1 }}月</div>
                </div>
                <div class="flex-1 mx-4">
                  <div class="text-sm mb-1">今日练习进度</div>
                  <div class="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div class="h-full bg-white rounded-full" style="width: 60%"></div>
                  </div>
                </div>
              </div>
              <a href="/study/practice/daily"
                 class="block w-full py-2.5 bg-white text-emerald-600 text-center rounded-lg font-medium hover:bg-white/90 transition-colors shadow-lg">
                开始今日练习
              </a>
            </div>
          </div>

          <!-- 热门资讯排行榜 -->
          <div class="bg-white rounded-xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
            <div class="flex items-center gap-2 mb-4">
              <Icon name="mdi:fire" class="text-xl text-red-500"/>
              <h3 class="font-bold text-slate-800">热门资讯</h3>
            </div>
            <div class="space-y-4">
              <div
                  v-for="(article, index) in hotArticles"
                  :key="article.id"
                  class="flex items-start gap-3 cursor-pointer group"
                  @click="handleViewDetail(article.id)"
              >
                <div
                    :class="getRankStyle(index)"
                    class="w-6 h-6 rounded flex items-center justify-center text-sm font-bold shrink-0"
                >
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {{ article.title }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习工具卡片 -->
          <div class="bg-white rounded-xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
            <h3 class="font-bold text-slate-800 mb-4">学习工具</h3>
            <div class="grid grid-cols-2 gap-3">
              <a href="/exam/smart" class="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors">
                <Icon name="ep:edit" class="text-2xl text-purple-500"/>
                <span class="text-xs text-slate-600">智能组卷</span>
              </a>
              <a href="/qBank" class="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors">
                <Icon name="ep:collection" class="text-2xl text-blue-500"/>
                <span class="text-xs text-slate-600">题库练习</span>
              </a>
              <a href="/mistake" class="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-colors">
                <Icon name="ep:close" class="text-2xl text-red-500"/>
                <span class="text-xs text-slate-600">错题本</span>
              </a>
              <a href="/note" class="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors">
                <Icon name="ep:notebook" class="text-2xl text-green-500"/>
                <span class="text-xs text-slate-600">学习笔记</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义分页样式 - 彩色 */
:deep(.custom-pagination) {
  --el-pagination-hover-color: #3b82f6;
  --el-pagination-button-color: #64748b;
}

:deep(.custom-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  border: none;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

:deep(.custom-pagination .el-pager li:hover) {
  color: #3b82f6;
}

:deep(.custom-pagination .btn-prev),
:deep(.custom-pagination .btn-next) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
}

:deep(.custom-pagination .btn-prev:hover),
:deep(.custom-pagination .btn-next:hover) {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* 标题截断 */
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

/* 卡片入场动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white.rounded-xl {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}
</style>
