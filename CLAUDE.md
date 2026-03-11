# CLAUDE.md - qBank项目

## 语言设置
**必须使用中文**与用户对话。

## MCP工具触发

｜触发词｜工具｜用途｜
｜---｜---｜---｜
| 深度分析、仔细思考、全面评估 | `sequential-thinking` | 链式推理，多步骤分析 |
| 最佳实践、官方文档、标准写法 | `context7` | Vue/Element Plus/UniApp等 |
| 打开浏览器、截图、检查元素 | `chrome-devtools` | 浏览器调试 |

### 端口约定

配置位置：`env.development`
默认端口为 90

> **每次用户提问时，UserPromptSubmit Hook 会注入技能评估提示（以 `## 强制技能激活流程` 开头）。**

**流程**
1. **评估**：根据注入的技能列表，列出匹配的技能及理由（无匹配则写"无匹配技能"）。
2. **激活**：对每个匹配的技能调用 `Skill(技能名)` 。
3. **实现**：激活完成后开始实现。

**Skill位置**：`.claude/skills/[skill-name]/SKILL.md`

---

## 项目基本信息

**项目名称**：学次元在线题库 (xcy-qthy)
**技术栈**：Nuxt 4 + Vue 3 + TypeScript + Element Plus + UnoCSS
**包管理器**：pnpm

---

## 目录结构规范

```
app/
├── api/                    # API接口定义
│   ├── user/              # 用户相关接口
│   ├── login/             # 登录相关接口
│   └── ...
├── components/            # 组件目录
│   ├── Card/             # 卡片组件（含index.ts入口）
│   ├── Cropper/          # 图片裁剪组件
│   ├── Upload/           # 上传组件
│   └── ...
├── composables/          # 组合式函数（自动导入）
│   ├── useHttp.ts        # HTTP请求封装
│   ├── useToken.ts       # Token管理
│   └── ...
├── config/               # 配置文件
│   └── config.ts         # 全局配置
├── layouts/              # 布局文件
├── pages/                # 页面路由（Nuxt约定式路由）
├── stores/               # Pinia状态管理
│   ├── auth.ts           # 认证状态
│   └── user.ts           # 用户状态
├── types/                # TypeScript类型定义
│   ├── user/             # 用户相关类型
│   └── qBank/            # 题库相关类型
├── utils/                # 工具函数
│   ├── lang.ts           # 国际化工具
│   ├── formatTime.ts     # 时间格式化
│   └── ...
├── assets/               # 静态资源
├── styles/               # 全局样式
├── plugins/              # Nuxt插件
└── i18n/                 # 国际化文件
```

---

## 页面开发强制要求（最高优先级）

**开发前必须：先读参考代码 -> 了解封装组件 -> 按相同风格编写**

### 参考代码位置

- **组件封装参考**：`app/components/ButtonCard.vue`、`app/components/Card/`
- **API定义参考**：`app/api/user/index.ts`
- **类型定义参考**：`app/types/user/index.d.ts`
- **页面参考**：`app/pages/index.vue`

### 强制使用封装组件

- **HTTP请求**：使用 `useHttp.ts` 提供的 `httpGet`、`httpPost`、`httpPut`、`httpUpload`
- **消息提示**：使用 `useMessage()` 代替 `ElMessage`
- **图标**：使用 `@nuxt/icon` 的 `<Icon name="xxx" />` 组件

---

## 核心架构（必须牢记）

| 项目 | 规范                                  |
| --- |-------------------------------------|
| 框架 | Nuxt 4 (SSR + CSR混合渲染)              |
| UI库 | Element Plus                        |
| CSS框架 | UnoCSS + SCSS                       |
| 状态管理 | Pinia + pinia-plugin-persistedstate |
| HTTP客户端 | Nuxt $fetch / useFetch 封装           |
| 图标 | @nuxt/icon (Iconify)                |
| 国际化 | @nuxtjs/i18n                        |

---

## 绝对禁止的写法

| 项目 | 错误做法 | 正确做法 |
| --- | --- | --- |
| CSS注释 | `// 注释内容` | `/* 注释内容 */` |
| HTTP请求 | 直接使用 `$fetch` 或 `axios` | 使用 `httpGet/httpPost` 等封装 |
| 消息提示 | `ElMessage.error()` | `useMessage().error()` |
| 样式单位 | `rem/em/vw/vh` | `px` |
| 服务端渲染 | 在组件内直接使用 `window`/`document` | 使用 `import.meta.client` 判断 |

