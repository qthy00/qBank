/**
 * 文档下载 Mock 数据
 */
import type {
  DocumentVO,
  DocumentDetailVO,
  DocumentCategoryVO,
  ExamTypeVO,
  YearOptionVO,
  DocumentListRespVO,
  DocumentType
} from '~/types/document'

/* 文档分类 */
export const mockDocumentCategories: DocumentCategoryVO[] = [
  { id: 1, name: '历年真题', icon: 'ep:collection', count: 45, docType: 'real' },
  { id: 2, name: '模拟试题', icon: 'ep:document-copy', count: 32, docType: 'real' },
  { id: 3, name: '考试大纲', icon: 'ep:notebook', count: 18, docType: 'material' },
  { id: 4, name: '教材讲义', icon: 'ep:reading', count: 28, docType: 'material' },
  { id: 5, name: '重点笔记', icon: 'ep:edit-pen', count: 56, docType: 'material' },
  { id: 6, name: '案例分析', icon: 'ep:data-analysis', count: 24, docType: 'material' },
]

/* 考试类型 */
export const mockExamTypes: ExamTypeVO[] = [
  { code: 'yijian', name: '一级建造师', count: 85 },
  { code: 'erjian', name: '二级建造师', count: 62 },
  { code: 'yizao', name: '一级造价工程师', count: 38 },
  { code: 'erzao', name: '二级造价工程师', count: 25 },
  { code: 'jianli', name: '监理工程师', count: 30 },
  { code: 'anquan', name: '安全工程师', count: 28 },
]

/* 年份选项 */
export const mockYearOptions: YearOptionVO[] = [
  { year: 2025, count: 12 },
  { year: 2024, count: 48 },
  { year: 2023, count: 52 },
  { year: 2022, count: 45 },
  { year: 2021, count: 38 },
  { year: 2020, count: 32 },
]

