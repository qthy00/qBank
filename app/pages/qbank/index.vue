<script setup lang="ts">
import {CmsCategoryApi} from "~/api/category";

/**
 * 题库封面页 - 左右分栏布局
 * 左侧：一级分类导航
 * 右侧：二级分类卡片网格
 */

/* ==================== 页面元数据 ==================== */

useHead({
  title: '智慧题库',
  meta: [
    { name: 'description', content: '海量题库资源，覆盖各类职业资格考试', tagPriority: 1 }
  ]
})

/* ==================== 状态定义 ==================== */
const authStore = useAuthStore()
const {openModal} = useModal()
const message = useMessage()
const {query} = useRoute()
/* 当前选中的一级分类 */
const activeCategoryId = ref<number | null>(Number(query.categoryId) || null)
const {isLogin} = storeToRefs(authStore)
console.log('类型', typeof activeCategoryId.value)

/* ==================== 数据获取 ==================== */

// const { data: categories, pending: loading, error } = await useAsyncData(
//     'qbank-cover-categories',
//     async () => {
//       const {mockCategoriesWithChildren} = await import('~/api/qbank/mock')
//       return mockCategoriesWithChildren as CategoryWithChildren[]
//     },
//     {
//       server: false,
//       default: () => [],
//     }
// )
const iconList = ["jz", "ck", "jr", "yl", "kg", "zige", "zc", "sh", "xl", "wy"]

const {data: categories, pending: loading, error} = await CmsCategoryApi.getCategoryList({
  isLast: true
})

/* ==================== 计算属性 ==================== */

/**
 * 当前选中的分类
 */
const activeCategory = computed(() => {
  if (!activeCategoryId.value) return null
  return categories.value?.find(c => c.id === activeCategoryId.value) || null
})

/**
 * 当前展示的子分类列表
 */
const displaySubCategories = computed(() => {
  if (!categories.value) return []

  if (activeCategory.value) {
    return findAllLastNodes(activeCategory.value.children, categories.value)
  }
  /* 未选择时展示所有子分类 */
  return findAllLastNodes(categories.value || [])
})

/* ==================== 方法定义 ==================== */

const handleCategoryChange = (categoryId: number | null) => {
  console.log('handleCategoryChange', categoryId)
  activeCategoryId.value = categoryId
}

const goToSubCategory = (categoryId: number) => {
  if (!isLogin.value) {
    openModal('login')
    return
  }

  navigateTo({
    path: `/qbank/${categoryId}`,
  })
}

// 递归遍历树形结构，找到所有 isLast 为 true 的叶子节点
const findAllLastNodes = (nodes, parentInfo = {}) => {
  // 存储最终找到的所有叶子节点
  let result = [];

  // 遍历当前层级的节点
  nodes.forEach((node, index) => {
    // 构建当前节点的父级信息（继承上层 + 补充当前层）
    const currentParentInfo = {
      // 继承祖辈的父级信息
      ...parentInfo,
      // 当前节点作为子节点的父级信息
      parentName: node.name,
      parentIcon: `hy-ico-${iconList[index]}`,
      parentId: node.id
  };

    // 判断当前节点是否是最底层节点（isLast 为 true）
    if (node.isLast === true) {
      // 如果是叶子节点，添加到结果中，并带上父级信息
      result.push({
        ...node,
        ...currentParentInfo
      });
    } else if (node.children && node.children.length > 0) {
      // 如果不是叶子节点但有子节点，递归遍历子节点
      // 将子节点遍历结果合并到总结果中
      result = result.concat(findAllLastNodes(node.children, currentParentInfo));
    }
  });

  return result;
};

/* ==================== 错误处理 ==================== */

