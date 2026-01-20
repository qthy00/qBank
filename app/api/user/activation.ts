import {httpGet, httpPost} from "~/composables/useHttp";


export const checkActivation = (code: string) => {
  return httpGet('checkActivation', `/activation/code/check?code=${code}` )
}


export const useActivation = (data: any) => {
  return httpPost('useActivation', `/activation/code/activate`, data )
}


export const activationRecord = () => {
  return httpGet('activationRecord', `/activation/code/list` )
}
