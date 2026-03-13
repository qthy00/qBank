#!/usr/bin/env node
/**
 * SessionStart Hook: 会话启动时自动加载项目状态
 * 功能：检查并加载项目进度、Git状态、待办事项
 */

import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();

// 辅助函数，安全执行命令
function safeExec(command) {
    try {
        return execSync(command, {encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe']}).trim();
    } catch {
        return null;
    }
}

// 辅助函数，读取文件
function readFile(filePath) {
    try{
        return fs.readFileSync(filePath, 'utf8');
    }catch{
        return null;
    }
}

// 收集项目状态信息
function collectProjectStatus() {
    const status = {
        git: {},
        todos: [],
        lastSession: null
    };

    // 获取Git状态
    const gitBranch = safeExec('git branch --show-current');
    if (gitBranch) {
        status.git.branch = gitBranch;
        status.git.status = safeExec('git status --short');
        status.git.lastCommit = safeExec('git log -1 --format="%h %s"');
        status.git.unpushed = safeExec('git log --branches --not --remotes --oneline');
    }

    // 检查TODO文件
    const todoPaths = [
        path.join(projectRoot, 'TODO.md'),
        path.join(projectRoot, 'todo.md'),
        path.join(projectRoot, '.claude', 'TODO.md'),
        path.join(projectRoot, 'tasks.md')
    ];

    for (const todoPath of todoPaths) {
        const content = readFile(todoPath);
        if (content) {
            // 提取未完成的待办项
            const lines = content.split('\n');
            for (const line of lines) {
                if (line.match(/^[-*]\s*\[?\s?\]?/) && !line.includes('[x]')) {
                    status.todos.push(line.trim());
                }
            }
            break;
        }
    }

    // 检查上次会话记录
    const sessionLogPath = path.join(projectRoot, '.claude', 'session-log.md');
    const sessionLog = readFile(sessionLogPath);
    if (sessionLog) {
        const lines = sessionLog.split('\n').filter(l => l.trim());
        status.lastSession = lines.slice(-5).join('\n');
    }

    return status;
}

// 生成会话启动消息
function generateStartupMessage(status) {
    const messages = [];

    // Git状态
    if (status.git.branch) {
        messages.push(`📍 当前分支: ${status.git.branch}`);

        if (status.git.lastCommit) {
            messages.push(`📝 最新提交: ${status.git.lastCommit}`);
        }

        if (status.git.status) {
            const changedFiles = status.git.status.split('\n').length;
            messages.push(`🔄 工作区: ${changedFiles} 个文件有更改`);
        }

        if (status.git.unpushed) {
            const unpushedCount = status.git.unpushed.split('\n').length;
            messages.push(`⬆️  有 ${unpushedCount} 个提交未推送`);
        }
    }

    // 待办事项
    if (status.todos.length > 0) {
        messages.push(`\n📋 待办事项 (${Math.min(status.todos.length, 5)}项):`);
        status.todos.slice(0, 5).forEach(todo => {
            messages.push(`   ${todo}`);
        });
    }

    // 上次会话
    if (status.lastSession) {
        messages.push(`\n📌 上次会话记录:`);
        messages.push(status.lastSession);
    }

    return messages.join('\n');
}

// 主函数
function main() {
    const status = collectProjectStatus();
    const message = generateStartupMessage(status);

    // 输出到stderr，这样Claude可以看到但不影响stdin
    if (message) {
        console.error('\n' + '='.repeat(50));
        console.error('🚀 项目状态概览');
        console.error('='.repeat(50));
        console.error(message);
        console.error('='.repeat(50) + '\n');
    }
}

console.log('============== session-start 钩子开始执行 =================')
main();
process.exit(0);
