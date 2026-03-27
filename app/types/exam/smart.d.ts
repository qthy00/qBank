/**
 * 智能组卷相关类型定义
 */

import type { QuestionVO } from './index'

/**
 * 薄弱知识点
 */
export interface WeakKnowledgePoint {
  /** 知识点ID */
  id: number
  /** 知识点名称 */
  name: string
  /** 所属科目ID */
  subjectId: number
  /** 所属科目名称 */
  subjectName: string
  /** 正确率 */
  accuracy: number
  /** 优先级 1-5 */
  priority: number
  /** 总题数 */
  totalQuestions: number
  /** 已做题数 */
  completedQuestions: number
  /** 错题数 */
  wrongQuestions: number
}

/**
 * 智能组卷配置请求
 */
export interface SmartPaperReqVO {
  /** 题库ID */
  qbankId?: number
  /** 科目ID */
  subjectId?: number
  /** 选择的知识点ID列表 */
  knowledgePointIds?: number[]
  /** 难度等级 1-5 */
  difficulty?: number
  /** 题目数量 */
  questionCount: number
  /** 考试时长（分钟） */
  durationMinutes: number
  /** 组卷模式 auto-自动推荐 manual-手动选择 */
  mode: 'auto' | 'manual'
  /** 优先策略 weak-薄弱优先 random-随机 mixed-混合 */
  strategy?: 'weak' | 'random' | 'mixed'
}

/**
 * 智能组卷配置响应
 */
export interface SmartPaperConfigRespVO {
  /** 薄弱知识点列表 */
  weakPoints: WeakKnowledgePoint[]
  /** 推荐题目数量 */
  recommendCount: number
  /** 推荐考试时长 */
  recommendDuration: number
  /** 建议难度 */
  suggestDifficulty: number
}

/**
 * 智能试卷生成响应
 */
export interface SmartPaperRespVO {
  /** 试卷ID */
  paperId: number
  /** 试卷标题 */
  title: string
  /** 考试时长（分钟） */
  durationMinutes: number
  /** 总分 */
  totalScore: number
  /** 题目数量 */
  questionCount: number
  /** 覆盖的知识点 */
  knowledgePoints: {
    id: number
    name: string
    questionCount: number
  }[]
  /** 题目列表 */
  questions: QuestionVO[]
}

/**
 * 智能组卷历史记录
 */
export interface SmartPaperHistoryVO {
  /** 记录ID */
  id: number
  /** 试卷ID */
  paperId: number
  /** 试卷标题 */
  title: string
  /** 题库名称 */
  qbankName: string
  /** 题目数量 */
  questionCount: number
  /** 得分 */
  score: number
  /** 总分 */
  totalScore: number
  /** 正确率 */
  accuracy: number
  /** 用时（秒） */
  spendTime: number
  /** 覆盖知识点数 */
  knowledgePointCount: number
  /** 状态 0-未完成 1-已完成 */
  status: number
  /** 提交时间 */
  submitTime: string
}

/**
 * 智能组卷历史查询请求
 */
export interface SmartPaperHistoryReqVO {
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 题库ID */
  qbankId?: number
}
