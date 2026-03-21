---
name: security-guard
description: |
  前端安全防护开发指南。当用户需要处理认证授权、Token管理、数据加密、XSS防护、CSRF防护、安全存储等前端安全相关功能时使用此技能。
  适用于 Nuxt 4 + Vue 3 前端项目。
  触发词：安全、认证、授权、Token、加密、XSS、CSRF、Sa-Token、登录安全
---

# 前端安全防护开发指南

## 何时使用

**适用场景**
- 用户认证与授权
- Token管理（AccessToken/RefreshToken）
- 敏感数据加密存储
- XSS攻击防护
- CSRF攻击防护
- 安全存储（localStorage/sessionStorage/Cookie）
- 请求签名与防篡改

**不适用场景**
- 后端安全策略配置
- 数据库安全防护
- 服务器安全配置
- 网络安全设备配置

---

## 核心概念

| 概念 | 说明 | 前端职责 |
|-----|------|---------|
| Authentication | 身份认证（你是谁）| 凭证传递、登录态管理 |
| Authorization | 权限授权（你能做什么）| 权限判断、菜单/按钮控制 |
| XSS | 跨站脚本攻击 | 输入过滤、输出转义 |
| CSRF | 跨站请求伪造 | Token验证、SameSite Cookie |
| MITM | 中间人攻击 | HTTPS强制、证书校验 |

---

## Token管理

### 1. useToken 封装

```typescript
// composables/useToken.ts
const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export function useToken() {
  // Access Token
  const token = useCookie(TOKEN_KEY, {
    maxAge: 60 * 60 * 24 * 7, // 7天
    sameSite: 'strict',
    secure: true // HTTPS only
  })

  // Refresh Token（更长的有效期）
  const refreshToken = useCookie(REFRESH_TOKEN_KEY, {
    maxAge: 60 * 60 * 24 * 30, // 30天
    sameSite: 'strict',
    secure: true
  })

  // 获取Token
  const getToken = () => token.value
  const getRefreshToken = () => refreshToken.value

  // 设置Token
  const setToken = (value: string) => {
    token.value = value
  }

  const setRefreshToken = (value: string) => {
    refreshToken.value = value
  }

  // 清除Token
  const clearToken = () => {
    token.value = null
    refreshToken.value = null
  }

  // Token是否有效（简单判断）
  const isTokenValid = () => {
    if (!token.value) return false
    // 可扩展：解析JWT检查过期时间
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }

  return {
    token: readonly(token),
    refreshToken: readonly(refreshToken),
    getToken,
    getRefreshToken,
    setToken,
    setRefreshToken,
    clearToken,
    isTokenValid
  }
}
```

### 2. HTTP请求自动附加Token

```typescript
// composables/useHttp.ts
export const httpGet = async (
  key: string,
  url: string,
  options: FetchOptions = {}
) => {
  const { getToken } = useToken()

  return await $fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getToken()}`
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // Token过期，尝试刷新或跳转登录
        handleTokenExpired()
      }
    }
  })
}

// Token过期处理
const handleTokenExpired = async () => {
  const { getRefreshToken, clearToken } = useToken()
  const refreshToken = getRefreshToken()

  if (refreshToken) {
    try {
      // 尝试刷新Token
      const res = await $fetch('/member/auth/refresh', {
        method: 'POST',
        body: { refreshToken }
      })
      const { setToken, setRefreshToken } = useToken()
      setToken(res.accessToken)
      setRefreshToken(res.refreshToken)
    } catch {
      // 刷新失败，跳转登录
      clearToken()
      navigateTo('/login')
    }
  } else {
    clearToken()
    navigateTo('/login')
  }
}
```

---

## 权限控制

### 1. 权限Store

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  username: string
  roles: string[]
  permissions: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref<UserInfo | null>(null)

  // 是否登录
  const isLogin = computed(() => !!userInfo.value)

  // 是否有某个角色
  const hasRole = (role: string) => {
    return userInfo.value?.roles?.includes(role) || false
  }

  // 是否有某个权限
  const hasPermission = (permission: string) => {
    return userInfo.value?.permissions?.includes(permission) || false
  }

  // 是否有任意一个权限
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(p => hasPermission(p))
  }

  // 是否有所有权限
  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every(p => hasPermission(p))
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  const logout = () => {
    userInfo.value = null
    const { clearToken } = useToken()
    clearToken()
  }

  return {
    userInfo: readonly(userInfo),
    isLogin,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    setUserInfo,
    logout
  }
}, {
  persist: {
    paths: ['userInfo']
  }
})
```

