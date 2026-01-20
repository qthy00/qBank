<script setup lang="ts">
import {getSwapOrderDetail, type OrderDetail} from '~/api/order'
import {fen2yuan} from '~/utils/money.ts'
import {formatDate} from '~/utils/formatTime.ts'
import {useOrder} from "~/composables/useOrder";

const message = useMessage() // 消息弹窗
const {handleCancel, handleDelete, handlePay} = useOrder()

const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(false) // 数据加载中：1）修改时的数据加载；2）提交的按钮禁用
const order = ref<OrderDetail>()

/** 打开弹窗 */
const open = async (data: any) => {
  loading.value = true
  order.value = data
  dialogVisible.value = true
  if (data.id) {
    loading.value = true
    try {
      const res = await getSwapOrderDetail(data.id)
      order.value = {
        ...data,
        ...res
      }
    } finally {
      loading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗
</script>

<template>
  <Dialog title="订单详情" v-model="dialogVisible">
    <h3 class="text-lg font-semibold text-gray-800 my-2 border-t border-gray-100">工具信息</h3>
    <div class="flex space-x-3">
      <img :src="order?.itemLogo" alt="商品图片" class="w-16 h-16 rounded-md object-cover"/>
      <div class="flex flex-col justify-evenly">
        <div class="font-bold text-gray-800 line-clamp-2">{{ order?.itemName }}</div>
        <span class="text-xs text-gray-600 line-clamp-2">{{ order?.itemDescription }}</span>
      </div>
    </div>
    <div class="mt-6 p-2 bg-gray-50 rounded-lg">
      <div class="flex flex-col justify-end space-y-2">
        <div class="flex justify-between text-gray-500">
          <span>工具价格：</span>
          <span class="ml-4">¥{{ fen2yuan(order?.totalPrice) }}</span>
        </div>
        <div
            class="flex justify-between text-gray-500"
            v-if="order?.discountPrice && order.discountPrice > 0"
        >
          <span>优惠金额：</span>
          <span class="ml-4 text-red-500">- ¥{{ fen2yuan(order?.discountPrice) }}</span>
        </div>
        <div class="flex justify-between text-gray-500">
          <span>实付款：</span>
          <span class="ml-4 text-sky-500 text-xl">¥{{ fen2yuan(order?.payPrice) }}</span>
        </div>
      </div>
    </div>
    <div class="grid gap-3 mt-2">
      <h3 class="text-lg font-semibold text-gray-800 border-b border-gray-100">订单信息</h3>
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="w-24 text-gray-800">订单号：</span>
          <span class="text-sm text-gray-500">{{ order?.no }}</span>
        </div>
        <div class="flex justify-between">
          <span class="w-24 text-gray-800">下单时间：</span>
          <span class="text-sm text-gray-500">{{ formatDate(order?.createTime) }}</span>
        </div>
        <div class="flex justify-between" v-if="order?.payTime">
          <span class="w-24 text-gray-800">支付时间：</span>
          <span class="text-sm text-gray-500">{{ formatDate(order?.payTime) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="w-24 text-gray-800">支付方式：</span>
          <span class="text-sm text-gray-500">{{ order?.payChannelName || '-' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="w-24 text-gray-800">订单状态：</span>
          <el-tag type="primary" v-if="order?.status === 0">待支付</el-tag>
          <el-tag type="success" v-if="order?.status === 30">已完成</el-tag>
          <el-tag type="warning" v-if="order?.status === 40">已取消</el-tag>
        </div>
      </div>
    </div>
    <div class="flex justify-start my-3">
      <el-button
          v-if="order?.status && [10, 20, 30].includes(order.status) && order?.afterSaleStatus === 0"
          type="primary"
          plain
          @click.stop="navigateTo({path: '/account/afterSale', query: { orderId: order?.id, itemId: order?.itemId }})"
      >申请售后
      </el-button>
      <el-button
          v-if="order?.afterSaleStatus === 10"
          type="warning"
          plain
          @click.stop="handleDelete(order?.id)"
      >退款中
      </el-button>
      <el-button
          v-if="order?.afterSaleStatus === 20"
          type="primary"
          plain
          @click.stop="handlePay(order?.payOrderId)"
      >退款成功
      </el-button>
      <el-button
          v-if="order?.buttons.includes('cancel')"
          type="info"
          plain
          @click.stop="handleCancel(order?.id)"
      >取消订单
      </el-button>
      <el-button
          v-if="order?.buttons.includes('delete')"
          type="danger"
          plain
          @click.stop="handleDelete(order?.id)"
      >删除订单
      </el-button>
      <el-button
          v-if="order?.buttons.includes('pay')"
          type="primary"
          plain
          @click.stop="handlePay(order?.payOrderId)"
      >继续支付
      </el-button>
    </div>
  </Dialog>
</template>

<style scoped></style>
