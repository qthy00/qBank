<template>
  <div>
    <el-card class="ml-3" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <CardTitle title="分销中心">
            <template #right>
              <el-button link type="primary" plain size="small" @click="showRulesDialog = true">
                分销规则
              </el-button>
            </template>
          </CardTitle>
        </div>
      </template>

      <!-- 分销数据概览 -->
      <el-card class="shadow-sm">
        <template #header>
          <div class="flex justify-start items-center">
            <h3 class="font-semibold text-gray-800">账户信息</h3>
            <Icon
              :name="showMoney ? 'mdi:eye' : 'mdi:eye-off'"
              color="gray"
              class="ml-3"
              :size="20"
              @click="showMoney = !showMoney"
            />
          </div>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <el-card class="hover:shadow-md transition-shadow duration-300" shadow="never">
            <div class="text-center">
              <p class="text-gray-500 text-sm mb-1">累计佣金</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ showMoney ? `¥${fen2yuan(summary.totalBrokeragePrice)}` : '****' }}
              </p>
              <p
v-if="summary.monthIncrease"
                :class="`${summary.monthIncrease > 0 ? 'text-green-500' : 'text-red-500'} text-xs mt-2`"
              >
                <!--              <el-icon size="14"><ArrowUp /></el-icon>-->
                <span>较上月增长 {{ summary.monthIncrease || 0 }}%</span>
              </p>
            </div>
          </el-card>

          <el-card class="hover:shadow-md transition-shadow duration-300" shadow="never">
            <div class="text-center">
              <p class="text-gray-500 text-sm mb-1">已提现</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ showMoney ? `¥${fen2yuan(summary.withdrawPrice)}` : '****' }}
              </p>
              <p class="text-gray-500 text-xs mt-2">本月已提现 {{ summary.monthWithdrawCount || 0 }} 次</p>
            </div>
          </el-card>

          <el-card class="hover:shadow-md transition-shadow duration-300" shadow="never">
            <div class="text-center">
              <p class="text-gray-500 text-sm mb-1">待结算</p>
              <p class="text-2xl font-bold text-amber-500">
                {{ showMoney ? `¥${fen2yuan(summary.frozenPrice || 0)}` : '****' }}
              </p>
