---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
  - "**/*.vue"
---

# TypeScript/JavaScript 编码风格

> 本文件基于 [common/coding-style.md](../common/coding-style.md) 扩展，包含 TypeScript/JavaScript 特定内容。

## 类型与接口

使用类型使公共 API、共享模型和组件属性显式化、可读且可复用。

### 公共 API

* 为导出的函数、共享工具函数和公共类方法添加参数类型和返回类型
* 让 TypeScript 推断明显的局部变量类型
* 将重复的内联对象结构提取为命名类型或接口

```typescript
// WRONG: Exported function without explicit types
export function formatUser(user) {
  return `${user.firstName} ${user.lastName}`
}

// CORRECT: Explicit types on public APIs
interface User {
  firstName: string
  lastName: string
}

export function formatUser(user: User): string {
  return `${user.firstName} ${user.lastName}`
}
```

### 接口与类型别名

* 使用 `interface` 定义可能被扩展或实现的对象结构
* 使用 `type` 定义联合类型、交叉类型、元组、映射类型和工具类型
* 优先使用字符串字面量联合类型而非 `enum`，除非需要 `enum` 以实现互操作性

```typescript
interface User {
  id: string
  email: string
}

type UserRole = 'admin' | 'member'
type UserWithRole = User & {
  role: UserRole
}
```

### 避免使用 `any`

* 在应用程序代码中避免使用 `any`
* 对外部或不受信任的输入使用 `unknown`，然后安全地缩小其类型范围
* 当值的类型依赖于调用者时，使用泛型

```typescript
// WRONG: any removes type safety
function getErrorMessage(error: any) {
  return error.message
}

// CORRECT: unknown forces safe narrowing
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}
```

### React 属性

* 使用命名的 `interface` 或 `type` 定义组件属性
* 显式地定义回调属性类型
* 除非有特定原因，否则不要使用 `React.FC`

```typescript
interface User {
  id: string
  email: string
}

interface UserCardProps {
  user: User
  onSelect: (id: string) => void
}

function UserCard({ user, onSelect }: UserCardProps) {
  return <button onClick={() => onSelect(user.id)}>{user.email}</button>
}
```

### JavaScript 文件

* 在 `.js` 和 `.jsx` 文件中，当类型能提高清晰度且迁移到 TypeScript 不可行时，使用 JSDoc
* 保持 JSDoc 与运行时行为一致

```javascript
/**
 * @param {{ firstName: string, lastName: string }} user
 * @returns {string}
 */
export function formatUser(user) {
  return `${user.firstName} ${user.lastName}`
}
```

## Vue 3 + Element Plus 特定规范

### Vue 3 组合式 API 规范

ui-admin 和 ui-admin-vben 项目使用 Vue 3 + 组合式 API：

```typescript
// ✅ GOOD: 使用组合式 API + TypeScript
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User } from '@/api/system/user'
import { getUserApi } from '@/api/system/user'

// 类型定义
interface FormState {
  name: string
  email: string
}

// 响应式状态
const loading = ref(false)
const userList = ref<User[]>([])
const formState = ref<FormState>({
  name: '',
  email: ''
})

// 计算属性
const filteredUsers = computed(() => {
  return userList.value.filter(user => user.status === 0)
})

// 方法
const fetchUsers = async () => {
  loading.value = true
  try {
    const { data } = await getUserApi()
    userList.value = data
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  fetchUsers()
})
</script>
```

### 组件结构规范

```vue
<template>
  <!-- Element Plus 组件使用 -->
  <el-card class="user-card">
    <el-form :model="formState" :rules="rules" ref="formRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formState.username" placeholder="请输入用户名" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
// 1. Vue 核心导入
import { ref, reactive, computed } from 'vue'

// 2. 第三方库导入
import { ElMessage, ElMessageBox } from 'element-plus'

// 3. 本地组件导入
import UserSelect from './components/UserSelect.vue'

// 4. API 导入（芋道项目规范）
import { getUserApi, createUserApi } from '@/api/system/user'
import type { UserSaveReqVO } from '@/api/system/user'

// 5. 组合式函数/hooks 导入
import { useUserStore } from '@/store/modules/user'
import { useMessage } from '@/hooks/useMessage'

// 6. 工具函数导入
import { formatDate } from '@/utils/date'

// 组件逻辑...
</script>

<style scoped lang="scss">
/* 组件样式 */
.user-card {
  margin-bottom: 20px;
}
</style>
```

