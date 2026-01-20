<script setup lang="ts">
import { fen2yuan } from '~/utils/money.ts'
import { createAffiliateWithdraw } from '~/api/user/affiliate.ts'

defineOptions({ name: 'ToBalanceForm' })

const message = useMessage()

const dialogVisible = ref(false)
const price = ref(0)
const brokeragePrice = ref(0)

/** 打开弹窗 */
const open = async (brokerage: number) => {
  brokeragePrice.value = brokerage
  price.value = 0
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const emit = defineEmits(['success'])
const onConfirm = async () => {
  if (price.value <= 0) {
    message.warning('请输入有效的金额')
    return
  }
  try {
    await message.confirm(`确定将 ${price.value} 元佣金转到余额中吗？`)

    await createAffiliateWithdraw({
      price: price.value * 100,
      type: 1, // 1: 佣金转钱包
    })

    emit('success')
    message.success('转余额成功')
  } catch (e) {
    console.log(e)
  } finally {
    dialogVisible.value = false
  }
}
</script>

<template>
  <!-- 转余额弹窗 -->
  <Dialog v-model="dialogVisible" title="转余额" width="40%" :scroll="false">
    <div class="py-4 text-center">
      <p class="text-gray-500 mb-8">将您的佣金转到余额中继续消费</p>

      <div class="flex justify-center items-center border-b border-gray-200 pb-2 mb-8">
        <span class="text-3xl text-gray-800 mr-2">￥</span>
        <el-input-number
          v-model="price"
          controls-position="right"
          placeholder="请输入金额"
          :precision="2"
          class="text-3xl border-0 focus:ring-0"
          :max="brokeragePrice / 100"
          :min="0"
        />
      </div>

      <p class="text-gray-500 text-sm mb-4">可转最大金额: {{ fen2yuan(brokeragePrice || 0) }} 元</p>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </template>
  </Dialog>
</template>

<style scoped></style>
