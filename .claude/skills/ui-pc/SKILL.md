---
name: ui-pc
description: |
  前端 PC 端组件开发指南。当用户需要开发 Element Plus 页面、使用表单/表格/弹窗组件、编写 Vue 页面时使用此技能。
  适用于 Nuxt 4 + Vue 3 + TypeScript + Element Plus + UnoCSS 项目。
  触发词：前端页面、Element Plus、el-form、el-table、el-dialog、vue组件、PC端页面
---

# 前端 PC 组件开发指南

## 何时使用

**适用场景**
- 开发 PC 端管理后台页面
- 使用 Element Plus 组件（表单、表格、弹窗等）
- 编写 Vue 3 + TypeScript 页面
- 使用 UnoCSS 原子类样式

**不适用场景**
- 移动端/H5开发（使用 ui-mobile 技能）
- 纯后端开发
- 数据库设计

---

## 项目结构

```
app/
├── api/                    # API接口定义
├── components/             # 公共组件（自动导入）
├── composables/            # 组合式函数（自动导入）
├── pages/                  # 页面路由（Nuxt约定式路由）
├── layouts/                # 布局文件
├── stores/                 # Pinia状态管理
├── types/                  # TypeScript类型定义
├── utils/                  # 工具函数
└── assets/                 # 静态资源
```

---

## 核心规范（必须遵守）

### HTTP请求
使用 `useHttp.ts` 提供的封装函数，**禁止**直接使用 `$fetch` 或 `axios`：

```typescript
import { httpGet, httpPost, httpPut, httpDelete, httpUpload } from '~/composables/useHttp'

// GET 请求
const res = await httpGet('UserInfo', `/member/user/get`)

// 带参数的GET
const list = await httpGet('UserList', `/member/user/list`, { query: { page: 1 } })

// POST 请求
await httpPost('createUser', '/member/user/create', data)

// PUT 请求
await httpPut('updateUser', '/member/user/update', data)

// 上传文件
await httpUpload('uploadAvatar', '/infra/file/upload', formData)
```

### 消息提示
使用 `useMessage()` 封装，**禁止**直接使用 `ElMessage`：

```typescript
const message = useMessage()

message.success('操作成功')
message.error('操作失败')
message.warning('警告信息')
message.info('提示信息')
```

### 图标
使用 `@nuxt/icon` 组件：

```vue
<Icon name="ep:plus" />
<Icon name="ep:edit" />
<Icon name="ep:delete" />
```

### 样式
- 使用 **px** 单位，**禁止**使用 rem/em/vw/vh
- 使用 UnoCSS 原子类
- CSS 注释必须使用 `/* */`，**禁止**使用 `//`

```vue
<style scoped lang="scss">
/* 正确注释 */
.page-container {
  padding: 16px;
  background: var(--el-color-primary);

  .header {
    font-size: 16px;
  }
}
</style>
```

---

## UI 设计规范（必须遵守）

### 设计系统概述
本项目采用统一的设计系统，所有页面和组件必须遵循以下规范，确保视觉一致性。

### 颜色系统
使用 CSS 变量统一颜色：

| 变量名 | 用途 | 示例 |
|--------|------|------|
| `--color-bg-container` | 容器背景色（白色） | `bg-(--color-bg-container)` |
| `--color-bg-container-hover` | 悬停背景色 | `bg-(--color-bg-container-hover)` |
| `--color-text-primary` | 主要文字颜色 | `text-(--color-text-primary)` |
| `--color-text-secondary` | 次要文字颜色 | `text-(--color-text-secondary)` |
| `--color-text-hover` | 文字悬停颜色 | `text-(--color-text-hover)` |
| `--color-border` | 边框颜色 | `border-(--color-border)` |
| `--color-btn-primary` | 主按钮背景色 | `bg-(--color-btn-primary)` |
| `--color-btn-hover` | 按钮悬停色 | `hover:bg-(--color-btn-hover)` |
| `--color-btn-text` | 按钮文字颜色 | `text-(--color-btn-text)` |
| `--color-danger` | 危险/错误色 | `text-(--color-danger)` |
| `--color-success` | 成功色 | `text-(--color-success)` |
| `--color-warning` | 警告色 | `bg-(--color-warning)` |

**正确示例**：
```vue
<div class="bg-(--color-bg-container) text-(--color-text-primary) border border-(--color-border)">
  <button class="bg-(--color-btn-primary) text-(--color-btn-text) hover:bg-(--color-btn-hover)">
    提交
  </button>
</div>
```

