# 预发布环境部署报告

**部署时间**: 2026-03-28 15:40
**部署环境**: staging（预发布）
**部署方式**: deploy.sh 脚本
**Git分支**: develop

---

## 部署概览

| 项目 | 状态 | 说明 |
|------|------|------|
| **环境配置** | ✅ 成功 | `.env.staging` 已创建 |
| **依赖安装** | ✅ 成功 | pnpm install 完成 |
| **单元测试** | ✅ 通过 | 76个测试全部通过 |
| **构建** | ✅ 成功 | .output/ 目录生成 |
| **打包** | ✅ 成功 | 构建包已生成 |
| **服务器部署** | ⏳ 待执行 | 需配置服务器环境变量 |

---

## 部署详情

### 1. 环境配置

**文件**: `.env.staging`

```env
NODE_ENV=staging
NUXT_PUBLIC_DEV=false
NUXT_BASE_URL=https://staging-api.qthy.cc
NUXT_PUBLIC_UPLOAD_URL=https://staging-api.qthy.cc/app-api/infra/file/upload
NUXT_PUBLIC_DROP_DEBUGGER=true
NUXT_PUBLIC_DROP_CONSOLE=true
VITE_SOURCEMAP=true
VITE_OUT_DIR=dist-staging
```

### 2. 构建结果

| 指标 | 数值 |
|------|------|
| **构建时间** | ~60s |
| **模块数** | 3581 modules |
| **输出大小** | 13M |
| **测试通过率** | 100% (76/76) |

### 3. 构建输出

```
.output/
├── nitro.json          # Nitro配置
├── public/             # 静态资源
└── server/             # 服务端代码
```

---

## 部署步骤执行

```bash
# 执行的命令
./deploy.sh staging build

# 执行流程
[INFO] ========================================
[INFO] 学次元在线题库 - 部署脚本
[INFO] 环境: staging
[INFO] 操作: build
[INFO] ========================================
[SUCCESS] 依赖检查通过
[SUCCESS] 依赖安装完成
[SUCCESS] 单元测试通过 (76 tests)
[WARNING] TypeScript检查失败 (typecheck命令未配置)
[INFO] 开始构建项目 (staging)...
[SUCCESS] 构建完成
[SUCCESS] 所有操作完成!
```

---

## 下一步：服务器部署

### 环境变量配置

在使用 `./deploy.sh staging deploy` 之前，需要配置以下环境变量：

```bash
# 服务器配置
export DEPLOY_HOST="your-staging-server.com"
export DEPLOY_USER="deploy"
export DEPLOY_PATH="/var/www/xcy-qthy-staging"

# 或使用 deploy.sh 参数
./deploy.sh staging deploy
```

### 服务器准备

在目标服务器上执行：

```bash
# 1. 创建部署目录
sudo mkdir -p /var/www/xcy-qthy-staging
sudo chown -R deploy:deploy /var/www/xcy-qthy-staging

# 2. 安装PM2
npm install -g pm2

# 3. 配置SSH密钥
# 将本地 ~/.ssh/id_rsa.pub 添加到服务器 ~/.ssh/authorized_keys
```

### 完整部署命令

```bash
# 方式1: 构建并部署
DEPLOY_HOST=staging.example.com DEPLOY_USER=deploy ./deploy.sh staging build-and-deploy

# 方式2: 分步执行
./deploy.sh staging build
DEPLOY_HOST=staging.example.com ./deploy.sh staging deploy
```

---

## 验证检查清单

部署完成后，验证以下功能：

- [ ] 首页可正常访问
- [ ] 登录/注册功能正常
- [ ] API接口连通性
- [ ] 静态资源加载正常
- [ ] 无控制台错误

---

## 相关文件

- **部署脚本**: `deploy.sh`
- **环境配置**: `.env.staging`
- **构建输出**: `.output/`
- **部署包**: `xcy-qthy_staging_*.tar.gz`
- **任务文档**: `docs/tasks/active/task-20260327-testing-deployment.md`

---

*报告生成时间: 2026-03-28*