### Bash/Shell 禁止项（最常犯错误！）

```bash
# ❌ 禁止：使用 > nul (Windows会创建名为nul的文件！)
command > nul
command 2> nul

# ✅ 正确：不使用任何输出重定向，或使用跨平台方式
command
# 如果必须抑制输出，使用：
command > /dev/null 2>&1
```
**为什么会出错**：Windows的`nul`设备在某些Shell环境下不被识别，会被当作普通文件名创建。

---

## API 路径规范

| 操作 | HTTP方法 | 路径格式 | 示例 |
| --- | --- | --- | --- |
| 查询 | GET | `/member/xxx/get` | `/member/user/get` |
| 列表 | GET | `/member/xxx/list` | `/member/user/list` |
| 分页 | GET | `/member/xxx/page` | `/member/user/page` |
| 创建 | POST | `/member/xxx/create` | `/member/user/create` |
| 更新 | PUT | `/member/xxx/update` | `/member/user/update` |
| 删除 | DELETE | `/member/xxx/delete` | `/member/user/delete` |
| 上传 | POST | `/infra/file/upload` | - |

---

## 前端核心规范

### API 定义规范

```typescript
// 文件位置：app/api/user/index.ts
import type { UserVO, UserProfileUpdateReqVO } from '~/types/user/user'
import { httpGet, httpUpload, httpPost, httpPut } from "~/composables/useHttp";

/**
 * 获取用户信息
 * @param key 请求标识（用于缓存）
 * @param url API路径
 * @param options 可选配置
 * @param server 是否在服务端执行
 */
export const getUser = async () => {
  return await httpGet('UserInfo', `/member/user/get`)
}

// 带参数的POST请求
export const updateUserProfile = (data: UserProfileUpdateReqVO) => {
  return httpPut('updateUser', '/member/user/update', data)
}

// 上传文件
export const uploadAvatar = (data: FormData) => {
  return httpUpload('uploadAvatar', '/member/user/update-avatar', data)
}

// 带查询参数的GET请求
export const getFavorites = async (query: any) => {
  return await httpGet('UserFavorites', `/cms/member/favorites`, {query})
}
```

### 类型定义规范

```typescript
// 文件位置：app/types/user/index.d.ts

/**
 * 用户视图对象（VO = View Object）
 */
export interface UserVO {
  id: number
  uid?: string
}

/**
 * 用户资料更新请求对象（ReqVO = Request VO）
 */
export interface UserProfileUpdateReqVO {
  nickname: string
}

// 扩展接口
export interface ExtendedUserVO extends UserVO {
  extraField?: string
}
```

### Composables 封装规范

```typescript
// 文件位置：app/composables/useXxx.ts

/**
 * 工具函数描述
 * @description 详细描述功能
 */
export function useXxx() {
  // 1. 定义响应式状态
  const state = ref<SomeType>()
  const loading = ref(false)

  // 2. 定义计算属性
  const computedValue = computed(() => {
    return state.value?.someField
  })

  // 3. 定义方法
  const fetchData = async (id: number) => {
    loading.value = true
    try {
      const res = await httpGet('xxx', `/api/xxx/${id}`)
      state.value = res
    } finally {
      loading.value = false
    }
  }

  // 4. 返回暴露的内容
  return {
    state,
    loading,
    computedValue,
    fetchData
  }
}
```

### Store 封装规范

```typescript
// 文件位置：app/stores/auth.ts
import { defineStore } from 'pinia'

interface StateType {
  // 定义状态类型
}

export const useAuthStore = defineStore('auth', () => {
  // 1. 定义响应式状态
  const isLogin = ref(false)

  // 2. 定义 Getter（计算属性）
  const isAuthenticated = computed(() => isLogin.value)

  // 3. 定义 Action（业务逻辑）
  const login = async (data: any) => {
    // 登录逻辑
  }
  // 4. 返回暴露的内容
  return {
    isLogin,
    isAuthenticated,
    login
  }
}, {
  // 持久化配置
  persist: {
    paths: ['isLogin']  // 指定需要持久化的字段
  }
})
```

### 组件封装规范