/* 文档列表数据 */
export const mockDocumentList: DocumentVO[] = [
  /* 历年真题 */
  {
    id: 1,
    title: '2024年一级建造师《建设工程经济》真题及答案解析',
    summary: '2024年一建建设工程经济真题完整版，含详细答案解析，帮助考生了解考试难度和出题方向。',
    coverImage: 'https://picsum.photos/400/300?random=21',
    fileSize: 1024 * 1024 * 2.5,
    fileType: 'PDF',
    downloadCount: 3245,
    viewCount: 5678,
    docType: 'real',
    docTypeName: '历年真题',
    categoryId: 1,
    categoryName: '历年真题',
    examType: 'yijian',
    year: 2024,
    pages: 24,
    isVip: false,
    isFree: true,
    price: 0,
    tags: ['一级建造师', '建设工程经济', '真题'],
    createTime: '2024-09-15 10:30:00',
  },
  {
    id: 2,
    title: '2024年一级建造师《建设工程法规及相关知识》真题及答案',
    summary: '2024年一建法规真题完整版，包含单选题、多选题及详细答案解析。',
    coverImage: 'https://picsum.photos/400/300?random=22',
    fileSize: 1024 * 1024 * 3.2,
    fileType: 'PDF',
    downloadCount: 2890,
    viewCount: 4521,
    docType: 'real',
    docTypeName: '历年真题',
    categoryId: 1,
    categoryName: '历年真题',
    examType: 'yijian',
    year: 2024,
    pages: 28,
    isVip: false,
    isFree: true,
    price: 0,
    tags: ['一级建造师', '法规', '真题'],
    createTime: '2024-09-15 14:20:00',
  },
  {
    id: 3,
    title: '2023年一级建造师《建设工程项目管理》真题及答案解析',
    summary: '2023年一建管理科目真题，含详细解析和考点分析。',
    coverImage: 'https://picsum.photos/400/300?random=23',
    fileSize: 1024 * 1024 * 2.8,
    fileType: 'PDF',
    downloadCount: 4521,
    viewCount: 7890,
    docType: 'real',
    docTypeName: '历年真题',
    categoryId: 1,
    categoryName: '历年真题',
    examType: 'yijian',
    year: 2023,
    pages: 26,
    isVip: false,
    isFree: true,
    price: 0,
    tags: ['一级建造师', '项目管理', '真题'],
    createTime: '2023-09-12 09:15:00',
  },
  {
    id: 4,
    title: '2024年二级建造师《建筑工程管理与实务》真题',
    summary: '2024年二建建筑实务真题完整版，含答案解析。',
    coverImage: 'https://picsum.photos/400/300?random=24',
    fileSize: 1024 * 1024 * 4.5,
    fileType: 'PDF',
    downloadCount: 2156,
    viewCount: 3890,
    docType: 'real',
    docTypeName: '历年真题',
    categoryId: 1,
    categoryName: '历年真题',
    examType: 'erjian',
    year: 2024,
    pages: 32,
    isVip: false,
    isFree: true,
    price: 0,
    tags: ['二级建造师', '建筑实务', '真题'],
    createTime: '2024-06-10 11:30:00',
  },
  {
    id: 5,
    title: '2024年一级造价工程师《建设工程造价管理》真题',
    summary: '2024年一造造价管理真题及答案解析。',
    coverImage: 'https://picsum.photos/400/300?random=25',
    fileSize: 1024 * 1024 * 3.0,
    fileType: 'PDF',
    downloadCount: 1567,
    viewCount: 2890,
    docType: 'real',
    docTypeName: '历年真题',
    categoryId: 1,
    categoryName: '历年真题',
    examType: 'yizao',
    year: 2024,
    pages: 25,
    isVip: true,
    isFree: false,
    price: 9.9,
    tags: ['一级造价师', '造价管理', '真题'],
    createTime: '2024-10-20 16:45:00',
  },

  /* 模拟试题 */
  {
    id: 6,
    title: '2025年一级建造师《建设工程经济》模拟试题（一）',
    summary: '根据最新考试大纲编写，涵盖所有重点考点，难度贴近真题。',
    coverImage: 'https://picsum.photos/400/300?random=26',
    fileSize: 1024 * 1024 * 1.8,
    fileType: 'PDF',
    downloadCount: 1876,
    viewCount: 3245,
    docType: 'real',
    docTypeName: '模拟试题',
    categoryId: 2,
    categoryName: '模拟试题',
    examType: 'yijian',
    year: 2025,
    pages: 22,
    isVip: true,
    isFree: false,
    price: 19.9,
    tags: ['一级建造师', '模拟题', '工程经济'],
    createTime: '2025-03-01 08:00:00',
  },
  {
    id: 7,
    title: '2025年一级建造师《建设工程法规》模拟试题（二）',
    summary: '高质量模拟题，配有详细解析和答题技巧。',
    coverImage: 'https://picsum.photos/400/300?random=27',
    fileSize: 1024 * 1024 * 2.2,
    fileType: 'PDF',
    downloadCount: 1234,
    viewCount: 2567,
    docType: 'real',
    docTypeName: '模拟试题',
    categoryId: 2,
    categoryName: '模拟试题',
    examType: 'yijian',
    year: 2025,
    pages: 24,
    isVip: true,
    isFree: false,
    price: 19.9,
    tags: ['一级建造师', '模拟题', '法规'],
    createTime: '2025-03-05 10:30:00',
  },
  {
    id: 8,
    title: '2025年二级建造师全科模拟试题合集',
    summary: '包含二建三科模拟试题，共6套试卷，适合考前冲刺使用。',
    coverImage: 'https://picsum.photos/400/300?random=28',
    fileSize: 1024 * 1024 * 8.5,
    fileType: 'PDF',
    downloadCount: 2345,
    viewCount: 4567,
    docType: 'real',
    docTypeName: '模拟试题',
    categoryId: 2,
    categoryName: '模拟试题',
    examType: 'erjian',
    year: 2025,
    pages: 85,
    isVip: true,
    isFree: false,
    price: 39.9,
    tags: ['二级建造师', '模拟题', '合集'],
    createTime: '2025-03-10 14:20:00',
  },

  /* 考试大纲 */
  {
    id: 9,
    title: '2025年一级建造师考试大纲（完整版）',
    summary: '官方发布的2025年一建考试大纲，包含各科目的考试内容、考试要求和知识点分布。',
    coverImage: 'https://picsum.photos/400/300?random=29',
    fileSize: 1024 * 1024 * 1.5,
    fileType: 'PDF',
    downloadCount: 5678,
    viewCount: 9876,
    docType: 'material',
    docTypeName: '考试大纲',
    categoryId: 3,
    categoryName: '考试大纲',
    examType: 'yijian',
    year: 2025,
    pages: 45,
    isVip: false,
    isFree: true,
    price: 0,
    tags: ['一级建造师', '考试大纲', '官方'],
    createTime: '2025-01-15 09:00:00',
  },
  {
    id: 10,
    title: '2025年二级建造师考试大纲及变化说明',
    summary: '2025年二建考试大纲及与2024年的对比变化说明。',
    coverImage: 'https://picsum.photos/400/300?random=30',
    fileSize: 1024 * 1024 * 1.2,
    fileType: 'PDF',
    downloadCount: 3456,
    viewCount: 5678,
    docType: 'material',
    docTypeName: '考试大纲',
    categoryId: 3,
    categoryName: '考试大纲',
    examType: 'erjian',
    year: 2025,
    pages: 38,
    isVip: false,
    isFree: true,
    price: 0,
    tags: ['二级建造师', '考试大纲', '变化说明'],
    createTime: '2025-01-20 11:30:00',
  },

  /* 教材讲义 */
  {
    id: 11,
    title: '2025年一级建造师《建设工程经济》精讲讲义',
    summary: '名师精编讲义，涵盖所有考点，配有大量例题和习题。',
    coverImage: 'https://picsum.photos/400/300?random=31',
    fileSize: 1024 * 1024 * 15.6,
    fileType: 'PDF',
    downloadCount: 4567,
    viewCount: 7890,
    docType: 'material',
    docTypeName: '教材讲义',
    categoryId: 4,
    categoryName: '教材讲义',
    examType: 'yijian',
    year: 2025,
    pages: 285,
    isVip: true,
    isFree: false,
    price: 49.9,
    tags: ['一级建造师', '讲义', '工程经济'],
    createTime: '2025-02-10 08:30:00',
  },
  {
    id: 12,
    title: '2025年一级建造师《建设工程法规》精讲讲义',
    summary: '法规科目精讲讲义，重点突出，便于记忆。',
    coverImage: 'https://picsum.photos/400/300?random=32',
    fileSize: 1024 * 1024 * 12.3,
    fileType: 'PDF',
    downloadCount: 3890,
    viewCount: 6789,
    docType: 'material',
    docTypeName: '教材讲义',
    categoryId: 4,
    categoryName: '教材讲义',
    examType: 'yijian',
    year: 2025,
    pages: 256,
    isVip: true,
    isFree: false,
    price: 49.9,
    tags: ['一级建造师', '讲义', '法规'],
    createTime: '2025-02-15 14:00:00',
  },
  {
    id: 13,
    title: '2025年二级建造师《建筑工程管理与实务》精讲讲义',
    summary: '二建建筑实务精讲讲义，配有大量案例分析和习题。',
    coverImage: 'https://picsum.photos/400/300?random=33',
    fileSize: 1024 * 1024 * 18.5,
    fileType: 'PDF',
    downloadCount: 2890,
    viewCount: 5234,
    docType: 'material',
    docTypeName: '教材讲义',
    categoryId: 4,
    categoryName: '教材讲义',
    examType: 'erjian',
    year: 2025,
    pages: 320,
    isVip: true,
    isFree: false,
    price: 39.9,
    tags: ['二级建造师', '讲义', '建筑实务'],
    createTime: '2025-02-20 10:00:00',
  },

  /* 重点笔记 */
  {
    id: 14,
    title: '一级建造师《建设工程经济》高频考点笔记',
    summary: '整理历年真题高频考点，浓缩精华，适合考前背诵。',
    coverImage: 'https://picsum.photos/400/300?random=34',
    fileSize: 1024 * 1024 * 3.5,
    fileType: 'PDF',
    downloadCount: 6789,
    viewCount: 11234,
    docType: 'material',
    docTypeName: '重点笔记',
    categoryId: 5,
    categoryName: '重点笔记',
    examType: 'yijian',
    year: 2025,
    pages: 68,
    isVip: false,
    isFree: true,
    price: 0,
    tags: ['一级建造师', '考点笔记', '工程经济'],
    createTime: '2025-03-01 09:00:00',
  },
  {
    id: 15,
    title: '一级建造师《建设工程法规》数字考点汇总',
    summary: '法规科目中涉及的时间、金额、比例等数字考点汇总，便于记忆。',
    coverImage: 'https://picsum.photos/400/300?random=35',
    fileSize: 1024 * 1024 * 1.8,
    fileType: 'PDF',
    downloadCount: 5234,
    viewCount: 8901,
    docType: 'material',
    docTypeName: '重点笔记',
    categoryId: 5,
    categoryName: '重点笔记',
    examType: 'yijian',
    year: 2025,
    pages: 32,
    isVip: false,
    isFree: true,
    price: 0,
    tags: ['一级建造师', '数字考点', '法规'],
    createTime: '2025-03-05 11:30:00',
  },
  {
    id: 16,
    title: '二级建造师全科重点笔记（口袋书）',
    summary: '三科重点笔记合集，小巧便携，随时随地复习。',
    coverImage: 'https://picsum.photos/400/300?random=36',
    fileSize: 1024 * 1024 * 5.6,
    fileType: 'PDF',
    downloadCount: 4234,
    viewCount: 7123,
    docType: 'material',
    docTypeName: '重点笔记',
    categoryId: 5,
    categoryName: '重点笔记',
    examType: 'erjian',
    year: 2025,
    pages: 128,
    isVip: true,
    isFree: false,
    price: 19.9,
    tags: ['二级建造师', '口袋书', '全科'],
    createTime: '2025-03-10 15:00:00',
  },

  /* 案例分析 */
  {
    id: 17,
    title: '一级建造师《建筑工程管理与实务》经典案例100题',
    summary: '精选100个经典案例题，涵盖各类题型，配有详细解题思路。',
    coverImage: 'https://picsum.photos/400/300?random=37',
    fileSize: 1024 * 1024 * 8.5,
    fileType: 'PDF',
    downloadCount: 3890,
    viewCount: 6234,
    docType: 'material',
    docTypeName: '案例分析',
    categoryId: 6,
    categoryName: '案例分析',
    examType: 'yijian',
    year: 2025,
    pages: 185,
    isVip: true,
    isFree: false,
    price: 29.9,
    tags: ['一级建造师', '案例分析', '建筑实务'],
    createTime: '2025-03-15 09:30:00',
  },
  {
    id: 18,
    title: '一级建造师《机电工程管理与实务》案例专项训练',
    summary: '机电实务案例专项训练，强化案例分析能力。',
    coverImage: 'https://picsum.photos/400/300?random=38',
    fileSize: 1024 * 1024 * 6.8,
    fileType: 'PDF',
    downloadCount: 2345,
    viewCount: 4234,
    docType: 'material',
    docTypeName: '案例分析',
    categoryId: 6,
    categoryName: '案例分析',
    examType: 'yijian',
    year: 2025,
    pages: 156,
    isVip: true,
    isFree: false,
    price: 29.9,
    tags: ['一级建造师', '案例分析', '机电实务'],
    createTime: '2025-03-18 14:00:00',
  },
]

