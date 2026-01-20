// unocss.config.js
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

console.log('UnoCSS 配置已加载！') // 检查控制台是否输出此日志

export default defineConfig({
  presets: [
    presetUno(), // UnoCSS 核心预设
    presetAttributify(), // 属性化模式支持
    presetIcons({
      scale: 1, // 图标大小缩放比例
      autoInstall: true, // 自动安装缺失的图标包
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  preflights: [
    {
      layer: 'base',
      getCSS: () => `
        :root {
          /* 定义全局 CSS 变量 */
          --color-bg-page: #f6f6f6;
          --color-bg-container: #ffffff;
          --color-bg-container-hover: #f4f7fa;
          --color-text-primary: #2c3e50;
          --color-text-secondary: #7f8c8d;
          --color-text-hover: #3498db;
          --color-btn-text: #ffffff;
          --color-btn-bg-unselected: #dfdfdf;
          --color-btn-primary: #3498db;
          --color-btn-hover: #2980b9;
          --color-border: #bdc3c7;
          --color-shadow: rgba(0, 0, 0, 0.5);
          --color-warning: #e74c3c;
          --color-info: #1abc9c;
          --color-disabled: #ecf0f1;
        
        
          --color-nav-bg: #2e3a4d;
          --color-nav-mask: rgba(46, 58, 77, 0.7);
          --color-nav-text: #f1f5f9;
          --color-nav-text-hover: #60a5fa;
        
        
        
          --color-bqhs-d: #ffe2e2;
          --color-bqhs-z: #fb2c36;
        
          --color-bqls-d: #dbeafe;
          --color-bqls-z: #2b7fff;
        
          --color-bqus-d: #fef9c2;
          --color-bqus-z: #d08700;
        
          --color-bqvs-d: #dcfce7;
          --color-bqvs-z: #00A631;
        
          --color-bqzs-d: #f3e8ff;
          --color-bqzs-z: #9810fa;
        
          --color-bqcs-d: #ffead3;
          --color-bqcs-z: #f64a6d;
          }
      `
    }
  ],
  // // 排除 Element 组件的类名
  safelist: [
    'group-hover:bg-indigo-100',
    'group-hover:text-indigo-700',
    'group-hover:bg-emerald-100',
    'group-hover:text-emerald-700',
    'group-hover:bg-amber-100',
    'group-hover:text-amber-700',
    'bg-indigo-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-indigo-100',
    'bg-emerald-100',
    'bg-amber-100',
    'bg-emerald-50',
    'bg-indigo-50',
    'bg-amber-50',
    'text-indigo-600',
    'text-emerald-600',
    'text-amber-600',
  ],
  theme: {
    colors: {
      primary: '#165DFF', // 默认主色（等同于 primary-500）
      pri: {
        50: '#E8F3FF', // 最浅 - 背景、选中状态
        100: '#C9E0FF', // 浅 - 次要背景、提示
        200: '#A6CBFF', // 中浅 - 未激活元素
        300: '#7EB6FF', // 中 - 悬停状态
        400: '#549BFF', // 中深 - 次要按钮
        500: '#165DFF', // 主色 - 核心按钮、链接
        600: '#0E42D2', // 次深 - 点击状态
        700: '#0A3188', // 深 - 深色文本、图标
        800: '#072B8C', // 更深 - 强调文本
        900: '#051E66', // 最深 - 极少数场景
      },

      // 辅助色（科技感紫色）
      secondary: '#722ED1', // 辅助色 - 用于次要按钮、标签
      sec: {
        50: '#F0E8FF', // 最浅 - 背景
        100: '#D6C4FF', // 浅 - 次要背景
        200: '#B89DFF', // 中浅 - 未激活元素
        300: '#9674FF', // 中 - 悬停状态
        400: '#722ED1', // 中深 - 辅助按钮（与顶层 secondary 相同）
        500: '#5C1DBE', // 主色 - 标签、特殊强调
        600: '#4A1599', // 次深 - 点击状态（与顶层 secondaryHover 相同）
        700: '#3A1078', // 深 - 深色文本
        800: '#2C0C5C', // 更深 - 强调文本
        900: '#1F0840', // 最深 - 极少数场景
      },

      // 功能色
      success: '#00B42A', // 成功色 - 操作成功、验证通过
      warning: '#FF7D00', // 警告色 - 潜在风险、需要注意
      error: '#F53F3F', // 错误色 - 操作失败、验证错误
      info: '#168CFF', // 信息色 - 提示信息、帮助文本
      disabled: '#C9CDD4', // 禁用状态 - 不可用元素

      // 中性色
      neu: {
        50: '#F7F8FA', // 最浅 - 页面背景
        100: '#F2F3F5', // 浅 - 卡片背景
        200: '#E5E6EB', // 中浅 - 分割线
        300: '#C9CDD4', // 中 - 次要边框
        400: '#86909C', // 中深 - 次要文本
        500: '#4E5969', // 深 - 主要文本
        600: '#272E3B', // 更深 - 标题文本
        700: '#1D2129', // 极深 - 深色文本
        800: '#14161D', // 接近黑色 - 强调文本
        900: '#0A0C10', // 黑色 - 极少数场景
      },

      // 特殊用途颜色
      shadow: 'rgba(0, 0, 0, 0.05)', // 阴影色
      overlay: 'rgba(0, 0, 0, 0.4)', // 遮罩层
      transparent: 'transparent', // 透明色
    },

    fontFamily: {
      // 自定义字体
      inter: ['Inter', 'sans-serif'],
    },

    // 配置断点
    breakpoints: {
      // xs: '320px', // 定义 xs 断点为 320px
      sm: '640px', // 保持默认 sm 断点
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  rules: [
    [/^text-\((.*)\)$/, ([, varName]) => ({ color: `var(${varName})` })],
    [/^bg-\((.*)\)$/, ([, varName]) => ({ background: `var(${varName})` })],
    [/^border-\((.*)\)$/, ([, varName]) => ({ 'border-color': `var(${varName})` })],
  ]
})
