#!/bin/bash

# =============================================================================
# 学次元在线题库 - 部署脚本
# =============================================================================
# 使用方法:
#   ./deploy.sh [环境] [操作]
#
# 参数:
#   环境: production | staging (默认: production)
#   操作: build | deploy | build-and-deploy (默认: build-and-deploy)
#
# 示例:
#   ./deploy.sh                    # 构建并部署到生产环境
#   ./deploy.sh production build   # 仅构建生产环境
#   ./deploy.sh staging deploy     # 仅部署到预发布环境
# =============================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认配置
ENVIRONMENT=${1:-production}
ACTION=${2:-build-and-deploy}
PROJECT_NAME="xcy-qthy"

# 根据环境设置配置
if [ "$ENVIRONMENT" = "production" ]; then
    DEPLOY_HOST="${DEPLOY_HOST:-your-production-host.com}"
    DEPLOY_USER="${DEPLOY_USER:-deploy}"
    DEPLOY_PATH="${DEPLOY_PATH:-/var/www/xcy-qthy}"
    ENV_FILE=".env.production"
    PM2_NAME="${PROJECT_NAME}-prod"
elif [ "$ENVIRONMENT" = "staging" ]; then
    DEPLOY_HOST="${DEPLOY_HOST:-your-staging-host.com}"
    DEPLOY_USER="${DEPLOY_USER:-deploy}"
    DEPLOY_PATH="${DEPLOY_PATH:-/var/www/xcy-qthy-staging}"
    ENV_FILE=".env.staging"
    PM2_NAME="${PROJECT_NAME}-staging"
else
    echo -e "${RED}错误: 未知环境 '$ENVIRONMENT'${NC}"
    echo "可用环境: production | staging"
    exit 1
fi

# 打印信息函数
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    print_info "检查依赖..."

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "未安装 Node.js"
        exit 1
    fi

    # 检查 pnpm
    if ! command -v pnpm &> /dev/null; then
        print_error "未安装 pnpm"
        print_info "安装方法: npm install -g pnpm"
        exit 1
    fi

    # 检查环境文件
    if [ ! -f "$ENV_FILE" ]; then
        print_error "环境文件不存在: $ENV_FILE"
        exit 1
    fi

    print_success "依赖检查通过"
}

# 安装依赖
install_deps() {
    print_info "安装依赖..."
    pnpm install --frozen-lockfile
    print_success "依赖安装完成"
}

# 运行测试
run_tests() {
    print_info "运行测试..."

    # 运行单元测试
    if pnpm test:unit 2>/dev/null; then
        print_success "单元测试通过"
    else
        print_warning "单元测试失败或没有配置"
    fi

    # 检查TypeScript
    if pnpm typecheck 2>/dev/null; then
        print_success "TypeScript检查通过"
    else
        print_warning "TypeScript检查失败"
    fi
}

# 构建项目
build_project() {
    print_info "开始构建项目 ($ENVIRONMENT)..."

    # 加载环境变量
    export $(grep -v '^#' "$ENV_FILE" | xargs)

    # 清理旧的构建
    if [ -d ".output" ]; then
        print_info "清理旧的构建..."
        rm -rf .output
    fi

    # 执行构建
    if ! pnpm build; then
        print_error "构建失败"
        exit 1
    fi

    print_success "构建完成"

    # 显示构建信息
    if [ -d ".output" ]; then
        OUTPUT_SIZE=$(du -sh .output | cut -f1)
        print_info "构建输出大小: $OUTPUT_SIZE"
    fi
}

# 打包构建
package_build() {
    print_info "打包构建..."

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    PACKAGE_NAME="${PROJECT_NAME}_${ENVIRONMENT}_${TIMESTAMP}.tar.gz"

    tar -czf "$PACKAGE_NAME" -C .output .

    print_success "打包完成: $PACKAGE_NAME"
    echo "$PACKAGE_NAME"
}