/* 格式化文件大小 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/* 生成文档详情内容 */
const generateDocumentContent = (doc: DocumentVO): string => {
  return `
    <h2>文档介绍</h2>
    <p>${doc.summary}</p>

    <h2>文档信息</h2>
    <ul>
      <li><strong>文档类型：</strong>${doc.docTypeName}</li>
      <li><strong>考试类型：</strong>${mockExamTypes.find(e => e.code === doc.examType)?.name || doc.examType}</li>
      <li><strong>年份：</strong>${doc.year}年</li>
      <li><strong>页数：</strong>${doc.pages}页</li>
      <li><strong>文件大小：</strong>${formatFileSize(doc.fileSize || 0)}</li>
      <li><strong>文件格式：</strong>${doc.fileType}</li>
      <li><strong>下载次数：</strong>${doc.downloadCount}次</li>
      <li><strong>更新时间：</strong>${doc.createTime}</li>
    </ul>

    <h2>内容预览</h2>
    <p>
      本资料精心整理，内容详实，是备考的必备资料。建议下载后结合教材系统学习，
      同时配合题库进行练习，以达到最佳学习效果。
    </p>

    <h2>使用说明</h2>
    <ol>
      <li>下载后请使用PDF阅读器打开</li>
      <li>建议打印后学习，便于做笔记</li>
      <li>配合视频课程效果更佳</li>
      <li>定期复习，加深记忆</li>
    </ol>

    <h2>下载须知</h2>
    <p>
      ${doc.isFree
        ? '本资料为免费资源，可直接下载使用。'
        : '本资料为付费资源，购买后即可下载。资料仅供个人学习使用，不得用于商业用途。'
      }
    </p>

    <blockquote>
      <p>免责声明：本站资料来源于网络收集整理，仅供学习交流使用，如有侵权请联系删除。</p>
    </blockquote>
  `
}

