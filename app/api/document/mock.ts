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
  DocumentType,
  MajorVO,
  LevelOptionVO,
  MaterialTypeOptionVO,
  StatusOptionVO,
  DocumentLevel,
  DocumentStatus,
} from '~/types/document'

/* ==================== 基础数据 ==================== */

/* 大类列表 */
export const mockMajors: MajorVO[] = [
  { code: 'building', name: '建筑工程', icon: 'ep:office-building', count: 156 },
  { code: 'finance', name: '财会考试', icon: 'ep:money', count: 89 },
  { code: 'banking', name: '金融考试', icon: 'ep:bank-card', count: 67 },
  { code: 'qualification', name: '职业资格', icon: 'ep:medal', count: 234 },
  { code: 'medical', name: '医药卫生', icon: 'ep:first-aid-kit', count: 145 },
  { code: 'teacher', name: '教师资格', icon: 'ep:user', count: 198 },
]

/* 文档分类 */
export const mockDocumentCategories: DocumentCategoryVO[] = [
  { id: 1, name: '建设工程法规及相关知识', icon: 'ep:collection', count: 45, docType: 'real' },
  { id: 2, name: '建设工程项目管理', icon: 'ep:document-copy', count: 32, docType: 'real' },
  { id: 3, name: '建设工程经济', icon: 'ep:notebook', count: 28, docType: 'real' },
  { id: 4, name: '建筑工程', icon: 'ep:reading', count: 56, docType: 'real' },
  { id: 5, name: '市政公用工程', icon: 'ep:edit-pen', count: 34, docType: 'real' },
  { id: 6, name: '机电工程', icon: 'ep:data-analysis', count: 29, docType: 'real' },
  { id: 7, name: '公路工程', icon: 'ep:map-location', count: 23, docType: 'real' },
  { id: 8, name: '水利水电工程', icon: 'ep:water-cup', count: 18, docType: 'real' },
]

/* 考试类型 */
export const mockExamTypes: ExamTypeVO[] = [
  { code: 'yijian', name: '一级建造师', majorCode: 'building', count: 85 },
  { code: 'erjian', name: '二级建造师', majorCode: 'building', count: 62 },
  { code: 'yixiao', name: '一级消防工程师', majorCode: 'building', count: 38 },
  { code: 'anquan', name: '安全工程师', majorCode: 'building', count: 28 },
  { code: 'zaojia', name: '造价工程师', majorCode: 'building', count: 45 },
  { code: 'jianli', name: '监理工程师', majorCode: 'building', count: 30 },
  { code: 'cpa', name: '注册会计师', majorCode: 'finance', count: 56 },
  { code: 'chukuai', name: '初级会计职称', majorCode: 'finance', count: 78 },
  { code: 'zhukuai', name: '中级会计职称', majorCode: 'finance', count: 65 },
  { code: 'gaokuai', name: '高级会计职称', majorCode: 'finance', count: 23 },
  { code: 'yincong', name: '银行从业', majorCode: 'banking', count: 45 },
  { code: 'jijin', name: '基金从业', majorCode: 'banking', count: 38 },
  { code: 'zhengquan', name: '证券从业', majorCode: 'banking', count: 42 },
  { code: 'jiaozi', name: '教师资格', majorCode: 'teacher', count: 156 },
  { code: 'yixue', name: '执业医师', majorCode: 'medical', count: 89 },
  { code: 'hushi', name: '执业护士', majorCode: 'medical', count: 67 },
]

/* 年份选项 */
export const mockYearOptions: YearOptionVO[] = [
  { year: 2025, count: 12 },
  { year: 2024, count: 48 },
  { year: 2023, count: 52 },
  { year: 2022, count: 45 },
  { year: 2021, count: 38 },
  { year: 2020, count: 32 },
  { year: 2019, count: 28 },
]

/* 等级选项 */
export const mockLevelOptions: LevelOptionVO[] = [
  { value: 'free', label: '免费', count: 234 },
  { value: 'premium', label: '精品资料', count: 156 },
  { value: 'vip', label: 'VIP专享', count: 89 },
]

