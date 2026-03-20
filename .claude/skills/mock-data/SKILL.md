---
name: mock-data
description: |
  Mock数据生成规范指南。当用户需要创建 mock 数据、模拟数据、假数据、测试数据时使用此技能。
  适用于 xcy-nuxt 项目，提供统一的 mock 数据编写规范，确保 mock 文件风格一致。
  触发词：mock、模拟数据、假数据、测试数据、mock数据、生成mock
---

# Mock 数据生成规范指南

## 何时使用

✅ **适用场景**
- 创建新的 mock 数据文件
- 为 API 接口编写模拟数据
- 生成测试用的假数据
- 开发环境数据模拟

❌ **不适用场景**
- 真实后端接口开发
- 数据库表设计
- 生产环境数据处理

---

## 目录结构

```
app/api/
├── qbank/
│   └── mock.ts          # 题库相关 mock 数据
├── article/
│   └── mock.ts          # 文章/资讯相关 mock 数据
├── checkin/
│   └── mock.ts          # 打卡相关 mock 数据
├── notification/
│   └── mock.ts          # 通知相关 mock 数据
└── ...
```

**规范**：
1. mock 文件与 API 文件同目录
2. 文件命名为 `mock.ts`
3. 类型定义从 `~/types/xxx` 导入

---

## 文件模板

```typescript
import type { SomeVO, SomeListRespVO } from '~/types/moduleName'

/**
 * Mock 模块描述
 */

/* ==================== 基础数据 ==================== */

/**
 * Mock 常量数据描述
 */
export const mockSomeList: SomeVO[] = [
  {
    id: 1,
    name: '示例名称',
    createTime: '2025-01-15T10:00:00',
  },
]

/* ==================== 数据生成函数 ==================== */

/**
 * 获取 Mock 列表数据
 * @param params 查询参数
 */
export const getMockSomeList = (params: {
  page?: number
  limit?: number
  keyword?: string
}): SomeListRespVO => {
  const { page = 1, limit = 10, keyword } = params
  let list = [...mockSomeList]

  /* 按关键词筛选 */
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    list = list.filter(item =>
      item.name.toLowerCase().includes(lowerKeyword)
    )
  }

  /* 分页 */
  const total = list.length
  const start = (page - 1) * limit
  const end = start + limit
  list = list.slice(start, end)

  return {
    list,
    total,
  }
}

/**
 * 获取 Mock 详情
 * @param id 数据 ID
 */
export const getMockSomeDetail = (id: number): SomeVO | null => {
  return mockSomeList.find(item => item.id === id) || null
}
```

---

## 命名规范

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 常量数据 | mock + 名词 + (List/Detail/Item) | `mockArticleList`, `mockUserDetail` |
| 查询函数 | getMock + 名词 + (List/Detail) | `getMockArticleList`, `getMockArticleDetail` |
| 生成函数 | generateMock + 名词 | `generateMockCalendar`, `generateMockData` |
| 操作函数 | (add/update/delete)Mock + 名词 | `addMockArticle`, `updateMockUser` |

---

## 注释规范

必须使用 `/* */` 注释，**禁止使用 `//`**：

```typescript
/* ✅ 正确 */
/* 这是正确的注释 */
const data = 1

/**
 * 获取 Mock 数据
 * @param id 数据 ID
 */
const getData = (id: number) => {}

// ❌ 错误
// 这是错误的注释
const data = 1
```

---

## 数据规范

### 1. 价格

价格使用**分**为单位（整数）：

```typescript
/* ✅ 正确：价格以分为单位 */
const mockProduct = {
  price: 9900,        // 99.00 元
  originalPrice: 19900,  // 199.00 元
}

// ❌ 错误
const mockProduct = {
  price: 99.00,       // 错误：使用了小数
}
```

### 2. 图片 URL

使用 `picsum.photos` 或类似服务：

```typescript
/* ✅ 正确 */
const mockImages = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/800/600?random=2',
]
```

### 3. 时间格式

使用 ISO 8601 格式：

```typescript
/* ✅ 正确 */
const mockData = {
  createTime: '2025-01-15T10:00:00',
  updateTime: '2025-03-01T15:30:00',
  publishTime: '2025-04-24 10:30:00',  /* 也可使用这种格式 */
}

/* 时间戳（毫秒） */
const mockRecord = {
  checkinTime: 1742371200000,
}
```

### 4. 布尔值

使用明确的 true/false，避免隐式转换：

```typescript
const mockItem = {
  isTop: true,
  isHot: false,
  isPurchased: id === 1 ? false : true,
}
```

### 5. 随机数据

使用 `Math.random()` 生成随机数据：

```typescript
/* 随机评分（4.0 - 4.9） */
rating: Number((4.0 + Math.random() * 0.9).toFixed(1)),

/* 随机整数（500 - 5500） */
viewCount: Math.floor(Math.random() * 5000) + 500,

/* 布尔概率（30% 概率为 true） */
isPurchased: Math.random() > 0.7,
```

---

## 函数规范

### 1. 筛选函数

