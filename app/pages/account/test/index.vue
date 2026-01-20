<script setup lang="ts">
import { TestApi } from '~/api/tools/test'

defineOptions({ name: 'UserTestRecord' })

definePageMeta({
  layout: 'member'
})
useHead({
  title: '测试记录'
})

const loading = ref(true) // 列表的加载中
const testList = ref<any[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 3,
  createTime: [],
})

const getList = async () => {
  loading.value = true
  try {
    const data = await TestApi.fetchResultList(queryParams)
    testList.value = data.list
    total.value = data.total
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const handleViewDetail = (id: number) => {
  navigateTo({ name: 'TestResult', query: { id } })
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
          <CardTitle title="我的测试记录" />
        </div>
      </template>

      <el-empty v-if="total === 0" description="暂无数据" />

      <!-- 订单列表 - 卡片式 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden p-4">
        <div v-loading="loading" class="space-y-4">
          <el-card
            shadow="hover"
            v-for="(test, index) in testList"
            :key="index"
            @click="handleViewDetail(test.sessionId)"
          >

            <!-- 订单内容 -->
            <div class="p-4">
              <div class="flex space-x-3">
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <div class="font-bold text-gray-800 line-clamp-2">{{ test.testName }}</div>
                    <el-button size="small" plain @click.stop="handleViewDetail(test.sessionId)">查看详情</el-button>
                  </div>

                  <div class="mt-3 flex justify-between items-center space-x-3">
                    <div class="flex flex-col justify-evenly items-start">
                      <span class="text-xs text-gray-500 mb-2">测试开始时间：{{ formatDate(test.testTime) }}</span>
                      <span class="text-xs text-gray-500">测试结束时间：{{ formatDate(test.submittedTime) }}</span>
                    </div>
                  </div>
                </div>
              </div>
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
</template>

<style scoped></style>
