import type {
  RankingItemVO,
  RankingListRespVO,
  RankingStatsVO,
  UserRankingDetailVO,
  RankingType,
  TimeDimension
} from '~/types/ranking'

/**
 * 排行榜 Mock 数据
 */

/* ==================== 模拟用户数据 ==================== */

const mockNicknames = [
  '学霸小明', '题库达人', '刷题小王子', '学习狂魔', '考神附体',
  '勤奋小蜜蜂', '知识探索者', '考试必胜', '题海战士', '学习使我快乐',
  '夜猫子学习者', '早起鸟儿', '刷题机器', '知识猎人', '考试通关者',
  '题库征服者', '学习达人', '知识积累者', '刷题狂人', '考试高手',
  '题海无涯', '学无止境', '知识改变命运', '奋斗青年', '梦想实现家'
]

const mockAvatars = [
  'https://picsum.photos/100/100?random=1',
  'https://picsum.photos/100/100?random=2',
  'https://picsum.photos/100/100?random=3',
  'https://picsum.photos/100/100?random=4',
  'https://picsum.photos/100/100?random=5',
  'https://picsum.photos/100/100?random=6',
  'https://picsum.photos/100/100?random=7',
  'https://picsum.photos/100/100?random=8',
  'https://picsum.photos/100/100?random=9',
  'https://picsum.photos/100/100?random=10'
]

/* ==================== 数据生成函数 ==================== */

/**
 * 生成随机整数
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成趋势
 */
const randomTrend = (): 'up' | 'down' | 'same' => {
  const trends: ('up' | 'down' | 'same')[] = ['up', 'down', 'same']
  return trends[randomInt(0, 2)]
}

/**
 * 生成做题数榜单数据
 */
const generateQuestionCountRanking = (
  dimension: TimeDimension,
  limit: number,
  currentUserId: number
): RankingItemVO[] => {
  const multiplier = dimension === 'day' ? 1 : dimension === 'week' ? 7 : dimension === 'month' ? 30 : 365
  const baseCount = dimension === 'total' ? 5000 : 100

  const list: RankingItemVO[] = []

  for (let i = 0; i < limit; i++) {
    const rank = i + 1
    const userId = i + 1
    const count = baseCount * multiplier - i * randomInt(10, 50)

    list.push({
      rank,
      userId,
      nickname: mockNicknames[i % mockNicknames.length],
      avatar: mockAvatars[i % mockAvatars.length],
      value: Math.max(count, 10),
      valueText: `${Math.max(count, 10)}题`,
      trend: randomTrend(),
      trendValue: randomInt(0, 5),
      isCurrentUser: userId === currentUserId
    })
  }

  return list
}

/**
 * 生成正确率榜单数据
 */
const generateAccuracyRateRanking = (
  dimension: TimeDimension,
  limit: number,
  currentUserId: number
): RankingItemVO[] => {
  const list: RankingItemVO[] = []

  for (let i = 0; i < limit; i++) {
    const rank = i + 1
    const userId = i + 1
    /* 正确率从99%递减，保留一位小数 */
    const rate = Number((99 - i * 0.5 - Math.random() * 0.3).toFixed(1))

    list.push({
      rank,
      userId,
      nickname: mockNicknames[i % mockNicknames.length],
      avatar: mockAvatars[i % mockAvatars.length],
      value: rate,
      valueText: `${rate}%`,
      trend: randomTrend(),
      trendValue: randomInt(0, 3),
      isCurrentUser: userId === currentUserId
    })
  }

  return list
}

/**
 * 生成学习时长榜单数据
 */
