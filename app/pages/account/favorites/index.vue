<script setup lang="ts">
import { getFavoriteTools } from '@/api/user'
import type { ToolDetailVO } from '@/types/tools'

definePageMeta({
  layout: 'member'
})
useHead({
  title: '个人收藏'
})


const message = useMessage()
const authStore = useAuthStore()

const {isLogin} = storeToRefs(authStore)

const tools = ref<ToolDetailVO[]>([])
const loading = ref(false)
const total = ref(0)

const queryParams = reactive({
  // pageNo: 0,
  // pageSize: 24,
  contentType: 'tools'
})


const loadFavorites = async () => {
  if (!isLogin.value) return
  loading.value = true
  try {
    const data = await getFavoriteTools(queryParams)
    if(data) {
      total.value = data.total
      tools.value = data.list
    }
  } catch (error) {
    message.error('加载收藏列表失败')
  } finally {
    loading.value = false
  }
}

const handleClick = (tool: ToolDetailVO) => {
  navigateTo(`/t/${tool.series}`)
}
//
// const loadMoreTools = async () => {
//   if (loading.value || tools.value.length >= total.value) return
//
//   loading.value = true
//   queryParams.pageNo++
//   await loadFavorites()
//   loading.value = false
// }


onMounted(() => {
  // queryParams.pageNo = 1
  loadFavorites()
})
</script>

<template>
  <el-card class="ml-3" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <CardTitle title="我的收藏" />
      </div>
    </template>

    <div class="p-6 bg-white rounded-lg shadow-sm min-h-[400px]">

      <el-empty v-if="!loading && tools.length == 0" description="暂无收藏内容" />

      <el-skeleton v-else-if="loading" :rows="5" animated />

      <div
          v-else
          class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          :infinite-scroll-disabled="loading || tools.length >= total"
          :infinite-scroll-distance="100"
      >
        <div
            v-for="tool in tools"
            :key="tool.id"
            @click="handleClick(tool)"
            class="tool-card cursor-pointer border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow group overflow-hidden"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <template v-if="tool.logo">
                <img
                    :src="tool.logo"
                    alt="logo"
                    class="w-12 h-12 object-cover"
                />
              </template>
              <template v-else>
                <Icon :name="tool.icon" class="text-xl text-blue-600 mx-2.5" />
              </template>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-base font-medium text-gray-800 group-hover:text-sky-600 text-nowrap">
                {{ tool.title  }}
              </h3>
              <p class="text-xs text-gray-500 truncate max-w-full text-nowrap">{{ tool.description }}</p>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span>使用量：{{ tool.usageCount }}</span>
            <span>评分：{{ tool.rating ? (tool.rating / 10 ).toFixed(1) : '0.0' }}</span>
          </div>
        </div>
      </div>
      <div class="text-center my-4 text-gray-500" v-if="loading">加载中...</div>
      <div class="text-center my-4 text-gray-400" v-else-if="tools.length >= total">
        没有更多收藏了
      </div>
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
  box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-4px);
}
</style>
