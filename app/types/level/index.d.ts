/**
 * 会员等级系统类型定义
 *
 * 包含会员等级、经验记录等相关类型
 */

/**
 * 会员等级视图对象
 */
export interface MemberLevelVO {
  /** 等级名称 */
  name: string
  /** 等级数值（1-N） */
  level: number
  /** 升级到该等级所需经验值 */
  experience: number
  /** 享受折扣百分比（如95表示95折） */
  discountPercent: number
  /** 等级图标URL */
  icon: string
  /** 等级背景图URL */
  backgroundUrl: string
}

/**
 * 用户等级信息（嵌套在UserVO中）
 */
export interface UserLevelVO {
  /** 等级ID */
  id: number
  /** 等级名称 */
  name: string
  /** 等级数值 */
  level: number
  /** 等级图标URL */
  icon: string
}

/**
 * 经验记录视图对象
 */
export interface ExperienceRecordVO {
  /** 经验变动标题 */
  title: string
  /** 变动经验值（正数表示增加） */
  experience: number
  /** 经验变动描述 */
  description: string
  /** 记录创建时间 */
  createTime: string
}

/**
 * 经验记录分页响应
 */
export interface ExperienceRecordPageRespVO {
  /** 数据列表 */
  list: ExperienceRecordVO[]
  /** 总记录数 */
  total: number
}

/**
 * 经验记录查询参数
 */
export interface ExperienceRecordPageReqVO {
  /** 页码，默认1 */
  pageNo?: number
  /** 每页数量，默认10 */
  pageSize?: number
}

/**
 * 等级进度计算结果
 */
export interface LevelProgressVO {
  /** 当前等级 */
  currentLevel: UserLevelVO | null
  /** 下一等级 */
  nextLevel: MemberLevelVO | null
  /** 当前进度百分比（0-100） */
  progress: number
  /** 当前经验值 */
  currentExp: number
  /** 升级还需经验值 */
  needExp: number
  /** 是否已满级 */
  isMaxLevel: boolean
}
