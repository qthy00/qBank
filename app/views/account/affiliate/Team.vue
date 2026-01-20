<template>
  <div>
    <el-card class="ml-3" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <CardTitle title="我的团队">
            <template #right>
              <div>
                <el-button
                  type="primary"
                  size="small"
                  class="bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"
                  @click="push('/account/affiliate/goods')"
                >
                  <el-icon>
                    <UserFilled />
                  </el-icon>
                  <span class="ml-2">邀请成员</span>
                </el-button>
                <el-button type="warning" plain size="small" @click="router.back()">
                  <Icon name="ep:back" class="mr-2" />
                  返回
                </el-button>
              </div>
            </template>
          </CardTitle>
        </div>
      </template>

<!--      <div class="container mx-auto px-4 py-3">-->
<!--        &lt;!&ndash; 团队数据概览 &ndash;&gt;-->
<!--        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">-->
<!--          <el-card class="shadow-sm hover:shadow-md transition-shadow duration-300">-->
<!--            <div class="text-center">-->
<!--              <p class="text-gray-500 text-sm mb-1">团队总人数</p>-->
<!--              <p class="text-2xl font-bold text-gray-800">{{ totalMembers }}</p>-->
<!--              <p class="text-green-500 text-xs mt-2">-->
<!--                <span>较上月增长 {{ monthGrowthRate }}%</span>-->
<!--              </p>-->
<!--            </div>-->
<!--          </el-card>-->
<!--        </div>-->
<!--      </div>-->

      <!-- 主要内容区 - 响应式布局 -->
      <!-- 筛选和搜索区域 -->
      <div class="custom-style">
        <el-segmented
          v-model="queryParams.level"
          :options="options"
          block
          @change="handleTabChange"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-1 items-center">
        <el-input
          v-model="queryParams.nickname"
          placeholder="搜索会员名称"
          class="w-300px! mt-3 mx-auto"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <Icon name="ep:search" class="mr-2" />
              搜索
            </el-button>
          </template>
        </el-input>
        <div class="flex justify-evenly mt-3 items-center">
          <SortButton
            v-for="field in sortFields"
            :key="field.key"
            :field="field"
            :current-sort="sort"
            @sort-change="handleSortChange"
          />
<!--          <div-->
<!--            class="flex text-center items-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"-->
<!--            @click="setSort('userCount', 'asc')"-->
<!--            v-if="sort === 'userCountDESC'"-->
<!--          >-->
<!--            <div>团队排序</div>-->
<!--            <Icon name="ep:sort-down" />-->
<!--          </div>-->
<!--          <div-->
<!--            class="flex text-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"-->
<!--            @click="setSort('userCount', 'desc')"-->
<!--            v-else-if="sort === 'userCountASC'"-->
<!--          >-->
<!--            团队排序-->
<!--            <Icon name="ep:sort-up" />-->
<!--          </div>-->
<!--          <div-->
<!--            class="flex text-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"-->
<!--            @click="setSort('userCount', 'desc')"-->
<!--            v-else-->
<!--          >-->
<!--            团队排序-->
<!--            <Icon name="ep:sort" />-->
<!--          </div>-->
<!--          <div-->
<!--            class="flex text-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"-->
<!--            @click="setSort('price', 'asc')"-->
<!--            v-if="sort === 'priceDESC'"-->
<!--          >-->
<!--            金额排序-->
<!--            <Icon name="ep:sort-down" />-->
<!--          </div>-->
<!--          <div-->
<!--            class="flex text-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"-->
<!--            @click="setSort('price', 'desc')"-->
<!--            v-else-if="sort === 'priceASC'"-->
<!--          >-->
<!--            金额排序-->
<!--            <Icon name="ep:sort-up" />-->
<!--          </div>-->
<!--          <div-->
<!--            class="flex text-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"-->
<!--            @click="setSort('price', 'desc')"-->
<!--            v-else-->
<!--          >-->
<!--            金额排序-->
<!--            <Icon name="ep:sort" />-->
<!--          </div>-->
<!--          <div-->
<!--            class="flex text-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"-->
<!--            @click="setSort('orderCount', 'asc')"-->
<!--            v-if="sort === 'orderCountDESC'"-->
<!--          >-->
<!--            订单排序-->
<!--            <Icon name="ep:sort-down" />-->
<!--          </div>-->
<!--          <div-->
<!--            class="flex text-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"-->
<!--            @click="setSort('orderCount', 'desc')"-->
<!--            v-else-if="sort === 'orderCountASC'"-->
<!--          >-->
<!--            订单排序-->
<!--            <Icon name="ep:sort-up" />-->
<!--          </div>-->
<!--          <div-->
<!--            class="flex text-center bg-white border border-sky-500 text-sky-500 hover:bg-sky-50 transition-all duration-300"-->
<!--            @click="setSort('orderCount', 'desc')"-->
<!--            v-else-->
<!--          >-->
<!--            订单排序-->
<!--            <Icon name="ep:sort" />-->
<!--          </div>-->
        </div>
      </div>
      <el-empty v-if="teamList.length <= 0" description="暂无数据"/>
      <el-card class="mt-3" shadow="never" v-for="item in  teamList" :key="item.id">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <el-avatar :src="item.avatar" />
            <div class="ml-2">
              <div class="text-sm">{{ item.nickname }}</div>
              <div class="text-xs text-gray-500">加入时间：{{ formatDate(item.brokerageTime) }}</div>
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-xs">{{ item.brokerageUserCount || 0 }} 人</div>
            <div class="text-xs" >{{ item.brokerageOrderCount || 0 }} 单</div>
            <div class="text-xs" >{{ item.brokeragePrice || 0 }} 元</div>
          </div>
        </div>
      </el-card>
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getTeamList"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SortButton from '@/views/account/affiliate/components/SortButton.vue'
import {  UserFilled } from '@element-plus/icons-vue'
import {
  type AffiliateRecordSummaryVO, type AffiliateUserChildSummaryVO,
  getAffiliateUserChildSummaryPage
} from '~/api/user/affiliate.js'
import { getAffiliateUserSummary } from '~/api/user/affiliate.js'
import { useAppStore } from '@/stores/modules/app.ts'
import { formatDate } from '~/utils/formatTime.ts'


