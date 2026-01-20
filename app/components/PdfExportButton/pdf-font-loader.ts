/**
 * 动态加载CDN中的字体资源
 * @param cdnUrl - 字体资源的CDN地址
 * @returns Promise<void> - 加载完成的Promise
 */
export function loadCdnFont(cdnUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否已加载过该CDN
    const existingScript = document.querySelector(`script[src="${cdnUrl}"]`);

    if (existingScript) {
      // 已加载过，直接 resolve
      resolve();
      return;
    }

    // 创建script标签
    const script = document.createElement('script');
    script.src = cdnUrl;
    script.type = 'text/javascript';
    script.crossOrigin = 'anonymous'; // 处理跨域

    // 加载成功回调
    script.onload = () => {
      console.log('CDN字体资源加载成功');
      resolve();
    };

    // 加载失败回调
    script.onerror = (error) => {
      console.error('CDN字体资源加载失败:', error);
      reject(new Error('Failed to load font resource from CDN'));
    };

    // 添加到DOM
    document.head.appendChild(script);
  });
}

/**
 * 初始化PDF字体（结合vxe-table-plugin-export-pdf的字体格式）
 * @param pdf - jsPDF实例
 * @param fontName - 字体名称（默认：SourceHanSans）
 */
export function initPdfFont(pdf: any, fontName: string = 'SourceHanSans'): void {
  // 检查字体是否已加载（source-han-sans-normal.js会暴露全局变量）
  if (window[`${fontName}Normal`]) {
    // 注册字体
    pdf.addFileToVFS(`${fontName}-normal.ttf`, window[`${fontName}Normal`]);
    pdf.addFont(`${fontName}-normal.ttf`, fontName, 'normal');

    // 设置默认字体
    pdf.setFont(fontName, 'normal');
  } else {
    console.warn('字体资源未加载，请确保CDN已正确加载');
  }
}

// 类型声明（解决TypeScript类型检查）
declare global {
  interface Window {
    SourceHanSansCNNormal?: string;
  }
}
