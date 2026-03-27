import {httpGet, httpPost} from "~/composables/useHttp";
import type {
  DocumentListReqVO,
  DocumentListRespVO,
  DocumentDetailVO,
  DocumentCategoryVO,
  ExamTypeVO,
  YearOptionVO,DocumentType
} from "~/types/document";

import {
  getMockDocumentList,
  getMockDocumentDetail,
  getMockDocumentCategories,
  getMockExamTypes,
  getMockYearOptions,
  incrementMockDownloadCount,
} from "./mock";

/**
 * 判断是否使用 Mock 数据
 */
const useMock = () => import.meta.dev

/**
 * 文档下载相关API
 */
export const DocumentApi = {

  /**
   * 获取文档列表
   * @param params 查询参数
   */
  getDocumentList: async (params: DocumentListReqVO): Promise<DocumentListRespVO> => {
    if (useMock()) {
      return getMockDocumentList(params)
    }
    return await httpGet('DocumentList', '/member/document/page', { query: params })
  },

  /**
   * 获取文档详情
   * @param id 文档ID
   */
  getDocumentDetail: async (id: number): Promise<DocumentDetailVO> => {
    if (useMock()) {
      const detail = getMockDocumentDetail(id)
      if (!detail) {
        throw new Error('文档不存在')
      }
      return detail
    }
    return await httpGet('DocumentDetail', `/member/document/get`, { query: { id } })
  },

  /**
   * 获取文档分类列表
   * @param docType 文档类型（可选）
   */
  getDocumentCategories: async (docType?: DocumentType): Promise<DocumentCategoryVO[]> => {
    if (useMock()) {
      return getMockDocumentCategories(docType)
    }
    return await httpGet('DocumentCategories', '/member/document/category/list', { query: { docType } })
  },

  /**
   * 获取考试类型列表
   */
  getExamTypes: async (): Promise<ExamTypeVO[]> => {
    if (useMock()) {
      return getMockExamTypes()
    }
    return await httpGet('ExamTypes', '/member/exam/type/list')
  },

  /**
   * 获取年份选项
   */
  getYearOptions: async (): Promise<YearOptionVO[]> => {
    if (useMock()) {
      return getMockYearOptions()
    }
    return await httpGet('YearOptions', '/member/document/year/options')
  },

  /**
   * 增加文档下载次数
   * @param id 文档ID
   */
  incrementDownloadCount: async (id: number): Promise<void> => {
    if (useMock()) {
      incrementMockDownloadCount(id)
      return
    }
    await httpPost('IncrementDownload', `/member/document/download/${id}`)
  },

  /**
   * 获取文档下载链接
   * @param id 文档ID
   */
  getDownloadUrl: async (id: number): Promise<string> => {
    if (useMock()) {
      /* Mock 返回一个示例下载链接 */
      return `https://example.com/download/${id}`
    }
    const res = await httpGet('DownloadUrl', `/member/document/download/url`, { query: { id } })
    return res.url
  },
}
