import { httpGet } from '~/composables/useHttp'
import type {
  AnnouncementListReqVO,
  AnnouncementListRespVO,
  AnnouncementVO,
  HomeAnnouncementVO
} from '~/types/announcement'
import {
  getMockAnnouncementList,
  getMockAnnouncementDetail,
  getMockHomeAnnouncements,
  incrementMockViewCount
} from './mock'

/**
 * 判断是否使用 Mock 数据
 */
const useMock = () => import.meta.dev

/**
 * 公告相关API
 */
export const AnnouncementApi = {

  /**
   * 获取公告列表
   * @param params 查询参数
   */
  getAnnouncementList: async (params: AnnouncementListReqVO = {}): Promise<AnnouncementListRespVO> => {
    if (useMock()) {
      return getMockAnnouncementList(params)
    }
    return await httpGet('AnnouncementList', '/member/announcement/page', { query: params })
  },

  /**
   * 获取公告详情
   * @param id 公告ID
   */
  getAnnouncementDetail: async (id: number): Promise<AnnouncementVO> => {
    if (useMock()) {
      const detail = getMockAnnouncementDetail(id)
      if (!detail) {
        throw new Error('公告不存在')
      }
      return detail
    }
    return await httpGet('AnnouncementDetail', '/member/announcement/get', { query: { id } })
  },

  /**
   * 获取首页公告（置顶+最近7天）
   */
  getHomeAnnouncements: async (): Promise<HomeAnnouncementVO[]> => {
    if (useMock()) {
      return getMockHomeAnnouncements()
    }
    return await httpGet('HomeAnnouncements', '/member/announcement/home-list')
  },

  /**
   * 增加公告浏览量
   * @param id 公告ID
   */
  incrementViewCount: async (id: number): Promise<void> => {
    if (useMock()) {
      incrementMockViewCount(id)
      return
    }
    await httpGet('IncrementView', '/member/announcement/view', { query: { id } })
  }
}
