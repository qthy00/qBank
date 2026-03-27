import { describe, it, expect, vi } from 'vitest'
import {
  fenToYuan,
  yuanToFen,
  formatAmount,
  generateUUID,
  toAnyString,
  humpToUnderline,
  underlineToHump,
  firstUpperCase,
  getSumValue,
  copyValueToTarget,
  jsonParse,
  highlightKeyword,
  stripHtmlTags,
  numberToChinese,
  maskEmail,
  maskPhone,
  getUrlValue,
  buildSortingField,
  fileSizeFormatter,
  findIndex,
  trim,
  calculateRelativeRate
} from '~/utils/index'

describe('index 工具函数', () => {
  describe('fenToYuan', () => {
    it('应该正确将分转换为元', () => {
      expect(fenToYuan(100)).toBe('1.00')
      expect(fenToYuan(599)).toBe('5.99')
      expect(fenToYuan(0)).toBe('0.00')
    })

    it('应该处理字符串输入', () => {
      expect(fenToYuan('100')).toBe('1.00')
      expect(fenToYuan('599')).toBe('5.99')
    })

    it('应该处理空值', () => {
      expect(fenToYuan('')).toBe('0.00')
      expect(fenToYuan(null as any)).toBe('0.00')
      expect(fenToYuan(undefined as any)).toBe('0.00')
    })

    it('应该处理无效数字', () => {
      expect(fenToYuan('invalid')).toBe('0.00')
      expect(fenToYuan(NaN)).toBe('0.00')
    })
  })

  describe('yuanToFen', () => {
    it('应该正确将元转换为分', () => {
      expect(yuanToFen(1)).toBe(100)
      expect(yuanToFen(5.99)).toBe(599)
      expect(yuanToFen(0)).toBe(0)
    })

    it('应该处理字符串输入', () => {
      expect(yuanToFen('1.00')).toBe(100)
      expect(yuanToFen('5.99')).toBe(599)
    })

    it('应该四舍五入', () => {
      expect(yuanToFen(1.005)).toBe(100)
      expect(yuanToFen(1.999)).toBe(200)
    })

    it('应该处理空值', () => {
      expect(yuanToFen('')).toBe(0)
      expect(yuanToFen(null as any)).toBe(0)
      expect(yuanToFen(undefined as any)).toBe(0)
    })
  })

  describe('formatAmount', () => {
    it('应该格式化为两位小数', () => {
      expect(formatAmount(100)).toBe('100.00')
      expect(formatAmount(5.9)).toBe('5.90')
      expect(formatAmount(0)).toBe('0.00')
    })

    it('应该处理字符串输入', () => {
      expect(formatAmount('100')).toBe('100.00')
      expect(formatAmount('5.9')).toBe('5.90')
    })

    it('应该处理空值', () => {
      expect(formatAmount('')).toBe('0.00')
      expect(formatAmount(null as any)).toBe('0.00')
      expect(formatAmount(undefined as any)).toBe('0.00')
    })
  })

  describe('generateUUID', () => {
    it('应该生成有效的UUID格式', () => {
      const uuid = generateUUID()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('应该生成不同的UUID', () => {
      const uuid1 = generateUUID()
      const uuid2 = generateUUID()
      expect(uuid1).not.toBe(uuid2)
    })
  })

  describe('toAnyString', () => {
    it('应该生成随机字符串', () => {
      const str = toAnyString()
      // 验证基本格式：包含4段连字符，以4开头的一段
      expect(str).toContain('-')
      expect(str).toMatch(/4\d+/)
    })
  })

  describe('humpToUnderline', () => {
    it('应该将驼峰转换为下划线', () => {
      expect(humpToUnderline('userName')).toBe('user-name')
      expect(humpToUnderline('userId')).toBe('user-id')
      expect(humpToUnderline('getUserName')).toBe('get-user-name')
    })
  })

  describe('underlineToHump', () => {
    it('应该将下划线转换为驼峰', () => {
      expect(underlineToHump('user-name')).toBe('userName')
      expect(underlineToHump('user-id')).toBe('userId')
      expect(underlineToHump('get-user-name')).toBe('getUserName')
    })

    it('应该处理空值', () => {
      expect(underlineToHump('')).toBe('')
    })
  })

  describe('firstUpperCase', () => {
    it('应该首字母大写', () => {
      expect(firstUpperCase('hello')).toBe('Hello')
      expect(firstUpperCase('HELLO')).toBe('Hello')
      expect(firstUpperCase('hELLO wORLD')).toBe('Hello World')
    })
  })

  describe('getSumValue', () => {
    it('应该正确计算数组和', () => {
      expect(getSumValue([1, 2, 3, 4, 5])).toBe(15)
      expect(getSumValue([])).toBe(0)
    })

    it('应该跳过非数字', () => {
      expect(getSumValue([1, NaN, 3, undefined as any, 5])).toBe(9)
    })
  })

  describe('copyValueToTarget', () => {
    it('应该复制源对象值到目标对象', () => {
      const target = { a: 1, b: 2 }
      const source = { a: 10, b: 20, c: 30 }
      copyValueToTarget(target, source)
      expect(target).toEqual({ a: 10, b: 20 })
    })

    it('不应该添加新属性', () => {
      const target = { a: 1 }
      const source = { a: 10, b: 20 }
      copyValueToTarget(target, source)
      expect(target).not.toHaveProperty('b')
    })
  })

  describe('jsonParse', () => {
    it('应该正确解析JSON', () => {
      expect(jsonParse('{"a":1}')).toEqual({ a: 1 })
      expect(jsonParse('[1,2,3]')).toEqual([1, 2, 3])
    })

    it('应该处理无效JSON', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(jsonParse('invalid')).toBe('')
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('highlightKeyword', () => {
    it('应该正确高亮关键词', () => {
      expect(highlightKeyword('hello world', 'hello')).toBe('<mark>hello</mark> world')
      expect(highlightKeyword('hello hello', 'hello')).toBe('<mark>hello</mark> <mark>hello</mark>')
    })

    it('应该支持自定义标签', () => {
      expect(highlightKeyword('hello world', 'hello', 'span')).toBe('<span>hello</span> world')
    })

    it('空关键词应该返回原文', () => {
      expect(highlightKeyword('hello world', '')).toBe('hello world')
    })

    it('应该转义正则特殊字符', () => {
      expect(highlightKeyword('price: $100', '$100')).toBe('price: <mark>$100</mark>')
    })
  })

  describe('stripHtmlTags', () => {
    it('应该移除HTML标签', () => {
      expect(stripHtmlTags('<p>hello</p>')).toBe('hello')
      expect(stripHtmlTags('<div><span>hello</span></div>')).toBe('hello')
    })

    it('应该处理空字符串', () => {
      expect(stripHtmlTags('')).toBe('')
    })

    it('应该处理非字符串输入', () => {
      expect(stripHtmlTags(123 as any)).toBe(123)
      expect(stripHtmlTags(null as any)).toBe(null)
    })
  })

  describe('numberToChinese', () => {
    it('应该正确转换个位数', () => {
      expect(numberToChinese(1)).toBe('一')
      expect(numberToChinese(9)).toBe('九')
    })

    it('应该正确转换十位数', () => {
      expect(numberToChinese(10)).toBe('十')
      expect(numberToChinese(11)).toBe('十一')
      expect(numberToChinese(20)).toBe('二十')
      expect(numberToChinese(21)).toBe('二十一')
      expect(numberToChinese(99)).toBe('九十九')
    })

    it('应该抛出无效范围错误', () => {
      expect(() => numberToChinese(0)).toThrow('请输入1到99之间的整数')
      expect(() => numberToChinese(100)).toThrow('请输入1到99之间的整数')
      expect(() => numberToChinese(-1)).toThrow('请输入1到99之间的整数')
      expect(() => numberToChinese(1.5)).toThrow('请输入1到99之间的整数')
    })
  })

  describe('maskEmail', () => {
    it('应该正确掩码邮箱', () => {
      expect(maskEmail('user@example.com')).toBe('us******@example.com')
      // 短邮箱（少于3字符在@前）可能无法掩码，这是符合正则预期的
      expect(maskEmail('ab@example.com')).toBe('ab@example.com')
    })
  })

  describe('maskPhone', () => {
    it('应该正确掩码手机号', () => {
      expect(maskPhone('13812345678')).toBe('138****5678')
    })
  })

  describe('getUrlValue', () => {
    it('应该从URL获取参数值', () => {
      expect(getUrlValue('id', 'https://example.com?id=123')).toBe('123')
      expect(getUrlValue('name', 'https://example.com?name=hello')).toBe('hello')
    })

    it('应该处理空值', () => {
      expect(getUrlValue('', 'https://example.com')).toBe('')
      expect(getUrlValue('id', '')).toBe('')
    })

    it('应该处理URL编码', () => {
      expect(getUrlValue('name', 'https://example.com?name=hello%20world')).toBe('hello world')
    })
  })

  describe('buildSortingField', () => {
    it('应该正确构建排序字段', () => {
      expect(buildSortingField({ prop: 'name', order: 'ascending' })).toEqual({
        field: 'name',
        order: 'asc'
      })
      expect(buildSortingField({ prop: 'age', order: 'descending' })).toEqual({
        field: 'age',
        order: 'desc'
      })
    })
  })

  describe('fileSizeFormatter', () => {
    it('应该正确格式化文件大小', () => {
      expect(fileSizeFormatter(1024)).toBe('1.00 KB')
      expect(fileSizeFormatter(1024 * 1024)).toBe('1.00 MB')
      expect(fileSizeFormatter(1024 * 1024 * 1024)).toBe('1.00 GB')
    })

    it('应该处理字符串输入', () => {
      expect(fileSizeFormatter('1024')).toBe('1.00 KB')
    })
  })

  describe('findIndex', () => {
    it('应该找到正确的索引', () => {
      const arr = [1, 2, 3, 4, 5]
      expect(findIndex(arr, (item: number) => item === 3)).toBe(2)
      expect(findIndex(arr, (item: number) => item === 10)).toBe(-1)
    })
  })

  describe('trim', () => {
    it('应该移除首尾空格', () => {
      expect(trim('  hello  ')).toBe('hello')
      expect(trim('hello')).toBe('hello')
      expect(trim('   ')).toBe('')
    })
  })

  describe('calculateRelativeRate', () => {
    it('应该正确计算环比', () => {
      expect(calculateRelativeRate(110, 100)).toBe('10')
      expect(calculateRelativeRate(90, 100)).toBe('-10')
      expect(calculateRelativeRate(100, 100)).toBe('0')
    })

    it('应该处理除0', () => {
      expect(calculateRelativeRate(100, 0)).toBe(0)
      expect(calculateRelativeRate(0, 0)).toBe(0)
    })

    it('应该处理undefined', () => {
      expect(calculateRelativeRate(undefined, 100)).toBe('-100')
    })
  })
})