const generateStudyDurationRanking = (
  dimension: TimeDimension,
  limit: number,
  currentUserId: number
): RankingItemVO[] => {
  const multiplier = dimension === 'day' ? 1 : dimension === 'week' ? 7 : dimension === 'month' ? 30 : 365
  const baseMinutes = dimension === 'total' ? 10000 : 120

  const list: RankingItemVO[] = []

  for (let i = 0; i < limit; i++) {
    const rank = i + 1
    const userId = i + 1
    const minutes = baseMinutes * multiplier - i * randomInt(30, 60)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    list.push({
      rank,
      userId,
      nickname: mockNicknames[i % mockNicknames.length],
      avatar: mockAvatars[i % mockAvatars.length],
      value: minutes,
      valueText: hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`,
      trend: randomTrend(),
      trendValue: randomInt(0, 5),
      isCurrentUser: userId === currentUserId
    })
  }

  return list
}

/* ==================== Mock API 函数 ==================== */

/**
 * 获取排行榜列表
 */
export const getMockRankingList = (
  type: RankingType,
  dimension: TimeDimension,
  limit: number = 10,
  currentUserId: number = 8
): RankingListRespVO => {
  let list: RankingItemVO[] = []

  switch (type) {
    case 'question_count':
      list = generateQuestionCountRanking(dimension, limit, currentUserId)
      break
    case 'accuracy_rate':
      list = generateAccuracyRateRanking(dimension, limit, currentUserId)
      break
    case 'study_duration':
      list = generateStudyDurationRanking(dimension, limit, currentUserId)
      break
  }

  /* 找到当前用户的排名 */
  const userRank = list.find(item => item.isCurrentUser)

  /* 如果当前用户不在TOP10中，生成当前用户的排名 */
  let finalUserRank = userRank
  if (!finalUserRank) {
    const userRankValue = randomInt(15, 100)
    let value: number
    let valueText: string

    switch (type) {
      case 'question_count':
        value = userRankValue * 10
        valueText = `${value}题`
        break
      case 'accuracy_rate':
        value = Number((85 + Math.random() * 10).toFixed(1))
        valueText = `${value}%`
        break
      case 'study_duration':
        value = userRankValue * 60
        valueText = `${Math.floor(value / 60)}小时${value % 60}分钟`
        break
      default:
        value = userRankValue
        valueText = String(value)
    }

    finalUserRank = {
      rank: userRankValue,
      userId: currentUserId,
      nickname: '我',
      avatar: 'https://picsum.photos/100/100?random=99',
      value,
      valueText,
      trend: randomTrend(),
      trendValue: randomInt(0, 5),
      isCurrentUser: true
    }
  }

  return {
    list,
    userRank: finalUserRank,
    updateTime: new Date().toISOString(),
    rankingType: type,
    timeDimension: dimension
  }
}

/**
 * 获取排行榜统计信息
 */
export const getMockRankingStats = (): RankingStatsVO => {
  return {
    totalParticipants: randomInt(5000, 10000),
    todayActiveUsers: randomInt(500, 2000),
    updateTime: new Date().toISOString()
  }
}

/**
 * 获取用户排名详情
 */
export const getMockUserRankingDetail = (userId: number): UserRankingDetailVO => {
  const dimensions: TimeDimension[] = ['day', 'week', 'month', 'total']
  const randomDimension = dimensions[randomInt(0, 3)]

  return {
    questionCountRank: generateQuestionCountRanking(randomDimension, 1, userId)[0],
    accuracyRateRank: generateAccuracyRateRanking(randomDimension, 1, userId)[0],
    studyDurationRank: generateStudyDurationRanking(randomDimension, 1, userId)[0],
    comprehensiveRank: randomInt(1, 100)
  }
}

/* ==================== Mock 常量数据 ==================== */

/**
 * 榜单类型配置
 */
export const mockRankingTypeConfigs = [
  { type: 'question_count', name: '做题数榜', icon: 'ep:document', unit: '题' },
  { type: 'accuracy_rate', name: '正确率榜', icon: 'ep:check', unit: '%' },
  { type: 'study_duration', name: '学习时长榜', icon: 'ep:timer', unit: '分钟' }
]

/**
 * 时间维度配置
 */
export const mockTimeDimensionConfigs = [
  { dimension: 'day', name: '今日' },
  { dimension: 'week', name: '本周' },
  { dimension: 'month', name: '本月' },
  { dimension: 'total', name: '总榜' }
]
