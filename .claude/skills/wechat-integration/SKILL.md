---
name: wechat-integration
description: |
  微信集成开发指南。当用户需要实现微信登录、公众号授权、小程序登录、订阅消息等功能时使用此技能。
  适用于 Nuxt 4 + Vue 3 前端项目。
  触发词：微信登录、公众号授权、小程序登录、微信授权、openid、unionid、微信分享、订阅消息
---

# 微信集成开发指南

## 何时使用

**适用场景**
- 微信网页授权登录（公众号H5）
- 微信小程序登录
- 获取用户微信信息（昵称、头像）
- 微信分享功能配置
- 订阅消息授权与发送
- 微信支付（见 payment-integration 技能）

**不适用场景**
- 后端微信接口开发（纯前端项目）
- 微信原生APP开发
- 非微信生态的应用

---

## 核心概念

| 概念 | 说明 | 使用场景 |
|-----|------|---------|
| OpenID | 用户在某个微信应用下的唯一标识 | 同一用户在不同公众号OpenID不同 |
| UnionID | 用户在同一个微信开放平台下的唯一标识 | 打通多个公众号/小程序的用户身份 |
| AccessToken | 调用微信接口的凭证 | 获取用户信息等需要 |
| JS-SDK | 微信提供的JS接口 | 分享、拍照、定位等 |

---

## 微信网页授权（公众号H5）

### 1. 授权流程

```
用户访问页面 → 判断未登录 → 跳转微信授权页 → 用户同意授权 → 返回code → 用code换用户信息 → 完成登录
```

### 2. 授权页面实现

```vue
<template>
  <div class="page-container">
    <div v-if="loading" class="flex justify-center py-10">
      <el-loading />
    </div>

    <div v-else-if="needAuth" class="text-center py-10">
      <Icon name="simple-icons:wechat" class="text-6xl text-green-500 mb-4" />
      <h3 class="text-lg font-bold mb-2">微信授权登录</h3>
      <p class="text-(--color-text-secondary) mb-6">需要获取您的微信信息以完成登录</p>
      <el-button type="primary" @click="handleWechatAuth">
        <Icon name="simple-icons:wechat" class="mr-1" />
        微信一键登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const needAuth = ref(false)

// 微信授权配置
const WECHAT_APPID = 'your-app-id' // 在env中配置
const REDIRECT_URI = encodeURIComponent(window.location.origin + '/auth/wechat/callback')

// 发起微信授权
const handleWechatAuth = () => {
  const state = generateRandomState() // 生成随机state防止CSRF
  localStorage.setItem('wechat_auth_state', state)

  // 构建授权URL
  const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?` +
    `appid=${WECHAT_APPID}&` +
    `redirect_uri=${REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=snsapi_userinfo&` + // snsapi_userinfo 获取用户信息，snsapi_base 静默授权
    `state=${state}#wechat_redirect`

  window.location.href = authUrl
}

// 处理授权回调
const handleAuthCallback = async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  const savedState = localStorage.getItem('wechat_auth_state')

  // 验证state防止CSRF攻击
  if (state !== savedState) {
    message.error('授权验证失败')
    return
  }

  try {
    // 调用后端接口，用code换取用户信息
    const result = await httpPost('wechatLogin', '/member/auth/wechat-login', {
      code,
      state
    })

    // 保存登录状态
    const authStore = useAuthStore()
    authStore.setToken(result.token)
    authStore.setUserInfo(result.user)

    // 跳转到原页面或首页
    const redirect = route.query.redirect as string || '/'
    router.replace(redirect)
  } catch (error) {
    message.error('登录失败，请重试')
    needAuth.value = true
  }
}

onMounted(() => {
  // 如果是回调页面，处理code
  if (route.query.code) {
    handleAuthCallback()
  } else {
    loading.value = false
    needAuth.value = true
  }
})
</script>
```

---

## 微信JS-SDK（分享、扫一扫等）

### 1. 封装 useWechatSdk

```typescript
// composables/useWechatSdk.ts
import { httpGet } from '~/composables/useHttp'

