---
name: code-patterns
description: |
  前端代码规范与模式指南。当用户需要了解命名规范、Git提交规范、代码审查、TypeScript规范、Vue组件规范、文件命名等编码规范时使用此技能。
  适用于 Nuxt 4 + Vue 3 + TypeScript 前端项目。
  触发词：规范、命名、Git提交、代码审查、代码规范、文件命名、TS规范、ESLint
---

# 代码规范与模式指南

## 何时使用

**适用场景**
- 代码命名规范
- Git提交规范
- 代码审查检查清单
- TypeScript类型规范
- Vue组件编写规范
- 文件/目录命名规范
- ESLint/Prettier配置

**不适用场景**
- 后端代码规范
- 数据库命名规范
- 运维脚本规范

---

## 命名规范

### 1. 文件命名

| 类型 | 命名规则 | 示例 |
|-----|---------|------|
| 组件 | PascalCase | `UserCard.vue`, `DataTable.vue` |
| Composables | camelCase，以use开头 | `useUser.ts`, `usePermission.ts` |
| API文件 | camelCase | `user.ts`, `qBank.ts` |
| Store文件 | camelCase | `auth.ts`, `user.ts` |
| 类型定义 | camelCase | `user.d.ts`, `api.d.ts` |
| 工具函数 | camelCase | `formatTime.ts`, `validators.ts` |
| 常量文件 | UPPER_SNAKE_CASE | `CONFIG.ts`, `ENUMS.ts` |
| 样式文件 | kebab-case | `variables.scss`, `mixins.scss` |

### 2. 变量命名

```typescript
// 布尔值：is/has/should/can + 名词
const isLoading = ref(false)
const hasPermission = ref(true)
const shouldShow = ref(false)
const canSubmit = computed(() => formValid.value)

// 数组：名词复数
const users = ref<User[]>([])
const orderList = ref<Order[]>([])

// 函数：动词 + 名词
const fetchUsers = async () => {}
const handleSubmit = () => {}
const validateForm = () => {}
const formatDate = (date: Date) => {}

// 事件处理：handle + Event
const handleClick = () => {}
const handleChange = (val: string) => {}
const handleSubmit = async () => {}

// 计算属性：名词或is/has + 名词
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
const isValid = computed(() => errors.value.length === 0)
```

### 3. 组件命名

```vue
<!-- 单文件组件：PascalCase -->
<!-- UserProfile.vue -->

<!-- 模板中：kebab-case -->
<user-profile />

<!-- 引用组件：PascalCase -->
<script setup lang="ts">
import UserProfile from './UserProfile.vue'
</script>
```

---

## Vue组件规范

### 1. 组件结构

```vue
<script setup lang="ts">
// 1. 类型导入
import type { User, UserFormData } from '~/types/user'

// 2. Vue/第三方导入
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 3. 组件导入
import UserForm from './components/UserForm.vue'

// 4. Props定义
interface Props {
  userId: number
  editable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  editable: false
})

// 5. Emits定义
const emit = defineEmits<{
  'update': [user: User]
  'delete': [id: number]
}>()

// 6. 响应式数据
const user = ref<User | null>(null)
const loading = ref(false)

// 7. 计算属性
const displayName = computed(() => {
  return user.value?.nickname || user.value?.username || '未命名'
})

// 8. 方法
const fetchUser = async () => {
  loading.value = true
  try {
    user.value = await httpGet('UserDetail', `/member/user/${props.userId}`)
  } finally {
    loading.value = false
  }
}

// 9. 生命周期
onMounted(fetchUser)
</script>

<template>
  <div class="user-profile">
    <!-- 模板内容 -->
  </div>
</template>

<style scoped lang="scss">
.user-profile {
  /* 样式 */
}
</style>
```

### 2. Props规范

```typescript
// ✅ 使用TypeScript接口
interface Props {
  title: string                    // 必填
  count?: number                   // 可选
  size?: 'small' | 'medium' | 'large'  // 枚举
  onSubmit?: (data: FormData) => void  // 回调函数
}

// ✅ 使用withDefaults设置默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  size: 'medium'
})

// ❌ 不使用泛型方式（不够清晰）
const props = defineProps<{
  title: string
}>()
```

### 3. Emits规范

```typescript
// ✅ 使用类型定义
const emit = defineEmits<{
  'update:modelValue': [value: string]  // v-model
  'change': [value: string, oldValue: string]  // 多参数
  'submit': [data: FormData]            // 对象参数
}>()

// ✅ 触发事件
emit('update:modelValue', newValue)
emit('change', newValue, oldValue)

// ❌ 避免使用数组语法
const emit = defineEmits(['change', 'submit'])
```

