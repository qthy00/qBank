import type {
  WeakPoint,
  WeakPointQuery,
  WeakPointListResp,
  SmartExamParams,
  SmartExamResult,
  SmartPracticeRecord,
  SmartPracticeQuery,
  SmartPracticeListResp
} from '~/types/smart-exam'
import { httpGet, httpPost } from '~/composables/useHttp'

/**
 * 获取薄弱知识点列表
 * @param query 查询参数
 */
export const getWeakPointList = async (query?: WeakPointQuery): Promise<WeakPointListResp> => {
  return await httpGet('WeakPointList', '/member/smart-exam/weak-points', { query })
}

/**
 * 智能组卷
 * @param params 组卷参数
 */
export const generateSmartExam = async (params: SmartExamParams): Promise<SmartExamResult> => {
  return await httpPost('GenerateSmartExam', '/member/smart-exam/generate', params)
}

/**
 * 获取智能组卷结果
 * @param examId 试卷ID
 */
export const getSmartExamResult = async (examId: number): Promise<SmartExamResult> => {
  return await httpGet('SmartExamResult', `/member/smart-exam/result/${examId}`)
}

/**
 * 提交智能练习答案
 * @param examId 试卷ID
 * @param answers 答案列表 { questionId: answer }
 */
export const submitSmartExam = async (
  examId: number,
  answers: Record<number, string>
): Promise<{ score: number; correctCount: number; wrongCount: number }> => {
  return await httpPost('SubmitSmartExam', `/member/smart-exam/submit/${examId}`, { answers })
}

/**
 * 获取智能练习记录列表
 * @param query 查询参数
 */
export const getSmartPracticeList = async (
  query?: SmartPracticeQuery
): Promise<SmartPracticeListResp> => {
  return await httpGet('SmartPracticeList', '/member/smart-exam/practice-list', { query })
}

/**
 * 获取智能练习记录详情
 * @param id 记录ID
 */
export const getSmartPracticeDetail = async (id: number): Promise<SmartPracticeRecord> => {
  return await httpGet('SmartPracticeDetail', `/member/smart-exam/practice-detail/${id}`)
}
