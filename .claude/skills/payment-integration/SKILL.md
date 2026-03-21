---
name: payment-integration
description: |
  支付集成开发指南。当用户需要接入微信支付、支付宝、处理退款、管理订单支付状态时使用此技能。
  适用于 Nuxt 4 + Vue 3 前端项目。
  触发词：微信支付、支付宝、支付、退款、订单支付、支付回调、收银台
---

# 支付集成开发指南

## 何时使用

**适用场景**
- 接入微信支付（H5/JSAPI/Native）
- 接入支付宝（H5/PC）
- 处理支付订单创建与管理
- 实现退款功能
- 处理支付回调通知
- 开发收银台页面

**不适用场景**
- 后端支付接口开发（纯前端项目）
- 不涉及支付业务的功能
- 第三方支付SDK的Native开发

---

## 支付类型速查

| 支付渠道 | 适用场景 | 前端角色 |
|---------|---------|---------|
| 微信支付-H5 | 移动端网页支付 | 调用后端接口获取支付参数，调起微信 |
| 微信支付-JSAPI | 公众号内支付 | 调用后端接口获取支付参数，调起微信 |
| 微信支付-Native | 扫码支付 | 获取支付二维码，展示给用户扫描 |
| 支付宝-H5 | 移动端网页支付 | 跳转或表单提交到支付宝 |
| 支付宝-PC | 电脑网站支付 | 跳转或表单提交到支付宝 |

---

## 核心流程

### 1. 支付下单流程

```
用户确认订单 → 调用创建支付订单API → 获取支付参数 → 调起支付SDK → 支付完成 → 查询支付结果
```

### 2. 前端支付页面实现

```vue
<template>
  <div class="page-container">
    <el-card class="order-info">
      <h3>订单确认</h3>
      <div class="flex justify-between py-3 border-b border-(--color-border)">
        <span class="text-(--color-text-secondary)">订单编号</span>
        <span>{{ orderInfo.orderNo }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-(--color-border)">
        <span class="text-(--color-text-secondary)">订单金额</span>
        <span class="text-(--color-danger) font-bold text-xl">¥{{ formatPrice(orderInfo.amount) }}</span>
      </div>
    </el-card>

    <!-- 支付方式选择 -->
    <el-card class="mt-4">
      <h3 class="mb-4">选择支付方式</h3>
      <div class="payment-methods space-y-3">
        <div
          v-for="method in paymentMethods"
          :key="method.code"
          class="payment-method flex items-center justify-between p-4 border border-(--color-border) rounded-lg cursor-pointer hover:border-(--el-color-primary) transition-all"
          :class="{ 'border-(--el-color-primary) bg-(--el-color-primary-light-9)': selectedMethod === method.code }"
          @click="selectedMethod = method.code"
        >
          <div class="flex items-center gap-3">
            <Icon :name="method.icon" class="text-2xl" />
            <span>{{ method.name }}</span>
          </div>
          <el-radio v-model="selectedMethod" :value="method.code" />
        </div>
      </div>
    </el-card>

    <!-- 支付按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-(--color-border)">
      <div class="container mx-auto flex items-center justify-between">
        <div>
          <span class="text-(--color-text-secondary)">实付金额：</span>
          <span class="text-(--color-danger) font-bold text-2xl">¥{{ formatPrice(orderInfo.amount) }}</span>
        </div>
        <el-button type="primary" size="large" :loading="paying" @click="handlePay">
          立即支付
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface PaymentMethod {
  code: string
  name: string
  icon: string
}

const paymentMethods: PaymentMethod[] = [
  { code: 'wechat_h5', name: '微信支付', icon: 'simple-icons:wechat' },
  { code: 'alipay_h5', name: '支付宝', icon: 'simple-icons:alipay' }
]

const selectedMethod = ref('wechat_h5')
const paying = ref(false)
const orderInfo = reactive({
  orderNo: '',
  amount: 0
})

// 格式化金额
const formatPrice = (price: number) => {
  return (price / 100).toFixed(2)
}

// 发起支付
const handlePay = async () => {
  paying.value = true
  try {
    // 1. 创建支付订单
    const payOrder = await httpPost('createPayOrder', '/member/pay/create', {
      orderId: orderInfo.orderNo,
      payChannel: selectedMethod.value,
      returnUrl: window.location.origin + '/pay/result'
    })

    // 2. 根据支付方式调起支付
    if (selectedMethod.value === 'wechat_h5') {
      // 微信H5支付：跳转到支付链接
      window.location.href = payOrder.payUrl
    } else if (selectedMethod.value === 'alipay_h5') {
      // 支付宝H5：通常是form表单提交
      const div = document.createElement('div')
      div.innerHTML = payOrder.formHtml
      document.body.appendChild(div)
      div.querySelector('form')?.submit()
    }
  } finally {
    paying.value = false
  }
}
</script>
```

---

## 微信支付（JSAPI）

### 1. 引入微信JS-SDK

