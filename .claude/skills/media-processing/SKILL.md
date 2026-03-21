---
name: media-processing
description: |
  媒体处理开发指南。当用户需要实现图片处理、二维码生成、水印添加、Excel导入导出、PDF生成等功能时使用此技能。
  适用于 Nuxt 4 + Vue 3 前端项目。
  触发词：图片处理、二维码、水印、Excel导入、Excel导出、PDF生成、图片压缩、base64
---

# 媒体处理开发指南

## 何时使用

**适用场景**
- 图片压缩、裁剪、格式转换
- 二维码生成与识别
- 图片水印添加
- Excel文件导入与导出
- PDF预览与生成
- Base64图片处理
- Canvas绘图

**不适用场景**
- 后端图片处理服务
- 专业图像编辑软件
- 视频编辑处理

---

## 图片处理

### 1. 图片压缩

```typescript
// composables/useImageCompress.ts

export interface CompressOptions {
  maxWidth?: number      // 最大宽度
  maxHeight?: number     // 最大高度
  quality?: number       // 压缩质量 0-1
  maxSize?: number       // 最大文件大小（KB）
}

export function useImageCompress() {
  // 压缩图片
  const compress = async (
    file: File,
    options: CompressOptions = {}
  ): Promise<Blob> => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      maxSize
    } = options

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        // 计算压缩后的尺寸
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // 绘制到canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        // 转换为blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // 如果指定了maxSize且压缩后仍过大，递归压缩
              if (maxSize && blob.size > maxSize * 1024 && quality > 0.1) {
                compress(file, { ...options, quality: quality - 0.1 })
                  .then(resolve)
                  .catch(reject)
              } else {
                resolve(blob)
              }
            } else {
              reject(new Error('压缩失败'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = reject
    })
  }

  // 图片转base64
  const toBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }

  // base64转文件
  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  return {
    compress,
    toBase64,
    base64ToFile
  }
}
```

### 2. 使用示例

```vue
<template>
  <div class="image-compress">
    <el-upload
      :auto-upload="false"
      :on-change="handleChange"
      accept="image/*"
    >
      <el-button type="primary">
        <Icon name="ep:picture" /> 选择图片
      </el-button>
    </el-upload>

    <div v-if="originalFile" class="mt-4">
      <el-row :gutter="20">
        <el-col :span="12">
          <h4>原图</h4>
          <p>大小: {{ formatSize(originalFile.size) }}</p>
          <img :src="originalUrl" class="preview-img" />
        </el-col>
        <el-col :span="12">
          <h4>压缩后</h4>
          <p v-if="compressedBlob">
            大小: {{ formatSize(compressedBlob.size) }}
            <el-tag type="success">
              节省 {{ calculateSavings() }}%
            </el-tag>
          </p>
          <img v-if="compressedUrl" :src="compressedUrl" class="preview-img" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UploadFile } from 'element-plus'

const { compress, toBase64 } = useImageCompress()

const originalFile = ref<File | null>(null)
const originalUrl = ref('')
const compressedBlob = ref<Blob | null>(null)
const compressedUrl = ref('')

const handleChange = async (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return

  originalFile.value = file
  originalUrl.value = URL.createObjectURL(file)

  // 压缩图片
  compressedBlob.value = await compress(file, {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.8,
    maxSize: 500 // 最大500KB
  })

  compressedUrl.value = URL.createObjectURL(compressedBlob.value)
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const calculateSavings = () => {
  if (!originalFile.value || !compressedBlob.value) return 0
  const savings = originalFile.value.size - compressedBlob.value.size
  return Math.round((savings / originalFile.value.size) * 100)
}
</script>

<style scoped>
.preview-img {
  max-width: 100%;
  max-height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
```

---

## 二维码生成

### 1. 封装 useQRCode

