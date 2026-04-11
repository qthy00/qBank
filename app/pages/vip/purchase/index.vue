<script setup lang="ts">
import type { VipPackageVO, VipBenefitVO, UserVipInfoVO, VipOrderVO } from '~/types/vip'
import { getVipPackages, getVipBenefits, getUserVipInfo, createVipOrder, getPayParams, queryOrderStatus } from '~/api/vip'

/* 页面布局设置 */
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'VIP会员 - 升级享受更多特权'
})

const message = useMessage()

/* 响应式状态 */
const loading = ref(false)
const packages = ref<VipPackageVO[]>([])
const benefits = ref<VipBenefitVO[]>([])
const userVipInfo = ref<UserVipInfoVO | null>(null)
const selectedPackage = ref<VipPackageVO | null>(null)
const payChannel = ref<'alipay' | 'wechat'>('alipay')
const submitting = ref(false)
const showPayDialog = ref(false)
const currentOrder = ref<VipOrderVO | null>(null)
const payPolling = ref<NodeJS.Timeout | null>(null)

/* 计算属性 */
const isVip = computed(() => userVipInfo.value?.isVip ?? false)
const vipLevelName = computed(() => userVipInfo.value?.levelName ?? '普通用户')
const vipExpireTime = computed(() => userVipInfo.value?.expireTime)

/* 获取页面数据 */
const fetchData = async () => {
  loading.value = true
  try {
    const [packagesRes, benefitsRes, userInfoRes] = await Promise.all([
      getVipPackages(),
      getVipBenefits(),
      getUserVipInfo()
    ])
    packages.value = packagesRes
    benefits.value = benefitsRes
    userVipInfo.value = userInfoRes

    /* 默认选中推荐的套餐 */
    const recommended = packagesRes.find(p => p.isRecommended)
    if (recommended) {
      selectedPackage.value = recommended
    } else if (packagesRes.length > 0) {
      selectedPackage.value = packagesRes[0]
    }
  } catch (error) {
    message.error('加载数据失败')
    console.error('加载VIP数据失败:', error)
  } finally {
    loading.value = false
  }
}

/* 选择套餐 */
const selectPackage = (pkg: VipPackageVO) => {
  selectedPackage.value = pkg
}

/* 计算节省金额 */
const getSavedAmount = (pkg: VipPackageVO) => {
  return (pkg.originalPrice - pkg.salePrice).toFixed(0)
}

/* 提交购买 */
const handlePurchase = async () => {
  if (!selectedPackage.value) {
    message.warning('请选择套餐')
    return
  }

  submitting.value = true
  try {
    /* 创建订单 */
    const order = await createVipOrder({
      packageId: selectedPackage.value.id,
      payChannel: payChannel.value
    })
    currentOrder.value = order

    /* 获取支付参数 */
    await getPayParams(order.orderId)

    /* 显示支付弹窗 */
    showPayDialog.value = true

    /* 开始轮询订单状态 */
    startPayPolling(order.orderId)

    message.success('订单创建成功，请完成支付')
  } catch (error) {
    message.error('创建订单失败')
    console.error('创建订单失败:', error)
  } finally {
    submitting.value = false
  }
}

/* 开始支付轮询 */
const startPayPolling = (orderId: string) => {
  if (payPolling.value) {
    clearInterval(payPolling.value)
  }

  let pollCount = 0
  const maxPollCount = 60

  payPolling.value = setInterval(async () => {
    pollCount++
    if (pollCount > maxPollCount) {
      stopPayPolling()
      return
    }

    try {
      const order = await queryOrderStatus(orderId)
      if (order.status === 'paid') {
        stopPayPolling()
        showPayDialog.value = false
        message.success('支付成功！VIP已开通')
        fetchData()
      }
    } catch (error) {
      console.error('查询订单状态失败:', error)
    }
  }, 2000)
}

/* 停止支付轮询 */
const stopPayPolling = () => {
  if (payPolling.value) {
    clearInterval(payPolling.value)
    payPolling.value = null
  }
}

/* 关闭支付弹窗 */
const handleClosePayDialog = () => {
  stopPayPolling()
  showPayDialog.value = false
  currentOrder.value = null
}

/* 取消订单 */
const handleCancelOrder = () => {
  stopPayPolling()
  showPayDialog.value = false
  currentOrder.value = null
  message.info('订单已取消')
}

/* 组件挂载时获取数据 */
onMounted(() => {
  fetchData()
})