```vue
<template>
  <!-- 模板区域 -->
  <div class="component-name">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 1. Props 定义（使用 TypeScript 类型）
interface Props {
  title: string
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  disabled: false
})

// 2. Emits 定义
const emit = defineEmits<{
  click: [value: string]
  update: [value: number]
}>()

// 3. 组件逻辑
const handleClick = () => {
  emit('click', props.title)
}
</script>

<style scoped lang="scss">
/* ✅ CSS注释必须用 /* */
.component-name {
  padding: 16px;  /* 使用px单位 */
  background: var(--el-color-primary);  /* 使用Element Plus CSS变量 */
}
</style>
```

### 样式规范

```scss
// ✅ CSS注释必须用 /* */
/* 头部样式 */
.header {
  width: 100px;  /* 使用px单位 */
  background-color: var(--el-color-primary);  /* 使用Element Plus主题色 */

  /* 子元素 */
  .title {
    font-size: 16px;
  }
}

// 使用UnoCSS原子类
.btn-primary {
  @apply bg-blue-500 text-white px-4 py-2 rounded;
}
```

---

## 环境变量规范

```env
# .env.development

# 开发环境标识
NODE_ENV=development

# 项目本地运行端口号
NUXT_PORT=88

# 请求路径
NUXT_BASE_URL=http://127.0.0.1:38080

# 接口前缀
NUXT_API_URL=/app-api
```

---

## 常用工具函数

| 函数 | 位置 | 用途 |
| --- | --- | --- |
| `$t(key)` | `utils/lang.ts` | 国际化翻译 |
| `formatDate(date)` | `utils/formatTime.ts` | 日期格式化 |
| `encrypt(data)` | `utils/jsencrypt.ts` | RSA加密 |
| `decrypt(data)` | `utils/jsencrypt.ts` | RSA解密 |
| `useMessage()` | `composables/useMessage.ts` | 消息提示 |
| `useModal()` | `composables/useModal.ts` | 弹窗管理 |
| `useToken()` | `composables/useToken.ts` | Token管理 |

---

## 开发流程

### 1. 新增页面

```
1. 在 app/pages/ 下创建 .vue 文件
2. 如需布局，在 app/layouts/ 下创建布局
3. 在 app/api/ 下定义所需API
4. 在 app/types/ 下定义类型（如有新类型）
5. 使用已封装组件或新建组件
```

### 2. 新增组件

```
1. 在 app/components/ 下创建组件目录
2. 复杂组件使用目录结构：ComponentName/index.ts + ComponentName/src/xxx.vue
3. 简单组件直接创建 ComponentName.vue
4. 组件必须包含完整的 Props/Emits 类型定义
5. 样式使用 scoped，注释使用 /* */
```

### 3. 新增API

```
1. 在 app/api/ 下按模块创建目录
2. 在目录下创建 index.ts
3. 使用 httpGet/httpPost/httpPut/httpUpload/httpDelete 封装
4. 在 app/types/ 下定义请求/响应类型
5. 导出类型供组件使用
```

---

## 调试技巧

### 使用 Nuxt DevTools

按 `Shift + D` 打开 Nuxt DevTools，可查看：
- 组件树
- 路由信息
- Pinia 状态
- 网络请求

### 服务端渲染调试

```typescript
// 在服务端打印日志
if (import.meta.server) {
  console.log('服务端执行', data)
}

// 在客户端打印日志
if (import.meta.client) {
  console.log('客户端执行', data)
}
```

---

## 提交规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**：
```
feat(user): 添加用户资料编辑功能

- 新增用户资料编辑页面
- 添加头像上传功能
- 更新相关API和类型定义
```

---

## 常见问题

### 1. SSR 报错 window is not defined

**原因**：服务端没有 `window` 对象

**解决**：
```typescript
if (import.meta.client) {
  // 仅在客户端执行的代码
  const width = window.innerWidth
}
```

### 2. 组件自动导入不生效

**解决**：重启开发服务器，Nuxt会自动扫描 components 目录

### 3. Composables 自动导入不生效

**解决**：确保文件在 app/composables/ 目录下，且导出函数名以 `use` 开头

### 4. 样式不生效

**检查**：
1. 是否使用 scoped
2. 选择器是否正确
3. 是否使用了 `//` 注释（必须改用 `/* */`）

---

*文档最后更新：2026-03-10*
