/**
 * 考试信息相关类型定义
 */

export interface examsInfoVO {
  categoryId: number
  categoryName: string
  categoryUrl: string
  exams: examsItemVO[]
}

export interface examsItemVO {
  id: number
  name: string
  image: string
  daysLeft: number
  examDate?: string
  subjects: Subject[]
  news: NewsItem[]
  materials: Material[]
  questionBanks: string[]
  /* 报考相关 */
  registrationItems: RegistrationItem[]
  /* 考试相关 */
  examItems: ExamItem[]
  /* 成绩相关 */
  scoreItems: ScoreItem[]
  /* 推荐试卷 */
  recommendedPapers?: PaperInfo[]
  /* 学习文档 */
  studyMaterials?: StudyMaterial[]
}

export interface Subject {
  id?: number
  name: string
  alias: string
  totalQuestions?: number
  completedQuestions?: number
  progress?: number
  chapters?: ChapterItem[]
}

export interface ChapterItem {
  id: number
  name: string
  total: number
  completed: number
  progress: number
}

export interface NewsItem {
  id?: number
  title: string
  publishDate?: string
  source?: string
  url?: string
}

export interface Material {
  id?: number
  title: string
  image: string
  url?: string
}

export interface RegistrationItem {
  tag: string
  url: string
}

export interface ExamItem {
  tag: string
  url: string
}

export interface ScoreItem {
  tag: string
  url: string
}

export interface PaperInfo {
  id: number
  title: string
  duration: number
  questionCount: number
  examCount: number
  rating: number
}

export interface StudyMaterial {
  id: number
  title: string
  publishDate: string
  fileSize: string
  fileType: 'word' | 'ppt' | 'excel' | 'pdf'
  downloadUrl?: string
}

export interface PracticeMode {
  key: string
  name: string
  icon: string
  url: string
}