/* 组件卸载时清理 */
onUnmounted(() => {
  stopPayPolling()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 蓝色渐变头部 -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
        <div class="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>
      </div>
      <div class="relative container mx-auto px-4 py-12 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">
          升级VIP会员
        </h1>
        <p class="text-white/80 text-lg">
          解锁无限学习资源，享受专属特权服务
        </p>
      </div>
    </div>

    <!-- 当前VIP状态 -->
    <div class="container mx-auto px-4 -mt-6 mb-8">
      <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6 flex items-center justify-between w-full">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Icon name="material-symbols:crown" size="28" class="text-white"/>
          </div>
          <div>
            <div class="text-lg font-bold text-slate-800">
              {{ isVip ? 'VIP会员' : '普通用户' }}
            </div>
            <div class="text-sm text-slate-500">
              <template v-if="isVip">
                <span class="text-amber-600 font-medium">{{ vipLevelName }}</span>
                <span v-if="vipExpireTime" class="ml-2">
                  有效期至：{{ formatDate(vipExpireTime, 'YYYY-MM-DD') }}
                </span>
              </template>
              <template v-else>
                开通VIP，立享专属特权
              </template>
            </div>
          </div>
        </div>
        <el-tag v-if="isVip" type="warning" effect="dark" size="large" round>
          VIP专属
        </el-tag>
      </div>
    </div>

    <!-- 套餐选择区域 -->
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-10">
        <h2 class="text-2xl font-bold text-slate-800 mb-2">选择适合您的套餐</h2>
        <p class="text-slate-500">灵活选择，随时升级，享受更多学习特权</p>
      </div>

      <!-- 三列套餐卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full" v-loading="loading">
        <div
          v-for="pkg in packages"
          :key="pkg.id"
          class="package-card relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer"
          :class="[
            selectedPackage?.id === pkg.id
              ? pkg.isRecommended
                ? 'border-blue-500 shadow-xl shadow-blue-200 scale-[1.02]'
                : 'border-blue-400 shadow-lg scale-[1.02]'
              : 'border-slate-100 shadow-md hover:shadow-lg hover:border-blue-300 hover:scale-[1.01]'
          ]"
          @click="selectPackage(pkg)"
        >
          <!-- 推荐标签 -->
          <div
            v-if="pkg.isRecommended"
            class="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-full shadow-lg z-10"
          >
            <Icon name="material-symbols:star" size="14" class="inline mr-1"/>
            推荐
          </div>

          <!-- 选中标记 -->
          <div
            v-if="selectedPackage?.id === pkg.id"
            class="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg z-10"
          >
            <Icon name="material-symbols:check" size="20" class="text-white"/>
          </div>

          <!-- 套餐头部 -->
          <div class="p-6 text-center border-b border-slate-100">
            <h3 class="text-xl font-bold text-slate-800 mb-1">{{ pkg.name }}</h3>
            <p class="text-sm text-slate-500">{{ pkg.subtitle }}</p>
          </div>

          <!-- 价格区域 -->
          <div class="p-6 text-center">
            <div class="flex items-baseline justify-center gap-1 mb-2">
              <span class="text-lg text-blue-600">¥</span>
              <span class="text-5xl font-bold text-blue-600">{{ Math.floor(pkg.salePrice) }}</span>
              <span class="text-2xl text-blue-600">.{{ (pkg.salePrice % 1).toFixed(1).split('.')[1] }}</span>
            </div>
            <div class="text-sm text-slate-400 line-through mb-1">
              原价 ¥{{ pkg.originalPrice }}
            </div>
            <div class="text-sm text-emerald-600 font-medium">
              节省 ¥{{ getSavedAmount(pkg) }}
            </div>
          </div>

          <!-- 功能列表 -->
          <div class="px-6 pb-6">
            <div class="space-y-3">
              <div
                v-for="(feature, index) in pkg.features"
                :key="index"
                class="flex items-center gap-3 text-sm text-slate-600"
              >
                <div class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="material-symbols:check" size="14" class="text-blue-600"/>
                </div>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- 选择状态按钮 -->
          <div class="px-6 pb-6">
            <div
              class="w-full py-3 rounded-xl font-medium text-center transition-all duration-300"
              :class="[
                selectedPackage?.id === pkg.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-500'
              ]"
            >
              <span v-if="selectedPackage?.id === pkg.id" class="flex items-center justify-center gap-2">
                <Icon name="material-symbols:check-circle" size="18"/>
                已选择
              </span>
              <span v-else>选择套餐</span>
            </div>
          </div>

          <!-- 底部描述 -->
          <div class="px-6 pb-4 text-center">
            <p class="text-xs text-slate-400">{{ pkg.description }}</p>
          </div>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="w-full mt-12">
        <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
          <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Icon name="material-symbols:payments" size="20" class="text-blue-500"/>
            选择支付方式
          </h3>
          <div class="flex flex-wrap gap-4">
            <div
              class="pay-channel flex-1 min-w-[140px] cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all duration-300"
              :class="payChannel === 'alipay' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'"
              @click="payChannel = 'alipay'"
            >
              <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Icon name="simple-icons:alipay" size="24" class="text-white"/>
              </div>
              <div class="flex-1">
                <div class="font-medium text-slate-800">支付宝</div>
                <div class="text-xs text-slate-400">推荐使用</div>
              </div>
              <div
                v-if="payChannel === 'alipay'"
                class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
              >
                <Icon name="material-symbols:check" size="14" class="text-white"/>
              </div>
            </div>

            <div
              class="pay-channel flex-1 min-w-[140px] cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all duration-300"
              :class="payChannel === 'wechat' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-green-300'"
              @click="payChannel = 'wechat'"
            >
              <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <Icon name="simple-icons:wechat" size="24" class="text-white"/>
              </div>
              <div class="flex-1">
                <div class="font-medium text-slate-800">微信支付</div>
                <div class="text-xs text-slate-400">快捷支付</div>
              </div>
              <div
                v-if="payChannel === 'wechat'"
                class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
              >
                <Icon name="material-symbols:check" size="14" class="text-white"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单金额和购买按钮 -->
      <div class="w-full mt-6">
        <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div class="text-sm text-slate-500 mb-1">应付金额</div>
              <div class="flex items-baseline gap-1">
                <span class="text-lg text-slate-400">¥</span>
                <span class="text-4xl font-bold text-blue-600">{{ selectedPackage?.salePrice?.toFixed(2) ?? '0.00' }}</span>
              </div>
            </div>
            <button
              class="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium text-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!selectedPackage || submitting"
              @click="handlePurchase"
            >
              <span v-if="submitting" class="flex items-center gap-2">
                <Icon name="ep:loading" class="animate-spin"/>
                处理中...
              </span>
              <span v-else class="flex items-center gap-2">
                <Icon name="material-symbols:flash-on" size="20"/>
                立即开通
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- VIP权益展示 -->
      <div class="max-w-6xl mx-auto mt-16">
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-slate-800 mb-2">VIP专属权益</h2>
          <p class="text-slate-500">开通VIP，享受以下全部特权</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="benefit in benefits"
            :key="benefit.id"
            class="bg-white rounded-xl shadow-md shadow-blue-100/30 border border-blue-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                <Icon :name="benefit.icon" size="24" class="text-blue-600"/>
              </div>
              <div>
                <h4 class="font-bold text-slate-800 mb-1">{{ benefit.title }}</h4>
                <p class="text-sm text-slate-500 leading-relaxed">{{ benefit.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <el-dialog
      v-model="showPayDialog"
      title="扫码支付"
      width="420px"
      :close-on-click-modal="false"
      destroy-on-close
      class="pay-dialog"
      @close="handleClosePayDialog"
    >
      <div class="text-center py-6">
        <!-- 支付二维码区域 -->
        <div class="mb-6">
          <div class="w-52 h-52 mx-auto bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
            <div class="text-center">
              <div
                class="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-3"
                :class="payChannel === 'alipay' ? 'bg-blue-500' : 'bg-green-500'"
              >
                <Icon
                  :name="payChannel === 'alipay' ? 'simple-icons:alipay' : 'simple-icons:wechat'"
                  size="36"
                  class="text-white"
                />
              </div>
              <p class="text-sm text-slate-500">
                请使用{{ payChannel === 'alipay' ? '支付宝' : '微信' }}扫一扫
              </p>
              <p class="text-xs text-slate-400 mt-1">模拟支付二维码</p>
            </div>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="bg-slate-50 rounded-xl p-4 mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-slate-500">订单编号</span>
            <span class="text-slate-800 font-mono text-xs">{{ currentOrder?.orderId }}</span>
          </div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-slate-500">套餐名称</span>
            <span class="text-slate-800">{{ currentOrder?.packageName }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">支付金额</span>
            <span class="text-blue-600 font-bold text-lg">¥{{ currentOrder?.amount?.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 提示 -->
        <p class="text-xs text-slate-400">
          <Icon name="material-symbols:info" size="14" class="inline mr-1"/>
          请在倒计时内完成支付，超时订单将自动取消
        </p>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <el-button @click="handleCancelOrder">取消支付</el-button>
          <el-button type="primary" @click="handleClosePayDialog">
            <Icon name="material-symbols:check" size="14" class="mr-1"/>
            模拟支付完成
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
/* 套餐卡片悬停效果 */
.package-card {
  &:hover {
    transform: translateY(-4px);
  }
}

/* 支付渠道卡片 */
.pay-channel {
  &:hover {
    transform: translateY(-2px);
  }
}

/* 弹窗样式优化 */
:deep(.pay-dialog) {
  .el-dialog__header {
    margin: 0;
    padding: 20px 24px;
    border-bottom: 1px solid #e2e8f0;

    .el-dialog__title {
      font-weight: 600;
      color: #1e293b;
    }
  }

  .el-dialog__body {
    padding: 0 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid #e2e8f0;
  }
}

/* 按钮点击效果 */
button:active {
  transform: scale(0.98);
}

/* 选中动画 */
@keyframes selected-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.package-card.border-blue-500 {
  animation: selected-pulse 2s infinite;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .package-card {
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
