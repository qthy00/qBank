/**
 * 智能组卷模块类型定义
 */

/**
 * 薄弱知识点
 */
export interface WeakPoint {
  /** 知识点ID */
  knowledgePointId: number
  /** 知识点名称 */
  knowledgePointName: string
  /** 父级分类ID */
  parentId?: number
  /** 父级分类名称 */
  parentName?: string
  /** 错题数量 */
  wrongCount: number
  /** 总做题数 */
  totalCount: number
  /** 正确率（0-100） */
  accuracy: number
  /** 薄弱程度 */
  weakLevel: 'high' | 'medium' | 'low'
}

/**
 * 薄弱知识点查询参数
 */
export interface WeakPointQuery {
  /** 薄弱程度筛选 */
  weakLevel?: ('high' | 'medium' | 'low')[]
  /** 父级分类ID */
  parentId?: number
}

/**
 * 薄弱知识点列表响应
 */
export interface WeakPointListResp {
  /** 薄弱知识点列表 */
  list: WeakPoint[]
  /** 总数量 */
  total: number
  /** 高危薄弱数量 */
  highCount: number
  /** 中度薄弱数量 */
  mediumCount: number
  /** 轻度薄弱数量 */
  lowCount: number
}

/**
 * 智能组卷参数
 */
export interface SmartExamParams {
  /** 题目数量 */
  questionCount: number
  /** 难度筛选（1=简单, 2=中等, 3=困难） */
  difficulty: number[]
  /** 题型筛选（1=单选, 2=多选, 3=判断, 4=填空） */
  questionTypes: number[]
  /** 薄弱程度筛选 */
  weakLevel: ('high' | 'medium' | 'low')[]
  /** 指定知识点ID列表（可选） */
  knowledgePointIds?: number[]
}

/**
 * 智能组卷结果
 */
export interface SmartExamResult {
  /** 试卷ID */
  examId: number
  /** 试卷名称 */
  examName: string
  /** 题目列表 */
  questions: SmartExamQuestion[]
  /** 组卷统计 */
  stats: SmartExamStats
}

/**
 * 智能组卷题目
 */
export interface SmartExamQuestion {
  /** 题目ID */
  id: number
  /** 题号 */
  number: number
  /** 题目内容 */
  content: string
  /** 题型（1=单选, 2=多选, 3=判断, 4=填空） */
  type: number
  /** 题型名称 */
  typeName: string
  /** 难度（1=简单, 2=中等, 3=困难） */
  difficulty: number
  /** 难度名称 */
  difficultyName: string
  /** 选项（单选/多选/判断时有） */
  options?: QuestionOption[]
  /** 正确答案 */
  answer: string
  /** 答案解析 */
  analysis?: string
  /** 知识点ID */
  knowledgePointId: number
  /** 知识点名称 */
  knowledgePointName: string
  /** 该知识点正确率 */
  knowledgePointAccuracy: number
}

/**
 * 题目选项
 */
export interface QuestionOption {
  /** 选项标识（A/B/C/D） */
  label: string
  /** 选项内容 */
  content: string
}

/**
 * 智能组卷统计
 */
export interface SmartExamStats {
  /** 总题数 */
  totalCount: number
  /** 单选题数 */
  singleCount: number
  /** 多选题数 */
  multiCount: number
  /** 判断题数 */
  judgeCount: number
  /** 填空题数 */
  fillCount: number
  /** 简单题数 */
  easyCount: number
  /** 中等题数 */
  mediumCount: number
  /** 困难题数 */
  hardCount: number
  /** 覆盖薄弱知识点数 */
  weakPointCount: number
  /** 预计用时（分钟） */
  estimatedTime: number
}

/**
 * 智能练习记录
 */
export interface SmartPracticeRecord {
  /** 记录ID */
  id: number
  /** 试卷ID */
  examId: number
  /** 试卷名称 */
  examName: string
  /** 题目数量 */
  questionCount: number
  /** 正确数 */
  correctCount: number
  /** 错误数 */
  wrongCount: number
  /** 正确率 */
  accuracy: number
  /** 用时（秒） */
  duration: number
  /** 创建时间 */
  createTime: string
}

/**
 * 智能练习记录查询参数
 */
export interface SmartPracticeQuery {
  /** 页码 */
  page?: number
  /** 每页数量 */
  limit?: number
}

/**
 * 智能练习记录列表响应
 */
export interface SmartPracticeListResp {
  /** 记录列表 */
  list: SmartPracticeRecord[]
  /** 总数量 */
  total: number
}