```typescript
/* 按关键词筛选 */
if (keyword) {
  const lowerKeyword = keyword.toLowerCase()
  list = list.filter(item =>
    item.name.toLowerCase().includes(lowerKeyword) ||
    item.description?.toLowerCase().includes(lowerKeyword)
  )
}

/* 按分类筛选 */
if (categoryId) {
  list = list.filter(item => item.categoryId === categoryId)
}

/* 按状态筛选 */
if (status !== undefined) {
  list = list.filter(item => item.status === status)
}
```

### 2. 排序函数

```typescript
switch (sort) {
  case 'newest':
    list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
    break
  case 'hot':
    list.sort((a, b) => b.viewCount - a.viewCount)
    break
  case 'price_asc':
    list.sort((a, b) => a.price - b.price)
    break
  case 'price_desc':
    list.sort((a, b) => b.price - a.price)
    break
  default:
    list.sort((a, b) => a.sort - b.sort)
}
```

### 3. 分页函数

```typescript
const total = list.length
const start = (page - 1) * limit
const end = start + limit
const paginatedList = list.slice(start, end)

return {
  list: paginatedList,
  total,
}
```

---

## 完整示例

```typescript
import type { ArticleVO, ArticleListRespVO } from '~/types/article'

/**
 * 文章/资讯 Mock 数据
 */

/* ==================== 文章分类 ==================== */
export const mockCategories = [
  { id: 1, name: '考试动态', count: 12 },
  { id: 2, name: '新手必读', count: 8 },
  { id: 3, name: '考试问答', count: 15 },
]

/* ==================== 文章列表数据 ==================== */
export const mockArticleList: ArticleVO[] = [
  {
    id: 1,
    title: '2025年建筑行业最新政策解读与发展趋势分析',
    summary: '本文详细解读了2025年建筑行业最新政策变化...',
    coverImage: 'https://picsum.photos/400/300?random=1',
    author: '学次元编辑部',
    viewCount: 2456,
    publishTime: '2025-04-24 10:30:00',
    categoryId: 1,
    categoryName: '考试动态',
    tags: ['政策解读', '行业动态'],
    isTop: true,
    isHot: true,
  },
]

/* ==================== 查询函数 ==================== */

/**
 * 获取文章列表（Mock）
 * @param params 查询参数
 */
export const getMockArticleList = (params: {
  page?: number
  limit?: number
  categoryId?: number
  keyword?: string
}): ArticleListRespVO => {
  const { page = 1, limit = 10, categoryId, keyword } = params
  let list = [...mockArticleList]

  /* 按分类筛选 */
  if (categoryId) {
    list = list.filter(item => item.categoryId === categoryId)
  }

  /* 按关键词搜索 */
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    list = list.filter(item =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.summary?.toLowerCase().includes(lowerKeyword)
    )
  }

  /* 排序：置顶 > 热门 > 时间 */
  list.sort((a, b) => {
    if (a.isTop !== b.isTop) return (b.isTop ? 1 : 0) - (a.isTop ? 1 : 0)
    if (a.isHot !== b.isHot) return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0)
    return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
  })

  /* 分页 */
  const total = list.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedList = list.slice(start, end)

  return {
    list: paginatedList,
    total,
  }
}

/**
 * 获取文章详情（Mock）
 * @param id 文章 ID
 */
export const getMockArticleDetail = (id: number): ArticleVO | null => {
  return mockArticleList.find(item => item.id === id) || null
}

/**
 * 增加浏览量（Mock）
 * @param id 文章 ID
 */
export const incrementMockViewCount = (id: number): void => {
  const article = mockArticleList.find(item => item.id === id)
  if (article) {
    article.viewCount += 1
  }
}
```

---

## 最佳实践

### DO ✅

1. 导入类型定义
   ```typescript
   import type { ArticleVO } from '~/types/article'
   ```

2. 导出常量数据供复用
   ```typescript
   export const mockArticleList: ArticleVO[] = [...]
   ```

3. 提供获取函数封装复杂逻辑
   ```typescript
   export const getMockArticleList = (params) => { ... }
   ```

4. 使用 `/* */` 注释
   ```typescript
   /* 这是正确的注释 */
   ```

5. 添加 JSDoc 文档
   ```typescript
   /**
    * 获取 Mock 数据
    * @param id 数据 ID
    * @returns 数据详情
    */
   ```

### DON'T ❌

1. 不要使用 `//` 注释
   ```typescript
   // ❌ 错误
   ```

2. 不要使用浮点数表示价格
   ```typescript
   price: 99.99  // ❌ 错误
   ```

3. 不要直接在组件中硬编码 mock 数据
   ```typescript
   // ❌ 错误：应该在 mock.ts 中定义
   const mockData = {...}
   ```

4. 不要遗漏导出关键字
   ```typescript
   const mockData = []  // ❌ 错误：未导出
   ```

---

## 相关文件

| 文件路径 | 说明 |
|----------|------|
| `app/api/qbank/mock.ts` | 题库 mock 数据示例 |
| `app/api/article/mock.ts` | 文章 mock 数据示例 |
| `app/api/checkin/mock.ts` | 打卡 mock 数据示例 |
| `app/api/notification/mock.ts` | 通知 mock 数据示例 |

---

**文档版本**: v1.0
**适用项目**: xcy-nuxt (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-20
