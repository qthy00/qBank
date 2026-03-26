/**
 * 错题导出相关类型定义
 */

/**
 * 错题导出请求
 */
export interface MistakeExportReqVO {
  /** 导出格式：pdf / word */
  exportType: 'pdf' | 'word'
  /** 筛选条件 */
  filters?: MistakeExportFilterVO
  /** 指定导出的错题ID列表（优先级高于filters） */
  questionIds?: number[]
}

/**
 * 错题导出筛选条件
 */
export interface MistakeExportFilterVO {
  /** 分类ID */
  categoryId?: number
  /** 科目ID */
  subjectId?: number
  /** 章节ID */
  chapterId?: number
  /** 题型 */
  questionType?: number
  /** 难度 */
  difficulty?: number
  /** 掌握状态：true-已掌握, false-未掌握, null-全部 */
  isMastered?: boolean | null
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 最小错误次数 */
  minMistakeCount?: number
  /** 最大错误次数 */
  maxMistakeCount?: number
}

/**
 * 错题导出响应
 */
export interface MistakeExportRespVO {
  /** 导出任务ID */
  taskId: string
  /** 下载URL */
  downloadUrl?: string
  /** 导出状态：pending-处理中, completed-已完成, failed-失败 */
  status: 'pending' | 'completed' | 'failed'
  /** 文件名称 */
  fileName?: string
  /** 文件大小（字节） */
  fileSize?: number
  /** 创建时间 */
  createTime: string
  /** 完成时间 */
  completeTime?: string
  /** 错误信息 */
  errorMsg?: string
}

/**
 * 导出历史记录
 */
export interface MistakeExportHistoryVO {
  /** 任务ID */
  taskId: string
  /** 导出格式 */
  exportType: 'pdf' | 'word'
  /** 文件名称 */
  fileName: string
  /** 文件大小 */
  fileSize: number
  /** 包含题目数量 */
  questionCount: number
  /** 状态 */
  status: 'pending' | 'completed' | 'failed'
  /** 创建时间 */
  createTime: string
  /** 完成时间 */
  completeTime?: string
}

/**
 * 导出历史列表响应
 */
export interface MistakeExportHistoryListRespVO {
  /** 列表 */
  list: MistakeExportHistoryVO[]
  /** 总数 */
  total: number
}