/* 资料类型 */
export const mockMaterialTypes: MaterialTypeOptionVO[] = [
  { value: 'study_plan', label: '学习计划', count: 23 },
  { value: 'material_change', label: '教材变化', count: 15 },
  { value: 'mind_map', label: '思维导图', count: 45 },
  { value: 'memory_tips', label: '记忆口诀', count: 32 },
  { value: 'core_points', label: '核心考点', count: 67 },
  { value: 'real_exam', label: '真题精析', count: 89 },
  { value: 'mock_exam', label: '模拟试题', count: 56 },
  { value: 'cheat_sheet', label: '考前N页纸', count: 34 },
  { value: 'key_points', label: '时间、数字、计算考点', count: 28 },
  { value: 'course_notes', label: '课程讲义', count: 78 },
  { value: 'industry_standard', label: '行业规范', count: 45 },
  { value: 'answer_template', label: '答题模板', count: 23 },
  { value: 'study_notes', label: '学习笔记', count: 56 },
  { value: 'work_proof', label: '工作证明模板', count: 12 },
  { value: 'case_300', label: '案例300问', count: 34 },
  { value: 'guide', label: '报名考生指导手册', count: 18 },
  { value: 'mock_contest', label: '模考大赛', count: 29 },
  { value: 'color_notes', label: '四色笔记', count: 41 },
]

/* 状态选项 */
export const mockStatusOptions: StatusOptionVO[] = [
  { value: 'online', label: '已上线', count: 420 },
  { value: 'preview', label: '预告', count: 35 },
  { value: 'purchased', label: '已获权限', count: 24 },
]

/* ==================== 文档列表数据 ==================== */

