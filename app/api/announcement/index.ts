import { httpGet } from '~/composables/useHttp'
import type {
  AnnouncementListReqVO,
  AnnouncementListRespVO,
  AnnouncementVO,
  HomeAnnouncementVO
} from '~/types/announcement'


/**
 * 公告相关API
 */
export const AnnouncementApi = {

  /**
   * 获取公告列表
   * @param params 查询参数
   */
  getAnnouncementList: async (params: AnnouncementListReqVO = {}): Promise<AnnouncementListRespVO> => {
    return await httpGet('AnnouncementList', '/cms/notice/page', { query: params })
  },

  /**
   * 获取公告详情
   * @param id 公告ID
   */
  getAnnouncementDetail: async (id: number): Promise<AnnouncementVO> => {
    return await httpGet('AnnouncementDetail', '/cms/notice/get', { query: { id } })
  },

  /**
   * 获取首页公告
   */
  getHomeAnnouncements: async (): Promise<HomeAnnouncementVO[]> => {
    return await httpGet('HomeAnnouncements', '/cms/notice/list')
  },

  /**
   * 增加公告浏览量
   * @param id 公告ID
   */
  incrementViewCount: async (id: number): Promise<void> => {
    await httpGet('IncrementView', '/cms/notice/view', { query: { id } })
  }
}
