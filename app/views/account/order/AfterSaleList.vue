<script setup lang="ts">
import AfterSaleDetail from '@/views/account/order/AfterSaleDetail.vue'
import { type AfterSale, getAfterSalePage } from '~/api/order'
import { formatDate } from '~/utils/formatTime.ts'
import { fen2yuan } from '~/utils/money.ts'
import {
  formatAfterSaleStatus,
  formatAfterSaleStatusDescription,
} from '@/views/account/order/order.ts'

defineOptions({ name: 'AfterSaleList' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const list = ref<AfterSale[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
})

const getList = async () => {
  loading.value = true
  try {
    const data = await getAfterSalePage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

// 弹窗相关
const detailRef = ref()
// 查看详情
const handleViewDetail = (row: any) => {
  detailRef.value!.open(row)
}

const cancelApply = (id: number) => {
  message.success('申请售后')
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div>
    <el-card class="ml-3" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <CardTitle title="售后管理" />
        </div>
      </template>

      <el-empty v-if="total === 0" description="暂无数据" />

      <!-- 订单列表 - 卡片式 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden p-4">
        <div v-loading="loading" class="space-y-4">
          <el-card
            v-for="(afterSale, index) in list"
            :key="index"
            shadow="hover"
            @click="handleViewDetail(afterSale)"
          >
            <!-- 订单内容 -->
            <div class="p-4">
              <div class="flex space-x-3">
                <img
v-if="afterSale.itemLogo"
                  :src="afterSale.itemLogo"
                  alt="商品图片"
                  class="w-20 h-20 rounded-md object-cover"
                >
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <div class="font-bold text-gray-800 line-clamp-2">{{ afterSale.itemName }}</div>
                    <el-tag v-if="afterSale.status == 62 " type="danger">{{ formatAfterSaleStatus(afterSale) }}</el-tag>
                    <el-tag v-else-if="afterSale.status == 50 " type="success">{{ formatAfterSaleStatus(afterSale) }}</el-tag>
                    <el-tag v-else type="primary">{{ formatAfterSaleStatus(afterSale) }}</el-tag>
                  </div>
                  <div class="mt-3 flex justify-between items-center space-x-3">
                    <div class="flex flex-col justify-evenly items-start">
                      <span class="text-xs text-gray-600 line-clamp-2">
                        {{ formatAfterSaleStatusDescription(afterSale) }}
                      </span>
                      <span class="text-xs text-gray-600">服务单号: {{ afterSale.no }}</span>
                      <span class="text-xs text-gray-500">{{
                        formatDate(afterSale.createTime)
                      }}</span>
                    </div>
                    <span class="text-lg font-semibold text-gray-800"
                      >¥ {{ fen2yuan(afterSale.refundPrice) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
              class="px-4 py-2 bg-gray-50 border-b border-gray-100 flex justify-end items-center"
            >
              <el-button
                v-if="[10, 20, 30].includes(afterSale.status)"
                size="small"
                plain
                @click.stop="cancelApply(afterSale.id)"
              >
                取消申请
              </el-button>
            </div>
          </el-card>
        </div>

        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParams.pageSize"
          v-model:page="queryParams.pageNo"
          :total="total"
          @pagination="getList"
        />
      </div>
    </el-card>
  </div>

  <AfterSaleDetail ref="detailRef" />
</template>

<style scoped>
:deep(.el-card__body) {
  padding: 0;
}

.custom-style .el-segmented {
  --el-segmented-item-selected-color: var(--el-text-color-primary);
  --el-border-radius-base: 8px;
}
</style>
