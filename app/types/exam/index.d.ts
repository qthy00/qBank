/**
 * 模拟考试相关类型定义
 */

import type { QuestionVO, Paper, PaperReport, QuestionItem } from '../qBank/index'

/**
 * 模拟考试配置请求
 */
export interface MockPaperReqVO {
  /** 题库ID */
  qbankId: number
  /** 科目ID */
  subjectId?: number
  /** 考试时长（分钟） */
  durationMinutes: number
  /** 题目配置信息 */
  questionInfo: QuestionTypeConfig[]
  /** 是否随机抽题 */
  randomQuestions?: boolean
  /** 难度等级 1-5 */
  difficulty?: number
  /** 及格分数 */
  passScore?: number
}

/**
 * 题型配置
 */
export interface QuestionTypeConfig {
  /** 显示名称 */
  displayName: string
  /** 题型 */
  type: number
  /** 题目数量 */
  count: number
  /** 每题分数 */
  score: number
  /** 该题型总分 */
  totalScore: number
}

/**
 * 提交试卷请求
 */
export interface SubmitPaperReqVO {
  /** 试卷ID */
  paperId: number
  /** 答案列表 */
  answers: PaperAnswerVO[]
  /** 提交时间 */
  submitTime: number
  /** 开始时间 */
  startTime?: number
}

/**
 * 试卷答案项
 */
export interface PaperAnswerVO {
  /** 题目ID */
  questionId: number
  /** 答案内容 */
  answer: string
  /** 题型名称 */
  typeName?: string
  /** 耗时（秒） */
  spendTime?: number
  /** 分数 */
  score?: number
}

/**
 * 试卷生成响应
 */
export interface MockPaperRespVO {
  /** 试卷ID */
  paperId: number
  /** 试卷标题 */
  title: string
  /** 考试时长（分钟） */
  durationMinutes: number
  /** 总分 */
  totalScore: number
  /** 题目列表 */
  questions: QuestionVO[]
}

/**
 * 试卷提交响应
 */
export interface SubmitPaperRespVO {
  /** 状态 */
  status: 'SUCCESS' | 'FAILED'
  /** 试卷ID */
  paperId: number
  /** 用户试卷记录ID */
  userPaperId: number
  /** 得分 */
  score?: number
}

/**
 * 考试报告
 */
export interface ExamReportVO extends PaperReport {
  /** 用户试卷记录ID */
  userPaperId: number
  /** 试卷标题 */
  paperTitle: string
  /** 开始时间 */
  startTime: number
  /** 提交时间 */
  submitTime: number
  /** 答题详情 */
  questionAnswers: QuestionAnswerVO[]
}

/**
 * 题目答题详情
 */
export interface QuestionAnswerVO extends QuestionItem {
  /** 是否正确 0-错误 1-正确 */
  isCorrect: number
  /** 用户得分 */
  userScore: number
}

/**
 * 考试历史记录
 */
export interface ExamHistoryVO {
  /** 记录ID */
  id: number
  /** 试卷ID */
  paperId: number
  /** 试卷标题 */
  paperTitle: string
  /** 题库名称 */
  qbankName: string
  /** 得分 */
  score: number
  /** 总分 */
  totalScore: number
  /** 正确率 */
  accuracy: number
  /** 用时（秒） */
  spendTime: number
  /** 考试状态 0-未完成 1-已完成 */
  status: number
  /** 提交时间 */
  submitTime: string
}

/**
 * 考试历史查询请求
 */
export interface ExamHistoryReqVO {
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 题库ID */
  qbankId?: number
}

/**
 * 科目VO
 */
export interface SubjectVO {
  /** 科目ID */
  id: number
  /** 科目名称 */
  name: string
  /** 科目别名 */
  alias?: string
  /** 所属分类ID */
  categoryId?: number
  /** 题目总数 */
  totalQuestions?: number
  /** 已做题数 */
  completedQuestions?: number
}

/**
 * 科目试卷信息
 */
export interface SubjectPaperInfoVO {
  /** 题目信息 */
  questionInfo: QuestionTypeConfig[]
  /** 考试条件 */
  condition: {
    /** 及格分数 */
    pass?: number
    /** 考试时长（分钟） */
    time?: number
  }
}

/**
 * 考试设置
 */
export interface ExamSetting {
  /** 科目ID */
  subjectId: number
  /** 考试时长（分钟） */
  durationMinutes: number
  /** 计时模式 countdown-倒计时 countup-正计时 */
  timeMode: 'countdown' | 'countup'
  /** 题目配置 */
  questionInfo: QuestionTypeConfig[]
  /** 是否随机抽题 */
  randomQuestions: boolean
  /** 难度等级 1-5 */
  difficulty: number
  /** 及格分数 */
  passScore?: number
}