const {push} = useRouter()
const appStore = useAppStore()
const isMobile = computed(() => appStore.platform.isMobile)

// 团队数据
const totalMembers = ref(0) // 团队总人数
const monthGrowthRate = ref(18.5) // 月增长率

// 成员列表数据
const loading = ref(false)

const router = useRouter()
const summary = ref<AffiliateRecordSummaryVO>({})
const getSummaryInfo = async () => {
  let data = await getAffiliateUserSummary()
  summary.value = data || {}
  if (data) {
    totalMembers.value = data.firstBrokerageUserCount + data.secondBrokerageUserCount
    options[0].label = `一级成员（${data.firstBrokerageUserCount}）`
    options[1].label = `二级成员（${data.secondBrokerageUserCount}）`
  }
}

const queryParams = reactive({
  pageSize: 10,
  pageNo: 1,
  level: 1,
  nickname: undefined,
  sortingField: {
    order: '',
    field: '',
  },
})

const options = reactive([
  {
    label: '一级成员',
    value: 1,
  },
  {
    label: '二级成员',
    value: 2,
  },
])
const handleTabChange = (value) => {
  queryParams.level = value
  queryParams.pageNo = 1
  getTeamList()
}
const sort = ref('')
const teamList = ref<AffiliateUserChildSummaryVO[]>([])
const total = ref(0)
const getTeamList = async () => {
  loading.value = true
  try{
    const data = await getAffiliateUserChildSummaryPage(queryParams)
    teamList.value = data.list
    total.value = data.total
  }finally{
    loading.value = false
  }
}

const sortFields = ref([
  { key: 'userCount', label: '团队排序' },
  { key: 'price', label: '金额排序' },
  { key: 'orderCount', label: '订单排序' }
])

const handleSortChange  = async (field: string, direction: string) => {
  teamList.value = []
  sort.value = field + direction.toUpperCase()
  queryParams.sortingField = {
    order: direction,
    field,
  }
  await getTeamList()
}

const handleSearch = async () => {
  teamList.value = []
  queryParams.pageNo = 1
  await getTeamList()
}

// 页面加载时执行
onMounted(async () => {
  await Promise.all([getSummaryInfo(), getTeamList()])
})
</script>

<style scoped>
.custom-style .el-segmented {
  --el-segmented-item-selected-color: #fff;
  --el-segmented-item-selected-bg-color: #534608;
  --el-border-radius-base: 16px;
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

  .el-tree {
    font-size: 14px;
  }

  .el-tree-node__content {
    height: 40px !important;
  }
}
</style>