```typescript
// composables/useWechatPay.ts
export function useWechatPay() {
  // 加载微信JS-SDK
  const loadWxSdk = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.wx) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // 调起支付
  const invokePay = async (payParams: {
    appId: string
    timeStamp: string
    nonceStr: string
    package: string
    signType: string
    paySign: string
  }) => {
    await loadWxSdk()
    return new Promise((resolve, reject) => {
      window.wx.chooseWXPay({
        ...payParams,
        success: (res: any) => resolve(res),
        fail: (err: any) => reject(err)
      })
    })
  }

  return { loadWxSdk, invokePay }
}
```

### 2. 微信JSAPI支付页面

```vue
<script setup lang="ts">
const { invokePay } = useWechatPay()
const message = useMessage()

const handleWechatPay = async () => {
  try {
    // 获取支付参数（后端返回）
    const payParams = await httpPost('getPayParams', '/member/pay/wechat/jsapi', {
      orderId: orderId.value
    })

    // 调起微信支付
    await invokePay(payParams)

    // 支付成功，查询订单状态
    await checkPayResult()
    message.success('支付成功')
  } catch (error) {
    message.error('支付失败，请重试')
  }
}
</script>
```

---

## 支付结果处理

### 1. 支付结果页面

```vue
<template>
  <div class="page-container flex flex-col items-center justify-center min-h-screen">
    <!-- 支付成功 -->
    <template v-if="status === 'success'">
      <Icon name="ep:circle-check-filled" class="text-6xl text-green-500 mb-4" />
      <h2 class="text-xl font-bold mb-2">支付成功</h2>
      <p class="text-(--color-text-secondary) mb-6">订单已支付成功，感谢您的购买</p>
      <div class="flex gap-4">
        <el-button @click="router.push('/orders')">查看订单</el-button>
        <el-button type="primary" @click="router.push('/')">返回首页</el-button>
      </div>
    </template>

    <!-- 支付失败 -->
    <template v-else-if="status === 'fail'">
      <Icon name="ep:circle-close-filled" class="text-6xl text-red-500 mb-4" />
      <h2 class="text-xl font-bold mb-2">支付失败</h2>
      <p class="text-(--color-text-secondary) mb-6">订单支付失败，请重新尝试</p>
      <div class="flex gap-4">
        <el-button @click="retryPay">重新支付</el-button>
        <el-button type="primary" @click="router.push('/')">返回首页</el-button>
      </div>
    </template>

    <!-- 处理中 -->
    <template v-else>
      <el-loading />
      <p class="mt-4 text-(--color-text-secondary)">正在查询支付结果...</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const status = ref<'loading' | 'success' | 'fail'>('loading')

const checkPayResult = async () => {
  try {
    const result = await httpGet('payResult', '/member/pay/result', {
      query: { orderNo: route.query.orderNo }
    })

    if (result.status === 'PAID') {
      status.value = 'success'
    } else if (result.status === 'FAILED') {
      status.value = 'fail'
    } else {
      // 轮询查询
      setTimeout(checkPayResult, 2000)
    }
  } catch {
    status.value = 'fail'
  }
}

onMounted(checkPayResult)
</script>
```

---

## 退款功能

```vue
<template>
  <el-dialog v-model="visible" title="申请退款" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item label="退款金额" prop="amount">
        <el-input-number v-model="form.amount" :max="maxRefundAmount" :min="0.01" :precision="2" />
        <span class="text-(--color-text-secondary) ml-2">最多可退 ¥{{ formatPrice(maxRefundAmount) }}</span>
      </el-form-item>
      <el-form-item label="退款原因" prop="reason">
        <el-select v-model="form.reason" placeholder="请选择退款原因">
          <el-option label="商品质量问题" value="quality_issue" />
          <el-option label="未按约定时间发货" value="delay" />
          <el-option label="其他原因" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入退款说明" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">提交申请</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const visible = ref(false)
const submitting = ref(false)
const maxRefundAmount = ref(0)
const form = reactive({
  orderId: '',
  amount: 0,
  reason: '',
  remark: ''
})

const rules = {
  amount: [{ required: true, message: '请输入退款金额' }],
  reason: [{ required: true, message: '请选择退款原因' }]
}

const open = (orderId: string, maxAmount: number) => {
  form.orderId = orderId
  maxRefundAmount.value = maxAmount
  form.amount = maxAmount
  visible.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await httpPost('applyRefund', '/member/refund/apply', {
      orderId: form.orderId,
      refundAmount: Math.round(form.amount * 100), // 转换为分
      reason: form.reason,
      remark: form.remark
    })
    message.success('退款申请已提交')
    visible.value = false
  } finally {
    submitting.value = false
  }
}

defineExpose({ open })
</script>
```

---

## 最佳实践

1. **支付安全**
   - 支付敏感操作必须由后端处理
   - 前端仅负责展示和调起支付
   - 支付结果以后端通知为准

2. **用户体验**
   - 支付按钮添加防抖，防止重复点击
   - 支付过程中显示 loading 状态
   - 支付失败提供重试机制
   - 支付超时提醒用户

3. **错误处理**
   - 网络异常时提示用户检查网络
   - 支付取消时友好提示
   - 支付失败记录日志便于排查

4. **金额处理**
   - 后端统一使用分（整数）存储金额
   - 前端展示时转换为元（保留2位小数）
   - 输入金额时进行校验

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-21