/* 获取文档列表（Mock） */
export const getMockDocumentList = (params: {
  page?: number
  limit?: number
  docType?: DocumentType
  categoryId?: number
  examType?: string
  year?: number
  isFree?: boolean
  keyword?: string
}): DocumentListRespVO => {
  const { page = 1, limit = 10, docType, categoryId, examType, year, isFree, keyword } = params

  let list = [...mockDocumentList]

  /* 按文档类型筛选 */
  if (docType) {
    list = list.filter(item => item.docType === docType)
  }

  /* 按分类筛选 */
  if (categoryId) {
    list = list.filter(item => item.categoryId === categoryId)
  }

  /* 按考试类型筛选 */
  if (examType) {
    list = list.filter(item => item.examType === examType)
  }

  /* 按年份筛选 */
  if (year) {
    list = list.filter(item => item.year === year)
  }

  /* 按是否免费筛选 */
  if (isFree !== undefined) {
    list = list.filter(item => item.isFree === isFree)
  }

  /* 按关键词搜索 */
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    list = list.filter(item =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.summary?.toLowerCase().includes(lowerKeyword) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
    )
  }

  /* 排序：免费 > 下载量 > 时间 */
  list.sort((a, b) => {
    if (a.isFree !== b.isFree) return (b.isFree ? 1 : 0) - (a.isFree ? 1 : 0)
    return b.downloadCount - a.downloadCount
  })

  const total = list.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedList = list.slice(start, end)

  return {
    list: paginatedList,
    total,
  }
}

