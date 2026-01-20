export interface ImageItem {
  id: number
  url: string
  name: string
  type?: number
  color: string
  status?: number
}

export interface CombinationResult {
  name: string
  url: string
  color: string
  percentage: number
  author: string
}

export interface Recipe {
  id: number
  material1: ImageItem
  material2: ImageItem
  author: string
}

export interface NewRecipeVO {
  new1?: ImageItem
  new2?: ImageItem
  resultImage?: ImageItem
  percentage: number
}