/* 生成文档列表 */
const generateMockDocuments = (): DocumentVO[] => {
  const documents: DocumentVO[] = []
  let id = 1

  /* 真题资料 */
  const realExamTitles = [
    { title: '2024年一级建造师《建设工程经济》真题及答案解析', categoryId: 3, categoryName: '建设工程经济' },
    { title: '2024年一级建造师《建设工程法规及相关知识》真题及答案', categoryId: 1, categoryName: '建设工程法规及相关知识' },
    { title: '2024年一级建造师《建设工程项目管理》真题及答案解析', categoryId: 2, categoryName: '建设工程项目管理' },
    { title: '2024年一级建造师《建筑工程管理与实务》真题及答案', categoryId: 4, categoryName: '建筑工程' },
    { title: '2024年一级建造师《市政公用工程管理与实务》真题及答案', categoryId: 5, categoryName: '市政公用工程' },
    { title: '2023年一级建造师《建设工程经济》真题及答案解析', categoryId: 3, categoryName: '建设工程经济' },
    { title: '2023年一级建造师《建设工程法规及相关知识》真题及答案', categoryId: 1, categoryName: '建设工程法规及相关知识' },
    { title: '2023年一级建造师《建设工程项目管理》真题及答案解析', categoryId: 2, categoryName: '建设工程项目管理' },
    { title: '2024年二级建造师《建筑工程管理与实务》真题及答案', categoryId: 4, categoryName: '建筑工程' },
    { title: '2024年二级建造师《建设工程法规及相关知识》真题及答案', categoryId: 1, categoryName: '建设工程法规及相关知识' },
    { title: '2023年二级建造师《建设工程施工管理》真题及答案', categoryId: 2, categoryName: '建设工程项目管理' },
    { title: '2024年一级造价工程师《建设工程造价管理》真题及答案', categoryId: 2, categoryName: '建设工程项目管理' },
    { title: '2024年监理工程师《建设工程合同管理》真题及答案', categoryId: 1, categoryName: '建设工程法规及相关知识' },
  ]

  /* 模拟试题 */
  const mockExamTitles = [
    { title: '2025年一级建造师《建设工程经济》模考大赛试卷及答案【3月摸底测试】', categoryId: 3, categoryName: '建设工程经济' },
    { title: '2025年一级建造师《建设工程法规》模考大赛试卷及答案【3月摸底测试】', categoryId: 1, categoryName: '建设工程法规及相关知识' },
    { title: '2025年一级建造师《建设工程项目管理》模考大赛试卷及答案【3月摸底测试】', categoryId: 2, categoryName: '建设工程项目管理' },
    { title: '2025年一级建造师《建筑工程》模考大赛试卷及答案【3月摸底测试】', categoryId: 4, categoryName: '建筑工程' },
    { title: '2025年二级建造师全科模拟试题合集（3套）', categoryId: 4, categoryName: '建筑工程' },
    { title: '2025年一级建造师《建设工程经济》考前冲刺模拟试题（一）', categoryId: 3, categoryName: '建设工程经济' },
    { title: '2025年一级建造师《建设工程法规》考前冲刺模拟试题（二）', categoryId: 1, categoryName: '建设工程法规及相关知识' },
  ]

  /* 核心考点 */
  const corePointTitles = [
    { title: '2025年一级建造师《项目管理》考前30页纸.pdf', categoryId: 2, categoryName: '建设工程项目管理' },
    { title: '赵春晓老师亲编！2025年一建《项目管理》必过最后7页纸.pdf', categoryId: 2, categoryName: '建设工程项目管理' },
    { title: '江凌俊老师亲编！2025年一级建造师《建筑工程》案例347问.pdf', categoryId: 4, categoryName: '建筑工程' },
    { title: '2025年一级建造师《工程经济》考前30页纸.pdf', categoryId: 3, categoryName: '建设工程经济' },
    { title: '2025年一级建造师《工程法规》考前重点速记30页纸.pdf', categoryId: 1, categoryName: '建设工程法规及相关知识' },
  ]

  /* 学习计划 */
  const studyPlanTitles = [
    { title: '2025年一级建造师全科目学习计划（基础阶段）', categoryId: 1, categoryName: '建设工程法规及相关知识' },
    { title: '2025年一级建造师全科目学习计划（强化阶段）', categoryId: 2, categoryName: '建设工程项目管理' },
    { title: '2025年一级建造师全科目学习计划（冲刺阶段）', categoryId: 3, categoryName: '建设工程经济' },
    { title: '2025年二级建造师90天通关学习计划', categoryId: 4, categoryName: '建筑工程' },
  ]

  /* 教材变化 */
  const materialChangeTitles = [
    { title: '2025年一级建造师教材变化解读（全科目）', categoryId: 1, categoryName: '建设工程法规及相关知识' },
    { title: '2025年一级建造师《建设工程经济》教材变化对比', categoryId: 3, categoryName: '建设工程经济' },
    { title: '2025年一级建造师《建设工程法规》教材变化对比', categoryId: 1, categoryName: '建设工程法规及相关知识' },
  ]

  /* 思维导图 */
  const mindMapTitles = [
    { title: '一级建造师《建设工程经济》全书思维导图', categoryId: 3, categoryName: '建设工程经济' },
    { title: '一级建造师《建设工程法规》全书思维导图', categoryId: 1, categoryName: '建设工程法规及相关知识' },
    { title: '一级建造师《建设工程项目管理》全书思维导图', categoryId: 2, categoryName: '建设工程项目管理' },
  ]

  /* 真题精析 */
  const realExamAnalysisTitles = [
    { title: '2024年一级建造师《建设工程经济》真题精析', categoryId: 3, categoryName: '建设工程经济' },
    { title: '2024年一级建造师《建设工程法规》真题精析', categoryId: 1, categoryName: '建设工程法规及相关知识' },
    { title: '2024年一级建造师《建设工程项目管理》真题精析', categoryId: 2, categoryName: '建设工程项目管理' },
  ]

  /* 案例300问 */
  const case300Titles = [
    { title: '2025年一级建造师《建筑工程》案例300问', categoryId: 4, categoryName: '建筑工程' },
    { title: '2025年一级建造师《市政公用工程》案例300问', categoryId: 5, categoryName: '市政公用工程' },
    { title: '2025年一级建造师《机电工程》案例300问', categoryId: 6, categoryName: '机电工程' },
  ]

  /* 生成真题资料 */
  realExamTitles.forEach((item, index) => {
    const isFree = Math.random() > 0.3
    const price = isFree ? 0 : Math.floor(Math.random() * 50) + 10
    const year = [2024, 2023, 2022][Math.floor(Math.random() * 3)]
    const examType = ['yijian', 'erjian', 'yizao', 'jianli'][Math.floor(Math.random() * 4)]

    documents.push({
      id: id++,
      title: item.title,
      summary: `${year}年真题完整版，含详细答案解析，帮助考生了解考试难度和出题方向。`,
      coverImage: `https://picsum.photos/400/300?random=${id}`,
      fileSize: Math.floor(Math.random() * 10 * 1024 * 1024) + 1024 * 1024,
      fileType: 'PDF',
      downloadCount: Math.floor(Math.random() * 5000) + 500,
      viewCount: Math.floor(Math.random() * 8000) + 1000,
      docType: 'real',
      docTypeName: '真题资料',
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      majorCode: 'building',
      majorName: '建筑工程',
      examType,
      examTypeName: mockExamTypes.find(e => e.code === examType)?.name || examType,
      year,
      level: isFree ? 'free' : (price > 30 ? 'vip' : 'premium'),
      levelName: isFree ? '免费' : (price > 30 ? 'VIP专享' : '精品资料'),
      materialType: 'real_exam',
      materialTypeName: '真题精析',
      status: 'online',
      statusName: '已上线',
      pages: Math.floor(Math.random() * 30) + 20,
      isVip: price > 30,
      isFree,
      price,
      tags: ['真题', item.categoryName],
      createTime: `${year}-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1} 10:00:00`,
    })
  })

  /* 生成模拟试题 */
  mockExamTitles.forEach((item, index) => {
    const isFree = Math.random() > 0.5
    const price = isFree ? 0 : Math.floor(Math.random() * 30) + 10

    documents.push({
      id: id++,
      title: item.title,
      summary: '高质量模拟题，配有详细解析和答题技巧，帮助考生熟悉考试题型。',
      coverImage: `https://picsum.photos/400/300?random=${id}`,
      fileSize: Math.floor(Math.random() * 5 * 1024 * 1024) + 1024 * 1024,
      fileType: 'PDF',
      downloadCount: Math.floor(Math.random() * 3000) + 300,
      viewCount: Math.floor(Math.random() * 5000) + 500,
      docType: 'real',
      docTypeName: '真题资料',
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      majorCode: 'building',
      majorName: '建筑工程',
      examType: 'yijian',
      examTypeName: '一级建造师',
      year: 2025,
      level: isFree ? 'free' : 'premium',
      levelName: isFree ? '免费' : '精品资料',
      materialType: 'mock_contest',
      materialTypeName: '模考大赛',
      status: 'online',
      statusName: '已上线',
      pages: Math.floor(Math.random() * 20) + 15,
      isVip: false,
      isFree,
      price,
      tags: ['模拟题', '模考大赛', item.categoryName],
      createTime: `2025-03-${Math.floor(Math.random() * 28) + 1} 10:00:00`,
    })
  })

  /* 生成核心考点 */
  corePointTitles.forEach((item, index) => {
    documents.push({
      id: id++,
      title: item.title,
      summary: '整理历年真题高频考点，浓缩精华，适合考前背诵和快速复习。',
      coverImage: `https://picsum.photos/400/300?random=${id}`,
      fileSize: Math.floor(Math.random() * 3 * 1024 * 1024) + 512 * 1024,
      fileType: 'PDF',
      downloadCount: Math.floor(Math.random() * 8000) + 2000,
      viewCount: Math.floor(Math.random() * 12000) + 3000,
      docType: 'material',
      docTypeName: '学习资料',
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      majorCode: 'building',
      majorName: '建筑工程',
      examType: 'yijian',
      examTypeName: '一级建造师',
      year: 2025,
      level: index < 2 ? 'vip' : 'premium',
      levelName: index < 2 ? 'VIP专享' : '精品资料',
      materialType: 'core_points',
      materialTypeName: '核心考点',
      status: 'online',
      statusName: '已上线',
      pages: Math.floor(Math.random() * 50) + 10,
      isVip: index < 2,
      isFree: false,
      price: index < 2 ? 99 : 49,
      tags: ['核心考点', '考前资料', item.categoryName],
      createTime: `2025-02-${Math.floor(Math.random() * 28) + 1} 10:00:00`,
    })
  })

  /* 生成学习计划 */
  studyPlanTitles.forEach((item, index) => {
    documents.push({
      id: id++,
      title: item.title,
      summary: '科学规划学习进度，合理安排时间，提高备考效率。',
      coverImage: `https://picsum.photos/400/300?random=${id}`,
      fileSize: Math.floor(Math.random() * 2 * 1024 * 1024) + 256 * 1024,
      fileType: 'PDF',
      downloadCount: Math.floor(Math.random() * 2000) + 200,
      viewCount: Math.floor(Math.random() * 4000) + 400,
      docType: 'material',
      docTypeName: '学习资料',
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      majorCode: 'building',
      majorName: '建筑工程',
      examType: index < 3 ? 'yijian' : 'erjian',
      examTypeName: index < 3 ? '一级建造师' : '二级建造师',
      year: 2025,
      level: 'free',
      levelName: '免费',
      materialType: 'study_plan',
      materialTypeName: '学习计划',
      status: 'online',
      statusName: '已上线',
      pages: Math.floor(Math.random() * 10) + 5,
      isVip: false,
      isFree: true,
      price: 0,
      tags: ['学习计划', '备考指南', item.categoryName],
      createTime: `2025-01-${Math.floor(Math.random() * 28) + 1} 10:00:00`,
    })
  })

  /* 生成教材变化 */
  materialChangeTitles.forEach((item, index) => {
    documents.push({
      id: id++,
      title: item.title,
      summary: '详细对比新旧教材差异，标注新增、删除和修改内容。',
      coverImage: `https://picsum.photos/400/300?random=${id}`,
      fileSize: Math.floor(Math.random() * 5 * 1024 * 1024) + 1024 * 1024,
      fileType: 'PDF',
      downloadCount: Math.floor(Math.random() * 4000) + 500,
      viewCount: Math.floor(Math.random() * 6000) + 800,
      docType: 'material',
      docTypeName: '学习资料',
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      majorCode: 'building',
      majorName: '建筑工程',
      examType: 'yijian',
      examTypeName: '一级建造师',
      year: 2025,
      level: 'free',
      levelName: '免费',
      materialType: 'material_change',
      materialTypeName: '教材变化',
      status: 'online',
      statusName: '已上线',
      pages: Math.floor(Math.random() * 30) + 20,
      isVip: false,
      isFree: true,
      price: 0,
      tags: ['教材变化', '对比分析', item.categoryName],
      createTime: `2025-01-${Math.floor(Math.random() * 28) + 1} 10:00:00`,
    })
  })

  /* 生成思维导图 */
  mindMapTitles.forEach((item, index) => {
    documents.push({
      id: id++,
      title: item.title,
      summary: '全书知识点思维导图，构建知识体系，便于理解和记忆。',
      coverImage: `https://picsum.photos/400/300?random=${id}`,
      fileSize: Math.floor(Math.random() * 10 * 1024 * 1024) + 2 * 1024 * 1024,
      fileType: 'PDF',
      downloadCount: Math.floor(Math.random() * 5000) + 1000,
      viewCount: Math.floor(Math.random() * 8000) + 1500,
      docType: 'material',
      docTypeName: '学习资料',
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      majorCode: 'building',
      majorName: '建筑工程',
      examType: 'yijian',
      examTypeName: '一级建造师',
      year: 2025,
      level: 'premium',
      levelName: '精品资料',
      materialType: 'mind_map',
      materialTypeName: '思维导图',
      status: 'online',
      statusName: '已上线',
      pages: Math.floor(Math.random() * 20) + 10,
      isVip: false,
      isFree: false,
      price: 29,
      tags: ['思维导图', '知识体系', item.categoryName],
      createTime: `2025-02-${Math.floor(Math.random() * 28) + 1} 10:00:00`,
    })
  })

  /* 生成案例300问 */
  case300Titles.forEach((item, index) => {
    documents.push({
      id: id++,
      title: item.title,
      summary: '精选经典案例题，配有详细解题思路和答题技巧。',
      coverImage: `https://picsum.photos/400/300?random=${id}`,
      fileSize: Math.floor(Math.random() * 15 * 1024 * 1024) + 5 * 1024 * 1024,
      fileType: 'PDF',
      downloadCount: Math.floor(Math.random() * 6000) + 1500,
      viewCount: Math.floor(Math.random() * 10000) + 2000,
      docType: 'material',
      docTypeName: '学习资料',
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      majorCode: 'building',
      majorName: '建筑工程',
      examType: 'yijian',
      examTypeName: '一级建造师',
      year: 2025,
      level: 'vip',
      levelName: 'VIP专享',
      materialType: 'case_300',
      materialTypeName: '案例300问',
      status: 'online',
      statusName: '已上线',
      pages: Math.floor(Math.random() * 100) + 200,
      isVip: true,
      isFree: false,
      price: 99,
      tags: ['案例300问', '案例分析', item.categoryName],
      createTime: `2025-02-${Math.floor(Math.random() * 28) + 1} 10:00:00`,
    })
  })

  return documents
}

