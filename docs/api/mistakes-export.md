# 错题导出接口文档

## 模块说明

错题导出功能，支持将错题导出为PDF或Word格式，便于用户线下复习。

**模块标识**: `mistakes-export`
**基础路径**: `/app-api/member/mistakes/export`
**版本**: v1.0
**最后更新**: 2026-03-26

---

## 接口列表

### 1. 提交错题导出任务

**接口说明**: 提交错题导出任务，支持按条件筛选或指定题目ID导出

**请求信息**:
- **HTTP Method**: POST
- **接口路径**: `/member/mistakes/export`
- **权限要求**: 需登录

**请求体**:

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| exportType | string | 是 | 导出格式：pdf / word |
| filters | object | 否 | 筛选条件（见下方说明） |
| questionIds | array | 否 | 指定导出的题目ID列表，优先级高于filters |

**filters 筛选条件**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| categoryId | number | 分类ID |
| subjectId | number | 科目ID |
| chapterId | number | 章节ID |
| questionType | number | 题型：0-单选, 1-多选, 2-不定项, 3-判断, 4-填空, 5-简答 |
| difficulty | number | 难度：1-简单, 2-中等, 3-困难 |
| isMastered | boolean | 掌握状态：true-已掌握, false-未掌握 |
| startTime | string | 开始时间（YYYY-MM-DD） |
| endTime | string | 结束时间（YYYY-MM-DD） |
| minMistakeCount | number | 最小错误次数 |
| maxMistakeCount | number | 最大错误次数 |

**请求示例**:

```json
{
  "exportType": "pdf",
  "filters": {
    "questionType": 0,
    "difficulty": 2,
    "isMastered": false,
    "startTime": "2026-01-01",
    "endTime": "2026-03-26"
  }
}
```

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| taskId | string | 导出任务ID |
| status | string | 导出状态：pending-处理中, completed-已完成, failed-失败 |
| downloadUrl | string | 下载URL（status为completed时返回） |
| fileName | string | 文件名称 |
| fileSize | number | 文件大小（字节） |
| createTime | string | 创建时间 |
| errorMsg | string | 错误信息（status为failed时返回） |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "taskId": "export_20260326113000_abc123",
    "status": "pending",
    "createTime": "2026-03-26 11:30:00"
  }
}
```

---

### 2. 获取导出任务状态

**接口说明**: 查询导出任务的处理状态

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/mistakes/export/status/{taskId}`
- **权限要求**: 需登录

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| taskId | string | 是 | 任务ID |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "taskId": "export_20260326113000_abc123",
    "status": "completed",
    "downloadUrl": "https://example.com/download/export_abc123.pdf",
    "fileName": "错题导出_20260326.pdf",
    "fileSize": 1024567,
    "createTime": "2026-03-26 11:30:00",
    "completeTime": "2026-03-26 11:30:05"
  }
}
```

---

### 3. 获取导出历史列表

**接口说明**: 获取用户的错题导出历史记录

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/mistakes/export/history`
- **权限要求**: 需登录

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 10 | 每页数量 |

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| list | array | 导出历史列表 |
| total | number | 总记录数 |

**list 单项结构**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| taskId | string | 任务ID |
| exportType | string | 导出格式：pdf / word |
| fileName | string | 文件名称 |
| fileSize | number | 文件大小 |
| questionCount | number | 包含题目数量 |
| status | string | 状态：pending / completed / failed |
| createTime | string | 创建时间 |
| completeTime | string | 完成时间 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "taskId": "export_20260326113000_abc123",
        "exportType": "pdf",
        "fileName": "错题导出_20260326.pdf",
        "fileSize": 1024567,
        "questionCount": 50,
        "status": "completed",
        "createTime": "2026-03-26 11:30:00",
        "completeTime": "2026-03-26 11:30:05"
      }
    ],
    "total": 1
  }
}
```

---

### 4. 取消导出任务

**接口说明**: 取消正在处理中的导出任务

**请求信息**:
- **HTTP Method**: POST
- **接口路径**: `/member/mistakes/export/cancel/{taskId}`
- **权限要求**: 需登录

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| taskId | string | 是 | 任务ID |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

### 5. 删除导出记录

**接口说明**: 删除导出历史记录

**请求信息**:
- **HTTP Method**: POST
- **接口路径**: `/member/mistakes/export/delete/{taskId}`
- **权限要求**: 需登录

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| taskId | string | 是 | 任务ID |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 数据类型定义

### MistakeExportReqVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| exportType | string | 导出格式：pdf / word |
| filters | MistakeExportFilterVO | 筛选条件 |
| questionIds | number[] | 指定导出的题目ID列表 |

### MistakeExportFilterVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| categoryId | number | 分类ID |
| subjectId | number | 科目ID |
| chapterId | number | 章节ID |
| questionType | number | 题型 |
| difficulty | number | 难度 |
| isMastered | boolean | 掌握状态 |
| startTime | string | 开始时间 |
| endTime | string | 结束时间 |
| minMistakeCount | number | 最小错误次数 |
| maxMistakeCount | number | 最大错误次数 |

### MistakeExportRespVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| taskId | string | 任务ID |
| status | string | 导出状态 |
| downloadUrl | string | 下载URL |
| fileName | string | 文件名称 |
| fileSize | number | 文件大小 |
| createTime | string | 创建时间 |
| completeTime | string | 完成时间 |
| errorMsg | string | 错误信息 |

### MistakeExportHistoryVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| taskId | string | 任务ID |
| exportType | string | 导出格式 |
| fileName | string | 文件名称 |
| fileSize | number | 文件大小 |
| questionCount | number | 题目数量 |
| status | string | 状态 |
| createTime | string | 创建时间 |
| completeTime | string | 完成时间 |

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或Token过期 |
| 403 | 无权限访问 |
| 404 | 任务不存在 |
| 500 | 服务器内部错误 |
| 1001 | 导出任务创建失败 |
| 1002 | 导出文件生成失败 |
| 1003 | 无可导出的错题 |

---

## 前端实现参考

### API调用示例

```typescript
// 提交导出任务
const handleExport = async () => {
  const res = await exportMistakes({
    exportType: 'pdf',
    filters: {
      questionType: 0,
      difficulty: 2,
      isMastered: false
    }
  })

  if (res.status === 'completed') {
    // 直接下载
    window.open(res.downloadUrl)
  } else {
    // 轮询状态
    startPolling(res.taskId)
  }
}

// 轮询状态
const startPolling = (taskId: string) => {
  const timer = setInterval(async () => {
    const status = await getExportTaskStatus(taskId)
    if (status.status === 'completed') {
      clearInterval(timer)
      window.open(status.downloadUrl)
    } else if (status.status === 'failed') {
      clearInterval(timer)
      message.error(status.errorMsg)
    }
  }, 2000)
}
```

---

**文档版本**: v1.0
**适用项目**: 学次元在线题库
**最后更新**: 2026-03-26