if (error.value) {
  console.error('加载分类失败:', error.value)
  message.error('加载分类失败')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
    <!-- 菜单部分 -->
    <MainMenu/>
    <!-- Hero 区域 -->
    <div class="container relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"/>
        <div class="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"/>
      </div>

      <div class="relative container mx-auto px-4 py-12">
        <div class="text-center max-w-3xl mx-auto">
          <!-- 标题 -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-white text-sm font-medium mb-4">
            <Icon name="ep:collection" class="text-base"/>
            <span>专业题库平台</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            智慧题库
            <span class="text-[var(--color-primary)]">中心</span>
          </h1>
          <p class="text-lg text-gray-600 mb-8">
            海量题库资源，覆盖 <span class="font-semibold text-[var(--color-primary)]">{{ categories?.length || 0 }}</span> 大分类，
            精选题库，助力高效备考
          </p>
        </div>
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="container mt-4 mx-auto px-4 pb-16">
      <div class="flex gap-6">
        <!-- 左侧分类导航 -->
        <div class="w-72 shrink-0">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
            <!-- 标题 -->
            <div class="px-5 py-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900 flex items-center gap-2">
                <Icon name="ep:menu" class="text-[var(--color-primary)]"/>
                题库分类
              </h2>
            </div>

            <!-- 分类列表 -->
            <div class="p-3">
              <!-- 全部 -->
              <div
                  class="flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 mb-1"
                  :class="activeCategoryId === null
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white shadow-md shadow-[var(--color-primary)]/20'
                    : 'hover:bg-gray-50 text-gray-700'"
                  @click="handleCategoryChange(null)"
              >
                <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                    :class="activeCategoryId === null ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[var(--color-primary)]/10'"
                >
                  <Icon
                      name="ep:grid"
                      class="text-lg"
                      :class="activeCategoryId === null ? 'text-white' : 'text-black'"
                  />
                </div>
                <div class="flex-1">
                  <div class="font-medium">全部题库</div>
                </div>
                <Icon
                    name="ep:arrow-right-bold"
                    class="text-sm transition-opacity"
                    :class="activeCategoryId === null ? 'text-white opacity-100' : 'text-gray-300 opacity-0'"
                />
              </div>

              <!-- 分类项 -->
              <div
                  v-for="(cat, index) in categories"
                  :key="cat.id"
                  class="flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 mb-1 group"
                  :class="activeCategoryId === cat.id
                    ? 'bg-gradient-to-r from-[var(--color-btn-primary)] to-[var(--color-btn-hover-90)] text-white shadow-md shadow-[var(--color-primary)]/20'
                    : 'hover:bg-gray-50 text-gray-700'"
                  @click="handleCategoryChange(cat.id)"
              >
                <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                    :class="activeCategoryId === cat.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[var(--color-primary)]/10'"
                >
                  <i :class="`hy-ico-${iconList[index]}`" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">{{ cat.name }}</div>
                  <div
                      class="text-xs"
                      :class="activeCategoryId === cat.id ? 'text-white/70' : 'text-gray-400'"
                  >
                    {{ cat.children?.length || 0 }} 个子分类
                  </div>
                </div>
                <Icon
                    name="ep:arrow-right-bold"
                    class="text-sm transition-all"
                    :class="activeCategoryId === cat.id ? 'text-white opacity-100 translate-x-0' : 'text-gray-300 opacity-0 -translate-x-2'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="flex-1 min-w-0">
          <div v-loading="loading" class="min-h-[600px]">
            <template v-if="displaySubCategories.length > 0">
              <!-- 头部信息 -->
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <template v-if="activeCategory">
                      <Icon name="ep:moon-night" class="text-[var(--color-primary)]"/>
                      {{ activeCategory.name }}
                    </template>
                    <template v-else>
                      <Icon name="ep:grid" class="text-[var(--color-primary)]"/>
                      全部题库
                    </template>
                  </h2>
                  <p class="text-gray-500 mt-1">
                    共 {{ displaySubCategories.length }} 个子分类
                  </p>
                </div>

              </div>

              <!-- 二级分类卡片网格 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div
                    v-for="sub in displaySubCategories"
                    :key="sub.id"
                    class="group relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-[var(--color-primary)]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 cursor-pointer overflow-hidden"
                    :class="{ 'opacity-0': false }"
                    @click="goToSubCategory(sub.id)"
                >
                  <!-- 背景装饰 -->
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

<!--                  &lt;!&ndash; 图标 &ndash;&gt;-->
<!--                  <div class="relative mb-4">-->
<!--                    &lt;!&ndash; 数量徽章 &ndash;&gt;-->
<!--                    <div class="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">-->
<!--                      {{ sub.count || 0 }}-->
<!--                    </div>-->
<!--                  </div>-->

                  <!-- 内容 -->
                  <h3 class="font-bold text-gray-900 mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {{ sub.name }}
                  </h3>

                  <!-- 操作按钮 -->
                  <div class="mt-3 flex items-center justify-between">
                    <span class="text-xs text-gray-400 flex items-center gap-1">
                      <Icon name="ep:folder-opened" class="text-xs"/>
                      {{ sub.parentName || activeCategory?.name || '全部' }}
                    </span>
                    <div class="flex items-center text-[var(--color-primary)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      进入
                      <Icon name="ep:arrow-right" class="ml-1"/>
                    </div>
                  </div>

                  <!-- 悬停边框效果 -->
                  <div class="absolute inset-0 rounded-2xl border-2 border-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"/>
                </div>
              </div>

            </template>

            <!-- 空状态 -->
            <el-empty
                v-else
                description="暂无分类数据"
                class="py-20"
            >
              <el-button type="primary" @click="handleCategoryChange(null)">
                查看全部
              </el-button>
            </el-empty>
          </div>
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
</style>
