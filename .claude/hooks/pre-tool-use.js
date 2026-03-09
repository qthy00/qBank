#!/usr/bin/env node
/**
 * PreToolUse Hook: 工具使用触发
 * 功能：
 * 1. 阻止危险命令
 * 2. 提醒敏感操作
 * 3. 自动修正常见错误
 */

const fs = require('fs');

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

// 危险命令模式
const DANGEROUS_PATTERNS = [
    // 删除操作
    { pattern: /rm\s+-rf\s+\//, message: '⚠️ 检测到危险命令: 尝试删除根目录', level: 'block' },
    { pattern: /rm\s+-rf\s+~/, message: '⚠️ 检测到危险命令: 尝试删除用户主目录', level: 'block' },
    { pattern: /rm\s+-rf\s+\*/, message: '⚠️ 检测到危险命令: 尝试删除当前目录所有文件', level: 'warn' },
    { pattern: /rm\s+-rf\s+\.git/, message: '⚠️ 检测到危险命令: 尝试删除.git目录', level: 'block' },

    // 数据库操作
    { pattern: /DROP\s+(DATABASE|TABLE)\s+/i, message: '⚠️ 检测到敏感操作: 删除数据库/表', level: 'warn' },
    { pattern: /DELETE\s+FROM\s+\w+\s+WHERE\s+1\s*=\s*1/i, message: '⚠️ 检测到危险操作: 无条件删除所有数据', level: 'warn' },

    // 系统操作
    { pattern: /:>\s*\w+/, message: '⚠️ 检测到危险操作: 清空文件', level: 'warn' },
    { pattern: /dd\s+if=.*of=\/(dev|disk)/, message: '⚠️ 检测到危险命令: 直接操作磁盘设备', level: 'block' },
    { pattern: /mkfs\.[a-z]+\s+\//, message: '⚠️ 检测到危险命令: 格式化文件系统', level: 'block' },

    // Git危险操作
    { pattern: /git\s+push\s+.*--force/, message: '⚠️ 检测到敏感操作: 强制推送', level: 'warn' },
    { pattern: /git\s+reset\s+--hard/, message: '⚠️ 检测到危险操作: 硬重置', level: 'warn' },
    { pattern: /git\s+clean\s+-f/, message: '⚠️ 检测到危险操作: 强制清理未跟踪文件', level: 'warn' },

    // 权限操作
    { pattern: /chmod\s+-R\s+777/, message: '⚠️ 检测到敏感操作: 递归设置777权限', level: 'warn' },
    { pattern: /chown\s+-R\s+root/, message: '⚠️ 检测到敏感操作: 递归更改所有者为root', level: 'warn' }
];

// 常见错误自动修正
const AUTO_FIXES = [
    // Git命令修正
    { pattern: /^git\s+add\s+\.$/, fix: 'git add -A', reason: '使用 -A 代替 . 以包含删除操作' },
    { pattern: /^npm\s+install\s+([^\s]+)@latest$/, fix: 'npm install $1@latest --save', reason: '添加 --save 保存依赖' },

    // 路径修正
    { pattern: /^(cd|ls|cat|rm)\s+~\//, fix: null, reason: '请使用绝对路径而非 ~' },

    // 常见拼写错误
    { pattern: /^gir\s+/, fix: 'git ', reason: '修正 "gir" 为 "git"' },
    { pattern: /^got\s+/, fix: 'git ', reason: '修正 "got" 为 "git"' },
    { pattern: /^npm\s+instal\s/, fix: 'npm install ', reason: '修正拼写错误' },

    // 安全修正
    { pattern: /curl\s+[^|]+\s*\|\s*bash/, fix: null, reason: '避免直接执行下载的脚本，请先检查内容' },
    { pattern: /wget\s+[^;]+\s*;\s*bash/, fix: null, reason: '避免直接执行下载的脚本，请先检查内容' }
];

// 检查危险命令
function checkDangerousCommand(toolName, toolInput) {
    const fullCommand = `${toolName} ${JSON.stringify(toolInput)}`;

    for (const {pattern, message, level} of DANGEROUS_PATTERNS) {
        if (pattern.test(fullCommand)) {
            return { dangerous: true, message, level };
        }
    }

    return { dangerous: false };
}

// 尝试自动修正
function tryAutoFix(toolName, toolInput) {
    if (toolName !== 'Bash') return null;

    const command = toolInput.command;
    if (!command) return null;

    for (const {pattern, fix, reason} of AUTO_FIXES) {
        if (pattern.test(command)) {
            if (fix) {
                const fixedCommand = command.replace(pattern, fix);
                return { canFix: true, original: command, fixed: fixedCommand, reason };
            } else {
                return { canFix: false, reason };
            }
        }
    }

    return null;
}

// 主处理逻辑
function processToolUse(input) {
    const toolName = input.tool;
    const toolInput = input.input || {};

    // 检查危险命令
    const dangerCheck = checkDangerousCommand(toolName, toolInput);
    if (dangerCheck.dangerous) {
        if (dangerCheck.level === 'block') {
            console.error(dangerCheck.message);
            console.log(JSON.stringify({
                continue: false,
                message: dangerCheck.message + '\n\n此操作已被阻止，请谨慎操作。如需继续，请修改命令。'
            }));
            return;
        } else {
            console.error(dangerCheck.message);
        }
    }

    // 尝试自动修正
    const autoFix = tryAutoFix(toolName, toolInput);
    if (autoFix) {
        if (autoFix.canFix) {
            console.error(`🔧 自动修正: ${autoFix.reason}`);
            console.error(`   原命令: ${autoFix.original}`);
            console.error(`   修正后: ${autoFix.fixed}`);

            // 修改输入中的命令
            toolInput.command = autoFix.fixed;
            console.log(JSON.stringify({
                continue: true,
                input: toolInput
            }));
            return;
        } else {
            console.error(`⚠️ 建议: ${autoFix.reason}`);
        }
    }

    // 默认允许继续
    console.log(JSON.stringify({ continue: true }));
}

// 执行主逻辑
processToolUse(input);