### Element Plus 组件使用规范

```typescript
// ✅ GOOD: 使用 Element Plus 组件封装
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

// 消息提示
const showSuccess = () => {
  ElMessage.success('操作成功')
}

// 确认对话框
const confirmDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteUser(userId)
    ElMessage.success('删除成功')
  } catch {
    // 取消操作
  }
}

// 加载状态
const loadingInstance = ElLoading.service({
  lock: true,
  text: '加载中...',
  background: 'rgba(0, 0, 0, 0.7)'
})
loadingInstance.close()
```

### 表单组件规范（FormCreate 或 Element Plus 原生）

ui-admin 项目使用 form-create 表单生成器：

```typescript
// 使用 form-create 组件
<template>
  <form-create
    v-model="formData"
    :rule="formRules"
    :option="formOption"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
const formData = ref({})

const formRules = ref([
  {
    type: 'input',
    field: 'username',
    title: '用户名',
    validate: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
  },
  {
    type: 'select',
    field: 'status',
    title: '状态',
    options: [
      { label: '启用', value: 0 },
      { label: '禁用', value: 1 }
    ]
  }
])

const formOption = {
  form: {
    labelWidth: '100px'
  },
  submitBtn: false // 自定义提交按钮
}
</script>
```

### API 封装规范（Axios）

```typescript
// api/system/user.ts
import request from '@/config/axios'

// 响应类型定义
export interface UserRespVO {
  id: number
  username: string
  nickname: string
  deptId: number
  status: number
}

export interface UserSaveReqVO {
  id?: number
  username: string
  nickname: string
  deptId: number
  status: number
}

// 统一响应结构
export interface CommonResult<T> {
  code: number
  data: T
  msg: string
}

// API 方法
export const getUserApi = (id: number): Promise<CommonResult<UserRespVO>> => {
  return request.get({ url: '/system/user/get', params: { id } })
}

export const getUserPageApi = (params: PageParam): Promise<CommonResult<PageResult<UserRespVO>>> => {
  return request.get({ url: '/system/user/page', params })
}

export const createUserApi = (data: UserSaveReqVO): Promise<CommonResult<number>> => {
  return request.post({ url: '/system/user/create', data })
}

export const updateUserApi = (data: UserSaveReqVO): Promise<CommonResult<boolean>> => {
  return request.put({ url: '/system/user/update', data })
}

export const deleteUserApi = (id: number): Promise<CommonResult<boolean>> => {
  return request.delete({ url: '/system/user/delete', params: { id } })
}
```

### Pinia Store 规范

```typescript
// store/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types/user'
import { loginApi, getInfoApi } from '@/api/login'

export const useUserStore = defineStore('user', () => {
  // State
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')
  const roles = ref<string[]>([])

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const hasRole = computed(() => (role: string) => roles.value.includes(role))

  // Actions
  const login = async (username: string, password: string) => {
    const { data } = await loginApi({ username, password })
    token.value = data.accessToken
    return data
  }

  const fetchUserInfo = async () => {
    const { data } = await getInfoApi()
    userInfo.value = data
    roles.value = data.roles
    return data
  }

  const logout = () => {
    userInfo.value = null
    token.value = ''
    roles.value = []
  }

  return {
    userInfo,
    token,
    roles,
    isLoggedIn,
    hasRole,
    login,
    fetchUserInfo,
    logout
  }
})
```

### 页面组件 CRUD 规范

```typescript
// views/system/user/index.vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from '@/hooks/useMessage'
import { getUserPageApi, deleteUserApi } from '@/api/system/user'
import type { UserRespVO } from '@/api/system/user'

const { message, confirm } = useMessage()

// 表格数据
const loading = ref(false)
const userList = ref<UserRespVO[]>([])
const total = ref(0)

// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  username: ''
})

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const { data } = await getUserPageApi(queryParams.value)
    userList.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 删除
const handleDelete = async (row: UserRespVO) => {
  await confirm('确定要删除用户 ' + row.username + ' 吗？')
  await deleteUserApi(row.id)
  message.success('删除成功')
  getList()
}

// 搜索
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

// 重置
const resetQuery = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    username: ''
  }
  getList()
}

onMounted(() => {
  getList()
})
</script>
```

