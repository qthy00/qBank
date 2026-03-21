---
name: architecture-design
description: |
  前端架构设计指南。当用户需要进行模块划分、代码重构、依赖管理、项目架构设计、目录结构调整、组件库封装等架构相关工作时使用此技能。
  适用于 Nuxt 4 + Vue 3 前端项目。
  触发词：架构、模块划分、重构、依赖管理、目录结构、组件库、项目组织、分层设计
---

# 前端架构设计指南

## 何时使用

**适用场景**
- 项目目录结构设计
- 模块划分与边界定义
- 代码重构与优化
- 依赖管理和版本控制
- 组件库/工具库封装
- 分层架构设计
- 微前端/模块化方案

**不适用场景**
- 后端架构设计
- 数据库架构设计
- 运维架构设计

---

## 项目目录结构

### 1. 标准目录结构

```
app/                          # 应用代码
├── api/                     # API接口层
│   ├── user/               # 用户模块API
│   ├── qBank/              # 题库模块API
│   └── infra/              # 基础设施API（文件等）
│
├── components/              # 组件层（自动导入）
│   ├── Card/               # 卡片组件
│   ├── Form/               # 表单组件
│   ├── Table/              # 表格组件
│   └── common/             # 通用组件
│
├── composables/             # 组合式函数（自动导入）
│   ├── useHttp.ts          # HTTP请求
│   ├── useMessage.ts       # 消息提示
│   ├── useUpload.ts        # 文件上传
│   └── usePermission.ts    # 权限检查
│
├── layouts/                 # 布局层
│   ├── default.vue         # 默认布局
│   ├── blank.vue           # 空白布局
│   └── admin.vue           # 管理后台布局
│
├── pages/                   # 页面层（约定式路由）
│   ├── index.vue           # 首页
│   ├── login.vue           # 登录页
│   ├── account/            # 用户中心
│   └── dashboard/          # 控制台
│
├── stores/                  # 状态管理层
│   ├── auth.ts             # 认证状态
│   ├── user.ts             # 用户状态
│   └── app.ts              # 应用状态
│
├── types/                   # 类型定义层
│   ├── user/               # 用户相关类型
│   ├── qBank/              # 题库相关类型
│   └── common.d.ts         # 通用类型
│
├── utils/                   # 工具函数层
│   ├── formatTime.ts       # 时间格式化
│   ├── validators.ts       # 验证函数
│   └── lang.ts             # 国际化工具
│
├── middleware/              # 路由中间件
│   └── auth.ts             # 认证中间件
│
├── plugins/                 # 插件
│   └── element-plus.ts     # Element Plus配置
│
└── styles/                  # 全局样式
    ├── variables.scss      # SCSS变量
    └── index.scss          # 入口样式
```

### 2. 分层架构

```
┌─────────────────────────────────────┐
│            表现层 (Pages)            │
├─────────────────────────────────────┤
│            组件层 (Components)       │
├─────────────────────────────────────┤
│            业务逻辑层 (Composables)  │
├─────────────────────────────────────┤
│            状态层 (Stores)           │
├─────────────────────────────────────┤
│            接口层 (API)              │
├─────────────────────────────────────┤
│            工具层 (Utils)            │
└─────────────────────────────────────┘
```

---

## 模块划分原则

### 1. 按业务领域划分

```
api/
├── user/                   # 用户域
│   ├── index.ts           # 用户API
│   └── types.d.ts         # 用户类型
├── qBank/                  # 题库域
│   ├── index.ts
│   └── types.d.ts
├── order/                  # 订单域
│   ├── index.ts
│   └── types.d.ts
└── pay/                    # 支付域
    ├── index.ts
    └── types.d.ts
```

### 2. 按功能职责划分

```typescript
// 单一职责原则

// ❌ 错误：API和组件混在一起
components/UserList.vue 中直接写API调用

// ✅ 正确：分层清晰
api/user/index.ts         # API层
composables/useUser.ts    # 业务逻辑层
components/UserList.vue   # 组件层（只负责展示）
```

### 3. 模块依赖规则

```
规则：上层可以依赖下层，下层不能依赖上层

Pages → Components → Composables → Stores → API → Utils
```

---

## 代码重构实践

### 1. 提取可复用逻辑

```typescript
// 重构前：重复代码
// PageA.vue
const fetchUser = async () => {
  const res = await $fetch('/api/user')
  return res
}

// PageB.vue
const fetchUser = async () => {
  const res = await $fetch('/api/user')
  return res
}

// 重构后：提取到composables
// composables/useUser.ts
export const useUser = () => {
  const fetchUser = async () => {
    return await httpGet('UserInfo', '/member/user/get')
  }
  return { fetchUser }
}

// 使用时
const { fetchUser } = useUser()
```

### 2. 组件拆分

```vue
<!-- 重构前：大而全的组件 -->
<template>
  <div>
    <!-- 100+行代码 -->
  </div>
</template>

<!-- 重构后：拆分小组件 -->
<template>
  <div>
    <SearchForm v-model="searchParams" @search="handleSearch" />
    <DataTable :data="tableData" @edit="handleEdit" @delete="handleDelete" />
    <Pagination v-model="pagination" @change="fetchData" />
    <EditDialog ref="editDialog" @success="fetchData" />
  </div>
</template>
```

