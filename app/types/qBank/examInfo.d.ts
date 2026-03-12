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
    subjects: Subject[]
    news: NewsItem[]
    materials: Material[]
    questionBanks: string[]
    registrationItems: string[]
    examItems: string[]
    scoreItems: string[]
}

interface Subject {
    name: string
    alias: string
}

interface NewsItem {
    title: string
}

interface Material {
    title: string
    image: string
}
