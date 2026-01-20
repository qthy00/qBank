<template>
  <ClientOnly>
    <div class="mx-auto">
      <el-card class="rounded-2xl" v-loading="infoLoading">
        <!-- 标题 -->
        <h2 class="text-2xl font-semibold text-[#409EFF] mb-8">
          {{ newOrder ? '订单确认' : '待支付订单' }}
        </h2>

        <!-- 工具信息 -->
        <div class="flex justify-between items-start my-4">
          <div class="flex items-center justify-start">
            <el-image
                v-if="orderInfo?.itemLogo"
                :src="orderInfo?.itemLogo"
                class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 class="text-lg font-medium">{{ orderInfo?.itemName }}</h3>
              <p class="text-gray-500 text-sm mt-1">{{ orderInfo?.itemDescription }}</p>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xs">
              <span>{{ newOrder ? '原价：' : '待支付：' }}</span>
              <span class="font-semibold text-base line-through"
              >¥{{ fen2yuan(orderInfo?.totalPrice) }}</span
              >
            </div>
            <div class="text-sm" v-if="orderInfo?.discountPrice">
              <span>优惠：</span>
              <span class="text-red-600 font-semibold text-xl"
              >¥{{ fen2yuan(orderInfo?.discountPrice) }}</span
              >
            </div>
            <div class="text-xs" v-if="quantity">
              <span>数量：</span>
              <span class="text-[#409EFF] font-semibold text-base">x {{ quantity }}</span>
            </div>
          </div>
        </div>

        <!-- 优惠券（简单实现） -->
        <!--      <el-form-item label="优惠券" class="my-6">-->
        <!--        <el-select v-model="selectedCoupon" placeholder="选择优惠券" class="w-full">-->
        <!--          <el-option-->
        <!--            v-for="coupon in coupons"-->
        <!--            :key="coupon.code"-->
        <!--            :label="coupon.label"-->
        <!--            :value="coupon"-->
        <!--          />-->
        <!--        </el-select>-->
        <!--      </el-form-item>-->

        <!-- 支付方式 -->
        <el-form-item label="支付方式" class="my-6">
          <el-radio-group v-model="paymentMethod" class="custom-radio-group">
            <!-- 微信支付 - 选中时绿色背景 -->
            <el-radio-button value="wechat" class="wx-radio">
              <div class="flex items-center">
                <Icon name="fa:weixin" class="mr-2"/>
                微信支付
              </div>
            </el-radio-button>

            <!-- 支付宝 - 选中时蓝色背景 -->
            <el-radio-button value="alipay" class="alipay-radio">
              <div class="flex items-center">
                <Icon name="bi:alipay" class="mr-2"/>
                支付宝
              </div>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 订单信息 -->
        <el-divider>订单信息</el-divider>
        <div class="text-sm text-gray-600 space-y-1 my-4">
          <div>订单编号：{{ orderInfo?.no }}</div>
          <div>下单时间：{{ formatDate(orderInfo?.createTime) }}</div>
        </div>

        <el-form-item label="订单备注" class="my-4">
          <el-input
              type="textarea"
              v-model="orderNote"
              placeholder="例如：开票信息、使用场景说明等"
              :rows="3"
          />
        </el-form-item>

        <!-- 价格汇总 -->
        <div class="flex justify-between items-center font-semibold text-lg my-8">
          <span>应付金额</span>
          <span class="text-red-600 text-2xl">¥{{ fen2yuan(orderInfo?.payPrice) }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-3 my-8">
          <el-button type="info" plain size="large" @click="goBack">返回工具市场</el-button>
          <el-button
              :loading="loading"
              :disabled="loading"
              type="primary"
              size="large"
              class="bg-[#409EFF]"
              @click="payNow"
          >
            立即支付
          </el-button>
        </div>
      </el-card>
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
import {getRootUrl} from '@/utils/routerHelper.ts'
import platform from '@/platform'

useHead({
  title: '收银台'
})

const message = useMessage()
const {query, path} = useRoute()

let newOrder = false
const itemId = query.id as unknown as number
const quantity = query.quantity as unknown as number
const orderType = query.orderType as unknown as string || 'goods'
const returnUrl = ref<string>('') // 支付完的回调地址
const loading = ref(false)
const orderNote = ref('')

// 模拟数据：工具信息
const orderInfo = ref<OrderDetail>()
const payStatus = ref(0) // 0=检测支付环境, -2=未查询到支付单信息， -1=支付已过期， 1=待支付，2=订单已支付
const orderId = ref<number>(0)
// 当前选择项
const paymentMethod = ref('alipay')
const interval = ref<any>(undefined) // 定时任务，轮询是否完成支付
const wechatBindRef = ref()

// 支付
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
      }
      const order = await createOrder(orderForm)
      if (!order) {
        message.error('创建订单失败')
        return
      }
      orderId.value = order.payOrderId
    }

    platform.pay(paymentMethod.value, orderType, orderId.value,
        getRootUrl() + `${path}?orderId=${orderId.value}&returnUrl=${returnUrl.value}`)

    // 打开轮询任务
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
    // 已支付
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
  // 清空任务
  clearInterval(interval.value)
  interval.value = undefined
}

