# GitHub Actions 部署指南

本文档介绍如何使用 GitHub Actions 自动化部署学次元在线题库项目。

## 工作流文件

**文件位置**: `.github/workflows/deploy.yml`

## 触发方式

### 1. 手动触发（推荐）

1. 进入 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 选择 **Deploy to Production** 工作流
4. 点击 **Run workflow**
5. 选择环境（production/staging）
6. 点击 **Run workflow**

### 2. Release 触发

创建 Release 时会自动触发部署到生产环境：

```bash
# 创建新标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 然后在 GitHub 上创建 Release
```

## 配置 Secrets

在 GitHub 仓库中配置以下 Secrets：

### 必需 Secrets

| Secret | 说明 | 示例 |
|--------|------|------|
| `PRODUCTION_HOST` | 生产服务器地址 | `192.168.1.100` |
| `PRODUCTION_USER` | 生产服务器用户 | `deploy` |
| `STAGING_HOST` | 预发布服务器地址 | `192.168.1.101` |
| `STAGING_USER` | 预发布服务器用户 | `deploy` |
| `SSH_PRIVATE_KEY` | SSH 私钥（用于部署） | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### 可选 Secrets

| Secret | 说明 |
|--------|------|
| `SLACK_WEBHOOK_URL` | Slack 通知 Webhook |

## SSH 密钥配置

### 生成部署密钥

```bash
# 在本地生成密钥对
ssh-keygen -t ed25519 -C "github-actions-deploy" -f deploy_key

# 将公钥添加到服务器 authorized_keys
cat deploy_key.pub >> ~/.ssh/authorized_keys

# 将私钥内容添加到 GitHub Secrets
cat deploy_key
```

### 添加公钥到服务器

```bash
# 在服务器上
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
<粘贴公钥内容>
EOF
chmod 600 ~/.ssh/authorized_keys
```

## 服务器准备

### 1. 安装 Node.js 和 PM2

```bash
# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 安装 pnpm
npm install -g pnpm
```

### 2. 创建部署目录

```bash
# 创建目录
sudo mkdir -p /var/www/xcy-qthy
sudo mkdir -p /var/www/xcy-qthy-staging

# 设置权限
sudo chown -R deploy:deploy /var/www/xcy-qthy
sudo chown -R deploy:deploy /var/www/xcy-qthy-staging
```

### 3. 配置 PM2

```bash
# 启动应用
pm2 start /var/www/xcy-qthy/server/index.mjs --name xcy-qthy-prod

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

## 部署流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Trigger   │────▶│    Build    │────▶│    Deploy   │────▶│   Restart   │
│             │     │             │     │             │     │             │
│ - Manual    │     │ - Install   │     │ - Backup    │     │ - PM2       │
│ - Release   │     │ - Test      │     │ - Transfer  │     │ - Notify    │
│             │     │ - Build     │     │ - Extract   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## 故障排查

### 构建失败

1. 检查 `package.json` 是否存在
2. 检查依赖是否正确安装
3. 检查类型检查是否通过

### 部署失败

1. 检查 Secrets 配置是否正确
2. 检查 SSH 密钥是否正确配置
3. 检查服务器目录权限
4. 检查 PM2 是否已安装

### 服务无法启动

1. 检查端口是否被占用
2. 检查环境变量是否正确
3. 查看 PM2 日志：`pm2 logs xcy-qthy-prod`

## 安全建议

1. **使用专用部署用户**，避免使用 root
2. **限制 SSH 密钥权限**，仅用于部署
3. **启用分支保护**，防止直接推送
4. **配置部署审核**，生产环境需要人工确认
5. **定期轮换密钥**，增强安全性

## 相关文件

- **工作流**: `.github/workflows/deploy.yml`
- **部署脚本**: `deploy.sh`
- **生产配置**: `.env.production`
- **预发布配置**: `.env.staging`

---

*文档最后更新: 2026-03-28*