### 2. 权限指令

```typescript
// composables/usePermission.ts
export function usePermission() {
  const authStore = useAuthStore()

  // 检查权限
  const checkPermission = (permission: string | string[]) => {
    if (Array.isArray(permission)) {
      return authStore.hasAnyPermission(permission)
    }
    return authStore.hasPermission(permission)
  }

  // 检查角色
  const checkRole = (role: string | string[]) => {
    if (Array.isArray(role)) {
      return role.some(r => authStore.hasRole(r))
    }
    return authStore.hasRole(role)
  }

  return {
    checkPermission,
    checkRole
  }
}
```

### 3. 按钮级别权限

```vue
<template>
  <div>
    <!-- 单个权限 -->
    <el-button
      v-if="hasPermission('user:create')"
      type="primary"
    >
      新增用户
    </el-button>

    <!-- 多个权限（满足一个即可） -->
    <el-button
      v-if="hasAnyPermission(['user:edit', 'user:admin'])"
    >
      编辑
    </el-button>

    <!-- 角色判断 -->
    <el-button
      v-if="hasRole('admin')"
      type="danger"
    >
      删除（仅管理员）
    </el-button>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { hasPermission, hasAnyPermission, hasRole } = authStore
</script>
```

---

## XSS防护

### 1. 输入过滤

```typescript
// utils/xss.ts

// HTML转义
export const escapeHtml = (str: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  return str.replace(/[&<>"'/]/g, char => htmlEscapes[char])
}

// 富文本过滤（使用白名单）
export const sanitizeHtml = (html: string): string => {
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li']
  const allowedAttributes: Record<string, string[]> = {
    '*': ['class'],
    'a': ['href', 'title'],
    'img': ['src', 'alt']
  }

  // 使用DOM解析进行过滤
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const filterNode = (node: Element) => {
    // 检查标签是否允许
    if (!allowedTags.includes(node.tagName.toLowerCase())) {
      node.replaceWith(...Array.from(node.childNodes))
      return
    }

    // 检查属性
    Array.from(node.attributes).forEach(attr => {
      const allowed = allowedAttributes['*']?.includes(attr.name) ||
                     allowedAttributes[node.tagName.toLowerCase()]?.includes(attr.name)
      if (!allowed) {
        node.removeAttribute(attr.name)
      }
    })

    // 递归处理子节点
    Array.from(node.children).forEach(filterNode)
  }

  Array.from(doc.body.children).forEach(filterNode)
  return doc.body.innerHTML
}

// URL验证
export const isSafeUrl = (url: string): boolean => {
  // 只允许 http:// https:// mailto: tel:
  const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:']
  try {
    const parsed = new URL(url)
    return safeProtocols.includes(parsed.protocol)
  } catch {
    return false
  }
}
```

### 2. Vue 安全渲染

```vue
<template>
  <!-- ✅ 安全：自动转义 -->
  <div>{{ userInput }}</div>

  <!-- ⚠️ 危险：v-html 需要确保内容安全 -->
  <div v-html="sanitizeHtml(richText)"></div>

  <!-- ✅ 安全：动态URL验证 -->
  <a :href="safeUrl ? userUrl : '#'">{{ linkText }}</a>
</template>

<script setup lang="ts">
const userInput = ref('<script>alert("xss")</script>')
const richText = ref('<p>正常内容</p><script>alert("xss")</script>')
const userUrl = ref('javascript:alert("xss")')

const safeUrl = computed(() => isSafeUrl(userUrl.value))
</script>
```

---

