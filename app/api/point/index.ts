import type {
  PointRecordPageRespVO,
  PointRecordPageReqVO
} from '~/types/point'
import { httpGet } from '~/composables/useHttp'
import {
  getMockPointRecordPage,
  getMockPointRules,
  getMockPointStatistics
} from './mock'

/* 是否启用Mock数据 */
const ENABLE_MOCK = true

/**
 * 获取积分明细
 * @param params 查询参数
 * @returns 积分记录分页数据
 */
export const getPointRecord = async (
  params: PointRecordPageReqVO = {}
): Promise<PointRecordPageRespVO> => {
  if (ENABLE_MOCK) {
    return getMockPointRecordPage(params)
  }
  return httpGet<PointRecordPageRespVO>('PointRecord', '/member/point/record/page', {
    query: {
      pageNo: params.pageNo || 1,
      pageSize: params.pageSize || 10,
      addStatus: params.addStatus,
      startTime: params.startTime,
      endTime: params.endTime
    }
  })
}

/**
 * 获取积分规则
 * @returns 积分规则列表
 */
export const getPointRules = async (): Promise<PointRuleVO[]> => {
  if (ENABLE_MOCK) {
    return getMockPointRules()
  }
  return httpGet<PointRuleVO[]>('PointRules', '/member/point/rule/list')
}

/**
 * 获取积分统计
 * @returns 积分统计数据
 */
export const getPointStatistics = async (): Promise<PointStatisticsVO> => {
  if (ENABLE_MOCK) {
    return getMockPointStatistics()
  }
  return httpGet<PointStatisticsVO>('PointStatistics', '/member/point/statistics')
}
