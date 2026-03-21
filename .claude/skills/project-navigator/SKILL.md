---
name: project-navigator
description: |
  项目导航与定位指南。当用户需要查找文件、了解项目结构、定位模块、查找API定义、查找组件等文件定位相关问题时使用此技能。
  适用于 qBank (Nuxt 4 + Vue 3) 项目。
  触发词：项目结构、文件定位、模块查找、API在哪、组件在哪、页面在哪、类型定义
---

# 项目导航与定位指南

## 何时使用

**适用场景**
- 查找特定文件位置
- 了解项目目录结构
- 定位API定义
- 查找组件实现
- 定位类型定义
- 查找页面路由
- 了解模块组织方式

**不适用场景**
- 代码编写指导
- Bug修复
- 性能优化

---

## 项目结构概览

```
/Users/lilia/Work/CMS/qBank/
├── app/                        # 应用代码（Nuxt 4）
│   ├── api/                   # API接口定义
│   ├── components/            # Vue组件（自动导入）
│   ├── composables/           # 组合式函数（自动导入）
│   ├── layouts/               # 布局文件
│   ├── middleware/            # 路由中间件
│   ├── pages/                 # 页面（约定式路由）
│   ├── plugins/               # Nuxt插件
│   ├── stores/                # Pinia状态管理
│   ├── styles/                # 全局样式
│   ├── types/                 # TypeScript类型定义
│   └── utils/                 # 工具函数
├── .claude/                   # Claude配置
│   ├── hooks/                 # Hooks脚本
│   ├── skills/                # 技能库
│   └── settings.json          # Claude设置
├── public/                    # 静态资源
├── nuxt.config.ts            # Nuxt配置
├── package.json              # 依赖管理
└── CLAUDE.md                 # 项目规范文档
```

---

## 文件定位速查表

### 1. API接口定位

| 功能 | 文件路径 | 查找模式 |
|-----|---------|---------|
| 用户相关API | `app/api/user/index.ts` | 按模块名查找 |
| 题库相关API | `app/api/qBank/index.ts` | 按模块名查找 |
| 文件上传API | `app/api/infra/file.ts` | 按功能查找 |
| HTTP封装 | `app/composables/useHttp.ts` | 固定位置 |

**查找命令：**
```bash
# 查找包含特定API的文件
grep -r "getUser" app/api/

# 查找特定模块
glob "app/api/**/index.ts"
```

### 2. 组件定位

| 类型 | 路径 | 命名规则 |
|-----|------|---------|
| 通用组件 | `app/components/` | PascalCase.vue |
| 复杂组件 | `app/components/ComponentName/index.ts` | 目录结构 |
| Element Plus封装 | `app/components/AForm/` | A前缀 |

**查找命令：**
```bash
# 查找特定组件
glob "app/components/**/*[Cc]ard*"

# 查找使用特定组件的文件
grep -r "<UserCard" app/
```

### 3. 页面定位

| 路由 | 文件路径 | 布局 |
|-----|---------|------|
| `/` | `app/pages/index.vue` | default |
| `/login` | `app/pages/login.vue` | blank |
| `/account/profile` | `app/pages/account/profile/index.vue` | default |
| `/dashboard` | `app/pages/dashboard/index.vue` | admin |

**查找命令：**
```bash
# 查找所有页面
glob "app/pages/**/*.vue"

# 查找特定页面
glob "app/pages/**/profile*"
```

### 4. 类型定义定位

| 类型 | 路径 | 后缀 |
|-----|------|------|
| 用户类型 | `app/types/user/index.d.ts` | `.d.ts` |
| 题库类型 | `app/types/qBank/index.d.ts` | `.d.ts` |
| 通用类型 | `app/types/common.d.ts` | `.d.ts` |
| 组件类型 | 组件文件内 | `.vue` |

**查找命令：**
```bash
# 查找类型定义
glob "app/types/**/*.d.ts"

# 查找特定接口
grep -r "interface User" app/types/
```

