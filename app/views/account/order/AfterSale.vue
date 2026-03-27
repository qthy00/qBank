<script setup lang="ts">
import { fen2yuan } from '~/utils/money.ts'
import { formatDate } from '~/utils/formatTime.ts'
import { createAfterSale, getSwapOrderDetail, type OrderDetail } from '~/api/order'

const { query } = useRoute()
const { push } = useRouter()
const message = useMessage()
const itemId = query.itemId as unknown as number
const orderId = query.orderId as unknown as number

const refundReasons = [
  { value: 'quality', label: '商品质量问题' },
  { value: 'wrong', label: '商品与描述不符' },
  { value: 'notNeed', label: '买多了/买错了' },
  { value: 'other', label: '其他原因' },
]

const orderInfo = ref<OrderDetail>()

// 表单数据
const formData = reactive({
  type: 'refund',
  applyReason: '',
  amount: 0,
  applyDescription: '',
  agree: false,
  images: [],
})

const submit = async () => {
  if(!formData.agree) {
    message.error('请先同意退款协议')
    return
  }
  if(!formData.amount){
    message.error('退款金额不能为0')
    return
  }
  if(!formData.applyReason){
    message.error('请选择退款原因')
    return
  }
  const data = {
    orderId,
    refundPrice: formData.amount * 100,
    ...formData,
  }
  await createAfterSale(data)
  message.success('申请成功')

  await navigateTo({ path: '/account/afterSale/list' })
}

onMounted(async () => {
  if (!orderId || !itemId) {
    message.error(`缺少订单信息，请检查`)
    return
  }
  orderInfo.value = await getSwapOrderDetail(orderId)
})
</script>

<template>
  <div>
    <el-card class="ml-3" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <CardTitle title="申请售后" />
        </div>
      </template>

      <div class="container mx-auto px-4">
        <!-- 订单信息卡片 -->

        <div class="flex items-center mb-3">
          <div class="ml-3 flex-1">
            <div class="font-medium text-gray-800 line-clamp-2 text-sm">
              {{ orderInfo?.subject }}
            </div>
            <span class="text-xs text-gray-600 line-clamp-2">{{ orderInfo?.description }}</span>
            <div class="mt-1 flex justify-between items-center">
              <span class="text-sm font-semibold text-gray-800">
                ¥ {{ fen2yuan(orderInfo?.payPrice) }}
              </span>
              <span class="text-xs text-gray-500">x{{ orderInfo?.quantity || 1 }}</span>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-100 pt-3 mt-3">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-500">订单编号</span>
            <span class="font-medium text-gray-800">{{ orderInfo?.no }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">下单时间</span>
            <span class="font-medium text-gray-800">{{ formatDate(orderInfo?.createTime) }}</span>
          </div>
        </div>

        <el-divider />

        <!-- 售后表单 -->

        <div class="p-2">
          <h3 class="font-semibold text-gray-800 mb-2">退款原因</h3>
          <el-select
            v-model="formData.applyReason"
            placeholder="请选择退款原因"
            class="w-full mb-6"
          >
            <el-option
              v-for="item in refundReasons"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <h3 class="font-semibold text-gray-800 mb-2">退款金额</h3>
          <el-input-number
            v-model="formData.amount"
            placeholder="请输入退款金额"
            class="w-200px mb-6"
            :min="0"
            :precision="2"
            :max="orderInfo?.payPrice ? orderInfo.payPrice / 100 : 1"
          >
            <template #prefix>¥</template>
          </el-input-number>

          <h3 class="font-semibold text-gray-800 mb-2">问题描述</h3>
          <el-input
            v-model="formData.applyDescription"
            type="textarea"
            :rows="4"
            placeholder="请描述您遇到的问题"
            class="w-full mb-6"
          />

          <h3 class="font-semibold text-gray-800 mb-2">上传凭证 (选填)</h3>
          <UploadImg v-model="formData.images" :limit="3" width="100px" height="100px">
            <template #empty>
              <div class="text-center text-gray-400">
                <Icon name="ep:upload-filled" :size="25" />
                <p class="text-xs">点击上传</p>
              </div>
            </template>
            <template #tip>
              <div class="text-xs text-gray-500 ml-2 mb-2">
                支持 JPG, PNG, PDF 格式，最大
                5MB，最多上传3个文件，请上传清晰的问题凭证，有助于我们更快处理您的申请
              </div>
            </template>
          </UploadImg>

          <el-checkbox v-model="formData.agree" class="mb-6 text-sm">
            我已阅读并同意
            <a href="#" class="text-sky-500">《售后政策》</a>
          </el-checkbox>
        </div>

        <el-button type="primary" class="w-full" @click="submit">提交申请</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped></style>