export function useWechatSdk() {
  const isReady = ref(false)

  // 加载JS-SDK
  const loadSdk = () => {
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

  // 初始化配置
  const initConfig = async () => {
    await loadSdk()

    // 从后端获取签名配置
    const config = await httpGet('wechatConfig', '/member/wechat/jsconfig', {
      query: { url: window.location.href.split('#')[0] }
    })

    return new Promise<void>((resolve, reject) => {
      window.wx.config({
        debug: false,
        appId: config.appId,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: [
          'updateAppMessageShareData', // 分享给朋友
          'updateTimelineShareData',   // 分享到朋友圈
          'scanQRCode',              // 扫一扫
          'getLocation',             // 获取位置
          'openLocation'             // 打开位置
        ]
      })

      window.wx.ready(() => {
        isReady.value = true
        resolve()
      })

      window.wx.error((err: any) => {
        console.error('微信SDK初始化失败:', err)
        reject(err)
      })
    })
  }

  // 设置分享内容
  const setShareData = (data: {
    title: string
    desc: string
    link: string
    imgUrl: string
  }) => {
    if (!isReady.value) return

    // 分享给朋友
    window.wx.updateAppMessageShareData({
      ...data,
      success: () => console.log('分享设置成功')
    })

    // 分享到朋友圈
    window.wx.updateTimelineShareData({
      title: data.title,
      link: data.link,
      imgUrl: data.imgUrl,
      success: () => console.log('朋友圈分享设置成功')
    })
  }

  // 扫一扫
  const scanQRCode = () => {
    return new Promise((resolve, reject) => {
      window.wx.scanQRCode({
        needResult: 1, // 1直接返回扫描结果
        scanType: ['qrCode', 'barCode'],
        success: (res: any) => resolve(res.resultStr),
        fail: reject
      })
    })
  }

  return {
    isReady,
    initConfig,
    setShareData,
    scanQRCode
  }
}
```

### 2. 使用示例

```vue
<template>
  <div class="page-container">
    <el-card>
      <h3 class="mb-4">微信功能</h3>
      <div class="space-y-3">
        <el-button @click="handleShare">
          <Icon name="ep:share" /> 分享页面
        </el-button>
        <el-button @click="handleScan">
          <Icon name="ep:full-screen" /> 扫一扫
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const { initConfig, setShareData, scanQRCode } = useWechatSdk()

onMounted(async () => {
  // 初始化微信SDK
  try {
    await initConfig()
    // 设置默认分享内容
    setShareData({
      title: '学次元在线题库',
      desc: '海量题库，助你学习进步',
      link: window.location.href,
      imgUrl: window.location.origin + '/logo.png'
    })
  } catch (error) {
    console.error('微信SDK初始化失败', error)
  }
})

// 自定义分享
const handleShare = () => {
  setShareData({
    title: '我在学次元发现好题',
    desc: '快来看看这道题你会做吗？',
    link: window.location.href,
    imgUrl: window.location.origin + '/share.png'
  })
  message.success('点击右上角分享给朋友')
}

// 扫一扫
const handleScan = async () => {
  try {
    const result = await scanQRCode()
    message.success(`扫描结果: ${result}`)
    // 处理扫描结果，如跳转到对应页面
  } catch {
    message.error('扫描失败')
  }
}
</script>
```

---

## 微信小程序登录

### 小程序登录流程

```
小程序调用 wx.login → 获取 code → 发送到后端 → 后端用code换openid/session_key → 返回登录态
```

### 小程序前端代码（供参考）

```javascript
// 小程序端 pages/login/index.js
Page({
  data: {
    loading: false
  },

  // 微信一键登录
  async handleWechatLogin() {
    this.setData({ loading: true })
    try {
      // 1. 获取登录凭证
      const { code } = await wx.login()

      // 2. 获取用户信息（需用户授权）
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善用户资料'
      })

      // 3. 发送到后端登录
      const res = await wx.request({
        url: 'https://api.example.com/member/auth/mp-login',
        method: 'POST',
        data: {
          code,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv
        }
      })

      // 4. 保存token
      wx.setStorageSync('token', res.data.token)

      wx.showToast({ title: '登录成功' })
      wx.navigateBack()
    } catch (error) {
      wx.showToast({ title: '登录失败', icon: 'error' })
    } finally {
      this.setData({ loading: false })
    }
  }
})
```

---

## 订阅消息

### 1. 申请订阅

```vue
<template>
  <el-button type="primary" @click="requestSubscribe">
    <Icon name="ep:bell" /> 开启学习提醒
  </el-button>
</template>

<script setup lang="ts">
// 请求订阅消息授权（微信小程序）
const requestSubscribe = () => {
  // #ifdef MP-WEIXIN
  wx.requestSubscribeMessage({
    tmplIds: [
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // 每日学习提醒模板ID
      'yyyyyyyyyyyyyyyyyyyyyyyyyyyy'   // 考试通知模板ID
    ],
    success: (res) => {
      console.log('订阅结果:', res)
      if (res['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'] === 'accept') {
        message.success('订阅成功')
        // 通知后端记录订阅状态
        httpPost('saveSubscribe', '/member/wechat/subscribe', {
          templateIds: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        })
      } else {
        message.warning('需要授权才能接收提醒哦')
      }
    },
    fail: (err) => {
      console.error('订阅失败:', err)
      message.error('订阅失败')
    }
  })
  // #endif
}
</script>
```

---

## 最佳实践

1. **授权优化**
   - 首次进入不要立即弹授权，在用户需要时触发
   - 用户拒绝授权后，提供引导重新授权
   - 使用 `scope=snsapi_base` 静默授权获取openid

2. **登录态管理**
   - Token 存储在本地，设置合理过期时间
   - Token 过期后自动刷新或使用 refreshToken
   - 提供退出登录功能

3. **错误处理**
   - 网络异常时友好提示
   - 授权失败给出明确原因
   - 记录错误日志便于排查

4. **安全性**
   - 敏感操作（获取用户信息）由后端处理
   - state 参数防止CSRF攻击
   - code 只能使用一次，立即失效

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-21
