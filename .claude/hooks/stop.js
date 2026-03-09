#!usr/bin/env node
/**
 * Stop Hook: Claude回答结束时触发
 * 功能：
 * 1. 检查代码变更
 * 2. 提醒更新项目文档
 * 3. 建议下一步操作
 */

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

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
            // Windows
            execSync(`powershell -c "(New-Object Media.SoundPlayer '${audioFile.replace(/'/g, "''")}').PlaySync()"`,
                {stdio: ['pipe','pipe','pipe']});
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

// 分析变更类型
const javaFiles = allChaneges.filter(file => file.endsWith('.java'));
const sqlFiles = allChaneges.filter(file => file.endsWith('.sql'));
const vueFiles = allChaneges.filter(file => file.endsWith('.vue'));
const tsFiles = allChaneges.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
let suggestions = [];

// 后端代码变更
if (javaFiles.length > 0) {
    suggestions.push('- 使用 `@code-reviewer` 审查后端代码');
    // 检查是否有新增的业务模块
    const newModules = javaFiles.filter(file => file.includes('ServiceImpl') && !file.includes('test'));
    if (newModules.length > 0) {
        suggestions.push('- 新增了 Service，记得更新项目文档');
    }
}

// 前端代码变更
if (vueFiles.length > 0 || tsFiles.length > 0) {
    const pcFiles = [...vueFiles, ...tsFiles].filter(file => file.includes('plus-ui'));
    const mobileFiles = [...vueFiles, ...tsFiles].filter(file => file.includes('plus-uniapp'));

    if(pcFiles.length > 0) {
        suggestions.push('- PC端代码有变更：确保使用A* 组件');
    }
    if(mobileFiles.length > 0) {
        suggestions.push('- 移动端代码有变更：确保使用wd-* 组件');
    }
}
// SQL 变更
if(sqlFiles.length > 0) {
    suggestions.push('- SQL 文件有变更：确保更新所有数据库脚本（MySQL/Oracle/PostgreSQL/SQLServer）');
}

// 输出提醒
if(suggestions.length > 0) {
    const output = {
        systemMessage: `\n---\n✅ **任务完成** ｜ 检测到 ${allChaneges.length} 个文件变更\n\n🔔 **操作建议**：\n${suggestions.join('\n')}\n\n📌 **注意**：请务必按照建议操作，保持项目质量和文档更新\n---\n`,
    }
    console.log(JSON.stringify(output));
}

process.exit(0);