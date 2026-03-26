import type {
  MistakeExportReqVO,
  MistakeExportRespVO,
  MistakeExportHistoryListRespVO,
  MistakeExportHistoryVO
} from '~/types/mistake/export'

/**
 * 错题导出Mock数据
 * 用于前端独立开发和测试
 */

// 模拟导出任务存储
const exportTasks = new Map<string, MistakeExportRespVO>()

// 模拟导出历史
const exportHistory: MistakeExportHistoryVO[] = [
  {
    taskId: 'export_20260325000000_abc001',
    exportType: 'pdf',
    fileName: '错题导出_20260325.pdf',
    fileSize: 1024567,
    questionCount: 50,
    status: 'completed',
    createTime: '2026-03-25 10:00:00',
    completeTime: '2026-03-25 10:00:05'
  },
  {
    taskId: 'export_20260324000000_abc002',
    exportType: 'word',
    fileName: '错题导出_20260324.docx',
    fileSize: 856432,
    questionCount: 30,
    status: 'completed',
    createTime: '2026-03-24 15:30:00',
    completeTime: '2026-03-24 15:30:08'
  }
]

/**
 * 模拟提交导出任务
 */
export const mockExportMistakes = (data: MistakeExportReqVO): Promise<MistakeExportRespVO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const taskId = `export_${new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}_${Math.random().toString(36).substr(2, 6)}`

      const task: MistakeExportRespVO = {
        taskId,
        status: 'pending',
        createTime: new Date().toISOString()
      }

      exportTasks.set(taskId, task)

      // 模拟3秒后完成
      setTimeout(() => {
        task.status = 'completed'
        task.downloadUrl = `https://example.com/download/${taskId}.${data.exportType === 'word' ? 'docx' : 'pdf'}`
        task.fileName = `错题导出_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.${data.exportType === 'word' ? 'docx' : 'pdf'}`
        task.fileSize = Math.floor(Math.random() * 2000000) + 500000
        task.completeTime = new Date().toISOString()

        // 添加到历史
        exportHistory.unshift({
          taskId,
          exportType: data.exportType,
          fileName: task.fileName,
          fileSize: task.fileSize,
          questionCount: data.questionIds?.length || Math.floor(Math.random() * 50) + 10,
          status: 'completed',
          createTime: task.createTime,
          completeTime: task.completeTime
        })
      }, 3000)

      resolve(task)
    }, 500)
  })
}

/**
 * 模拟获取导出任务状态
 */
export const mockGetExportTaskStatus = (taskId: string): Promise<MistakeExportRespVO> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = exportTasks.get(taskId)
      if (task) {
        resolve({ ...task })
      } else {
        reject(new Error('任务不存在'))
      }
    }, 300)
  })
}

/**
 * 模拟获取导出历史
 */
export const mockGetExportHistory = (page: number = 1, limit: number = 10): Promise<MistakeExportHistoryListRespVO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit
      const end = start + limit
      resolve({
        list: exportHistory.slice(start, end),
        total: exportHistory.length
      })
    }, 300)
  })
}

/**
 * 模拟取消导出任务
 */
export const mockCancelExportTask = (taskId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = exportTasks.get(taskId)
      if (task) {
        task.status = 'failed'
        task.errorMsg = '用户取消'
        resolve()
      } else {
        reject(new Error('任务不存在'))
      }
    }, 300)
  })
}

/**
 * 模拟删除导出记录
 */
export const mockDeleteExportRecord = (taskId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = exportHistory.findIndex(item => item.taskId === taskId)
      if (index > -1) {
        exportHistory.splice(index, 1)
      }
      exportTasks.delete(taskId)
      resolve()
    }, 300)
  })
}
