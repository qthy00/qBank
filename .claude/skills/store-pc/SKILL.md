---
name: store-pc
description: |
  前端 PC 端状态管理（Pinia）使用指南。当用户需要使用 Pinia、状态管理、useUserStore、全局状态、持久化存储等功能时使用此技能。
  适用于 xcy-nuxt（Nuxt 4 + Vue 3）项目，提供 Composition API 风格的 Store 创建、使用、持久化配置等最佳实践。
  触发词：Pinia、Store、状态管理、useUserStore、useAuthStore、全局状态、持久化、状态共享、defineStore
---

# 前端 PC 端状态管理指南

## 何时使用

✅ **适用场景**
- 创建新的 Pinia Store
- 管理全局状态（用户信息、应用配置等）
- 用户状态持久化（登录态、设置偏好）
- 跨组件状态共享
- 状态管理重构

❌ **不适用场景**
- 纯后端开发
- 小程序/移动端开发（使用 store-mobile 技能）

---

## Store 规范

### 1. Store 目录结构

```
app/
├── stores/
│   ├── auth.ts          # 认证状态（登录态、Token）
│   ├── user.ts          # 用户状态（用户信息、收藏等）
│   ├── app.ts           # 应用状态（设备类型、配置）
│   ├── qbank.ts         # 题库状态（练习设置、筛选条件）
│   └── dict.ts          # 字典状态（数据字典缓存）
```

> **注意**：项目使用平级目录结构，无需 `modules` 子目录。Nuxt 自动扫描 `app/stores/` 目录。

### 2. Store 创建规范（Composition API）

本项目使用 **Composition API 风格** 编写 Store：

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import type { UserVO } from '~/types/user'
import { getUser, getInfo } from '~/api/user'

export const useUserStore = defineStore('user', () => {
  // 1. 定义响应式状态
  const isSetUser = ref(false)
  const user = reactive<UserVO>({
    id: 0,
    avatar: '',
    nickname: '新用户'
  })
  const favoriteTools = ref<number[]>([])

  // 2. 定义 Getter（计算属性）
  const isLoggedIn = computed(() => isSetUser.value && user.id > 0)
  const displayName = computed(() => user.nickname || '匿名用户')

  // 3. 定义 Action（业务逻辑方法）
  const fetchUserInfo = async () => {
    const data = await getInfo()
    if (!data) {
      useMessage().error('获取用户信息失败')
      return
    }
    Object.assign(user, data)
    isSetUser.value = true
  }

  const setUserAvatar = (avatar: string) => {
    user.avatar = avatar
  }

  const resetState = () => {
    isSetUser.value = false
    Object.assign(user, { id: 0, avatar: '', nickname: '' })
    favoriteTools.value = []
  }

  // 4. 返回需要暴露的状态和方法（核心：必须返回才能在组件中使用）
  return {
    // 状态
    isSetUser,
    user,
    favoriteTools,
    // Getters
    isLoggedIn,
    displayName,
    // Actions
    fetchUserInfo,
    setUserAvatar,
    resetState
  }
}, {
  // 持久化配置
  persist: {
    paths: ['user', 'favoriteTools']  // 只持久化指定字段
  }
})
```

### 3. 命名规范

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| Store 函数 | use + 功能名 + Store | `useUserStore`, `useAuthStore` |
| Store ID | 小写驼峰/短横线 | `'user'`, `'qbank'` |
| 状态变量 | ref/reactive | `isLogin`, `userInfo` |
| 计算属性 | computed | `isLoggedIn`, `displayName` |
| 方法 | 动词开头 | `fetchUserInfo`, `resetState` |

---

## Store 使用

### 1. 在组件/页面中使用

```vue
<script setup lang="ts">
// 自动导入：无需手动 import
const userStore = useUserStore()
const authStore = useAuthStore()

// 解构时需要使用 storeToRefs 保持响应式
const { user, isLoggedIn } = storeToRefs(userStore)

// 方法直接解构即可（方法不具备响应性）
const { fetchUserInfo, resetState } = userStore

// 直接使用
const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/login')
}
</script>

<template>
  <div>
    <span v-if="isLoggedIn">{{ user.nickname }}</span>
    <el-button v-else @click="navigateTo('/login')">登录</el-button>
  </div>
