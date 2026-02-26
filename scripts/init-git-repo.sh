#!/bin/bash

# Git仓库初始化脚本
# 用途：首次初始化SCMS项目的Git仓库
# 使用：bash scripts/init-git-repo.sh <仓库地址>

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印函数
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查参数
if [ $# -eq 0 ]; then
    print_error "请提供Git仓库地址"
    echo "用法: $0 <Git仓库地址>"
    echo "示例: $0 https://github.com/username/scms-project.git"
    exit 1
fi

GIT_REPO_URL=$1

print_info "开始初始化Git仓库..."
print_info "仓库地址: $GIT_REPO_URL"
echo ""

# 1. 配置Git用户信息
print_info "1. 配置Git用户信息..."
git config --global user.name "SCMS Deploy AI"
git config --global user.email "deploy@scms.com"
print_success "Git用户信息配置完成"
echo ""

# 2. 初始化仓库
print_info "2. 初始化Git仓库..."
if [ -d ".git" ]; then
    print_info "已存在.git目录，跳过初始化"
else
    git init
    print_success "Git仓库初始化完成"
fi
echo ""

# 3. 创建.gitignore文件
print_info "3. 创建.gitignore文件..."
cat > .gitignore << 'EOF'
# 编译输出
target/
dist/
out/
build/
*.class
*.jar
*.war

# 依赖目录
node_modules/
dependencies/

# IDE配置
.idea/
.vscode/
*.iml
*.swp
*.swo
.DS_Store

# 日志文件
logs/
*.log
*.log.*

# 临时文件
*.tmp
*.temp
*.bak
*.cache

# 敏感信息（不要提交到Git）
application-prod.yml
.env
.env.local
.env.production
*.pem
*.key
*.p12
*.jks

# 数据库备份
*.sql
*.dump
*.backup

# 测试覆盖率
coverage/
.nyc_output/

# 打包文件
*.tar.gz
*.zip
*.7z
EOF
print_success ".gitignore文件创建完成"
echo ""

# 4. 添加所有文件
print_info "4. 添加文件到暂存区..."
git add .
print_success "文件添加完成"
echo ""

# 5. 创建初始提交
print_info "5. 创建初始提交..."
COMMIT_MSG="chore: 初始化SCMS项目代码库

- 项目名称: 施工综合管理系统(SCMS)
- 技术栈: Spring Boot 3.x + Vue 3.x
- 数据库: PostgreSQL
- 服务器: Ubuntu 24.04 LTS"

if git diff --staged --quiet; then
    print_info "没有需要提交的文件，跳过提交"
else
    git commit -m "$COMMIT_MSG"
    print_success "初始提交创建完成"
fi
echo ""

# 6. 添加远程仓库
print_info "6. 添加远程仓库..."
if git remote get-url origin &>/dev/null; then
    print_info "已存在远程仓库origin，更新URL"
    git remote set-url origin $GIT_REPO_URL
else
    git remote add origin $GIT_REPO_URL
fi
print_success "远程仓库配置完成"
echo ""

# 7. 推送到远程仓库
print_info "7. 推送到远程仓库..."
echo "这可能需要几分钟，请稍候..."
git push -u origin main || {
    print_error "推送失败！请检查："
    echo "1. 仓库地址是否正确: $GIT_REPO_URL"
    echo "2. 是否有仓库访问权限"
    echo "3. 网络连接是否正常"
    echo ""
    echo "手动执行以下命令："
    echo "  git push -u origin main"
    exit 1
}
print_success "代码推送成功"
echo ""

# 8. 验证
print_info "8. 验证仓库配置..."
git remote -v
echo ""
git log -1 --pretty=format:"%h - %s (%cd)"
echo ""
print_success "Git仓库初始化完成！"

# 9. 生成初始化报告
cat > git-init-report.txt << EOF
================================
Git仓库初始化报告
================================
初始化时间: $(date '+%Y-%m-%d %H:%M:%S')
仓库地址: $GIT_REPO_URL
本地路径: $(pwd)

================================
仓库配置
================================
用户名: $(git config user.name)
邮箱: $(git config user.email)
远程仓库: $(git remote get-url origin)
主分支: $(git rev-parse --abbrev-ref HEAD)

================================
最新提交
================================
$(git log -1 --pretty=format:"提交哈希: %h
提交信息: %s
提交作者: %an
提交时间: %ad")

================================
文件统计
================================
$(git ls-files | wc -l) 个文件已提交

================================
================================

初始化成功！现在可以开始使用Git进行版本控制了。
EOF

print_success "初始化报告已生成: git-init-report.txt"
echo ""

# 10. 显示下一步操作
print_info "下一步操作："
echo ""
echo "开发AI（扣子）的操作："
echo "1. 克隆仓库: git clone $GIT_REPO_URL"
echo "2. 开发代码"
echo "3. 提交代码: git add . && git commit -m '说明' && git push"
echo ""
echo "部署AI（Vibe Coding）的操作："
echo "1. 下载最新代码: git pull"
echo "2. 部署到服务器"
echo "3. 记录部署日志"
echo ""
