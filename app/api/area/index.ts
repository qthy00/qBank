import {httpGet} from "~/composables/useHttp";

// 获得地区树
export const getAreaTree = async () => {
  return await httpGet('getAreaTree',  '/system/area/tree' )
}
