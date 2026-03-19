<script setup lang="ts">
import OrderDetail from '@/views/account/order/OrderDetail.vue'
import { getSwapOrderPage, type Order } from '@/api/order'
import { formatDate } from '@/utils/formatTime'
import { fen2yuan } from '@/utils/money'


definePageMeta({
  layout: 'member'
})
useHead({
  title: '订单中心'
})

const message = useMessage() // 消息弹窗
const { handleOrderButtons, handlePay, handleDelete, handleCancel} = useOrder()

const loading = ref(true) // 列表的加载中
const orderList = ref<Order[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  keyword: undefined,
  status: '',
  createTime: [],
})

const options = [
  { label: '全部订单', value: '' },
  { label: '待支付', value: 0 },
  { label: '已支付', value: 10 },
  { label: '已完成', value: 30 },
  { label: '已取消', value: 40 },
  { label: '售后单', value: 99 },
]

const getList = async () => {
  loading.value = true
  try {
    const data = await getSwapOrderPage(queryParams)
    data.list.forEach(order => handleOrderButtons(order));
    orderList.value = data.list
    total.value = data.total
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}



const handleQuery = async () => {
  queryParams.pageNo = 1
  await getList()
}

const resetQuery = () => {
  queryParams.keyword = undefined
  queryParams.createTime = []
  queryParams.pageNo = 1
  getList()
}

// 弹窗相关
const detailRef = ref()
// 查看详情
const handleViewDetail = (row: any) => {

  detailRef.value!.open(row)
}

const {push} = useRouter()
const handlePagination = async () => {
  await getList()
  /* 分页后滚动到列表顶部 */
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleTabChange = async (e) => {
  queryParams.pageNo = 1
  if(e === 99){
    await navigateTo({path: '/account/afterSale/list'})
  }else{
    await getList()
  }
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
          <CardTitle title="我的订单" />
        </div>
      </template>

      <!-- 筛选和搜索区域 -->
      <div class="custom-style">
        <el-segmented
          v-model="queryParams.status"
          :options="options"
          block
          @change="handleTabChange"
        />
      </div>

      <el-form ref="queryRef" :inline="true" :model="queryParams" class="mt-5" label-width="50px">
        <el-form-item label="订单" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="订单号/工具名称"
            :style="{ width: '220px' }"
            suffix-icon="Search"
          />
        </el-form-item>
        <el-form-item label="时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
            end-placeholder="结束日期"
            start-placeholder="开始日期"
            type="daterange"
            value-format="YYYY-MM-DD HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="ml-20px">
        <el-button type="primary" plain @click="handleQuery">
          <Icon class="mr-5px" name="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" name="ep:refresh" />
          重置
        </el-button>
      </div>

      <el-empty v-if="!loading && total === 0" description="暂无订单数据">
        <template #image>
          <Icon name="ep:document" class="text-6xl text-gray-300" />
        </template>
        <el-button type="primary" @click="navigateTo('/qbank')">去逛逛</el-button>
      </el-empty>

      <!-- 订单列表 - 卡片式 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden p-4">
        <div v-loading="loading" class="space-y-4">
          <el-card
            shadow="hover"
            v-for="(order, index) in orderList"
            :key="index"
            @click="handleViewDetail(order)"
          >

            <!-- 订单内容 -->
            <div class="p-4">
              <div class="flex space-x-3">
                <img
                  :src="order.itemLogo"
                  alt="商品图片"
                  class="w-20 h-20 rounded-md object-cover"
                />
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <div class="font-bold text-gray-800 line-clamp-2">{{ order.itemName }}</div>
                    <el-tag type="danger" v-if="order.status === 0">待支付</el-tag>
                    <el-tag type="warning" v-else-if="order.status === 10">已支付</el-tag>
                    <el-tag type="success" v-else-if="order.status === 30">已完成</el-tag>
                    <el-tag type="info" v-else-if="order.status === 40">已取消</el-tag>
                    <el-tag v-else>未知状态</el-tag>
                  </div>

                  <div class="mt-3 flex justify-between items-center space-x-3">
                    <div class="flex flex-col justify-evenly items-start">
                      <span class="text-xs text-gray-600">订单号: {{ order.no }}</span>
                      <span class="text-xs text-gray-500">{{ formatDate(order.createTime) }}</span>
                    </div>
                    <span class="text-lg font-semibold text-gray-800"
                      >¥ {{ fen2yuan(order.payPrice) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-2 bg-gray-50 border-b border-gray-100 flex justify-end items-center">
              <el-button v-if="order.buttons.length === 0" size="small" plain @click.stop="handleViewDetail(order)">查看详情</el-button>
              <el-button v-if="order.buttons.includes('cancel')" size="small" type="info" plain @click.stop="handleCancel(order.id)">取消订单</el-button>
              <el-button v-if="order.buttons.includes('delete')" size="small" type="danger" plain @click.stop="handleDelete(order.id)">删除订单</el-button>
              <el-button v-if="order.buttons.includes('pay')" size="small" type="primary" plain @click.stop="handlePay(order.payOrderId)">继续支付</el-button>
            </div>
          </el-card>
        </div>

        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParams.pageSize"
          v-model:page="queryParams.pageNo"
          :total="total"
          @pagination="handlePagination"
        />
      </div>
    </el-card>
  </div>

  <OrderDetail ref="detailRef" />
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
