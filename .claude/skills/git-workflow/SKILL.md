---
name: git-workflow
description: |
  Git工作流与协作指南。当用户需要进行Git提交、分支管理、代码合并、冲突解决、版本发布、Pull Request等Git操作时提供指导。
  适用于团队协作开发场景。
  触发词：Git、提交、commit、分支、merge、冲突、PR、rebase、版本发布
---

# Git工作流与协作指南

## 何时使用

**适用场景**
- Git提交规范
- 分支管理策略
- 代码合并与冲突解决
- Pull Request流程
- 版本发布管理
- Git命令使用
- 代码回滚

**不适用场景**
- SVN等其他版本控制工具
- 代码编写指导
- 代码审查（见code-review技能）

---

## 分支管理策略

### 1. Git Flow简化版

```
master/main     生产分支（稳定）
    ↑
develop         开发分支（集成）
    ↑
feature/*       功能分支（临时）
hotfix/*        热修复分支（临时）
release/*       发布分支（临时）
```

### 2. 分支命名规范

| 分支类型 | 命名格式 | 示例 |
|---------|---------|------|
| 功能分支 | `feature/功能描述` | `feature/user-profile` |
| 修复分支 | `fix/问题描述` | `fix/login-error` |
| 热修复 | `hotfix/问题描述` | `hotfix/payment-bug` |
| 发布分支 | `release/版本号` | `release/v1.2.0` |

### 3. 分支操作流程

```bash
# 1. 创建功能分支
git checkout -b feature/user-profile

# 2. 开发完成后提交
git add .
git commit -m "feat(user): 添加用户资料页面"

# 3. 推送到远程
git push -u origin feature/user-profile

# 4. 发起PR/MR合并到develop

# 5. 合并后删除本地分支
git branch -d feature/user-profile
```

---

## 常用Git命令

### 1. 基础操作

```bash
# 克隆仓库
git clone <repository-url>

# 查看状态
git status

# 添加文件到暂存区
git add <file>           # 添加指定文件
git add .               # 添加所有修改

# 提交更改
git commit -m "提交信息"
git commit -am "提交信息"  # 添加并提交（仅限已跟踪文件）

# 推送到远程
git push
git push -u origin <branch>  # 首次推送新分支

# 拉取更新
git pull
git pull --rebase           # 使用rebase方式拉取
```

### 2. 分支操作

```bash
# 查看分支
git branch              # 本地分支
git branch -r           # 远程分支
git branch -a           # 所有分支

# 创建分支
git branch <branch-name>                    # 创建分支
git checkout -b <branch-name>               # 创建并切换
git checkout -b <branch-name> origin/main   # 基于远程分支创建

# 切换分支
git checkout <branch-name>
git switch <branch-name>    # 新命令（Git 2.23+）

# 删除分支
git branch -d <branch-name>     # 删除已合并分支
git branch -D <branch-name>     # 强制删除分支

# 合并分支
git checkout main
git merge feature/user-profile
```

### 3. 查看与比较

```bash
# 查看提交历史
git log
git log --oneline           # 简洁模式
git log --graph --oneline   # 图形化显示
git log -10                 # 最近10条

# 查看差异
git diff                    # 工作区vs暂存区
git diff --staged          # 暂存区vs最新提交
git diff HEAD~1            # 与上一次提交比较

# 查看文件修改历史
git log -p <file>
git blame <file>           # 逐行查看作者
```

### 4. 撤销与回退

```bash
# 撤销工作区修改
git checkout -- <file>      # 撤销单个文件
git checkout -- .          # 撤销所有修改

# 撤销暂存区
git reset HEAD <file>       # 取消暂存单个文件
git reset HEAD .           # 取消暂存所有

# 修改最后一次提交
git commit --amend
git commit --amend --no-edit   # 不修改提交信息

# 回退到指定版本
git reset --soft HEAD~1     # 回退到上一版本，保留修改
git reset --hard HEAD~1     # 回退到上一版本，丢弃修改
git revert <commit-id>      # 创建撤销提交（推荐）
```

---

## 提交规范

### 1. 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2. 提交类型

| 类型 | 说明 | 示例 |
|-----|------|------|
| `feat` | 新功能 | `feat(user): 添加用户资料编辑` |
| `fix` | 修复bug | `fix(login): 修复登录失效问题` |
| `docs` | 文档更新 | `docs(readme): 更新安装说明` |
| `style` | 代码格式 | `style: 统一缩进` |
| `refactor` | 重构 | `refactor(api): 重构用户API` |
| `perf` | 性能优化 | `perf(table): 优化表格渲染` |
| `test` | 测试相关 | `test(user): 添加用户测试` |
| `chore` | 构建/工具 | `chore: 升级依赖` |

