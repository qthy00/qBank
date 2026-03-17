<script setup lang="ts">
import type {PackageVO} from "~/types/qBank";

defineOptions({ name: 'CartForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const qPackage = ref<PackageVO>()
const quantity = ref(1)
const returnUrl = ref<string>()
/** 打开弹窗 */
const open = async (tool: PackageVO, url?: string) => {
  qPackage.value = tool
  returnUrl.value = url
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const totalPrice = computed(() => {
  if (!qPackage.value || !qPackage.value?.discountPrice) {
    return '0.00'
  }
  return ((qPackage.value?.discountPrice as unknown as number) * quantity.value).toFixed(2)
})
const discountPrice = computed(() => {
  if (!qPackage.value || !qPackage.value?.discountPrice) {
    return undefined
  }
  return (qPackage.value?.price - Number(qPackage.value?.discountPrice)).toFixed(2)
})

const paymentInfo = computed(() => {
  if (!qPackage.value || !qPackage.value?.paymentType) {
    return ''
  }
  if (qPackage.value.paymentType === 2) {
    return '该工具为订阅制购买'
  }
  if (qPackage.value.paymentType === 3) {
    return '该工具为按使用次数购买'
  }
})

const { push } = useRouter()
const { fullPath } = useRoute()

const submitForm = async () => {
  if (!qPackage.value) {
    return
  }
  try {
    formLoading.value = true

    if (!returnUrl.value) {
      returnUrl.value = fullPath
    }
    await push({
      name: 'OrderPage',
      query: {
        id: qPackage.value.id,
        quantity: quantity.value,
        returnUrl: encodeURIComponent(returnUrl.value),
      },
    })
  } finally {
    formLoading.value = false
    dialogVisible.value = false
  }
}
</script>

<template>
  <Dialog v-model="dialogVisible" title="购买明细" width="500px" :scroll="false">
    <div class="flex items-center justify-between border-b border-gray-200 pb-4">
      <div class="flex items-center space-x-4">
        <img :src="qPackage?.logo" class="w-16 h-16 object-cover rounded-md shadow" alt="logo" />
        <div>
          <p class="text-sm font-semibold text-gray-700">{{ qPackage?.title }}</p>
          <!--          <p class="text-xs text-gray-500">{{qPackage?.description}}</p>-->
        </div>
      </div>
      <div class="flex flex-col items-center space-x-2">
        <div class="text-xs">
          <span>单价：</span>
          <span class="font-semibold text-base line-through">¥{{ qPackage?.price }}</span>
        </div>
        <div class="text-xs" v-if="discountPrice">
          <span>优惠：</span>
          <span class="text-red-600 text-base font-semibold"> ¥{{ discountPrice }}</span>
        </div>
      </div>
    </div>

    <!--    <div>{{paymentInfo}}</div>-->
    <!-- 购买数量区域 -->
    <template v-if="qPackage?.paymentType === 2">
      <div class="flex items-center justify-between pt-4">
        <span class="text-gray-600 font-medium">购买月份：</span>
        <el-input-number v-model="quantity" :min="1" :precision="0" />
      </div>
    </template>

    <template v-if="qPackage?.paymentType === 3">
      <div class="flex items-center justify-between pt-4">
        <span class="text-gray-600 font-medium">购买数量：</span>
        <el-input-number v-model="quantity" :min="1" :precision="0" />
      </div>
    </template>
    <!-- 总价区域 -->
    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
      <span class="text-gray-600 font-medium">合计：</span>
      <span class="text-xl font-bold text-red-600">￥{{ totalPrice }}</span>
    </div>

    <el-button
      type="primary"
      size="large"
      :disabled="formLoading"
      @click="submitForm"
      class="float-end m-4 bg-gradient-to-r from-blue-600 to-blue-400 border-none text-white rounded-full shadow-md hover:opacity-90"
    >
      去 结 算
    </el-button>
  </Dialog>
</template>

<style scoped></style>
