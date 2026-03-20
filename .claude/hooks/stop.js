#!/usr/bin/env node
/**
 * Stop Hook: Claude回答结束时触发
 * 功能：
 * 1. 检查代码变更
 * 2. 提醒更新项目文档
 * 3. 建议下一步操作
 *
 * 支持项目类型：
 * - Java 后端项目
 * - Nuxt 前端项目（学次元在线题库）
 * - UniApp 移动端项目
 */

import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';

// 从stdin读取用户输入
let inputData = '';
try {
    inputData = fs.readFileSync(0, 'utf8');
}catch{
    console.log(JSON.stringify({continue: true}));
    process.exit(0)
}

let input;
try {
    input = JSON.parse(inputData);
} catch {
    process.exit(0)
}

// 辅助函数，安全执行命令
function safeExec(command) {
    try {
        return execSync(command, {encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe']}).trim();
    } catch {
        return null;
    }
}

// 检查是否有代码变更
const changedFiles = safeExec('git diff --name-only');
const stagedFiles = safeExec('git diff --cached --name-only');
const untrackedFiles = safeExec('git ls-files --others --exclude-standard');

const allChaneges = [
    ...(changedFiles ? changedFiles.split('\n') : []),
    ...(stagedFiles ? stagedFiles.split('\n') : []),
    ...(untrackedFiles ? untrackedFiles.split('\n') : [])
].filter(f => f);

// 清理可能误创建的nul文件（Windows下 > nul 可能创建该文件）
// 递归查找并删除项目下所有nul文件
const findAndDeleteNul= (dir, depth = 0) => {
    if(depth > 5) return; // 限制递归深度，避免误删
    try{
        const entries = fs.readdirSync(dir, {withFileTypes: true});
        for(const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if(entry.isFile() && entry.name.toLowerCase() === 'nul') {
                fs.unlinkSync(fullPath);
                console.error(`🧹已清理: ${fullPath}`);
            }else if(entry.isDirectory() && entry.name.startsWith('.') && entry.name !== 'node_modules') {
                findAndDeleteNul(fullPath, depth + 1);
            }
        }
    }catch{
        // 无权限访问某些目录，忽略错误继续
    }
}
findAndDeleteNul(process.cwd());

// 播放完成提示音（无论是否有变更都播放）
const audioFile = path.join(process.cwd(),'.claude','audio', 'completed.mp3');
try{
    if(fs.existsSync(audioFile)){
        const platform = process.platform;
        if (platform === 'win32') {
            // Windows - 使用 wmplayer 或 PowerShell 的 Windows Media Player 播放 MP3
            try {
                // 使用 Windows Media Player COM 对象播放 MP3
                execSync(`Add-Type -AssemblyName PresentationCore; $p=New-Object System.Windows.Media.MediaPlayer; $p.Open('${audioFile.replace(/'/g, "''")}'); $p.Play(); Read-Host`,
                    {stdio: ['pipe','pipe','pipe'], timeout: 5000});
            } catch {
                // 备选：使用 start 命令调用默认播放器（异步，可能听不到）
                // execSync(`start "" "${audioFile}"`, {stdio: ['pipe','pipe','pipe']});
            }
        } else if (platform === 'darwin') {
            // macOS
            execSync(`afplay "${audioFile}"`, {stdio: ['pipe','pipe','pipe']});
        } else if (platform === 'linux') {
            // Linux，尝试使用多种播放器
            try{
                execSync(`aplay "${audioFile}"`, {stdio: ['pipe','pipe','pipe']});
            }catch{
                try{
                    execSync(`paplay "${audioFile}"`, {stdio: ['pipe','pipe','pipe']});
                }catch{
                    // 无法播放音频,静默忽略
                }
            }
        }
    }
}catch{
    // 无法播放音频,静默忽略
}

if(allChaneges.length === 0) {
    console.log('✅ 没有检测到代码变更。');
    process.exit(0);
}

// ==================== Nuxt 项目检测 ====================

// 检测是否为 Nuxt 项目
const isNuxtProject = () => {
    const nuxtConfigFiles = ['nuxt.config.ts', 'nuxt.config.js', 'nuxt.config.mjs'];
    return nuxtConfigFiles.some(file => fs.existsSync(path.join(process.cwd(), file)));
};

// 检测是否为 UniApp 项目
const isUniAppProject = () => {
    return fs.existsSync(path.join(process.cwd(), 'manifest.json')) &&
           fs.existsSync(path.join(process.cwd(), 'pages.json'));
};

// 分析变更类型
const javaFiles = allChaneges.filter(file => file.endsWith('.java'));
const sqlFiles = allChaneges.filter(file => file.endsWith('.sql'));
const vueFiles = allChaneges.filter(file => file.endsWith('.vue'));
const tsFiles = allChaneges.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
const scssFiles = allChaneges.filter(file => file.endsWith('.scss') || file.endsWith('.css'));
const docFiles = allChaneges.filter(file => file.endsWith('.md'));

let suggestions = [];
const isNuxt = isNuxtProject();
const isUniApp = isUniAppProject();

// ==================== Java 后端项目 ====================
if (javaFiles.length > 0) {
    suggestions.push('- 使用 `@code-reviewer` 审查后端代码');
    // 检查是否有新增的业务模块
    const newModules = javaFiles.filter(file => file.includes('ServiceImpl') && !file.includes('test'));
    if (newModules.length > 0) {
        suggestions.push('- 新增了 Service，记得更新项目文档');
    }
}

// ==================== SQL 变更 ====================
if(sqlFiles.length > 0) {
    suggestions.push('- SQL 文件有变更：确保更新所有数据库脚本（MySQL/Oracle/PostgreSQL/SQLServer）');
}

// ==================== Nuxt 项目特定检测 ====================
if (isNuxt) {
    // 页面变更
    const pageFiles = vueFiles.filter(file => file.includes('app/pages/'));
    if (pageFiles.length > 0) {
        suggestions.push(`- 📄 新增/修改页面 (${pageFiles.length}个)：检查路由配置和页面导航`);
        // 检测新增页面
        const newPages = pageFiles.filter(file => file.includes('[id]') || file.includes('index.vue'));
        if (newPages.length > 0) {
            suggestions.push('  - 包含动态路由页面，确认类型定义已更新');
        }
    }

    // 组件变更
    const componentFiles = vueFiles.filter(file => file.includes('app/components/'));
    if (componentFiles.length > 0) {
        suggestions.push(`- 🧩 新增/修改组件 (${componentFiles.length}个)：检查组件 Props/Emits 定义`);
    }

    // API 接口变更
    const apiFiles = tsFiles.filter(file => file.includes('app/api/'));
    if (apiFiles.length > 0) {
        suggestions.push(`- 🔌 API 接口变更 (${apiFiles.length}个)：检查接口文档和类型定义`);
        // 检测新增 API 模块
        const newApiModules = apiFiles.filter(file =>
            file.includes('/api/') &&
            !file.includes('/index.ts') &&
            !file.includes('/type')
        );
        if (newApiModules.length > 0) {
            suggestions.push('  - 新增 API 模块，记得在 types/ 目录添加类型定义');
        }
    }

    // Composables 变更
    const composableFiles = tsFiles.filter(file => file.includes('app/composables/'));
    if (composableFiles.length > 0) {
        suggestions.push(`- 🔧 Composables 变更 (${composableFiles.length}个)：确保自动导入配置正确`);
    }

    // Stores 变更
    const storeFiles = tsFiles.filter(file => file.includes('app/stores/'));
    if (storeFiles.length > 0) {
        suggestions.push(`- 🏪 Store 状态管理变更 (${storeFiles.length}个)：检查持久化配置`);
    }

    // 类型定义变更
    const typeFiles = tsFiles.filter(file => file.includes('app/types/'));
    if (typeFiles.length > 0) {
        suggestions.push(`- 📐 类型定义变更 (${typeFiles.length}个)：确保导出和使用正确`);
    }

    // 样式文件变更
    if (scssFiles.length > 0) {
        suggestions.push(`- 🎨 样式文件变更 (${scssFiles.length}个)：检查 UnoCSS 和 SCSS 语法`);
    }

    // 项目文档变更
    const docsFiles = docFiles.filter(file => file.includes('docs/'));
    if (docsFiles.length > 0) {
        suggestions.push(`- 📝 项目文档更新 (${docsFiles.length}个)：运行 /update-status 同步状态`);
    }

    // Hook 配置变更
    const hookFiles = allChaneges.filter(file => file.includes('.claude/hooks/'));
    if (hookFiles.length > 0) {
        suggestions.push(`- ⚙️ Hook 配置变更 (${hookFiles.length}个)：测试钩子是否正常工作`);
    }
}

// ==================== UniApp 项目特定检测 ====================
if (isUniApp) {
    const pcFiles = [...vueFiles, ...tsFiles].filter(file => file.includes('plus-ui'));
    const mobileFiles = [...vueFiles, ...tsFiles].filter(file => file.includes('plus-uniapp'));

    if(pcFiles.length > 0) {
        suggestions.push('- PC端代码有变更：确保使用A* 组件');
    }
    if(mobileFiles.length > 0) {
        suggestions.push('- 移动端代码有变更：确保使用wd-* 组件');
    }
}

// ==================== 通用建议 ====================

// 新增文件较多时提醒提交
if (allChaneges.length >= 5) {
    suggestions.push(`- 📦 变更文件较多 (${allChaneges.length}个)，建议及时提交代码`);
}

// 文档和代码同时变更时提醒同步
if (docFiles.length > 0 && (vueFiles.length > 0 || tsFiles.length > 0)) {
    suggestions.push('- 📋 代码和文档同时变更：确保文档与实际实现一致');
}

// 配置文件变更提醒重启
const configFiles = allChaneges.filter(file =>
    file.endsWith('.config.ts') ||
    file.endsWith('.config.js') ||
    file === 'package.json' ||
    file === 'tsconfig.json'
);
if (configFiles.length > 0) {
    suggestions.push('- ⚠️ 配置文件变更：可能需要重启开发服务器');
}

// ==================== 输出提醒 ====================
if(suggestions.length > 0) {
    const output = {
        systemMessage: `\n---\n✅ **任务完成** ｜ 检测到 ${allChaneges.length} 个文件变更\n\n🔔 **操作建议**：\n${suggestions.join('\n')}\n\n📌 **注意**：请务必按照建议操作，保持项目质量和文档更新\n---\n`,
    }
    console.log(JSON.stringify(output));
} else {
    // 即使没有特定建议，也输出变更统计
    console.log(JSON.stringify({
        systemMessage: `\n---\n✅ **任务完成** ｜ 检测到 ${allChaneges.length} 个文件变更\n---\n`
    }));
}

process.exit(0);