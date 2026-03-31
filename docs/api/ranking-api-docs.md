# 排行榜模块接口文档

## 模块说明

排行榜模块用于展示用户在题库中的学习排名情况，包括做题数、正确率、学习时长三个维度的排行，支持按日、周、月、总榜时间维度查询。

**模块标识**: `ranking`  
**基础路径**: `/app-api/member/ranking`  
**版本**: v1.0  
**最后更新**: 2026-03-31

---

## 接口列表

### 1. 获取排行榜列表

**接口说明**: 获取指定类型和时间维度的排行榜列表数据

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/ranking/list`
- **权限要求**: 需登录

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| type | string | 是 | - | 榜单类型：`question_count`做题数 / `accuracy_rate`正确率 / `study_duration`学习时长 |
| dimension | string | 是 | - | 时间维度：`day`今日 / `week`本周 / `month`本月 / `total`总榜 |
| limit | number | 否 | 10 | 榜单数量，默认返回前10名 |

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| list | RankingItemVO[] | 榜单列表 |
| userRank | RankingItemVO | 当前用户排名信息（如未上榜则为null） |
| updateTime | string | 榜单更新时间 |
| rankingType | string | 榜单类型 |
| timeDimension | string | 时间维度 |

**RankingItemVO 结构**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| rank | number | 排名（1-N） |
| userId | number | 用户ID |
| nickname | string | 用户昵称 |
| avatar | string | 用户头像URL |
| value | number | 原始数值（做题数/正确率/学习分钟数） |
| valueText | string | 格式化后的显示文本（如："128题" / "95.5%" / "3小时25分钟"） |
| trend | string | 趋势：`up`上升 / `down`下降 / `same`持平 |
| trendValue | number | 趋势变化值（排名变化数） |
| isCurrentUser | boolean | 是否为当前用户 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "rank": 1,
        "userId": 1001,
        "nickname": "学霸小明",
        "avatar": "https://example.com/avatar/1001.jpg",
        "value": 256,
        "valueText": "256题",
        "trend": "up",
        "trendValue": 3,
        "isCurrentUser": false
      },
      {
        "rank": 2,
        "userId": 1002,
        "nickname": "题库达人",
        "avatar": "https://example.com/avatar/1002.jpg",
        "value": 198,
        "valueText": "198题",
        "trend": "same",
        "trendValue": 0,
        "isCurrentUser": false
      }
    ],
    "userRank": {
      "rank": 8,
      "userId": 1008,
      "nickname": "我",
      "avatar": "https://example.com/avatar/1008.jpg",
      "value": 156,
      "valueText": "156题",
      "trend": "down",
      "trendValue": 2,
      "isCurrentUser": true
    },
    "updateTime": "2026-03-31T10:00:00",
    "rankingType": "question_count",
    "timeDimension": "day"
  }
}
```

---

### 2. 获取排行榜统计信息

**接口说明**: 获取排行榜的统计数据，包括总参与人数、今日活跃人数等

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/ranking/stats`
- **权限要求**: 需登录

**请求参数**: 无

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| totalParticipants | number | 总参与人数 |
| todayActiveUsers | number | 今日活跃用户数 |
| updateTime | string | 榜单统计更新时间 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalParticipants": 8542,
    "todayActiveUsers": 1256,
    "updateTime": "2026-03-31T10:00:00"
  }
}
```

---

### 3. 获取用户排名详情