// 返回
function goBack() {
  if (returnUrl.value && returnUrl.value.indexOf('http') === 0) {
    location.href = returnUrl.value
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
      }
      orderInfo.value = await getSwapOrderInfo(orderForm)
    } else {
      const data = await fetchOrderInfo({id: orderId.value, sync: true})
      // 1.2 无法查询到支付信息
      if (!data) {
        message.alertError('支付订单不存在，请检查！')
        setTimeout(() => {
          goReturnUrl('cancel')
        }, 3000)
        return
      }
      // 1.3 如果已支付、或者已关闭，则直接跳转
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
        no: data.merchantOrderId,
      }
      // 设置支付状态
      checkPayStatus()
    }

    infoLoading.value = false
  } catch (e) {
    message.error('当前无法查看支付信息，请稍后重试')
    return
  }
}

const checkPayStatus = () => {
  if (!orderInfo.value) return

  if (orderInfo.value.status === 10 || orderInfo.value.status === 20) {
    // 支付成功
    payStatus.value = 2
    return
  }
  if (orderInfo.value.status === 30) {
    // 支付关闭
    payStatus.value = -1
    return
  }
  payStatus.value = 1 // 待支付
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
  // 清理任务
  clearQueryInterval()
  // 未配置的情况下，只能关闭
  if (!returnUrl.value) {
    return
  }
  // 如果有配置，且是 http 开头，则浏览器跳转
  location.href =
      returnUrl.value.indexOf('?') >= 0
          ? returnUrl.value + '&payResult=' + payResult
          : returnUrl.value + '?payResult=' + payResult
}

// const loadPayMethods = async () => {
//   const data = await getEnableChannelCodeList(orderInfo.appId)
//   payMethods.value = getPayMethods(data)
// }

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
  // 获取订单信息
  loadOrderInfo()
})
</script>

<style scoped lang="scss">
.el-card {
  background-color: #ffffff;
}

/* 自定义单选按钮组样式 */
.custom-radio-group {
  --el-radio-button-active-color: transparent; /* 清除默认激活色 */
}

/* 微信支付选中样式 */
:deep(.wx-radio.is-active) {
  background-color: #07c160 !important; /* 微信绿 */
  border-radius: 4px 0 0 4px;
}

:deep(.wx-radio.is-active .el-radio-button__inner) {
  color: white !important; /* 选中时文字白色 */
  border-color: #07c160 !important;
  background-color: transparent !important;
}

/* 支付宝选中样式 */
:deep(.alipay-radio.is-active) {
  background-color: #1677ff !important; /* 支付宝蓝 */
  border-radius: 0 4px 4px 0;
}

:deep(.alipay-radio.is-active .el-radio-button__inner) {
  color: white !important; /* 选中时文字白色 */
  border-color: #1677ff !important;
  background-color: transparent !important;
}

/* 未选中时的样式优化 */
:deep(.el-radio-button__inner) {
  transition: all 0.3s ease;
}
</style>
