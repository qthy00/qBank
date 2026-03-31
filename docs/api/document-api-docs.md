# 文档下载模块接口文档

## 模块说明

文档下载模块提供备考资料的浏览、搜索、下载功能。支持按大类、考试类型、科目、等级、资料类型、状态等多维度筛选，以及排序和关键词搜索。

**模块标识**: `document`
**基础路径**: `/app-api/member/document`
**版本**: v1.0
**最后更新**: 2026-03-20

---

## 接口列表

### 1. 获取大类列表

**接口说明**: 获取文档分类的大类列表（如建筑工程、财会考试等）

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/document/major/list`
- **权限要求**: 无需登录

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | string | 大类编码 |
| name | string | 大类名称 |
| icon | string | 图标（可选） |
| count | number | 文档数量 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "code": "building", "name": "建筑工程", "icon": "ep:office-building", "count": 156 },
    { "code": "finance", "name": "财会考试", "icon": "ep:money", "count": 89 },
    { "code": "banking", "name": "金融考试", "icon": "ep:bank-card", "count": 67 }
  ]
}
```

---

### 2. 获取考试类型列表

**接口说明**: 获取指定大类下的考试类型列表

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/exam/type/list`
- **权限要求**: 无需登录

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| majorCode | string | 否 | 大类编码，不传返回全部 |

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | string | 考试类型编码 |
| name | string | 考试类型名称 |
| majorCode | string | 所属大类编码 |
| count | number | 文档数量 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "code": "yijian", "name": "一级建造师", "majorCode": "building", "count": 85 },
    { "code": "erjian", "name": "二级建造师", "majorCode": "building", "count": 62 }
  ]
}
```

---

### 3. 获取文档分类列表

**接口说明**: 获取文档的分类列表（科目）

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/document/category/list`
- **权限要求**: 无需登录

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| docType | string | 否 | 文档类型：real-真题资料, material-学习资料 |

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 分类ID |
| name | string | 分类名称 |
| icon | string | 图标 |
| count | number | 文档数量 |
| docType | string | 所属文档类型 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "id": 1, "name": "建设工程法规及相关知识", "icon": "ep:collection", "count": 45, "docType": "real" },
    { "id": 2, "name": "建设工程项目管理", "icon": "ep:document-copy", "count": 32, "docType": "real" }
  ]
}
```

---

### 4. 获取等级选项

**接口说明**: 获取文档等级筛选选项

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/document/level/options`
- **权限要求**: 无需登录

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| value | string | 等级编码：free-免费, premium-精品资料, vip-VIP专享 |
| label | string | 等级名称 |
| count | number | 文档数量 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "value": "free", "label": "免费", "count": 234 },
    { "value": "premium", "label": "精品资料", "count": 156 },
    { "value": "vip", "label": "VIP专享", "count": 89 }
  ]
}
```

---

### 5. 获取资料类型选项

**接口说明**: 获取资料类型筛选选项

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/document/material-type/options`
- **权限要求**: 无需登录

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| value | string | 类型编码 |
| label | string | 类型名称 |
| count | number | 文档数量 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "value": "study_plan", "label": "学习计划", "count": 23 },
    { "value": "mind_map", "label": "思维导图", "count": 45 },
    { "value": "core_points", "label": "核心考点", "count": 67 },
    { "value": "mock_exam", "label": "模拟试题", "count": 56 }
  ]
}
```

---

### 6. 获取状态选项

**接口说明**: 获取文档状态筛选选项

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/document/status/options`
- **权限要求**: 无需登录

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| value | string | 状态编码：online-已上线, preview-预告, purchased-已获权限 |
| label | string | 状态名称 |
| count | number | 文档数量 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "value": "online", "label": "已上线", "count": 420 },
    { "value": "preview", "label": "预告", "count": 35 },
    { "value": "purchased", "label": "已获权限", "count": 24 }
  ]
}
```

---

### 7. 获取年份选项

**接口说明**: 获取文档年份筛选选项

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/document/year/options`
- **权限要求**: 无需登录

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| year | number | 年份 |
| count | number | 该年份文档数量 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "year": 2025, "count": 12 },
    { "year": 2024, "count": 48 },
    { "year": 2023, "count": 52 }
  ]
}
```

---

### 8. 获取文档列表

