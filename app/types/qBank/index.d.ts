export interface BaseType {
    type: string
    value: number
}


export interface SyllabusVO {
    id: number
    title: string
    contentHtml: string
    publishDate: number
}


export interface QuestionReqVO {
    categoryId?: number
    subjectId?: number
    chapterId?: number
    sectionId?: number
    type?: number
    status?: number
    amount?: number
    random?: boolean
}

export interface QuestionVO {
    id: number
    contentId: number
    type: number
    typeName: string
    content: string
    options: Record<string, string>
    parentQuestion: string
    answer: string
    point: string
    analysis: string
    parentSonType: number
    parentSonOrder: number
    questionList: QuestionVO[]
    isRepeat: number
}

export interface UserAnswer{
    questionId: number
    answer: string
}

export interface AnswerDetail {
    contentId?: number
    userAnswer: Record<number, string> // 答案内容
    spendTime?: number // 耗时（秒）
    hesitationCount?: number // 犹豫次数
    answerTime?: number // 提交时间
    isRepeat?: number // 重复答题次数
    isSubmitted?: boolean // 是否已答题
    isCorrect?: boolean // 是否正确
    isSkipped?: boolean // 是否跳过
    score?: number // 得分
    typeName?: string
}


export interface AnswerCache {
    [questionId: number]: AnswerDetail
    timer?: string
    startTime?: number
    currentIndex?: number
    paperId?: number

}

interface Question {
    id: number
    contentId: number
    type: number
    typeName?: string
    content: string
    options: Record<string, string>
    parentId: number
    parentQuestion: string
    parentSonType: number
    parentSonOrder: number
    sort: number
    score: number
}

export interface PaperQuestion extends Question{
    questionList: Question[]
}

export interface Paper {
    paperId?: number
    title: string
    durationMinutes: number
    totalScore: number
    questions: PaperQuestion[]
}

export interface SubmitPaper {
    paperId: number
    answers: AnswerDetail[]
}


export interface PaperReport {
    paperId?: number
    paperTitle?: string
    startTime?: number
    score: number
    totalScore: number
    avgScore: number
    relativeScore: number
    spendTime: number
    rank: string
    completionRate: number
    distribution: Distribution[]
    accuracy: number
    totalAmount: number
    incorrectAmount: number
    chapterErrorList: ChapterError[]
}

export interface QuestionAnswerVO {
    type: number
    typeName: string
    total: number
    score: number
    questions: QuestionItem[]
}

export interface QuestionItem extends Question{
    sort: number
    answer: string
    userAnswer: string
    analysis: string
    point: string
    isCorrect: number
    userScore: number
    questionList: QuestionItem[]
}

export interface Distribution {
    displayName: string
    type: number
    score: number
    time: number
    accuracy: number
    totalScore: number
    count: number
    obtainScore: number
}

export interface ChapterError {
    chapterId: number
    chapterName: string
    errorCount: number
}

export interface FillIn {
    type: string
    content?: string
    userAnswer?: string
    correctAnswer?: string
    isCorrect?: boolean
    index?: number
}

export interface WrongQuestion {
    id:number
    type: number
    difficulty: number
    content: string
    mistakeCount: number
    lastReviewTime: number
}

export interface MistakeSummary {
    totalCount: number
    masterCount: number
    accuracy: number

}
