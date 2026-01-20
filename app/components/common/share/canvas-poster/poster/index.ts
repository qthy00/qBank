import user from './user'
import tools from './tools'



export interface PosterData {
  background?: string
  list?: PosterItem[]
}

export interface PosterItem {
  name: string
  type: string
  val: string
  x: number
  y: number
  backgroundRadius?: number
  backgroundColor?: string
  backgroundPadding?: { x: number, y: number }
  paintbrushProps?: PosterProps
  width?: number
  height?: number
  r?: number
  d?: number
  maxWidth?: number
  line?: number
  lineHeight?: number
  size?: number
  textDecoration?: {
    line: string
    style: string
  }
}

export interface PosterProps {
  textAlign?: string
  fillStyle: string
  font: {
    fontSize: number
    fontFamily?: string
  }
}


export function getPosterData(options) : PosterData {
  switch (options.shareInfo.poster.type) {
    case 'user':
      return user(options)
    case 'tools':
      return tools(options)
    default:
      return {}
  }
}
