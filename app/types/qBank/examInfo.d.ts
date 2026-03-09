export interface examsDataVO {
    id: number
    name: string
    image: string
    daysLeft: number
    subjects: Array<SubjectVO>
    news: Array<SubjectVO>
    materials: Array<SubjectVO>
    questionBanks: Array<string>
    registrationItems: Array<string>
    examItems: Array<string>
    scoreItems: Array<string>
}

export interface SubjectVO {
    title: string
    image?: string
    description?: string
}
