import {
  v1 as uuidv1,
  v3 as uuidv3,
  v4 as uuidv4,
  v5 as uuidv5,
  NIL as NIL_UUID,
  validate as validateUUID,
  version as getUUIDVersion,
} from 'uuid'

/**
 * 预定义命名空间
 */
export const UUID_NAMESPACES = {
  DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
  NIL: NIL_UUID,
} as const

/**
 * 生成 UUID v1 (基于时间戳和MAC地址)
 */
export function generateUUIDV1(): string {
  return uuidv1()
}

/**
 * 生成 UUID v3 (基于MD5哈希)
 * @param name 名称
 * @param namespace 命名空间UUID，默认使用DNS命名空间
 */
export function generateUUIDV3(name: string, namespace: string = UUID_NAMESPACES.DNS): string {
  if (!validateUUID(namespace)) {
    throw new Error('无效的命名空间UUID')
  }
  return uuidv3(name, namespace)
}

/**
 * 生成 UUID v4 (随机生成)
 */
export function generateUUIDV4(): string {
  return uuidv4()
}

/**
 * 生成 UUID v5 (基于SHA-1哈希)
 * @param name 名称
 * @param namespace 命名空间UUID，默认使用DNS命名空间
 */
export function generateUUIDV5(name: string, namespace: string = UUID_NAMESPACES.DNS): string {
  if (!validateUUID(namespace)) {
    throw new Error('无效的命名空间UUID')
  }
  return uuidv5(name, namespace)
}

/**
 * 验证UUID格式
 */
export function isValidUUID(uuid: string): boolean {
  return validateUUID(uuid)
}

/**
 * 获取UUID版本
 */
export function getUUIDVersion(uuid: string): number | null {
  if (!isValidUUID(uuid)) return null
  return getUUIDVersion(uuid)
}

/**
 * 格式化UUID
 * @param uuid UUID字符串
 * @param uppercase 是否转为大写
 * @param hyphens 是否保留连字符
 */
export function formatUUID(uuid: string, uppercase: boolean = false, hyphens: boolean = true): string {
  if (!isValidUUID(uuid)) return uuid

  let result = uuid
  if (!hyphens) {
    result = result.replace(/-/g, '')
  }
  return uppercase ? result.toUpperCase() : result.toLowerCase()
}

/**
 * 批量生成UUID
 * @param count 生成数量
 * @param version UUID版本
 * @param namespace v3/v5版本时使用的命名空间
 * @param nameGenerator 为v3/v5生成名称的函数，默认使用时间戳+索引
 */
export function generateBatchUUIDs(
  count: number = 10,
  version: 'v1' | 'v3' | 'v4' | 'v5' = 'v4',
  namespace: string = UUID_NAMESPACES.DNS,
  nameGenerator?: (index: number) => string,
): string[] {
  const uuids: string[] = []
  const safeCount = Math.max(1, Math.min(count, 100)) // 限制在1-100之间

  for (let i = 0; i < safeCount; i++) {
    const name = nameGenerator ? nameGenerator(i) : `${Date.now()}-${i}`

    switch (version) {
      case 'v1':
        uuids.push(generateUUIDV1())
        break
      case 'v3':
        uuids.push(generateUUIDV3(name, namespace))
        break
      case 'v5':
        uuids.push(generateUUIDV5(name, namespace))
        break
      case 'v4':
      default:
        uuids.push(generateUUIDV4())
    }
  }
  return uuids
}

/**
 * UUID 生成工具类（兼容旧代码）
 * @deprecated 请使用独立导出函数
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class UUIDGenerator {
  static readonly NAMESPACES = UUID_NAMESPACES

  static generateV1(): string {
    return generateUUIDV1()
  }

  static generateV3(name: string, namespace: string = UUID_NAMESPACES.DNS): string {
    return generateUUIDV3(name, namespace)
  }

  static generateV4(): string {
    return generateUUIDV4()
  }

  static generateV5(name: string, namespace: string = UUID_NAMESPACES.DNS): string {
    return generateUUIDV5(name, namespace)
  }

  static isValidUUID(uuid: string): boolean {
    return isValidUUID(uuid)
  }

  static getVersion(uuid: string): number | null {
    return getUUIDVersion(uuid)
  }

  static formatUUID(uuid: string, uppercase: boolean = false, hyphens: boolean = true): string {
    return formatUUID(uuid, uppercase, hyphens)
  }

  static generateBatch(
    count: number = 10,
    version: 'v1' | 'v3' | 'v4' | 'v5' = 'v4',
    namespace: string = UUID_NAMESPACES.DNS,
    nameGenerator?: (index: number) => string,
  ): string[] {
    return generateBatchUUIDs(count, version, namespace, nameGenerator)
  }
}
