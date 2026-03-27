import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'


// 定义页头信息的类型
export interface HeaderInfo {
  title: string;   // 报告标题
  logoUrl: string; // 公司 Logo 地址（base64 或 URL）
  [key: string]: string; // 允许其他自定义字段
}

// 定义PDF导出选项的类型
export interface PdfExportOptions {
  targetRef: HTMLElement | null;
  headerInfo: HeaderInfo;
  filename: string;
  orientation?: 'p' | 'l'; // 'p' 纵向, 'l' 横向
  format?: 'a4' | 'letter' | 'legal'; // 页面格式
  headerHeight?: number; // 页头高度
  footerHeight?: number; // 页脚高度
  scale?: number; // 缩放比例，影响清晰度
  margins?: {
    top?: number;    // 上边距(mm)
    right?: number;  // 右边距(mm)
    bottom?: number; // 下边距(mm)
    left?: number;   // 左边距(mm)
  };
  watermark?: {
    text: string;
    fontSize?: number;
    opacity?: number;
  };
}

/**
 * 添加水印
 */
const addWatermark = (
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  watermark: { text: string; fontSize?: number; opacity?: number }
) => {
  const { text, fontSize = 40, opacity = 0.1 } = watermark;

  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(fontSize);

  pdf.setTextColor(150, 150, 150);
  (pdf as any).setGState(new (pdf as any).GState({ opacity })); // 设置透明度

  pdf.saveGraphicsState();
  pdf.text(text, pageWidth / 2, pageHeight / 2, { align: 'center' });
  pdf.restoreGraphicsState();

  // 恢复文字颜色
  pdf.setTextColor(0, 0, 0);
};


/**
 * 添加PDF页头信息
 * @param pdf jsPDF实例
 * @param headerInfo 页头信息
 * @param headerHeight 页头高度
 */
const addHeader = (
  pdf: jsPDF,
  headerInfo: HeaderInfo,
  headerHeight: number
) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  let logoWidth = 0;
  const _logoMargin = 5;
  // 如果有 logo
  if (headerInfo.logoUrl) {
    try {
      logoWidth = headerHeight - 10;
      pdf.addImage(headerInfo.logoUrl, 'JPEG', 15, 8, logoWidth, headerHeight - 10);
    } catch (e) {
      console.warn('Logo 加载失败，已跳过:', e);
    }
  }

  // 标题居中
  if (headerInfo.title) {
    pdf.setFontSize(14);
    pdf.setFont('Helvetica', 'bold');
    const titleY = 12;
    pdf.text(headerInfo.title, pageWidth / 2, titleY, { align: 'center' });
  }

  // 设置字体
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(10);

  // 绘制个人信息
  // const leftYPositions = [12];
  // let index = 0;
  // for (const [key, value] of Object.entries(headerInfo)) {
  //   if (index < leftYPositions.length) {
  //     pdf.text(`${key}: ${value}`, 15 + logoWidth + logoMargin, leftYPositions[index]);
  //     index++;
  //   }
  // }

  // 绘制页码
  pdf.text(`Haoyou Technology Co.`, pageWidth - 60, 12);

  // 绘制分隔线
  pdf.setLineWidth(0.3);
  pdf.line(15, headerHeight, pageWidth - 15, headerHeight);
};

/**
 * 添加页脚信息（页码）
 */
const addFooter = (
  pdf: jsPDF,
  currentPage: number,
  totalPages: number,
  pageWidth: number,
  pageHeight: number,
  footerHeight: number
) => {
  // 设置字体
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9);
  // 计算页脚位置
  const footerY = pageHeight - footerHeight / 2;

  // 绘制页码（居中显示）
  const pageText = `Page ${currentPage}  / Total ${totalPages} `;
  const textWidth = pdf.getStringUnitWidth(pageText) / pdf.internal.scaleFactor;
  const xPos = (pageWidth - textWidth) / 2 - (textWidth / 2); // 水平居中

  pdf.text(pageText, xPos, footerY);
};

