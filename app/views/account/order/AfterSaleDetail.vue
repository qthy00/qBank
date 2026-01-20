<script setup lang="ts">
import { formatAfterSaleStatusDescription } from '@/views/account/order/order.ts'
import { type AfterSale, getAfterSaleDetail } from '~/api/order'
import { formatDate } from '~/utils/formatTime.ts'
import { fen2yuan } from '~/utils/money.ts'

const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(false) // 数据加载中：1）修改时的数据加载；2）提交的按钮禁用
const order = ref<AfterSale>()

/** 打开弹窗 */
const open = async (data: any) => {
  loading.value = true
  order.value = data
  dialogVisible.value = true
  if (data.id) {
    loading.value = true
    try {
      const res = await getAfterSaleDetail(data.id)
      order.value = {
        ...data,
        ...res
      }
    } finally {
      loading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const cancelApply = (id?: number) => {
  if(!id) return
  message.success('申请售后')
}

</script>

<template>
  <Dialog title="售后详情" v-model="dialogVisible">
    <h3 class="text-lg font-semibold text-gray-800 my-2 border-t border-gray-100">工具信息</h3>
    <div class="flex space-x-3">
      <img :src="order?.itemLogo" alt="工具图片" class="w-16 h-16 rounded-md object-cover" />
      <div class="flex flex-col justify-evenly">
        <div class="font-bold text-gray-800 line-clamp-2">{{ order?.itemName }}</div>
        <span class="text-xs text-gray-600 line-clamp-2">{{ order?.itemDescription }}</span>
      </div>
    </div>
    <div class="mt-6 p-2 bg-gray-50 rounded-lg">
      <div class="flex flex-col justify-end space-y-2">
        <div class="flex justify-between text-gray-500">
          <span>退款总额：</span>
          <span class="ml-4">¥{{ fen2yuan(order?.refundPrice) }}</span>
        </div>
      </div>
    </div>
    <div class="grid gap-3 mt-2">
      <h3 class="text-lg font-semibold text-gray-800 border-b border-gray-100">订单信息</h3>
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="w-24 text-gray-800">服务单号：</span>
          <span class="text-sm text-gray-500">{{ order?.no }}</span>
        </div>
        <div class="flex justify-between">
          <span class="w-24 text-gray-800">申请时间：</span>
          <span class="text-sm text-gray-500">{{ formatDate(order?.createTime) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="w-24 text-gray-800">申请原因：</span>
          <span class="text-sm text-gray-500">{{ order?.applyReason }}</span>
        </div>
        <div class="flex justify-between">
          <span class="w-24 text-gray-800">相关描述：</span>
          <span class="text-sm text-gray-500">{{ order?.applyDescription || '-' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="w-24 text-gray-800">服务状态：</span>
          <span class="text-xs text-gray-600 line-clamp-2">
            {{ formatAfterSaleStatusDescription(order) }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex justify-start my-3">
      <el-button
        v-if="[10, 20, 30].includes(order.status)"
        plain
        @click.stop="cancelApply(order?.id)"
      >
        取消申请
      </el-button>
<!--      <el-button-->
<!--        type="warning"-->
<!--        plain-->
<!--        -->
<!--      >联系客服-->
<!--      </el-button>-->
    </div>
  </Dialog>
</template>

<style scoped></style>