</template>
```

### 2. 在 Composables 中使用

```typescript
// composables/usePermission.ts
export const usePermission = () => {
  const userStore = useUserStore()
  const authStore = useAuthStore()

  const checkPermission = (code: string) => {
    return authStore.permissions.includes(code)
  }

  return {
    checkPermission
  }
}
```

### 3. Store 间相互调用

```typescript
// stores/auth.ts
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()  // 调用其他 Store
  const { setTokens, clearTokens } = useToken()

  const isLogin = ref(false)

  const login = async (data: LoginForm) => {
    const res = await LoginApi.login(data)
    isLogin.value = true
    setTokens(res.accessToken, res.refreshToken)
    await userStore.fetchUserInfo()  // 调用其他 Store 的方法
  }

  const logout = async () => {
    await LoginApi.logout()
    isLogin.value = false
    clearTokens()
    userStore.resetState()  // 调用其他 Store 的方法
  }

  return {
    isLogin,
    login,
    logout
  }
}, {
  persist: {
    paths: ['isLogin']
  }
})
```

---

## 状态持久化

### 1. 基础配置

```typescript
// 持久化全部状态
export const useAppStore = defineStore('app', () => {
  const sidebar = ref({ opened: true })
  const device = ref('desktop')

  return { sidebar, device }
}, {
  persist: true  // 全部持久化到 localStorage
})
```

### 2. 选择性持久化

```typescript
// 只持久化指定字段
export const useUserStore = defineStore('user', () => {
  const user = ref<UserVO>({})
  const isSetUser = ref(false)  // 不持久化
  const tempData = ref({})       // 不持久化

  return { user, isSetUser, tempData }
}, {
  persist: {
    paths: ['user']  // 只持久化 user
  }
})
```

### 3. 复杂持久化配置

```typescript
export const useAuthStore = defineStore('auth', () => {
  const isLogin = ref(false)
  const loginForm = reactive({ account: '', password: '' })
  const openid = ref<string>()

  return { isLogin, loginForm, openid }
}, {
  persist: {
    paths: ['isLogin', 'loginForm', 'openid']
  }
})
```

---

## SSR 注意事项

在 Nuxt SSR 环境下，需要判断客户端/服务端：

```typescript
export const useAppStore = defineStore('app', () => {
  const isMobile = ref(false)

  const checkIsMobile = () => {
    // ✅ 正确：判断客户端环境
    if (!import.meta.client) {
      return
    }
    isMobile.value = /Android|iPhone/i.test(navigator.userAgent)
  }

  const init = () => {
    if (!import.meta.client) {
      return
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
  }

  return { isMobile, init }
}, {
  persist: true
})
```

---

## 最佳实践

### DO ✅

```typescript
// 1. 使用 TypeScript 类型
interface UserState {
  id: number
  nickname: string
  avatar: string
}

const user = reactive<UserState>({
  id: 0,
  nickname: '',
  avatar: ''
})

// 2. 使用计算属性作为 Getter
const isLoggedIn = computed(() => user.id > 0)

// 3. Actions 处理异步操作
const fetchUserInfo = async () => {
  try {
    const data = await getUser()
    Object.assign(user, data)
  } catch (error) {
    useMessage().error('获取失败')
  }
}

// 4. 提供重置方法
const resetState = () => {
  Object.assign(user, { id: 0, nickname: '', avatar: '' })
}

// 5. 模块化拆分（一个 Store 负责一块独立业务）
// stores/
// ├── auth.ts      # 认证相关
// ├── user.ts      # 用户信息相关
// ├── app.ts       # 应用配置相关
// └── qbank.ts     # 题库业务相关
```

### DON'T ❌

```typescript
// 1. 不要在 Store 中直接操作 DOM
const badAction = () => {
  document.title = 'xxx'  // 错误！
}

// 2. 不要直接解构响应式状态（会失去响应性）
const { user } = useUserStore()  // ❌ user 不再响应
// 应该：
const { user } = storeToRefs(useUserStore())  // ✅ 保持响应性

// 3. 不要把所有状态放在一个大 Store 中
// 错误：一个 Store 包含用户、权限、设置、题库等所有状态

// 4. 不要在服务端访问 window/document
const badInit = () => {
  window.innerWidth  // ❌ SSR 会报错
  // 应该：
  if (import.meta.client) {
    window.innerWidth  // ✅ 安全
  }
}
```

---

## 完整示例：认证 Store

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { useUserStore } from './user'
import * as LoginApi from '~/api/login'

interface LoginForm {
  account: string
  password: string
  rememberMe: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()
  const { setTokens, clearTokens } = useToken()
  const message = useMessage()

  // State
  const isLogin = ref(false)
  const loginForm = reactive<LoginForm>({
    account: '',
    password: '',
    rememberMe: true
  })
  const openid = ref<string>()

  // Getters
  const decryptedLoginForm = computed(() => ({
    ...loginForm,
    password: loginForm.password ? decrypt(loginForm.password) as string : ''
  }))

  // Actions
  const setLoginForm = (data: LoginForm) => {
    loginForm.account = data.account
    loginForm.password = data.password ? encrypt(data.password) as string : ''
    loginForm.rememberMe = data.rememberMe
  }

  const login = async (data: any) => {
    const res = await LoginApi.login(data)
    if (!res) throw new Error('登录失败')

    isLogin.value = true
    openid.value = res.openid
    setTokens(res.accessToken, res.refreshToken)
    await userStore.fetchUserInfo()
    message.success('登录成功')
  }

  const logout = async (api: boolean = true) => {
    if (api) await LoginApi.logout()

    isLogin.value = false
    clearTokens()
    userStore.resetState()
    message.success('已退出登录')
  }

  const clearAllCache = (keepTheme: boolean = true) => {
    try {
      if (keepTheme) {
        const theme = localStorage.getItem('vueuse-color-scheme')
        localStorage.clear()
        if (theme) localStorage.setItem('vueuse-color-scheme', theme)
      } else {
        localStorage.clear()
      }
      sessionStorage.clear()
      message.success('缓存已清空')
    } catch (error) {
      message.error('清空缓存失败')
    }
  }

  return {
    isLogin,
    loginForm,
    openid,
    decryptedLoginForm,
    setLoginForm,
    login,
    logout,
    clearAllCache
  }
}, {
  persist: {
    paths: ['isLogin', 'loginForm', 'openid']
  }
})
```

---

## 相关文件

| 文件路径 | 说明 |
|----------|------|
| `app/stores/auth.ts` | 认证状态管理 |
| `app/stores/user.ts` | 用户状态管理 |
| `app/stores/app.ts` | 应用状态管理 |
| `app/stores/qbank.ts` | 题库业务状态 |
| `app/composables/useToken.ts` | Token 管理封装 |
| `app/composables/useMessage.ts` | 消息提示封装 |

---

**文档版本**: v2.0
**适用项目**: xcy-nuxt (Nuxt 4 + Vue 3 + Pinia)
**最后更新**: 2026-03-20