<!--              <p class="text-gray-500 text-xs mt-2">预计 3 天后结算</p>-->
            </div>
          </el-card>

          <el-card class="hover:shadow-md transition-shadow duration-300" shadow="never">
            <div class="text-center">
              <p class="text-gray-500 text-sm mb-1">团队人数</p>
              <p class="text-2xl font-bold text-sky-500">
                {{ summary?.userCount || 0 }}
              </p>
              <p class="text-green-500 text-xs mt-2">
                <!--              <el-icon size="14"><ArrowUp /></el-icon>-->
                <span>本月新增 {{ summary.monthUserCount || 0 }} 人</span>
              </p>
            </div>
          </el-card>
        </div>
      </el-card>

      <!-- 功能菜单 -->
      <el-card class="mt-6 shadow-sm">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold text-gray-800">功能区</h3>
          </div>
        </template>

        <div class="flex flex-wrap justify-evenly">
          <div
            v-for="(item, index) in menuList"
            :key="index"
            class="flex flex-col items-center mx-2 mb-2 cursor-pointer p-2 hover:shadow-lg transition-colors duration-300"
            @click="navigateTo(item.path)"
          >
            <img class="menu-icon mb-2" :src="item.img" :alt="item.title" >
            <div class="text-center text-sm">{{ item.title }}</div>
          </div>
        </div>
      </el-card>

      <!-- 主要内容区 - 响应式布局 -->
      <!--      <div v-if="!isMobile" class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">-->
      <!--        &lt;!&ndash; 左侧/上部：推广数据和图表 &ndash;&gt;-->
      <!--        <el-card class="lg:col-span-2 shadow-sm">-->
      <!--          <template #header>-->
      <!--            <div class="flex justify-between items-center">-->
      <!--              <h3 class="font-semibold text-gray-800">推广数据</h3>-->
      <!--              <el-select v-model="dateRange" size="small" @change="handleDateChange">-->
      <!--                <el-option label="近7天" value="7" />-->
      <!--                <el-option label="近30天" value="30" />-->
      <!--                <el-option label="近90天" value="90" />-->
      <!--              </el-select>-->
      <!--            </div>-->
      <!--          </template>-->

      <!--          <div class="p-2">-->
      <!--            <div class="h-64">-->
      <!--              &lt;!&ndash;                    <el-chart :auto-resize="true">&ndash;&gt;-->
      <!--              &lt;!&ndash;                      <el-line-series&ndash;&gt;-->
      <!--              &lt;!&ndash;                        :data="chartData.series"&ndash;&gt;-->
      <!--              &lt;!&ndash;                        :x-axis="chartData.xAxis"&ndash;&gt;-->
      <!--              &lt;!&ndash;                        smooth&ndash;&gt;-->
      <!--              &lt;!&ndash;                        symbol="circle"&ndash;&gt;-->
      <!--              &lt;!&ndash;                        symbol-size="6"&ndash;&gt;-->
      <!--              &lt;!&ndash;                        line-style="solid"&ndash;&gt;-->
      <!--              &lt;!&ndash;                        line-width="2"&ndash;&gt;-->
      <!--              &lt;!&ndash;                        color="#409EFF"&ndash;&gt;-->
      <!--              &lt;!&ndash;                      />&ndash;&gt;-->
      <!--              &lt;!&ndash;                      <el-tooltip&ndash;&gt;-->
      <!--              &lt;!&ndash;                        trigger="axis"&ndash;&gt;-->
      <!--              &lt;!&ndash;                        formatter="日期: {b}<br>佣金: ¥{c}"&ndash;&gt;-->
      <!--              &lt;!&ndash;                      />&ndash;&gt;-->
      <!--              &lt;!&ndash;                    </el-chart>&ndash;&gt;-->
      <!--            </div>-->
      <!--          </div>-->

      <!--          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-gray-50 mt-2">-->
      <!--            <div class="text-center">-->
      <!--              <p class="text-gray-500 text-xs">推广订单</p>-->
      <!--              <p class="font-bold text-gray-800">{{ promotionOrders }}</p>-->
      <!--            </div>-->
      <!--            <div class="text-center">-->
      <!--              <p class="text-gray-500 text-xs">有效用户</p>-->
      <!--              <p class="font-bold text-gray-800">{{ validUsers }}</p>-->
      <!--            </div>-->
      <!--            <div class="text-center">-->
      <!--              <p class="text-gray-500 text-xs">转化率</p>-->
      <!--              <p class="font-bold text-green-500">{{ conversionRate }}%</p>-->
      <!--            </div>-->
      <!--            <div class="text-center">-->
      <!--              <p class="text-gray-500 text-xs">平均佣金</p>-->
      <!--              <p class="font-bold text-gray-800">¥{{ avgCommission.toFixed(2) }}</p>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </el-card>-->
      <!--        &lt;!&ndash; 右侧/下部：推广工具 &ndash;&gt;-->
      <!--        <el-card class="shadow-sm">-->
      <!--          <template #header>-->
      <!--            <h3 class="font-semibold text-gray-800">推广工具</h3>-->
      <!--          </template>-->

      <!--          <div class="p-4">-->
      <!--            <div class="mb-6">-->
      <!--              <p class="text-sm text-gray-500 mb-2">推广链接</p>-->
      <!--              <div class="flex">-->
      <!--                <el-input-->
      <!--                  v-model="promoLink"-->
      <!--                  readonly-->
      <!--                  size="small"-->
      <!--                  class="flex-1"-->
      <!--                  placeholder="加载中..."-->
      <!--                />-->
      <!--                <el-button-->
      <!--                  type="primary"-->
      <!--                  size="small"-->
      <!--                  class="ml-2 bg-sky-500 hover:bg-sky-600"-->
      <!--                  @click="copyToClipboard(promoLink)"-->
      <!--                >-->
      <!--                  <Icon name="ep:document-copy" />-->
      <!--                </el-button>-->
      <!--              </div>-->
      <!--            </div>-->

      <!--            <div>-->
      <!--              <p class="text-sm text-gray-500 mb-2">推广二维码</p>-->
      <!--              <div class="flex justify-center">-->
      <!--                <div class="bg-white p-3 border border-gray-200 rounded-md">-->
      <!--                  <img :src="qrCodeUrl" alt="推广二维码" class="w-36 h-36 object-cover" />-->
      <!--                </div>-->
      <!--              </div>-->
      <!--              <p class="text-xs text-gray-500 text-center mt-2">扫码推广或保存图片分享</p>-->
      <!--            </div>-->

      <!--            <el-button-->
      <!--              type="primary"-->
      <!--              class="w-full mt-6 bg-sky-500 hover:bg-sky-600"-->
      <!--              @click="downloadQrCode"-->
      <!--            >-->
      <!--              &lt;!&ndash;              <el-icon><Download /></el-icon>&ndash;&gt;-->
      <!--              <span class="ml-2">保存二维码</span>-->
      <!--            </el-button>-->
      <!--          </div>-->
      <!--        </el-card>-->
      <!--      </div>-->

      <!-- 实时动态 -->
      <el-card class="mt-6 shadow-sm">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold text-gray-800">实时动态</h3>
            <el-button
              link
              type="primary"
              size="small"
              plain
              @click="navigateTo('/account/affiliate/wallet')"
            >
              更多
              <Icon name="ep:arrow-right" class="ml-1" />
            </el-button>
          </div>
        </template>

        <div v-loading="logLoading" class="flex flex-col">
          <el-empty v-if="logList.length <= 0" description="暂无动态" />
          <div
            v-for="log in logList"
            :key="log.id"
            class="flex justify-between items-center mx-2 mb-2 cursor-pointer p-2 hover:shadow-lg transition-colors duration-300"
          >
            <div>
              <div class="flex line-clamp-1 items-center">
                <div class="flex flex-col">
                  <img class="w-4 h-4 mr-1" src="@/assets/images/notice.png" alt="" >
                </div>
                <div class="text-#333 line-clamp-1">
                  {{ log.title }} {{ fen2yuan(log.price) }} 元
                </div>
              </div>
            </div>
            <el-text class="font-400">{{ formatPast(log.createTime) }}</el-text>
          </div>
        </div>
      </el-card>

      <!-- 分销订单列表 -->
      <!--      <el-card class="mt-6 shadow-sm">-->
      <!--        <template #header>-->
      <!--          <div class="flex flex-wrap justify-between items-center">-->
      <!--            <h3 class="font-semibold text-gray-800">分销订单</h3>-->

      <!--            <div class="flex mt-2 sm:mt-0">-->
      <!--              <el-input-->
      <!--                v-model="searchKeyword"-->
      <!--                placeholder="订单号/商品名称"-->
      <!--                size="small"-->
      <!--                class="w-full sm:w-48"-->
      <!--                suffix-icon="Search"-->
      <!--              />-->
      <!--              <el-button-->
      <!--                type="primary"-->
      <!--                size="small"-->
      <!--                class="ml-2 bg-sky-500 hover:bg-sky-600"-->
      <!--                @click="searchOrders"-->
      <!--              >-->
      <!--                搜索-->
      <!--              </el-button>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </template>-->

      <!--        <div class="p-2">-->
      <!--          &lt;!&ndash; 分页 &ndash;&gt;-->
      <!--          <div class="flex justify-between items-center mt-4">-->
      <!--            <div class="text-sm text-gray-500">共 {{ total }} 条订单</div>-->
      <!--            &lt;!&ndash; 分页 &ndash;&gt;-->
      <!--            <Pagination-->
      <!--              v-model:limit="queryParams.pageSize"-->
      <!--              v-model:page="queryParams.pageNo"-->
      <!--              :total="total"-->
      <!--              @pagination="getList"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-card>-->

      <!-- 提现区域 -->
      <!--      <el-card class="mt-6 shadow-sm">-->
      <!--        <template #header>-->
      <!--          <div class="flex justify-between items-center">-->
      <!--            <h3 class="font-semibold text-gray-800">提现管理</h3>-->
      <!--            <el-button-->
      <!--              type="primary"-->
      <!--              class="bg-sky-500 hover:bg-sky-600"-->
      <!--              :disabled="availableForWithdrawal < 10"-->
      <!--              @click="showWithdrawDialog = true"-->
      <!--            >-->
      <!--              &lt;!&ndash;              <el-icon><ArrowDown /></el-icon>&ndash;&gt;-->
      <!--              <span class="ml-2">申请提现</span>-->
      <!--            </el-button>-->
      <!--          </div>-->
      <!--        </template>-->

      <!--        <div class="p-4">-->
      <!--          <div class="flex flex-wrap items-center justify-between mb-6">-->
      <!--            <div>-->
      <!--              <p class="text-sm text-gray-500">可提现金额</p>-->
      <!--              <p class="text-2xl font-bold text-green-500 mt-1">-->
      <!--                ¥{{ availableForWithdrawal.toFixed(2) }}-->
      <!--              </p>-->
      <!--              <p class="text-xs text-gray-500 mt-1">-->
      <!--                <i class="el-icon-info-circle text-sky-500"></i>-->
      <!--                最低提现金额 10 元-->
      <!--              </p>-->
      <!--            </div>-->

      <!--            <div class="mt-4 sm:mt-0">-->
      <!--              <div class="flex items-center">-->
      <!--                <div class="text-center mr-6">-->
      <!--                  <p class="text-sm font-medium text-gray-800">{{ withdrawalCount }}</p>-->
      <!--                  <p class="text-xs text-gray-500">本月提现次数</p>-->
      <!--                </div>-->
      <!--                <div class="text-center">-->
      <!--                  <p class="text-sm font-medium text-gray-800">-->
      <!--                    {{ withdrawalLimit - withdrawalCount }}-->
      <!--                  </p>-->
      <!--                  <p class="text-xs text-gray-500">剩余提现次数</p>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->

      <!--          <h4 class="text-sm font-medium text-gray-800 mb-3">最近提现记录</h4>-->
      <!--          <div class="space-y-3">-->
      <!--            <div-->
      <!--              v-for="(record, index) in recentWithdrawals"-->
      <!--              :key="index"-->
      <!--              class="flex flex-wrap justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"-->
      <!--            >-->
      <!--              <div>-->
      <!--                <p class="text-gray-800 font-medium">¥{{ record.amount.toFixed(2) }}</p>-->
      <!--                <p class="text-xs text-gray-500 mt-1">申请时间: {{ record.applyTime }}</p>-->
      <!--              </div>-->
      <!--              <div class="mt-2 sm:mt-0 text-right">-->
      <!--                &lt;!&ndash;                <el-tag&ndash;&gt;-->
      <!--                &lt;!&ndash;                  :type="getWithdrawStatusType(record.status)"&ndash;&gt;-->
      <!--                &lt;!&ndash;                  effect="light"&ndash;&gt;-->
      <!--                &lt;!&ndash;                  class="mb-1"&ndash;&gt;-->
      <!--                &lt;!&ndash;                >&ndash;&gt;-->
      <!--                &lt;!&ndash;                  {{ getWithdrawStatusText(record.status) }}&ndash;&gt;-->
      <!--                &lt;!&ndash;                </el-tag>&ndash;&gt;-->
      <!--                <p class="text-xs text-gray-500" v-if="record.status === 'success'">-->
      <!--                  到账时间: {{ record.arrivalTime }}-->
      <!--                </p>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-card>-->
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import icon1 from '@/assets/images/commission_icon1.png'
import icon2 from '@/assets/images/commission_icon2.png'
import icon3 from '@/assets/images/commission_icon3.png'
import icon4 from '@/assets/images/commission_icon4.png'
import {
  type AffiliateRecordSummaryVO,
  type AffiliateRecordVO,
  getAffiliateRecordPage, getAffiliateSummary,
} from '@/api/user/affiliate.ts'
import { formatPast } from '@/utils/formatTime.ts'
import { fen2yuan } from '@/utils/money.ts'

