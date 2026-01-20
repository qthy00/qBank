import { updateFile } from '@/api/user'
import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import { config } from '@/config/config'

/**
 * 获得上传 URL
 */
export const getUploadUrl = (): string => {
  return `${config.base_url}/infra/file/upload`
}

export const useUpload = () => {
  const uploadUrl = getUploadUrl()
  // 重写ElUpload上传方法
  const httpRequest = async (options: UploadRequestOptions) => {
    // 重写 el-upload httpRequest 文件上传成功会走成功的钩子，失败走失败的钩子
    return new Promise((resolve, reject) => {
      updateFile({ file: options.file })
        .then((res) => {
          if (res.code === 0) {
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch((res) => {
          reject(res)
        })
    })
  }

  return {
    uploadUrl,
    httpRequest,
  }
}
