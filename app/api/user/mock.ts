import type { UserVO, LevelVO } from '~/types/user'

/**
 * 用户模块 Mock 数据
 */

/* ==================== 用户数据 ==================== */

/**
 * Mock 当前登录用户信息
 */
export const mockUser: UserVO = {
  id: 1,
  uid: 'U202603260001',
  avatar: 'https://picsum.photos/200/200?random=avatar',
  nickname: '学习达人',
  userName: 'student001',
  mobile: '13800138000',
  email: 'student@example.com',
  sex: 1,
  birthday: 946656000000,
  point: 1250,
  experience: 1850,
  loginIp: '192.168.1.1',
  loginDate: Date.now(),
  createTime: 1704067200000,
  level: {
    id: 3,
    level: 3,
    name: '银牌会员',
    icon: 'https://picsum.photos/100/100?random=level3'
  },
  slogan: '学无止境，勇攀高峰',
  description: '热爱学习，喜欢挑战',
  name: '张三',
  areaName: '北京市'
}

/**
 * Mock 用户权限信息
 */
export const mockUserPermissions = {
  user: mockUser,
  roles: ['user', 'vip'],
  permissions: ['user:read', 'user:write', 'qbank:practice', 'qbank:exam']
}

/* ==================== 查询函数 ==================== */

/**
 * 获取 Mock 用户信息
 * @returns 用户详情
 */
export const getMockUser = (): Promise<UserVO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockUser })
    }, 300)
  })
}

/**
 * 获取 Mock 用户权限信息
 * @returns 用户权限信息
 */
export const getMockUserPermissions = (): Promise<typeof mockUserPermissions> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockUserPermissions })
    }, 300)
  })
}

/**
 * 更新 Mock 用户信息
 * @param data 更新的数据
 * @returns 更新后的用户信息
 */
export const updateMockUser = (data: Partial<UserVO>): Promise<UserVO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(mockUser, data)
      resolve({ ...mockUser })
    }, 300)
  })
}
