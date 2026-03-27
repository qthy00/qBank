import type {
  NoteVO,
  NoteListRespVO,
  NoteCreateReqVO,
  NoteUpdateReqVO,
  NoteStatisticsRespVO,
  NoteTagStatVO,
} from '~/types/note'
import { /* httpGet, httpPost, httpPut, httpDelete */ } from '~/composables/useHttp'
import {
  getMockNoteList,
  getMockNoteDetail,
  getMockNoteStatistics,
  getMockNoteTagStats,
  mockCreateNote,
  mockUpdateNote,
  mockDeleteNote,
} from './mock'

/**
 * 笔记模块 API
 */

/* ==================== 查询接口 ==================== */

/**
 * 获取笔记列表
 * @param params 查询参数
 * @returns 笔记列表
 */
export const getNoteList = async (params: {
  page?: number
  limit?: number
  qbankId?: number
  keyword?: string
  tag?: string
}): Promise<NoteListRespVO> => {
  /* Mock 数据 */
  return getMockNoteList(params)
}

/**
 * 获取笔记详情
 * @param id 笔记ID
 * @returns 笔记详情
 */
export const getNoteDetail = async (id: number): Promise<NoteVO | null> => {
  /* Mock 数据 */
  return getMockNoteDetail(id)
}

/**
 * 获取笔记统计
 * @returns 笔记统计数据
 */
export const getNoteStatistics = async (): Promise<NoteStatisticsRespVO> => {
  /* Mock 数据 */
  return getMockNoteStatistics()
}

/**
 * 获取笔记标签统计
 * @returns 标签统计列表
 */
export const getNoteTagStats = async (): Promise<NoteTagStatVO[]> => {
  /* Mock 数据 */
  return getMockNoteTagStats()
}

/* ==================== 操作接口 ==================== */

/**
 * 创建笔记
 * @param data 笔记数据
 * @returns 创建的笔记ID
 */
export const createNote = async (data: NoteCreateReqVO): Promise<number> => {
  /* Mock 数据 */
  return mockCreateNote(data)
}

/**
 * 更新笔记
 * @param data 笔记数据
 * @returns 是否成功
 */
export const updateNote = async (data: NoteUpdateReqVO): Promise<boolean> => {
  /* Mock 数据 */
  return mockUpdateNote(data)
}

/**
 * 删除笔记
 * @param id 笔记ID
 * @returns 是否成功
 */
export const deleteNote = async (id: number): Promise<boolean> => {
  /* Mock 数据 */
  return mockDeleteNote(id)
}