**接口说明**: 获取指定用户在三个榜单类型下的排名详情

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/ranking/user/{userId}`
- **权限要求**: 需登录

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | number | 是 | 用户ID |

**响应参数**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| questionCountRank | RankingItemVO | 做题数排名详情 |
| accuracyRateRank | RankingItemVO | 正确率排名详情 |
| studyDurationRank | RankingItemVO | 学习时长排名详情 |
| comprehensiveRank | number | 综合排名 |

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "questionCountRank": {
      "rank": 8,
      "userId": 1008,
      "nickname": "学霸小王",
      "avatar": "https://example.com/avatar/1008.jpg",
      "value": 156,
      "valueText": "156题",
      "trend": "up",
      "trendValue": 3,
      "isCurrentUser": false
    },
    "accuracyRateRank": {
      "rank": 15,
      "userId": 1008,
      "nickname": "学霸小王",
      "avatar": "https://example.com/avatar/1008.jpg",
      "value": 92.5,
      "valueText": "92.5%",
      "trend": "same",
      "trendValue": 0,
      "isCurrentUser": false
    },
    "studyDurationRank": {
      "rank": 5,
      "userId": 1008,
      "nickname": "学霸小王",
      "avatar": "https://example.com/avatar/1008.jpg",
      "value": 180,
      "valueText": "3小时0分钟",
      "trend": "up",
      "trendValue": 2,
      "isCurrentUser": false
    },
    "comprehensiveRank": 42
  }
}
```

---

### 4. 获取当前用户排名

**接口说明**: 获取当前登录用户在三个榜单类型下的排名详情

**请求信息**:
- **HTTP Method**: GET
- **接口路径**: `/member/ranking/user/current`
- **权限要求**: 需登录

**请求参数**: 无

**响应参数**: 同「获取用户排名详情」接口

**响应示例**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "questionCountRank": {
      "rank": 8,
      "userId": 1008,
      "nickname": "我",
      "avatar": "https://example.com/avatar/1008.jpg",
      "value": 156,
      "valueText": "156题",
      "trend": "up",
      "trendValue": 3,
      "isCurrentUser": true
    },
    "accuracyRateRank": {
      "rank": 15,
      "userId": 1008,
      "nickname": "我",
      "avatar": "https://example.com/avatar/1008.jpg",
      "value": 92.5,
      "valueText": "92.5%",
      "trend": "same",
      "trendValue": 0,
      "isCurrentUser": true
    },
    "studyDurationRank": {
      "rank": 5,
      "userId": 1008,
      "nickname": "我",
      "avatar": "https://example.com/avatar/1008.jpg",
      "value": 180,
      "valueText": "3小时0分钟",
      "trend": "up",
      "trendValue": 2,
      "isCurrentUser": true
    },
    "comprehensiveRank": 42
  }
}
```

---

## 数据类型定义

### RankingItemVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| rank | number | 排名 |
| userId | number | 用户ID |
| nickname | string | 用户昵称 |
| avatar | string | 用户头像URL |
| value | number | 数值（做题数/正确率/分钟数） |
| valueText | string | 格式化显示文本 |
| trend | string | 趋势：up/down/same |
| trendValue | number | 趋势变化值 |
| isCurrentUser | boolean | 是否当前用户 |

### RankingListRespVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| list | RankingItemVO[] | 榜单列表 |
| userRank | RankingItemVO | 当前用户排名（可选） |
| updateTime | string | 更新时间 |
| rankingType | string | 榜单类型 |
| timeDimension | string | 时间维度 |

### RankingStatsVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| totalParticipants | number | 总参与人数 |
| todayActiveUsers | number | 今日活跃人数 |
| updateTime | string | 更新时间 |

### UserRankingDetailVO

| 字段名 | 类型 | 说明 |
|--------|------|------|
| questionCountRank | RankingItemVO | 做题数排名 |
| accuracyRateRank | RankingItemVO | 正确率排名 |
| studyDurationRank | RankingItemVO | 学习时长排名 |
| comprehensiveRank | number | 综合排名 |

---

## 枚举值定义

### RankingType（榜单类型）

| 值 | 说明 |
|----|------|
| question_count | 做题数榜 |
| accuracy_rate | 正确率榜 |
| study_duration | 学习时长榜 |

### TimeDimension（时间维度）

| 值 | 说明 |
|----|------|
| day | 今日 |
| week | 本周 |
| month | 本月 |
| total | 总榜 |

### Trend（趋势）

| 值 | 说明 |
|----|------|
| up | 排名上升 |
| down | 排名下降 |
| same | 排名持平 |

---

## 业务规则说明

### 1. 做题数榜计算规则

- **统计范围**: 用户在选定时间内完成的题目数量
- **排序规则**: 按做题数降序排列
- **上榜条件**: 做题数 > 0

### 2. 正确率榜计算规则

- **统计范围**: 用户在选定时间内的答题正确率
- **计算公式**: 正确题数 / 总答题数 × 100%
- **排序规则**: 按正确率降序排列
- **上榜条件**: 至少完成 100 道题

### 3. 学习时长榜计算规则

- **统计范围**: 用户在题库中的实际停留学习时间（分钟）
- **排序规则**: 按学习时长降序排列
- **上榜条件**: 学习时长 > 0

### 4. 综合排名计算规则

- 综合三个榜单的排名加权计算
- 排名越靠前，综合排名越高
- 具体权重由业务决定（建议：做题数40% + 正确率30% + 学习时长30%）

### 5. 榜单更新机制

- **实时更新**: 用户数据变化时实时计算
- **缓存策略**: 可设置缓存时间（如5分钟）减轻服务器压力
- **定时任务**: 每日/每周/每月榜单需定时重置

---

## 数据库设计建议

### ranking_statistics 表（每日统计）

```sql
CREATE TABLE ranking_statistics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT '用户ID',
  stat_date DATE NOT NULL COMMENT '统计日期',
  question_count INT DEFAULT 0 COMMENT '做题数',
  correct_count INT DEFAULT 0 COMMENT '正确题数',
  total_count INT DEFAULT 0 COMMENT '总答题数',
  study_duration INT DEFAULT 0 COMMENT '学习时长（分钟）',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_date (user_id, stat_date),
  INDEX idx_date (stat_date)
) COMMENT='用户每日学习统计表';
```

### ranking_cache 表（榜单缓存）

```sql
CREATE TABLE ranking_cache (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ranking_type VARCHAR(32) NOT NULL COMMENT '榜单类型',
  time_dimension VARCHAR(32) NOT NULL COMMENT '时间维度',
  rank_num INT NOT NULL COMMENT '排名',
  user_id BIGINT NOT NULL COMMENT '用户ID',
  value DECIMAL(10,2) NOT NULL COMMENT '数值',
  trend VARCHAR(10) COMMENT '趋势',
  trend_value INT DEFAULT 0 COMMENT '趋势变化值',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_type_dim_rank (ranking_type, time_dimension, rank_num),
  INDEX idx_type_dim (ranking_type, time_dimension)
) COMMENT='榜单缓存表';
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误（如无效的榜单类型） |
| 401 | 未登录或Token过期 |
| 403 | 无权限访问 |
| 404 | 用户不存在 |
| 500 | 服务器内部错误 |