definePageMeta({
  layout: 'member'
})
useHead({
  title: '分销中心'
})

const appStore = useAppStore()
const {isMobile: _isMobile} = storeToRefs(appStore)
const message = useMessage()
// 基础数据
const _promotionOrders = ref(128) // 推广订单
const _validUsers = ref(45) // 有效用户
const _conversionRate = ref(18.6) // 转化率
const _avgCommission = ref(25.8) // 平均佣金
const _availableForWithdrawal = ref(131.1) // 可提现金额
const _withdrawalCount = ref(2) // 本月提现次数
const _withdrawalLimit = ref(5) // 每月提现上限

// 图表数据
const _dateRange = ref('30')
const _chartData = ref({
  xAxis: [],
  series: [],
})

const menuList = ref([
  {
    img: icon1,
    title: '我的团队',
    path: '/account/affiliate/team',
  },
  {
    img: icon2,
    title: '佣金明细',
    path: '/account/affiliate/wallet',
  },
  {
    img: icon3,
    title: '分销订单',
    path: '/account/affiliate/order',
  },
  {
    img: icon4,
    title: '推广商品',
    path: '/account/affiliate/goods',
  },
  // {
  //   img: '/src/assets/images/commission_icon7.png',
  //   title: '邀请海报',
  //   path: undefined,
  // },
  // {
  //   img: '/src/assets/images/commission_icon5.png',
  //   title: '推广排行',
  //   path: '/account/affiliate/promoter',
  // },
  // {
  //   img: '/src/assets/images/commission_icon6.png',
  //   title: '佣金排行',
  //   path: '/account/affiliate/ranking',
  // },
])