```typescript
// composables/useQRCode.ts
import QRCode from 'qrcode'

export interface QRCodeOptions {
  width?: number
  height?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  type?: 'image/png' | 'image/jpeg'
  quality?: number
}

export function useQRCode() {
  // 生成二维码DataURL
  const generate = async (
    text: string,
    options: QRCodeOptions = {}
  ): Promise<string> => {
    const defaultOptions: QRCodeOptions = {
      width: 256,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      type: 'image/png',
      quality: 0.92
    }

    return QRCode.toDataURL(text, { ...defaultOptions, ...options })
  }

  // 生成二维码到Canvas
  const generateToCanvas = async (
    canvas: HTMLCanvasElement,
    text: string,
    options: QRCodeOptions = {}
  ): Promise<void> => {
    return QRCode.toCanvas(canvas, text, {
      width: options.width || 256,
      margin: options.margin || 2,
      color: options.color || { dark: '#000000', light: '#ffffff' }
    })
  }

  // 生成带Logo的二维码
  const generateWithLogo = async (
    text: string,
    logoUrl: string,
    options: QRCodeOptions = {}
  ): Promise<string> => {
    const { width = 256 } = options

    // 生成基础二维码
    const qrDataUrl = await generate(text, options)

    // 创建canvas合成
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = width
    const ctx = canvas.getContext('2d')!

    // 绘制二维码
    const qrImg = await loadImage(qrDataUrl)
    ctx.drawImage(qrImg, 0, 0, width, width)

    // 绘制Logo（居中，占30%）
    const logoSize = width * 0.3
    const logoX = (width - logoSize) / 2
    const logoY = (width - logoSize) / 2

    // 白色背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8)

    // Logo图片
    const logoImg = await loadImage(logoUrl)
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)

    return canvas.toDataURL(options.type || 'image/png')
  }

  // 加载图片辅助函数
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  return {
    generate,
    generateToCanvas,
    generateWithLogo
  }
}
```

### 2. 二维码组件

```vue
<template>
  <div class="qrcode-generator">
    <el-input
      v-model="text"
      placeholder="输入要生成的内容"
      clearable
    >
      <template #append>
        <el-button @click="handleGenerate">
          <Icon name="ep:refresh" /> 生成
        </el-button>
      </template>
    </el-input>

    <div class="qrcode-preview mt-4">
      <img v-if="qrCodeUrl" :src="qrCodeUrl" :width="size" :height="size" />
      <div v-else class="placeholder">
        <Icon name="ep:full-screen" class="text-4xl text-(--color-text-secondary)" />
        <p>二维码预览</p>
      </div>
    </div>

    <div class="actions mt-4">
      <el-button v-if="qrCodeUrl" type="primary" @click="downloadQRCode">
        <Icon name="ep:download" /> 下载二维码
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { generate, generateWithLogo } = useQRCode()

const text = ref('')
const qrCodeUrl = ref('')
const size = ref(256)

const handleGenerate = async () => {
  if (!text.value) {
    message.warning('请输入内容')
    return
  }

  // 基础二维码
  qrCodeUrl.value = await generate(text.value, {
    width: size.value,
    color: { dark: '#000', light: '#fff' }
  })

  // 或使用带Logo的二维码
  // qrCodeUrl.value = await generateWithLogo(text.value, '/logo.png', { width: size.value })
}

const downloadQRCode = () => {
  if (!qrCodeUrl.value) return

  const link = document.createElement('a')
  link.download = `qrcode-${Date.now()}.png`
  link.href = qrCodeUrl.value
  link.click()
}
</script>

<style scoped>
.qrcode-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: #f5f5f5;
  border-radius: 8px;

  .placeholder {
    text-align: center;
    color: var(--color-text-secondary);
  }
}
</style>
```

---

## Excel导入导出

### 1. 安装依赖

```bash
pnpm add xlsx file-saver
```

### 2. 封装 useExcel

```typescript
// composables/useExcel.ts
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export interface ExcelColumn {
  prop: string
  label: string
  width?: number
  formatter?: (value: any, row: any) => string | number
}

export function useExcel() {
  // 导出Excel
  const exportToExcel = (
    data: any[],
    columns: ExcelColumn[],
    filename = 'export.xlsx'
  ) => {
    // 处理数据
    const exportData = data.map(row => {
      const obj: Record<string, any> = {}
      columns.forEach(col => {
        const value = row[col.prop]
        obj[col.label] = col.formatter ? col.formatter(value, row) : value
      })
      return obj
    })

    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // 设置列宽
    const colWidths = columns.map(col => ({ wch: col.width || 15 }))
    ws['!cols'] = colWidths

    // 下载
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    saveAs(blob, filename)
  }

  // 从Excel导入
  const importFromExcel = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet)
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  // 导出带样式的Excel（复杂表格）
  const exportStyledExcel = (
    data: any[],
    columns: ExcelColumn[],
    options: {
      filename?: string
      sheetName?: string
      headerStyle?: any
    } = {}
  ) => {
    const { filename = 'export.xlsx', sheetName = 'Sheet1' } = options

    // 创建表头
    const header = columns.map(col => col.label)

    // 创建数据行
    const rows = data.map(row =>
      columns.map(col => {
        const value = row[col.prop]
        return col.formatter ? col.formatter(value, row) : value
      })
    )

    // 合并表头和数据
    const worksheetData = [header, ...rows]

    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(worksheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // 设置列宽
    ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }))

    // 下载
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    saveAs(blob, filename)
  }

  return {
    exportToExcel,
    importFromExcel,
    exportStyledExcel
  }
}
```