/**
 * 导出PDF的核心函数
 * @param options 导出选项
 * @returns Promise<void>
 */
export const exportToPdf = async (options: PdfExportOptions): Promise<void> => {
  const {
    targetRef,
    headerInfo,
    filename,
    orientation = 'p',
    format = 'a4',
    headerHeight = 15,
    footerHeight = 10,
    scale = 2,
    watermark = { text: 'Haoyou Technology Co., LTD' },
  } = options;

  if (!targetRef) {
    throw new Error('未找到需要导出的目标元素，请检查ref是否正确');
  }

  // 合并默认页边距
  const margins = {
    top: 10,
    right: 20,
    bottom: 10,
    left: 20,
    ...options.margins
  }

    // 创建PDF文档
    const pdf = new jsPDF(orientation, 'mm', format);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 计算内容区域尺寸（减去边距和页眉页脚）
    const contentArea = {
      width: pageWidth - margins.left - margins.right,
      height: pageHeight - margins.top - margins.bottom - headerHeight - footerHeight
    }

    // 克隆内容以避免影响原页面
    const clonedContent = targetRef.cloneNode(true) as HTMLElement;
    // 设置克隆内容的样式使其适合PDF
    const _pdfWidth = orientation === 'p' ? 210 : 297; // A4尺寸(mm)
    clonedContent.style.width = `${contentArea.width}mm`;
    clonedContent.style.minHeight = 'auto';
    clonedContent.style.padding = '0';
    clonedContent.style.margin = '0';
    clonedContent.style.backgroundColor = 'white';
    clonedContent.style.position = 'absolute';
    clonedContent.style.top = '-9999px';
    clonedContent.style.left = '-9999px';
    clonedContent.style.boxSizing = 'border-box';
    // 添加到文档中以便渲染
    document.body.appendChild(clonedContent);

  try {
    // 使用html2canvas将DOM转换为图片
    const canvas = await html2canvas(clonedContent, {
      scale,
      useCORS: true,
      logging: false,
      allowTaint: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: clonedContent.offsetWidth,
      windowHeight: clonedContent.offsetHeight
    });

    // 计算图片缩放比例
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const scaleRatio = contentArea.width / imgWidth;
    const scaledHeight = imgHeight * scaleRatio;



    // 计算总页数
    const totalPages = Math.ceil(scaledHeight / contentArea.height);

    // 循环添加每一页
    for (let page = 1; page <= totalPages; page++) {
      if (page > 1) {
        pdf.addPage();
      }

      // 当前页内容在 canvas 中的截取区域
      const srcY = contentArea.height * (page - 1) / scaleRatio; // 注意这里要除缩放比
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d')!;
      pageCanvas.width = imgWidth;
      pageCanvas.height = contentArea.height / scaleRatio;

      // 从总的 canvas 截取当前页图像
      pageCtx.drawImage(
        canvas,
        0, srcY, imgWidth, contentArea.height / scaleRatio, // 源区域
        0, 0, imgWidth, contentArea.height / scaleRatio    // 目标区域
      );

      // 添加内容图片
      pdf.addImage(
        pageCanvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        margins.left, // x坐标
        margins.top + headerHeight, // y坐标
        contentArea.width, // 宽度
        contentArea.height // 高度
      );

      // 添加页头
      addHeader(pdf, headerInfo, headerHeight);
      // 页脚
      addFooter(pdf, page, totalPages, pageWidth, pageHeight, footerHeight);

      if (watermark) {
        addWatermark(pdf, pageWidth, pageHeight, watermark);
      }
    }

    // 保存PDF
    pdf.save(filename);
    console.log('PDF导出成功');
  } catch (error) {
    console.error('PDF导出失败:', error);
    throw error;
  } finally {
    // 清理克隆元素
    document.body.removeChild(clonedContent);
  }
};