// 订单列表数据
const loading = ref(false)
const currentPage = ref(1)
const _total = ref(0)
const _searchKeyword = ref('')

// 提现相关
const _showWithdrawDialog = ref(false)

// 分销规则弹窗
const showRulesDialog = ref(false)

const _getList = () => {}

// 搜索订单
const _searchOrders = () => {
  currentPage.value = 1
  loadOrderList()
}

// 加载订单列表
const loadOrderList = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 下载二维码
const _downloadQrCode = () => {
  // 模拟下载
  message.success('二维码已开始下载')
}

const showMoney = ref(true)
const summary = ref<AffiliateRecordSummaryVO>({})
const getSummaryInfo = async () => {
  const data = await getAffiliateSummary()
  summary.value = data || {}
}

// 实时动态数据获取
const logLoading = ref(false)
const logList = ref<AffiliateRecordVO[]>([])
const logTotal = ref(0)
const queryParams = reactive({
  pageSize: 30,
  pageNo: 1,
})
const getLog = async () => {
  logLoading.value = true
  try {
    const data = await getAffiliateRecordPage(queryParams)
    logList.value = data.list
    logTotal.value = data.total
  } finally {
    logLoading.value = false
  }
}

// 页面加载时执行
onMounted(async () => {
  // generateChartData(Number(dateRange.value))
  // loadOrderList()
  await Promise.all([getSummaryInfo(), getLog()])
})
</script>

<style scoped>
.menu-icon {
  width: 50px;
  height: 50px;
  background: #ffffff;
  border-radius: 50%;
}

/* 自定义响应式样式 */
@media (max-width: 768px) {
  .el-table .el-table__cell {
    padding: 6px 0;
  }

  .el-table .el-table__header .el-table__cell {
    padding: 8px 0;
  }

  .el-pagination {
    flex-wrap: wrap;
  }
}
</style>
