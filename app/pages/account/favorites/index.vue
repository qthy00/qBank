<script setup lang="ts">
import { getFavoriteTools } from '@/api/user'
import { getQuestionFavorites, removeQuestionFavorite } from '@/api/question/favorite'
import type { ToolDetailVO } from '@/types/tools'
import type { QuestionFavoriteVO, QuestionFavoritePageVO } from '@/api/question/favorite'

definePageMeta({
  layout: 'member'
})
useHead({
  title: '我的收藏'
})

const message = useMessage()
const authStore = useAuthStore()
const { isLogin } = storeToRefs(authStore)

/* 收藏类型选项卡 */
const activeTab = ref<'tools' | 'questions'>('tools')

/* 工具收藏 */
const tools = ref<ToolDetailVO[]>([])
const toolsLoading = ref(false)
const toolsTotal = ref(0)
const toolsQuery = reactive({ contentType: 'tools' })

/* 题目收藏 */
const questions = ref<QuestionFavoriteVO[]>([])
const questionsLoading = ref(false)
const questionsTotal = ref(0)
const questionsQuery = reactive({ page: 1, pageSize: 10 })

/* 加载工具收藏 */
const loadTools = async () => {
  if (!isLogin.value) return
  toolsLoading.value = true
  try {
    const data = await getFavoriteTools(toolsQuery)
    if (data) {
      toolsTotal.value = data.total
      tools.value = data.list
    }
  } catch (error) {
    message.error('加载工具收藏失败')
  } finally {
    toolsLoading.value = false
  }
}

/* 加载题目收藏 */
const loadQuestions = async () => {
  if (!isLogin.value) return
  questionsLoading.value = true
  try {
    const data = await getQuestionFavorites(questionsQuery)
    if (data) {
      questionsTotal.value = data.total
      questions.value = data.list
    }
  } catch (error) {
    message.error('加载题目收藏失败')
  } finally {
    questionsLoading.value = false
  }
}

const handleToolClick = (tool: ToolDetailVO) => {
  navigateTo(`/t/${tool.series}`)
}

const handleQuestionClick = (item: QuestionFavoriteVO) => {
  navigateTo(`/qbank/${item.qbankId}?questionId=${item.question.id}`)
}

const handleRemoveQuestion = async (item: QuestionFavoriteVO) => {
  try {
    await message.confirm('确定取消收藏该题目？', '提示')
    await removeQuestionFavorite(item.question.id)
    message.success('取消收藏成功')
    loadQuestions()
  } catch (e) {
    /* 用户取消或操作失败 */
  }
}

/* 选项卡切换 */
watch(activeTab, (val) => {
  if (val === 'tools' && tools.value.length === 0) {
    loadTools()
  } else if (val === 'questions' && questions.value.length === 0) {
    loadQuestions()
  }
})

onMounted(() => {
  loadTools()
})
</script>

<template>
  <el-card class="ml-3" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <CardTitle title="我的收藏" />
        <!-- 类型选项卡 -->
        <el-radio-group v-model="activeTab">
          <el-radio-button label="tools">工具</el-radio-button>
          <el-radio-button label="questions">题目</el-radio-button>
        </el-radio-group>
      </div>
    </template>

    <!-- 工具收藏 -->
    <div v-if="activeTab === 'tools'" class="p-6 bg-white rounded-lg shadow-sm min-h-[400px]">
      <el-empty v-if="!toolsLoading && tools.length === 0" description="暂无收藏的工具" />
      <el-skeleton v-else-if="toolsLoading" :rows="5" animated />
      <div
        v-else
        class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <div
          v-for="tool in tools"
          :key="tool.id"
          class="tool-card cursor-pointer border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow group overflow-hidden"
          @click="handleToolClick(tool)"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <template v-if="tool.logo">
                <img :src="tool.logo" alt="logo" class="w-12 h-12 object-cover" >
              </template>
              <template v-else>
                <Icon :name="tool.icon" class="text-xl text-blue-600 mx-2.5" />
              </template>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-medium text-gray-800 group-hover:text-sky-600 text-nowrap">{{ tool.title }}</h3>
              <p class="text-xs text-gray-500 truncate max-w-full text-nowrap">{{ tool.description }}</p>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span>使用量：{{ tool.usageCount }}</span>
            <span>评分：{{ tool.rating ? (tool.rating / 10).toFixed(1) : '0.0' }}</span>
          </div>
        </div>
      </div>
      <div v-if="!toolsLoading && tools.length >= toolsTotal && tools.length > 0" class="text-center my-4 text-gray-400">
        没有更多收藏了
      </div>
    </div>

    <!-- 题目收藏 -->
    <div v-else class="p-6 bg-white rounded-lg shadow-sm min-h-[400px]">
      <el-empty v-if="!questionsLoading && questions.length === 0" description="暂无收藏的题目" />
      <el-skeleton v-else-if="questionsLoading" :rows="5" animated />
      <div v-else class="space-y-4">
        <div
          v-for="item in questions"
          :key="item.id"
          class="question-card border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1" @click="handleQuestionClick(item)">
              <!-- 题型标签 -->
              <div class="flex items-center gap-2 mb-2">
                <el-tag size="small" type="primary">{{ item.question.typeName }}</el-tag>
                <el-tag size="small" type="info">{{ item.qbankName }}</el-tag>
              </div>
              <!-- 题目内容 -->
              <div class="text-sm text-gray-800 mb-3" v-html="item.question.content"/>
              <!-- 选项预览 -->
              <div v-if="item.question.options" class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div v-for="(option, key) in item.question.options" :key="key" class="truncate">
                  {{ key }}. {{ option }}
                </div>
              </div>
            </div>
            <!-- 操作按钮 -->
            <div class="flex flex-col gap-2">
              <el-button
                type="primary"
                link
                size="small"
                @click.stop="handleQuestionClick(item)"
              >
                <Icon name="ep:view" />
                查看
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                @click.stop="handleRemoveQuestion(item)"
              >
                <Icon name="ep:delete" />
                取消收藏
              </el-button>
            </div>
          </div>
          <div class="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
            收藏时间：{{ item.createTime }}
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        v-if="questionsTotal > questionsQuery.pageSize"
        v-model:current-page="questionsQuery.page"
        v-model:page-size="questionsQuery.pageSize"
        :total="questionsTotal"
        layout="prev, pager, next"
        class="mt-4 justify-center"
        @change="loadQuestions"
      />
    </div>
  </el-card>
</template>

<style scoped>
.el-card {
  border: none !important;
}
:deep(.el-card__header) {
  border-bottom: none !important;
}

.tool-card {
  transition: all 0.3s ease;
}

.tool-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-4px);
}

.question-card {
  transition: all 0.3s ease;
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