### 卡片组件规范

**标准卡片结构**：
```vue
<template>
  <div class="bg-(--color-bg-container) rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
    <!-- 封面图区域 -->
    <div class="h-40 bg-gray-200 overflow-hidden relative">
      <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <!-- 标签 -->
      <div class="absolute top-2 right-2">
        <el-tag size="small" effect="dark">标签</el-tag>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-4">
      <h3 class="font-bold text-(--color-text-primary) mb-2 line-clamp-1">标题</h3>
      <p class="text-sm text-(--color-text-secondary) mb-3 line-clamp-2">描述文本</p>

      <!-- 底部操作区 -->
      <div class="flex items-center justify-between pt-3 border-t border-(--color-border)">
        <span class="text-(--color-danger) font-bold">¥99.00</span>
        <el-button type="primary" size="small">操作</el-button>
      </div>
    </div>
  </div>
</template>
```

**卡片样式要求**：
- 圆角：`rounded-lg`
- 阴影：`shadow`（默认），`hover:shadow-lg`（悬停）
- 背景：`bg-(--color-bg-container)`
- 过渡：`transition-all duration-300`
- 内边距：`p-4` 或 `p-5`

### 按钮规范

**主按钮**：
```vue
<a class="bg-(--color-btn-primary) text-(--color-btn-text) px-4 py-2 hover:bg-(--color-btn-hover) hover:text-(--color-bg-container) transition-all">
  主要操作
</a>
```

**次要按钮**：
```vue
<el-button type="primary" link>
  <Icon name="ep:edit" /> 编辑
</el-button>
<el-button type="danger" link>
  <Icon name="ep:delete" /> 删除
</el-button>
```

**圆角按钮**：
```vue
<a class="rounded-full border border-solid border-(--color-border) px-3 py-2 hover:bg-(--color-btn-hover) hover:text-(--color-bg-container)">
  圆角按钮
</a>
```

### 图标规范

**图标库选择**：
- Element Plus 图标：`<Icon name="ep:xxx" />`
- Material Symbols：`<Icon name="material-symbols:xxx" />`
- 自定义图标类：`hy-ico-xxx`, `hy-icon-xxx`

**常用图标**：
```vue
<Icon name="ep:plus" />      <!-- 新增 -->
<Icon name="ep:edit" />      <!-- 编辑 -->
<Icon name="ep:delete" />    <!-- 删除 -->
<Icon name="ep:search" />    <!-- 搜索 -->
<Icon name="ep:refresh" />   <!-- 刷新 -->
<Icon name="ep:document" />  <!-- 文档 -->
<Icon name="ep:folder" />    <!-- 文件夹 -->
<Icon name="material-symbols:arrow-right" /> <!-- 箭头 -->
```

### 布局规范

**容器**：
```vue
<div class="container mx-auto px-4">
  <!-- 页面内容 -->
</div>
```

**页面内边距**：
```vue
<div class="page-container">
  <!-- 默认 16px 内边距 -->
</div>
```

**常用间距**：
- 组件间距：`my-5`, `mt-4`, `mb-4`
- 内容间距：`p-4`, `gap-4`, `space-y-4`
- 列表项间距：`py-2`, `px-4`

### 文字排版

**标题层级**：
```vue
<h1 class="text-xl font-bold text-(--color-text-primary)">页面标题</h1>
<h2 class="text-lg font-semibold text-(--color-text-primary)">区块标题</h2>
<h3 class="font-bold text-(--color-text-primary)">小标题</h3>
```

**正文**：
```vue
<p class="text-sm text-(--color-text-secondary)">正文内容</p>
<span class="text-xs text-(--color-text-secondary)">辅助文字</span>
```

**文字截断**：
```vue
<!-- 单行截断 -->
<div class="truncate">单行文字截断</div>

<!-- 多行截断 -->
<div class="line-clamp-2">多行文字截断，最多显示两行</div>
```

### 边框和分隔线

**卡片边框**：
```vue
<div class="border border-solid border-(--color-border)"></div>
```

**底部分隔线**：
```vue
<div class="border-b border-(--color-border)"></div>
<hr class="border-t border-(--color-border)">
```

### 动画和过渡

