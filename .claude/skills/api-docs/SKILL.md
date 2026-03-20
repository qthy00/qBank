---
name: api-docs
description: |
  API 接口文档生成规范。当用户需要生成后端接口文档、接口定义、API文档、swagger文档、接口规范时使用此技能。
  适用于 xcy-nuxt 项目，提供标准化的接口文档模板，便于与后端人员协作开发。
  触发词：API文档、接口文档、swagger、后端接口、接口定义、API接口、生成文档
---

# API 接口文档生成规范

## 何时使用

✅ **适用场景**
- 为新功能生成后端接口文档
- 定义前后端协作的 API 接口规范
- 编写 Swagger/OpenAPI 格式的接口文档
- 整理接口请求参数和响应数据结构
- 与后端人员对接接口需求

❌ **不适用场景**
- 纯前端页面开发（无接口需求）
- 纯后端服务实现（前端已提供文档）
- Mock 数据生成（使用 mock-data 技能）

---

## 文档结构

API 接口文档应包含以下部分：

```
api-docs/
├── 模块说明
├── 接口列表
│   ├── 接口1：功能描述
│   ├── 接口2：功能描述
│   └── ...
├── 数据类型定义
└── 错误码说明
```

---

## 接口文档模板

### Markdown 格式

```markdown
# 模块名称接口文档

## 模块说明

描述该模块的功能定位和业务场景。

**模块标识**: `module-name`
**基础路径**: `/app-api/member/module-name`
**版本**: v1.0
**最后更新**: 2026-03-20

---

## 接口列表

### 1. 获取XX列表

**接口说明**: 获取XX列表数据，支持分页和筛选

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/module-name/list`
- **权限要求**: 需登录

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 10 | 每页数量 |
| keyword | string | 否 | - | 搜索关键词 |
| status | number | 否 | - | 状态筛选 |

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| list | array | 数据列表 |
| total | number | 总记录数 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [...],
    "total": 100
  }
}
```

---

### 2. 获取XX详情

**接口说明**: 根据ID获取XX详情

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/module-name/get/{id}`
- **权限要求**: 需登录

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 数据ID |

**响应参数**: （详见下方数据类型定义）

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {...}
}
```

---

### 3. 创建XX

**接口说明**: 创建新的XX

**请求信息**:
- **HTTP Method**: POST
- **接口路径**: `/member/module-name/create`
- **权限要求**: 需登录

**请求体**:

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 名称 |
| description | string | 否 | 描述 |
| status | number | 否 | 状态，默认1 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": 123  /* 返回创建的数据ID */
}
```

---

### 4. 更新XX

**接口说明**: 更新XX信息

**请求信息**:
- **HTTP Method**: PUT
- **接口路径**: `/member/module-name/update`
- **权限要求**: 需登录

**请求体**:

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 数据ID |
| name | string | 否 | 名称 |
| description | string | 否 | 描述 |

---

### 5. 删除XX

**接口说明**: 删除XX

**请求信息**:
- **HTTP Method**: DELETE
- **接口路径**: `/member/module-name/delete/{id}`
- **权限要求**: 需登录，需管理员权限

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 数据ID |

---

## 数据类型定义

### XXVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 主键ID |
| name | string | 名称 |
| description | string | 描述 |
| status | number | 状态：0-禁用，1-启用 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |

### XXListRespVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| list | XXVO[] | 数据列表 |
| total | number | 总记录数 |

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或Token过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 业务错误：XX已存在 |
| 1002 | 业务错误：XX状态异常 |
```

---

## 接口路径规范

### RESTful 风格

| 操作 | HTTP方法 | 路径格式 | 示例 |
|------|----------|----------|------|
| 查询 | GET | `/member/xxx/get/{id}` | `/member/user/get/123` |
| 列表 | GET | `/member/xxx/list` | `/member/user/list` |
| 分页 | GET | `/member/xxx/page` | `/member/user/page` |
| 创建 | POST | `/member/xxx/create` | `/member/user/create` |
| 更新 | PUT | `/member/xxx/update` | `/member/user/update` |
| 删除 | DELETE | `/member/xxx/delete/{id}` | `/member/user/delete/123` |

### 注意事项

1. **路径前缀统一**: 会员端使用 `/member/`，管理端使用 `/system/`
2. **使用 kebab-case**: `/member/user-profile` 而非 `/member/userProfile`
3. **避免动词**: 使用 HTTP 方法表达动作，路径中不出现 `get`、`update` 等动词（除规范要求外）

---

## 请求参数规范

### GET 请求

- 简单参数使用 Query String
- 复杂筛选条件使用对象序列化

```typescript
/* ✅ 正确 */
GET /member/user/list?page=1&pageSize=10&keyword=test

/* ✅ 复杂筛选 */
GET /member/user/list?query={"status":1,"type":2}
```

### POST/PUT 请求

- 使用 JSON 格式请求体
- Content-Type: `application/json`

```typescript
/* ✅ 正确 */
POST /member/user/create
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "status": 1
}
```

---

## 响应规范

### 统一响应格式

```typescript
interface ApiResponse<T> {
  code: number      /* 错误码，0表示成功 */
  message: string   /* 错误信息 */
  data: T           /* 业务数据 */
}
```

### 分页响应格式

```typescript
interface PageResult<T> {
  list: T[]     /* 数据列表 */
  total: number /* 总记录数 */
}
```

### 响应示例

**成功响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 123,
    "name": "张三"
  }
}
```