**接口说明**: 分页获取文档列表，支持多维度筛选和排序

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/document/page`
- **权限要求**: 无需登录

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 12 | 每页数量 |
| docType | string | 否 | - | 文档类型：real-真题资料, material-学习资料 |
| majorCode | string | 否 | - | 大类编码 |
| examType | string | 否 | - | 考试类型编码 |
| categoryId | number | 否 | - | 分类ID（科目） |
| level | string | 否 | - | 等级：free/premium/vip |
| materialType | string | 否 | - | 资料类型编码 |
| status | string | 否 | - | 状态：online/preview/purchased |
| year | number | 否 | - | 年份 |
| sort | string | 否 | comprehensive | 排序：comprehensive-综合, newest-最新, downloads-下载最多, price_asc-价格从低到高, price_desc-价格从高到低 |
| keyword | string | 否 | - | 搜索关键词 |

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| list | DocumentVO[] | 文档列表 |
| total | number | 总记录数 |

**DocumentVO 字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 文档ID |
| title | string | 文档标题 |
| summary | string | 文档摘要 |
| coverImage | string | 封面图URL |
| fileSize | number | 文件大小（字节） |
| fileType | string | 文件格式：PDF等 |
| downloadCount | number | 下载次数 |
| viewCount | number | 浏览次数 |
| docType | string | 文档类型：real/material |
| docTypeName | string | 文档类型名称 |
| categoryId | number | 分类ID |
| categoryName | string | 分类名称 |
| majorCode | string | 大类编码 |
| majorName | string | 大类名称 |
| examType | string | 考试类型编码 |
| examTypeName | string | 考试类型名称 |
| year | number | 年份 |
| level | string | 等级：free/premium/vip |
| levelName | string | 等级名称 |
| materialType | string | 资料类型编码 |
| materialTypeName | string | 资料类型名称 |
| status | string | 状态：online/preview/purchased |
| statusName | string | 状态名称 |
| pages | number | 页数 |
| isVip | boolean | 是否VIP专享 |
| isFree | boolean | 是否免费 |
| price | number | 价格（元） |
| tags | string[] | 标签列表 |
| createTime | string | 创建时间 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "2024年一级建造师《建设工程经济》真题及答案解析",
        "summary": "2024年一建建设工程经济真题完整版...",
        "coverImage": "https://example.com/cover/1.jpg",
        "fileSize": 2621440,
        "fileType": "PDF",
        "downloadCount": 3245,
        "viewCount": 5678,
        "docType": "real",
        "docTypeName": "真题资料",
        "categoryId": 3,
        "categoryName": "建设工程经济",
        "majorCode": "building",
        "majorName": "建筑工程",
        "examType": "yijian",
        "examTypeName": "一级建造师",
        "year": 2024,
        "level": "free",
        "levelName": "免费",
        "materialType": "real_exam",
        "materialTypeName": "真题精析",
        "status": "online",
        "statusName": "已上线",
        "pages": 24,
        "isVip": false,
        "isFree": true,
        "price": 0,
        "tags": ["真题", "建设工程经济"],
        "createTime": "2024-09-15 10:30:00"
      }
    ],
    "total": 156
  }
}
```

---

### 9. 获取文档详情

**接口说明**: 根据ID获取文档详情

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/document/get`
- **权限要求**: 无需登录

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 文档ID |

**响应参数**:

在 DocumentVO 基础上增加以下字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| content | string | 文档内容（HTML格式） |
| previewImages | string[] | 预览图片列表 |
| relatedDocuments | DocumentVO[] | 相关文档列表 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "2024年一级建造师《建设工程经济》真题及答案解析",
    "summary": "...",
    "content": "<h2>文档介绍</h2><p>...</p>",
    "previewImages": ["https://example.com/preview/1.jpg"],
    "relatedDocuments": [...],
    "...": "..."
  }
}
```

---

### 10. 增加下载次数

**接口说明**: 增加文档的下载次数统计

**请求信息**:
- **HTTP Method**: POST
- **接口路径**: `/member/document/download/{id}`
- **权限要求**: 需登录

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 文档ID |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

### 11. 获取下载链接

**接口说明**: 获取文档的下载链接

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/document/download/url`
- **权限要求**: 需登录

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 文档ID |

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| url | string | 下载链接 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "url": "https://example.com/download/1?token=xxx"
  }
}
```

---

## 数据类型定义

### DocumentType（文档类型）

| 值 | 说明 |
|----|------|
| real | 真题资料 |
| material | 学习资料 |

### DocumentLevel（文档等级）

| 值 | 说明 |
|----|------|
| free | 免费 |
| premium | 精品资料 |
| vip | VIP专享 |

### DocumentStatus（文档状态）

| 值 | 说明 |
|----|------|
| online | 已上线 |
| preview | 预告 |
| purchased | 已获权限 |

### MaterialType（资料类型）

| 值 | 说明 |
|----|------|
| study_plan | 学习计划 |
| material_change | 教材变化 |
| mind_map | 思维导图 |
| memory_tips | 记忆口诀 |
| core_points | 核心考点 |
| real_exam | 真题精析 |
| mock_exam | 模拟试题 |
| cheat_sheet | 考前N页纸 |
| key_points | 时间、数字、计算考点 |
| course_notes | 课程讲义 |
| industry_standard | 行业规范 |
| answer_template | 答题模板 |
| study_notes | 学习笔记 |
| work_proof | 工作证明模板 |
| case_300 | 案例300问 |
| guide | 报名考生指导手册 |
| mock_contest | 模考大赛 |
| color_notes | 四色笔记 |

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或Token过期 |
| 403 | 无权限访问（非VIP下载VIP资料） |
| 404 | 文档不存在 |
| 500 | 服务器内部错误 |
| 1001 | 文档已下架 |
| 1002 | 下载次数已达上限 |

---

## 前端对接信息

### API 文件位置
`app/api/document/index.ts`

### 类型定义位置
`app/types/document/index.d.ts`

### Mock 数据位置
`app/api/document/mock.ts`

---

**文档版本**: v1.0
**编写人**: 前端开发团队
**最后更新**: 2026-03-20
