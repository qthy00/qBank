<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { fen2yuan } from '~/utils/money.ts'
import { formatDate } from '~/utils/formatTime.ts'
import { type AffiliateRecordVO, getAffiliateRecordPage } from '~/api/user/affiliate.ts'

const router = useRouter()

const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  bizType: 1, // 获得订单
  status: undefined,
})

const options = [
  { label: '全部', value: undefined },
  { label: '待结算', value: 0 },
  { label: '已结算', value: 1 },
]

const orderList = ref<AffiliateRecordVO[]>([])
const total = ref(0)
const loading = ref(false)
const handleTabChange = async () => {
  await getList()
}

const getList = async () => {
  loading.value = true
  try {
    const  data  = await getAffiliateRecordPage(queryParams)
    orderList.value = data.list
    total.value = data.total
  }finally {
    loading.value = false
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
          <CardTitle title="分销订单">
            <template #right>
              <el-button type="warning" plain size="small" @click="router.back()">
                <Icon name="ep:back" class="mr-2" />
                返回
              </el-button>
            </template>
          </CardTitle>
        </div>
      </template>

      <el-segmented
        v-model="queryParams.status"
        :options="options"
        block
        @change="handleTabChange"
      />

      <el-empty v-if="orderList.length <= 0" description="暂无数据"/>
      <el-card v-for="item in  orderList" :key="item.id" class="mt-3" shadow="never">
        <div class="flex justify-between items-center my-1">
          <div class="font-500 text-#999">订单编号：{{ item.bizId }}</div>
          <div class="text-blue-600">
            {{
              item.status === 0 ? '待结算'
                : item.status === 1 ? '已结算' : '已取消'
            }}
            ( 佣金 {{ fen2yuan(item.price) }} 元 )
          </div>
        </div>
        <div class="p-2 pl-0 flex justify-between items-center">
          <div class="text-#333">
            <span>{{ item.title }}</span>
          </div>
          <div class="text-#999">
            {{ formatDate(item.createTime) }}
          </div>
        </div>
      </el-card>

      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />

    </el-card>
  </div>
</template>

<style scoped>

</style>