export const mockDocumentList: DocumentVO[] = generateMockDocuments()

/* ==================== 查询函数 ==================== */

/**
 * 获取大类列表
 */
export const getMockMajors = (): MajorVO[] => {
  return mockMajors
}

/**
 * 获取文档列表（Mock）
 */
export const getMockDocumentList = (params: {
  page?: number
  limit?: number
  docType?: DocumentType
  categoryId?: number
  majorCode?: string
  examType?: string
  year?: number
  level?: DocumentLevel
  materialType?: string
  status?: DocumentStatus
  isFree?: boolean
  sort?: string
  keyword?: string
}): DocumentListRespVO => {
  const {
    page = 1,
    limit = 12,
    docType,
    categoryId,
    majorCode,
    examType,
    year,
    level,
    materialType,
    status,
    isFree,
    sort = 'comprehensive',
    keyword,
  } = params

  let list = [...mockDocumentList]

  /* 按文档类型筛选 */
  if (docType) {
    list = list.filter(item => item.docType === docType)
  }

  /* 按分类筛选 */
  if (categoryId) {
    list = list.filter(item => item.categoryId === categoryId)
  }

  /* 按大类筛选 */
  if (majorCode) {
    list = list.filter(item => item.majorCode === majorCode)
  }

  /* 按考试类型筛选 */
  if (examType) {
    list = list.filter(item => item.examType === examType)
  }

  /* 按年份筛选 */
  if (year) {
    list = list.filter(item => item.year === year)
  }

  /* 按等级筛选 */
  if (level) {
    list = list.filter(item => item.level === level)
  }

  /* 按资料类型筛选 */
  if (materialType) {
    list = list.filter(item => item.materialType === materialType)
  }

  /* 按状态筛选 */
  if (status) {
    list = list.filter(item => item.status === status)
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

  /* 排序 */
  switch (sort) {
    case 'newest':
      list.sort((a, b) => new Date(b.createTime || '').getTime() - new Date(a.createTime || '').getTime())
      break
    case 'downloads':
      list.sort((a, b) => b.downloadCount - a.downloadCount)
      break
    case 'price_asc':
      list.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'price_desc':
      list.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    default:
      /* 综合排序：免费 > 下载量 > 时间 */
      list.sort((a, b) => {
        if (a.isFree !== b.isFree) return (b.isFree ? 1 : 0) - (a.isFree ? 1 : 0)
        return b.downloadCount - a.downloadCount
      })
  }

  const total = list.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedList = list.slice(start, end)

  return {
    list: paginatedList,
    total,
  }
}

/**
 * 获取文档详情（Mock）
 */
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

/**
 * 获取文档分类（Mock）
 */
export const getMockDocumentCategories = (docType?: DocumentType): DocumentCategoryVO[] => {
  let categories = [...mockDocumentCategories]
  if (docType) {
    categories = categories.filter(cat => cat.docType === docType)
  }
  return categories
}

/**
 * 获取考试类型（Mock）
 */
export const getMockExamTypes = (majorCode?: string): ExamTypeVO[] => {
  let types = [...mockExamTypes]
  if (majorCode) {
    types = types.filter(t => t.majorCode === majorCode)
  }
  return types
}

/**
 * 获取年份选项（Mock）
 */
export const getMockYearOptions = (): YearOptionVO[] => {
  return mockYearOptions
}

/**
 * 获取等级选项（Mock）
 */
export const getMockLevelOptions = (): LevelOptionVO[] => {
  return mockLevelOptions
}

/**
 * 获取资料类型选项（Mock）
 */
export const getMockMaterialTypes = (): MaterialTypeOptionVO[] => {
  return mockMaterialTypes
}

/**
 * 获取状态选项（Mock）
 */
export const getMockStatusOptions = (): StatusOptionVO[] => {
  return mockStatusOptions
}

/**
 * 增加下载次数（Mock）
 */
export const incrementMockDownloadCount = (id: number): void => {
  const doc = mockDocumentList.find(item => item.id === id)
  if (doc) {
    doc.downloadCount += 1
  }
}

/* ==================== 辅助函数 ==================== */

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
      <li><strong>考试类型：</strong>${doc.examTypeName || doc.examType}</li>
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
