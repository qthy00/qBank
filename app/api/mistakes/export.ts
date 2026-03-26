import type {
  MistakeExportReqVO,
  MistakeExportRespVO,
  MistakeExportHistoryListRespVO
} from '~/types/mistake/export'
import { httpGet, httpPost } from '~/composables/useHttp'
import {
  mockExportMistakes,
  mockGetExportTaskStatus,
  mockGetExportHistory,
  mockCancelExportTask,
  mockDeleteExportRecord
} from './export-mock'

/* 是否启用Mock数据 */
const ENABLE_MOCK = true

/**
 * 提交错题导出任务
 * @param data 导出请求参数
 * @returns 导出任务信息
 */
export const exportMistakes = (data: MistakeExportReqVO) => {
  if (ENABLE_MOCK) {
    return mockExportMistakes(data)
  }
  return httpPost<MistakeExportRespVO>('ExportMistakes', '/member/mistakes/export', data)
}

/**
 * 获取导出任务状态
 * @param taskId 任务ID
 * @returns 导出任务信息
 */
export const getExportTaskStatus = (taskId: string) => {
  if (ENABLE_MOCK) {
    return mockGetExportTaskStatus(taskId)
  }
  return httpGet<MistakeExportRespVO>('ExportTaskStatus', `/member/mistakes/export/status/${taskId}`)
}

/**
 * 获取导出历史列表
 * @param page 页码
 * @param limit 每页数量
 * @returns 导出历史列表
 */
export const getExportHistory = (page: number = 1, limit: number = 10) => {
  if (ENABLE_MOCK) {
    return mockGetExportHistory(page, limit)
  }
  return httpGet<MistakeExportHistoryListRespVO>('ExportHistory', '/member/mistakes/export/history', {
    query: { page, limit }
  })
}

/**
 * 取消导出任务
 * @param taskId 任务ID
 */
export const cancelExportTask = (taskId: string) => {
  if (ENABLE_MOCK) {
    return mockCancelExportTask(taskId)
  }
  return httpPost('CancelExportTask', `/member/mistakes/export/cancel/${taskId}`, {})
}

/**
 * 删除导出记录
 * @param taskId 任务ID
 */
export const deleteExportRecord = (taskId: string) => {
  if (ENABLE_MOCK) {
    return mockDeleteExportRecord(taskId)
  }
  return httpPost('DeleteExportRecord', `/member/mistakes/export/delete/${taskId}`, {})
}