**标准过渡**：
```vue
<!-- 悬停效果 -->
<div class="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

<!-- 按钮悬停 -->
<button class="hover:bg-(--color-btn-hover) hover:text-(--color-bg-container) transition-all">

<!-- 链接下划线动画 -->
<a class="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">

<!-- 图片缩放 -->
<img class="transform transition-transform duration-300 group-hover:scale-110">
```

### 完整卡片组件示例

**QbankCard 组件（参考实现）**：
```vue
<template>
  <div
    class="bg-(--color-bg-container) rounded-lg shadow hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
    @click="handleClick"
  >
    <!-- 封面图 -->
    <div class="h-40 bg-gray-200 overflow-hidden relative">
      <img
        :src="qbank.coverImage || '/images/default-qbank.jpg'"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      >
      <!-- 难度标签 -->
      <div class="absolute top-2 right-2">
        <el-tag :type="getDifficultyType(qbank.difficulty)" size="small" effect="dark">
          {{ qbank.difficultyName }}
        </el-tag>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-4">
      <h3 class="font-bold text-[var(--color-text-primary)] mb-2 line-clamp-1">
        {{ qbank.name }}
      </h3>
      <p class="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2 h-10">
        {{ qbank.description || '暂无描述' }}
      </p>

      <!-- 统计信息 -->
      <div class="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] mb-3">
        <span class="flex items-center gap-1">
          <Icon name="ep:document"/>
          {{ qbank.questionCount || 0 }} 题
        </span>
      </div>

      <!-- 价格和操作 -->
      <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
        <span class="text-[var(--color-danger)] font-bold text-lg">¥{{ formatPrice(qbank.price) }}</span>
        <el-button type="primary" size="small">购买</el-button>
      </div>
    </div>
  </div>
</template>
```

---

## Element Plus 组件

### 1. 表单 (el-form)

```vue
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" placeholder="请输入用户名" />
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-select v-model="formData.status" placeholder="请选择状态">
        <el-option label="启用" :value="1" />
        <el-option label="禁用" :value="0" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const formRef = ref()
const formData = reactive({
  username: '',
  status: 1
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  // 提交逻辑
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>
```

### 2. 表格 (el-table)

```vue
<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="编号" width="80" />
    <el-table-column prop="username" label="用户名" min-width="120" />
    <el-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" link @click="handleEdit(row)">
          <Icon name="ep:edit" /> 编辑
        </el-button>
        <el-button type="danger" link @click="handleDelete(row)">
          <Icon name="ep:delete" /> 删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination
    v-model:current-page="pagination.page"
    v-model:page-size="pagination.limit"
    :total="pagination.total"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next"
    class="mt-4 justify-end"
    @change="fetchData"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await httpGet('UserPage', '/member/user/page', {
      query: {
        pageNo: pagination.page,
        pageSize: pagination.limit
      }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}
</script>
```

### 3. 弹窗 (el-dialog)

```vue
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    destroy-on-close
  >
    <el-form ref="formRef" :model="formData" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formRef = ref()
const formData = reactive({ name: '' })
const rules = { name: [{ required: true, message: '请输入名称' }] }

const open = (type: 'create' | 'edit', row?: any) => {
  dialogTitle.value = type === 'create' ? '新增' : '编辑'
  if (type === 'edit' && row) {
    Object.assign(formData, row)
  } else {
    formRef.value?.resetFields()
  }
  dialogVisible.value = true
}

const handleConfirm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  // 提交逻辑
  dialogVisible.value = false
}

defineExpose({ open })
</script>
```

### 4. 常用组件速查

```vue
<!-- 按钮 -->
<el-button type="primary">
  <Icon name="ep:plus" /> 新增
</el-button>
<el-button type="danger" plain>
  <Icon name="ep:delete" /> 删除
</el-button>
<el-button type="primary" loading>加载中</el-button>

<!-- 输入框 -->
<el-input v-model="input" placeholder="请输入" clearable />
<el-input v-model="input" type="password" show-password />
<el-input v-model="input" type="textarea" :rows="3" />

<!-- 选择器 -->
<el-select v-model="select" placeholder="请选择" clearable>
  <el-option
    v-for="item in options"
    :key="item.value"
    :label="item.label"
    :value="item.value"
  />
</el-select>

<!-- 日期选择 -->
<el-date-picker
  v-model="date"
  type="date"
  placeholder="选择日期"
  format="YYYY-MM-DD"
  value-format="YYYY-MM-DD"
/>

<el-date-picker
  v-model="dateRange"
  type="daterange"
  start-placeholder="开始日期"
  end-placeholder="结束日期"
  format="YYYY-MM-DD"
  value-format="YYYY-MM-DD"
/>

<!-- 开关 -->
<el-switch v-model="switchValue" />

<!-- 单选框 -->
<el-radio-group v-model="radio">
  <el-radio :value="1">选项1</el-radio>
  <el-radio :value="2">选项2</el-radio>
</el-radio-group>

<!-- 复选框 -->
<el-checkbox-group v-model="checkbox">
  <el-checkbox :value="1">选项1</el-checkbox>
  <el-checkbox :value="2">选项2</el-checkbox>
</el-checkbox-group>

<!-- 标签 -->
<el-tag type="success">成功</el-tag>
<el-tag type="danger">危险</el-tag>
<el-tag type="warning">警告</el-tag>
<el-tag type="info">信息</el-tag>

<!-- 确认框 -->
const message = useMessage()
await message.confirm('确认删除?', '提示')
```