# 部署到服务器
deploy_to_server() {
    print_info "部署到 $ENVIRONMENT 服务器..."

    # 检查SSH配置
    if [ -z "$DEPLOY_HOST" ] || [ "$DEPLOY_HOST" = "your-production-host.com" ]; then
        print_warning "未配置部署服务器"
        print_info "请设置环境变量: DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH"
        print_info "或通过参数传递: ./deploy.sh production build-and-deploy"
        return 1
    fi

    PACKAGE_NAME=$1

    # 上传文件
    print_info "上传文件到服务器..."
    scp "$PACKAGE_NAME" "${DEPLOY_USER}@${DEPLOY_HOST}:/tmp/"

    # 执行远程部署
    print_info "执行远程部署..."
    ssh "${DEPLOY_USER}@${DEPLOY_HOST}" << EOF
        set -e

        echo "备份当前版本..."
        if [ -d "$DEPLOY_PATH" ]; then
            BACKUP_NAME="${DEPLOY_PATH}_backup_$(date +%Y%m%d_%H%M%S)"
            cp -r "$DEPLOY_PATH" "\$BACKUP_NAME"
        fi

        echo "解压新版本..."
        rm -rf "$DEPLOY_PATH"
        mkdir -p "$DEPLOY_PATH"
        tar -xzf "/tmp/$PACKAGE_NAME" -C "$DEPLOY_PATH"

        echo "安装生产依赖..."
        cd "$DEPLOY_PATH"
        if [ -f "package.json" ]; then
            pnpm install --production
        fi

        echo "重启服务..."
        pm2 restart "$PM2_NAME" || pm2 start .output/server/index.mjs --name "$PM2_NAME"

        echo "清理临时文件..."
        rm -f "/tmp/$PACKAGE_NAME"

        echo "部署完成!"
EOF

    print_success "部署完成"
}

# 清理本地文件
cleanup() {
    print_info "清理本地临时文件..."
    rm -f "${PROJECT_NAME}"_*.tar.gz
    print_success "清理完成"
}

# 显示使用帮助
show_help() {
    cat << EOF
学次元在线题库 - 部署脚本

使用方法:
  ./deploy.sh [环境] [操作]

参数:
  环境:
    production    生产环境 (默认)
    staging       预发布环境

  操作:
    build              仅构建
    deploy             仅部署 (需先构建)
    build-and-deploy   构建并部署 (默认)

环境变量:
  DEPLOY_HOST    部署服务器地址
  DEPLOY_USER    部署用户
  DEPLOY_PATH    部署路径

示例:
  ./deploy.sh                    # 构建并部署到生产环境
  ./deploy.sh production build   # 仅构建生产环境
  ./deploy.sh staging deploy     # 仅部署到预发布环境
  DEPLOY_HOST=server.com ./deploy.sh production  # 指定服务器

EOF
}

# 主函数
main() {
    # 显示帮助
    if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
        show_help
        exit 0
    fi

    print_info "========================================"
    print_info "学次元在线题库 - 部署脚本"
    print_info "环境: $ENVIRONMENT"
    print_info "操作: $ACTION"
    print_info "========================================"

    # 检查是否在项目根目录
    if [ ! -f "package.json" ]; then
        print_error "请在项目根目录运行此脚本"
        exit 1
    fi

    # 执行操作
    case "$ACTION" in
        build)
            check_dependencies
            install_deps
            run_tests
            build_project
            ;;
        deploy)
            PACKAGE=$(ls -t "${PROJECT_NAME}_${ENVIRONMENT}"_*.tar.gz 2>/dev/null | head -1)
            if [ -z "$PACKAGE" ]; then
                print_error "未找到构建包，请先运行: ./deploy.sh $ENVIRONMENT build"
                exit 1
            fi
            deploy_to_server "$PACKAGE"
            ;;
        build-and-deploy)
            check_dependencies
            install_deps
            run_tests
            build_project
            PACKAGE=$(package_build)
            deploy_to_server "$PACKAGE"
            cleanup
            ;;
        *)
            print_error "未知操作: $ACTION"
            show_help
            exit 1
            ;;
    esac

    print_success "========================================"
    print_success "所有操作完成!"
    print_success "========================================"
}

# 运行主函数
main "$@"
