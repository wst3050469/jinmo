#!/bin/bash

# Git下载助手脚本
# 用途：帮助部署AI（Vibe Coding）下载最新代码并准备部署
# 使用：bash scripts/git-pull-helper.sh [选项]

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 检查是否在Git仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "当前目录不是Git仓库"
    exit 1
fi

print_info "================================"
print_info "Git下载助手"
print_info "================================"
echo ""

# 1. 记录当前版本
print_info "1. 检查当前版本..."
BEFORE_COMMIT=$(git log -1 --pretty=format:'%h' 2>/dev/null || echo "无")
BEFORE_MESSAGE=$(git log -1 --pretty=format:'%s' 2>/dev/null || echo "无")
print_success "当前版本: $BEFORE_COMMIT"
print_info "当前信息: $BEFORE_MESSAGE"
echo ""

# 2. 查看远程仓库
print_info "2. 检查远程仓库..."
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "未配置")
if [ "$REMOTE_URL" = "未配置" ]; then
    print_error "未配置远程仓库"
    exit 1
fi
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_success "远程仓库: $REMOTE_URL"
print_success "当前分支: $CURRENT_BRANCH"
echo ""

# 3. 检查是否有新的提交
print_info "3. 检查远程更新..."
git fetch origin
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/$CURRENT_BRANCH)

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    print_warning "已经是最新版本，无需更新"
    echo ""
    print_info "当前状态："
    git log -1 --pretty=format:"%h - %s (%cd)"
    exit 0
fi

print_success "发现新的提交"
print_info "本地版本: $LOCAL_COMMIT"
print_info "远程版本: $REMOTE_COMMIT"
echo ""

# 4. 拉取最新代码
print_info "4. 拉取最新代码..."
echo "这可能需要几分钟，请稍候..."
git pull origin $CURRENT_BRANCH
print_success "代码下载成功"
echo ""

# 5. 记录新版本
AFTER_COMMIT=$(git log -1 --pretty=format:'%h')
AFTER_MESSAGE=$(git log -1 --pretty=format:'%s')
AFTER_AUTHOR=$(git log -1 --pretty=format:'%an')
AFTER_DATE=$(git log -1 --pretty=format:'%cd')
print_success "最新版本: $AFTER_COMMIT"
print_info "最新信息: $AFTER_MESSAGE"
echo ""

# 6. 查看变更统计
print_info "5. 查看变更统计..."
CHANGES=$(git log $BEFORE_COMMIT..$AFTER_COMMIT --oneline)
CHANGE_COUNT=$(echo "$CHANGES" | wc -l)
print_success "本次更新包含 $CHANGE_COUNT 个提交"
echo ""
echo "提交列表："
echo "$CHANGES"
echo ""

# 7. 查看文件变更
print_info "6. 查看文件变更..."
git diff --stat $BEFORE_COMMIT $AFTER_COMMIT
echo ""

# 8. 生成下载报告
print_info "7. 生成下载报告..."
cat > git-pull-report.txt << EOF
================================
Git下载报告
================================
下载时间: $(date '+%Y-%m-%d %H:%M:%S')
仓库地址: $REMOTE_URL
分支: $CURRENT_BRANCH

================================
版本变更
================================
更新前: $BEFORE_COMMIT ($BEFORE_MESSAGE)
更新后: $AFTER_COMMIT ($AFTER_MESSAGE)

================================
提交信息
================================
提交哈希: $AFTER_COMMIT
提交信息: $AFTER_MESSAGE
提交作者: $AFTER_AUTHOR
提交时间: $AFTER_DATE

================================
变更统计
================================
提交数量: $CHANGE_COUNT

变更列表：
$CHANGES

================================
文件变更
================================
$(git diff --stat $BEFORE_COMMIT $AFTER_COMMIT)

================================
================================
EOF

print_success "下载报告已生成: git-pull-report.txt"
echo ""

# 9. 生成部署信息JSON
print_info "8. 生成部署信息..."
cat > deploy-info.json << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "repository": "$REMOTE_URL",
  "branch": "$CURRENT_BRANCH",
  "before_commit": "$BEFORE_COMMIT",
  "after_commit": "$AFTER_COMMIT",
  "commit_message": "$AFTER_MESSAGE",
  "commit_author": "$AFTER_AUTHOR",
  "commit_date": "$AFTER_DATE",
  "change_count": $CHANGE_COUNT
}
EOF

print_success "部署信息已生成: deploy-info.json"
echo ""

# 10. 记录到部署日志
print_info "9. 记录到部署日志..."
mkdir -p /app/work/logs/bypass
cat >> /app/work/logs/bypass/deploy.log << EOF
================================
$(date '+%Y-%m-%d %H:%M:%S') - Git代码下载
================================
仓库: $REMOTE_URL
分支: $CURRENT_BRANCH
版本: $BEFORE_COMMIT -> $AFTER_COMMIT
提交信息: $AFTER_MESSAGE
变更数量: $CHANGE_COUNT
================================
EOF

print_success "部署日志已更新"
echo ""

# 11. 显示下一步操作
print_info "================================"
print_success "✅ 代码下载完成！"
print_info "================================"
echo ""
print_info "下一步操作："
echo ""
echo "1. 验证代码："
echo "   git log -1"
echo "   cat deploy-info.json"
echo ""
echo "2. 查看详细变更："
echo "   git show $AFTER_COMMIT --stat"
echo ""
echo "3. 部署到服务器："
echo "   bash scripts/deploy-backend.sh"
echo "   bash scripts/deploy-frontend.sh"
echo ""
echo "4. 验证部署结果："
echo "   检查服务状态"
echo "   测试功能是否正常"
echo ""
echo "5. 通知开发AI："
echo "   将部署结果写入知识库"
echo ""

# 12. 是否立即部署
read -p "是否立即部署到服务器？(y/n): " DEPLOY_NOW
if [ "$DEPLOY_NOW" = "y" ] || [ "$DEPLOY_NOW" = "Y" ]; then
    print_info "开始部署..."
    echo ""

    # 部署后端
    print_info "部署后端..."
    if [ -f "scripts/deploy-backend.sh" ]; then
        bash scripts/deploy-backend.sh
    else
        print_warning "后端部署脚本不存在: scripts/deploy-backend.sh"
    fi
    echo ""

    # 部署前端
    print_info "部署前端..."
    if [ -f "scripts/deploy-frontend.sh" ]; then
        bash scripts/deploy-frontend.sh
    else
        print_warning "前端部署脚本不存在: scripts/deploy-frontend.sh"
    fi
    echo ""

    print_success "部署完成！"
fi

echo ""
print_info "================================"
print_success "✅ Git下载流程完成！"
print_info "================================"
echo ""