---

## TypeScript规范

### 1. 类型命名

```typescript
// 接口：PascalCase
interface UserProfile {
  id: number
  username: string
}

// 类型别名：PascalCase
type UserStatus = 'active' | 'inactive' | 'pending'

// 枚举：PascalCase + UPPER_SNAKE_CASE成员
enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped'
}

// 泛型：T, K, V 或描述性名称
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

interface KeyValuePair<K, V> {
  key: K
  value: V
}
```

### 2. 类型定义位置

```typescript
// 1. 内联类型（简单场景）
const user = ref<{ name: string; age: number }>({ name: '', age: 0 })

// 2. 组件内定义（组件专属）
interface Props { }
interface Emits { }

// 3. types目录（通用类型）
// types/user/index.d.ts
export interface UserVO { }
export interface UserDTO { }
```

### 3. 类型使用原则

```typescript
// ✅ 优先使用接口（可扩展）
interface User { name: string }
interface Admin extends User { permissions: string[] }

// ✅ 明确返回值类型
const fetchUser = async (id: number): Promise<User> => { }

// ✅ 使用Partial/Required/Omit等工具类型
const updateUser = (id: number, data: Partial<User>) => { }

// ❌ 避免any
const bad = (data: any) => { }  // ❌
const good = (data: unknown) => { }  // ✅
```

---

## Git提交规范

### 1. 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2. 提交类型

| 类型 | 说明 | 示例 |
|-----|------|------|
| `feat` | 新功能 | `feat(user): 添加用户资料编辑功能` |
| `fix` | 修复bug | `fix(login): 修复登录失效问题` |
| `docs` | 文档更新 | `docs(readme): 更新安装说明` |
| `style` | 代码格式 | `style: 统一缩进为2空格` |
| `refactor` | 重构 | `refactor(api): 重构用户API模块` |
| `perf` | 性能优化 | `perf(table): 优化大数据表格渲染` |
| `test` | 测试相关 | `test(user): 添加用户模块测试` |
| `chore` | 构建/工具 | `chore: 升级element-plus版本` |
| `revert` | 回滚 | `revert: 回滚feat: xxx` |

### 3. 提交示例

```bash
# 简单提交
git commit -m "feat(user): 添加用户头像上传功能"

# 详细提交
git commit -m "feat(user): 添加用户头像上传功能

- 集成阿里云OSS直传
- 添加图片裁剪功能
- 限制图片大小为2MB

Closes #123"
```

### 4. 提交检查清单

```markdown
- [ ] 提交信息符合规范
- [ ] 一个提交只做一件事
- [ ] 提交前代码能通过lint检查
- [ ] 提交前测试通过
- [ ] 没有提交敏感信息
```

---

## 代码审查检查清单

### 1. 功能性检查

```markdown
- [ ] 代码实现了预期的功能
- [ ] 边界条件处理正确
- [ ] 错误处理完善
- [ ] 没有明显的bug
```

### 2. 代码质量检查

```markdown
- [ ] 命名清晰有意义
- [ ] 函数/组件职责单一
- [ ] 没有重复代码
- [ ] 没有死代码
- [ ] 复杂度适中
```

### 3. TypeScript检查

```markdown
- [ ] 类型定义完整
- [ ] 没有使用any
- [ ] 泛型使用合理
- [ ] 类型推断正确
```

### 4. Vue/Nuxt检查

```markdown
- [ ] 组件结构规范
- [ ] Props/Emits类型完整
- [ ] 响应式数据使用正确
- [ ] 生命周期使用正确
- [ ] SSR兼容性处理
```

### 5. 性能检查

```markdown
- [ ] 避免不必要的重渲染
- [ ] 大数据使用虚拟滚动
- [ ] 图片懒加载
- [ ] 合理使用缓存
```

### 6. 安全与规范

```markdown
- [ ] 没有XSS漏洞
- [ ] 敏感数据加密
- [ ] 输入验证完善
- [ ] 符合项目规范
```

---

## ESLint/Prettier配置

### 1. 推荐配置

```javascript
// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  }
]
```

### 2. Prettier配置

```javascript
// prettier.config.js
export default {
  semi: false,              // 无分号
  singleQuote: true,        // 单引号
  tabWidth: 2,              // 缩进2空格
  trailingComma: 'none',    // 无尾随逗号
  printWidth: 100,          // 最大行宽
  arrowParens: 'avoid'      // 箭头函数省略括号
}
```

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-21