## CSRF防护

### 1. Cookie安全配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Cookie配置
  cookie: {
    options: {
      sameSite: 'strict',  // 防止CSRF
      secure: true,        // HTTPS only
      httpOnly: false      // 前端需要读取，所以false
    }
  },

  // CORS配置
  routeRules: {
    '/app-api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': process.env.NUXT_BASE_URL,
        'Access-Control-Allow-Credentials': 'true'
      }
    }
  }
})
```

### 2. 请求携带CSRF Token

```typescript
// composables/useHttp.ts
export const httpPost = async (
  key: string,
  url: string,
  body?: any
) => {
  // 从Cookie或Meta标签获取CSRF Token
  const csrfToken = useCookie('csrf_token').value ||
                   document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

  return await $fetch(url, {
    method: 'POST',
    body,
    headers: {
      'X-CSRF-Token': csrfToken || ''
    }
  })
}
```

---

## 数据加密

### 1. RSA加密（用于敏感数据传输）

```typescript
// utils/rsa.ts
import JSEncrypt from 'jsencrypt'

const publicKey = import.meta.env.VITE_RSA_PUBLIC_KEY

// 加密
export const rsaEncrypt = (data: string): string => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(data) || ''
}

// 使用示例：密码加密传输
const login = async (username: string, password: string) => {
  const encryptedPassword = rsaEncrypt(password)
  await httpPost('login', '/member/login', {
    username,
    password: encryptedPassword
  })
}
```

### 2. AES加密（本地敏感数据存储）

```typescript
// utils/aes.ts
import CryptoJS from 'crypto-js'

const AES_KEY = import.meta.env.VITE_AES_KEY // 32位密钥

// AES加密
export const aesEncrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, AES_KEY).toString()
}

// AES解密
export const aesDecrypt = (encrypted: string): string => {
  const bytes = CryptoJS.AES.decrypt(encrypted, AES_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// 使用示例：加密存储敏感信息
const saveSensitiveData = (data: string) => {
  const encrypted = aesEncrypt(data)
  localStorage.setItem('sensitive_data', encrypted)
}

const getSensitiveData = (): string => {
  const encrypted = localStorage.getItem('sensitive_data')
  return encrypted ? aesDecrypt(encrypted) : ''
}
```

---

## 路由守卫

### 1. 登录验证

```typescript
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { isLogin } = useAuthStore()
  const { getToken } = useToken()

  // 需要登录的页面
  const authRoutes = ['/dashboard', '/profile', '/settings']
  const requiresAuth = authRoutes.some(route => to.path.startsWith(route))

  if (requiresAuth && !isLogin) {
    return navigateTo('/login?redirect=' + encodeURIComponent(to.fullPath))
  }

  // 已登录用户访问登录页，跳转到首页
  if (to.path === '/login' && isLogin) {
    return navigateTo('/')
  }
})
```

### 2. 权限守卫

```typescript
// middleware/permission.ts
export default defineNuxtRouteMiddleware((to) => {
  const { hasPermission } = useAuthStore()

  // 页面需要的权限
  const requiredPermission = to.meta.permission as string | undefined

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // 无权限，跳转403页面或首页
    return navigateTo('/403')
  }
})
```

---

## 最佳实践

1. **Token安全**
   - 使用HttpOnly Cookie存储敏感Token（如果后端支持）
   - Token设置合理的过期时间
   - 实现Token自动刷新机制
   - 退出登录时清除所有凭证

2. **XSS防护**
   - 不信任任何用户输入
   - 输出时进行HTML转义
   - 使用v-html时确保内容已过滤
   - 避免使用eval()和innerHTML

3. **CSRF防护**
   - 使用SameSite=Strict Cookie
   - 敏感操作使用CSRF Token
   - 验证Referer和Origin

4. **数据传输**
   - 使用HTTPS传输敏感数据
   - 敏感字段RSA加密
   - 实现请求签名防篡改

5. **本地存储**
   - 敏感数据加密存储
   - 避免在localStorage存储Token
   - 定期清理过期数据

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-21