**列表响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [...],
    "total": 100
  }
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "参数错误：name不能为空",
  "data": null
}
```

---

## 类型定义规范

### 命名规则

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 请求VO | XxxReqVO | `UserCreateReqVO` |
| 响应VO | XxxRespVO | `UserDetailRespVO` |
| 视图VO | XxxVO | `UserVO` |
| 分页请求 | XxxPageReqVO | `UserPageReqVO` |
| 分页响应 | XxxPageRespVO | `UserPageRespVO` |
| 列表响应 | XxxListRespVO | `UserListRespVO` |

### 类型定义示例

```typescript
/* 用户创建请求 */
export interface UserCreateReqVO {
  name: string
  email: string
  phone?: string
  status?: number
}

/* 用户详情响应 */
export interface UserDetailRespVO {
  id: number
  name: string
  email: string
  phone: string
  status: number
  createTime: string
  updateTime: string
}

/* 分页请求参数 */
export interface UserPageReqVO {
  page?: number
  pageSize?: number
  keyword?: string
  status?: number
}

/* 分页响应 */
export interface UserPageRespVO {
  list: UserVO[]
  total: number
}
```

---

## 完整示例

以下是一个完整的 API 模块示例：

### 前端 API 定义

```typescript
// app/api/coupon/index.ts

import type {
  CouponVO,
  CouponPageReqVO,
  CouponPageRespVO,
  CouponCreateReqVO
} from '~/types/coupon'
import { httpGet, httpPost, httpPut } from '~/composables/useHttp'

/**
 * 分页查询优惠券列表
 */
export const getCouponPage = (params: CouponPageReqVO) => {
  return httpGet<CouponPageRespVO>('CouponPage', '/member/coupon/page', { query: params })
}

/**
 * 获取优惠券详情
 */
export const getCouponDetail = (id: number) => {
  return httpGet<CouponVO>('CouponDetail', `/member/coupon/get/${id}`)
}

/**
 * 创建优惠券
 */
export const createCoupon = (data: CouponCreateReqVO) => {
  return httpPost<number>('CreateCoupon', '/member/coupon/create', data)
}

/**
 * 更新优惠券
 */
export const updateCoupon = (id: number, data: Partial<CouponCreateReqVO>) => {
  return httpPut('UpdateCoupon', '/member/coupon/update', { id, ...data })
}

/**
 * 领取优惠券
 */
export const receiveCoupon = (couponId: number) => {
  return httpPost('ReceiveCoupon', `/member/coupon/receive/${couponId}`)
}
```

### 类型定义

```typescript
// types/coupon/index.d.ts

/**
 * 优惠券视图对象
 */
export interface CouponVO {
  id: number
  name: string
  type: number
  typeName: string
  amount: number
  minSpend: number
  validStartTime: string
  validEndTime: string
  status: number
  statusName: string
  totalCount: number
  remainCount: number
  receivedCount: number
  createTime: string
}

/**
 * 优惠券分页请求
 */
export interface CouponPageReqVO {
  page?: number
  pageSize?: number
  type?: number
  status?: number
}

/**
 * 优惠券分页响应
 */
export interface CouponPageRespVO {
  list: CouponVO[]
  total: number
}

/**
 * 优惠券创建请求
 */
export interface CouponCreateReqVO {
  name: string
  type: number
  amount: number
  minSpend: number
  validStartTime: string
  validEndTime: string
  totalCount: number
}
```

---

## 与后端协作流程

1. **前端定义接口文档**（使用本规范）
2. **前后端评审接口设计**
3. **后端实现接口**（参照文档）
4. **前端对接测试**
5. **文档更新维护**

---

## 最佳实践

### DO ✅

1. **使用 TypeScript 类型**
   ```typescript
   export const getUser = (id: number): Promise<UserVO> => { ... }
   ```

2. **添加 JSDoc 注释**
   ```typescript
   /**
    * 获取用户详情
    * @param id 用户ID
    * @returns 用户详情
    */
   ```

3. **统一错误处理**
   ```typescript
   try {
     const res = await getUser(id)
     return res
   } catch (error) {
     useMessage().error(error.message)
     throw error
   }
   ```

4. **参数校验**
   ```typescript
   if (!id) {
     throw new Error('用户ID不能为空')
   }
   ```

### DON'T ❌

1. **不要混用命名风格**
   ```typescript
   // ❌ 错误
   getUserInfo  // 驼峰
   get_user     // 蛇形
   ```

2. **不要遗漏返回类型**
   ```typescript
   // ❌ 错误
   export const getUser = (id) => { ... }
   ```

3. **不要硬编码 URL**
   ```typescript
   // ❌ 错误
   httpGet('', '/member/user/get/123')  // 硬编码ID
   ```

---

## 相关文件

| 文件路径 | 说明 |
|----------|------|
| `app/composables/useHttp.ts` | HTTP 请求封装 |
| `app/api/user/index.ts` | 用户模块 API 示例 |
| `app/api/login/index.ts` | 登录模块 API 示例 |
| `app/types/user/index.d.ts` | 用户类型定义示例 |

---

**文档版本**: v1.0
**适用项目**: xcy-nuxt (Nuxt 4 + Vue 3 + TypeScript)
**最后更新**: 2026-03-20