---

## 完整页面模板

### 列表页

```vue
<template>
  <div class="page-container">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <Icon name="ep:search" /> 搜索
          </el-button>
          <el-button @click="handleReset">
            <Icon name="ep:refresh" /> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="mt-4" shadow="never">
      <template #header>
        <div class="flex justify-between items-center">
          <span>用户列表</span>
          <el-button type="primary" @click="handleCreate">
            <Icon name="ep:plus" /> 新增
          </el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableData">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <Icon name="ep:edit" /> 编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              <Icon name="ep:delete" /> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="mt-4 justify-end"
        @change="fetchData"
      />
    </el-card>

    <!-- 弹窗组件 -->
    <UserFormDialog ref="dialogRef" @success="fetchData" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { httpGet, httpDelete } from '~/composables/useHttp'
import UserFormDialog from './components/UserFormDialog.vue'

definePageMeta({
  layout: 'default'
})

const message = useMessage()
const loading = ref(false)
const tableData = ref([])
const dialogRef = ref()

const searchForm = reactive({
  username: '',
  status: undefined
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await httpGet('UserPage', '/member/user/page', {
      query: {
        ...searchForm,
        pageNo: pagination.page,
        pageSize: pagination.limit
      }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(searchForm, { username: '', status: undefined })
  handleSearch()
}

const handleCreate = () => {
  dialogRef.value?.open('create')
}

const handleEdit = (row: any) => {
  dialogRef.value?.open('edit', row)
}

const handleDelete = async (row: any) => {
  try {
    await message.confirm(`确认删除用户 "${row.username}"?`, '提示')
    await httpDelete('deleteUser', `/member/user/delete`, { query: { id: row.id } })
    message.success('删除成功')
    fetchData()
  } catch {
    // 取消删除
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.page-container {
  padding: 16px;

  .search-card {
    :deep(.el-card__body) {
      padding-bottom: 0;
    }
  }
}
</style>
```

---

## 最佳实践

1. **设计规范**
   - **必须使用** CSS 变量系统，禁止硬编码颜色
   - 卡片使用 `rounded-lg`、`shadow`、`hover:shadow-lg`
   - 按钮使用标准颜色变量和过渡动画
   - 图标优先使用 `ep:` 和 `material-symbols:` 前缀

2. **组件化**
   - 将复杂表单/弹窗提取为独立组件
   - 使用 `defineExpose` 暴露方法供父组件调用
   - 使用 `defineEmits` 传递事件给父组件

3. **类型安全**
   - 为 Props、Emits、API 响应定义 TypeScript 类型
   - 类型定义放在 `app/types/` 目录

4. **状态管理**
   - 组件内使用 `reactive/ref`
   - 全局状态使用 Pinia Store

5. **代码组织**
   - API 按模块分组放在 `app/api/`
   - 组件放在 `app/components/`（自动导入）
   - 页面放在 `app/pages/`（Nuxt约定式路由）

6. **性能优化**
   - 弹窗使用 `destroy-on-close` 销毁
   - 表格大数据使用虚拟滚动
   - 图片懒加载

---

## 参考代码

- **组件示例**: `app/components/ButtonCard.vue`
- **页面示例**: `app/pages/account/profile/index.vue`
- **API示例**: `app/api/user/index.ts`
- **类型示例**: `app/types/user/index.d.ts`

---

**文档版本**: v2.1
**适用框架**: Nuxt 4 + Vue 3 + TypeScript + Element Plus + UnoCSS
**最后更新**: 2026-03-20