### 3. Excel导入导出组件

```vue
<template>
  <div class="excel-handler">
    <!-- 导出 -->
    <el-button type="primary" @click="handleExport">
      <Icon name="ep:download" /> 导出Excel
    </el-button>

    <!-- 导入 -->
    <el-upload
      class="ml-2"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleImport"
      accept=".xlsx,.xls"
    >
      <el-button>
        <Icon name="ep:upload" /> 导入Excel
      </el-button>
    </el-upload>
  </div>

  <!-- 导入预览 -->
  <el-dialog v-model="previewVisible" title="导入预览" width="800px">
    <el-table :data="importData" max-height="400">
      <el-table-column
        v-for="col in importColumns"
        :key="col"
        :prop="col"
        :label="col"
      />
    </el-table>
    <template #footer>
      <el-button @click="previewVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmImport">
        确认导入
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UploadFile } from 'element-plus'

const { exportToExcel, importFromExcel } = useExcel()

// 导出配置
const columns = [
  { prop: 'id', label: 'ID', width: 10 },
  { prop: 'name', label: '姓名', width: 15 },
  { prop: 'phone', label: '手机号', width: 15 },
  { prop: 'status', label: '状态', width: 10, formatter: (v: number) => v === 1 ? '启用' : '禁用' }
]

// 导入相关
const previewVisible = ref(false)
const importData = ref<any[]>([])
const importColumns = ref<string[]>([])

// 导出
const handleExport = () => {
  const data = [
    { id: 1, name: '张三', phone: '13800138000', status: 1 },
    { id: 2, name: '李四', phone: '13800138001', status: 0 }
  ]
  exportToExcel(data, columns, `用户列表-${formatDate(new Date())}.xlsx`)
}

// 导入
const handleImport = async (file: UploadFile) => {
  try {
    const data = await importFromExcel(file.raw!)
    importData.value = data
    importColumns.value = Object.keys(data[0] || {})
    previewVisible.value = true
  } catch {
    message.error('导入失败')
  }
}

const confirmImport = () => {
  // 处理导入数据
  console.log('导入数据:', importData.value)
  message.success(`成功导入 ${importData.value.length} 条数据`)
  previewVisible.value = false
}

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}
</script>
```

---

## PDF处理

### 1. PDF预览

```vue
<template>
  <div class="pdf-viewer">
    <el-button @click="previewPDF">
      <Icon name="ep:document" /> 预览PDF
    </el-button>

    <el-dialog v-model="visible" title="PDF预览" width="80%" top="5vh">
      <iframe
        v-if="pdfUrl"
        :src="pdfUrl"
        width="100%"
        height="600px"
        frameborder="0"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
const visible = ref(false)
const pdfUrl = ref('')

const previewPDF = () => {
  // 使用后端转换后的预览链接
  pdfUrl.value = '/api/infra/file/preview?url=' + encodeURIComponent(fileUrl)
  visible.value = true
}
</script>
```

### 2. PDF生成（打印转PDF）

```vue
<template>
  <div>
    <el-button type="primary" @click="printToPDF">
      <Icon name="ep:printer" /> 打印/导出PDF
    </el-button>

    <!-- 打印内容 -->
    <div id="print-content" class="print-area">
      <!-- 需要打印的内容 -->
      <h1>证书</h1>
      <p>姓名: {{ userInfo.name }}</p>
      <p>成绩: {{ userInfo.score }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const printToPDF = () => {
  const printContent = document.getElementById('print-content')
  if (!printContent) return

  // 打开新窗口打印
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <html>
      <head>
        <title>打印</title>
        <style>
          /* 打印样式 */
          @media print {
            body { margin: 0; }
            .print-area { width: 100%; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
  }, 250)
}
</script>

<style scoped>
/* 屏幕隐藏，打印显示 */
.print-area {
  display: none;
}

@media print {
  .print-area {
    display: block;
  }
}
</style>
```

---

## 最佳实践

1. **图片处理**
   - 上传前压缩图片减少带宽
   - 使用 Canvas 进行图片处理
   - 处理完成后及时释放资源

2. **文件导入**
   - 验证文件类型和大小
   - 提供导入模板下载
   - 预览确认后再正式导入
   - 显示导入进度和结果

3. **二维码**
   - 使用带Logo的二维码增强品牌识别
   - 提供下载功能
   - 测试扫描兼容性

4. **性能优化**
   - 大文件处理使用分片
   - 避免在主线程处理大量数据
   - 使用 Web Worker 处理复杂计算

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-21