---

## 前端类型定义参考

```typescript
// types/ranking/index.d.ts

/** 榜单类型 */
export type RankingType = 'question_count' | 'accuracy_rate' | 'study_duration'

/** 时间维度 */
export type TimeDimension = 'day' | 'week' | 'month' | 'total'

/** 榜单项视图对象 */
export interface RankingItemVO {
  rank: number
  userId: number
  nickname: string
  avatar?: string
  value: number
  valueText: string
  trend?: 'up' | 'down' | 'same'
  trendValue?: number
  isCurrentUser?: boolean
}

/** 排行榜列表响应 */
export interface RankingListRespVO {
  list: RankingItemVO[]
  userRank?: RankingItemVO
  updateTime: string
  rankingType: RankingType
  timeDimension: TimeDimension
}

/** 排行榜统计信息 */
export interface RankingStatsVO {
  totalParticipants: number
  todayActiveUsers: number
  updateTime: string
}

/** 用户排名详情 */
export interface UserRankingDetailVO {
  questionCountRank?: RankingItemVO
  accuracyRateRank?: RankingItemVO
  studyDurationRank?: RankingItemVO
  comprehensiveRank?: number
}
```

---

**文档版本**: v1.0  
**编写日期**: 2026-03-31  
**前端负责人**: [前端人员]  
**后端负责人**: [后端人员]
