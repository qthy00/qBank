<script setup lang="ts">
import { type AffiliateToolVO, getAffiliateTool } from '~/api/user/affiliate.ts'
import { useAppStore } from '@/stores/modules/app.ts'
import { fen2yuan } from '~/utils/money.ts'
import share from '~/utils/share.ts'
import { showShareModal } from '@/hooks/web/useModal.ts'

const appStore = useAppStore()
const router = useRouter()

const total = ref(0)
const loading = ref(false)
const list = ref<AffiliateToolVO[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
})

const getList = async () => {
  loading.value = true
  try {
    const data = await getAffiliateTool(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const onShareGoods = (item: AffiliateToolVO) => {
  appStore.platform.share.forwardInfo = share.getShareInfo(
    {
      title: item.name,
      image: item.logo,
      desc: item.description,
      params: {
        page: 2,
        query: item.series,
      },
    },
    {
      type: 'tools', // 工具海报
      title: item.name, // 工具名称
      image: item.logo, // 工具主图
      price: fen2yuan(item.price), // 工具价格
      original_price: fen2yuan(item.originalPrice), // 工具原价
      bg: item.background, // 工具背景图
    },
  )
  showShareModal()
}

// const handleClick = (tool: ToolDetailVO) => {
//   router.push(`/t/${tool.series}`)
// }

onMounted(() => {
  getList()
})
</script>

<template>
  <div>
    <el-card class="ml-3" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <CardTitle title="推广工具">
            <template #right>
              <el-button type="warning" plain size="small" @click="router.back()">
                <Icon name="ep:back" class="mr-2" />
                返回
              </el-button>
            </template>
          </CardTitle>
        </div>
      </template>

      <div class="p-6 bg-white rounded-lg shadow-sm min-h-[400px]">
        <el-empty v-if="!loading && list.length == 0" description="暂无推广工具" />

        <el-skeleton v-else-if="loading" :rows="5" animated />

        <div
          v-else
          class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          :infinite-scroll-disabled="loading || list.length >= total"
          :infinite-scroll-distance="100"
        >
          <div
            v-for="tool in list"
            :key="tool.contentId"
            class="tool-card cursor-pointer border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow group overflow-hidden"
            @click="onShareGoods(tool)"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
              >
                <template v-if="tool.logo">
                  <img :src="tool.logo" alt="logo" class="w-12 h-12 object-cover" >
                </template>
                <template v-else>
                  <Icon :name="tool.icon" class="text-xl text-blue-600 mx-2.5" />
                </template>
              </div>

              <div class="flex-1 min-w-0">
                <h3
                  class="text-base font-medium text-gray-800 group-hover:text-sky-600 text-nowrap"
                >
                  {{ tool.name }}
                </h3>
                <p class="text-xs text-gray-500 truncate max-w-full text-nowrap">
                  {{ tool.description }}
                </p>
              </div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <div v-if="tool.brokeragePrice === undefined" class="commission-num">
                预计佣金：计算中
              </div>
              <div v-else class="commission-num">
                预计佣金：<span class="text-red-700">￥{{ fen2yuan(tool.brokeragePrice) }}</span>
              </div>
              <el-button size="small" type="primary" plain @click.stop="onShareGoods(tool)"
                >分享赚
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="loading" class="text-center my-4 text-gray-500">加载中...</div>
        <div v-else-if="list.length >= total" class="text-center my-4 text-gray-400">
          没有更多工具了
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped></style>
