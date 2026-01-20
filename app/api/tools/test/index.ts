import {httpGet, httpPost} from "~/composables/useHttp";


export interface QuestionnaireVO {
  id: number
  text: string
  options: QuestionnaireOptionVO[]
}

export interface QuestionnaireOptionVO {
  key: string
  value: string
  selected: boolean
}


export const TestApi = {

  getQuestionnaire: async (type: string) => {
    return await httpGet('getQuestionnaire', `/tools/mbti/get?type=${type}`)
  },

  submitAnswers: async (data: any) => {
    return await httpPost('submitAnswers', `/tools/mbti/submit`, data )
  },

  fetchResult: async (sessionId: number) => {
    return await httpGet('fetchResult', `/tools/mbti/result?id=${sessionId}` )
  },


  fetchResultList: async (query: any) => {
    return await httpGet('fetchResultList', `/tools/test-records/page` , {query})
  },
}