### 3. 提交示例

```bash
# 简单提交
git commit -m "feat(user): 添加头像上传功能"

# 详细提交
git commit -m "feat(user): 添加头像上传功能

- 集成阿里云OSS直传
- 添加图片压缩和裁剪
- 限制图片格式为jpg/png

Closes #123"
```

---

## 冲突解决

### 1. 冲突场景

```bash
# 场景1：pull时冲突
git pull
# Auto-merging app/pages/user/index.vue
# CONFLICT (content): Merge conflict in app/pages/user/index.vue

# 场景2：merge时冲突
git merge feature/login
# CONFLICT (content): Merge conflict in app/api/user/index.ts
```

### 2. 冲突标记

```typescript
<<<<<<< HEAD
// 当前分支的代码
const name = 'current branch'
=======
// 合并分支的代码
const name = 'merge branch'
>>>>>>> feature/login
```

### 3. 解决步骤

```bash
# 1. 查看冲突文件
git status

# 2. 编辑冲突文件，手动解决冲突
# 删除 <<<<<<< ======= >>>>>>> 标记
# 保留正确的代码

# 3. 标记已解决
git add <resolved-file>

# 4. 继续合并
git commit  # 或 git rebase --continue

# 5. 取消合并（如果需要）
git merge --abort
git rebase --abort
```

### 4. 减少冲突的建议

```bash
# 1. 频繁同步主分支
git checkout main
git pull
git checkout feature/xxx
git merge main

# 2. 小步提交，频繁push

# 3. 使用rebase保持线性历史
git pull --rebase
```

---

## 高级操作

### 1. Rebase操作

```bash
# 变基（将当前分支基于最新main）
git checkout feature/xxx
git rebase main

# 交互式rebase（整理提交）
git rebase -i HEAD~3

# 常用交互命令：
# pick    - 保留提交
# reword  - 修改提交信息
# squash  - 合并到上一个提交
# fixup   - 合并到上一个提交，丢弃信息
# drop    - 删除提交
```

### 2. Cherry-pick

```bash
# 将某个提交应用到当前分支
git cherry-pick <commit-hash>

# 应用多个提交
git cherry-pick <hash1> <hash2>

# 应用连续提交
git cherry-pick <hash1>^..<hash2>
```

### 3. Stash暂存

```bash
# 暂存当前修改
git stash
git stash push -m "描述信息"

# 查看暂存列表
git stash list

# 恢复暂存
git stash pop           # 恢复并删除
git stash apply         # 恢复不删除
git stash apply stash@{0}

# 删除暂存
git stash drop stash@{0}
git stash clear         # 清空所有
```

### 4. 子模块

```bash
# 添加子模块
git submodule add <repository> <path>

# 克隆包含子模块的项目
git clone --recursive <repository>

# 更新子模块
git submodule update --init --recursive
```

---

## 版本发布

### 1. 版本号规范（Semver）

```
版本格式：主版本号.次版本号.修订号
示例：v1.2.3

主版本号：不兼容的API修改
次版本号：向下兼容的功能新增
修订号：向下兼容的问题修复
```

### 2. 发布流程

```bash
# 1. 创建发布分支
git checkout -b release/v1.2.0 develop

# 2. 更新版本号（package.json等）

# 3. 修复bug（如有）
git commit -m "chore: 更新版本号至v1.2.0"

# 4. 合并到main
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

# 5. 合并回develop
git checkout develop
git merge --no-ff release/v1.2.0

# 6. 删除发布分支
git branch -d release/v1.2.0

# 7. 推送标签
git push origin main --tags
```

### 3. 热修复流程

```bash
# 1. 从main创建热修复分支
git checkout -b hotfix/login-error main

# 2. 修复问题并提交
git commit -m "fix(login): 修复登录异常"

# 3. 合并到main和develop
git checkout main
git merge --no-ff hotfix/login-error
git tag -a v1.2.1 -m "Hotfix version 1.2.1"

git checkout develop
git merge --no-ff hotfix/login-error

# 4. 删除分支
git branch -d hotfix/login-error
```

---

## 最佳实践

### 1. 提交前检查清单

```markdown
- [ ] 代码可以正常编译/运行
- [ ] 通过了本地测试
- [ ] 没有提交敏感信息（密码、密钥等）
- [ ] 提交信息符合规范
- [ ] 提交粒度适中（一个提交做一件事）
```

### 2. 分支保护规则

```markdown
- [ ] main分支需要PR才能合并
- [ ] PR需要至少1个Reviewer批准
- [ ] PR需要通过CI检查
- [ ] 禁止强制推送到main
```

### 3. 常用别名配置

```bash
# 编辑 ~/.gitconfig
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --decorate
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
```

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3)
**最后更新**: 2026-03-21
