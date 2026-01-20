<template>
  <div>
    <el-card class="ml-3" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <CardTitle title="佣金">
            <template #right>
              <el-button type="warning" plain size="small" @click="router.back()">
                <Icon name="ep:back" class="mr-2" />
                返回
              </el-button>
            </template>
          </CardTitle>
        </div>
      </template>

      <!-- 钱包卡片 -->
      <div class="mb-8">
        <div
          class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div class="flex items-center mb-6">
            <h2 class="text-xl font-medium">累计提现（元）</h2>
            <Icon
              :name="state.showMoney ? 'mdi:eye' : 'mdi:eye-off'"
              class="cursor-pointer text-xl"
              :size="20"
              @click="state.showMoney = !state.showMoney"
            />
          </div>

          <div class="flex flex-wrap justify-between items-center mb-8">
            <div class="text-3xl font-bold">
              {{ state.showMoney ? fen2yuan(summary.withdrawPrice || 0) : '*****' }}
            </div>
            <div class="flex gap-4 mt-4 sm:mt-0">
              <el-button
                type="primary"
                size="default"
                @click="handleWithdraw(summary.brokeragePrice)"
                :disabled="summary.brokeragePrice <= 0"
                class="bg-white text-blue-600 hover:bg-blue-50"
              >
                提现
              </el-button>
              <el-button
                type="primary"
                size="default"
                @click="handleToBalance(summary.brokeragePrice)"
                :disabled="summary.brokeragePrice <= 0"
                class="bg-transparent border border-white hover:bg-white/10"
              >
                转余额
              </el-button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-blue-100 text-sm mb-2">冻结佣金</p>
              <p class="text-xl font-semibold">
                {{ state.showMoney ? fen2yuan(summary.frozenPrice || 0) : '*****' }}
              </p>
            </div>
            <div>
              <p class="text-blue-100 text-sm mb-2">可提现佣金</p>
              <p class="text-xl font-semibold">
                {{ state.showMoney ? fen2yuan(summary.brokeragePrice || 0) : '*****' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选和统计区域 -->

        <div class="flex flex-wrap justify-between items-center">
          <el-form-item label="筛选日期：" class="!mb-1">
            <el-date-picker
              v-model="queryParams.createTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="!w-240px"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
              @change="handleQuery"
            />
          </el-form-item>


<!--          <div class="text-gray-700 sm:mt-0">-->
<!--            &lt;!&ndash; 预留统计区域 &ndash;&gt;-->
<!--          </div>-->
        </div>

        <el-tabs v-model="state.currentTab" @tab-change="onChangeTab" class="w-full">
          <el-tab-pane v-for="(tab, key) in tabMaps" :key="key" :label="tab.name" :name="key" />
        </el-tabs>


      <!-- 佣金记录列表 -->
      <div v-if="total === 0" class="bg-white rounded-xl p-12 text-center">
        <el-empty description="暂无数据" />
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div
          v-loading="loading"
          class="p-2 flex border border-b-solid border-gray-3 my-2"
          v-for="item in list"
          :key="item.id"
        >
          <div class="flex-1 items-start">
            <div class="flex justify-between mb-2">
              <div>
                <div class="font-bold line-clamp-1 mb-2">{{ item.title }}</div>
                  <el-text size="small">
                    {{ item.createTime ? formatDate(item.createTime) : formatDate(item.finishTime) }}
                  </el-text>
              </div>
              <div class="money">
                <div v-if="item.price >= 0" class="text-red-600">+{{ fen2yuan(item.price) }}</div>
                <div v-else class="text-green-600">{{ fen2yuan(item.price) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200">
          <Pagination
            v-model:limit="queryParams.pageSize"
            v-model:page="queryParams.pageNo"
            :total="total"
            @pagination="loadData"
          />
        </div>
      </div>
    </el-card>
  </div>


<ToBalanceForm ref="formRef" @success="loadData"/>
<WithdrawForm ref="withdrawRef" @success="loadData"/>
</template>

<script setup lang="ts">
import ToBalanceForm from '@/views/account/affiliate/components/ToBalanceForm.vue'
import WithdrawForm from '@/views/account/affiliate/components/WithdrawForm.vue'
import { useRouter } from 'vue-router'
import { fen2yuan } from '~/utils/money.js'
import { formatDate } from '~/utils/formatTime.ts'
import {
  type AffiliateRecordVO,
  getAffiliateRecordPage,
  getAffiliateUserSummary
} from '~/api/user/affiliate.js'


const router = useRouter()
const message = useMessage()

const loading = ref(false)
// 状态管理
const state = reactive({
  // 显示/隐藏金额
  showMoney: true,
  // 日期选择
  date: [],
  today: new Date(),
  // 当前标签页
  currentTab: 0,
})

const summary = ref({
  withdrawPrice: 0,
  frozenPrice: 0,
  brokeragePrice: 0,
})

// 标签页数据
const tabMaps = [
  {
    name: '分佣',
    value: '1', // AffiliateRecordBizTypeEnum.ORDER
  },
  {
    name: '提现',
    value: '2', //  AffiliateRecordBizTypeEnum.WITHDRAW
  },
]

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  bizType: tabMaps[state.currentTab].value,
  createTime: [],
})

const total = ref(0)
const list = ref<AffiliateRecordVO[]>([])
// 事件处理：标签页变更
const onChangeTab = (tab: any) => {
  state.currentTab = tab
  // 重置分页并重新加载数据
  queryParams.bizType = tabMaps[tab].value
  handleQuery()
}

const handleQuery = () => {
  queryParams.pageNo = 1
  if(queryParams.createTime == null) {
    delete queryParams.createTime
  }
  loadData()
}

// 加载数据
const loadData = async () => {
  // 实际项目中这里会调用API获取数据
  loading.value = true
  try {
    const data = await getAffiliateRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const formRef = ref()
const handleToBalance = (brokeragePrice: number) => {
  formRef.value!.open(brokeragePrice)
}
// 提现
const withdrawRef = ref()
const handleWithdraw = (brokeragePrice: number) => {
  withdrawRef.value!.open(brokeragePrice)
}

const getSummaryInfo = async () => {
  summary.value = await getAffiliateUserSummary()
}

onMounted(async () => {
  await Promise.all([getSummaryInfo(), loadData()])
})
</script>

<style scoped>
/* 自定义表格单元格样式 */
:deep(.el-table .el-table__cell) {
  padding: 16px 0;
}

/* 调整弹窗样式 */
:deep(.el-dialog__body) {
  padding: 0 !important;
}

/* 调整输入框样式 */
:deep(.el-input__wrapper) {
  box-shadow: none !important;
}
</style>