### 5. Store定位

| Store | 路径 | 用途 |
|-------|------|------|
| auth | `app/stores/auth.ts` | 认证状态 |
| user | `app/stores/user.ts` | 用户状态 |
| app | `app/stores/app.ts` | 应用状态 |

### 6. Composables定位

| Composable | 路径 | 用途 |
|-----------|------|------|
| useHttp | `app/composables/useHttp.ts` | HTTP请求 |
| useMessage | `app/composables/useMessage.ts` | 消息提示 |
| useToken | `app/composables/useToken.ts` | Token管理 |
| useUpload | `app/composables/useUpload.ts` | 文件上传 |

---

## 常见查找任务

### 任务1：查找用户登录API

```bash
# 方法1：按文件名查找
ls app/api/user/

# 方法2：按内容查找
grep -r "login" app/api/ --include="*.ts"

# 方法3：查找导出
grep -r "export.*login" app/api/ -i
```

**结果定位：**
```
app/api/user/index.ts 中导出登录相关函数
```

### 任务2：查找某个组件的使用位置

```bash
# 假设要找UserCard组件
grep -r "<UserCard" app/pages/ app/components/
grep -r "import.*UserCard" app/
```

### 任务3：查找路由对应的页面

```bash
# 给定路由 /account/settings，找对应文件
# 1. 直接按路径查找
ls app/pages/account/settings/

# 2. 模糊查找
glob "app/pages/**/setting*"
```

### 任务4：查找类型定义

```bash
# 查找UserVO类型
grep -r "interface UserVO" app/types/
grep -r "type UserVO" app/types/

# 查找包含user的所有类型文件
glob "app/types/**/*user*"
```

---

## 智能定位策略

### 1. 按功能模块定位

```
用户模块
├── API: app/api/user/index.ts
├── 类型: app/types/user/index.d.ts
├── Store: app/stores/user.ts
└── 页面: app/pages/account/

题库模块
├── API: app/api/qBank/index.ts
├── 类型: app/types/qBank/index.d.ts
└── 组件: app/components/Question/
```

### 2. 按文件类型定位

```typescript
// 需要找API？
// → app/api/模块名/index.ts

// 需要找组件？
// → app/components/组件名.vue
// → 或 app/components/组件名/index.ts

// 需要找页面？
// → app/pages/路由路径/index.vue

// 需要找类型？
// → app/types/模块名/index.d.ts

// 需要找工具函数？
// → app/composables/useXxx.ts（自动导入）
// → 或 app/utils/xxx.ts
```

### 3. 快速定位命令

```bash
# 查找最近修改的文件
find app -name "*.vue" -mtime -1
find app -name "*.ts" -mtime -1

# 查找包含特定文字的文件
grep -r "el-form" app/pages --include="*.vue" -l

# 查找未被导入的文件（可能无用）
# 需要配合脚本检查
```

---

## 文件关系图

```
页面 (Pages)
    ↓ 引用
组件 (Components)
    ↓ 调用
Composables
    ↓ 调用
API (api/)
    ↓ 使用
Types (types/)

Store (stores/)
    ← 被 Pages/Components 使用
    → 使用 API
```

---

## 定位最佳实践

1. **使用Glob模式**
   ```bash
   # 查找所有API文件
   glob "app/api/**/*.ts"

   # 查找所有页面
   glob "app/pages/**/*.vue"

   # 查找所有类型
   glob "app/types/**/*.d.ts"
   ```

2. **使用Grep搜索**
   ```bash
   # 搜索导出
   grep -r "export const" app/api/ --include="*.ts"

   # 搜索组件名
   grep -r "defineProps" app/components/ --include="*.vue"
   ```

3. **使用IDE功能**
   - 跳转到定义 (Go to Definition)
   - 查找引用 (Find References)
   - 文件导航 (Quick File Navigation)

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-21
