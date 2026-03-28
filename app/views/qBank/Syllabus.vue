<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div v-loading="loading" element-loading-text="加载大纲中...">
      <div v-if="syllabus" class="flex flex-col gap-5">
        <!-- 整体用el-card包裹 -->
        <el-card class="border border-gray-200 shadow-sm">
          <!-- 页面标题区 -->
          <div class="flex justify-between">
            <div class="p-6 border-b border-gray-100">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ syllabus.title }}</h1>
              <p class="text-gray-500 mt-1">更新时间：{{ formatDate(syllabus.publishDate, 'YYYY年MM月DD日') }}</p>
            </div>
            <el-button
                class="flex items-center bg-blue-400  text-white px-3 py-1 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
                @click="navigateTo(`/t/${qPackage.series}`)"
            >
              <Icon name="icon-park-outline:return" class="mr-1.5" />
              返回
            </el-button>
          </div>


          <!-- 主要内容区 -->
          <div class="article-container p-6" v-html="syllabus.contentHtml" />
        </el-card>

        <el-card v-if="syllabusList.length > 1">
          <!-- 历年考试大纲版本 -->
          <div class="border-t border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">历年考试大纲版本</h2>
            <p class="text-gray-500 mb-4">提供过往考试大纲供参考对比</p>

            <div class="divide-y divide-gray-100">
              <!-- 2023年版本 -->
              <div
                  v-for="item in syllabusList" :key="item.id"
                  class="p-4 hover:bg-gray-50 transition-colors">
                <div class="flex flex-wrap justify-between items-center">
                  <button
                      class="font-medium text-gray-800 hover:text-indigo-600 transition-colors"
                      @click="handleHistory(item.id)">
                    {{item.title}}
                  </button>
                  <span class="text-gray-500 text-sm">发布时间：{{ formatDate(item.publishDate, 'YYYY年MM月DD日') }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div v-else class="flex flex-col justify-center items-center">
        <el-empty description="暂无大纲信息" />
        <el-button
            class="flex items-center bg-blue-400  text-white px-3 py-1 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
            @click="navigateTo(`/t/${qPackage.series}`)"
        >
          <Icon name="icon-park-outline:return" class="mr-1.5" />
          返回
        </el-button>
      </div>
    </div>
  <UsageGuideModal ref="dialogRef" :title="dialogTitle" custom="article-container" />

</template>

<script setup lang="ts">
import { formatDate } from '@/utils/formatTime.ts'
import { ArticleApi } from '~/api/article'
import type { SyllabusVO } from '~/types/qBank'

const message = useMessage()
const packageStore = usePackageStore()
const {qPackage} = storeToRefs(packageStore)


const param = {
  tags: 'ksdg',
  catalogId: qPackage.value?.relationCategoryId,
  sort: 'Recent',
  contentType: 'article',
}

const loading = ref(false)
const {data: syllabus} = await ArticleApi.getContentInfo(param, true)
const syllabusList = ref<SyllabusVO[]>([])

useHead({
  title: `考试大纲-${qPackage.value.title}`,
  meta: [
    { name: 'keywords', content: syllabus.value?.seoKeywords || qPackage.value?.title },
    { name: 'description', content: syllabus.value?.seoDescription || qPackage.value?.description },
    { name: 'author', content: '好游科技' }
  ],
})


const getSyllabusList = async () => {
  if(!qPackage.value.relationCategoryId || !param.catalogId) return
  try {
    syllabusList.value = await ArticleApi.getContentList(param)
  } catch (err) {
    console.log(err)
  }
}

const dialogRef = ref()
const dialogTitle = ref('')
const handleHistory = async (id: number) => {
  const data = await ArticleApi.getArticleDetail(id)
  if(!data.contentHtml) {
    message.error('该文章内容为空')
    return
  }
  dialogTitle.value = data.title
  dialogRef.value.open(data.contentHtml)
}

onMounted(async () => {
  await Promise.all([
      // getSyllabusInfo(),
    getSyllabusList()])
})

</script>