### 3. 重构检查清单

```markdown
## 重构前检查
- [ ] 确定重构目标和范围
- [ ] 备份或创建分支
- [ ] 确保有测试覆盖

## 重构内容
- [ ] 提取重复代码
- [ ] 拆分大组件
- [ ] 优化命名
- [ ] 简化复杂逻辑
- [ ] 移除死代码

## 重构后验证
- [ ] 功能正常
- [ ] 没有引入新bug
- [ ] 代码审查通过
```

---

## 依赖管理

### 1. package.json 规范

```json
{
  "dependencies": {
    "nuxt": "^4.0.0",           # 核心框架
    "vue": "^3.4.0",            # Vue核心
    "element-plus": "^2.5.0",   # UI库
    "pinia": "^2.1.0",          # 状态管理
    "@vueuse/core": "^10.7.0"   # 工具库
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "sass": "^1.69.0",
    "unocss": "^0.58.0"
  }
}
```

### 2. 依赖升级策略

```bash
# 查看过时的依赖
pnpm outdated

# 安全更新（只更新patch版本）
pnpm update

# 升级指定包
pnpm update element-plus

# 升级前测试
pnpm test
```

### 3. 锁定文件管理

```bash
# 安装依赖时保持锁定
pnpm install

# 更新锁定文件
pnpm install --no-frozen-lockfile

# 检查锁定文件冲突
# 冲突时：删除 pnpm-lock.yaml 重新安装
```

---

## 组件库封装

### 1. 组件设计原则

```typescript
// 1. 单一职责
// ❌ 错误：一个组件做太多事
<DataTableWithSearchAndExport />

// ✅ 正确：拆分成独立组件
<DataTable />
<SearchForm />
<ExportButton />

// 2. 明确Props接口
interface Props {
  data: any[]                    // 必需：数据
  columns: TableColumn[]         // 必需：列配置
  loading?: boolean              // 可选：加载状态
  pagination?: PaginationConfig  // 可选：分页配置
}

// 3. 合理使用事件
const emit = defineEmits<{
  'update:page': [page: number]  // v-model风格
  'row-click': [row: any]        // 业务事件
  'selection-change': [rows: any[]]
}>()
```

### 2. 组件库目录

```
components/
├── common/                   # 通用组件
│   ├── Empty/               # 空状态
│   ├── Loading/             # 加载中
│   └── ErrorBoundary/       # 错误边界
│
├── data-display/            # 数据展示
│   ├── Card/
│   ├── List/
│   └── Statistic/
│
├── data-entry/              # 数据录入
│   ├── Form/
│   ├── SearchForm/
│   └── FilterForm/
│
├── feedback/                # 反馈
│   ├── ConfirmDialog/
│   └── Message/
│
└── navigation/              # 导航
    ├── Breadcrumb/
    └── Menu/
```

---

## 架构设计模式

### 1. Container/Presentational 模式

```vue
<!-- Container 组件：处理数据和逻辑 -->
<!-- UserListContainer.vue -->
<script setup lang="ts">
const { users, loading, fetchUsers } = useUsers()
onMounted(fetchUsers)
</script>

<template>
  <UserList :users="users" :loading="loading" />
</template>

<!-- Presentational 组件：只负责展示 -->
<!-- UserList.vue -->
<script setup lang="ts">
interface Props {
  users: User[]
  loading: boolean
}
defineProps<Props>()
</script>

<template>
  <el-table v-loading="loading" :data="users">
    <!-- ... -->
  </el-table>
</template>
```

### 2. Composition 组合模式

```typescript
// 将复杂逻辑拆分成多个composable
export const useUserList = () => {
  // 列表相关逻辑
  const { users, fetchUsers } = useUsers()
  const { pagination, handlePageChange } = usePagination()

  return {
    users,
    pagination,
    fetchUsers,
    handlePageChange
  }
}

// 页面使用
const {
  users,
  pagination,
  fetchUsers
} = useUserList()
```

### 3. Provider/Inject 模式

```typescript
// 提供上下文
const UserKey: InjectionKey<UserContext> = Symbol('user')

export const provideUser = (user: Ref<User>) => {
  provide(UserKey, {
    user: readonly(user),
    updateUser: (data: Partial<User>) => {
      Object.assign(user.value, data)
    }
  })
}

// 使用上下文
export const useUserContext = () => {
  const context = inject(UserKey)
  if (!context) {
    throw new Error('useUserContext must be used after provideUser')
  }
  return context
}
```

---

## 性能优化架构

### 1. 代码分割

```typescript
// 路由懒加载
const UserList = () => import('~/pages/user/list.vue')

// 组件懒加载
const HeavyChart = defineAsyncComponent(() =>
  import('~/components/Chart/HeavyChart.vue')
)
```

### 2. 状态管理优化

```typescript
// Store模块化
// stores/index.ts
import { createPinia } from 'pinia'

export const pinia = createPinia()

// 按需加载Store
// 避免在全局引入所有Store
```

### 3. 资源优化

```typescript
// 图片懒加载
<img v-lazy="imageUrl" />

// 组件懒加载
<LazyComponent v-if="visible" />

// 虚拟滚动
<VirtualList :items="largeList" :item-size="50" />
```

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-21