### 路由规范

```typescript
// router/modules/system.ts
import type { RouteRecordRaw } from 'vue-router'

const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index.vue'),
        name: 'SystemUser',
        meta: { title: '用户管理', keepAlive: true }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role/index.vue'),
        name: 'SystemRole',
        meta: { title: '角色管理' }
      }
    ]
  }
]

export default systemRoutes
```

### Vben Admin 特定规范（ui-admin-vben）

```typescript
// ui-admin-vben 使用 Vben 封装的组件和 hooks
import { useTable, useForm } from '@/hooks/vben'

// 表格配置
const [registerTable, { reload }] = useTable({
  api: getUserPageApi,
  columns: [
    { title: '用户名', dataIndex: 'username' },
    { title: '状态', dataIndex: 'status', slot: 'status' },
    { title: '操作', slot: 'action', fixed: 'right' }
  ],
  rowKey: 'id'
})

// 表单配置
const [registerForm] = useForm({
  schemas: [
    { field: 'username', label: '用户名', component: 'Input' },
    { field: 'status', label: '状态', component: 'Select', componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 }
      ]
    }}
  ]
})
```

## 不可变性

使用展开运算符进行不可变更新：

```typescript
interface User {
  id: string
  name: string
}

// WRONG: Mutation
function updateUser(user: User, name: string): User {
  user.name = name // MUTATION!
  return user
}

// CORRECT: Immutability
function updateUser(user: Readonly<User>, name: string): User {
  return {
    ...user,
    name
  }
}
```

## 错误处理

使用 async/await 配合 try-catch 并安全地缩小未知错误类型范围：

```typescript
interface User {
  id: string
  email: string
}

declare function riskyOperation(userId: string): Promise<User>

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}

const logger = {
  error: (message: string, error: unknown) => {
    // Replace with your production logger (for example, pino or winston).
  }
}

async function loadUser(userId: string): Promise<User> {
  try {
    const result = await riskyOperation(userId)
    return result
  } catch (error: unknown) {
    logger.error('Operation failed', error)
    throw new Error(getErrorMessage(error))
  }
}
```

## 输入验证

使用 Zod 进行基于模式的验证，并从模式推断类型：

```typescript
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

type UserInput = z.infer<typeof userSchema>

const validated: UserInput = userSchema.parse(input)
```

## Console.log

* 生产代码中不允许出现 `console.log` 语句
* 请使用适当的日志库替代
* 查看钩子以进行自动检测

---

## Nuxt 布局规范（qBank 项目）

### 布局选择规则

根据页面路径选择正确的布局：

| 页面路径 | 布局名称 | 布局文件 | 说明 |
|---------|---------|---------|------|
| `pages/account/**` | `member` | `layouts/member.vue` | 用户中心页面（含侧边栏菜单） |
| `pages/user/**` | `user` | `layouts/user.vue` | 用户信息页面（简化布局） |
| `pages/index.vue` | `default` | `layouts/default.vue` | 首页 |
| 其他页面 | `default` | `layouts/default.vue` | 默认布局 |

### 示例

```typescript
// ✅ CORRECT: account 路径使用 member 布局
<script setup lang="ts">
definePageMeta({
  layout: 'member',
})
</script>

// ❌ WRONG: account 路径错误使用 user 布局
<script setup lang="ts">
definePageMeta({
  layout: 'user',  // 错误！应该使用 'member'
})
</script>
```

### 布局对比

**member 布局**：
- 包含 UserHeader（用户信息头部）
- 包含 UserSideBar（用户中心侧边栏菜单）
- 适合：个人中心、我的订单、学习记录等需要侧边栏导航的页面

**user 布局**：
- 仅包含基础导航
- 适合：登录、注册、简单的用户信息页面

### 检查清单

创建 account 路径下的页面时：
- [ ] 使用 `layout: 'member'`
- [ ] 检查侧边栏菜单是否正确显示
- [ ] 确保页面内容与侧边栏风格一致

