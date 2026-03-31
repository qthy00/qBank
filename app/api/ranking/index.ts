import type {
  RankingListRespVO,
  RankingStatsVO,
  UserRankingDetailVO,
  RankingType,
  TimeDimension
} from '~/types/ranking'
import { httpGet } from '~/composables/useHttp'
import {
  getMockRankingList,
  getMockRankingStats,
  getMockUserRankingDetail
} from './mock'

/**
 * 判断是否使用 Mock 数据
 */
const useMock = () => import.meta.dev

/**
 * 排行榜模块 API
 */
export const RankingApi = {

  /**
   * 获取排行榜列表
   * @param type 榜单类型
   * @param dimension 时间维度
   * @param limit 榜单数量（默认10）
   * @returns 排行榜列表
   */
  getRankingList: async (
    type: RankingType,
    dimension: TimeDimension,
    limit: number = 10
  ): Promise<RankingListRespVO> => {
    /* 开发环境使用 Mock 数据 */
    if (useMock()) {
      return getMockRankingList(type, dimension, limit)
    }
    return await httpGet('RankingList', '/member/ranking/list', {
      query: { type, dimension, limit }
    })
  },

  /**
   * 获取排行榜统计信息
   * @returns 排行榜统计
   */
  getRankingStats: async (): Promise<RankingStatsVO> => {
    /* 开发环境使用 Mock 数据 */
    if (useMock()) {
      return getMockRankingStats()
    }
    return await httpGet('RankingStats', '/member/ranking/stats')
  },

  /**
   * 获取用户排名详情
   * @param userId 用户ID
   * @returns 用户排名详情
   */
  getUserRankingDetail: async (
    userId: number
  ): Promise<UserRankingDetailVO> => {
    /* 开发环境使用 Mock 数据 */
    if (useMock()) {
      return getMockUserRankingDetail(userId)
    }
    return await httpGet('UserRankingDetail', `/member/ranking/user/${userId}`)
  },

  /**
   * 获取当前用户排名
   * @returns 当前用户排名详情
   */
  getCurrentUserRanking: async (): Promise<UserRankingDetailVO> => {
    /* 开发环境使用 Mock 数据 */
    if (useMock()) {
      return getMockUserRankingDetail(0)
    }
    return await httpGet('CurrentUserRanking', '/member/ranking/user/current')
  }
}
