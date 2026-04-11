<template>
  <ClientOnly>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <!-- 蓝色渐变头部 -->
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>

        <!-- 装饰图案 -->
        <div class="absolute inset-0">
          <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
          <div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
          <div class="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>
        </div>

        <!-- 头部内容 -->
        <div class="relative container mx-auto px-4 py-8">
          <div class="flex items-center text-sm text-white/80 mb-4">
            <span class="cursor-pointer hover:text-white" @click="goBack">首页</span>
            <Icon name="ep:arrow-right" class="mx-2 text-xs"/>
            <span class="text-white">收银台</span>
          </div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            <Icon name="ep:wallet-filled" class="text-2xl"/>
            {{ newOrder ? '订单确认' : '待支付订单' }}
          </h1>
          <p class="text-white/80 mt-2">请确认订单信息并完成支付</p>
        </div>
      </div>

      <!-- 页面主体内容 -->
      <div class="container mx-auto px-4 py-6 pb-24">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- 左侧主内容 -->
          <div class="lg:col-span-8 space-y-6">
            <!-- 订单商品信息卡片 -->
            <div v-loading="infoLoading" class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
              <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Icon name="ep:goods-filled" class="text-blue-500"/>
                商品信息
              </h2>

              <!-- 商品信息 -->
              <div class="flex gap-4 p-4 bg-slate-50 rounded-xl">
                <el-image
                  v-if="orderInfo?.itemLogo"
                  :src="orderInfo?.itemLogo"
                  class="w-20 h-20 rounded-xl object-cover border border-blue-100"
                />
                <div v-else class="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Icon name="ep:document" class="text-3xl text-blue-400"/>
                </div>
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-slate-800">{{ orderInfo?.itemName }}</h3>
                    <p class="text-sm text-slate-500 mt-1">{{ orderInfo?.itemDescription }}</p>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-xs">
                      <span class="text-slate-500">原价：</span>
                      <span class="text-slate-400 line-through">¥{{ fen2yuan(orderInfo?.totalPrice) }}</span>
                    </div>
                    <div v-if="quantity" class="text-xs">
                      <span class="text-slate-500">数量：</span>
                      <span class="text-blue-600 font-medium">x {{ quantity }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right flex flex-col justify-end">
                  <div v-if="orderInfo?.discountPrice" class="text-xs mb-1">
                    <span class="text-slate-500">优惠：</span>
                    <span class="text-red-500 font-medium">-¥{{ fen2yuan(orderInfo?.discountPrice) }}</span>
                  </div>
                </div>
              </div>

              <!-- 优惠券选择 -->
              <div class="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="ep:ticket" class="text-amber-500 text-lg"/>
                    <span class="text-slate-700 font-medium">优惠券</span>
                  </div>
                  <div class="flex items-center">
                    <span v-if="selectedCoupon" class="text-red-500 font-bold mr-3">
                      -¥{{ fen2yuan(selectedCoupon.actualDiscountAmount) }}
                    </span>
                    <span v-else-if="availableCoupons.length > 0" class="text-amber-600 text-sm mr-3">
                      {{ availableCoupons.filter(c => c.isSatisfied).length }}张可用
                    </span>
                    <button
                      class="px-4 py-1.5 text-sm text-amber-600 bg-white border border-amber-200 rounded-full hover:bg-amber-50 transition-colors flex items-center gap-1"
                      @click="showCouponPanel = true"
                    >
                      {{ selectedCoupon ? '更换' : '选择优惠券' }}
                      <Icon name="ep:arrow-right" class="text-xs"/>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 支付方式 -->
              <div class="mt-6">
                <h3 class="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Icon name="ep:credit-card" class="text-blue-500"/>
                  选择支付方式
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <!-- 微信支付 -->
                  <div
                    class="payment-option relative p-4 rounded-xl border-2 cursor-pointer transition-all"
                    :class="paymentMethod === 'wechat' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-green-300'"
                    @click="paymentMethod = 'wechat'"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Icon name="fa:weixin" class="text-xl text-green-500"/>
                      </div>
                      <div>
                        <div class="font-medium text-slate-800">微信支付</div>
                        <div class="text-xs text-slate-500">推荐使用微信扫码</div>
                      </div>
                    </div>
                    <div v-if="paymentMethod === 'wechat'" class="absolute top-2 right-2">
                      <Icon name="ep:check" class="text-green-500 text-lg"/>
                    </div>
                  </div>

                  <!-- 支付宝 -->
                  <div
                    class="payment-option relative p-4 rounded-xl border-2 cursor-pointer transition-all"
                    :class="paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'"
                    @click="paymentMethod = 'alipay'"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon name="bi:alipay" class="text-xl text-blue-500"/>
                      </div>
                      <div>
                        <div class="font-medium text-slate-800">支付宝</div>
                        <div class="text-xs text-slate-500">数亿用户的选择</div>
                      </div>
                    </div>
                    <div v-if="paymentMethod === 'alipay'" class="absolute top-2 right-2">
                      <Icon name="ep:check" class="text-blue-500 text-lg"/>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 订单备注 -->
              <div class="mt-6">
                <h3 class="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Icon name="ep:edit-pen" class="text-blue-500"/>
                  订单备注
                </h3>
                <el-input
                  v-model="orderNote"
                  type="textarea"
                  placeholder="如有特殊要求，请在此备注（例如：开票信息、使用场景说明等）"
                  :rows="3"
                  class="rounded-lg"
                />
              </div>
            </div>

            <!-- 订单信息详情 -->
            <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
              <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Icon name="ep:info-filled" class="text-blue-500"/>
                订单详情
              </h2>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between py-2 border-b border-slate-100">
                  <span class="text-slate-500">订单编号</span>
                  <span class="text-slate-700 font-medium">{{ orderInfo?.no }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-slate-100">
                  <span class="text-slate-500">下单时间</span>
                  <span class="text-slate-700">{{ formatDate(orderInfo?.createTime) }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-slate-100">
                  <span class="text-slate-500">商品原价</span>
                  <span class="text-slate-700">¥{{ fen2yuan(orderInfo?.totalPrice) }}</span>
                </div>
                <div v-if="orderInfo?.discountPrice" class="flex justify-between py-2 border-b border-slate-100">
                  <span class="text-slate-500">活动优惠</span>
                  <span class="text-red-500">-¥{{ fen2yuan(orderInfo?.discountPrice) }}</span>
                </div>
                <div v-if="selectedCoupon" class="flex justify-between py-2 border-b border-slate-100">
                  <span class="text-slate-500">优惠券抵扣</span>
                  <span class="text-red-500">-¥{{ fen2yuan(selectedCoupon.actualDiscountAmount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧侧边栏 -->
          <div class="lg:col-span-4 space-y-6">
            <!-- 支付金额卡片 -->
            <div class="bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30 p-6 text-white">
              <h3 class="text-white/80 text-sm mb-2">应付金额</h3>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-bold">¥</span>
                <span class="text-5xl font-bold">{{ fen2yuan(finalPayPrice) }}</span>
              </div>
              <div v-if="selectedCoupon || orderInfo?.discountPrice" class="mt-4 pt-4 border-t border-white/20">
                <div class="flex justify-between text-sm">
                  <span class="text-white/70">已优惠</span>
                  <span class="text-amber-300 font-medium">
                    -¥{{ fen2yuan((orderInfo?.discountPrice || 0) + (selectedCoupon?.actualDiscountAmount || 0)) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 支付按钮 -->
            <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
              <button
                :disabled="loading"
                class="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                @click="payNow"
              >
                <Icon v-if="!loading" name="ep:lock"/>
                <el-icon v-else class="is-loading">
                  <Loading/>
                </el-icon>
                {{ loading ? '处理中...' : '立即支付' }}
              </button>
              <button
                class="w-full mt-3 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                @click="goBack"
              >
                返回
              </button>
              <p class="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                <Icon name="ep:shield"/>
                安全支付保障，请放心付款
              </p>
            </div>

            <!-- 支付帮助 -->
            <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
              <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Icon name="ep:question-filled" class="text-blue-500"/>
                支付帮助
              </h3>
              <div class="space-y-3 text-sm text-slate-600">
                <div class="flex items-start gap-2">
                  <Icon name="ep:check" class="text-green-500 mt-0.5"/>
                  <span>支付成功后，商品将自动到账</span>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="ep:check" class="text-green-500 mt-0.5"/>
                  <span>支持微信、支付宝多种支付方式</span>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="ep:check" class="text-green-500 mt-0.5"/>
                  <span>如遇支付问题，请联系客服</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 优惠券选择面板 -->
      <el-dialog v-model="showCouponPanel" title="选择优惠券" width="500px" destroy-on-close class="coupon-dialog">
        <div v-loading="couponLoading" class="coupon-list">
          <div
            v-for="coupon in availableCoupons"
            :key="coupon.id"
            class="coupon-item"
            :class="{
              'selected': selectedCoupon?.id === coupon.id,
              'disabled': !coupon.isSatisfied
            }"
            @click="coupon.isSatisfied ? selectCoupon(coupon) : null"
          >
            <div class="coupon-left">
              <div class="coupon-amount">
                <span class="currency">¥</span>
                <span class="value">{{ fen2yuan(coupon.actualDiscountAmount) }}</span>
              </div>
              <div v-if="coupon.minAmount > 0" class="coupon-condition">
                满¥{{ fen2yuan(coupon.minAmount) }}可用
              </div>
            </div>
            <div class="coupon-divider"/>
            <div class="coupon-right">
              <div class="coupon-name">{{ coupon.couponName }}</div>
              <div class="coupon-time">有效期至 {{ formatDate(coupon.validEndTime) }}</div>
              <div v-if="!coupon.isSatisfied" class="coupon-reason">{{ coupon.unsatisfiedReason }}</div>
            </div>
            <div class="coupon-check">
              <el-radio v-model="selectedCoupon" :label="coupon" :disabled="!coupon.isSatisfied"/>
            </div>
          </div>
          <div
            class="coupon-item none-option"
            :class="{ 'selected': !selectedCoupon }"
            @click="selectCoupon(null)"
          >
            <span class="text-slate-600">不使用优惠券</span>
            <el-radio :model-value="!selectedCoupon" label="none"/>
          </div>
          <el-empty v-if="availableCoupons.length === 0 && !couponLoading" description="暂无可用优惠券"/>
        </div>
        <template #footer>
          <el-button @click="showCouponPanel = false">取消</el-button>
          <el-button type="primary" class="bg-gradient-to-r from-blue-500 to-cyan-500 border-0" @click="showCouponPanel = false">
            确定
          </el-button>
        </template>
      </el-dialog>
    </div>
    <WechatBindForm ref="wechatBindRef"/>
    <QrDialog/>
  </ClientOnly>
</template>

<script setup lang="ts">
import {asyncSwapOrder, createOrder, getSwapOrderInfo, type OrderDetail} from '@/api/order'
import {PayOrderStatusEnum} from '@/utils/constants'
import {fetchOrderInfo} from '@/api/pay'
import {fen2yuan} from '@/utils/money'
import {formatDate} from '@/utils/formatTime'
import {getRootUrl} from '@/utils/routerHelper'
import platform from '@/platform'
import {getOrderAvailableCoupons, useCoupon} from '@/api/coupon'
import type {OrderAvailableCoupon} from "@/types/coupon";
import {Loading} from '@element-plus/icons-vue'

useHead({
  title: '收银台'
})

const message = useMessage()
const {query, path} = useRoute()

let newOrder = false
const itemId = query.id as unknown as number
const quantity = query.quantity as unknown as number
const orderType = query.orderType as unknown as string || 'goods'
const returnUrl = ref<string>('') /* 支付完的回调地址 */
const loading = ref(false)
const orderNote = ref('')

/* 模拟数据：工具信息 */
const orderInfo = ref<OrderDetail>()
const payStatus = ref(0) /* 0=检测支付环境, -2=未查询到支付单信息， -1=支付已过期， 1=待支付，2=订单已支付 */
const orderId = ref<number>(0)
/* 当前选择项 */
const paymentMethod = ref('alipay')
const interval = ref<any>(undefined) /* 定时任务，轮询是否完成支付 */
const wechatBindRef = ref()

/* 优惠券相关 */
const availableCoupons = ref<OrderAvailableCoupon[]>([])
const selectedCoupon = ref<OrderAvailableCoupon | null>(null)
const couponLoading = ref(false)
const showCouponPanel = ref(false)
const finalPayPrice = computed(() => {
  if (selectedCoupon.value) {
    return Math.max(0, (orderInfo.value?.payPrice || 0) - selectedCoupon.value.actualDiscountAmount)
  }
  return orderInfo.value?.payPrice || 0
})

/* 支付 */
const payNow = async () => {
  if (!paymentMethod.value) {
    message.warning('请选择支付方式')
    return
  }
  if (loading.value) return
  if (paymentMethod.value === 'wallet') {
    await message.confirm('确定要支付吗？')
  }
  loading.value = true
  try {
    if (newOrder) {
      const orderForm = {
        pointStatus: false,
        itemId,
        quantity,
        type: 3
      }
      const order = await createOrder(orderForm)
      if (!order) {
        message.error('创建订单失败')
        return
      }
      orderId.value = order.payOrderId
      /* 应用优惠券 */
      if (selectedCoupon.value) {
        await applyCoupon()
      }
    }

    platform.pay(paymentMethod.value, orderType, orderId.value,
      getRootUrl() + `${path}?orderId=${orderId.value}&returnUrl=${returnUrl.value}`)

    /* 打开轮询任务 */
    createQueryInterval()
  } catch (e) {
    console.log(e)
    message.error('支付失败')
  } finally {
    loading.value = false
  }
}

/** 轮询查询任务 */
const createQueryInterval = () => {
  if (interval.value) {
    return
  }
  if (!orderId.value) return
  interval.value = setInterval(async () => {
    const data = await fetchOrderInfo({id: orderId.value})
    /* 已支付 */
    if (data.status === PayOrderStatusEnum.SUCCESS.status) {
      clearQueryInterval()
      message.success('支付成功！')
      goReturnUrl('success')
    } else if (data.status !== PayOrderStatusEnum.WAITING.status) {
      clearQueryInterval()
      message.error('支付已关闭！')
      goReturnUrl('close')
    }
  }, 1000 * 2)
}

/** 清空查询任务 */
const clearQueryInterval = () => {
  /* 清空任务 */
  clearInterval(interval.value)
  interval.value = undefined
}

/* 返回 */
function goBack() {
  if (returnUrl.value && returnUrl.value.indexOf('http') === 0) {
    location.href = returnUrl.value
  } else if (returnUrl.value) {
    navigateTo(returnUrl.value)
  } else {
    location.href = '/'
  }
}

const infoLoading = ref(false)
const loadOrderInfo = async () => {
  infoLoading.value = true
  try {
    if (newOrder) {
      const orderForm = {
        pointStatus: false,
        itemId,
        quantity,
        type: 3
      }
      orderInfo.value = await getSwapOrderInfo(orderForm)
      /* 加载可用优惠券 */
      await loadAvailableCoupons()
    } else {
      const data = await fetchOrderInfo({id: orderId.value, sync: true})
      /* 1.2 无法查询到支付信息 */
      if (!data) {
        message.alertError('支付订单不存在，请检查！')
        setTimeout(() => {
          goReturnUrl('cancel')
        }, 3000)
        return
      }
      /* 1.3 如果已支付、或者已关闭，则直接跳转 */
      if (data.status === PayOrderStatusEnum.SUCCESS.status) {
        message.alertSuccess('支付成功, 正在返回支付前的页面，请稍后。')
        await asyncSwapOrder({
          merchantOrderId: data.merchantOrderId,
          payOrderId: data.id,
        })
        goReturnUrl('success')
        return
      } else if (data.status !== PayOrderStatusEnum.WAITING.status) {
        message.alertError('无法支付，原因：订单已关闭')
        setTimeout(() => {
          goReturnUrl('close')
        }, 3000)
        return
      }
      orderInfo.value = {
        itemName: data.subject,
        itemDescription: data.body,
        payPrice: data.price,
        totalPrice: data.price,
        createTime: data.createTime,
        no: String(data.merchantOrderId),
      }
      /* 设置支付状态 */
      checkPayStatus()
    }

    infoLoading.value = false
  } catch {
    message.error('当前无法查看支付信息，请稍后重试')
    return
  }
}

const checkPayStatus = () => {
  if (!orderInfo.value) return

  if (orderInfo.value.status === 10 || orderInfo.value.status === 20) {
    /* 支付成功 */
    payStatus.value = 2
    return
  }
  if (orderInfo.value.status === 30) {
    /* 支付关闭 */
    payStatus.value = -1
    return
  }
  payStatus.value = 1 /* 待支付 */
}

/**
 * 回到业务的 URL
 *
 * @param payResult 支付结果
 *                  ① success：支付成功
 *                  ② cancel：取消支付
 *                  ③ close：支付已关闭
 */
const goReturnUrl = (payResult: string) => {
  /* 清理任务 */
  clearQueryInterval()
  /* 未配置的情况下，只能关闭 */
  if (!returnUrl.value) {
    return
  }
  /* 如果有配置，且是 http 开头，则浏览器跳转 */
  location.href =
    returnUrl.value.indexOf('?') >= 0
      ? returnUrl.value + '&payResult=' + payResult
      : returnUrl.value + '?payResult=' + payResult
}

/* 加载可用优惠券 */
const loadAvailableCoupons = async () => {
  if (!orderInfo.value) return
  couponLoading.value = true
  try {
    const data = await getOrderAvailableCoupons({
      goodsId: itemId,
      orderAmount: orderInfo.value.totalPrice
    })
    availableCoupons.value = data || []
  } catch (e) {
    console.error('加载优惠券失败', e)
  } finally {
    couponLoading.value = false
  }
}

/* 选择优惠券 */
const selectCoupon = (coupon: OrderAvailableCoupon | null) => {
  selectedCoupon.value = coupon
  showCouponPanel.value = false
}

/* 应用优惠券到订单 */
const applyCoupon = async () => {
  if (!selectedCoupon.value || !orderId.value) return
  try {
    await useCoupon({
      userCouponId: selectedCoupon.value.id,
      orderId: orderId.value
    })
  } catch (e) {
    console.error('应用优惠券失败', e)
  }
}

onMounted(() => {
  if (query.returnUrl) {
    returnUrl.value = decodeURIComponent(query.returnUrl as unknown as string)
  }
  if (query.orderId) {
    orderId.value = query.orderId as unknown as number
  } else if (query.id) {
    newOrder = true
  } else if (query.event && query.event === 'bind') {
    payNow()
  } else {
    infoLoading.value = true
    message.alertError('未传递工具信息，请重新下单')
    setTimeout(() => {
      goBack()
    }, 2000)
    return
  }
  /* 获取订单信息 */
  loadOrderInfo()
})
</script>

<style scoped lang="scss">
/* 支付方式选项样式 */
.payment-option {
  position: relative;

  &:hover {
    transform: translateY(-2px);
  }
}

/* 优惠券列表样式 */
.coupon-list {
  max-height: 400px;
  overflow-y: auto;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.coupon-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.coupon-item.selected {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.coupon-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f9fafb;
}

.coupon-item.disabled:hover {
  border-color: #e5e7eb;
  box-shadow: none;
}

.coupon-item.none-option {
  justify-content: space-between;
}

.coupon-left {
  text-align: center;
  padding-right: 16px;
  min-width: 80px;
}

.coupon-amount {
  color: #ef4444;
  font-weight: 700;
}

.coupon-amount .currency {
  font-size: 14px;
}

.coupon-amount .value {
  font-size: 28px;
}

.coupon-condition {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.coupon-divider {
  width: 1px;
  height: 60px;
  background: linear-gradient(180deg, transparent 0%, #e5e7eb 50%, transparent 100%);
  margin: 0 16px;
}

.coupon-right {
  flex: 1;
}

.coupon-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.coupon-time {
  font-size: 12px;
  color: #6b7280;
}

.coupon-reason {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.coupon-check {
  margin-left: auto;
}

/* 对话框样式优化 */
:deep(.coupon-dialog .el-dialog__header) {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
  margin-right: 0;
}

:deep(.coupon-dialog .el-dialog__footer) {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

/* 输入框样式 */
:deep(.el-textarea__inner) {
  border-radius: 8px;
  resize: none;
}

:deep(.el-textarea__inner:focus) {
  border-color: #3b82f6;
}
</style>