/* 获取文档详情（Mock） */
export const getMockDocumentDetail = (id: number): DocumentDetailVO | null => {
  const doc = mockDocumentList.find(item => item.id === id)
  if (!doc) return null

  /* 获取相关文档 */
  const relatedDocuments = mockDocumentList
    .filter(item =>
      item.id !== id &&
      (item.categoryId === doc.categoryId || item.examType === doc.examType)
    )
    .slice(0, 4)

  return {
    ...doc,
    content: generateDocumentContent(doc),
    previewImages: doc.coverImage ? [doc.coverImage] : [],
    relatedDocuments,
  }
}

/* 获取文档分类（Mock） */
export const getMockDocumentCategories = (docType?: DocumentType): DocumentCategoryVO[] => {
  let categories = [...mockDocumentCategories]
  if (docType) {
    categories = categories.filter(cat => cat.docType === docType)
  }
  return categories
}

/* 获取考试类型（Mock） */
export const getMockExamTypes = (): ExamTypeVO[] => {
  return mockExamTypes
}

/* 获取年份选项（Mock） */
export const getMockYearOptions = (): YearOptionVO[] => {
  return mockYearOptions
}

/* 增加下载次数（Mock） */
export const incrementMockDownloadCount = (id: number): void => {
  const doc = mockDocumentList.find(item => item.id === id)
  if (doc) {
    doc.downloadCount += 1
  }
}
