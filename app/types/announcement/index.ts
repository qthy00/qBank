/**
 * 公告模块类型定义
 * @description 公告、通知等相关类型
 */

/**
 * 公告类型枚举
 */
export enum AnnouncementTypeEnum {
  /** 系统公告 */
  SYSTEM = 1,
  /** 活动通知 */
  ACTIVITY = 2,
  /** 更新日志 */
  UPDATE = 3,
  /** 其他 */
  OTHER = 4
}

/**
 * 公告状态枚举
 */
export enum AnnouncementStatusEnum {
  /** 草稿 */
  DRAFT = 0,
  /** 已发布 */
  PUBLISHED = 1,
  /** 已下线 */
  OFFLINE = 2
}

/**
 * 公告基础信息
 */
export interface Announcement {
  /** 公告ID */
  id: number
  /** 公告标题 */
  title: string
  /** 公告内容 */
  content: string
  /** 公告类型 */
  type: number
  /** 公告状态 */
  status: number
  /** 是否置顶 */
  isTop: boolean
  /** 浏览次数 */
  viewCount: number
  /** 发布时间 */
  publishTime: number
  /** 创建时间 */
  createTime: number
}

/**
 * 公告VO（视图对象）
 */
export interface AnnouncementVO extends Announcement {
  /** 类型名称 */
  typeName: string
  /** 状态名称 */
  statusName: string
  /** 摘要（纯文本，用于列表展示） */
  summary: string
}

/**
 * 公告列表请求
 */
export interface AnnouncementListReqVO {
  /** 公告类型 */
  type?: number
  /** 页码 */
  pageNo?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 公告列表响应
 */
export interface AnnouncementListRespVO {
  /** 列表数据 */
  list: AnnouncementVO[]
  /** 总数 */
  total: number
}

/**
 * 首页公告（简化信息）
 */
export interface HomeAnnouncementVO {
  /** 公告ID */
  id: number
  /** 公告标题 */
  title: string
  /** 公告类型 */
  type: number
  /** 是否置顶 */
  isTop: boolean
}
